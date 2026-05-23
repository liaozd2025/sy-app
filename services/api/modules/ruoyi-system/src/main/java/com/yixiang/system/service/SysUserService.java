package com.yixiang.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yixiang.system.domain.SysUser;

/**
 * 用户 Service 接口
 */
public interface SysUserService extends IService<SysUser> {

    /**
     * 根据用户名查询用户
     */
    SysUser getByUsername(String username);

    /**
     * 注册用户
     */
    boolean register(SysUser user);

    /**
     * 修改用户信息
     */
    boolean updateUser(SysUser user);
}