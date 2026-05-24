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
import com.dh.live.service.IDhLiveAnnouncementService;

/**
 * 总部公告管理
 */
@Controller
@RequestMapping("/dh-live/announcement")
public class DhLiveAnnouncementController extends BaseController
{
    private static final String PREFIX = "dh-live/announcement";

    @Autowired
    private IDhLiveAnnouncementService announcementService;

    @RequiresPermissions("live:announcement:view")
    @GetMapping
    public String announcement()
    {
        return PREFIX + "/announcement";
    }

    @RequiresPermissions("live:announcement:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(String keyword, String publishStatus)
    {
        startPage();
        return getDataTable(announcementService.selectAnnouncementList(keyword, publishStatus));
    }

    @RequiresPermissions("live:announcement:view")
    @GetMapping("/view/{id}")
    @ResponseBody
    public AjaxResult view(@PathVariable("id") Long id)
    {
        return AjaxResult.success(announcementService.selectAnnouncementById(id));
    }

    @RequiresPermissions("live:announcement:add")
    @Log(title = "总部公告", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult add(@RequestParam Map<String, Object> body)
    {
        body.put("createBy", ShiroUtils.getLoginName());
        return toAjax(announcementService.insertAnnouncement(body));
    }

    @RequiresPermissions("live:announcement:edit")
    @Log(title = "总部公告", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult edit(@RequestParam Map<String, Object> body)
    {
        Long annId = pickId(body, "id", "annId", "ann_id");
        if (annId == null)
        {
            return AjaxResult.error("参数错误：缺少主键ID");
        }
        body.put("annId", annId);
        body.put("updateBy", ShiroUtils.getLoginName());
        return toAjax(announcementService.updateAnnouncement(body));
    }

    @RequiresPermissions("live:announcement:remove")
    @Log(title = "总部公告", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(announcementService.deleteAnnouncementByIds(ids));
    }

    @RequiresPermissions("live:announcement:edit")
    @Log(title = "总部公告发布状态", businessType = BusinessType.UPDATE)
    @PostMapping("/changeStatus")
    @ResponseBody
    public AjaxResult changePublishStatus(Long id, String publishStatus)
    {
        if (id == null || StringUtils.isEmpty(publishStatus))
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(announcementService.changePublishStatus(id, publishStatus));
    }

    @RequiresPermissions("live:announcement:edit")
    @Log(title = "总部公告置顶", businessType = BusinessType.UPDATE)
    @PostMapping("/changePinned")
    @ResponseBody
    public AjaxResult changePinned(Long id, String isPinned)
    {
        if (id == null || StringUtils.isEmpty(isPinned))
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(announcementService.changePinned(id, isPinned));
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