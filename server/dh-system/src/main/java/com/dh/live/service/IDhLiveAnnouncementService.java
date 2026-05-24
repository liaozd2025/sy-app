package com.dh.live.service;

import java.util.List;
import java.util.Map;

/**
 * 总部公告Service接口
 *
 * @author 3r_111
 */
public interface IDhLiveAnnouncementService
{
    /**
     * 查询总部公告
     *
     * @param annId 主键ID
     * @return 总部公告
     */
    Map<String, Object> selectAnnouncementById(Long annId);

    /**
     * 查询总部公告列表
     *
     * @param keyword 关键词
     * @param publishStatus 发布状态
     * @return 总部公告集合
     */
    List<Map<String, Object>> selectAnnouncementList(String keyword, String publishStatus);

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
    int deleteAnnouncementById(Long annId);

    /**
     * 批量删除总部公告
     *
     * @param annIds 需要删除的数据ID
     * @return 结果
     */
    int deleteAnnouncementByIds(String annIds);

    /**
     * 修改发布状态
     *
     * @param annId 主键ID
     * @param publishStatus 发布状态
     * @return 结果
     */
    int changePublishStatus(Long annId, String publishStatus);

    /**
     * 修改置顶状态
     *
     * @param annId 主键ID
     * @param isPinned 是否置顶
     * @return 结果
     */
    int changePinned(Long annId, String isPinned);
}