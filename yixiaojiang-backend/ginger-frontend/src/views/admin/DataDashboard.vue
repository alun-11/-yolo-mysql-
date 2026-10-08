<template>
  <div class="dashboard-screen">
    <!-- 顶部标题栏 -->
    <div class="screen-header">
      <div class="header-decor left"></div>
      <div class="header-title">
        <h1>🌾 壹小姜 · 数智助农成果大屏</h1>
        <p>YI XIAO JIANG · DIGITAL AGRICULTURE ACHIEVEMENT DASHBOARD</p>
      </div>
      <div class="header-decor right">
        <span class="datetime">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 顶部核心指标卡片 -->
    <div class="kpi-row">
      <div
        v-for="(kpi, idx) in kpiList"
        :key="idx"
        class="kpi-card"
        :class="`kpi-${kpi.theme}`"
      >
        <div class="kpi-icon">{{ kpi.icon }}</div>
        <div class="kpi-body">
          <div class="kpi-value">
            <span class="kpi-number">{{ kpi.display.toLocaleString() }}</span>
            <span class="kpi-unit">{{ kpi.unit }}</span>
          </div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-trend">
            <el-icon :class="kpi.trendType">
              <CaretTop v-if="kpi.trendType === 'up'" />
              <CaretBottom v-else />
            </el-icon>
            <span>{{ kpi.trend }}</span>
          </div>
        </div>
        <div class="kpi-glow"></div>
      </div>
    </div>

    <!-- 中部图表区 -->
    <div class="chart-row">
      <!-- 左侧：产地货源分布 -->
      <div class="chart-block left">
        <div class="block-header">
          <span class="block-title">🗺️ 各产地货源分布</span>
          <el-radio-group v-model="chartType" size="small" @change="renderChart">
            <el-radio-button label="bar">城市排名</el-radio-button>
            <el-radio-button label="map">省份分布</el-radio-button>
          </el-radio-group>
        </div>
        <div ref="regionChartRef" class="region-chart"></div>
      </div>

      <!-- 右侧：销售排行榜 TOP5 -->
      <div class="chart-block right">
        <div class="block-header">
          <span class="block-title">🏆 货源销售排行榜 TOP 5</span>
          <span class="block-sub">截至 {{ today }}</span>
        </div>
        <div class="ranking-list">
          <div
            v-for="(item, idx) in rankingList"
            :key="idx"
            class="ranking-item"
            :class="`rank-${idx + 1}`"
          >
            <div class="rank-medal" :class="medalClass(idx)">
              <span v-if="idx < 3" class="medal-icon">{{ medalIcon(idx) }}</span>
              <span v-else class="medal-num">{{ idx + 1 }}</span>
            </div>
            <div class="rank-info">
              <div class="rank-origin">{{ item.origin }}</div>
              <div class="rank-progress">
                <div
                  class="progress-bar"
                  :style="{ width: (item.sales / maxSales * 100) + '%' }"
                ></div>
              </div>
            </div>
            <div class="rank-data">
              <div class="rank-sales">{{ item.sales.toLocaleString() }} 斤</div>
              <div class="rank-amount">¥{{ item.amount.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="screen-footer">
      <span>数据来源：壹小姜数智助农平台 · 实时同步</span>
      <span>© 2026 壹小姜团队 · 数据仅供演示</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import {
  mockDashboardKpi,
  mockRegionData,
  mockProvinceData,
  mockLiveData
} from '../../mock'

const currentTime = ref('')
const today = new Date().toISOString().slice(0, 10)
const chartType = ref('bar')
const regionChartRef = ref(null)
let regionChart = null
let timer = null

// KPI 数据（带滚动动画）- 引用全局 Mock
const kpiList = ref([
  {
    icon: '👨‍🌾',
    label: '已帮扶农户数',
    target: mockDashboardKpi.farmerCount,
    display: 0,
    unit: '户',
    trend: '+12.5%',
    trendType: 'up',
    theme: 'green'
  },
  {
    icon: '🤖',
    label: 'AI 分选累计斤数',
    target: mockDashboardKpi.aiDetectWeight,
    display: 0,
    unit: '斤',
    trend: '+28.3%',
    trendType: 'up',
    theme: 'gold'
  },
  {
    icon: '🔗',
    label: '溯源扫码量',
    target: mockDashboardKpi.traceScanCount,
    display: 0,
    unit: '次',
    trend: '+15.8%',
    trendType: 'up',
    theme: 'red'
  },
  {
    icon: '📈',
    label: '农户平均增收比例',
    target: mockDashboardKpi.avgIncomeIncrease,
    display: 0,
    unit: '%',
    trend: '+5.2%',
    trendType: 'up',
    theme: 'blue'
  }
])

// 排行榜数据 - 引用全局 Mock
const rankingList = ref(mockLiveData.ranking.map(item => ({
  origin: item.origin,
  sales: item.sales,
  amount: item.amount
})))

const maxSales = computed(() => Math.max(...rankingList.value.map(i => i.sales)))

// 产地货源分布数据 - 引用全局 Mock
const regionData = mockRegionData

// 省份维度数据 - 引用全局 Mock
const provinceData = mockProvinceData

// 时间更新
const updateTime = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${y}-${m}-${d} ${h}:${mi}:${s}`
}

// KPI 数字滚动动画
const animateKpi = () => {
  kpiList.value.forEach((kpi) => {
    const duration = 1500
    const startTime = Date.now()
    const startVal = 0
    const target = kpi.target
    const isFloat = target % 1 !== 0

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutQuart 缓动
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = startVal + (target - startVal) * eased
      kpi.display = isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current)
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        kpi.display = isFloat ? parseFloat(target.toFixed(1)) : target
      }
    }
    requestAnimationFrame(step)
  })
}

// 渲染产地分布图表
const renderChart = () => {
  if (!regionChartRef.value) return
  if (!regionChart) {
    regionChart = echarts.init(regionChartRef.value)
  }

  if (chartType.value === 'bar') {
    const sorted = [...regionData].sort((a, b) => b.value - a.value)
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(20, 40, 80, 0.9)',
        borderColor: '#3a7bd5',
        textStyle: { color: '#fff' },
        formatter: (params) => {
          const p = params[0]
          return `<div style="font-weight:600">${p.name}</div>
                  <div>货源量：${p.value.toLocaleString()} 斤</div>`
        }
      },
      grid: { left: 80, right: 30, top: 20, bottom: 30 },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#3a5a8a' } },
        axisLabel: { color: '#8ab3e8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(58, 90, 138, 0.3)', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: sorted.map(i => i.name).reverse(),
        axisLine: { lineStyle: { color: '#3a5a8a' } },
        axisLabel: { color: '#c0d4e8', fontSize: 12 },
        axisTick: { show: false }
      },
      series: [
        {
          type: 'bar',
          data: sorted.map(i => i.value).reverse(),
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1a9b6c' },
              { offset: 0.5, color: '#27d99c' },
              { offset: 1, color: '#67f2c2' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            color: '#67f2c2',
            fontWeight: 600,
            formatter: '{c} 斤'
          }
        }
      ]
    }
    regionChart.setOption(option, true)
  } else {
    // 地图模式：省份维度地理分布柱状图
    const sortedProv = [...provinceData].sort((a, b) => b.value - a.value)
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(20, 40, 80, 0.9)',
        borderColor: '#3a7bd5',
        textStyle: { color: '#fff' },
        formatter: (params) => {
          const p = params[0]
          const item = sortedProv[p.dataIndex]
          return `<div style="font-weight:600">${p.name}省</div>
                  <div>货源量：${p.value.toLocaleString()} 斤</div>
                  <div style="color:#8ab3e8">主要产地：${item.cities}</div>`
        }
      },
      grid: { left: 50, right: 30, top: 30, bottom: 60 },
      xAxis: {
        type: 'category',
        data: sortedProv.map(i => i.name),
        axisLine: { lineStyle: { color: '#3a5a8a' } },
        axisLabel: { color: '#c0d4e8', fontSize: 12, interval: 0 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: '货源量(斤)',
        nameTextStyle: { color: '#6a8bc2' },
        axisLine: { show: false },
        axisLabel: { color: '#8ab3e8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(58, 90, 138, 0.3)', type: 'dashed' } }
      },
      series: [
        {
          type: 'bar',
          data: sortedProv.map((i, idx) => ({
            value: i.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: idx < 3 ? '#ffd76a' : (idx < 6 ? '#3a7bd5' : '#1a9b6c') },
                { offset: 1, color: idx < 3 ? '#c9a55c' : (idx < 6 ? '#1a4a7a' : '#1a6b4a') }
              ]),
              borderRadius: [6, 6, 0, 0]
            }
          })),
          barWidth: '45%',
          label: {
            show: true,
            position: 'top',
            color: '#67f2c2',
            fontWeight: 600,
            fontSize: 11,
            formatter: '{c}'
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#ff6b8a', type: 'dashed', width: 1.5 },
            data: [{ type: 'average', name: '平均值' }],
            label: {
              color: '#ff6b8a',
              formatter: '平均 {c} 斤'
            }
          }
        }
      ]
    }
    regionChart.setOption(option, true)
  }
}

// 奖牌相关
const medalClass = (idx) => {
  const classes = ['gold', 'silver', 'bronze', 'normal']
  return classes[idx] || 'normal'
}

const medalIcon = (idx) => {
  const icons = ['🥇', '🥈', '🥉']
  return icons[idx] || ''
}

const handleResize = () => {
  regionChart?.resize()
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  animateKpi()
  await nextTick()
  renderChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  regionChart?.dispose()
})
</script>

<style scoped>
.dashboard-screen {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top, #1a2a5a 0%, transparent 60%),
    radial-gradient(ellipse at bottom, #2a1a4a 0%, transparent 60%),
    linear-gradient(180deg, #0a1530 0%, #0f1f44 50%, #0a1530 100%);
  color: #fff;
  padding: 18px 22px 12px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 顶部标题 */
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 18px;
  border-bottom: 1px solid rgba(58, 122, 213, 0.3);
  margin-bottom: 18px;
  position: relative;
}

.screen-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 30%;
  right: 30%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3a7bd5, transparent);
}

.header-title {
  text-align: center;
  flex: 1;
}

.header-title h1 {
  margin: 0;
  font-size: 26px;
  background: linear-gradient(90deg, #67f2c2 0%, #3a7bd5 50%, #c9a55c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.header-title p {
  margin: 4px 0 0;
  font-size: 11px;
  color: #6a8bc2;
  letter-spacing: 3px;
}

.header-decor {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.header-decor.right {
  justify-content: flex-end;
}

.datetime {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #67f2c2;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(103, 242, 194, 0.5);
}

/* KPI 卡片行 */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.kpi-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(40, 70, 130, 0.4) 0%, rgba(20, 40, 80, 0.6) 100%);
  border: 1px solid rgba(58, 122, 213, 0.3);
  overflow: hidden;
  transition: all 0.3s;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.kpi-green::before { background: linear-gradient(90deg, #1a9b6c, #67f2c2); }
.kpi-gold::before { background: linear-gradient(90deg, #c9a55c, #ffd76a); }
.kpi-red::before { background: linear-gradient(90deg, #c41e3a, #ff6b8a); }
.kpi-blue::before { background: linear-gradient(90deg, #1a4a7a, #3a7bd5); }

.kpi-card:hover {
  transform: translateY(-3px);
  border-color: rgba(103, 242, 194, 0.5);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.kpi-icon {
  font-size: 42px;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(103, 242, 194, 0.4));
}

.kpi-body {
  flex: 1;
  min-width: 0;
}

.kpi-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 2px;
}

.kpi-number {
  font-size: 30px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.kpi-green .kpi-number { color: #67f2c2; }
.kpi-gold .kpi-number { color: #ffd76a; }
.kpi-red .kpi-number { color: #ff6b8a; }
.kpi-blue .kpi-number { color: #5ab3ff; }

.kpi-unit {
  font-size: 14px;
  color: #8ab3e8;
  font-weight: 600;
}

.kpi-label {
  font-size: 13px;
  color: #c0d4e8;
  margin-bottom: 4px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #67f2c2;
}

.kpi-trend .up { color: #67f2c2; }
.kpi-trend .down { color: #ff6b8a; }

.kpi-glow {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(103, 242, 194, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

/* 中部图表区 */
.chart-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 14px;
}

.chart-block {
  background: linear-gradient(135deg, rgba(20, 40, 80, 0.5) 0%, rgba(15, 30, 60, 0.7) 100%);
  border: 1px solid rgba(58, 122, 213, 0.3);
  border-radius: 12px;
  padding: 16px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(58, 122, 213, 0.2);
}

.block-title {
  font-size: 15px;
  font-weight: 600;
  color: #c0d4e8;
  letter-spacing: 1px;
}

.block-sub {
  font-size: 11px;
  color: #6a8bc2;
}

.region-chart {
  flex: 1;
  width: 100%;
  min-height: 340px;
}

/* 排行榜 */
.ranking-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 6px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: rgba(58, 122, 213, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(58, 122, 213, 0.15);
  transition: all 0.3s;
}

.ranking-item:hover {
  background: rgba(58, 122, 213, 0.18);
  transform: translateX(4px);
}

.rank-medal {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.rank-medal.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
}

.rank-medal.silver {
  background: linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%);
  box-shadow: 0 0 8px rgba(192, 192, 192, 0.5);
}

.rank-medal.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #a05a2c 100%);
  box-shadow: 0 0 8px rgba(205, 127, 50, 0.5);
}

.rank-medal.normal {
  background: rgba(58, 122, 213, 0.3);
  color: #8ab3e8;
}

.medal-icon {
  font-size: 22px;
}

.medal-num {
  font-size: 16px;
  color: #fff;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-origin {
  font-size: 14px;
  font-weight: 600;
  color: #c0d4e8;
  margin-bottom: 6px;
}

.rank-progress {
  height: 6px;
  background: rgba(58, 122, 213, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1a9b6c, #67f2c2);
  border-radius: 3px;
  transition: width 1s ease-out;
}

.rank-1 .progress-bar { background: linear-gradient(90deg, #ffaa00, #ffd700); }
.rank-2 .progress-bar { background: linear-gradient(90deg, #b0b0b0, #e0e0e0); }
.rank-3 .progress-bar { background: linear-gradient(90deg, #a05a2c, #cd7f32); }

.rank-data {
  text-align: right;
  flex-shrink: 0;
}

.rank-sales {
  font-size: 16px;
  font-weight: 700;
  color: #67f2c2;
  font-family: 'Courier New', monospace;
}

.rank-amount {
  font-size: 11px;
  color: #8ab3e8;
  margin-top: 2px;
}

/* 底部 */
.screen-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6a8bc2;
  padding-top: 10px;
  border-top: 1px solid rgba(58, 122, 213, 0.2);
}

@media (max-width: 1200px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
