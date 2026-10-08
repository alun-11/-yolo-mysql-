package com.yixiaojiang.ginger.service;

import com.yixiaojiang.ginger.entity.User;
import java.util.List;

public interface IUserService {
    
    User login(String username, String password);
    
    User register(User user);
    
    User getUserById(Long id);
    
    List<User> getUsersByRole(String role);
    
    boolean updateUser(User user);
    
    boolean deleteUser(Long id);
}