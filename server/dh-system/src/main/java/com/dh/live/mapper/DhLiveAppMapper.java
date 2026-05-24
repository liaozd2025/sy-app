package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 典恒直播 APP 数据访问层。
 *
 * v1 删除（详见 ADR-0005/0007）：
 *   - selectLiveMaterials（资料下载交线下二维码）
 *   - selectLiveChatMessages / insertLiveChatMessage（聊天交火山）
 *   - selectFeed / selectComments / insertComment（无社交）
 *   - upsertFavorite / upsertLike / upsertCreatorFollow（无社交）
 *   - countFavorites（收藏 UI 隐藏，DB 表保留）
 *   - selectConsultations / selectConsultationById / selectConsultationReplies / insertConsultation（咨询推 v2）
 */
public interface DhLiveAppMapper
{
    Map<String, Object> selectMemberById(@Param("memberId") Long memberId);

    Map<String, Object> selectMemberProfile(@Param("memberId") Long memberId);

    Map<String, Object> selectMemberSetting(@Param("memberId") Long memberId);

    Map<String, Object> selectPointsAccount(@Param("memberId") Long memberId);

    Map<String, Object> selectLatestDailyStat(@Param("memberId") Long memberId);

    int countReservations(@Param("memberId") Long memberId);

    List<Map<String, Object>> selectRecommendations(@Param("scene") String scene);

    List<Map<String, Object>> selectLiveSessions(@Param("status") String status, @Param("memberId") Long memberId);

    Map<String, Object> selectLiveSessionByBizCode(@Param("bizCode") String bizCode, @Param("memberId") Long memberId);

    Map<String, Object> selectLiveSessionById(@Param("liveId") Long liveId);

    int upsertLiveReservation(@Param("memberId") Long memberId, @Param("liveId") Long liveId,
            @Param("reminderTime") String reminderTime, @Param("status") String status);

    int updateLiveReservationCount(@Param("liveId") Long liveId, @Param("delta") int delta);

    int upsertLiveWatchRecord(@Param("memberId") Long memberId, @Param("liveId") Long liveId,
            @Param("watchSeconds") Integer watchSeconds, @Param("progressPercent") Double progressPercent,
            @Param("lastPositionSeconds") Integer lastPositionSeconds);

    Map<String, Object> selectCourseByBizCode(@Param("bizCode") String bizCode, @Param("memberId") Long memberId);

    List<Map<String, Object>> selectCourseChapters(@Param("courseId") Long courseId, @Param("memberId") Long memberId);

    List<Map<String, Object>> selectContents(@Param("topicCode") String topicCode, @Param("kind") String kind,
            @Param("keyword") String keyword, @Param("memberId") Long memberId);

    Map<String, Object> selectContentByBizCode(@Param("bizCode") String bizCode, @Param("memberId") Long memberId);

    List<Map<String, Object>> selectEncyclopedia(@Param("category") String category, @Param("keyword") String keyword,
            @Param("memberId") Long memberId);

    Map<String, Object> selectEncyclopediaByBizCode(@Param("bizCode") String bizCode, @Param("memberId") Long memberId);

    Map<String, Object> selectTodayQuestion(@Param("memberId") Long memberId);

    Map<String, Object> selectQuestionByBizCode(@Param("bizCode") String bizCode);

    Map<String, Object> selectAnswerRecord(@Param("memberId") Long memberId, @Param("questionId") Long questionId);

    int insertAnswerRecord(@Param("memberId") Long memberId, @Param("questionId") Long questionId,
            @Param("selectedAnswer") String selectedAnswer, @Param("isCorrect") String isCorrect,
            @Param("pointsAwarded") int pointsAwarded);

    int insertPointsAccountIfAbsent(@Param("memberId") Long memberId);

    int updatePointsAccount(@Param("memberId") Long memberId, @Param("pointsChange") int pointsChange);

    int insertPointsLog(@Param("memberId") Long memberId, @Param("pointsChange") int pointsChange,
            @Param("changeType") String changeType, @Param("sourceType") String sourceType,
            @Param("sourceId") Long sourceId, @Param("description") String description);

    Map<String, Object> selectDailyClaimLog(@Param("memberId") Long memberId);

    List<Map<String, Object>> selectLearningProgress(@Param("memberId") Long memberId, @Param("targetType") String targetType);

    List<Map<String, Object>> selectPointsLogs(@Param("memberId") Long memberId);

    int updateMember(@Param("memberId") Long memberId, @Param("data") Map<String, Object> data);

    int upsertMemberProfile(@Param("memberId") Long memberId, @Param("data") Map<String, Object> data);

    int updateMemberSetting(@Param("memberId") Long memberId, @Param("data") Map<String, Object> data);
}
