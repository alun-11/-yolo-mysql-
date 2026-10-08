package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result; // 确保你之前创建了 Result.java
import com.yixiaojiang.ginger.entity.PriceHistory;
import com.yixiaojiang.ginger.service.IPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 标记这是一个控制器，返回 JSON
@RequestMapping("/api/v1/price") // 统一路径前缀
public class PriceController {

    @Autowired // 自动注入 Service
    private IPriceService priceService;

    @GetMapping("/history") // 完整路径: /api/v1/price/history
    public Result<List<PriceHistory>> getHistory(@RequestParam(defaultValue = "7") int days) {
        // 调用 Service 获取数据
        List<PriceHistory> prices = priceService.getRecentPrices(days);
        // 返回统一格式结果
        return Result.success(prices);
    }
}