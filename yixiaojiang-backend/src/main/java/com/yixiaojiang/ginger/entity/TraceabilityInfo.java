package com.yixiaojiang.ginger.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@TableName("traceability_info")
public class TraceabilityInfo {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String traceabilityCode;  // 溯源码（YXJ-2026-001-A3F8B2）

    private Long productId;           // 产品/货源ID

    private Long farmerId;            // 农户ID

    private String productName;       // 产品名称

    private String origin;            // 产地（省市区街道）

    private String grade;             // 等级（特级/A级/B级）

    private BigDecimal weight;        // 净重（公斤）

    private Long blockHeight;         // 区块链高度

    private String txHash;            // 交易哈希

    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTraceabilityCode() { return traceabilityCode; }
    public void setTraceabilityCode(String traceabilityCode) { this.traceabilityCode = traceabilityCode; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public Long getBlockHeight() { return blockHeight; }
    public void setBlockHeight(Long blockHeight) { this.blockHeight = blockHeight; }

    public String getTxHash() { return txHash; }
    public void setTxHash(String txHash) { this.txHash = txHash; }

    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
