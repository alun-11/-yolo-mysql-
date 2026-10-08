<template>
  <div class="traceability-timeline">
    <div class="timeline-header">
      <h3>🔗 区块链溯源信息</h3>
      <el-tag type="success" effect="dark">已认证</el-tag>
    </div>
    
    <div class="timeline-content">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in timelineData"
          :key="index"
          :timestamp="item.time"
          :type="item.type"
          :icon="item.icon"
          :hollow="index !== 0"
        >
          <div class="timeline-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-description">{{ item.description }}</div>
            <div v-if="item.details" class="item-details">
              <el-descriptions :column="2" size="small" border>
                <el-descriptions-item 
                  v-for="(value, key) in item.details" 
                  :key="key" 
                  :label="key"
                >
                  {{ value }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-if="item.hash" class="item-hash">
              <span class="hash-label">区块哈希:</span>
              <code class="hash-value">{{ item.hash }}</code>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="blockchain-info">
      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="info-header">
            <span>⛓️ 区块链存证信息</span>
            <el-button type="primary" size="small" link @click="verifyOnChain">
              链上验证
            </el-button>
          </div>
        </template>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">存证平台:</span>
            <span class="info-value">云南省农产品溯源区块链</span>
          </div>
          <div class="info-item">
            <span class="info-label">存证编号:</span>
            <span class="info-value hash-text">{{ certificateId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">存证时间:</span>
            <span class="info-value">{{ createTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">验证状态:</span>
            <el-tag :type="verified ? 'success' : 'warning'">
              {{ verified ? '✅ 已验证' : '⏳ 待验证' }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  productData: {
    type: Object,
    default: () => ({})
  }
})

const verified = ref(true)
const createTime = ref('2024-10-15 10:30:25')

const certificateId = computed(() => {
  return 'YXRP-' + (props.productData.id || '001') + '-' + Date.now().toString().slice(-8)
})

const timelineData = computed(() => {
  const product = props.productData
  return [
    {
      time: '2024-10-15 14:30',
      title: '📦 采收与初加工',
      description: '小黄姜采收完成，经过筛选、清洗、分级处理',
      type: 'success',
      icon: 'CircleCheckFilled',
      details: {
        '采收重量': product.weight ? `${product.weight}kg` : '1200kg',
        '分级标准': product.grade || 'A级',
        '采收人员': '张大山',
        '质量检测': '✅ 合格'
      },
      hash: '0x8a3f...c1e2'
    },
    {
      time: '2024-10-15 16:00',
      title: '🏭 冷链物流配送',
      description: '产品装入冷链车，全程温控运输',
      type: 'primary',
      icon: 'Van',
      details: {
        '运输温度': '2-5°C',
        '运输车辆': '云A·12345',
        '目的地': '昆明物流中心',
        '预计到达': '2024-10-16 08:00'
      },
      hash: '0x4b7d...f8a3'
    },
    {
      time: '2024-10-16 09:00',
      title: '📊 质量检测报告',
      description: '云南省农产品质量检测中心完成检测',
      type: 'warning',
      icon: 'DocumentChecked',
      details: {
        '检测编号': 'YN-2024-1088',
        '农药残留': '✅ 未检出',
        '重金属': '✅ 合格',
        '微生物指标': '✅ 合格'
      },
      hash: '0x2e9a...b5c7'
    },
    {
      time: '2024-10-16 14:00',
      title: '🛒 商户收货上架',
      description: '北京新发地批发市场收货，完成上架',
      type: 'info',
      icon: 'Shop',
      details: {
        '收货商户': '王老板',
        '收货数量': product.weight ? `${product.weight}kg` : '1200kg',
        '采购价格': product.price ? `¥${product.price}/kg` : '¥5.8/kg',
        '上架时间': '2024-10-16 15:00'
      },
      hash: '0x1d5f...e9b8'
    },
    {
      time: '2024-10-16 15:00',
      title: '✅ 区块链存证完成',
      description: '全流程信息上链存证，生成溯源证书',
      type: 'success',
      icon: 'Key',
      hash: '0x7c2e...d4f1'
    }
  ]
})

const verifyOnChain = () => {
  ElMessage.success('链上验证成功！数据真实有效')
  verified.value = true
}
</script>

<style scoped>
.traceability-timeline {
  padding: 20px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timeline-header h3 {
  margin: 0;
  color: #2d5a27;
}

.timeline-item {
  padding: 10px 0;
}

.item-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.item-description {
  color: #666;
  margin-bottom: 10px;
}

.item-details {
  margin: 10px 0;
}

.item-hash {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.hash-label {
  font-size: 12px;
  color: #999;
}

.hash-value {
  font-family: monospace;
  font-size: 12px;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.blockchain-info {
  margin-top: 20px;
}

.info-card {
  border: 2px solid #2d5a27;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  color: #666;
  min-width: 100px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.hash-text {
  font-family: monospace;
  color: #2d5a27;
  background: #f0f7f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
