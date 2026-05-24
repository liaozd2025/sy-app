package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 学员兑换记录Mapper接口
 *
 * @author 3r_111
 */
public interface DhLiveMemberRewardRecordMapper
{
    /**
     * 查询兑换记录
     *
     * @param recordId 主键ID
     * @return 兑换记录
     */
    Map<String, Object> selectRewardRecordById(@Param("recordId") Long recordId);

    /**
     * 查询兑换记录列表
     *
     * @param keyword 关键词
     * @param deliveryStatus 发货状态
     * @return 兑换记录集合
     */
    List<Map<String, Object>> selectRewardRecordList(@Param("keyword") String keyword,
                                                     @Param("deliveryStatus") String deliveryStatus);

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
    int deleteRewardRecordById(@Param("recordId") Long recordId);

    /**
     * 批量删除兑换记录
     *
     * @param recordIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardRecordByIds(@Param("recordIds") String recordIds);

    /**
     * 修改发货状态
     *
     * @param recordId 主键ID
     * @param deliveryStatus 发货状态
     * @param deliveryNote 物流备注
     * @return 结果
     */
    int updateRewardRecordDelivery(@Param("recordId") Long recordId,
                                   @Param("deliveryStatus") String deliveryStatus,
                                   @Param("deliveryNote") String deliveryNote);

    /**
     * 查询会员兑换记录
     *
     * @param memberId 会员ID
     * @return 兑换记录集合
     */
    List<Map<String, Object>> selectRewardRecordByMemberId(@Param("memberId") Long memberId);
}