package com.yixiaojiang.ginger.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 标记这是一个控制器，返回 JSON 数据
@RequestMapping("/api/test") // 统一前缀
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, YiXiaoJiang! Spring Boot is running.";
    }
}