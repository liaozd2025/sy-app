package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 积分商城福利SKUMapper接口
 *
 * @author 3r_111
 */
public interface DhLiveRewardItemMapper
{
    /**
     * 查询福利SKU
     *
     * @param itemId 主键ID
     * @return 福利SKU
     */
    Map<String, Object> selectRewardItemById(@Param("itemId") Long itemId);

    /**
     * 查询福利SKU列表
     *
     * @param keyword 关键词
     * @param status 状态
     * @return 福利SKU集合
     */
    List<Map<String, Object>> selectRewardItemList(@Param("keyword") String keyword,
                                                  @Param("status") String status);

    /**
     * 新增福利SKU
     *
     * @param item 福利SKU
     * @return 结果
     */
    int insertRewardItem(Map<String, Object> item);

    /**
     * 修改福利SKU
     *
     * @param item 福利SKU
     * @return 结果
     */
    int updateRewardItem(Map<String, Object> item);

    /**
     * 删除福利SKU
     *
     * @param itemId 主键ID
     * @return 结果
     */
    int deleteRewardItemById(@Param("itemId") Long itemId);

    /**
     * 批量删除福利SKU
     *
     * @param itemIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardItemByIds(@Param("itemIds") String itemIds);

    /**
     * 修改上下架状态
     *
     * @param itemId 主键ID
     * @param status 状态
     * @return 结果
     */
    int updateRewardItemStatus(@Param("itemId") Long itemId, @Param("status") String status);

    /**
     * 扣减库存
     *
     * @param itemId 主键ID
     * @param delta 扣减数量
     * @return 结果
     */
    int updateRewardItemStock(@Param("itemId") Long itemId, @Param("delta") int delta);
}