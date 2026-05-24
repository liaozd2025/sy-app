package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 典恒直播 APP 业务接口。
 *
 * v1 删除（详见 ADR-0005/0007）：
 *   - selectLiveChatMessages / sendLiveChatMessage（聊天交火山）
 *   - toggleFavorite / toggleLike / followCreator（无社交）
 *   - selectFeed（无发现流）
 *   - selectComments / addComment（无评论）
 *   - selectConsultations / addConsultation / selectConsultationDetail（咨询推 v2）
 */
public interface IDhLiveAppService
{
    Map<String, Object> getHome(Long memberId);

    Map<String, Object> claimDailyPoints(Long memberId);

    List<Map<String, Object>> selectLiveSessions(String status, Long memberId);

    Map<String, Object> selectLiveSessionDetail(String bizCode, Long memberId);

    Map<String, Object> reserveLive(String bizCode, Long memberId, boolean reserved, Integer reminderMinutes);

    Map<String, Object> updateLiveWatchProgress(String bizCode, Long memberId, Map<String, Object> body);

    Map<String, Object> selectCourseDetail(String bizCode, Long memberId);

    List<Map<String, Object>> selectContents(String topicCode, String kind, String keyword, Long memberId);

    Map<String, Object> selectContentDetail(String bizCode, Long memberId);

    List<Map<String, Object>> selectEncyclopedia(String category, String keyword, Long memberId);

    Map<String, Object> selectEncyclopediaDetail(String bizCode, Long memberId);

    Map<String, Object> getTodayQuiz(Long memberId);

    Map<String, Object> answerQuestion(String bizCode, Long memberId, String selectedAnswer);

    Map<String, Object> getLearningSummary(Long memberId);

    List<Map<String, Object>> selectLearningProgress(Long memberId, String targetType);

    Map<String, Object> getMemberProfile(Long memberId);

    Map<String, Object> updateMemberProfile(Long memberId, Map<String, Object> body);

    Map<String, Object> getMemberSettings(Long memberId);

    Map<String, Object> updateMemberSettings(Long memberId, Map<String, Object> body);

    List<Map<String, Object>> selectPointsLogs(Long memberId);
}
