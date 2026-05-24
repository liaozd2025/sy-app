package com.dh.live.service.impl;

import java.util.List;
import java.util.Map;
import com.dh.live.mapper.DhLiveRewardCodeMapper;
import com.dh.live.service.IDhLiveRewardCodeService;
import com.dh.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 兑换码池Service实现
 *
 * @author 3r_111
 */
@Service
public class DhLiveRewardCodeServiceImpl implements IDhLiveRewardCodeService
{
    @Autowired
    private DhLiveRewardCodeMapper rewardCodeMapper;

    /**
     * 查询兑换码
     */
    @Override
    public Map<String, Object> selectRewardCodeById(Long codeId)
    {
        return rewardCodeMapper.selectRewardCodeById(codeId);
    }

    /**
     * 查询兑换码列表
     */
    @Override
    public List<Map<String, Object>> selectRewardCodeList(Long itemId, String isUsed, String code)
    {
        return rewardCodeMapper.selectRewardCodeList(itemId, isUsed, code);
    }

    /**
     * 新增兑换码
     */
    @Override
    public int insertRewardCode(Map<String, Object> code)
    {
        if (code == null)
        {
            return 0;
        }
        // 设置默认值
        code.put("delFlag", "0");
        if (StringUtils.isNull(code.get("isUsed")))
        {
            code.put("isUsed", "0");
        }
        return rewardCodeMapper.insertRewardCode(code);
    }

    /**
     * 修改兑换码
     */
    @Override
    public int updateRewardCode(Map<String, Object> code)
    {
        if (code == null || code.get("codeId") == null)
        {
            return 0;
        }
        return rewardCodeMapper.updateRewardCode(code);
    }

    /**
     * 删除兑换码
     */
    @Override
    public int deleteRewardCodeById(Long codeId)
    {
        return rewardCodeMapper.deleteRewardCodeById(codeId);
    }

    /**
     * 批量删除兑换码
     */
    @Override
    public int deleteRewardCodeByIds(String codeIds)
    {
        if (StringUtils.isEmpty(codeIds))
        {
            return 0;
        }
        return rewardCodeMapper.deleteRewardCodeByIds(codeIds);
    }

    /**
     * 使用兑换码
     */
    @Override
    public int useRewardCode(Long codeId, Long memberId)
    {
        if (codeId == null || memberId == null)
        {
            return 0;
        }
        return rewardCodeMapper.useRewardCode(codeId, memberId);
    }

    /**
     * 根据兑换码查询
     */
    @Override
    public Map<String, Object> selectRewardCodeByCode(String code)
    {
        if (StringUtils.isEmpty(code))
        {
            return null;
        }
        return rewardCodeMapper.selectRewardCodeByCode(code);
    }
}