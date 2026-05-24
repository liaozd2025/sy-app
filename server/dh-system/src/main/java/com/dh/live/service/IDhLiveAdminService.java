package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 典恒直播后台管理业务接口。
 */
public interface IDhLiveAdminService
{
    List<Map<String, Object>> selectAdminList(String module, String keyword);

    Map<String, Object> selectAdminById(String module, Long id);

    int insertAdminRow(String module, Map<String, Object> body);

    int updateAdminRow(String module, Long id, Map<String, Object> body);

    int deleteAdminRows(String module, String ids);

    int updateAdminStatus(String module, Long id, String status);

    int replyConsultation(Long consultId, Long sysUserId, String content);

    int assignConsultation(Long consultId, Long sysUserId);

    int closeConsultation(Long consultId);
}
