package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 经销商公司Service接口
 *
 * @author 3r_111
 */
public interface IDhLiveOrganizationService
{
    /**
     * 查询经销商公司
     *
     * @param orgId 主键ID
     * @return 经销商公司
     */
    Map<String, Object> selectOrganizationById(Long orgId);

    /**
     * 查询经销商公司列表
     *
     * @param orgName 公司名称
     * @param status 状态
     * @param region 区域
     * @return 经销商公司集合
     */
    List<Map<String, Object>> selectOrganizationList(String orgName, String status, String region);

    /**
     * 新增经销商公司
     *
     * @param org 经销商公司
     * @return 结果
     */
    int insertOrganization(Map<String, Object> org);

    /**
     * 修改经销商公司
     *
     * @param org 经销商公司
     * @return 结果
     */
    int updateOrganization(Map<String, Object> org);

    /**
     * 删除经销商公司
     *
     * @param orgId 主键ID
     * @return 结果
     */
    int deleteOrganizationById(Long orgId);

    /**
     * 批量删除经销商公司
     *
     * @param orgIds 需要删除的数据ID
     * @return 结果
     */
    int deleteOrganizationByIds(String orgIds);

    /**
     * 修改状态
     *
     * @param orgId 主键ID
     * @param status 状态
     * @return 结果
     */
    int changeStatus(Long orgId, String status);
}