package com.dh.live.service.impl;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dh.common.exception.ServiceException;
import com.dh.common.utils.StringUtils;
import com.dh.live.mapper.DhLiveAppMapper;
import com.dh.live.service.IDhLiveAppService;

/**
 * 典恒直播 APP 业务实现。
 *
 * v1 范围与已删除能力，详见 {@link IDhLiveAppService} 与 ADR-0005/0007。
 */
@Service
public class DhLiveAppServiceImpl implements IDhLiveAppService
{
    private static final Long DEFAULT_MEMBER_ID = 10001L;

    private static final int DAILY_POINTS = 4;

    private static final int QUIZ_CORRECT_POINTS = 10;

    private static final DecimalFormat COUNT_FORMAT = new DecimalFormat("#.#");

    @Autowired
    private DhLiveAppMapper appMapper;

    @Override
    public Map<String, Object> getHome(Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("searchHint", "1万人看过「睡眠修复课」");
        data.put("pointsClaimable", appMapper.selectDailyClaimLog(actualMemberId) == null);
        data.put("featuredLive", first(appMapper.selectRecommendations("home_featured_live")));
        data.put("upcomingLives", appMapper.selectRecommendations("home_upcoming_live"));
        data.put("recentLearning", appMapper.selectRecommendations("home_recent_learning"));
        data.put("todayQuizBrief", appMapper.selectTodayQuestion(actualMemberId));
        data.put("profileBrief", buildProfileBrief(actualMemberId));
        return data;
    }

    @Override
    @Transactional
    public Map<String, Object> claimDailyPoints(Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> existed = appMapper.selectDailyClaimLog(actualMemberId);
        appMapper.insertPointsAccountIfAbsent(actualMemberId);
        if (existed == null)
        {
            appMapper.updatePointsAccount(actualMemberId, DAILY_POINTS);
            appMapper.insertPointsLog(actualMemberId, DAILY_POINTS, "earn", "daily_checkin", null, "每日领取积分");
        }
        Map<String, Object> account = appMapper.selectPointsAccount(actualMemberId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("claimed", true);
        result.put("pointsChange", existed == null ? DAILY_POINTS : 0);
        result.put("currentPoints", value(account, "currentPoints", 0));
        return result;
    }

    @Override
    public List<Map<String, Object>> selectLiveSessions(String status, Long memberId)
    {
        List<Map<String, Object>> list = appMapper.selectLiveSessions(toLiveStatusCode(status), normalizeMemberId(memberId));
        for (Map<String, Object> item : list)
        {
            enrichLiveSession(item);
        }
        return list;
    }

    @Override
    public Map<String, Object> selectLiveSessionDetail(String bizCode, Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> session = require(appMapper.selectLiveSessionByBizCode(bizCode, actualMemberId), "直播不存在");
        enrichLiveSession(session);
        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("session", session);
        // v1 删除：materials（资料下载交线下二维码）、chatMessages（聊天交火山）、chapters（直播与课程解耦）
        detail.put("reserved", boolValue(session.get("reserved")));
        detail.put("watchProgress", value(session, "progress", 0));
        return detail;
    }

    @Override
    @Transactional
    public Map<String, Object> reserveLive(String bizCode, Long memberId, boolean reserved, Integer reminderMinutes)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> live = require(appMapper.selectLiveSessionByBizCode(bizCode, actualMemberId), "直播不存在");
        Long liveId = longValue(live.get("id"));
        boolean wasReserved = boolValue(live.get("reserved"));
        String reminderTime = reserved ? reminderExpression(reminderMinutes) : null;
        appMapper.upsertLiveReservation(actualMemberId, liveId, reminderTime, reserved ? "0" : "1");
        if (wasReserved != reserved)
        {
            appMapper.updateLiveReservationCount(liveId, reserved ? 1 : -1);
        }
        Map<String, Object> refreshed = require(appMapper.selectLiveSessionByBizCode(bizCode, actualMemberId), "直播不存在");
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("reserved", reserved);
        result.put("reservedCount", value(refreshed, "reservationCount", 0));
        result.put("reminderTime", reminderTime);
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateLiveWatchProgress(String bizCode, Long memberId, Map<String, Object> body)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> live = require(appMapper.selectLiveSessionByBizCode(bizCode, actualMemberId), "直播不存在");
        Integer watchSeconds = intValue(body.get("watchSeconds"), 0);
        Double progressPercent = doubleValue(body.get("progressPercent"), 0D);
        Integer lastPositionSeconds = intValue(body.get("lastPositionSeconds"), 0);
        appMapper.upsertLiveWatchRecord(actualMemberId, longValue(live.get("id")), watchSeconds, progressPercent, lastPositionSeconds);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("progressPercent", progressPercent);
        result.put("lastPositionSeconds", lastPositionSeconds);
        return result;
    }

    @Override
    public Map<String, Object> selectCourseDetail(String bizCode, Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> course = require(appMapper.selectCourseByBizCode(bizCode, actualMemberId), "课程不存在");
        Long courseId = longValue(course.get("id"));
        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("course", course);
        detail.put("chapters", appMapper.selectCourseChapters(courseId, actualMemberId));
        detail.put("progress", value(course, "progress", 0));
        return detail;
    }

    @Override
    public List<Map<String, Object>> selectContents(String topicCode, String kind, String keyword, Long memberId)
    {
        List<Map<String, Object>> list = appMapper.selectContents(topicCode, kind, keyword, normalizeMemberId(memberId));
        for (Map<String, Object> item : list)
        {
            enrichCounts(item);
        }
        return list;
    }

    @Override
    public Map<String, Object> selectContentDetail(String bizCode, Long memberId)
    {
        Map<String, Object> content = require(appMapper.selectContentByBizCode(bizCode, normalizeMemberId(memberId)), "内容不存在");
        enrichCounts(content);
        return content;
    }

    @Override
    public List<Map<String, Object>> selectEncyclopedia(String category, String keyword, Long memberId)
    {
        return appMapper.selectEncyclopedia(category, keyword, normalizeMemberId(memberId));
    }

    @Override
    public Map<String, Object> selectEncyclopediaDetail(String bizCode, Long memberId)
    {
        return require(appMapper.selectEncyclopediaByBizCode(bizCode, normalizeMemberId(memberId)), "百科词条不存在");
    }

    @Override
    public Map<String, Object> getTodayQuiz(Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> question = require(appMapper.selectTodayQuestion(actualMemberId), "今日题目未配置");
        boolean answered = question.get("selectedAnswer") != null;
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("topic", value(question, "topic", ""));
        view.put("index", 1);
        view.put("total", 5);
        view.put("progressPercent", quizProgress(actualMemberId));
        if (!answered)
        {
            question.remove("answerId");
            question.remove("explanation");
        }
        view.put("question", question);
        view.put("answeredRecord", answered ? question : null);
        view.put("relatedCards", appMapper.selectRecommendations("quiz_related"));
        return view;
    }

    @Override
    @Transactional
    public Map<String, Object> answerQuestion(String bizCode, Long memberId, String selectedAnswer)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> question = require(appMapper.selectQuestionByBizCode(bizCode), "题目不存在");
        Long questionId = longValue(question.get("id"));
        Map<String, Object> existed = appMapper.selectAnswerRecord(actualMemberId, questionId);
        if (existed != null)
        {
            return answerResult(question, existed, 0);
        }
        String answerKey = text(question, "answerId", "");
        boolean correct = StringUtils.equalsIgnoreCase(answerKey, selectedAnswer);
        int points = correct ? QUIZ_CORRECT_POINTS : 0;
        appMapper.insertAnswerRecord(actualMemberId, questionId, selectedAnswer, correct ? "1" : "0", points);
        if (points > 0)
        {
            appMapper.insertPointsAccountIfAbsent(actualMemberId);
            appMapper.updatePointsAccount(actualMemberId, points);
            appMapper.insertPointsLog(actualMemberId, points, "earn", "quiz", questionId, "答题奖励");
        }
        Map<String, Object> record = appMapper.selectAnswerRecord(actualMemberId, questionId);
        return answerResult(question, record, points);
    }

    @Override
    public Map<String, Object> getLearningSummary(Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> data = new LinkedHashMap<>();
        data.putAll(buildProfileBrief(actualMemberId));
        data.put("recentLearning", appMapper.selectLearningProgress(actualMemberId, null));
        data.put("weeklyPlan", Arrays.asList("睡眠专题 4/5", "饮食专题 8/10"));
        return data;
    }

    @Override
    public List<Map<String, Object>> selectLearningProgress(Long memberId, String targetType)
    {
        return appMapper.selectLearningProgress(normalizeMemberId(memberId), targetType);
    }

    @Override
    public Map<String, Object> getMemberProfile(Long memberId)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("member", appMapper.selectMemberById(actualMemberId));
        result.put("profile", appMapper.selectMemberProfile(actualMemberId));
        result.put("settings", appMapper.selectMemberSetting(actualMemberId));
        result.put("stats", buildProfileBrief(actualMemberId));
        // v1 个人中心菜单：删除"下载资料 / 收藏/清单 / 咨询记录"（详见 ADR-0005/0007，v2 视情恢复）
        result.put("accountMenus", Arrays.asList("我的必修课", "积分商城", "我的兑换码", "通知中心"));
        result.put("contentMenus", Arrays.asList("最近学习", "学习报告"));
        result.put("serviceRows", Arrays.asList("本周计划", "提醒设置"));
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateMemberProfile(Long memberId, Map<String, Object> body)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> memberData = keep(body, "nickname", "avatar");
        if (!memberData.isEmpty())
        {
            appMapper.updateMember(actualMemberId, memberData);
        }
        Map<String, Object> profileData = keep(body, "gender", "birthday", "focus_tags_json", "focusTagsJson", "region", "health_notes", "healthNotes");
        if (!profileData.isEmpty())
        {
            profileData = normalizeKeys(profileData);
            appMapper.upsertMemberProfile(actualMemberId, profileData);
        }
        return getMemberProfile(actualMemberId);
    }

    @Override
    public Map<String, Object> getMemberSettings(Long memberId)
    {
        return appMapper.selectMemberSetting(normalizeMemberId(memberId));
    }

    @Override
    public Map<String, Object> updateMemberSettings(Long memberId, Map<String, Object> body)
    {
        Long actualMemberId = normalizeMemberId(memberId);
        Map<String, Object> settingData = normalizeKeys(keep(body, "liveReminderEnabled", "live_reminder_enabled",
                "liveReminderMinutes", "live_reminder_minutes", "wifiDownloadOnly", "wifi_download_only"));
        if (!settingData.isEmpty())
        {
            appMapper.updateMemberSetting(actualMemberId, settingData);
        }
        return getMemberSettings(actualMemberId);
    }

    @Override
    public List<Map<String, Object>> selectPointsLogs(Long memberId)
    {
        return appMapper.selectPointsLogs(normalizeMemberId(memberId));
    }

    private Map<String, Object> buildProfileBrief(Long memberId)
    {
        Map<String, Object> member = appMapper.selectMemberById(memberId);
        Map<String, Object> stat = appMapper.selectLatestDailyStat(memberId);
        Map<String, Object> account = appMapper.selectPointsAccount(memberId);
        Map<String, Object> brief = new LinkedHashMap<>();
        brief.put("name", text(member, "nickname", "会员"));
        brief.put("memberLabel", text(member, "memberLabel", "私域会员"));
        brief.put("streakDays", value(stat, "streakDays", 0));
        brief.put("reservedCount", appMapper.countReservations(memberId));
        // v1 删除：favoriteCount（收藏 UI 隐藏）
        brief.put("quizProgress", quizProgress(memberId));
        brief.put("points", value(account, "currentPoints", 0));
        return brief;
    }

    private int quizProgress(Long memberId)
    {
        Map<String, Object> stat = appMapper.selectLatestDailyStat(memberId);
        Number quizCount = number(value(stat, "quizCount", 0));
        if (quizCount.intValue() <= 0)
        {
            return 0;
        }
        return Math.min(100, quizCount.intValue() * 20);
    }

    private void enrichLiveSession(Map<String, Object> item)
    {
        String code = textValue(item.get("statusCode"));
        item.put("status", toAppLiveStatus(code));
        item.put("timeLabel", toTimeLabel(code, item.get("startTime")));
        item.put("reserved", boolValue(item.get("reserved")));
        item.put("audienceLabel", countLabel(number(value(item, "audienceCount", 0)).longValue()) + " 人正在看");
        item.put("reservationLabel", countLabel(number(value(item, "reservationCount", 0)).longValue()) + "人已预约");
    }

    private void enrichCounts(Map<String, Object> item)
    {
        // v1 删除互动 UI（点赞/收藏/评论），但 enrich 字段保留以兼容现有原型字段
        long likes = number(value(item, "likesCount", 0)).longValue();
        long favorites = number(value(item, "favoritesCount", 0)).longValue();
        long comments = number(value(item, "commentsCount", 0)).longValue();
        item.put("likeLabel", countLabel(likes));
        item.put("favoriteLabel", countLabel(favorites));
        item.put("commentLabel", countLabel(comments));
    }

    private String toLiveStatusCode(String status)
    {
        if (StringUtils.isBlank(status) || "all".equals(status))
        {
            return null;
        }
        if ("scheduled".equals(status))
        {
            return "0";
        }
        if ("live".equals(status))
        {
            return "1";
        }
        if ("replay".equals(status))
        {
            return "2";
        }
        return status;
    }

    private String toAppLiveStatus(String statusCode)
    {
        if ("1".equals(statusCode))
        {
            return "live";
        }
        if ("2".equals(statusCode))
        {
            return "replay";
        }
        if ("3".equals(statusCode))
        {
            return "ended";
        }
        return "scheduled";
    }

    private String toTimeLabel(String statusCode, Object startTime)
    {
        if ("1".equals(statusCode))
        {
            return "NOW";
        }
        if ("2".equals(statusCode))
        {
            return "回放";
        }
        if (startTime instanceof Date)
        {
            return new SimpleDateFormat("HH:mm", Locale.CHINA).format((Date) startTime);
        }
        return "";
    }

    private String countLabel(long count)
    {
        if (count >= 10000)
        {
            return COUNT_FORMAT.format(count / 10000D) + "w";
        }
        return String.valueOf(count);
    }

    private String reminderExpression(Integer reminderMinutes)
    {
        int minutes = reminderMinutes == null ? 15 : reminderMinutes;
        return "直播前 " + minutes + " 分钟";
    }

    private Map<String, Object> answerResult(Map<String, Object> question, Map<String, Object> record, int pointsAwarded)
    {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("correct", "1".equals(textValue(record.get("isCorrect"))));
        result.put("selectedAnswer", record.get("selectedAnswer"));
        result.put("answerId", question.get("answerId"));
        result.put("explanation", question.get("explanation"));
        result.put("pointsAwarded", pointsAwarded);
        result.put("progressPercent", quizProgress(longValue(record.get("memberId"))));
        return result;
    }

    private Map<String, Object> normalizeKeys(Map<String, Object> source)
    {
        Map<String, Object> result = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : source.entrySet())
        {
            result.put(normalizeColumn(entry.getKey()), entry.getValue());
        }
        return result;
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

    private Map<String, Object> keep(Map<String, Object> body, String... names)
    {
        Map<String, Object> result = new LinkedHashMap<>();
        for (String name : names)
        {
            if (body.containsKey(name))
            {
                result.put(name, body.get(name));
            }
        }
        return result;
    }

    private Long normalizeMemberId(Long memberId)
    {
        return memberId == null ? DEFAULT_MEMBER_ID : memberId;
    }

    private Map<String, Object> first(List<Map<String, Object>> list)
    {
        return list == null || list.isEmpty() ? null : list.get(0);
    }

    private Map<String, Object> require(Map<String, Object> data, String message)
    {
        if (data == null)
        {
            throw new ServiceException(message);
        }
        return data;
    }

    private Object value(Map<String, Object> map, String key, Object defaultValue)
    {
        return map == null || map.get(key) == null ? defaultValue : map.get(key);
    }

    private String text(Map<String, Object> map, String key, String defaultValue)
    {
        Object value = value(map, key, defaultValue);
        return value == null ? defaultValue : value.toString();
    }

    private String textValue(Object value)
    {
        return value == null ? "" : value.toString();
    }

    private Long longValue(Object value)
    {
        if (value == null || StringUtils.isBlank(value.toString()))
        {
            return null;
        }
        return Long.valueOf(value.toString());
    }

    private Integer intValue(Object value, Integer defaultValue)
    {
        if (value == null || StringUtils.isBlank(value.toString()))
        {
            return defaultValue;
        }
        return Integer.valueOf(value.toString());
    }

    private Double doubleValue(Object value, Double defaultValue)
    {
        if (value == null || StringUtils.isBlank(value.toString()))
        {
            return defaultValue;
        }
        return Double.valueOf(value.toString());
    }

    private boolean boolValue(Object value)
    {
        if (value == null)
        {
            return false;
        }
        String text = value.toString();
        return "true".equalsIgnoreCase(text) || "1".equals(text);
    }

    private Number number(Object value)
    {
        if (value instanceof Number)
        {
            return (Number) value;
        }
        if (value == null || StringUtils.isBlank(value.toString()))
        {
            return 0;
        }
        return Double.valueOf(value.toString());
    }
}
