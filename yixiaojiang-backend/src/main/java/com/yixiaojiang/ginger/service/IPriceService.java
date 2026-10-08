package com.yixiaojiang.ginger.service;

import com.yixiaojiang.ginger.entity.PriceHistory;
import java.util.List;

public interface IPriceService {
    // 定义一个方法：获取最近 N 天的价格
    List<PriceHistory> getRecentPrices(int days);
}