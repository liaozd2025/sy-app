package com.yixiang.common.enums;

/**
 * 用户状态枚举
 */
public enum UserStatus {

    NORMAL(0, "正常"),
    DISABLED(1, "禁用");

    private final int code;
    private final String desc;

    UserStatus(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static UserStatus getByCode(int code) {
        for (UserStatus status : values()) {
            if (status.getCode() == code) {
                return status;
            }
        }
        return NORMAL;
    }
}