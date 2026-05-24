package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 学员兑换记录Service接口
 *
 * @author 3r_111
 */
public interface IDhLiveMemberRewardRecordService
{
    /**
     * 查询兑换记录
     *
     * @param recordId 主键ID
     * @return 兑换记录
     */
    Map<String, Object> selectRewardRecordById(Long recordId);

    /**
     * 查询兑换记录列表
     *
     * @param keyword 关键词
     * @param deliveryStatus 发货状态
     * @return 兑换记录集合
     */
    List<Map<String, Object>> selectRewardRecordList(String keyword, String deliveryStatus);

    /**
     * 新增兑换记录
     *
     * @param record 兑换记录
     * @return 结果
     */
    int insertRewardRecord(Map<String, Object> record);

    /**
     * 修改兑换记录
     *
     * @param record 兑换记录
     * @return 结果
     */
    int updateRewardRecord(Map<String, Object> record);

    /**
     * 删除兑换记录
     *
     * @param recordId 主键ID
     * @return 结果
     */
    int deleteRewardRecordById(Long recordId);

    /**
     * 批量删除兑换记录
     *
     * @param recordIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardRecordByIds(String recordIds);

    /**
     * 修改发货状态
     *
     * @param recordId 主键ID
     * @param deliveryStatus 发货状态
     * @param deliveryNote 物流备注
     * @return 结果
     */
    int changeDeliveryStatus(Long recordId, String deliveryStatus, String deliveryNote);

    /**
     * 查询会员兑换记录
     *
     * @param memberId 会员ID
     * @return 兑换记录集合
     */
    List<Map<String, Object>> selectRewardRecordByMemberId(Long memberId);
}