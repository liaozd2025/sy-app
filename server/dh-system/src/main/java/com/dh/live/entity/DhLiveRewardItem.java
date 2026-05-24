package com.dh.live.entity;

import java.util.Date;

/**
 * 积分商城福利SKU对象 dh_live_reward_item
 *
 * @author 3r_111
 */
public class DhLiveRewardItem
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long itemId;

    /** 业务编码 */
    private String bizCode;

    /** 福利名称 */
    private String itemName;

    /** 封面图 */
    private String coverImage;

    /** 福利说明（含发货指引） */
    private String description;

    /** 所需积分 */
    private Integer requiredPoints;

    /** 总库存 */
    private Integer stockTotal;

    /** 剩余库存 */
    private Integer stockRemaining;

    /** 状态（1上架 0下架） */
    private String status;

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

    public Long getItemId()
    {
        return itemId;
    }

    public void setItemId(Long itemId)
    {
        this.itemId = itemId;
    }

    public String getBizCode()
    {
        return bizCode;
    }

    public void setBizCode(String bizCode)
    {
        this.bizCode = bizCode;
    }

    public String getItemName()
    {
        return itemName;
    }

    public void setItemName(String itemName)
    {
        this.itemName = itemName;
    }

    public String getCoverImage()
    {
        return coverImage;
    }

    public void setCoverImage(String coverImage)
    {
        this.coverImage = coverImage;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public Integer getRequiredPoints()
    {
        return requiredPoints;
    }

    public void setRequiredPoints(Integer requiredPoints)
    {
        this.requiredPoints = requiredPoints;
    }

    public Integer getStockTotal()
    {
        return stockTotal;
    }

    public void setStockTotal(Integer stockTotal)
    {
        this.stockTotal = stockTotal;
    }

    public Integer getStockRemaining()
    {
        return stockRemaining;
    }

    public void setStockRemaining(Integer stockRemaining)
    {
        this.stockRemaining = stockRemaining;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
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
        return "DhLiveRewardItem{" +
                "itemId=" + itemId +
                ", bizCode='" + bizCode + '\'' +
                ", itemName='" + itemName + '\'' +
                ", requiredPoints=" + requiredPoints +
                ", stockTotal=" + stockTotal +
                ", stockRemaining=" + stockRemaining +
                ", status='" + status + '\'' +
                ", delFlag='" + delFlag + '\'' +
                '}';
    }
}