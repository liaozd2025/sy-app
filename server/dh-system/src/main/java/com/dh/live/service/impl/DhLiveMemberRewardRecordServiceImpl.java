package com.dh.live.service.impl;

import java.util.List;
import java.util.Map;
import com.dh.live.mapper.DhLiveMemberRewardRecordMapper;
import com.dh.live.service.IDhLiveMemberRewardRecordService;
import com.dh.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 学员兑换记录Service实现
 *
 * @author 3r_111
 */
@Service
public class DhLiveMemberRewardRecordServiceImpl implements IDhLiveMemberRewardRecordService
{
    @Autowired
    private DhLiveMemberRewardRecordMapper rewardRecordMapper;

    /**
     * 查询兑换记录
     */
    @Override
    public Map<String, Object> selectRewardRecordById(Long recordId)
    {
        return rewardRecordMapper.selectRewardRecordById(recordId);
    }

    /**
     * 查询兑换记录列表
     */
    @Override
    public List<Map<String, Object>> selectRewardRecordList(String keyword, String deliveryStatus)
    {
        return rewardRecordMapper.selectRewardRecordList(keyword, deliveryStatus);
    }

    /**
     * 新增兑换记录
     */
    @Override
    public int insertRewardRecord(Map<String, Object> record)
    {
        if (record == null)
        {
            return 0;
        }
        // 设置默认值
        record.put("delFlag", "0");
        if (StringUtils.isNull(record.get("deliveryStatus")))
        {
            record.put("deliveryStatus", "pending");
        }
        if (record.get("exchangeTime") == null)
        {
            record.put("exchangeTime", "sysdate()");
        }
        return rewardRecordMapper.insertRewardRecord(record);
    }

    /**
     * 修改兑换记录
     */
    @Override
    public int updateRewardRecord(Map<String, Object> record)
    {
        if (record == null || record.get("recordId") == null)
        {
            return 0;
        }
        return rewardRecordMapper.updateRewardRecord(record);
    }

    /**
     * 删除兑换记录
     */
    @Override
    public int deleteRewardRecordById(Long recordId)
    {
        return rewardRecordMapper.deleteRewardRecordById(recordId);
    }

    /**
     * 批量删除兑换记录
     */
    @Override
    public int deleteRewardRecordByIds(String recordIds)
    {
        if (StringUtils.isEmpty(recordIds))
        {
            return 0;
        }
        return rewardRecordMapper.deleteRewardRecordByIds(recordIds);
    }

    /**
     * 修改发货状态
     */
    @Override
    public int changeDeliveryStatus(Long recordId, String deliveryStatus, String deliveryNote)
    {
        if (recordId == null || StringUtils.isEmpty(deliveryStatus))
        {
            return 0;
        }
        if (deliveryNote == null)
        {
            deliveryNote = "";
        }
        return rewardRecordMapper.updateRewardRecordDelivery(recordId, deliveryStatus, deliveryNote);
    }

    /**
     * 查询会员兑换记录
     */
    @Override
    public List<Map<String, Object>> selectRewardRecordByMemberId(Long memberId)
    {
        if (memberId == null)
        {
            return null;
        }
        return rewardRecordMapper.selectRewardRecordByMemberId(memberId);
    }
}