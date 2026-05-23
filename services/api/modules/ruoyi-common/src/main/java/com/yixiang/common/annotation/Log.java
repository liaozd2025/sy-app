package com.yixiang.common.annotation;

import java.lang.annotation.*;

/**
 * 自定义注解 - 简单记录操作日志
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 操作模块
     */
    String module() default "";

    /**
     * 操作说明
     */
    String description() default "";
}