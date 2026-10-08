package com.yixiaojiang.ginger.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;

@TableName("traceability_node")
public class TraceabilityNode {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long traceId;         // 溯源信息ID

    private String nodeType;      // 环节类型（planting/harvest/ai_check/warehouse/logistics）

    private String nodeName;      // 环节名称

    private String nodeData;      // 环节数据JSON（desc + detail）

    private LocalDateTime nodeTime; // 环节时间

    private String prevHash;      // 上一节点哈希

    private String nodeHash;      // 本节点哈希

    private Long blockHeight;     // 区块高度

    private String status;        // 节点状态（active正常 / corrected已修正留痕）

    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTraceId() { return traceId; }
    public void setTraceId(Long traceId) { this.traceId = traceId; }

    public String getNodeType() { return nodeType; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }

    public String getNodeName() { return nodeName; }
    public void setNodeName(String nodeName) { this.nodeName = nodeName; }

    public String getNodeData() { return nodeData; }
    public void setNodeData(String nodeData) { this.nodeData = nodeData; }

    public LocalDateTime getNodeTime() { return nodeTime; }
    public void setNodeTime(LocalDateTime nodeTime) { this.nodeTime = nodeTime; }

    public String getPrevHash() { return prevHash; }
    public void setPrevHash(String prevHash) { this.prevHash = prevHash; }

    public String getNodeHash() { return nodeHash; }
    public void setNodeHash(String nodeHash) { this.nodeHash = nodeHash; }

    public Long getBlockHeight() { return blockHeight; }
    public void setBlockHeight(Long blockHeight) { this.blockHeight = blockHeight; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
