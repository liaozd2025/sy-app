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
import com.dh.live.service.IDhLiveAdminService;

/**
 * 典恒直播后台管理接口。
 */
@Controller
@RequestMapping("/dh-live")
public class DhLiveAdminController extends BaseController
{
    private static final String PREFIX = "dh-live";

    @Autowired
    private IDhLiveAdminService dhLiveAdminService;

    @RequiresPermissions("live:session:view")
    @GetMapping("/session")
    public String session()
    {
        return PREFIX + "/session/session";
    }

    @RequiresPermissions("live:session:add")
    @GetMapping("/session/add")
    public String sessionAdd()
    {
        return PREFIX + "/session/add";
    }

    @RequiresPermissions("live:session:edit")
    @GetMapping("/session/edit/{id}")
    public String sessionEdit(@PathVariable("id") Long id, ModelMap mmap)
    {
        mmap.put("session", dhLiveAdminService.selectAdminById("session", id));
        return PREFIX + "/session/edit";
    }

    @RequiresPermissions("live:session:list")
    @PostMapping("/session/list")
    @ResponseBody
    public TableDataInfo sessionList(String keyword)
    {
        return list("session", keyword);
    }

    @RequiresPermissions("live:session:add")
    @Log(title = "典恒直播场次", businessType = BusinessType.INSERT)
    @PostMapping("/session/add")
    @ResponseBody
    public AjaxResult sessionAdd(@RequestParam Map<String, Object> body)
    {
        return add("session", body);
    }

    @RequiresPermissions("live:session:edit")
    @Log(title = "典恒直播场次", businessType = BusinessType.UPDATE)
    @PostMapping("/session/edit")
    @ResponseBody
    public AjaxResult sessionEdit(@RequestParam Map<String, Object> body)
    {
        return edit("session", pickId(body, "id", "liveId", "live_id"), body);
    }

    @RequiresPermissions("live:session:remove")
    @Log(title = "典恒直播场次", businessType = BusinessType.DELETE)
    @PostMapping("/session/remove")
    @ResponseBody
    public AjaxResult sessionRemove(String ids)
    {
        return remove("session", ids);
    }

    @RequiresPermissions("live:session:edit")
    @Log(title = "典恒直播场次状态", businessType = BusinessType.UPDATE)
    @PostMapping("/session/changeStatus")
    @ResponseBody
    public AjaxResult sessionChangeStatus(Long id, String status)
    {
        return changeStatus("session", id, status);
    }

    @RequiresPermissions("live:session:export")
    @PostMapping("/session/export")
    @ResponseBody
    public AjaxResult sessionExport()
    {
        return AjaxResult.success("导出接口已定义，请按 RuoYi ExcelUtil 接入导出文件");
    }

    @RequiresPermissions("live:course:view")
    @GetMapping("/course")
    public String course()
    {
        return PREFIX + "/course/course";
    }

    @RequiresPermissions("live:course:list")
    @PostMapping("/course/list")
    @ResponseBody
    public TableDataInfo courseList(String keyword)
    {
        return list("course", keyword);
    }

    @RequiresPermissions("live:course:add")
    @Log(title = "典恒课程", businessType = BusinessType.INSERT)
    @PostMapping("/course/add")
    @ResponseBody
    public AjaxResult courseAdd(@RequestParam Map<String, Object> body)
    {
        return add("course", body);
    }

    @RequiresPermissions("live:course:edit")
    @Log(title = "典恒课程", businessType = BusinessType.UPDATE)
    @PostMapping("/course/edit")
    @ResponseBody
    public AjaxResult courseEdit(@RequestParam Map<String, Object> body)
    {
        return edit("course", pickId(body, "id", "courseId", "course_id"), body);
    }

    @RequiresPermissions("live:course:remove")
    @Log(title = "典恒课程", businessType = BusinessType.DELETE)
    @PostMapping("/course/remove")
    @ResponseBody
    public AjaxResult courseRemove(String ids)
    {
        return remove("course", ids);
    }

    @RequiresPermissions("live:course:export")
    @PostMapping("/course/export")
    @ResponseBody
    public AjaxResult courseExport()
    {
        return AjaxResult.success("导出接口已定义，请按 RuoYi ExcelUtil 接入导出文件");
    }

    @RequiresPermissions("live:chapter:list")
    @PostMapping("/chapter/list")
    @ResponseBody
    public TableDataInfo chapterList(String keyword)
    {
        return list("chapter", keyword);
    }

    @RequiresPermissions("live:chapter:add")
    @Log(title = "典恒课程章节", businessType = BusinessType.INSERT)
    @PostMapping("/chapter/add")
    @ResponseBody
    public AjaxResult chapterAdd(@RequestParam Map<String, Object> body)
    {
        return add("chapter", body);
    }

    @RequiresPermissions("live:chapter:edit")
    @Log(title = "典恒课程章节", businessType = BusinessType.UPDATE)
    @PostMapping("/chapter/edit")
    @ResponseBody
    public AjaxResult chapterEdit(@RequestParam Map<String, Object> body)
    {
        return edit("chapter", pickId(body, "id", "chapterId", "chapter_id"), body);
    }

    @RequiresPermissions("live:chapter:remove")
    @Log(title = "典恒课程章节", businessType = BusinessType.DELETE)
    @PostMapping("/chapter/remove")
    @ResponseBody
    public AjaxResult chapterRemove(String ids)
    {
        return remove("chapter", ids);
    }

    @RequiresPermissions("live:chapter:edit")
    @Log(title = "典恒课程章节排序", businessType = BusinessType.UPDATE)
    @PostMapping("/chapter/sort")
    @ResponseBody
    public AjaxResult chapterSort(@RequestParam Map<String, Object> body)
    {
        return edit("chapter", pickId(body, "id", "chapterId", "chapter_id"), body);
    }

    @RequiresPermissions("live:content:view")
    @GetMapping("/content")
    public String content()
    {
        return PREFIX + "/content/content";
    }

    @RequiresPermissions("live:content:list")
    @PostMapping("/content/list")
    @ResponseBody
    public TableDataInfo contentList(String keyword)
    {
        return list("content", keyword);
    }

    @RequiresPermissions("live:content:add")
    @Log(title = "典恒健康内容", businessType = BusinessType.INSERT)
    @PostMapping("/content/add")
    @ResponseBody
    public AjaxResult contentAdd(@RequestParam Map<String, Object> body)
    {
        return add("content", body);
    }

    @RequiresPermissions("live:content:edit")
    @Log(title = "典恒健康内容", businessType = BusinessType.UPDATE)
    @PostMapping("/content/edit")
    @ResponseBody
    public AjaxResult contentEdit(@RequestParam Map<String, Object> body)
    {
        return edit("content", pickId(body, "id", "contentId", "content_id"), body);
    }

    @RequiresPermissions("live:content:remove")
    @Log(title = "典恒健康内容", businessType = BusinessType.DELETE)
    @PostMapping("/content/remove")
    @ResponseBody
    public AjaxResult contentRemove(String ids)
    {
        return remove("content", ids);
    }

    @RequiresPermissions("live:content:edit")
    @Log(title = "典恒健康内容状态", businessType = BusinessType.UPDATE)
    @PostMapping("/content/changeStatus")
    @ResponseBody
    public AjaxResult contentChangeStatus(Long id, String status)
    {
        return changeStatus("content", id, status);
    }

    @RequiresPermissions("live:content:export")
    @PostMapping("/content/export")
    @ResponseBody
    public AjaxResult contentExport()
    {
        return AjaxResult.success("导出接口已定义，请按 RuoYi ExcelUtil 接入导出文件");
    }

    @RequiresPermissions("live:encyclopedia:list")
    @PostMapping("/encyclopedia/list")
    @ResponseBody
    public TableDataInfo encyclopediaList(String keyword)
    {
        return list("encyclopedia", keyword);
    }

    @RequiresPermissions("live:encyclopedia:add")
    @Log(title = "典恒百科", businessType = BusinessType.INSERT)
    @PostMapping("/encyclopedia/add")
    @ResponseBody
    public AjaxResult encyclopediaAdd(@RequestParam Map<String, Object> body)
    {
        return add("encyclopedia", body);
    }

    @RequiresPermissions("live:encyclopedia:edit")
    @Log(title = "典恒百科", businessType = BusinessType.UPDATE)
    @PostMapping("/encyclopedia/edit")
    @ResponseBody
    public AjaxResult encyclopediaEdit(@RequestParam Map<String, Object> body)
    {
        return edit("encyclopedia", pickId(body, "id", "entryId", "entry_id"), body);
    }

    @RequiresPermissions("live:encyclopedia:remove")
    @Log(title = "典恒百科", businessType = BusinessType.DELETE)
    @PostMapping("/encyclopedia/remove")
    @ResponseBody
    public AjaxResult encyclopediaRemove(String ids)
    {
        return remove("encyclopedia", ids);
    }

    @RequiresPermissions("live:encyclopedia:edit")
    @Log(title = "典恒百科状态", businessType = BusinessType.UPDATE)
    @PostMapping("/encyclopedia/changeStatus")
    @ResponseBody
    public AjaxResult encyclopediaChangeStatus(Long id, String status)
    {
        return changeStatus("encyclopedia", id, status);
    }

    @RequiresPermissions("live:encyclopedia:export")
    @PostMapping("/encyclopedia/export")
    @ResponseBody
    public AjaxResult encyclopediaExport()
    {
        return AjaxResult.success("导出接口已定义，请按 RuoYi ExcelUtil 接入导出文件");
    }

    @RequiresPermissions("live:recommendation:list")
    @PostMapping("/recommendation/list")
    @ResponseBody
    public TableDataInfo recommendationList(String keyword)
    {
        return list("recommendation", keyword);
    }

    @RequiresPermissions("live:recommendation:add")
    @Log(title = "典恒推荐位", businessType = BusinessType.INSERT)
    @PostMapping("/recommendation/add")
    @ResponseBody
    public AjaxResult recommendationAdd(@RequestParam Map<String, Object> body)
    {
        return add("recommendation", body);
    }

    @RequiresPermissions("live:recommendation:edit")
    @Log(title = "典恒推荐位", businessType = BusinessType.UPDATE)
    @PostMapping("/recommendation/edit")
    @ResponseBody
    public AjaxResult recommendationEdit(@RequestParam Map<String, Object> body)
    {
        return edit("recommendation", pickId(body, "id", "recId", "rec_id"), body);
    }

    @RequiresPermissions("live:recommendation:remove")
    @Log(title = "典恒推荐位", businessType = BusinessType.DELETE)
    @PostMapping("/recommendation/remove")
    @ResponseBody
    public AjaxResult recommendationRemove(String ids)
    {
        return remove("recommendation", ids);
    }

    @RequiresPermissions("live:recommendation:edit")
    @Log(title = "典恒推荐位排序", businessType = BusinessType.UPDATE)
    @PostMapping("/recommendation/sort")
    @ResponseBody
    public AjaxResult recommendationSort(@RequestParam Map<String, Object> body)
    {
        return edit("recommendation", pickId(body, "id", "recId", "rec_id"), body);
    }

    @RequiresPermissions("live:recommendation:edit")
    @Log(title = "典恒推荐位状态", businessType = BusinessType.UPDATE)
    @PostMapping("/recommendation/changeStatus")
    @ResponseBody
    public AjaxResult recommendationChangeStatus(Long id, String status)
    {
        return changeStatus("recommendation", id, status);
    }

    @RequiresPermissions("live:quiz:view")
    @GetMapping("/quiz")
    public String quiz()
    {
        return PREFIX + "/quiz/quiz";
    }

    @RequiresPermissions("live:quiz:list")
    @PostMapping("/quiz/list")
    @ResponseBody
    public TableDataInfo quizList(String keyword)
    {
        return list("quiz", keyword);
    }

    @RequiresPermissions("live:quiz:add")
    @Log(title = "典恒题库", businessType = BusinessType.INSERT)
    @PostMapping("/quiz/add")
    @ResponseBody
    public AjaxResult quizAdd(@RequestParam Map<String, Object> body)
    {
        return add("quiz", body);
    }

    @RequiresPermissions("live:quiz:edit")
    @Log(title = "典恒题库", businessType = BusinessType.UPDATE)
    @PostMapping("/quiz/edit")
    @ResponseBody
    public AjaxResult quizEdit(@RequestParam Map<String, Object> body)
    {
        return edit("quiz", pickId(body, "id", "questionId", "question_id"), body);
    }

    @RequiresPermissions("live:quiz:remove")
    @Log(title = "典恒题库", businessType = BusinessType.DELETE)
    @PostMapping("/quiz/remove")
    @ResponseBody
    public AjaxResult quizRemove(String ids)
    {
        return remove("quiz", ids);
    }

    @RequiresPermissions("live:quiz:export")
    @PostMapping("/quiz/export")
    @ResponseBody
    public AjaxResult quizExport()
    {
        return AjaxResult.success("导出接口已定义，请按 RuoYi ExcelUtil 接入导出文件");
    }

    @RequiresPermissions("live:quiz:edit")
    @Log(title = "典恒题库状态", businessType = BusinessType.UPDATE)
    @PostMapping("/quiz/changeStatus")
    @ResponseBody
    public AjaxResult quizChangeStatus(Long id, String status)
    {
        return changeStatus("quiz", id, status);
    }

    @RequiresPermissions("live:quiz:list")
    @PostMapping("/quiz/answer/list")
    @ResponseBody
    public TableDataInfo quizAnswerList(String keyword)
    {
        return list("answer", keyword);
    }

    @RequiresPermissions("live:member:view")
    @GetMapping("/member")
    public String member()
    {
        return PREFIX + "/member/member";
    }

    @RequiresPermissions("live:member:list")
    @PostMapping("/member/list")
    @ResponseBody
    public TableDataInfo memberList(String keyword)
    {
        return list("member", keyword);
    }

    @RequiresPermissions("live:member:edit")
    @Log(title = "典恒会员", businessType = BusinessType.UPDATE)
    @PostMapping("/member/edit")
    @ResponseBody
    public AjaxResult memberEdit(@RequestParam Map<String, Object> body)
    {
        return edit("member", pickId(body, "id", "memberId", "member_id"), body);
    }

    @RequiresPermissions("live:member:view")
    @GetMapping("/member/view/{id}")
    @ResponseBody
    public AjaxResult memberView(@PathVariable("id") Long id)
    {
        return AjaxResult.success(dhLiveAdminService.selectAdminById("member", id));
    }

    @RequiresPermissions("live:member:edit")
    @Log(title = "典恒会员状态", businessType = BusinessType.UPDATE)
    @PostMapping("/member/changeStatus")
    @ResponseBody
    public AjaxResult memberChangeStatus(Long id, String status)
    {
        return changeStatus("member", id, status);
    }

    @RequiresPermissions("live:member:list")
    @PostMapping("/progress/list")
    @ResponseBody
    public TableDataInfo progressList(String keyword)
    {
        return list("progress", keyword);
    }

    @RequiresPermissions("live:member:list")
    @PostMapping("/points/list")
    @ResponseBody
    public TableDataInfo pointsList(String keyword)
    {
        return list("points", keyword);
    }

    private TableDataInfo list(String module, String keyword)
    {
        startPage();
        return getDataTable(dhLiveAdminService.selectAdminList(module, keyword));
    }

    private AjaxResult add(String module, Map<String, Object> body)
    {
        return toAjax(dhLiveAdminService.insertAdminRow(module, body));
    }

    private AjaxResult edit(String module, Long id, Map<String, Object> body)
    {
        return toAjax(dhLiveAdminService.updateAdminRow(module, id, body));
    }

    private AjaxResult remove(String module, String ids)
    {
        return toAjax(dhLiveAdminService.deleteAdminRows(module, ids));
    }

    private AjaxResult changeStatus(String module, Long id, String status)
    {
        return toAjax(dhLiveAdminService.updateAdminStatus(module, id, status));
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
