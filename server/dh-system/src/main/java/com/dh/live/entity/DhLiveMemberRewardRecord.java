package com.dh.live.entity;

import java.util.Date;

/**
 * 学员兑换记录对象 dh_live_member_reward_record
 *
 * @author 3r_111
 */
public class DhLiveMemberRewardRecord
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long recordId;

    /** 会员ID */
    private Long memberId;

    /** 福利ID */
    private Long itemId;

    /** 兑换码ID */
    private Long codeId;

    /** 本次消耗积分 */
    private Integer pointsConsumed;

    /** 兑换时间 */
    private Date exchangeTime;

    /** 发货状态（pending/contacted/shipped/received） */
    private String deliveryStatus;

    /** 物流备注 */
    private String deliveryNote;

    /** 创建时间 */
    private Date createTime;

    /** 更新时间 */
    private Date updateTime;

    /** 备注 */
    private String remark;

    /** 删除标志（0存在 1删除） */
    private String delFlag;

    public Long getRecordId()
    {
        return recordId;
    }

    public void setRecordId(Long recordId)
    {
        this.recordId = recordId;
    }

    public Long getMemberId()
    {
        return memberId;
    }

    public void setMemberId(Long memberId)
    {
        this.memberId = memberId;
    }

    public Long getItemId()
    {
        return itemId;
    }

    public void setItemId(Long itemId)
    {
        this.itemId = itemId;
    }

    public Long getCodeId()
    {
        return codeId;
    }

    public void setCodeId(Long codeId)
    {
        this.codeId = codeId;
    }

    public Integer getPointsConsumed()
    {
        return pointsConsumed;
    }

    public void setPointsConsumed(Integer pointsConsumed)
    {
        this.pointsConsumed = pointsConsumed;
    }

    public Date getExchangeTime()
    {
        return exchangeTime;
    }

    public void setExchangeTime(Date exchangeTime)
    {
        this.exchangeTime = exchangeTime;
    }

    public String getDeliveryStatus()
    {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus)
    {
        this.deliveryStatus = deliveryStatus;
    }

    public String getDeliveryNote()
    {
        return deliveryNote;
    }

    public void setDeliveryNote(String deliveryNote)
    {
        this.deliveryNote = deliveryNote;
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
        return "DhLiveMemberRewardRecord{" +
                "recordId=" + recordId +
                ", memberId=" + memberId +
                ", itemId=" + itemId +
                ", codeId=" + codeId +
                ", pointsConsumed=" + pointsConsumed +
                ", deliveryStatus='" + deliveryStatus + '\'' +
                ", delFlag='" + delFlag + '\'' +
                '}';
    }
}