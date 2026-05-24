package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 兑换码池Service接口
 *
 * @author 3r_111
 */
public interface IDhLiveRewardCodeService
{
    /**
     * 查询兑换码
     *
     * @param codeId 主键ID
     * @return 兑换码
     */
    Map<String, Object> selectRewardCodeById(Long codeId);

    /**
     * 查询兑换码列表
     *
     * @param itemId 福利ID
     * @param isUsed 是否已使用
     * @param code 兑换码
     * @return 兑换码集合
     */
    List<Map<String, Object>> selectRewardCodeList(Long itemId, String isUsed, String code);

    /**
     * 新增兑换码
     *
     * @param code 兑换码
     * @return 结果
     */
    int insertRewardCode(Map<String, Object> code);

    /**
     * 修改兑换码
     *
     * @param code 兑换码
     * @return 结果
     */
    int updateRewardCode(Map<String, Object> code);

    /**
     * 删除兑换码
     *
     * @param codeId 主键ID
     * @return 结果
     */
    int deleteRewardCodeById(Long codeId);

    /**
     * 批量删除兑换码
     *
     * @param codeIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardCodeByIds(String codeIds);

    /**
     * 使用兑换码
     *
     * @param codeId 主键ID
     * @param memberId 使用者ID
     * @return 结果
     */
    int useRewardCode(Long codeId, Long memberId);

    /**
     * 根据兑换码查询
     *
     * @param code 兑换码
     * @return 兑换码
     */
    Map<String, Object> selectRewardCodeByCode(String code);
}