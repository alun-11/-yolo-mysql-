package com.yixiaojiang.ginger.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yixiaojiang.ginger.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}