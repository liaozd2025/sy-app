package com.yixiang.common.enums;

/**
 * 响应码枚举
 */
public enum ResponseEnum {

    // 成功
    SUCCESS("操作成功", 200),

    // 客户端错误
    BAD_REQUEST("请求参数有误", 400),
    UNAUTHORIZED("未授权", 401),
    FORBIDDEN("无权限", 403),
    NOT_FOUND("资源不存在", 404),

    // 服务端错误
    INTERNAL_ERROR("服务器异常", 500),
    SERVICE_UNAVAILABLE("服务不可用", 503);

    private final String msg;
    private final int code;

    ResponseEnum(String msg, int code) {
        this.msg = msg;
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public int getCode() {
        return code;
    }
}