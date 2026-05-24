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
import com.dh.common.utils.StringUtils;
import com.dh.live.service.IDhLiveMemberRewardRecordService;

/**
 * 学员兑换记录管理
 */
@Controller
@RequestMapping("/dh-live/reward-record")
public class DhLiveMemberRewardRecordController extends BaseController
{
    private static final String PREFIX = "dh-live/reward-record";

    @Autowired
    private IDhLiveMemberRewardRecordService rewardRecordService;

    @RequiresPermissions("live:reward-record:view")
    @GetMapping
    public String rewardRecord()
    {
        return PREFIX + "/rewardRecord";
    }

    @RequiresPermissions("live:reward-record:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(String keyword, String deliveryStatus)
    {
        startPage();
        return getDataTable(rewardRecordService.selectRewardRecordList(keyword, deliveryStatus));
    }

    @RequiresPermissions("live:reward-record:view")
    @GetMapping("/view/{id}")
    @ResponseBody
    public AjaxResult view(@PathVariable("id") Long id)
    {
        return AjaxResult.success(rewardRecordService.selectRewardRecordById(id));
    }

    @RequiresPermissions("live:reward-record:edit")
    @Log(title = "兑换记录发货状态", businessType = BusinessType.UPDATE)
    @PostMapping("/changeDeliveryStatus")
    @ResponseBody
    public AjaxResult changeDeliveryStatus(Long id, String deliveryStatus, String deliveryNote)
    {
        if (id == null || StringUtils.isEmpty(deliveryStatus))
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(rewardRecordService.changeDeliveryStatus(id, deliveryStatus, deliveryNote));
    }

    @RequiresPermissions("live:reward-record:remove")
    @Log(title = "兑换记录", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(rewardRecordService.deleteRewardRecordByIds(ids));
    }

    @RequiresPermissions("live:reward-record:view")
    @GetMapping("/member/{memberId}")
    @ResponseBody
    public AjaxResult listByMember(@PathVariable("memberId") Long memberId)
    {
        return AjaxResult.success(rewardRecordService.selectRewardRecordByMemberId(memberId));
    }
}