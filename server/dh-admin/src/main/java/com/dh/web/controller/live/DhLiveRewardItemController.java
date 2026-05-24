package com.dh.web.controller.live;

import java.util.Map;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.dh.common.annotation.Log;
import com.dh.common.core.controller.BaseController;
import com.dh.common.core.domain.AjaxResult;
import com.dh.common.core.page.TableDataInfo;
import com.dh.common.enums.BusinessType;
import com.dh.common.utils.ShiroUtils;
import com.dh.common.utils.StringUtils;
import com.dh.live.service.IDhLiveRewardItemService;

/**
 * 积分商城福利SKU管理
 */
@Controller
@RequestMapping("/dh-live/reward-item")
public class DhLiveRewardItemController extends BaseController
{
    private static final String PREFIX = "dh-live/reward-item";

    @Autowired
    private IDhLiveRewardItemService rewardItemService;

    @RequiresPermissions("live:reward-item:view")
    @GetMapping
    public String rewardItem()
    {
        return PREFIX + "/rewardItem";
    }

    @RequiresPermissions("live:reward-item:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(String keyword, String status)
    {
        startPage();
        return getDataTable(rewardItemService.selectRewardItemList(keyword, status));
    }

    @RequiresPermissions("live:reward-item:view")
    @GetMapping("/view/{id}")
    @ResponseBody
    public AjaxResult view(@PathVariable("id") Long id)
    {
        return AjaxResult.success(rewardItemService.selectRewardItemById(id));
    }

    @RequiresPermissions("live:reward-item:add")
    @Log(title = "积分商城福利", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult add(@RequestParam Map<String, Object> body)
    {
        body.put("createBy", ShiroUtils.getLoginName());
        return toAjax(rewardItemService.insertRewardItem(body));
    }

    @RequiresPermissions("live:reward-item:edit")
    @Log(title = "积分商城福利", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult edit(@RequestParam Map<String, Object> body)
    {
        Long itemId = pickId(body, "id", "itemId", "item_id");
        if (itemId == null)
        {
            return AjaxResult.error("参数错误：缺少主键ID");
        }
        body.put("itemId", itemId);
        body.put("updateBy", ShiroUtils.getLoginName());
        return toAjax(rewardItemService.updateRewardItem(body));
    }

    @RequiresPermissions("live:reward-item:remove")
    @Log(title = "积分商城福利", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(rewardItemService.deleteRewardItemByIds(ids));
    }

    @RequiresPermissions("live:reward-item:edit")
    @Log(title = "积分商城福利上下架", businessType = BusinessType.UPDATE)
    @PostMapping("/changeStatus")
    @ResponseBody
    public AjaxResult changeStatus(Long id, String status)
    {
        if (id == null || StringUtils.isEmpty(status))
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(rewardItemService.changeStatus(id, status));
    }

    private Long pickId(Map<String, Object> body, String... keys)
    {
        for (String key : keys)
        {
            Object value = body.get(key);
            if (value != null && StringUtils.isNotBlank(value.toString()))
            {
                return Long.valueOf(value.toString());
            }
        }
        return null;
    }
}