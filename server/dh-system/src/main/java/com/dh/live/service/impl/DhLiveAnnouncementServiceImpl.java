package com.dh.live.service.impl;

import java.util.List;
import java.util.Map;
import com.dh.live.mapper.DhLiveAnnouncementMapper;
import com.dh.live.service.IDhLiveAnnouncementService;
import com.dh.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 总部公告Service实现
 *
 * @author 3r_111
 */
@Service
public class DhLiveAnnouncementServiceImpl implements IDhLiveAnnouncementService
{
    @Autowired
    private DhLiveAnnouncementMapper announcementMapper;

    /**
     * 查询总部公告
     */
    @Override
    public Map<String, Object> selectAnnouncementById(Long annId)
    {
        return announcementMapper.selectAnnouncementById(annId);
    }

    /**
     * 查询总部公告列表
     */
    @Override
    public List<Map<String, Object>> selectAnnouncementList(String keyword, String publishStatus)
    {
        return announcementMapper.selectAnnouncementList(keyword, publishStatus);
    }

    /**
     * 新增总部公告
     */
    @Override
    public int insertAnnouncement(Map<String, Object> ann)
    {
        if (ann == null)
        {
            return 0;
        }
        // 设置默认值
        ann.put("delFlag", "0");
        if (StringUtils.isNull(ann.get("publishStatus")))
        {
            ann.put("publishStatus", "0");
        }
        if (StringUtils.isNull(ann.get("isPinned")))
        {
            ann.put("isPinned", "0");
        }
        if (StringUtils.isNull(ann.get("readCount")))
        {
            ann.put("readCount", 0);
        }
        if (StringUtils.isNull(ann.get("sort")))
        {
            ann.put("sort", 0);
        }
        if (StringUtils.isNull(ann.get("scope")))
        {
            ann.put("scope", "all");
        }
        return announcementMapper.insertAnnouncement(ann);
    }

    /**
     * 修改总部公告
     */
    @Override
    public int updateAnnouncement(Map<String, Object> ann)
    {
        if (ann == null || ann.get("annId") == null)
        {
            return 0;
        }
        return announcementMapper.updateAnnouncement(ann);
    }

    /**
     * 删除总部公告
     */
    @Override
    public int deleteAnnouncementById(Long annId)
    {
        return announcementMapper.deleteAnnouncementById(annId);
    }

    /**
     * 批量删除总部公告
     */
    @Override
    public int deleteAnnouncementByIds(String annIds)
    {
        if (StringUtils.isEmpty(annIds))
        {
            return 0;
        }
        return announcementMapper.deleteAnnouncementByIds(annIds);
    }

    /**
     * 修改发布状态
     */
    @Override
    public int changePublishStatus(Long annId, String publishStatus)
    {
        if (annId == null || StringUtils.isEmpty(publishStatus))
        {
            return 0;
        }
        return announcementMapper.updateAnnouncementPublishStatus(annId, publishStatus);
    }

    /**
     * 修改置顶状态
     */
    @Override
    public int changePinned(Long annId, String isPinned)
    {
        if (annId == null || StringUtils.isEmpty(isPinned))
        {
            return 0;
        }
        return announcementMapper.updateAnnouncementPinned(annId, isPinned);
    }
}