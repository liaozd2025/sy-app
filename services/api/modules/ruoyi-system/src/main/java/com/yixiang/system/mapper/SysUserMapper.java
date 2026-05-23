package com.yixiang.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yixiang.system.domain.SysUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {
}