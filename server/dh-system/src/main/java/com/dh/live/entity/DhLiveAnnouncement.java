package com.dh.live.entity;

import java.util.Date;

/**
 * 总部公告对象 dh_live_announcement
 *
 * @author 3r_111
 */
public class DhLiveAnnouncement
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long annId;

    /** 业务编码 */
    private String bizCode;

    /** 公告标题 */
    private String title;

    /** 摘要 */
    private String summary;

    /** 公告正文（富文本HTML） */
    private String content;

    /** 发布范围（all/org/tag） */
    private String scope;

    /** 范围目标ID列表（JSON） */
    private String scopeIdsJson;

    /** 是否置顶（0否 1是） */
    private String isPinned;

    /** 发布时间 */
    private Date publishTime;

    /** 过期时间 */
    private Date expireTime;

    /** 发布状态（0草稿 1已发布 2已下线） */
    private String publishStatus;

    /** 阅读数 */
    private Integer readCount;

    /** 排序 */
    private Integer sort;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    private Date createTime;

    /** 更新者 */
    private String updateBy;

    /** 更新时间 */
    private Date updateTime;

    /** 备注 */
    private String remark;

    /** 删除标志（0存在 1删除） */
    private String delFlag;

    public Long getAnnId()
    {
        return annId;
    }

    public void setAnnId(Long annId)
    {
        this.annId = annId;
    }

    public String getBizCode()
    {
        return bizCode;
    }

    public void setBizCode(String bizCode)
    {
        this.bizCode = bizCode;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getSummary()
    {
        return summary;
    }

    public void setSummary(String summary)
    {
        this.summary = summary;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }

    public String getScope()
    {
        return scope;
    }

    public void setScope(String scope)
    {
        this.scope = scope;
    }

    public String getScopeIdsJson()
    {
        return scopeIdsJson;
    }

    public void setScopeIdsJson(String scopeIdsJson)
    {
        this.scopeIdsJson = scopeIdsJson;
    }

    public String getIsPinned()
    {
        return isPinned;
    }

    public void setIsPinned(String isPinned)
    {
        this.isPinned = isPinned;
    }

    public Date getPublishTime()
    {
        return publishTime;
    }

    public void setPublishTime(Date publishTime)
    {
        this.publishTime = publishTime;
    }

    public Date getExpireTime()
    {
        return expireTime;
    }

    public void setExpireTime(Date expireTime)
    {
        this.expireTime = expireTime;
    }

    public String getPublishStatus()
    {
        return publishStatus;
    }

    public void setPublishStatus(String publishStatus)
    {
        this.publishStatus = publishStatus;
    }

    public Integer getReadCount()
    {
        return readCount;
    }

    public void setReadCount(Integer readCount)
    {
        this.readCount = readCount;
    }

    public Integer getSort()
    {
        return sort;
    }

    public void setSort(Integer sort)
    {
        this.sort = sort;
    }

    public String getCreateBy()
    {
        return createBy;
    }

    public void setCreateBy(String createBy)
    {
        this.createBy = createBy;
    }

    public Date getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(Date createTime)
    {
        this.createTime = createTime;
    }

    public String getUpdateBy()
    {
        return updateBy;
    }

    public void setUpdateBy(String updateBy)
    {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime()
    {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime)
    {
        this.updateTime = updateTime;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getDelFlag()
    {
        return delFlag;
    }

    public void setDelFlag(String delFlag)
    {
        this.delFlag = delFlag;
    }

    @Override
    public String toString()
    {
        return "DhLiveAnnouncement{" +
                "annId=" + annId +
                ", bizCode='" + bizCode + '\'' +
                ", title='" + title + '\'' +
                ", scope='" + scope + '\'' +
                ", isPinned='" + isPinned + '\'' +
                ", publishStatus='" + publishStatus + '\'' +
                ", readCount=" + readCount +
                ", delFlag='" + delFlag + '\'' +
                '}';
    }
}