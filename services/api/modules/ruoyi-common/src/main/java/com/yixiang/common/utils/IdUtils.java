package com.yixiang.common.utils;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.IdUtil;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ID 生成工具类
 */
public class IdUtils {

    /**
     * 生成雪花ID
     */
    public static long snowflakeId() {
        return IdUtil.getSnowflakeNextId();
    }

    /**
     * 生成简单UUID (不含横线)
     */
    public static String simpleUUID() {
        return IdUtil.simpleUUID();
    }

    /**
     * 生成普通UUID
     */
    public static String uuid() {
        return IdUtil.fastUUID().toString();
    }

    /**
     * 基于日期生成订单号
     * 格式: yyyyMMddHHmmss + 随机数
     */
    public static String orderNo() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String dateStr = sdf.format(new Date());
        String random = String.valueOf((int) (Math.random() * 10000));
        return dateStr + String.format("%04d", Integer.parseInt(random));
    }

    /**
     * 获取当前时间戳 (毫秒)
     */
    public static long currentTimeMillis() {
        return System.currentTimeMillis();
    }

    /**
     * 获取当前时间戳 (秒)
     */
    public static int currentTimeSeconds() {
        return (int) (System.currentTimeMillis() / 1000);
    }

    /**
     * 格式化日期
     */
    public static String formatDate(Date date, String pattern) {
        return DateUtil.format(date, pattern);
    }
}