package com.dh.live.service.impl;

import java.util.List;
import java.util.Map;
import com.dh.live.mapper.DhLiveRewardItemMapper;
import com.dh.live.service.IDhLiveRewardItemService;
import com.dh.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 积分商城福利SKUService实现
 *
 * @author 3r_111
 */
@Service
public class DhLiveRewardItemServiceImpl implements IDhLiveRewardItemService
{
    @Autowired
    private DhLiveRewardItemMapper rewardItemMapper;

    /**
     * 查询福利SKU
     */
    @Override
    public Map<String, Object> selectRewardItemById(Long itemId)
    {
        return rewardItemMapper.selectRewardItemById(itemId);
    }

    /**
     * 查询福利SKU列表
     */
    @Override
    public List<Map<String, Object>> selectRewardItemList(String keyword, String status)
    {
        return rewardItemMapper.selectRewardItemList(keyword, status);
    }

    /**
     * 新增福利SKU
     */
    @Override
    public int insertRewardItem(Map<String, Object> item)
    {
        if (item == null)
        {
            return 0;
        }
        // 设置默认值
        item.put("delFlag", "0");
        if (StringUtils.isNull(item.get("status")))
        {
            item.put("status", "1");
        }
        if (StringUtils.isNull(item.get("sort")))
        {
            item.put("sort", 0);
        }
        if (StringUtils.isNull(item.get("stockTotal")))
        {
            item.put("stockTotal", 0);
        }
        if (StringUtils.isNull(item.get("stockRemaining")))
        {
            item.put("stockRemaining", 0);
        }
        return rewardItemMapper.insertRewardItem(item);
    }

    /**
     * 修改福利SKU
     */
    @Override
    public int updateRewardItem(Map<String, Object> item)
    {
        if (item == null || item.get("itemId") == null)
        {
            return 0;
        }
        return rewardItemMapper.updateRewardItem(item);
    }

    /**
     * 删除福利SKU
     */
    @Override
    public int deleteRewardItemById(Long itemId)
    {
        return rewardItemMapper.deleteRewardItemById(itemId);
    }

    /**
     * 批量删除福利SKU
     */
    @Override
    public int deleteRewardItemByIds(String itemIds)
    {
        if (StringUtils.isEmpty(itemIds))
        {
            return 0;
        }
        return rewardItemMapper.deleteRewardItemByIds(itemIds);
    }

    /**
     * 修改上下架状态
     */
    @Override
    public int changeStatus(Long itemId, String status)
    {
        if (itemId == null || StringUtils.isEmpty(status))
        {
            return 0;
        }
        return rewardItemMapper.updateRewardItemStatus(itemId, status);
    }

    /**
     * 扣减库存
     */
    @Override
    public int reduceStock(Long itemId, int delta)
    {
        if (itemId == null)
        {
            return 0;
        }
        return rewardItemMapper.updateRewardItemStock(itemId, -delta);
    }
}