package com.yixiaojiang.ginger.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yixiaojiang.ginger.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}