package com.dh.live.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dh.common.core.text.Convert;
import com.dh.common.exception.ServiceException;
import com.dh.common.utils.StringUtils;
import com.dh.live.mapper.DhLiveAdminMapper;
import com.dh.live.service.IDhLiveAdminService;

/**
 * 典恒直播后台管理业务实现。
 */
@Service
public class DhLiveAdminServiceImpl implements IDhLiveAdminService
{
    private static final Map<String, ModuleMeta> MODULES = createModules();

    @Autowired
    private DhLiveAdminMapper adminMapper;

    @Override
    public List<Map<String, Object>> selectAdminList(String module, String keyword)
    {
        ModuleMeta meta = meta(module);
        return adminMapper.selectAdminList(meta.tableName, meta.titleColumn, keyword, meta.hasDelFlag);
    }

    @Override
    public Map<String, Object> selectAdminById(String module, Long id)
    {
        ModuleMeta meta = meta(module);
        return require(adminMapper.selectAdminById(meta.tableName, meta.idColumn, id), "数据不存在");
    }

    @Override
    public int insertAdminRow(String module, Map<String, Object> body)
    {
        ModuleMeta meta = meta(module);
        return adminMapper.insertAdminRow(meta.tableName, toColumns(meta, body));
    }

    @Override
    public int updateAdminRow(String module, Long id, Map<String, Object> body)
    {
        ModuleMeta meta = meta(module);
        return adminMapper.updateAdminRow(meta.tableName, meta.idColumn, id, toColumns(meta, body));
    }

    @Override
    public int deleteAdminRows(String module, String ids)
    {
        ModuleMeta meta = meta(module);
        return adminMapper.deleteAdminRows(meta.tableName, meta.idColumn, Convert.toLongArray(ids), meta.hasDelFlag);
    }

    @Override
    public int updateAdminStatus(String module, Long id, String status)
    {
        ModuleMeta meta = meta(module);
        if (StringUtils.isBlank(meta.statusColumn))
        {
            throw new ServiceException("当前模块不支持状态更新");
        }
        return adminMapper.updateAdminStatus(meta.tableName, meta.idColumn, id, meta.statusColumn, status);
    }

    @Override
    @Transactional
    public int replyConsultation(Long consultId, Long sysUserId, String content)
    {
        int rows = adminMapper.insertConsultationReply(consultId, sysUserId, content);
        adminMapper.updateConsultationStatus(consultId, "replied", sysUserId);
        return rows;
    }

    @Override
    public int assignConsultation(Long consultId, Long sysUserId)
    {
        return adminMapper.updateConsultationStatus(consultId, "assigned", sysUserId);
    }

    @Override
    public int closeConsultation(Long consultId)
    {
        return adminMapper.updateConsultationStatus(consultId, "closed", null);
    }

    private List<Map<String, Object>> toColumns(ModuleMeta meta, Map<String, Object> body)
    {
        List<Map<String, Object>> columns = new ArrayList<>();
        for (Map.Entry<String, Object> entry : body.entrySet())
        {
            String column = normalizeColumn(entry.getKey());
            if (!meta.allowedColumns.contains(column))
            {
                continue;
            }
            Map<String, Object> item = new HashMap<>();
            item.put("name", column);
            item.put("value", entry.getValue());
            columns.add(item);
        }
        return columns;
    }

    private String normalizeColumn(String key)
    {
        if (key == null)
        {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < key.length(); i++)
        {
            char c = key.charAt(i);
            if (Character.isUpperCase(c))
            {
                sb.append('_').append(Character.toLowerCase(c));
            }
            else
            {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private ModuleMeta meta(String module)
    {
        ModuleMeta meta = MODULES.get(module);
        if (meta == null)
        {
            throw new ServiceException("不支持的典恒直播模块：" + module);
        }
        return meta;
    }

    private Map<String, Object> require(Map<String, Object> data, String message)
    {
        if (data == null)
        {
            throw new ServiceException(message);
        }
        return data;
    }

    private static Map<String, ModuleMeta> createModules()
    {
        Map<String, ModuleMeta> map = new HashMap<>();
        map.put("session", meta("dh_live_session", "live_id", "title", "status", true,
                "biz_code", "course_id", "topic_id", "creator_id", "title", "subtitle", "description", "cover_image",
                "start_time", "end_time", "status", "h5_url", "replay_url", "duration_seconds", "audience_count",
                "reservation_count", "publish_status", "sort", "remark"));
        map.put("course", meta("dh_live_course", "course_id", "title", "publish_status", true,
                "biz_code", "topic_id", "creator_id", "title", "summary", "cover_image", "course_type",
                "publish_status", "view_count", "sort", "remark"));
        map.put("chapter", meta("dh_live_course_chapter", "chapter_id", "title", "publish_status", true,
                "course_id", "biz_code", "title", "source_type", "source_id", "duration_seconds", "sort",
                "publish_status", "remark"));
        map.put("material", meta("dh_live_material", "material_id", "title", "status", true,
                "live_id", "title", "description", "file_type", "file_url", "file_size", "sort", "status", "remark"));
        map.put("chat", meta("dh_live_chat_message", "message_id", "message", "status", false,
                "live_id", "member_id", "creator_id", "sender_type", "sender_name", "message", "status", "remark"));
        map.put("content", meta("dh_live_content", "content_id", "title", "publish_status", true,
                "biz_code", "topic_id", "creator_id", "content_kind", "title", "summary", "body", "cover_image",
                "video_url", "duration_seconds", "read_time_minutes", "likes_count", "favorites_count",
                "comments_count", "publish_status", "publish_time", "sort", "remark"));
        map.put("encyclopedia", meta("dh_live_encyclopedia", "entry_id", "title", "publish_status", true,
                "biz_code", "category", "title", "description", "body", "tags_json", "publish_status", "sort",
                "remark"));
        map.put("feed", meta("dh_live_feed", "feed_id", "title", "publish_status", true,
                "biz_code", "channel", "target_type", "target_id", "creator_id", "title", "description",
                "cover_image", "tone", "primary_action", "secondary_action", "likes_count", "favorites_count",
                "comments_count", "sort", "publish_status", "online_time", "offline_time", "remark"));
        map.put("recommendation", meta("dh_live_recommendation", "rec_id", "title_override", "status", true,
                "scene", "target_type", "target_id", "title_override", "subtitle_override", "cover_override",
                "action_text", "sort", "online_time", "offline_time", "status", "remark"));
        map.put("quiz", meta("dh_live_quiz_question", "question_id", "prompt", "publish_status", true,
                "biz_code", "topic_id", "source_type", "source_id", "type", "prompt", "options_json", "answer_key",
                "explanation", "difficulty", "sort", "publish_status", "remark"));
        map.put("answer", meta("dh_live_quiz_answer_record", "record_id", "selected_answer", "", false,
                "member_id", "question_id", "selected_answer", "is_correct", "answer_time", "points_awarded", "remark"));
        map.put("member", meta("dh_live_member", "member_id", "nickname", "status", true,
                "phone", "nickname", "avatar", "member_label", "status", "last_login_time", "remark"));
        map.put("progress", meta("dh_live_learning_progress", "progress_id", "target_type", "status", false,
                "member_id", "target_type", "target_id", "progress_percent", "study_seconds", "last_position_seconds",
                "last_study_time", "completed_time", "status", "remark"));
        map.put("points", meta("dh_live_member_points_log", "log_id", "description", "", false,
                "member_id", "points_change", "change_type", "source_type", "source_id", "balance_after",
                "description", "remark"));
        map.put("consultation", meta("dh_live_consultation", "consult_id", "title", "status", true,
                "member_id", "target_type", "target_id", "title", "content", "status", "assigned_sys_user_id",
                "close_time", "remark"));
        return Collections.unmodifiableMap(map);
    }

    private static ModuleMeta meta(String tableName, String idColumn, String titleColumn, String statusColumn,
            boolean hasDelFlag, String... allowedColumns)
    {
        return new ModuleMeta(tableName, idColumn, titleColumn, statusColumn, hasDelFlag, Arrays.asList(allowedColumns));
    }

    private static final class ModuleMeta
    {
        private final String tableName;

        private final String idColumn;

        private final String titleColumn;

        private final String statusColumn;

        private final boolean hasDelFlag;

        private final List<String> allowedColumns;

        private ModuleMeta(String tableName, String idColumn, String titleColumn, String statusColumn,
                boolean hasDelFlag, List<String> allowedColumns)
        {
            this.tableName = tableName;
            this.idColumn = idColumn;
            this.titleColumn = titleColumn;
            this.statusColumn = statusColumn;
            this.hasDelFlag = hasDelFlag;
            this.allowedColumns = allowedColumns;
        }
    }
}
