package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result;
import com.yixiaojiang.ginger.entity.User;
import com.yixiaojiang.ginger.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public Result<User> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());
        if (user != null) {
            return Result.success(user);
        }
        return Result.fail("用户名或密码错误");
    }

    @PostMapping("/register")
    public Result<User> register(@RequestBody User user) {
        User existing = userService.login(user.getUsername(), user.getPassword());
        if (existing != null) {
            return Result.fail("用户名已存在");
        }
        User newUser = userService.register(user);
        return Result.success(newUser);
    }

    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return Result.success(user);
        }
        return Result.fail("用户不存在");
    }

    @GetMapping("/role/{role}")
    public Result<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return Result.success(users);
    }

    @PutMapping
    public Result<String> updateUser(@RequestBody User user) {
        boolean success = userService.updateUser(user);
        if (success) {
            return Result.success("更新成功");
        }
        return Result.fail("更新失败");
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        boolean success = userService.deleteUser(id);
        if (success) {
            return Result.success("删除成功");
        }
        return Result.fail("删除失败");
    }

    @GetMapping("/list")
    public Result<List<User>> getAllUsers() {
        List<User> farmers = userService.getUsersByRole("farmer");
        List<User> merchants = userService.getUsersByRole("merchant");
        List<User> admins = userService.getUsersByRole("admin");
        List<User> allUsers = new java.util.ArrayList<>();
        allUsers.addAll(farmers);
        allUsers.addAll(merchants);
        allUsers.addAll(admins);
        return Result.success(allUsers);
    }
}

class LoginRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}