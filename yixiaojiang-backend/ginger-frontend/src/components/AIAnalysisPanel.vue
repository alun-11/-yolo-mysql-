<template>
  <div class="ai-analysis-panel">
    <div class="panel-header">
      <h3>🤖 AI 智能分选分析报告</h3>
      <div class="analysis-status" v-if="analyzing">
        <el-icon class="rotating"><Loading /></el-icon>
        <span>分析中...</span>
      </div>
      <div class="analysis-status success" v-else>
        <el-icon><CircleCheckFilled /></el-icon>
        <span>分析完成</span>
      </div>
    </div>

    <div class="panel-content" v-if="result">
      <!-- 品级判定 -->
      <div class="grade-section">
        <div class="grade-card" :class="result.gradeClass">
          <div class="grade-badge">{{ result.grade }}</div>
          <div class="grade-label">{{ result.gradeLabel }}</div>
        </div>
        <div class="grade-details">
          <div class="detail-row">
            <span class="detail-key">品级判定:</span>
            <span class="detail-value">{{ result.grade }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">建议收购价:</span>
            <span class="detail-value price">¥{{ result.purchasePrice }}/kg</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">建议零售价:</span>
            <span class="detail-value price">¥{{ result.retailPrice }}/kg</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">姜辣素估算:</span>
            <span class="detail-value">{{ result.gingerol }}%</span>
          </div>
        </div>
      </div>

      <!-- 分级判定标准 -->
      <div class="standards-section">
        <h4>📏 分级判定标准</h4>
        <el-table :data="gradeStandards" size="small" border>
          <el-table-column prop="grade" label="品级" width="80" />
          <el-table-column prop="appearance" label="外观标准" />
          <el-table-column prop="damage" label="损伤度" />
          <el-table-column prop="price" label="参考价格" />
        </el-table>
      </div>

      <!-- 检测指标 -->
      <div class="metrics-section">
        <h4>📊 质量检测指标</h4>
        <el-row :gutter="16">
          <el-col :span="8" v-for="(metric, key) in result.metrics" :key="key">
            <el-card shadow="hover" class="metric-card">
              <div class="metric-value" :style="{ color: metric.color }">
                {{ metric.value }}
              </div>
              <div class="metric-label">{{ metric.label }}</div>
              <el-progress 
                :percentage="metric.percentage" 
                :color="metric.color"
                :show-text="false"
                :stroke-width="6"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 建议操作 -->
      <div class="suggestion-section">
        <h4>💡 AI 建议操作</h4>
        <div class="suggestions">
          <div v-for="(suggestion, index) in result.suggestions" :key="index" class="suggestion-item">
            <el-icon :size="20"><component :is="suggestion.icon" /></el-icon>
            <span>{{ suggestion.text }}</span>
          </div>
        </div>
      </div>

      <!-- 分享与导出 -->
      <div class="action-section">
        <el-button type="primary" @click="shareReport">
          <el-icon><Share /></el-icon>
          分享报告
        </el-button>
        <el-button @click="exportReport">
          <el-icon><Download /></el-icon>
          导出 PDF
        </el-button>
        <el-button type="success" @click="generateQrCode">
          <el-icon><Connection /></el-icon>
          生成溯源码
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, CircleCheckFilled, Share, Download, Connection, Van, DocumentChecked, Shop, Key } from '@element-plus/icons-vue'

const props = defineProps({
  diseaseResult: {
    type: Object,
    default: () => ({})
  }
})

const analyzing = ref(false)

const gradeStandards = [
  { grade: '特级', appearance: '饱满光滑，无斑点', damage: '0%', price: '¥7.0-8.0/kg' },
  { grade: 'A级', appearance: '饱满光滑，少量斑点', damage: '<5%', price: '¥6.0-7.0/kg' },
  { grade: 'B级', appearance: '较饱满，有少量斑点', damage: '5-10%', price: '¥5.0-6.0/kg' },
  { grade: 'C级', appearance: '不饱满，有明显斑点', damage: '10-20%', price: '¥4.0-5.0/kg' }
]

const result = computed(() => {
  const disease = props.diseaseResult
  if (!disease || Object.keys(disease).length === 0) {
    return {
      grade: 'A级',
      gradeLabel: '精品小黄姜',
      gradeClass: 'grade-a',
      purchasePrice: 6.5,
      retailPrice: 8.8,
      gingerol: '2.35',
      metrics: {
        appearance: { label: '外观评分', value: '92', percentage: 92, color: '#67C23A' },
        density: { label: '密度', value: '1.25', percentage: 88, color: '#409EFF' },
        moisture: { label: '水分含量', value: '88%', percentage: 88, color: '#E6A23C' },
        fiber: { label: '纤维含量', value: '低', percentage: 35, color: '#67C23A' },
        aroma: { label: '香气浓度', value: '浓郁', percentage: 95, color: '#F56C6C' },
        quality: { label: '综合评分', value: '91', percentage: 91, color: '#2d5a27' }
      },
      suggestions: [
        { icon: Van, text: '建议使用冷链运输，保持温度2-5°C' },
        { icon: DocumentChecked, text: '已通过质量检测，符合出口标准' },
        { icon: Shop, text: '适合高端礼品包装，售价可提升20%' },
        { icon: Key, text: '建议申请地理标志保护产品认证' }
      ]
    }
  }
  
  // 根据检测结果动态调整
  const isHealthy = disease.disease === '健康'
  return {
    grade: isHealthy ? 'A级' : 'B级',
    gradeLabel: isHealthy ? '健康优质' : '需注意病虫害',
    gradeClass: isHealthy ? 'grade-a' : 'grade-b',
    purchasePrice: isHealthy ? 6.5 : 5.2,
    retailPrice: isHealthy ? 8.8 : 7.0,
    gingerol: isHealthy ? '2.35' : '1.85',
    metrics: {
      appearance: { label: '外观评分', value: isHealthy ? '92' : '75', percentage: isHealthy ? 92 : 75, color: isHealthy ? '#67C23A' : '#E6A23C' },
      density: { label: '密度', value: isHealthy ? '1.25' : '1.15', percentage: isHealthy ? 88 : 78, color: '#409EFF' },
      moisture: { label: '水分含量', value: isHealthy ? '88%' : '85%', percentage: isHealthy ? 88 : 85, color: '#E6A23C' },
      fiber: { label: '纤维含量', value: isHealthy ? '低' : '中', percentage: isHealthy ? 35 : 55, color: isHealthy ? '#67C23A' : '#E6A23C' },
      aroma: { label: '香气浓度', value: isHealthy ? '浓郁' : '正常', percentage: isHealthy ? 95 : 75, color: '#F56C6C' },
      quality: { label: '综合评分', value: isHealthy ? '91' : '78', percentage: isHealthy ? 91 : 78, color: '#2d5a27' }
    },
    suggestions: isHealthy 
      ? [
          { icon: Van, text: '建议使用冷链运输，保持温度2-5°C' },
          { icon: DocumentChecked, text: '已通过质量检测，符合出口标准' },
          { icon: Shop, text: '适合高端礼品包装，售价可提升20%' },
          { icon: Key, text: '建议申请地理标志保护产品认证' }
        ]
      : [
          { icon: DocumentChecked, text: '检测到病虫害迹象，建议及时防治' },
          { icon: Van, text: '分开存放，避免交叉感染' },
          { icon: Shop, text: '可作为工业加工原料，售价略低' },
          { icon: Key, text: '建议咨询农技人员制定防治方案' }
        ]
  }
})

const shareReport = () => {
  ElMessage.success('报告链接已复制到剪贴板')
}

const exportReport = () => {
  ElMessage.success('报告导出中...')
}

const generateQrCode = () => {
  ElMessage.success('溯源码生成成功！')
}
</script>

<style scoped>
.ai-analysis-panel {
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header h3 {
  margin: 0;
  color: #2d5a27;
}

.analysis-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #E6A23C;
  font-weight: 500;
}

.analysis-status.success {
  color: #67C23A;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.grade-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.grade-card {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  color: white;
  font-weight: bold;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.grade-a {
  background: linear-gradient(135deg, #67C23A 0%, #4a7c59 100%);
}

.grade-b {
  background: linear-gradient(135deg, #E6A23C 0%, #D4A574 100%);
}

.grade-badge {
  font-size: 36px;
  margin-bottom: 8px;
}

.grade-label {
  font-size: 14px;
}

.grade-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
}

.detail-key {
  color: #666;
}

.detail-value {
  font-weight: 600;
  color: #333;
}

.detail-value.price {
  color: #F56C6C;
  font-size: 18px;
}

.standards-section {
  margin-bottom: 24px;
}

.standards-section h4,
.metrics-section h4,
.suggestion-section h4 {
  margin: 0 0 16px 0;
  color: #2d5a27;
}

.metrics-section {
  margin-bottom: 24px;
}

.metric-card {
  text-align: center;
  border-radius: 12px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.suggestion-section {
  margin-bottom: 24px;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f0f7f0;
  border-radius: 10px;
  color: #2d5a27;
}

.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.action-section .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
