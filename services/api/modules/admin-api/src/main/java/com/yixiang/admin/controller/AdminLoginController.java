package com.yixiang.admin.controller;

import com.yixiang.common.annotation.Log;
import com.yixiang.common.core.Result;
import com.yixiang.framework.security.JwtUtils;
import com.yixiang.system.domain.LoginRequest;
import com.yixiang.system.domain.LoginResponse;
import com.yixiang.system.domain.SysUser;
import com.yixiang.system.service.SysUserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 后台管理登录控制器
 */
@RestController
@RequestMapping("/api/admin/v1")
public class AdminLoginController {

    private final SysUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AdminLoginController(SysUserService userService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    @Log(module = "认证", description = "管理员登录")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        // 验证用户
        SysUser user = userService.getByUsername(request.getUsername());
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Result.error("用户名或密码错误");
        }
        if (user.getStatus() == 1) {
            return Result.error("账号已被禁用");
        }

        // 生成Token
        String token = jwtUtils.generateToken(user.getUsername());

        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setUserId(user.getUserId());
        userInfo.setUsername(user.getUsername());
        userInfo.setNickname(user.getNickname());
        userInfo.setAvatar(user.getAvatar());
        response.setUser(userInfo);

        return Result.ok(response);
    }
}