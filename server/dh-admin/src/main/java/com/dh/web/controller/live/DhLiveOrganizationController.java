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
import com.dh.live.service.IDhLiveOrganizationService;

/**
 * 经销商公司管理
 */
@Controller
@RequestMapping("/dh-live/org")
public class DhLiveOrganizationController extends BaseController
{
    private static final String PREFIX = "dh-live/org";

    @Autowired
    private IDhLiveOrganizationService organizationService;

    @RequiresPermissions("live:org:view")
    @GetMapping
    public String org()
    {
        return PREFIX + "/org";
    }

    @RequiresPermissions("live:org:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(String orgName, String status, String region)
    {
        startPage();
        return getDataTable(organizationService.selectOrganizationList(orgName, status, region));
    }

    @RequiresPermissions("live:org:view")
    @GetMapping("/view/{id}")
    @ResponseBody
    public AjaxResult view(@PathVariable("id") Long id)
    {
        return AjaxResult.success(organizationService.selectOrganizationById(id));
    }

    @RequiresPermissions("live:org:add")
    @Log(title = "经销商公司", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult add(@RequestParam Map<String, Object> body)
    {
        body.put("createBy", ShiroUtils.getLoginName());
        return toAjax(organizationService.insertOrganization(body));
    }

    @RequiresPermissions("live:org:edit")
    @Log(title = "经销商公司", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult edit(@RequestParam Map<String, Object> body)
    {
        Long orgId = pickId(body, "id", "orgId", "org_id");
        if (orgId == null)
        {
            return AjaxResult.error("参数错误：缺少主键ID");
        }
        body.put("orgId", orgId);
        body.put("updateBy", ShiroUtils.getLoginName());
        return toAjax(organizationService.updateOrganization(body));
    }

    @RequiresPermissions("live:org:remove")
    @Log(title = "经销商公司", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(organizationService.deleteOrganizationByIds(ids));
    }

    @RequiresPermissions("live:org:edit")
    @Log(title = "经销商公司状态", businessType = BusinessType.UPDATE)
    @PostMapping("/changeStatus")
    @ResponseBody
    public AjaxResult changeStatus(Long id, String status)
    {
        if (id == null || StringUtils.isEmpty(status))
        {
            return AjaxResult.error("参数错误");
        }
        return toAjax(organizationService.changeStatus(id, status));
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