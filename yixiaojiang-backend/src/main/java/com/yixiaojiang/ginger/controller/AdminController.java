package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result;
import com.yixiaojiang.ginger.entity.Product;
import com.yixiaojiang.ginger.entity.User;
import com.yixiaojiang.ginger.service.IProductService;
import com.yixiaojiang.ginger.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private IUserService userService;

    @Autowired
    private IProductService productService;

    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 农户数量
        stats.put("farmerCount", userService.getUsersByRole("farmer").size());
        
        // 商户数量
        stats.put("merchantCount", userService.getUsersByRole("merchant").size());
        
        // 货源总数
        stats.put("productCount", productService.getAllProducts().size());
        
        // 可用货源
        stats.put("availableProductCount", productService.getAvailableProducts().size());
        
        return Result.success(stats);
    }

    @GetMapping("/dashboard")
    public Result<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        // 总直播场次
        data.put("totalLiveSessions", 156);
        
        // 总销量（斤）
        data.put("totalSales", 8950);
        
        // 总销售额（元）
        data.put("totalSalesAmount", new BigDecimal("268500.00"));
        
        // 订单数量
        data.put("orderCount", 428);
        
        // 近7天销量数据（模拟）
        List<Map<String, Object>> weeklySales = new ArrayList<>();
        String[] days = {"周一", "周二", "周三", "周四", "周五", "周六", "周日"};
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", days[i]);
            dayData.put("sales", 800 + (int)(Math.random() * 500));
            dayData.put("amount", new BigDecimal(String.valueOf(24000 + (int)(Math.random() * 15000))));
            weeklySales.add(dayData);
        }
        data.put("weeklySales", weeklySales);
        
        // 货源销售排行（模拟）
        List<Map<String, Object>> productRanking = new ArrayList<>();
        String[] origins = {"山东潍坊", "云南文山", "贵州安顺", "四川成都", "湖南郴州"};
        for (int i = 0; i < origins.length; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("origin", origins[i]);
            item.put("sales", 800 + (int)(Math.random() * 1200));
            item.put("rank", i + 1);
            productRanking.add(item);
        }
        // 按销量排序
        productRanking.sort((a, b) -> (Integer) b.get("sales") - (Integer) a.get("sales"));
        data.put("productRanking", productRanking);
        
        return Result.success(data);
    }

    @GetMapping("/users")
    public Result<Map<String, Object>> getUserStats() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("farmers", userService.getUsersByRole("farmer"));
        data.put("merchants", userService.getUsersByRole("merchant"));
        data.put("admins", userService.getUsersByRole("admin"));
        
        return Result.success(data);
    }

    @GetMapping("/products")
    public Result<Map<String, Object>> getProductStats() {
        Map<String, Object> data = new HashMap<>();
        
        List<Product> allProducts = productService.getAllProducts();
        data.put("products", allProducts);
        data.put("total", allProducts.size());
        data.put("available", productService.getAvailableProducts().size());
        data.put("sold", allProducts.stream().filter(p -> "sold".equals(p.getStatus())).count());
        
        return Result.success(data);
    }
}