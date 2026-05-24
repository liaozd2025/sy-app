package com.dh.live.entity;

import java.util.Date;

/**
 * 兑换码池对象 dh_live_reward_code
 *
 * @author 3r_111
 */
public class DhLiveRewardCode
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long codeId;

    /** 关联福利ID */
    private Long itemId;

    /** 兑换码 */
    private String code;

    /** 是否已使用（0否 1是） */
    private String isUsed;

    /** 使用者会员ID */
    private Long usedBy;

    /** 使用时间 */
    private Date usedTime;

    /** 过期时间 */
    private Date expireTime;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    private Date createTime;

    /** 更新时间 */
    private Date updateTime;

    /** 备注 */
    private String remark;

    /** 删除标志（0存在 1删除） */
    private String delFlag;

    public Long getCodeId()
    {
        return codeId;
    }

    public void setCodeId(Long codeId)
    {
        this.codeId = codeId;
    }

    public Long getItemId()
    {
        return itemId;
    }

    public void setItemId(Long itemId)
    {
        this.itemId = itemId;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public String getIsUsed()
    {
        return isUsed;
    }

    public void setIsUsed(String isUsed)
    {
        this.isUsed = isUsed;
    }

    public Long getUsedBy()
    {
        return usedBy;
    }

    public void setUsedBy(Long usedBy)
    {
        this.usedBy = usedBy;
    }

    public Date getUsedTime()
    {
        return usedTime;
    }

    public void setUsedTime(Date usedTime)
    {
        this.usedTime = usedTime;
    }

    public Date getExpireTime()
    {
        return expireTime;
    }

    public void setExpireTime(Date expireTime)
    {
        this.expireTime = expireTime;
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
        return "DhLiveRewardCode{" +
                "codeId=" + codeId +
                ", itemId=" + itemId +
                ", code='" + code + '\'' +
                ", isUsed='" + isUsed + '\'' +
                ", usedBy=" + usedBy +
                ", delFlag='" + delFlag + '\'' +
                '}';
    }
}