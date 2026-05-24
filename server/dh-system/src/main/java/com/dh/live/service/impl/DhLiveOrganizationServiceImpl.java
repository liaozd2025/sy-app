package com.dh.live.service.impl;

import java.util.List;
import java.util.Map;
import com.dh.live.mapper.DhLiveOrganizationMapper;
import com.dh.live.service.IDhLiveOrganizationService;
import com.dh.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 经销商公司Service实现
 *
 * @author 3r_111
 */
@Service
public class DhLiveOrganizationServiceImpl implements IDhLiveOrganizationService
{
    @Autowired
    private DhLiveOrganizationMapper organizationMapper;

    /**
     * 查询经销商公司
     *
     * @param orgId 主键ID
     * @return 经销商公司
     */
    @Override
    public Map<String, Object> selectOrganizationById(Long orgId)
    {
        return organizationMapper.selectOrganizationById(orgId);
    }

    /**
     * 查询经销商公司列表
     */
    @Override
    public List<Map<String, Object>> selectOrganizationList(String orgName, String status, String region)
    {
        return organizationMapper.selectOrganizationList(orgName, status, region);
    }

    /**
     * 新增经销商公司
     */
    @Override
    public int insertOrganization(Map<String, Object> org)
    {
        if (org == null)
        {
            return 0;
        }
        // 设置默认值
        org.put("delFlag", "0");
        if (StringUtils.isNull(org.get("status")))
        {
            org.put("status", "0");
        }
        if (StringUtils.isNull(org.get("sort")))
        {
            org.put("sort", 0);
        }
        return organizationMapper.insertOrganization(org);
    }

    /**
     * 修改经销商公司
     */
    @Override
    public int updateOrganization(Map<String, Object> org)
    {
        if (org == null || org.get("orgId") == null)
        {
            return 0;
        }
        return organizationMapper.updateOrganization(org);
    }

    /**
     * 删除经销商公司
     */
    @Override
    public int deleteOrganizationById(Long orgId)
    {
        return organizationMapper.deleteOrganizationById(orgId);
    }

    /**
     * 批量删除经销商公司
     */
    @Override
    public int deleteOrganizationByIds(String orgIds)
    {
        if (StringUtils.isEmpty(orgIds))
        {
            return 0;
        }
        return organizationMapper.deleteOrganizationByIds(orgIds);
    }

    /**
     * 修改状态
     */
    @Override
    public int changeStatus(Long orgId, String status)
    {
        if (orgId == null || StringUtils.isEmpty(status))
        {
            return 0;
        }
        return organizationMapper.updateOrganizationStatus(orgId, status);
    }
}