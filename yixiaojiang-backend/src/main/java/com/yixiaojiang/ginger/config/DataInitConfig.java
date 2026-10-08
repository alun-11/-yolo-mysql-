package com.yixiaojiang.ginger.config;

import com.yixiaojiang.ginger.entity.User;
import com.yixiaojiang.ginger.service.IUserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitConfig {

    @Bean
    public CommandLineRunner initData(IUserService userService) {
        return args -> {
            // 初始化农户用户
            if (userService.getUsersByRole("farmer").isEmpty()) {
                User farmer = new User();
                farmer.setUsername("farmer");
                farmer.setPassword("123456");
                farmer.setRole("farmer");
                farmer.setRealName("测试用户");
                farmer.setPhone("13800138001");
                farmer.setAddress("山东省潍坊市");
                farmer.setCreateTime(LocalDateTime.now());
                farmer.setUpdateTime(LocalDateTime.now());
                userService.register(farmer);
                System.out.println("已创建农户用户: farmer");
            }

            // 初始化商户用户
            if (userService.getUsersByRole("merchant").isEmpty()) {
                User merchant = new User();
                merchant.setUsername("merchant");
                merchant.setPassword("123456");
                merchant.setRole("merchant");
                merchant.setRealName("李四商户");
                merchant.setPhone("13800138002");
                merchant.setAddress("北京市朝阳区");
                merchant.setCreateTime(LocalDateTime.now());
                merchant.setUpdateTime(LocalDateTime.now());
                userService.register(merchant);
                System.out.println("已创建商户用户: merchant");
            }

            // 初始化管理员用户
            if (userService.getUsersByRole("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("123456");
                admin.setRole("admin");
                admin.setRealName("管理员");
                admin.setPhone("13800138003");
                admin.setAddress("系统管理");
                admin.setCreateTime(LocalDateTime.now());
                admin.setUpdateTime(LocalDateTime.now());
                userService.register(admin);
                System.out.println("已创建管理员用户: admin");
            }
        };
    }
}