package com.yixiaojiang.ginger.constant;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 溯源节点类型常量（多地区节点流转）：
 * 云南罗平产地 → 产地预冷集散 → AI质检分级 → 跨省冷链运输 → 销地入库
 */
public class TraceNodeConstants {

    /** 节点状态：正常 */
    public static final String STATUS_ACTIVE = "active";
    /** 节点状态：已修正（原节点保留留痕，不可覆盖） */
    public static final String STATUS_CORRECTED = "corrected";

    /** 1. 农户发布与采收 */
    public static final String FARMER_HARVEST = "FARMER_HARVEST";
    /** 2. 产地预冷与集散 */
    public static final String LOCAL_COLLECTION = "LOCAL_COLLECTION";
    /** 3. AI质检与分级 */
    public static final String AI_INSPECTION = "AI_INSPECTION";
    /** 4. 跨省冷链运输 */
    public static final String COLD_CHAIN_LOGISTICS = "COLD_CHAIN_LOGISTICS";
    /** 5. 销地入库 */
    public static final String DESTINATION_STORAGE = "DESTINATION_STORAGE";
    /** 6. 信息更正记录（区块链留痕修改） */
    public static final String INFO_CORRECTION = "INFO_CORRECTION";

    /** 节点类型 → 中文环节名 */
    public static final Map<String, String> NODE_NAMES = new LinkedHashMap<>();
    static {
        NODE_NAMES.put(FARMER_HARVEST, "农户发布与采收");
        NODE_NAMES.put(LOCAL_COLLECTION, "产地预冷与集散");
        NODE_NAMES.put(AI_INSPECTION, "AI质检与分级");
        NODE_NAMES.put(COLD_CHAIN_LOGISTICS, "跨省冷链运输");
        NODE_NAMES.put(DESTINATION_STORAGE, "销地入库");
        NODE_NAMES.put(INFO_CORRECTION, "信息更正记录");
    }

    /**
     * 各节点类型的默认 JSON 数据结构示例（desc 描述 + detail 键值对）。
     * 体现“多地区节点流转”：云南罗平产地 → 昆明方向集散 → AI质检 → 云南→广东跨省冷链 → 广州销地仓。
     */
    public static Map<String, Object> defaultData(String nodeType) {
        Map<String, Object> data = new LinkedHashMap<>();
        Map<String, Object> detail = new LinkedHashMap<>();
        switch (nodeType) {
            case FARMER_HARVEST:
                data.put("desc", "农户在罗平小黄姜种植基地完成人工采收，当日通过平台发布货源，批次信息同步上链。");
                detail.put("农户姓名", "李建国");
                detail.put("种植基地", "云南省曲靖市罗平县板桥镇小黄姜基地");
                detail.put("采收日期", "2026-08-20");
                detail.put("采收方式", "人工采挖");
                detail.put("批次净重", "500 公斤");
                detail.put("发布时间", "2026-08-20 16:30");
                break;
            case LOCAL_COLLECTION:
                data.put("desc", "采收后2小时内送入罗平县产地预冷集散中心，强制预冷去除田间热，完成分级分拣与集散装车。");
                detail.put("集散中心", "罗平县农产品产地预冷集散中心");
                detail.put("所在地", "云南省曲靖市罗平县");
                detail.put("预冷温度", "12℃");
                detail.put("预冷时长", "6 小时");
                detail.put("分拣批次号", "LP-20260821-03");
                detail.put("集散时间", "2026-08-21 08:00");
                break;
            case AI_INSPECTION:
                data.put("desc", "AI视觉质检流水线逐筐检测病虫害与品相，YOLOv11-Ginger 模型自动识别并完成品级分选。");
                detail.put("质检机构", "壹小姜AI质检中心（罗平站）");
                detail.put("AI模型", "YOLOv11n-Ginger v2.3");
                detail.put("检测项目", "姜瘟病/叶枯病/腐烂/品级分选");
                detail.put("抽检合格率", "98.6%");
                detail.put("判定等级", "A级");
                detail.put("质检时间", "2026-08-21 14:00");
                break;
            case COLD_CHAIN_LOGISTICS:
                data.put("desc", "A级姜装入冷藏集装箱，由云南罗平发往广东广州，全程 GPS 定位 + 温控实时监控，跨省冷链不断链。");
                detail.put("物流单号", "SFYL20260822088");
                detail.put("承运方", "顺丰冷链 · 云贵粤专线");
                detail.put("出发地", "云南省曲靖市罗平县");
                detail.put("目的地", "广东省广州市江南果菜批发市场");
                detail.put("冷链温度", "13℃");
                detail.put("车厢湿度", "85%");
                detail.put("发运时间", "2026-08-22 06:00");
                detail.put("预计到达", "2026-08-24 10:00");
                break;
            case DESTINATION_STORAGE:
                data.put("desc", "冷链车抵达广州销地仓，验收温度与品相无误后入库恒温仓，等待向周边商户分销。");
                detail.put("销地仓库", "广州江南市场冷链仓储中心 2号库");
                detail.put("所在地", "广东省广州市白云区");
                detail.put("入库温度", "13℃");
                detail.put("验收结果", "合格 · 全程温度达标");
                detail.put("经手商户", "广州鲜达农产品有限公司");
                detail.put("入库时间", "2026-08-24 10:30");
                break;
            default:
                data.put("desc", "");
        }
        data.put("detail", detail);
        return data;
    }
}
