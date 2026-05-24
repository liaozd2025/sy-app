package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 积分商城福利SKU Service接口
 *
 * @author 3r_111
 */
public interface IDhLiveRewardItemService
{
    /**
     * 查询福利SKU
     *
     * @param itemId 主键ID
     * @return 福利SKU
     */
    Map<String, Object> selectRewardItemById(Long itemId);

    /**
     * 查询福利SKU列表
     *
     * @param keyword 关键词
     * @param status 状态
     * @return 福利SKU集合
     */
    List<Map<String, Object>> selectRewardItemList(String keyword, String status);

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
    int deleteRewardItemById(Long itemId);

    /**
     * 批量删除福利SKU
     *
     * @param itemIds 需要删除的数据ID
     * @return 结果
     */
    int deleteRewardItemByIds(String itemIds);

    /**
     * 修改上下架状态
     *
     * @param itemId 主键ID
     * @param status 状态
     * @return 结果
     */
    int changeStatus(Long itemId, String status);

    /**
     * 扣减库存
     *
     * @param itemId 主键ID
     * @param delta 扣减数量
     * @return 结果
     */
    int reduceStock(Long itemId, int delta);
}