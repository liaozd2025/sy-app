package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 典恒直播后台管理数据访问层。
 */
public interface DhLiveAdminMapper
{
    List<Map<String, Object>> selectAdminList(@Param("tableName") String tableName, @Param("titleColumn") String titleColumn,
            @Param("keyword") String keyword, @Param("hasDelFlag") boolean hasDelFlag);

    Map<String, Object> selectAdminById(@Param("tableName") String tableName, @Param("idColumn") String idColumn,
            @Param("id") Long id);

    int insertAdminRow(@Param("tableName") String tableName, @Param("columns") List<Map<String, Object>> columns);

    int updateAdminRow(@Param("tableName") String tableName, @Param("idColumn") String idColumn, @Param("id") Long id,
            @Param("columns") List<Map<String, Object>> columns);

    int deleteAdminRows(@Param("tableName") String tableName, @Param("idColumn") String idColumn,
            @Param("ids") Long[] ids, @Param("hasDelFlag") boolean hasDelFlag);

    int updateAdminStatus(@Param("tableName") String tableName, @Param("idColumn") String idColumn,
            @Param("id") Long id, @Param("statusColumn") String statusColumn, @Param("status") String status);

    int insertConsultationReply(@Param("consultId") Long consultId, @Param("sysUserId") Long sysUserId,
            @Param("content") String content);

    int updateConsultationStatus(@Param("consultId") Long consultId, @Param("status") String status,
            @Param("assignedSysUserId") Long assignedSysUserId);
}
