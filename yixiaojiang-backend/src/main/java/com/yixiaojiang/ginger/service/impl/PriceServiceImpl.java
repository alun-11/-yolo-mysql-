package com.yixiaojiang.ginger.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yixiaojiang.ginger.entity.PriceHistory;
import com.yixiaojiang.ginger.mapper.PriceMapper;
import com.yixiaojiang.ginger.service.IPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // 标记这是一个 Service Bean
public class PriceServiceImpl implements IPriceService {

    @Autowired // 自动注入 Mapper
    private PriceMapper priceMapper;

    @Override
    public List<PriceHistory> getRecentPrices(int days) {
        // 构建查询条件：按日期倒序，限制条数
        QueryWrapper<PriceHistory> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("date").last("LIMIT " + days);

        // 调用 Mapper 查询数据库
        return priceMapper.selectList(wrapper);
    }
}