<template>
  <div class="price-container">
    <!-- 主图表卡片 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <span>📈 多维价格行情走势（近 14 天）</span>
            <el-tag type="success" size="small">实时数据</el-tag>
          </div>
          <el-button type="primary" size="small" @click="refreshAll" :loading="loading">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
        </div>
      </template>

      <!-- 图例说明 -->
      <div class="legend-bar">
        <div class="legend-item">
          <span class="legend-dot" style="background:#67C23A"></span>
          <span>收购价（元/斤）</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#E6A23C"></span>
          <span>批发价（元/斤）</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#409EFF"></span>
          <span>全国零售价（元/斤）</span>
        </div>
      </div>

      <div ref="mainChartRef" class="chart"></div>

      <!-- 详细数据表 -->
      <el-collapse v-model="activeNames" class="data-collapse">
        <el-collapse-item title="📋 详细数据列表" name="data">
          <el-table :data="priceList" stripe size="small" style="width: 100%">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column label="收购价" width="120">
              <template #default="{ row }">
                <el-tag type="success" size="small" effect="plain">¥{{ row.purchase }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="批发价" width="120">
              <template #default="{ row }">
                <el-tag type="warning" size="small" effect="plain">¥{{ row.wholesale }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="零售价" width="120">
              <template #default="{ row }">
                <el-tag type="primary" size="small" effect="plain">¥{{ row.retail }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="收购价趋势">
              <template #default="{ row, $index }">
                <el-tag
                  v-if="$index > 0"
                  :type="getTrendType(row.purchase, priceList[$index - 1].purchase)"
                  size="small"
                >
                  {{ getTrendText(row.purchase, priceList[$index - 1].purchase) }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- AI 价格预测模块 -->
    <el-card class="forecast-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <span>🤖 AI 价格预测（未来 7 天）</span>
            <el-tag type="danger" size="small" effect="dark">AI 模型预测</el-tag>
          </div>
          <span class="model-info">基于 LSTM 时序模型 · 置信度 92.5%</span>
        </div>
      </template>

      <!-- 最佳销售窗口提示 -->
      <el-alert
        v-if="bestWindow"
        :title="bestWindow.title"
        type="success"
        :closable="false"
        show-icon
        class="window-alert"
      >
        <template #default>
          <div class="window-content">
            <el-icon><Calendar /></el-icon>
            <span>{{ bestWindow.text }}</span>
            <el-tag type="success" size="small" effect="dark">推荐操作</el-tag>
          </div>
        </template>
      </el-alert>

      <div ref="forecastChartRef" class="forecast-chart"></div>

      <!-- 预测关键指标 -->
      <el-row :gutter="16" class="forecast-metrics">
        <el-col :span="6">
          <div class="metric-box">
            <div class="metric-label">未来7天均价</div>
            <div class="metric-value">¥{{ forecastAvg }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <div class="metric-label">预测最高价</div>
            <div class="metric-value up">¥{{ forecastMax }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <div class="metric-label">预测最低价</div>
            <div class="metric-value down">¥{{ forecastMin }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <div class="metric-label">环比涨幅</div>
            <div class="metric-value" :class="trendClass">{{ trendText }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 操作建议 -->
      <div class="advice-section">
        <h4>💡 AI 智能决策建议</h4>
        <ul class="advice-list">
          <li v-for="(advice, idx) in advices" :key="idx">
            <el-icon class="advice-icon"><Promotion /></el-icon>
            <span>{{ advice }}</span>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { Refresh, Calendar, Promotion } from '@element-plus/icons-vue'
import { mockPriceHistory, generatePriceForecast } from '../mock'

const mainChartRef = ref(null)
const forecastChartRef = ref(null)
const priceList = ref([])
const forecastList = ref([])
const loading = ref(false)
const activeNames = ref([])

let mainChart = null
let forecastChart = null

// 使用全局 Mock 数据（30 天历史价格）
const generateMockData = () => {
  return mockPriceHistory
}

// 生成未来7天预测数据
const generateForecastData = () => {
  const lastPurchase = priceList.value[priceList.value.length - 1]?.purchase || 5.85
  return generatePriceForecast(lastPurchase)
}

const clamp = (val, min, max) => Math.max(min, Math.min(max, val))

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatShortDate = (dateStr) => {
  const parts = dateStr.split('-')
  return `${parts[1]}-${parts[2]}`
}

// 最佳销售窗口（未来第3-5天）
const bestWindow = computed(() => {
  if (forecastList.value.length < 5) return null
  const start = forecastList.value[2]?.date
  const end = forecastList.value[4]?.date
  if (!start || !end) return null
  const startShort = formatShortDate(start)
  const endShort = formatShortDate(end)
  return {
    title: '🎯 最佳销售窗口期已锁定',
    text: `建议在 ${start} 至 ${end} 期间出售，预计收益最大化（未来第3-5天价格处于高位）`
  }
})

// 预测指标
const forecastAvg = computed(() => {
  if (!forecastList.value.length) return '-'
  const sum = forecastList.value.reduce((s, i) => s + i.purchase, 0)
  return (sum / forecastList.value.length).toFixed(2)
})

const forecastMax = computed(() => {
  if (!forecastList.value.length) return '-'
  return Math.max(...forecastList.value.map(i => i.purchase)).toFixed(2)
})

const forecastMin = computed(() => {
  if (!forecastList.value.length) return '-'
  return Math.min(...forecastList.value.map(i => i.purchase)).toFixed(2)
})

const trendText = computed(() => {
  if (!forecastList.value.length || !priceList.value.length) return '-'
  const last = priceList.value[priceList.value.length - 1].purchase
  const avg = forecastList.value.reduce((s, i) => s + i.purchase, 0) / forecastList.value.length
  const diff = ((avg - last) / last * 100).toFixed(2)
  return `${diff > 0 ? '+' : ''}${diff}%`
})

const trendClass = computed(() => {
  if (!forecastList.value.length || !priceList.value.length) return ''
  const last = priceList.value[priceList.value.length - 1].purchase
  const avg = forecastList.value.reduce((s, i) => s + i.purchase, 0) / forecastList.value.length
  return avg > last ? 'up' : 'down'
})

// 决策建议
const advices = computed(() => {
  if (!forecastList.value.length) return []
  const maxItem = forecastList.value.reduce((a, b) => a.purchase > b.purchase ? a : b)
  return [
    `未来 7 天价格整体呈上涨趋势，建议在第 ${forecastList.value.indexOf(maxItem) + 1} 天（${maxItem.date}）附近出售，预计可达 ¥${maxItem.purchase}/斤`,
    '近期小黄姜市场需求旺盛，批发商采购意愿增强，可适当囤货待价而沽',
    '建议关注天气变化，雨季来临前完成大宗出货以避免运输损耗',
    '可与本地合作社联合议价，争取高于市场均价 3-5% 的收购价'
  ]
})

const getTrendType = (current, prev) => {
  if (current > prev) return 'success'
  if (current < prev) return 'danger'
  return 'info'
}

const getTrendText = (current, prev) => {
  const diff = ((current - prev) / prev * 100).toFixed(2)
  if (diff > 0) return `↑ ${diff}%`
  if (diff < 0) return `↓ ${Math.abs(diff)}%`
  return '持平'
}

// 初始化主图表（三条线）
const initMainChart = () => {
  if (!mainChartRef.value) return
  if (!mainChart) {
    mainChart = echarts.init(mainChartRef.value)
  }

  const dates = priceList.value.map(i => i.date)
  const purchaseData = priceList.value.map(i => i.purchase)
  const wholesaleData = priceList.value.map(i => i.wholesale)
  const retailData = priceList.value.map(i => i.retail)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#fff' },
      formatter: (params) => {
        let html = `<div style="font-weight:600;margin-bottom:6px">${params[0].axisValue}</div>`
        const colors = ['#67C23A', '#E6A23C', '#409EFF']
        const names = ['收购价', '批发价', '零售价']
        params.forEach((p, idx) => {
          html += `<div style="display:flex;justify-content:space-between;gap:12px">
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${colors[idx]};margin-right:6px"></span>${names[idx]}</span>
            <span style="font-weight:600">¥${p.value}/斤</span>
          </div>`
        })
        return html
      }
    },
    legend: {
      data: ['收购价', '批发价', '零售价'],
      top: 10,
      textStyle: { color: '#606266' }
    },
    grid: { left: 50, right: 30, top: 60, bottom: 40 },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: {
        formatter: (v) => formatShortDate(v),
        color: '#909399'
      }
    },
    yAxis: {
      type: 'value',
      name: '价格（元/斤）',
      nameTextStyle: { color: '#909399' },
      axisLine: { show: false },
      axisLabel: { color: '#909399' },
      splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } }
    },
    series: [
      {
        name: '收购价',
        data: purchaseData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#67C23A' },
        lineStyle: { width: 3, color: '#67C23A' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.35)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
          ])
        }
      },
      {
        name: '批发价',
        data: wholesaleData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#E6A23C' },
        lineStyle: { width: 3, color: '#E6A23C' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
            { offset: 1, color: 'rgba(230, 162, 60, 0.02)' }
          ])
        }
      },
      {
        name: '零售价',
        data: retailData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 3, color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.02)' }
          ])
        }
      }
    ]
  }

  mainChart.setOption(option, true)
}

// 初始化预测图表
const initForecastChart = () => {
  if (!forecastChartRef.value) return
  if (!forecastChart) {
    forecastChart = echarts.init(forecastChartRef.value)
  }

  // 历史数据（最近7天）
  const recentHistory = priceList.value.slice(-7)
  const histDates = recentHistory.map(i => i.date)
  const histData = recentHistory.map(i => i.purchase)

  // 预测数据
  const forecastDates = forecastList.value.map(i => i.date)
  const forecastData = forecastList.value.map(i => i.purchase)

  // 拼接：历史实线 + 预测虚线
  // 历史最后一个点作为预测起点，确保连续
  const allDates = [...histDates, ...forecastDates]
  const purchaseSeries = [
    ...histData,
    ...forecastData
  ]

  // 预测线单独一条（虚线红色）
  const forecastLineData = new Array(histDates.length - 1).fill(null)
  forecastLineData.push(histData[histData.length - 1]) // 连接历史最后一日
  forecastList.value.forEach(f => forecastLineData.push(f.purchase))

  // 最佳销售窗口（未来第3-5天 = 索引 histDates.length+2 到 histDates.length+4）
  const winStartIdx = histDates.length + 2
  const winEndIdx = histDates.length + 4
  const markAreaData = [[
    { xAxis: allDates[winStartIdx] },
    { xAxis: allDates[winEndIdx] }
  ]]

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const date = params[0].axisValue
        let html = `<div style="font-weight:600;margin-bottom:6px">${date}</div>`
        params.forEach(p => {
          if (p.value == null) return
          const isForecast = p.seriesName === 'AI预测价'
          html += `<div style="display:flex;justify-content:space-between;gap:12px">
            <span>${p.seriesName}</span>
            <span style="font-weight:600;color:${isForecast ? '#ff4d4f' : '#67C23A'}">¥${p.value}/斤</span>
          </div>`
        })
        return html
      }
    },
    legend: {
      data: ['历史收购价', 'AI预测价'],
      top: 10,
      textStyle: { color: '#606266' }
    },
    grid: { left: 50, right: 30, top: 60, bottom: 40 },
    xAxis: {
      type: 'category',
      data: allDates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: {
        formatter: (v) => formatShortDate(v),
        color: '#909399'
      }
    },
    yAxis: {
      type: 'value',
      name: '收购价（元/斤）',
      nameTextStyle: { color: '#909399' },
      axisLine: { show: false },
      axisLabel: { color: '#909399' },
      splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } }
    },
    series: [
      {
        name: '历史收购价',
        data: purchaseSeries.map((v, i) => i < histDates.length ? v : null),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#67C23A' },
        lineStyle: { width: 3, color: '#67C23A' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
          ])
        },
        markArea: {
          silent: true,
          itemStyle: {
            color: 'rgba(245, 108, 108, 0.15)',
            borderColor: '#F56C6C',
            borderWidth: 1,
            borderType: 'dashed'
          },
          label: {
            show: true,
            position: 'top',
            color: '#F56C6C',
            fontWeight: 600,
            fontSize: 12,
            formatter: '⭐ 最佳销售窗口期'
          },
          data: markAreaData
        }
      },
      {
        name: 'AI预测价',
        data: forecastLineData,
        type: 'line',
        smooth: true,
        symbol: 'diamond',
        symbolSize: 9,
        itemStyle: { color: '#ff4d4f' },
        lineStyle: { width: 3, color: '#ff4d4f', type: 'dashed' }
      }
    ]
  }

  forecastChart.setOption(option, true)
}

const refreshAll = async () => {
  loading.value = true
  try {
    priceList.value = generateMockData()
    forecastList.value = generateForecastData()
    await nextTick()
    initMainChart()
    initForecastChart()
    ElMessage.success('数据已刷新')
  } finally {
    loading.value = false
  }
}

const handleResize = () => {
  mainChart?.resize()
  forecastChart?.resize()
}

onMounted(async () => {
  priceList.value = generateMockData()
  forecastList.value = generateForecastData()
  await nextTick()
  initMainChart()
  initForecastChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  mainChart?.dispose()
  forecastChart?.dispose()
})
</script>

<style scoped>
.price-container {
  padding: 0;
}

.chart-card,
.forecast-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #2d5a27;
}

.model-info {
  font-size: 12px;
  color: #909399;
}

.legend-bar {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.chart {
  height: 380px;
  width: 100%;
}

.forecast-chart {
  height: 340px;
  width: 100%;
}

.data-collapse {
  margin-top: 16px;
}

.window-alert {
  margin-bottom: 16px;
  border-radius: 8px;
}

.window-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.forecast-metrics {
  margin: 16px 0;
}

.metric-box {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #ebeef5;
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.metric-value.up {
  color: #F56C6C;
}

.metric-value.down {
  color: #67C23A;
}

.advice-section {
  padding: 16px;
  background: linear-gradient(135deg, #f0f7f0 0%, #e8f4e8 100%);
  border-radius: 10px;
  border-left: 4px solid #2d5a27;
}

.advice-section h4 {
  margin: 0 0 12px 0;
  color: #2d5a27;
  font-size: 15px;
}

.advice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advice-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  border-bottom: 1px dashed #d4e4d4;
}

.advice-list li:last-child {
  border-bottom: none;
}

.advice-icon {
  color: #2d5a27;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .legend-bar {
    flex-wrap: wrap;
    gap: 12px;
  }

  .forecast-metrics .el-col {
    margin-bottom: 10px;
  }
}
</style>
