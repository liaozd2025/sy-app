package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 经销商公司Mapper接口
 *
 * @author 3r_111
 */
public interface DhLiveOrganizationMapper
{
    /**
     * 查询经销商公司
     *
     * @param orgId 主键ID
     * @return 经销商公司
     */
    Map<String, Object> selectOrganizationById(@Param("orgId") Long orgId);

    /**
     * 查询经销商公司列表
     *
     * @param org 经销商公司
     * @return 经销商公司集合
     */
    List<Map<String, Object>> selectOrganizationList(@Param("orgName") String orgName,
                                                      @Param("status") String status,
                                                      @Param("region") String region);

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
    int deleteOrganizationById(@Param("orgId") Long orgId);

    /**
     * 批量删除经销商公司
     *
     * @param orgIds 需要删除的数据ID
     * @return 结果
     */
    int deleteOrganizationByIds(@Param("orgIds") String orgIds);

    /**
     * 修改状态
     *
     * @param orgId 主键ID
     * @param status 状态
     * @return 结果
     */
    int updateOrganizationStatus(@Param("orgId") Long orgId, @Param("status") String status);
}