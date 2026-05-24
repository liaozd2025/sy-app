package com.dh.live.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 总部公告Mapper接口
 *
 * @author 3r_111
 */
public interface DhLiveAnnouncementMapper
{
    /**
     * 查询总部公告
     *
     * @param annId 主键ID
     * @return 总部公告
     */
    Map<String, Object> selectAnnouncementById(@Param("annId") Long annId);

    /**
     * 查询总部公告列表
     *
     * @param keyword 关键词
     * @param publishStatus 发布状态
     * @return 总部公告集合
     */
    List<Map<String, Object>> selectAnnouncementList(@Param("keyword") String keyword,
                                                     @Param("publishStatus") String publishStatus);

    /**
     * 新增总部公告
     *
     * @param ann 总部公告
     * @return 结果
     */
    int insertAnnouncement(Map<String, Object> ann);

    /**
     * 修改总部公告
     *
     * @param ann 总部公告
     * @return 结果
     */
    int updateAnnouncement(Map<String, Object> ann);

    /**
     * 删除总部公告
     *
     * @param annId 主键ID
     * @return 结果
     */
    int deleteAnnouncementById(@Param("annId") Long annId);

    /**
     * 批量删除总部公告
     *
     * @param annIds 需要删除的数据ID
     * @return 结果
     */
    int deleteAnnouncementByIds(@Param("annIds") String annIds);

    /**
     * 修改发布状态
     *
     * @param annId 主键ID
     * @param publishStatus 发布状态
     * @return 结果
     */
    int updateAnnouncementPublishStatus(@Param("annId") Long annId, @Param("publishStatus") String publishStatus);

    /**
     * 修改置顶状态
     *
     * @param annId 主键ID
     * @param isPinned 是否置顶
     * @return 结果
     */
    int updateAnnouncementPinned(@Param("annId") Long annId, @Param("isPinned") String isPinned);
}