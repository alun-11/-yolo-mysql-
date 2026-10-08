package com.yixiaojiang.ginger.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yixiaojiang.ginger.constant.TraceNodeConstants;
import com.yixiaojiang.ginger.entity.Product;
import com.yixiaojiang.ginger.entity.TraceabilityInfo;
import com.yixiaojiang.ginger.entity.TraceabilityNode;
import com.yixiaojiang.ginger.mapper.ProductMapper;
import com.yixiaojiang.ginger.mapper.TraceabilityInfoMapper;
import com.yixiaojiang.ginger.mapper.TraceabilityNodeMapper;
import com.yixiaojiang.ginger.service.ITraceabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TraceabilityServiceImpl extends ServiceImpl<TraceabilityInfoMapper, TraceabilityInfo>
        implements ITraceabilityService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private TraceabilityNodeMapper nodeMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /** 演示溯源码 */
    private static final String DEMO_CODE = "YXJ-26-001-A3F8B2";

    // ============ 对外能力 ============

    @Override
    public Map<String, Object> syncAndGenerate(Product payload) {
        Product product = upsertProduct(payload);
        TraceabilityInfo info = ensureTrace(product);
        return assembleTrace(info);
    }

    @Override
    public Map<String, Object> getByCode(String code) {
        TraceabilityInfo info = this.getOne(
                new QueryWrapper<TraceabilityInfo>().eq("traceability_code", code));
        return info == null ? null : assembleTrace(info);
    }

    @Override
    public List<Map<String, Object>> getByFarmer(Long farmerId) {
        List<TraceabilityInfo> list = this.list(
                new QueryWrapper<TraceabilityInfo>().eq("farmer_id", farmerId).orderByDesc("id"));
        List<Map<String, Object>> result = new ArrayList<>();
        for (TraceabilityInfo info : list) {
            result.add(assembleTrace(info));
        }
        return result;
    }

    @Override
    public Map<String, Object> getByProductId(Long productId) {
        TraceabilityInfo info = this.getOne(
                new QueryWrapper<TraceabilityInfo>().eq("product_id", productId));
        return info == null ? null : assembleTrace(info);
    }

    @Override
    public List<String> getSampleCodes() {
        List<TraceabilityInfo> list = this.list(
                new QueryWrapper<TraceabilityInfo>().orderByDesc("id").last("LIMIT 3"));
        List<String> codes = new ArrayList<>();
        for (TraceabilityInfo info : list) {
            codes.add(info.getTraceabilityCode());
        }
        return codes;
    }

    /**
     * 区块链留痕修改（核心）：
     * 1. 原节点 status 置为 corrected（原数据完整保留，不覆盖）；
     * 2. 追加一条 INFO_CORRECTION 节点，记录字段级原值/新值/修改原因，并接入哈希链末端；
     * 3. 返回更正后的完整溯源链。
     */
    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> updateNode(Long nodeId, Map<String, Object> newData, String reason) {
        TraceabilityNode original = nodeMapper.selectById(nodeId);
        if (original == null) {
            throw new IllegalArgumentException("节点不存在: " + nodeId);
        }
        if (TraceNodeConstants.INFO_CORRECTION.equals(original.getNodeType())) {
            throw new IllegalArgumentException("信息更正记录为链上留痕凭证，不可再修改");
        }
        if (TraceNodeConstants.STATUS_CORRECTED.equals(original.getStatus())) {
            throw new IllegalArgumentException("该节点已被修正留痕，不能重复修正");
        }
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("修改原因必填");
        }

        // 解析原节点数据
        Map<String, Object> oldMap = parseJsonMap(original.getNodeData());
        Map<String, Object> oldDetail = oldMap.get("detail") instanceof Map
                ? (Map<String, Object>) oldMap.get("detail") : new LinkedHashMap<>();

        // 字段级 diff：仅记录实际发生变化的字段
        List<Map<String, Object>> changes = new ArrayList<>();
        if (newData != null) {
            for (Map.Entry<String, Object> e : newData.entrySet()) {
                String key = e.getKey();
                if (key == null || key.isEmpty()) continue;
                String newVal = e.getValue() == null ? "" : String.valueOf(e.getValue()).trim();
                if (newVal.isEmpty()) continue;
                Object oldVal = oldDetail.get(key);
                if (oldVal == null || !String.valueOf(oldVal).equals(newVal)) {
                    Map<String, Object> ch = new LinkedHashMap<>();
                    ch.put("field", key);
                    ch.put("oldValue", oldVal == null ? "（原无记录）" : String.valueOf(oldVal));
                    ch.put("newValue", newVal);
                    changes.add(ch);
                }
            }
        }
        if (changes.isEmpty()) {
            throw new IllegalArgumentException("未检测到字段变更，无需上链");
        }

        // 1. 原节点标记为已修正（数据保留）
        original.setStatus(TraceNodeConstants.STATUS_CORRECTED);
        nodeMapper.updateById(original);

        // 2. 追加更正记录，接入哈希链末端
        TraceabilityNode last = nodeMapper.selectOne(
                new QueryWrapper<TraceabilityNode>()
                        .eq("trace_id", original.getTraceId())
                        .orderByDesc("id").last("LIMIT 1"));
        String prevHash = last != null ? last.getNodeHash() : sha256("GENESIS");
        long blockHeight = (last != null && last.getBlockHeight() != null
                ? last.getBlockHeight() : 1524000L) + 17;
        // 截断到秒：MySQL DATETIME 不存纳秒，保证回读后哈希链重算一致
        LocalDateTime now = LocalDateTime.now().withNano(0);

        Map<String, Object> corrData = new LinkedHashMap<>();
        corrData.put("desc", "信息更正：原「" + original.getNodeName() + "」节点存在录入误差，"
                + "已按实际情况更正，原记录保留留痕，本次更正全程链上存证、不可篡改。");
        Map<String, Object> corrDetail = new LinkedHashMap<>();
        corrDetail.put("更正原因", reason);
        corrDetail.put("更正时间", now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        for (Map<String, Object> ch : changes) {
            corrDetail.put(String.valueOf(ch.get("field")),
                    ch.get("oldValue") + " → " + ch.get("newValue"));
        }
        corrData.put("detail", corrDetail);
        Map<String, Object> correction = new LinkedHashMap<>();
        correction.put("originalNodeId", original.getId());
        correction.put("originalNodeName", original.getNodeName());
        correction.put("reason", reason);
        correction.put("changes", changes);
        corrData.put("correction", correction);
        String dataJson = toJson(corrData);

        String nodeHash = sha256(prevHash + "|" + TraceNodeConstants.INFO_CORRECTION + "|"
                + dataJson + "|" + now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        TraceabilityNode corrNode = new TraceabilityNode();
        corrNode.setTraceId(original.getTraceId());
        corrNode.setNodeType(TraceNodeConstants.INFO_CORRECTION);
        corrNode.setNodeName(TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.INFO_CORRECTION));
        corrNode.setNodeData(dataJson);
        corrNode.setNodeTime(now);
        corrNode.setPrevHash(prevHash);
        corrNode.setNodeHash(nodeHash);
        corrNode.setBlockHeight(blockHeight);
        corrNode.setStatus(TraceNodeConstants.STATUS_ACTIVE);
        corrNode.setCreateTime(now);
        nodeMapper.insert(corrNode);

        TraceabilityInfo info = this.getById(original.getTraceId());
        return assembleTrace(info);
    }

    /** 演示数据：固定溯源码 YXJ-26-001-A3F8B2，5 节点多地区流转（罗平→广州） */
    @Override
    public Map<String, Object> initDemoTraceIfAbsent() {
        TraceabilityInfo exist = this.getOne(
                new QueryWrapper<TraceabilityInfo>().eq("traceability_code", DEMO_CODE));
        if (exist != null) {
            Map<String, Object> assembled = assembleTrace(exist);
            // 链校验通过则保持不动；若为历史损坏数据则自愈重建
            if (Boolean.TRUE.equals(assembled.get("chainValid"))) {
                return assembled;
            }
            nodeMapper.delete(new QueryWrapper<TraceabilityNode>().eq("trace_id", exist.getId()));
            this.removeById(exist.getId());
        }
        Product demo = null;
        if (exist != null) {
            demo = productMapper.selectById(exist.getProductId());
        }
        if (demo == null) {
            demo = new Product();
            demo.setFarmerId(1L);
            demo.setFarmerName("李建国");
            demo.setOrigin("云南省曲靖市罗平县板桥镇");
            demo.setWeight(new BigDecimal("1000"));   // 斤
            demo.setPrice(new BigDecimal("4.80"));
            demo.setHarvestDate(LocalDate.of(2026, 8, 20));
            demo.setGrade("A");
            demo.setStatus("available");
            demo.setCreateTime(LocalDateTime.now());
            demo.setUpdateTime(LocalDateTime.now());
            productMapper.insert(demo);
        }
        TraceabilityInfo info = persistTrace(demo, DEMO_CODE, 1524100L);
        return assembleTrace(info);
    }

    // ============ 内部逻辑 ============

    /** 货源同步：不存在则入库，存在则用最新提交信息刷新关键字段 */
    private Product upsertProduct(Product payload) {
        if (payload.getId() == null) {
            throw new IllegalArgumentException("货源ID不能为空");
        }
        Product exist = productMapper.selectById(payload.getId());
        if (exist == null) {
            payload.setCreateTime(LocalDateTime.now());
            payload.setUpdateTime(LocalDateTime.now());
            if (payload.getStatus() == null || payload.getStatus().isEmpty()) {
                payload.setStatus("available");
            }
            productMapper.insert(payload);
            return payload;
        }
        // 同步可变字段（前端为数据源）
        if (payload.getOrigin() != null) exist.setOrigin(payload.getOrigin());
        if (payload.getFarmerName() != null) exist.setFarmerName(payload.getFarmerName());
        if (payload.getGrade() != null) exist.setGrade(payload.getGrade());
        if (payload.getWeight() != null) exist.setWeight(payload.getWeight());
        if (payload.getPrice() != null) exist.setPrice(payload.getPrice());
        if (payload.getHarvestDate() != null) exist.setHarvestDate(payload.getHarvestDate());
        if (payload.getStatus() != null) exist.setStatus(payload.getStatus());
        exist.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(exist);
        return exist;
    }

    /** 幂等生成溯源记录 + 5环节哈希链 */
    private TraceabilityInfo ensureTrace(Product product) {
        TraceabilityInfo exist = this.getOne(
                new QueryWrapper<TraceabilityInfo>().eq("product_id", product.getId()));
        if (exist != null) {
            return exist;
        }
        return createTrace(product);
    }

    private TraceabilityInfo createTrace(Product product) {
        String origin = product.getOrigin() != null ? product.getOrigin() : "云南省曲靖市罗平县";
        BigDecimal weightKg = product.getWeight() != null
                ? product.getWeight().divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP)
                : new BigDecimal("25.00");
        LocalDate harvestDate = product.getHarvestDate() != null
                ? product.getHarvestDate() : LocalDate.now().minusDays(3);

        // 溯源码：YXJ-2026-{productId}-{hash6}
        String seedHash = sha256(product.getId() + "|" + origin + "|" + weightKg + "|" + harvestDate);
        String code = String.format("YXJ-2026-%03d-%s",
                product.getId(), seedHash.substring(0, 6).toUpperCase());

        long blockBase = 1524000 + product.getId() * 137
                + (Long.parseLong(seedHash.substring(0, 4), 16) % 500);
        return persistTrace(product, code, blockBase);
    }

    /** 落库溯源主记录 + 5 环节哈希链节点 */
    private TraceabilityInfo persistTrace(Product product, String code, long blockBase) {
        String farmerName = product.getFarmerName() != null ? product.getFarmerName() : "农户";
        String productName = "罗平小黄姜（" + farmerName + "）";
        String origin = product.getOrigin() != null ? product.getOrigin() : "云南省曲靖市罗平县";
        String grade = product.getGrade() != null ? product.getGrade() : "A级";
        BigDecimal weightKg = product.getWeight() != null
                ? product.getWeight().divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP)
                : new BigDecimal("500.00");
        LocalDate harvestDate = product.getHarvestDate() != null
                ? product.getHarvestDate() : LocalDate.of(2026, 8, 20);

        String seedHash = sha256(code + "|ROOT");
        TraceabilityInfo info = new TraceabilityInfo();
        info.setTraceabilityCode(code);
        info.setProductId(product.getId());
        info.setFarmerId(product.getFarmerId() != null ? product.getFarmerId() : 1L);
        info.setProductName(productName);
        info.setOrigin(origin);
        info.setGrade(grade);
        info.setWeight(weightKg);
        info.setBlockHeight(blockBase);
        info.setTxHash("0x" + seedHash);
        info.setCreateTime(LocalDateTime.now());
        this.save(info);

        // 5 环节（多地区流转） + 哈希链
        String genesis = sha256(code + "|GENESIS");
        String prevHash = genesis;
        List<NodeDraft> drafts = buildNodeDrafts(farmerName, origin, grade, weightKg, harvestDate, blockBase);
        for (NodeDraft draft : drafts) {
            String timeStr = draft.time.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            String nodeHash = sha256(prevHash + "|" + draft.type + "|" + draft.data + "|" + timeStr);
            TraceabilityNode node = new TraceabilityNode();
            node.setTraceId(info.getId());
            node.setNodeType(draft.type);
            node.setNodeName(draft.name);
            node.setNodeData(draft.data);
            node.setNodeTime(draft.time);
            node.setPrevHash(prevHash);
            node.setNodeHash(nodeHash);
            node.setBlockHeight(draft.blockHeight);
            node.setStatus(TraceNodeConstants.STATUS_ACTIVE);
            node.setCreateTime(LocalDateTime.now());
            nodeMapper.insert(node);
            prevHash = nodeHash;
        }
        return info;
    }

    /**
     * 5 个标准环节（多地区节点流转）：
     * 罗平产地采收 → 罗平产地预冷集散 → AI质检分级 → 跨省冷链（云南→广东） → 广州销地入库
     */
    private List<NodeDraft> buildNodeDrafts(String farmerName, String origin, String grade,
                                            BigDecimal weightKg, LocalDate harvestDate, long blockBase) {
        List<NodeDraft> drafts = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // 1. 农户发布与采收
        Map<String, Object> n1 = TraceNodeConstants.defaultData(TraceNodeConstants.FARMER_HARVEST);
        Map<String, Object> d1 = detailOf(n1);
        d1.put("农户姓名", farmerName);
        d1.put("种植基地", origin + "小黄姜基地");
        d1.put("采收日期", harvestDate.toString());
        d1.put("批次净重", weightKg + " 公斤（" + weightKg.multiply(new BigDecimal("2")) + " 斤）");
        d1.put("发布时间", harvestDate.atTime(16, 30).format(dtf));
        n1.put("desc", "农户「" + farmerName + "」在" + origin + "小黄姜基地完成人工采收，"
                + "当日通过壹小姜平台发布货源，批次信息同步上链。");
        drafts.add(draft(TraceNodeConstants.FARMER_HARVEST,
                TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.FARMER_HARVEST),
                n1, harvestDate.atTime(16, 30), blockBase + 11));

        // 2. 产地预冷与集散
        Map<String, Object> n2 = TraceNodeConstants.defaultData(TraceNodeConstants.LOCAL_COLLECTION);
        Map<String, Object> d2 = detailOf(n2);
        d2.put("分拣批次号", "LP-" + harvestDate.plusDays(1).toString().replace("-", "") + "-03");
        d2.put("集散时间", harvestDate.plusDays(1).atTime(8, 0).format(dtf));
        drafts.add(draft(TraceNodeConstants.LOCAL_COLLECTION,
                TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.LOCAL_COLLECTION),
                n2, harvestDate.plusDays(1).atTime(8, 0), blockBase + 37));

        // 3. AI质检与分级
        Map<String, Object> n3 = TraceNodeConstants.defaultData(TraceNodeConstants.AI_INSPECTION);
        Map<String, Object> d3 = detailOf(n3);
        d3.put("判定等级", grade + "级");
        d3.put("质检时间", harvestDate.plusDays(1).atTime(14, 0).format(dtf));
        n3.put("desc", "AI视觉质检流水线逐筐检测：无姜瘟病、无叶枯病、无腐烂，"
                + "YOLOv11-Ginger 模型综合判定品级为" + grade + "级。");
        drafts.add(draft(TraceNodeConstants.AI_INSPECTION,
                TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.AI_INSPECTION),
                n3, harvestDate.plusDays(1).atTime(14, 0), blockBase + 67));

        // 4. 跨省冷链运输（云南罗平 → 广东广州）
        Map<String, Object> n4 = TraceNodeConstants.defaultData(TraceNodeConstants.COLD_CHAIN_LOGISTICS);
        Map<String, Object> d4 = detailOf(n4);
        String waybill = "SFYL" + harvestDate.toString().replace("-", "") + "088";
        d4.put("物流单号", waybill);
        d4.put("出发地", origin);
        d4.put("发运时间", harvestDate.plusDays(2).atTime(6, 0).format(dtf));
        d4.put("预计到达", harvestDate.plusDays(4).atTime(10, 0).format(dtf));
        n4.put("desc", "「" + grade + "级」姜装入冷藏集装箱，由云南罗平发往广东广州，"
                + "全程 GPS 定位 + 温控实时监控，物流单号 " + waybill + "。");
        drafts.add(draft(TraceNodeConstants.COLD_CHAIN_LOGISTICS,
                TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.COLD_CHAIN_LOGISTICS),
                n4, harvestDate.plusDays(2).atTime(6, 0), blockBase + 131));

        // 5. 销地入库（广州）
        Map<String, Object> n5 = TraceNodeConstants.defaultData(TraceNodeConstants.DESTINATION_STORAGE);
        Map<String, Object> d5 = detailOf(n5);
        d5.put("入库时间", harvestDate.plusDays(4).atTime(10, 30).format(dtf));
        drafts.add(draft(TraceNodeConstants.DESTINATION_STORAGE,
                TraceNodeConstants.NODE_NAMES.get(TraceNodeConstants.DESTINATION_STORAGE),
                n5, harvestDate.plusDays(4).atTime(10, 30), blockBase + 199));

        return drafts;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> detailOf(Map<String, Object> data) {
        Object detail = data.get("detail");
        if (detail instanceof Map) return (Map<String, Object>) detail;
        Map<String, Object> m = new LinkedHashMap<>();
        data.put("detail", m);
        return m;
    }

    private NodeDraft draft(String type, String name, Map<String, Object> dataMap,
                            LocalDateTime time, long blockHeight) {
        NodeDraft d = new NodeDraft();
        d.type = type;
        d.name = name;
        d.data = toJson(dataMap);
        d.time = time;
        d.blockHeight = blockHeight;
        return d;
    }

    /** 组装返回结构（info + 按创建时间排序的 nodes，更正记录自然排在原节点之后） */
    @SuppressWarnings("unchecked")
    private Map<String, Object> assembleTrace(TraceabilityInfo info) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", info.getId());
        result.put("code", info.getTraceabilityCode());
        result.put("productId", info.getProductId());
        result.put("farmerId", info.getFarmerId());
        result.put("productName", info.getProductName());
        result.put("origin", info.getOrigin());
        result.put("grade", info.getGrade());
        result.put("weightKg", info.getWeight());
        result.put("blockHeight", info.getBlockHeight());
        result.put("txHash", info.getTxHash());
        result.put("createTime", info.getCreateTime() == null ? null
                : info.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        result.put("weightJin", info.getWeight() == null ? null
                : info.getWeight().multiply(new BigDecimal("2")));

        List<TraceabilityNode> list = nodeMapper.selectList(
                new QueryWrapper<TraceabilityNode>()
                        .eq("trace_id", info.getId())
                        .orderByAsc("create_time").orderByAsc("id"));

        List<Map<String, Object>> nodes = new ArrayList<>();
        for (TraceabilityNode node : list) {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id", node.getId());
            n.put("nodeType", node.getNodeType());
            n.put("title", node.getNodeName());
            n.put("status", node.getStatus() == null ? TraceNodeConstants.STATUS_ACTIVE : node.getStatus());
            n.put("time", node.getNodeTime() == null ? null
                    : node.getNodeTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            n.put("prevHash", node.getPrevHash());
            n.put("txHash", "0x" + node.getNodeHash());
            n.put("blockHeight", node.getBlockHeight());
            Map<String, Object> data = parseJsonMap(node.getNodeData());
            n.put("desc", data.get("desc"));
            n.put("detail", data.get("detail") instanceof Map ? data.get("detail") : new HashMap<>());
            // 更正节点：附带字段级修改留痕
            if (TraceNodeConstants.INFO_CORRECTION.equals(node.getNodeType()) && data.get("correction") != null) {
                n.put("correction", data.get("correction"));
            }
            nodes.add(n);
        }
        result.put("nodes", nodes);
        result.put("chainValid", verifyChain(list));
        return result;
    }

    /** 校验哈希链完整性：逐节点重算 node_hash 是否与存储一致 */
    private boolean verifyChain(List<TraceabilityNode> list) {
        String expectedPrev = sha256("GENESIS");
        for (int i = 0; i < list.size(); i++) {
            TraceabilityNode node = list.get(i);
            if (i > 0 && !expectedPrev.equals(node.getPrevHash())) {
                return false;
            }
            String recalculated = sha256(node.getPrevHash() + "|" + node.getNodeType() + "|"
                    + node.getNodeData() + "|" + (node.getNodeTime() == null ? ""
                    : node.getNodeTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
            if (!recalculated.equals(node.getNodeHash())) {
                return false;
            }
            expectedPrev = node.getNodeHash();
        }
        return !list.isEmpty();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonMap(String json) {
        if (json == null || json.isEmpty()) return new LinkedHashMap<>();
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            return new LinkedHashMap<>();
        }
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 计算失败", e);
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }

    private static class NodeDraft {
        String type;
        String name;
        String data;
        LocalDateTime time;
        long blockHeight;
    }
}
