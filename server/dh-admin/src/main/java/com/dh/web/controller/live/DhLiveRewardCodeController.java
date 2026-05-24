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
import com.dh.live.service.IDhLiveRewardCodeService;

/**
 * 兑换码池管理
 */
@Controller
@RequestMapping("/dh-live/reward-code")
public class DhLiveRewardCodeController extends BaseController
{
    private static final String PREFIX = "dh-live/reward-code";

    @Autowired
    private IDhLiveRewardCodeService rewardCodeService;

    @RequiresPermissions("live:reward-code:view")
    @GetMapping
    public String rewardCode()
    {
        return PREFIX + "/rewardCode";
    }

    @RequiresPermissions("live:reward-code:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(Long itemId, String isUsed, String code)
    {
        startPage();
        return getDataTable(rewardCodeService.selectRewardCodeList(itemId, isUsed, code));
    }

    @RequiresPermissions("live:reward-code:view")
    @GetMapping("/view/{id}")
    @ResponseBody
    public AjaxResult view(@PathVariable("id") Long id)
    {
        return AjaxResult.success(rewardCodeService.selectRewardCodeById(id));
    }

    @RequiresPermissions("live:reward-code:add")
    @Log(title = "兑换码", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult add(@RequestParam Map<String, Object> body)
    {
        body.put("createBy", ShiroUtils.getLoginName());
        return toAjax(rewardCodeService.insertRewardCode(body));
    }

    @RequiresPermissions("live:reward-code:edit")
    @Log(title = "兑换码", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult edit(@RequestParam Map<String, Object> body)
    {
        Long codeId = pickId(body, "id", "codeId", "code_id");
        if (codeId == null)
        {
            return AjaxResult.error("参数错误：缺少主键ID");
        }
        body.put("codeId", codeId);
        return toAjax(rewardCodeService.updateRewardCode(body));
    }

    @RequiresPermissions("live:reward-code:remove")
    @Log(title = "兑换码", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(rewardCodeService.deleteRewardCodeByIds(ids));
    }

    @RequiresPermissions("live:reward-code:edit")
    @Log(title = "兑换码使用", businessType = BusinessType.UPDATE)
    @PostMapping("/use")
    @ResponseBody
    public AjaxResult use(Long id, Long memberId)
    {
        if (id == null || memberId == null)
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(rewardCodeService.useRewardCode(id, memberId));
    }

    @RequiresPermissions("live:reward-code:view")
    @GetMapping("/query")
    @ResponseBody
    public AjaxResult queryByCode(String code)
    {
        if (StringUtils.isEmpty(code))
        {
            return AjaxResult.error("参数错误：缺少兑换码");
        }
        return AjaxResult.success(rewardCodeService.selectRewardCodeByCode(code));
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