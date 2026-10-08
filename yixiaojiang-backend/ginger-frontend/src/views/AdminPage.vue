<template>
  <div class="admin-container" :class="{ 'bigscreen-mode': activeMenu === 'bigscreen' }">
    <el-container v-if="activeMenu !== 'bigscreen'">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <h2>👨‍💼 管理员后台</h2>
          <span class="user-info">欢迎，{{ user.realName || user.username }}</span>
        </div>
        <div class="header-right">
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边菜单 -->
        <el-aside width="200px" class="sidebar">
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="dashboard">
              <span>📊 数据概览</span>
            </el-menu-item>
            <el-menu-item index="bigscreen">
              <span>🖥️ 数智助农大屏</span>
            </el-menu-item>
            <el-menu-item index="users">
              <span>👥 用户管理</span>
            </el-menu-item>
            <el-menu-item index="products">
              <span>📦 货源管理</span>
            </el-menu-item>
            <el-menu-item index="live">
              <span>📺 直播数据</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="main-content" v-loading="menuLoading" element-loading-text="加载中...">
          <!-- 数据概览 -->
          <div v-if="activeMenu === 'dashboard'" class="section">
            <h2>📊 数据概览</h2>
            
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card">
                  <div class="stat-icon">👨‍🌾</div>
                  <div class="stat-info">
                    <h3>{{ stats.farmerCount }}</h3>
                    <p>农户数量</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card">
                  <div class="stat-icon">🏪</div>
                  <div class="stat-info">
                    <h3>{{ stats.merchantCount }}</h3>
                    <p>商户数量</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card">
                  <div class="stat-icon">📦</div>
                  <div class="stat-info">
                    <h3>{{ stats.productCount }}</h3>
                    <p>货源总数</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card">
                  <div class="stat-icon">💰</div>
                  <div class="stat-info">
                    <h3>{{ stats.availableProductCount }}</h3>
                    <p>待售货源</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 用户管理 -->
          <div v-if="activeMenu === 'users'" class="section">
            <h2>👥 用户管理</h2>

            <el-tabs v-model="userTab">
              <el-tab-pane label="农户列表" name="farmers">
                <el-empty v-if="farmers.length === 0" description="暂无农户数据" />
                <el-table v-else :data="farmers" style="width: 100%" v-loading="usersLoading" element-loading-text="加载农户列表...">
                  <el-table-column prop="id" label="ID" width="80" />
                  <el-table-column prop="username" label="用户名" />
                  <el-table-column prop="realName" label="真实姓名" />
                  <el-table-column prop="phone" label="电话" />
                  <el-table-column prop="address" label="地址" />
                  <el-table-column prop="createTime" label="注册时间" />
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="商户列表" name="merchants">
                <el-empty v-if="merchants.length === 0" description="暂无商户数据" />
                <el-table v-else :data="merchants" style="width: 100%" v-loading="usersLoading" element-loading-text="加载商户列表...">
                  <el-table-column prop="id" label="ID" width="80" />
                  <el-table-column prop="username" label="用户名" />
                  <el-table-column prop="realName" label="真实姓名" />
                  <el-table-column prop="phone" label="电话" />
                  <el-table-column prop="address" label="地址" />
                  <el-table-column prop="createTime" label="注册时间" />
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 货源管理 -->
          <div v-if="activeMenu === 'products'" class="section">
            <h2>📦 货源管理</h2>

            <el-empty v-if="products.length === 0 && !productsLoading" description="暂无货源数据" />

            <el-table v-else :data="products" class="desktop-only" style="width: 100%" v-loading="productsLoading" element-loading-text="加载货源列表...">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="farmerName" label="农户" />
              <el-table-column prop="origin" label="产地" />
              <el-table-column prop="weight" label="重量(斤)" />
              <el-table-column prop="price" label="价格">
                <template #default="{ row }">¥{{ row.price }}</template>
              </el-table-column>
              <el-table-column prop="grade" label="等级">
                <template #default="{ row }">
                  <el-tag>{{ row.grade }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'available' ? 'success' : 'info'">
                    {{ row.status === 'available' ? '待售' : '已售' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="上架时间" />
            </el-table>

            <!-- 移动端货源卡片 -->
            <div class="mobile-card-list">
              <div v-for="item in products" :key="item.id" class="mobile-card">
                <div class="mobile-card-header">
                  <span class="mobile-card-title">{{ item.farmerName }}</span>
                  <el-tag :type="item.status === 'available' ? 'success' : 'info'" size="small">
                    {{ item.status === 'available' ? '待售' : '已售' }}
                  </el-tag>
                </div>
                <div class="mobile-card-body">
                  <div class="mobile-card-row"><span>📍 产地</span><span>{{ item.origin }}</span></div>
                  <div class="mobile-card-row"><span>⚖️ 重量</span><span>{{ item.weight }}斤</span></div>
                  <div class="mobile-card-row"><span>💰 单价</span><span>¥{{ item.price }}</span></div>
                  <div class="mobile-card-row"><span>🏷️ 等级</span><span>{{ item.grade }}</span></div>
                  <div class="mobile-card-row"><span>🕐 上架</span><span>{{ item.createTime }}</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 直播数据 -->
          <div v-if="activeMenu === 'live'" class="section">
            <h2>📺 助农直播数据中心</h2>
            
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="stat-card highlight">
                  <div class="stat-icon">📺</div>
                  <div class="stat-info">
                    <h3>{{ dashboardData.totalLiveSessions }}</h3>
                    <p>总直播场次</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card highlight">
                  <div class="stat-icon">📦</div>
                  <div class="stat-info">
                    <h3>{{ dashboardData.totalSales }}</h3>
                    <p>总销量(斤)</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card highlight">
                  <div class="stat-icon">💰</div>
                  <div class="stat-info">
                    <h3>¥{{ dashboardData.totalSalesAmount }}</h3>
                    <p>总销售额</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card highlight">
                  <div class="stat-icon">🛒</div>
                  <div class="stat-info">
                    <h3>{{ dashboardData.orderCount }}</h3>
                    <p>订单数量</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :xs="24" :md="12">
                <el-card>
                  <h3>📈 近7天销量趋势</h3>
                  <div class="chart-placeholder">
                    <p v-for="item in dashboardData.weeklySales" :key="item.day">
                      {{ item.day }}: {{ item.sales }}斤 (¥{{ item.amount }})
                    </p>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-card>
                  <h3>🏆 货源销售排行</h3>
                  <div class="ranking">
                    <div v-for="(item, index) in dashboardData.productRanking" :key="item.origin" class="ranking-item">
                      <span class="rank-number">{{ index + 1 }}</span>
                      <span class="rank-origin">{{ item.origin }}</span>
                      <span class="rank-sales">{{ item.sales }}斤</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 移动端底部导航 -->
    <div class="mobile-tab-bar">
      <div class="tab-item" :class="{ active: activeMenu === 'dashboard' }" @click="handleMenuSelect('dashboard')">
        <span class="tab-icon">📊</span><span>概览</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'bigscreen' }" @click="handleMenuSelect('bigscreen')">
        <span class="tab-icon">🖥️</span><span>大屏</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'users' }" @click="handleMenuSelect('users')">
        <span class="tab-icon">👥</span><span>用户</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'products' }" @click="handleMenuSelect('products')">
        <span class="tab-icon">📦</span><span>货源</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'live' }" @click="handleMenuSelect('live')">
        <span class="tab-icon">📺</span><span>直播</span>
      </div>
    </div>

    <!-- 数智助农大屏（全屏模式） -->
    <div v-if="activeMenu === 'bigscreen'" class="bigscreen-wrapper">
      <button class="back-btn" @click="activeMenu = 'dashboard'">
        ← 返回管理后台
      </button>
      <DataDashboard />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import DataDashboard from './admin/DataDashboard.vue'
import { mockFarmers, mockMerchants, mockProducts, mockLiveData } from '../mock'

const router = useRouter()
const API_BASE = ''
const activeMenu = ref('dashboard')
const user = ref({})
const userTab = ref('farmers')

// 加载状态
const usersLoading = ref(false)
const productsLoading = ref(false)
const menuLoading = ref(false)

// 统计数据
const stats = ref({
  farmerCount: 0,
  merchantCount: 0,
  productCount: 0,
  availableProductCount: 0
})

// 用户列表
const farmers = ref([])
const merchants = ref([])
const products = ref([])

// 直播数据
const dashboardData = ref({
  totalLiveSessions: mockLiveData.totalSessions,
  totalSales: mockLiveData.totalSales.toLocaleString(),
  totalSalesAmount: mockLiveData.totalAmount.toLocaleString(),
  orderCount: mockLiveData.totalOrders,
  weeklySales: mockLiveData.weeklySales.map(item => ({
    day: item.date.slice(5),
    sales: item.sales,
    amount: item.amount.toLocaleString()
  })),
  productRanking: mockLiveData.ranking.map(item => ({
    origin: item.origin,
    sales: item.sales
  }))
})

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    user.value = JSON.parse(userStr)
    loadStats()
    loadUsers()
    loadProducts()
    loadDashboardData()
  } else {
    router.push('/')
  }
})

const handleLogout = () => {
  localStorage.removeItem('user')
  document.body.classList.remove('bigscreen-active')
  router.push('/')
}

onBeforeUnmount(() => {
  document.body.classList.remove('bigscreen-active')
})

const handleMenuSelect = (index) => {
  // 大屏模式下隐藏全局 footer，保持纯净
  if (index === 'bigscreen') {
    document.body.classList.add('bigscreen-active')
  } else {
    document.body.classList.remove('bigscreen-active')
  }

  // 如果切换到相同菜单，不重复加载
  if (activeMenu.value === index) return

  // 直接切换（Mock 数据本地加载，无需等待）
  menuLoading.value = false
  activeMenu.value = index

  // 切换到对应菜单时按需重新加载（数据为本地同步，不产生延迟）
  if (index === 'users' && farmers.value.length === 0 && merchants.value.length === 0) {
    loadUsers()
  } else if (index === 'products' && products.value.length === 0) {
    loadProducts()
  }
}

const loadStats = async () => {
  // 使用本地 Mock 数据统计（演示场景，立即可见，不再被后端覆盖）
  const availableCount = mockProducts.filter(p => p.status === 'available').length
  stats.value = {
    farmerCount: mockFarmers.length,
    merchantCount: mockMerchants.length,
    productCount: mockProducts.length,
    availableProductCount: availableCount
  }
}

const loadUsers = async () => {
  usersLoading.value = true
  // 使用本地 Mock 数据（演示时直接展示，不再被后端的 1-2 条覆盖）
  farmers.value = mockFarmers
  merchants.value = mockMerchants
  usersLoading.value = false
}

const loadProducts = async () => {
  productsLoading.value = true
  // 使用本地 Mock 数据（演示场景）
  products.value = mockProducts
  productsLoading.value = false
}

const loadDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/v1/admin/dashboard`)
    const result = await response.json()
    if (result.code === 200) {
      dashboardData.value = {
        ...dashboardData.value,
        ...result.data
      }
    }
  } catch (error) {
    console.log('加载直播数据失败，使用模拟数据')
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-container.bigscreen-mode {
  background: #0a1530;
}

.bigscreen-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.back-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  background: rgba(58, 122, 213, 0.3);
  color: #67f2c2;
  border: 1px solid rgba(103, 242, 194, 0.4);
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(58, 122, 213, 0.5);
  transform: translateX(2px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #409eff;
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

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-card.highlight {
  border-left: 4px solid #409eff;
}

.stat-icon {
  font-size: 36px;
  margin-right: 15px;
}

.stat-info h3 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #909399;
}

.chart-placeholder {
  padding: 20px;
  background: #f9f9f9;
}

.ranking {
  padding: 10px 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.ranking-item:last-child {
  border-bottom: none;
}

.rank-number {
  width: 30px;
  height: 30px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.rank-origin {
  flex: 1;
}

.rank-sales {
  color: #67c23a;
  font-weight: bold;
}
</style>