package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result;
import com.yixiaojiang.ginger.entity.Product;
import com.yixiaojiang.ginger.service.ITraceabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 农产品溯源系统接口：
 * 1. 溯源码自动生成（YXJ-2026-{productId}-{hash6}）
 * 2. 5 环节信息记录（产地种植/采收日期/AI质检/恒温仓储/物流单号）
 * 3. 区块链存证（简化版哈希链）
 * 4. 多角色查询（农户端 / 商户端 / 公共匿名查询）
 */
@RestController
@RequestMapping("/api/v1/traceability")
@CrossOrigin
public class TraceabilityController {

    @Autowired
    private ITraceabilityService traceabilityService;

    /** 货源同步 + 生成溯源（幂等）：农户端/商户端对指定货源调用，返回完整溯源链 */
    @PostMapping("/sync")
    public Result<Map<String, Object>> syncAndGenerate(@RequestBody Product payload) {
        try {
            return Result.success(traceabilityService.syncAndGenerate(payload));
        } catch (Exception e) {
            return Result.fail("生成溯源失败: " + e.getMessage());
        }
    }

    /** 公共查询：任何人凭溯源码查询（无需登录），手机扫码走此接口 */
    @GetMapping("/code/{code}")
    public Result<Map<String, Object>> getByCode(@PathVariable String code) {
        Map<String, Object> data = traceabilityService.getByCode(code);
        if (data == null) {
            return Result.fail("未查询到该溯源码对应的溯源信息");
        }
        return Result.success(data);
    }

    /** 农户端：查询自己名下全部溯源记录 */
    @GetMapping("/farmer/{farmerId}")
    public Result<List<Map<String, Object>>> getByFarmer(@PathVariable Long farmerId) {
        return Result.success(traceabilityService.getByFarmer(farmerId));
    }

    /** 按货源ID查询溯源记录（未生成返回空 data） */
    @GetMapping("/product/{productId}")
    public Result<Map<String, Object>> getByProductId(@PathVariable Long productId) {
        return Result.success(traceabilityService.getByProductId(productId));
    }

    /** 示例溯源码：取库中最新的几个真实码供溯源页快捷示例 */
    @GetMapping("/samples")
    public Result<List<String>> getSampleCodes() {
        return Result.success(traceabilityService.getSampleCodes());
    }

    /**
     * 区块链留痕修改：原节点标记 corrected 并追加 INFO_CORRECTION 更正记录。
     * 入参：nodeId（节点ID）、newData（新字段键值对）、reason（修改原因，必填）
     */
    @PostMapping("/updateNode")
    @SuppressWarnings("unchecked")
    public Result<Map<String, Object>> updateNode(@RequestBody Map<String, Object> body) {
        try {
            Object nodeIdObj = body.get("nodeId");
            if (nodeIdObj == null) {
                return Result.fail("nodeId 不能为空");
            }
            Long nodeId = Long.valueOf(String.valueOf(nodeIdObj));
            String reason = body.get("reason") == null ? null : String.valueOf(body.get("reason"));
            Map<String, Object> newData = body.get("newData") instanceof Map
                    ? (Map<String, Object>) body.get("newData") : null;
            return Result.success(traceabilityService.updateNode(nodeId, newData, reason));
        } catch (Exception e) {
            return Result.fail("节点更正失败: " + e.getMessage());
        }
    }

    /** 初始化演示数据：溯源码 YXJ-26-001-A3F8B2（5 节点多地区流转，幂等） */
    @PostMapping("/demo/init")
    public Result<Map<String, Object>> initDemo() {
        try {
            return Result.success(traceabilityService.initDemoTraceIfAbsent());
        } catch (Exception e) {
            return Result.fail("演示数据初始化失败: " + e.getMessage());
        }
    }
}
