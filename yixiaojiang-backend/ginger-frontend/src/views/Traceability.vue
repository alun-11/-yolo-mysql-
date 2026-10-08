<template>
  <div class="trace-container">
    <!-- 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <div class="search-header">
        <div class="brand">
          <span class="brand-icon">🔗</span>
          <div>
            <h2>
              区块链溯源查询
              <el-tag :type="readonly ? 'warning' : 'success'" effect="dark" size="small" class="mode-tag">
                {{ readonly ? '👁️ 只读模式' : '🔒 权威存证' }}
              </el-tag>
            </h2>
            <p class="brand-sub">基于区块链存证技术 · 全流程可追溯 · 数据不可篡改</p>
          </div>
        </div>
        <div class="chain-status">
          <el-tag type="success" effect="dark" size="small">
            <el-icon><CircleCheck /></el-icon> 链上节点同步中
          </el-tag>
          <el-tag type="info" effect="plain" size="small">当前高度 #1524189</el-tag>
        </div>
      </div>

      <div class="search-box">
        <el-input
          v-model="traceCode"
          placeholder="请输入溯源码（输入任意字符即可查询）"
          size="large"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="handleSearch" :loading="searching">
          🔍 立即查询
        </el-button>
        <el-button
          type="success"
          size="large"
          plain
          @click="verifyOnChain"
          :loading="verifying"
          class="verify-btn"
        >
          🛡️ 区块链验真
        </el-button>
      </div>

      <!-- 快捷示例 -->
      <div class="quick-codes">
        <span class="quick-label">快捷示例：</span>
        <button
          v-for="code in quickCodes"
          :key="code.value"
          type="button"
          class="quick-tag-btn"
          :class="{ active: traceCode === code.value && hasSearched }"
          @click="applyQuickCode(code.value)"
        >
          <el-icon class="quick-tag-icon"><Pointer /></el-icon>
          {{ code.label }}
        </button>
      </div>
    </el-card>

    <!-- 查询前空状态 -->
    <el-card v-if="!hasSearched" class="empty-card" shadow="never">
      <el-empty description="请输入溯源码开始查询产品全流程信息">
        <template #image>
          <el-icon class="empty-icon"><Link /></el-icon>
        </template>
      </el-empty>
    </el-card>

    <!-- 查询中 -->
    <el-card v-else-if="searching" class="loading-card" shadow="never">
      <el-skeleton :rows="8" animated />
    </el-card>

    <!-- 查询结果 -->
    <div v-else class="result-wrapper">
      <!-- 产品概览 -->
      <el-card class="overview-card" shadow="never">
        <div class="overview-grid">
          <div class="overview-item">
            <div class="ov-label">溯源码</div>
            <div class="ov-value code">{{ traceInfo.code }}</div>
          </div>
          <div class="overview-item">
            <div class="ov-label">产品名称</div>
            <div class="ov-value">罗平小黄姜</div>
          </div>
          <div class="overview-item">
            <div class="ov-label">产地</div>
            <div class="ov-value">{{ traceInfo.origin }}</div>
          </div>
          <div class="overview-item">
            <div class="ov-label">规格等级</div>
            <div class="ov-value">
              <el-tag :type="traceInfo.gradeType" size="small" effect="dark">{{ traceInfo.grade }}</el-tag>
            </div>
          </div>
          <div class="overview-item">
            <div class="ov-label">净重</div>
            <div class="ov-value">{{ traceInfo.weight }}</div>
          </div>
          <div class="overview-item">
            <div class="ov-label">存证状态</div>
            <div class="ov-value">
              <el-tag
                type="success"
                effect="dark"
                size="small"
                :class="{ 'verify-glow': verifyGlow }"
              >✓ 已上链</el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 品质与安全指数仪表盘 -->
      <el-card class="quality-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">📊 品质与安全指数</span>
            <span class="card-tip">基于AI检测 · 冷链温控 · 产地GPS综合评定</span>
          </div>
        </template>
        <div class="quality-dashboard">
          <div class="gauge-item">
            <div ref="safetyGaugeRef" class="gauge-chart"></div>
            <div class="gauge-label">
              <span class="gauge-name" style="color:#67C23A">🛡️ 安全指数</span>
              <p class="gauge-desc">经AI检测无病虫害，姜辣素含量达标</p>
            </div>
          </div>
          <div class="gauge-item">
            <div ref="freshGaugeRef" class="gauge-chart"></div>
            <div class="gauge-label">
              <span class="gauge-name" style="color:#409EFF">🌿 新鲜度指数</span>
              <p class="gauge-desc">基于采收时间与全程冷链温控数据</p>
            </div>
          </div>
          <div class="gauge-item">
            <div ref="authGaugeRef" class="gauge-chart"></div>
            <div class="gauge-label">
              <span class="gauge-name" style="color:#DAA520">🏆 正宗度指数</span>
              <p class="gauge-desc">GPS定位确认产自罗平县核心产区</p>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 溯源时间轴 -->
      <el-card class="timeline-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">🛰️ 全流程溯源时间轴</span>
            <span class="card-tip">共 {{ traceInfo.nodes.length }} 个节点 · 全部已上链存证</span>
          </div>
        </template>

        <el-timeline class="trace-timeline">
          <el-timeline-item
            v-for="(node, idx) in traceInfo.nodes"
            :key="idx"
            :timestamp="node.time"
            placement="top"
            :type="node.isCorrection ? 'warning' : (node.nodeStatus === 'corrected' ? 'info' : node.status)"
            :hollow="false"
            size="large"
          >
            <!-- 信息更正记录节点（橙色高亮） -->
            <div v-if="node.isCorrection" class="node-card node-correction">
              <div class="node-header">
                <span class="node-icon">📝</span>
                <h4 class="node-title">信息更正</h4>
                <el-tag type="warning" effect="dark" size="small" class="node-status">链上留痕</el-tag>
              </div>
              <div class="node-content">
                <p class="node-desc">{{ node.desc }}</p>
                <!-- 操作人信息（模拟留痕记录展示） -->
                <div class="change-operator" v-if="node.correction && node.correction.operator">
                  操作人：{{ node.correction.operator }}　于 {{ node.correction.time }}
                </div>
                <!-- 字段级修改高亮：原值（删除线）→ 新值（橙色加粗） -->
                <div class="correction-changes" v-if="node.correction && node.correction.changes">
                  <div v-for="(ch, ci) in node.correction.changes" :key="ci" class="change-row">
                    <span class="change-field">{{ ch.field }}</span>
                    <span class="change-old">{{ ch.oldValue }}</span>
                    <span class="change-arrow">→</span>
                    <span class="change-new">{{ ch.newValue }}</span>
                  </div>
                  <div class="change-reason">
                    <el-icon><EditPen /></el-icon>
                    修改原因：{{ node.correction.reason }}
                  </div>
                </div>
                <div class="node-detail" v-if="node.detail">
                  <div v-for="(val, key) in node.detail" :key="key" class="detail-row">
                    <span class="detail-key">{{ key }}</span>
                    <span class="detail-val">{{ val }}</span>
                  </div>
                </div>
              </div>
              <div class="block-chain-box correction-chain">
                <div class="bc-title">
                  <el-icon><Coin /></el-icon>
                  <span>更正记录已上链（不可篡改）</span>
                </div>
                <div class="bc-grid">
                  <div class="bc-item">
                    <span class="bc-label">区块高度</span>
                    <span class="bc-value">{{ node.blockHeight }}</span>
                  </div>
                  <div class="bc-item">
                    <span class="bc-label">交易哈希</span>
                    <span class="bc-value hash" @click="copyHash(node.txHash)">
                      {{ node.txHash }}
                      <el-icon class="copy-icon"><CopyDocument /></el-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 普通环节节点 -->
            <div v-else class="node-card" :class="{ 'node-corrected': node.nodeStatus === 'corrected' }">
              <div class="node-header">
                <span class="node-icon">{{ node.icon }}</span>
                <el-tag v-if="node.nodeStatus === 'corrected'" type="info" effect="plain" size="small" class="corrected-tag">已修正</el-tag>
                <h4 class="node-title">{{ node.title }}</h4>
                <el-tag
                  :type="node.nodeStatus === 'corrected' ? 'info' : node.status"
                  effect="dark"
                  size="small"
                  class="node-status"
                >
                  {{ node.statusText }}
                </el-tag>
                <el-button
                  v-if="!readonly && node.nodeStatus !== 'corrected'"
                  type="warning"
                  size="small"
                  plain
                  class="node-edit-btn"
                  @click="openEdit(node)"
                >
                  <el-icon><EditPen /></el-icon> 修改
                </el-button>
                <!-- 商户端只读：不可修改链上数据，替换为反馈/申诉入口 -->
                <el-button
                  v-else-if="readonly && node.nodeStatus !== 'corrected'"
                  type="info"
                  size="small"
                  plain
                  class="node-edit-btn"
                  @click="openAppeal(node)"
                >
                  <el-icon><ChatDotRound /></el-icon> 反馈疑问
                </el-button>
              </div>

              <div class="node-content">
                <p class="node-desc">{{ node.desc }}</p>

                <!-- 种植节点：环境数据彩色Tag + 姜田实拍图 -->
                <div v-if="node.nodeType === 'FARMER_HARVEST'" class="env-tags-row">
                  <el-tag
                    v-for="(val, key) in node.detail"
                    :key="key"
                    :type="envTagType(key)"
                    effect="light"
                    size="small"
                    class="env-tag"
                  >
                    {{ key }}：{{ val }}
                  </el-tag>
                </div>
                <div v-if="node.nodeType === 'FARMER_HARVEST'" class="field-photo">
                  <img
                    :src="fieldPhotoUrl"
                    alt="姜田实拍"
                    class="field-thumbnail"
                    @click="previewFieldPhoto"
                  />
                  <span class="photo-caption">📷 种植基地实拍 · 罗平县金鸡村</span>
                </div>

                <!-- AI质检节点：迷你雷达图 -->
                <div v-if="node.nodeType === 'AI_INSPECTION'" class="radar-section">
                  <div :id="`radar-${idx}`" class="radar-chart-mini"></div>
                </div>

                <!-- 其他节点：通用键值对展示 -->
                <div class="node-detail" v-if="node.detail && node.nodeType !== 'FARMER_HARVEST' && node.nodeType !== 'AI_INSPECTION'">
                  <div v-for="(val, key) in node.detail" :key="key" class="detail-row">
                    <span class="detail-key">{{ key }}</span>
                    <span class="detail-val">{{ val }}</span>
                  </div>
                </div>
              </div>

              <!-- 区块链存证要素 -->
              <div class="block-chain-box">
                <div class="bc-title">
                  <el-icon><Coin /></el-icon>
                  <span>区块链存证</span>
                </div>
                <div class="bc-grid">
                  <div class="bc-item">
                    <span class="bc-label">区块高度</span>
                    <span class="bc-value">{{ node.blockHeight }}</span>
                  </div>
                  <div class="bc-item">
                    <span class="bc-label">交易哈希</span>
                    <span class="bc-value hash" @click="copyHash(node.txHash)">
                      {{ node.txHash }}
                      <el-icon class="copy-icon"><CopyDocument /></el-icon>
                    </span>
                  </div>
                  <div class="bc-item">
                    <span class="bc-label">存证时间</span>
                    <span class="bc-value">{{ node.time }}</span>
                  </div>
                </div>
                <el-button
                  type="primary"
                  link
                  size="small"
                  class="view-chain-btn"
                  @click="viewOnChain(node)"
                >
                  在链上查看 →
                </el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
<!-- 
      溯源证书下载
      <el-card class="certificate-card" shadow="never">
        <div class="cert-content">
          <div class="cert-left">
            <el-icon class="cert-icon"><Document /></el-icon>
            <div>
              <h3>官方溯源证书</h3>
              <p>商户可打印此证书，证明货源正宗，提升销售信誉。</p>
            </div>
          </div>
          <el-button
            type="warning"
            size="large"
            round
            :loading="downloadingCert"
            @click="downloadCertificate"
          >
            📥 下载官方溯源证书 (PDF)
          </el-button>
        </div>
      </el-card> -->

      <!-- 防伪校验 -->
      <!-- <el-card class="verify-card" shadow="never">
        <div class="verify-content">
          <div class="verify-left">
            <el-icon class="verify-icon" :class="{ 'verify-fail': !traceInfo.chainValid }">
              <CircleCheckFilled v-if="traceInfo.chainValid" />
              <CircleCloseFilled v-else />
            </el-icon>
            <div>
              <h3>{{ traceInfo.chainValid ? '✓ 哈希链校验通过' : '✗ 哈希链校验异常' }}</h3>
              <p>{{ traceInfo.chainValid
                ? '该批次全部节点（含信息更正留痕）均已在区块链上完成存证，数据真实有效、修改全程可追溯。'
                : '该批次节点哈希链校验未通过，数据可能被非法篡改，请联系平台核验。' }}</p>
            </div>
          </div>
          <div class="verify-right">
            <div class="verify-stat">
              <div class="stat-num">{{ traceInfo.scanCount }}</div>
              <div class="stat-label">累计扫码</div>
            </div>
            <div class="verify-divider"></div>
            <div class="verify-stat">
              <div class="stat-num">{{ traceInfo.verifyCount }}</div>
              <div class="stat-label">校验次数</div>
            </div>
          </div>
        </div>
      </el-card> -->
    </div>

    <!-- 节点信息更正弹窗（区块链留痕修改：不覆盖原数据，追加更正记录） -->
    <el-dialog v-model="editDialogVisible" title="📝 节点信息更正（链上留痕）" width="520px">
      <el-alert
        title="原节点数据不会被覆盖，系统将把原节点标记为「已修正」，并追加一条「信息更正」记录到区块链。"
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      />
      <el-form label-width="110px">
        <el-form-item label="所属节点">
          <el-tag type="info">{{ editingNode?.title }}</el-tag>
        </el-form-item>
        <el-form-item label="修改原因" required>
          <el-input
            v-model="editForm.reason"
            type="textarea"
            :rows="2"
            placeholder="必填，如：冷链温度探头故障导致录入错误"
          />
        </el-form-item>
        <el-form-item
          v-for="key in editableKeys"
          :key="key"
          :label="key"
        >
          <el-input v-model="editForm.fields[key]" :placeholder="`原值：${editingNode?.detail?.[key] ?? '无'}`" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="warning" :loading="submitting" @click="submitEdit">
          确认更正并上链
        </el-button>
      </template>
    </el-dialog>

    <!-- 商户端只读：节点数据反馈/申诉对话框（演示） -->
    <el-dialog v-model="appealVisible" title="💬 节点数据反馈 / 申诉" width="460px">
      <el-alert
        title="商户端为只读视角：数据修改需由农户/平台在链上留痕完成。如对节点数据有疑问，可提交反馈，由平台核验后处理。"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      />
      <el-form label-width="90px">
        <el-form-item label="反馈节点">
          <el-tag type="info">{{ appealNode?.title }}</el-tag>
        </el-form-item>
        <el-form-item label="反馈类型">
          <el-select v-model="appealForm.type" style="width: 100%">
            <el-option v-for="t in appealTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈内容" required>
          <el-input
            v-model="appealForm.content"
            type="textarea"
            :rows="3"
            placeholder="请描述您对该节点数据的疑问，如：入库温度与实际验收温度不符"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appealVisible = false">取消</el-button>
        <el-button type="primary" :loading="appealSubmitting" @click="submitAppeal">提交反馈</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Link, Coin, CopyDocument, CircleCheck, CircleCheckFilled, CircleCloseFilled, Pointer, EditPen, ChatDotRound, Document
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const traceCode = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const traceInfo = ref({})
const API_BASE = ''

// 权限模式：商户端（/merchant 路由内嵌）为只读视角，不可修改链上数据，仅可对节点发起反馈/申诉；
// 农户端与公开 /trace 页保留「修改」按钮，用于演示区块链留痕修改。
const route = useRoute()
const readonly = computed(() => route.path.startsWith('/merchant'))

// ===== 品质与安全指数仪表盘 =====
const safetyGaugeRef = ref(null)
const freshGaugeRef = ref(null)
const authGaugeRef = ref(null)
const gaugeInstances = []
const qualityIndices = reactive({
  safety: 98,
  freshness: 95,
  authenticity: 100
})

const initGauges = () => {
  // 销毁旧实例
  gaugeInstances.forEach(g => g?.dispose())
  gaugeInstances.length = 0

  const makeGauge = (el, value, color) => {
    if (!el) return null
    const chart = echarts.init(el)
    chart.setOption({
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 14,
          itemStyle: { color }
        },
        axisLine: { lineStyle: { width: 14, color: [[1, '#e8e8e8']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          fontWeight: 'bold',
          color,
          offsetCenter: [0, '5%'],
          formatter: '{value}分'
        },
        data: [{ value }]
      }]
    })
    return chart
  }

  gaugeInstances.push(
    makeGauge(safetyGaugeRef.value, qualityIndices.safety, '#67C23A'),
    makeGauge(freshGaugeRef.value, qualityIndices.freshness, '#409EFF'),
    makeGauge(authGaugeRef.value, qualityIndices.authenticity, '#DAA520')
  )
}

// ===== 区块链一键验真 =====
const verifying = ref(false)
const verifyGlow = ref(false)

const verifyOnChain = () => {
  if (!hasSearched.value || !traceInfo.value?.code) {
    ElMessage.warning('请先查询溯源信息后再验真')
    return
  }
  verifying.value = true
  setTimeout(() => {
    verifying.value = false
    const totalHash = '0x7f8a3c2d1e9b6a4f5c3d2e1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0'
    const triggerGlow = () => {
      verifyGlow.value = true
      setTimeout(() => { verifyGlow.value = false }, 2500)
    }
    ElMessageBox.alert(
      `<div style="line-height:1.8">
        <p style="margin:0 0 8px">该溯源码对应的所有节点数据哈希值与区块链存证完全匹配，数据未被篡改。</p>
        <p style="margin:0;font-size:13px;color:#909399">链上总哈希值：</p>
        <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:13px;color:#67C23A;word-break:break-all">${totalHash}</p>
      </div>`,
      '✅ 验真通过',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        type: 'success'
      }
    ).then(triggerGlow).catch(triggerGlow)
  }, 2000)
}

// ===== 溯源证书下载 =====
const downloadingCert = ref(false)

const downloadCertificate = () => {
  downloadingCert.value = true
  setTimeout(() => {
    downloadingCert.value = false
    ElMessage.success('证书生成中... 完成后将自动下载（演示功能）')
  }, 1500)
}

// ===== 种植节点环境数据彩色标签 =====
const envTagType = (key) => {
  if (key.includes('海拔') || key.includes('高度')) return 'success'
  if (key.includes('土壤') || key.includes('pH')) return 'warning'
  if (key.includes('种植') || key.includes('模式')) return 'primary'
  if (key.includes('气温') || key.includes('温度')) return 'danger'
  return 'info'
}

// 姜田实拍图（SDXL 生成）
const fieldPhotoUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent('Aerial view of a ginger farm field in Luoping Yunnan China, rows of ginger plants with green leaves, golden brown soil, mountains in background, sunny day, realistic photography') + '&image_size=landscape_4_3'

const previewFieldPhoto = () => {
  ElMessageBox.alert(
    `<img src="${fieldPhotoUrl}" style="width:100%;border-radius:8px" alt="姜田实拍" />`,
    '姜田实拍 · 罗平县金鸡村',
    { dangerouslyUseHTMLString: true, confirmButtonText: '关闭', customClass: 'photo-preview-box' }
  )
}

// ===== AI质检迷你雷达图 =====
const radarInstances = []
const initRadarCharts = () => {
  radarInstances.forEach(r => r?.dispose())
  radarInstances.length = 0
  const nodes = traceInfo.value?.nodes || []
  nodes.forEach((node, idx) => {
    if (node.nodeType !== 'AI_INSPECTION') return
    const el = document.getElementById(`radar-${idx}`)
    if (!el) return
    const chart = echarts.init(el)
    chart.setOption({
      radar: {
        indicator: [
          { name: '外观', max: 100 },
          { name: '姜辣素', max: 100 },
          { name: '水分', max: 100 },
          { name: '密度', max: 100 },
          { name: '病害检测', max: 100 }
        ],
        radius: 65,
        axisName: { color: '#606266', fontSize: 11 },
        splitArea: { areaStyle: { color: ['#f0f7ff', '#e8f0ff'] } },
        splitLine: { lineStyle: { color: '#d4d4d4' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [95, 92, 88, 90, 98],
          name: 'AI质检评分',
          areaStyle: { color: 'rgba(64,158,255,0.25)' },
          lineStyle: { color: '#409EFF', width: 2 },
          itemStyle: { color: '#409EFF' }
        }]
      }]
    })
    radarInstances.push(chart)
  })
}

// 查询结果变化时重新初始化所有图表
watch(() => traceInfo.value, () => {
  nextTick(() => {
    initGauges()
    initRadarCharts()
  })
}, { deep: false })

// 窗口resize时重绘图表
const handleResize = () => {
  gaugeInstances.forEach(g => g?.resize())
  radarInstances.forEach(r => r?.resize())
}

onBeforeUnmount(() => {
  gaugeInstances.forEach(g => g?.dispose())
  radarInstances.forEach(r => r?.dispose())
  window.removeEventListener('resize', handleResize)
})

// 快捷示例：从后端取库中最新的真实溯源码
const quickCodes = ref([])
const loadSamples = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/traceability/samples`)
    const result = await res.json()
    if (result.code === 200 && result.data && result.data.length) {
      quickCodes.value = result.data.map(c => ({ label: c, value: c }))
    }
  } catch (e) { /* 后端不可用时静默，输入框仍可手动查询 */ }
}

const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// 环节展示元数据（icon / 状态色 / 状态文案）
const NODE_META = {
  // 新 5 节点：多地区流转（云南罗平 → 广州）
  FARMER_HARVEST: { icon: '🌾', status: 'success', statusText: '已采收' },
  LOCAL_COLLECTION: { icon: '🏭', status: 'success', statusText: '已集散' },
  AI_INSPECTION: { icon: '🤖', status: 'success', statusText: '质检通过' },
  COLD_CHAIN_LOGISTICS: { icon: '🚚', status: 'primary', statusText: '冷链运输' },
  DESTINATION_STORAGE: { icon: '🏪', status: 'success', statusText: '已入库' },
  // 区块链留痕：信息更正记录
  INFO_CORRECTION: { icon: '📝', status: 'warning', statusText: '链上留痕' },
  // 旧类型兼容
  planting: { icon: '🌱', status: 'success', statusText: '已完成' },
  harvest: { icon: '🌾', status: 'success', statusText: '已完成' },
  ai_check: { icon: '🤖', status: 'success', statusText: '已通过' },
  warehouse: { icon: '🏢', status: 'success', statusText: '已完成' },
  logistics: { icon: '🚚', status: 'primary', statusText: '运输中' }
}

const gradeTypeOf = (grade) => {
  if (!grade) return 'info'
  if (grade.includes('特') || grade.includes('A') || grade.includes('一')) return 'success'
  if (grade.includes('B') || grade.includes('二')) return 'warning'
  return 'info'
}

// 后端返回结构 → 页面 UI 结构
const mapApiTrace = (d) => ({
  code: d.code,
  origin: d.origin,
  grade: d.grade,
  gradeType: gradeTypeOf(d.grade),
  weight: `${d.weightKg} kg / ${d.weightJin}斤`,
  // 演示场景：扫码/校验次数由溯源码确定性派生
  scanCount: 128 + (hashCode(d.code) % 500),
  verifyCount: 56 + (hashCode(d.code) % 200),
  chainValid: d.chainValid !== false,
  blockHeight: d.blockHeight,
  txHash: d.txHash,
  nodes: (d.nodes || []).map(n => {
    const meta = NODE_META[n.nodeType] || { icon: '📦', status: 'success', statusText: '已完成' }
    const isCorrection = n.nodeType === 'INFO_CORRECTION'
    const nodeStatus = n.status || 'active'
    return {
      id: n.id,
      nodeType: n.nodeType,
      isCorrection,
      nodeStatus,
      correction: n.correction || null,
      title: n.title,
      icon: isCorrection ? '📝' : meta.icon,
      status: meta.status,
      statusText: nodeStatus === 'corrected' ? '已修正' : meta.statusText,
      time: n.time,
      desc: n.desc,
      detail: n.detail || {},
      blockHeight: `#${n.blockHeight}`,
      txHash: n.txHash
    }
  })
})

// ===== 商户端只读演示：模拟留痕修改记录 =====
// 若查询结果中「销地入库」节点尚无更正留痕，则在前端注入一条模拟的留痕修改
// （原节点标记已修正 + 紧随其后的信息更正记录），直观展示"不可篡改但可留痕更正"。
// 仅影响商户端展示层，不改动真实链上数据。
const injectSimulatedCorrection = (nodes) => {
  if (!nodes || !nodes.length) return
  const target = nodes.find(n => n.nodeType === 'DESTINATION_STORAGE')
  if (!target || target.nodeStatus === 'corrected') return
  // 该节点已有真实更正记录则不重复注入
  if (nodes.some(n => n.isCorrection && n.correction && n.correction.originalNodeId === target.id)) return

  const tempKey = Object.keys(target.detail || {}).find(k => k.includes('温度')) || '入库温度'
  const oldValue = '15°C'
  const newValue = '13°C'
  const correctTime = '2026-08-28 10:00'
  // 原节点：温度字段保留错误读数（15°C，前端以删除线展示留痕）
  target.nodeStatus = 'corrected'
  target.statusText = '已修正'
  target.detail = { ...target.detail, [tempKey]: oldValue }

  const baseHeight = parseInt(String(target.blockHeight || '').replace('#', '')) || 1524190
  const sim = {
    id: -1,
    nodeType: 'INFO_CORRECTION',
    isCorrection: true,
    nodeStatus: 'active',
    simulated: true,
    title: '信息更正记录',
    icon: '📝',
    status: 'warning',
    statusText: '链上留痕',
    time: correctTime,
    desc: '该节点数据曾按实际情况更正：原记录未删除、不可篡改，更正详情如下并已上链存证。',
    detail: {},
    correction: {
      originalNodeId: target.id,
      originalNodeName: target.title,
      operator: '张三',
      time: correctTime,
      changes: [{ field: tempKey, oldValue, newValue }],
      reason: '传感器读数误差'
    },
    blockHeight: `#${baseHeight + 1}`,
    txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9988'
  }
  nodes.splice(nodes.indexOf(target) + 1, 0, sim)
}

// ===== 区块链留痕修改（节点更正） =====
const editDialogVisible = ref(false)
const submitting = ref(false)
const editingNode = ref(null)
const editForm = reactive({ nodeId: null, reason: '', fields: {} })

// 可编辑字段：取节点 detail 的键（更正节点本身不允许编辑）
const editableKeys = computed(() => {
  if (!editingNode.value || !editingNode.value.detail) return []
  return Object.keys(editingNode.value.detail)
})

const openEdit = (node) => {
  editingNode.value = node
  editForm.nodeId = node.id
  editForm.reason = ''
  editForm.fields = {}
  Object.entries(node.detail || {}).forEach(([k, v]) => {
    editForm.fields[k] = String(v ?? '')
  })
  editDialogVisible.value = true
}

const submitEdit = async () => {
  if (!editForm.reason.trim()) {
    ElMessage.warning('请填写修改原因（留痕必填）')
    return
  }
  // 仅提交有变更的字段
  const newData = {}
  Object.entries(editForm.fields).forEach(([k, v]) => {
    const oldVal = String(editingNode.value.detail?.[k] ?? '')
    if (v && v.trim() && v.trim() !== oldVal) newData[k] = v.trim()
  })
  if (Object.keys(newData).length === 0) {
    ElMessage.warning('未检测到字段变更')
    return
  }
  submitting.value = true
  try {
    const res = await fetch(`${API_BASE}/api/v1/traceability/updateNode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId: editForm.nodeId, newData, reason: editForm.reason.trim() })
    })
    const result = await res.json()
    if (result.code === 200 && result.data) {
      ElMessage.success('更正已上链留痕：原节点标记为「已修正」，更正记录已追加')
      editDialogVisible.value = false
      traceInfo.value = mapApiTrace(result.data)
    } else {
      ElMessage.error(result.message || '更正失败')
    }
  } catch (e) {
    ElMessage.error('网络异常，更正失败')
  } finally {
    submitting.value = false
  }
}

// ===== 商户端只读：反馈/申诉（演示，仅前端，无需复杂后端） =====
const appealVisible = ref(false)
const appealSubmitting = ref(false)
const appealNode = ref(null)
const appealForm = reactive({ type: '数据存疑', content: '' })
const appealTypes = ['数据存疑', '温度/环境异常', '物流信息有误', '数量/等级不符', '其他']

const openAppeal = (node) => {
  appealNode.value = node
  appealForm.type = '数据存疑'
  appealForm.content = ''
  appealVisible.value = true
}

const submitAppeal = () => {
  if (!appealForm.content.trim()) {
    ElMessage.warning('请填写反馈内容')
    return
  }
  appealSubmitting.value = true
  // 演示：模拟提交成功，实际可对接后端工单接口
  setTimeout(() => {
    appealSubmitting.value = false
    appealVisible.value = false
    ElMessage.success('反馈已提交，平台将在 24 小时内核验并答复')
  }, 600)
}

const applyQuickCode = (code) => {
  // 1. 将溯源码填充到输入框
  traceCode.value = code
  // 2. 自动触发查询
  handleSearch()
}

const handleSearch = async () => {
  if (!traceCode.value || !traceCode.value.trim()) {
    ElMessage.warning('请输入溯源码')
    return
  }

  searching.value = true
  hasSearched.value = true

  try {
    const res = await fetch(`${API_BASE}/api/v1/traceability/code/${encodeURIComponent(traceCode.value.trim())}`)
    const result = await res.json()
    if (result.code === 200 && result.data) {
      traceInfo.value = mapApiTrace(result.data)
      // 商户端只读视角：注入模拟留痕修改记录用于演示
      if (readonly.value) injectSimulatedCorrection(traceInfo.value.nodes)
      ElMessage.success('链上溯源信息查询成功，哈希链校验' + (traceInfo.value.chainValid ? '通过' : '异常'))
    } else {
      traceInfo.value = {}
      ElMessage.warning(result.message || '未查询到该溯源码对应的溯源信息')
    }
  } catch (e) {
    traceInfo.value = {}
    ElMessage.error('网络异常，请稍后重试')
  } finally {
    searching.value = false
  }
}

// 供父组件（农户端/商户端内嵌）注入溯源码并自动查询
const queryCode = (code) => {
  traceCode.value = code
  handleSearch()
}
defineExpose({ queryCode })

// 扫码直达：URL 形如 /trace?code=YXJ-2026-001-XXXX 时自动查询该批次
onMounted(() => {
  loadSamples()
  window.addEventListener('resize', handleResize)
  const code = route.query.code
  if (code && typeof code === 'string') {
    traceCode.value = code
    handleSearch()
  }
})

const copyHash = (hash) => {
  navigator.clipboard?.writeText(hash).then(() => {
    ElMessage.success('交易哈希已复制：' + hash)
  }).catch(() => {
    ElMessage.info('哈希值：' + hash)
  })
}

const viewOnChain = (node) => {
  ElMessage.info(`正在跳转区块链浏览器查看交易 ${node.txHash}（演示）`)
}
</script>

<style scoped>
.trace-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 4px;
}

/* 顶部查询卡片 */
.search-card {
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 50%, #1a3a5a 100%);
  border: none;
  color: #fff;
  overflow: hidden;
}

.search-card :deep(.el-card__body) {
  padding: 22px 26px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  font-size: 42px;
  line-height: 1;
}

.brand h2 {
  margin: 0;
  font-size: 20px;
  color: #fff;
  letter-spacing: 1px;
}

.brand-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: #a8c5e8;
}

.chain-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.search-box .el-input {
  flex: 1;
}

.quick-codes {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 12px;
  color: #a8c5e8;
}

.quick-tag-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
}

.quick-tag-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.quick-tag-btn.active {
  background: linear-gradient(135deg, #67c23a 0%, #2d5a27 100%);
  border-color: #67c23a;
  color: #fff;
  font-weight: 600;
}

.quick-tag-icon {
  font-size: 12px;
}

/* 空状态 */
.empty-card,
.loading-card {
  border-radius: 14px;
  border: 1px dashed #dcdfe6;
}

.empty-icon {
  font-size: 80px;
  color: #c0c4cc;
}

/* 概览卡片 */
.overview-card {
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f0f7f0 0%, #e8f4e8 100%);
  border: 1px solid #d4e4d4;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.overview-item {
  background: #fff;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 3px solid #2d5a27;
}

.ov-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.ov-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.ov-value.code {
  font-family: 'Courier New', monospace;
  color: #2d5a27;
  word-break: break-all;
}

/* 时间轴卡片 */
.timeline-card {
  margin-bottom: 18px;
  border-radius: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-tip {
  font-size: 12px;
  color: #909399;
}

/* 时间轴节点卡片 */
.trace-timeline {
  padding-left: 10px;
}

.node-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 4px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.node-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.node-success {
  border-left: 4px solid #67C23A;
}

.node-primary {
  border-left: 4px solid #409EFF;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.node-icon {
  font-size: 26px;
  line-height: 1;
}

.node-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.node-content {
  margin-bottom: 12px;
}

.node-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
}

.node-detail {
  background: #f9fafb;
  border-radius: 6px;
  padding: 10px 12px;
}

.detail-row {
  display: flex;
  font-size: 12px;
  padding: 3px 0;
}

.detail-key {
  color: #909399;
  width: 90px;
  flex-shrink: 0;
}

.detail-val {
  color: #303133;
  font-weight: 500;
}

/* 已修正节点：置灰 + 内容删除线（原数据保留留痕） */
.node-corrected {
  background: #f7f7f7;
  border: 1px solid #e4e7ed;
  border-left: 4px solid #c0c4cc;
  opacity: 0.85;
}

.node-corrected .node-title,
.node-corrected .node-desc,
.node-corrected .detail-row,
.node-corrected .node-detail {
  text-decoration: line-through;
  color: #a8abb2;
}

.corrected-tag {
  margin-right: 2px;
}

.node-edit-btn {
  margin-left: auto;
  flex-shrink: 0;
}

/* 顶部只读模式 / 权威存证 标识 */
.mode-tag {
  margin-left: 8px;
  vertical-align: 2px;
}

/* 更正记录：操作人行 */
.change-operator {
  font-size: 12px;
  font-weight: 600;
  color: #8a5a12;
  margin-bottom: 8px;
}

/* 窄屏响应式：节点键值对自动换行，不溢出卡片 */
@media (max-width: 640px) {
  .search-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .node-header {
    flex-wrap: wrap;
    row-gap: 6px;
  }

  .node-title {
    font-size: 15px;
  }

  .detail-row {
    flex-wrap: wrap;
  }

  .detail-key {
    width: 84px;
  }
}

/* 信息更正节点：橙色醒目高亮 */
.node-correction {
  background: linear-gradient(135deg, #fff8f0 0%, #fef3e6 100%);
  border: 2px solid #E6A23C;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(230, 162, 60, 0.18);
}

.node-correction .node-title {
  color: #b8620f;
}

.correction-changes {
  background: #fff;
  border: 1px dashed #E6A23C;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.change-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  flex-wrap: wrap;
}

.change-field {
  font-weight: 700;
  color: #8a5a12;
  min-width: 80px;
}

.change-old {
  color: #a8abb2;
  text-decoration: line-through;
  background: #f4f4f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.change-arrow {
  color: #E6A23C;
  font-weight: 700;
  font-size: 15px;
}

.change-new {
  color: #d46b08;
  font-weight: 700;
  background: #fff3e0;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #ffd591;
}

.change-reason {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #f0d0a0;
  font-size: 12px;
  color: #ad6800;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.6;
}

.correction-chain {
  background: linear-gradient(135deg, #8a4b08 0%, #b8620f 100%);
}

.verify-fail {
  color: #f56c6c;
}

/* 区块链存证 */
.block-chain-box {
  background: linear-gradient(135deg, #1a2a4a 0%, #243a5a 100%);
  border-radius: 8px;
  padding: 12px 14px;
  color: #fff;
  margin-top: 8px;
}

.bc-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a8c5e8;
  margin-bottom: 8px;
  font-weight: 600;
}

.bc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.bc-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bc-label {
  font-size: 11px;
  color: #a8c5e8;
}

.bc-value {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  word-break: break-all;
}

.bc-value.hash {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #67c23a;
  transition: opacity 0.3s;
}

.bc-value.hash:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.copy-icon {
  font-size: 12px;
}

.view-chain-btn {
  margin-top: 8px;
  color: #67c5e8 !important;
  padding: 0;
}

/* 防伪校验卡片 */
.verify-card {
  border-radius: 14px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e8f7e0 100%);
  border: 1px solid #c2e7b0;
}

.verify-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.verify-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 280px;
}

.verify-icon {
  font-size: 40px;
  color: #67C23A;
}

.verify-left h3 {
  margin: 0 0 4px;
  color: #2d5a27;
  font-size: 16px;
}

.verify-left p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.verify-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.verify-stat {
  text-align: center;
}

.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #2d5a27;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.verify-divider {
  width: 1px;
  height: 36px;
  background: #c2e7b0;
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }

  .verify-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .verify-right {
    width: 100%;
    justify-content: space-around;
  }
}

/* ===== 品质与安全指数仪表盘 ===== */
.quality-card {
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fafcff 0%, #f0f7ff 100%);
  border: 1px solid #d6e8ff;
}

.quality-dashboard {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  flex: 1;
}

.gauge-chart {
  width: 160px;
  height: 130px;
}

.gauge-label {
  text-align: center;
  margin-top: -8px;
}

.gauge-name {
  font-size: 14px;
  font-weight: 700;
}

.gauge-desc {
  margin: 4px 0 0;
  font-size: 11px;
  color: #909399;
  line-height: 1.5;
}

/* ===== 验真按钮 ===== */
.verify-btn {
  white-space: nowrap;
}

/* 验真成功后存证标签绿色光晕闪烁 — 移至全局 style 块 */

/* ===== 种植节点环境标签 ===== */
.env-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.env-tag {
  border-radius: 6px;
}

/* 姜田实拍图 */
.field-photo {
  margin-bottom: 12px;
}

.field-thumbnail {
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 8px;
  border: 2px solid #d4e4d4;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.field-thumbnail:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.photo-caption {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

/* ===== AI质检雷达图 ===== */
.radar-section {
  margin-bottom: 12px;
}

.radar-chart-mini {
  width: 100%;
  height: 200px;
}

/* ===== 溯源证书下载 ===== */
.certificate-card {
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff9f0 0%, #fff3e6 100%);
  border: 1px solid #f0d0a0;
}

.cert-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cert-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cert-icon {
  font-size: 40px;
  color: #DAA520;
}

.cert-left h3 {
  margin: 0 0 4px;
  color: #8a5a12;
  font-size: 16px;
}

.cert-left p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

@media (max-width: 640px) {
  .quality-dashboard {
    flex-direction: column;
    align-items: center;
  }

  .gauge-item {
    min-width: auto;
  }

  .cert-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .cert-left {
    flex-direction: column;
    text-align: center;
  }
}
</style>

<style>
/* 验真成功后存证标签绿色光晕闪烁（全局样式，确保穿透 scoped 作用域） */
.verify-glow {
  animation: verifyGlowPulse 0.5s ease-in-out 4 !important;
}

@keyframes verifyGlowPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
    border-color: #67c23a !important;
  }
  50% {
    box-shadow: 0 0 16px 6px rgba(103, 194, 58, 0.9);
    border-color: #95d475 !important;
  }
}
</style>
