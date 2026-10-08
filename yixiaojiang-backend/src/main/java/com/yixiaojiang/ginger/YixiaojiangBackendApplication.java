package com.yixiaojiang.ginger;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yixiaojiang.ginger.mapper") // 扫描 Mapper 接口
public class YixiaojiangBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(YixiaojiangBackendApplication.class, args);
    }
}