package com.yixiaojiang.ginger.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yixiaojiang.ginger.entity.PriceHistory;
import org.apache.ibatis.annotations.Mapper;


public interface PriceMapper extends BaseMapper<PriceHistory> {
    // 继承 BaseMapper 后，自动拥有 CRUD 方法，无需写任何代码
}