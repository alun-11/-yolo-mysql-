<template>
  <div class="merchant-container">
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <h2>🏪 商户端</h2>
          <span class="user-info">欢迎，{{ user.realName || user.username }}</span>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="router.push('/price')">📊 查看价格行情</el-button>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边菜单 -->
        <el-aside width="200px" class="sidebar">
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="products">
              <span>📦 货源列表</span>
            </el-menu-item>
            <el-menu-item index="price">
              <span>💰 价格行情</span>
            </el-menu-item>
            <el-menu-item index="trace">
              <span>🔗 溯源查询</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="main-content" v-loading="menuLoading" element-loading-text="加载中...">
          <!-- 货源列表 -->
          <div v-if="activeMenu === 'products'" class="section">
            <h2>📦 货源列表</h2>

            <el-empty v-if="products.length === 0 && !loading" description="暂无货源数据，请稍后再来查看" />

            <el-table v-else :data="products" class="desktop-only" style="width: 100%" v-loading="loading" element-loading-text="加载货源中...">
              <el-table-column prop="farmerName" label="农户名称" />
              <el-table-column prop="origin" label="产地" />
              <el-table-column prop="traceabilityCode" label="溯源码" width="180">
                <template #default="{ row }">
                  <span class="trace-code">{{ row.traceabilityCode || '—' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="重量(斤)" />
              <el-table-column prop="price" label="价格(元/斤)">
                <template #default="{ row }">
                  <span class="price">¥{{ row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="总价">
                <template #default="{ row }">
                  <span class="total-price">¥{{ (row.weight * row.price).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="harvestDate" label="采收日期" />
              <el-table-column prop="grade" label="等级">
                <template #default="{ row }">
                  <el-tag :type="getGradeType(row.grade)">{{ row.grade }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="primary" size="small" @click="contactFarmer(row)">联系农户</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 移动端货源卡片 -->
            <div class="mobile-card-list">
              <div v-for="item in products" :key="item.id" class="mobile-card" v-loading="loading">
                <div class="mobile-card-header">
                  <span class="mobile-card-title">{{ item.farmerName }}</span>
                  <el-tag :type="getGradeType(item.grade)" size="small">{{ item.grade }}</el-tag>
                </div>
                <div class="mobile-card-body">
                  <div class="mobile-card-row"><span>📍 产地</span><span>{{ item.origin }}</span></div>
                  <div class="mobile-card-row"><span>🔗 溯源码</span><span class="trace-code">{{ item.traceabilityCode || '—' }}</span></div>
                  <div class="mobile-card-row"><span>⚖️ 重量</span><span>{{ item.weight }}斤</span></div>
                  <div class="mobile-card-row"><span>💰 单价</span><span class="price">¥{{ item.price }}/斤</span></div>
                  <div class="mobile-card-row"><span>📅 采收</span><span>{{ item.harvestDate }}</span></div>
                </div>
                <div class="mobile-card-footer">
                  <el-button type="primary" size="small" @click="contactFarmer(item)">联系</el-button>
                  <el-button type="success" size="small" @click="viewQrCode(item)">二维码</el-button>
                  <el-button type="warning" size="small" @click="goTrace(item)">溯源</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 价格行情 -->
          <div v-if="activeMenu === 'price'" class="section">
            <h2>💰 价格行情</h2>
            <PricePage />
          </div>

          <!-- 溯源查询 -->
          <div v-if="activeMenu === 'trace'" class="section">
            <Traceability />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 移动端底部导航 -->
    <div class="mobile-tab-bar">
      <div class="tab-item" :class="{ active: activeMenu === 'products' }" @click="handleMenuSelect('products')">
        <span class="tab-icon">📦</span><span>货源</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'price' }" @click="handleMenuSelect('price')">
        <span class="tab-icon">💰</span><span>行情</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'trace' }" @click="handleMenuSelect('trace')">
        <span class="tab-icon">🔗</span><span>溯源</span>
      </div>
    </div>

    <!-- 联系农户对话框 -->
    <el-dialog v-model="contactDialogVisible" title="联系农户" width="400px">
      <div class="contact-info">
        <p><strong>农户名称：</strong>{{ currentProduct?.farmerName }}</p>
        <p><strong>联系电话：</strong>{{ currentProduct?.farmerPhone || '138****8001' }}</p>
        <p><strong>产地：</strong>{{ currentProduct?.origin }}</p>
        <p><strong>可供应量：</strong>{{ currentProduct?.weight }}斤</p>

        <div class="mock-tip">
          <el-alert title="[模拟] 这是演示数据，实际可联系农户获取更多信息" type="info" :closable="false" />
        </div>
      </div>
      <template #footer>
        <el-button @click="contactDialogVisible = false">关闭</el-button>
        <el-button type="primary">发起咨询</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PricePage from './PricePage.vue'
import Traceability from './Traceability.vue'
import QRCode from 'qrcode'

const router = useRouter()
const API_BASE = ''
const activeMenu = ref('products')
const user = ref({})
const products = ref([])
// 静态溯源码绑定（与溯源查询页快捷示例一致）
const TRACE_CODES = ['YXJ-26-001-A3F8B2', 'YXJ-2026-007-077565', 'YXJ-2026-008-4E1DC3']
const loading = ref(false)

const contactDialogVisible = ref(false)
const qrDialogVisible = ref(false)
const currentProduct = ref(null)
const qrDataUrl = ref('')

// 切换菜单（不跳转路由）
const menuLoading = ref(false)
const handleMenuSelect = (key) => {
  if (activeMenu.value === key) return
  // 菜单切换：数据均为本地 Mock，直接切换
  activeMenu.value = key
  menuLoading.value = false
}

// 货源溯源：同步后端并获取真实溯源码（幂等）
const ensureTraceFor = async (product) => {
  if (product.traceCode) return product.traceCode
  try {
    const payload = {
      id: product.id,
      farmerId: product.farmerId || 1,
      farmerName: product.farmerName || '农户',
      origin: product.origin,
      weight: product.weight,
      price: product.price,
      harvestDate: product.harvestDate,
      grade: product.grade,
      status: product.status
    }
    const res = await fetch(`${API_BASE}/api/v1/traceability/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    if (result.code === 200 && result.data) {
      product.traceCode = result.data.code
      return product.traceCode
    }
    ElMessage.warning(result.message || '获取溯源信息失败')
    return null
  } catch (e) {
    ElMessage.error('网络异常，获取溯源信息失败')
    return null
  }
}

const goTrace = async (product) => {
  // 不跳转页面，直接获取并显示该批次溯源码
  const code = await ensureTraceFor(product)
  if (code) {
    ElMessage({ type: 'success', message: `该批次溯源码：${code}`, duration: 6000, showClose: true })
  }
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    user.value = JSON.parse(userStr)
    loadProducts()
  } else {
    router.push('/')
  }
})

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/')
}

const loadProducts = async () => {
  loading.value = true
  try {
    // 农户电话映射（联系农户弹窗用），获取失败不影响货源展示
    const phoneMap = {}
    try {
      const ures = await fetch(`${API_BASE}/api/v1/user/role/farmer`)
      const uresult = await ures.json()
      if (uresult.code === 200 && Array.isArray(uresult.data)) {
        uresult.data.forEach(f => { phoneMap[f.realName] = f.phone })
      }
    } catch (e) { /* ignore */ }

    const res = await fetch(`${API_BASE}/api/v1/product/available`)
    const result = await res.json()
    if (result.code === 200 && Array.isArray(result.data)) {
      products.value = result.data.map((p, idx) => ({
        ...p,
        farmerPhone: phoneMap[p.farmerName] || '',
        traceabilityCode: TRACE_CODES[idx] || ''
      }))
    } else {
      products.value = []
    }
  } catch (e) {
    ElMessage.error('加载货源失败，请稍后重试')
    products.value = []
  } finally {
    loading.value = false
  }
}

const getGradeType = (grade) => {
  const types = { 'A': 'success', 'B': 'warning', 'C': 'info' }
  return types[grade] || 'info'
}

const contactFarmer = (product) => {
  currentProduct.value = product
  contactDialogVisible.value = true
}
</script>

<style scoped>
.merchant-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #67c23a;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.sidebar {
  background: #f5f5f5;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  background: #fff;
  padding: 20px;
}

.section h2 {
  margin-bottom: 20px;
  color: #333;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.total-price {
  color: #67c23a;
  font-weight: bold;
  font-size: 16px;
}

.contact-info {
  padding: 10px;
}

.contact-info p {
  margin: 15px 0;
  font-size: 16px;
}

.mock-tip {
  margin-top: 20px;
}

.product-info {
  text-align: left;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.product-info h4 {
  margin-bottom: 10px;
  color: #333;
}

.product-info p {
  margin: 8px 0;
  color: #666;
}

.mobile-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.mobile-tab-bar .tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}

.mobile-tab-bar .tab-item.active {
  color: #67c23a;
}

.mobile-tab-bar .tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.mobile-card-list {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-tab-bar {
    display: flex;
  }

  .mobile-card-list {
    display: block;
    padding-bottom: 80px;
  }

  .mobile-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 15px;
    overflow: hidden;
  }

  .mobile-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .mobile-card-body {
    padding: 10px 15px;
  }

  .mobile-card-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 14px;
    color: #666;
  }

  .mobile-card-row .price {
    color: #f56c6c;
    font-weight: bold;
  }

  .mobile-card-footer {
    display: flex;
    gap: 8px;
    padding: 10px 15px;
    border-top: 1px solid #f0f0f0;
  }

  .sidebar {
    display: none !important;
  }

  .main-content {
    padding: 15px;
  }

  .header-left h2 {
    font-size: 16px;
  }

  .header-right {
    gap: 8px;
  }

  .header-right .el-button {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* 溯源码列样式 */
.trace-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
}
</style>
