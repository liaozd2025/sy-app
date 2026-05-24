package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 兑换码池Mapper接口
 *
 * @author 3r_111
 */
public interface DhLiveRewardCodeMapper
{
    /**
     * 查询兑换码
     *
     * @param codeId 主键ID
     * @return 兑换码
     */
    Map<String, Object> selectRewardCodeById(@Param("codeId") Long codeId);

    /**
     * 查询兑换码列表
     *
     * @param itemId 福利ID
     * @param isUsed 是否已使用
     * @return 兑换码集合
     */
    List<Map<String, Object>> selectRewardCodeList(@Param("itemId") Long itemId,
                                                    @Param("isUsed") String isUsed,
                                                    @Param("code") String code);

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
    int deleteRewardCodeById(@Param("codeId") Long codeId);

    /**
     * 批量删除兑换码
     *
     * @param codeIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardCodeByIds(@Param("codeIds") String codeIds);

    /**
     * 使用兑换码
     *
     * @param codeId 主键ID
     * @param memberId 使用者ID
     * @return 结果
     */
    int useRewardCode(@Param("codeId") Long codeId, @Param("memberId") Long memberId);

    /**
     * 根据兑换码查询
     *
     * @param code 兑换码
     * @return 兑换码
     */
    Map<String, Object> selectRewardCodeByCode(@Param("code") String code);
}