package com.yixiaojiang.ginger.service;

import com.yixiaojiang.ginger.entity.Product;

import java.util.List;
import java.util.Map;

public interface ITraceabilityService {

    /**
     * 同步货源信息并生成溯源（幂等）：
     * 货源不存在则入库，无溯源记录则生成溯源码 + 5环节哈希链存证。
     * 返回 { info: {...}, nodes: [...] }
     */
    Map<String, Object> syncAndGenerate(Product payload);

    /** 公共查询：按溯源码查询完整溯源链，查不到返回 null */
    Map<String, Object> getByCode(String code);

    /** 农户端：按农户ID查询其全部溯源记录 */
    List<Map<String, Object>> getByFarmer(Long farmerId);

    /** 按货源ID查询溯源（不存在返回 null） */
    Map<String, Object> getByProductId(Long productId);

    /** 示例溯源码（取库中最新的几个真实码） */
    List<String> getSampleCodes();

    /**
     * 区块链留痕修改：原节点标记为 corrected（不覆盖原数据），
     * 自动追加一条 INFO_CORRECTION 信息更正记录（含原值/新值/原因），并接入哈希链。
     * 返回更正后的完整溯源链。
     */
    Map<String, Object> updateNode(Long nodeId, Map<String, Object> newData, String reason);

    /** 演示数据初始化：溯源码 YXJ-26-001-A3F8B2 的 5 节点多地区流转数据（已存在则直接返回） */
    Map<String, Object> initDemoTraceIfAbsent();
}
