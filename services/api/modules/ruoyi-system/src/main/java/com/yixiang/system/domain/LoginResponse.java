package com.yixiang.system.domain;

import lombok.Data;
import java.io.Serializable;

/**
 * 登录响应
 */
@Data
public class LoginResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 访问令牌
     */
    private String token;

    /**
     * 令牌类型
     */
    private String tokenType = "Bearer";

    /**
     * 用户信息
     */
    private UserInfo user;

    @Data
    public static class UserInfo {
        private Long userId;
        private String username;
        private String nickname;
        private String avatar;
    }
}