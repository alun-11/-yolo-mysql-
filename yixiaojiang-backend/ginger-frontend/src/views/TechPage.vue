<template>
  <div class="tech-container">
    <!-- 顶部标题栏 -->
    <el-header class="header">
      <div class="header-content">
        <el-button type="text" @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <h1>🌾 壹小姜 - 种植技术资料</h1>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧分类菜单 -->
      <el-aside width="200px" class="sidebar">
        <el-menu :default-active="activeCategory" @select="handleCategorySelect">
          <el-menu-item index="all">📚 全部资料</el-menu-item>
          <el-sub-menu index="seedling">
            <template #title>🌱 选种育苗</template>
            <el-menu-item index="seedling-select">姜种挑选</el-menu-item>
            <el-menu-item index="seedling-process">姜种处理</el-menu-item>
            <el-menu-item index="seedling-sprout">催芽技术</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="field">
            <template #title>🌿 田间管理</template>
            <el-menu-item index="field-density">种植密度</el-menu-item>
            <el-menu-item index="field-weeding">中耕除草</el-menu-item>
            <el-menu-item index="field-water">水分管理</el-menu-item>
            <el-menu-item index="field-shade">遮阴管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="fertilizer">
            <template #title>🧪 施肥技术</template>
            <el-menu-item index="fertilizer-base">基肥施用</el-menu-item>
            <el-menu-item index="fertilizer-topdress">追肥技巧</el-menu-item>
            <el-menu-item index="fertilizer-foliar">叶面施肥</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="disease">
            <template #title>🐛 病虫害防治</template>
            <el-menu-item index="disease-disease">常见病害</el-menu-item>
            <el-menu-item index="disease-pest">常见虫害</el-menu-item>
            <el-menu-item index="disease-prevent">预防措施</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="harvest">
            <template #title>🪓 收获储存</template>
            <el-menu-item index="harvest-time">收获时机</el-menu-item>
            <el-menu-item index="harvest-store">储存方法</el-menu-item>
            <el-menu-item index="harvest-fresh">保鲜技术</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="market">
            <template #title>📈 市场行情</template>
            <el-menu-item index="market-price">价格趋势</el-menu-item>
            <el-menu-item index="market-demand">市场需求</el-menu-item>
            <el-menu-item index="market-sales">销售技巧</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="favorite" class="favorite-item">⭐ 我的收藏</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-autocomplete
            v-model="searchText"
            :fetch-suggestions="querySearch"
            placeholder="搜索种植技术资料..."
            :trigger-on-focus="false"
            @select="handleSearchSelect"
            class="search-input"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-autocomplete>
          
          <div class="search-options">
            <el-select v-model="sortType" class="sort-select" placeholder="排序">
              <el-option label="最新" value="newest" />
              <el-option label="最热" value="hottest" />
              <el-option label="评分最高" value="highest" />
            </el-select>
            
            <el-button v-if="searchText" type="text" @click="clearSearch">
              清除搜索
            </el-button>
            
            <el-button type="text" @click="clearHistory" v-if="searchHistory.length > 0">
              清除历史
            </el-button>
          </div>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0 && !searchText" class="search-history">
          <span class="history-label">搜索历史：</span>
          <span 
            v-for="(item, index) in searchHistory" 
            :key="index" 
            class="history-tag"
            @click="searchText = item"
          >
            {{ item }}
          </span>
        </div>

        <!-- 内容卡片列表 -->
        <div class="content-grid">
          <el-card 
            v-for="item in filteredContent" 
            :key="item.id" 
            class="content-card"
            @click="viewDetail(item)"
          >
            <div class="card-header">
              <div class="type-badge">
                <el-tag :type="item.type === 'video' ? 'danger' : 'success'">
                  {{ item.type === 'video' ? '📹 视频' : '📄 图文' }}
                </el-tag>
              </div>
              <button 
                class="favorite-btn" 
                @click.stop="toggleFavorite(item.id)"
                :class="{ 'favorited': isFavorited(item.id) }"
              >
                <el-icon><StarFilled v-if="isFavorited(item.id)" /><Star v-else /></el-icon>
              </button>
            </div>
            
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
            
            <div class="card-footer">
              <div class="rating">
                <el-rate 
                  :value="item.rating" 
                  disabled 
                  show-score 
                  score-template="{value}"
                  class="rate"
                />
              </div>
              <div class="stats">
                <span class="view-count">👁️ {{ formatNumber(item.views) }}</span>
                <span class="publish-time">{{ item.publishTime }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredContent.length === 0" class="empty-state">
          <el-empty description="暂无相关内容" />
        </div>
      </el-main>
    </el-container>

    <!-- 详情弹窗 -->
    <el-dialog v-model="showDetail" :title="selectedContent?.title" width="70%">
      <div v-if="selectedContent" class="detail-content">
        <div class="detail-header">
          <el-tag :type="selectedContent.type === 'video' ? 'danger' : 'success'">
            {{ selectedContent.type === 'video' ? '📹 视频' : '📄 图文' }}
          </el-tag>
          <span class="detail-rating">评分：{{ selectedContent.rating }}分</span>
          <span class="detail-views">阅读量：{{ formatNumber(selectedContent.views) }}</span>
        </div>
        
        <div class="detail-body">
          <div v-if="selectedContent.type === 'video'" class="video-container">
            <el-video-player 
              class="video-player" 
              :src="selectedContent.content" 
              poster="https://via.placeholder.com/640x360"
            />
          </div>
          <div v-else class="article-content">
            <p v-for="(paragraph, index) in selectedContent.content.split('\\n')" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <div class="detail-footer">
          <span>发布时间：{{ selectedContent.publishTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Star, StarFilled, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.push('/farmer')
}

// 当前选中分类
const activeCategory = ref('all')

// 搜索相关
const searchText = ref('')
const sortType = ref('newest')
const searchHistory = ref([])
const hotKeywords = ['姜瘟病防治', '施肥技巧', '催芽技术', '价格趋势', '储存方法']

// 收藏相关
const favorites = ref([])

// 选中的内容
const showDetail = ref(false)
const selectedContent = ref(null)

// 模拟数据
const techContent = ref([
  // 选种育苗
  { id: 1, title: '如何挑选优质姜种', type: 'article', category: 'seedling-select', 
    rating: 4.8, views: 12580, publishTime: '2024-01-15', 
    description: '挑选优质姜种是种植成功的第一步，本文介绍如何从外观、重量、芽眼等方面判断姜种质量...',
    content: '## 姜种挑选要点\n\n### 一、外观判断\n1. 姜块完整，无破损、无病斑\n2. 颜色鲜艳，呈淡黄色或黄褐色\n3. 表面光滑，无霉点\n\n### 二、重量判断\n1. 手感沉重，水分充足\n2. 相同大小下，重量较大的为佳\n\n### 三、芽眼判断\n1. 芽眼饱满，分布均匀\n2. 芽眼颜色呈白色或淡黄色\n\n### 四、气味判断\n1. 有浓郁的姜香味\n2. 无异味、霉味' },
  { id: 2, title: '姜种处理三步法', type: 'article', category: 'seedling-process', 
    rating: 4.6, views: 8920, publishTime: '2024-01-12', 
    description: '姜种处理包括晒种、消毒、浸种三个步骤，正确处理可提高发芽率...',
    content: '## 姜种处理步骤\n\n### 第一步：晒种\n选择晴天，将姜种摊开晾晒2-3天\n注意避免暴晒，每天翻动2-3次\n\n### 第二步：消毒\n使用多菌灵500倍液浸泡30分钟\n或用高锰酸钾溶液浸泡10分钟\n\n### 第三步：浸种\n用生根剂溶液浸泡6-8小时\n捞出晾干后即可催芽' },
  { id: 3, title: '生姜催芽技术详解', type: 'video', category: 'seedling-sprout', 
    rating: 4.9, views: 25680, publishTime: '2024-01-10', 
    description: '本视频详细演示生姜催芽的全过程，包括温度控制、湿度管理等关键要点...',
    content: 'https://example.com/video/sprout.mp4' },
  
  // 田间管理
  { id: 4, title: '生姜最佳种植密度', type: 'article', category: 'field-density', 
    rating: 4.5, views: 6750, publishTime: '2024-01-08', 
    description: '合理的种植密度直接影响产量，本文介绍不同土壤条件下的最佳种植密度...',
    content: '## 种植密度建议\n\n### 沙壤土\n行距50-60cm，株距25-30cm\n每亩种植4500-5000株\n\n### 黏壤土\n行距60-70cm，株距30-35cm\n每亩种植3500-4000株\n\n### 注意事项\n根据品种特性适当调整\n土壤肥沃可适当密植' },
  { id: 5, title: '中耕除草技巧', type: 'article', category: 'field-weeding', 
    rating: 4.4, views: 5420, publishTime: '2024-01-05', 
    description: '及时除草可减少养分消耗，本文介绍中耕除草的时间和方法...',
    content: '## 中耕除草方法\n\n### 第一次中耕\n出苗后15-20天进行\n深度5-8cm，结合除草\n\n### 第二次中耕\n苗高20-30cm时进行\n深度3-5cm，培土护苗\n\n### 第三次中耕\n封行前进行\n主要清除行间杂草' },
  { id: 6, title: '生姜水分管理指南', type: 'video', category: 'field-water', 
    rating: 4.7, views: 18920, publishTime: '2024-01-03', 
    description: '视频讲解生姜不同生长期的浇水要点，避免积水烂根...',
    content: 'https://example.com/video/water.mp4' },
  
  // 施肥技术
  { id: 7, title: '基肥施用技术', type: 'article', category: 'fertilizer-base', 
    rating: 4.6, views: 7830, publishTime: '2024-01-01', 
    description: '基肥是生姜生长的基础，本文介绍基肥的种类和施用方法...',
    content: '## 基肥施用要点\n\n### 肥料种类\n有机肥为主：腐熟农家肥2000-3000kg/亩\n配合复合肥：氮磷钾比例3:1:4\n\n### 施用方法\n撒施后深耕20-30cm\n或开沟条施，覆土\n\n### 注意事项\n避免未腐熟肥料\n施肥后及时浇水' },
  { id: 8, title: '追肥技巧视频教程', type: 'video', category: 'fertilizer-topdress', 
    rating: 4.8, views: 22350, publishTime: '2023-12-28', 
    description: '详细演示生姜追肥的时间、种类和方法...',
    content: 'https://example.com/video/fertilizer.mp4' },
  
  // 病虫害防治
  { id: 9, title: '姜瘟病防治全攻略', type: 'article', category: 'disease-disease', 
    rating: 4.9, views: 35680, publishTime: '2023-12-25', 
    description: '姜瘟病是生姜最严重的病害，本文详细介绍预防和治疗方法...',
    content: '## 姜瘟病防治\n\n### 症状识别\n叶片发黄枯萎\n茎基部变褐腐烂\n有特殊臭味\n\n### 预防措施\n轮作倒茬\n选用抗病品种\n土壤消毒\n\n### 治疗方法\n及时清除病株\n用生石灰消毒\n喷洒杀菌剂' },
  { id: 10, title: '常见虫害防治', type: 'article', category: 'disease-pest', 
    rating: 4.5, views: 12450, publishTime: '2023-12-20', 
    description: '介绍生姜常见虫害的识别和防治方法...',
    content: '## 常见虫害\n\n### 姜螟\n危害：蛀食茎秆\n防治：灯光诱杀、药剂喷洒\n\n### 蛴螬\n危害：啃食根系\n防治：毒饵诱杀、深耕翻土\n\n### 蚜虫\n危害：吸食汁液\n防治：黄板诱杀、生物防治' },
  
  // 收获储存
  { id: 11, title: '生姜收获时机判断', type: 'article', category: 'harvest-time', 
    rating: 4.7, views: 9860, publishTime: '2023-12-15', 
    description: '掌握正确的收获时机对产量和品质至关重要...',
    content: '## 收获时机判断\n\n### 外观判断\n叶片开始发黄\n茎秆基部变褐\n\n### 时间判断\n一般在霜降前后\n种植后180-200天\n\n### 注意事项\n选晴天收获\n避免损伤姜块' },
  { id: 12, title: '生姜储存方法', type: 'video', category: 'harvest-store', 
    rating: 4.6, views: 15680, publishTime: '2023-12-10', 
    description: '视频演示生姜储存的多种方法...',
    content: 'https://example.com/video/store.mp4' },
  
  // 市场行情
  { id: 13, title: '2024年生姜价格趋势分析', type: 'article', category: 'market-price', 
    rating: 4.8, views: 28920, publishTime: '2023-12-05', 
    description: '分析今年生姜市场价格走势，帮助农户把握销售时机...',
    content: '## 价格趋势分析\n\n### 一季度\n价格平稳，略有上涨\n\n### 二季度\n供应增加，价格回落\n\n### 三季度\n需求旺季，价格上涨\n\n### 四季度\n储存姜上市，价格稳定' },
  { id: 14, title: '生姜销售技巧', type: 'article', category: 'market-sales', 
    rating: 4.5, views: 11230, publishTime: '2023-12-01', 
    description: '分享生姜销售的渠道和技巧，帮助农户提高收益...',
    content: '## 销售技巧\n\n### 渠道选择\n批发市场\n电商平台\n订单农业\n\n### 包装技巧\n分级包装\n品牌打造\n追溯体系\n\n### 定价策略\n根据品质定价\n灵活调整价格' }
])

// 获取搜索建议
const querySearch = (queryString, cb) => {
  const suggestions = hotKeywords
    .filter(keyword => keyword.toLowerCase().includes(queryString.toLowerCase()))
    .map(keyword => ({ value: keyword }))
  cb(suggestions)
}

// 搜索选择
const handleSearchSelect = (item) => {
  searchText.value = item.value
  addToHistory(item.value)
}

// 添加到搜索历史
const addToHistory = (keyword) => {
  if (!searchHistory.value.includes(keyword)) {
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
}

// 清除搜索
const clearSearch = () => {
  searchText.value = ''
}

// 清除搜索历史
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 分类选择
const handleCategorySelect = (category) => {
  activeCategory.value = category
}

// 判断是否收藏
const isFavorited = (id) => {
  return favorites.value.includes(id)
}

// 切换收藏状态
const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    ElMessage.info('已取消收藏')
  } else {
    favorites.value.push(id)
    ElMessage.success('收藏成功')
  }
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

// 查看详情
const viewDetail = (item) => {
  selectedContent.value = item
  showDetail.value = true
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 筛选后的内容
const filteredContent = computed(() => {
  let result = techContent.value
  
  // 分类筛选
  if (activeCategory.value === 'favorite') {
    result = result.filter(item => favorites.value.includes(item.id))
  } else if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value || 
      activeCategory.value === item.category.split('-')[0])
  }
  
  // 搜索筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  switch (sortType.value) {
    case 'newest':
      result = [...result].sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
      break
    case 'hottest':
      result = [...result].sort((a, b) => b.views - a.views)
      break
    case 'highest':
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
  }
  
  return result
})

// 初始化
onMounted(() => {
  // 从本地存储加载收藏和搜索历史
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  const savedHistory = localStorage.getItem('searchHistory')
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory)
  }
})
</script>

<style scoped>
.tech-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  color: white;
  font-size: 16px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header h1 {
  margin: 0;
  font-size: 22px;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #eee;
}

.sidebar :deep(.el-menu) {
  border-right: none;
}

.favorite-item {
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.main-content {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.search-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  width: 120px;
}

.search-history {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.history-label {
  color: #909399;
  margin-right: 10px;
}

.history-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 13px;
}

.history-tag:hover {
  background: #e6f7ff;
  border-color: #91d5ff;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.content-card {
  cursor: pointer;
  transition: all 0.3s;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d9d9d9;
  font-size: 20px;
  padding: 5px;
}

.favorite-btn.favorited {
  color: #f5a623;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
}

.card-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  font-size: 14px;
}

.rate {
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.empty-state {
  padding: 50px;
}

.detail-content {
  padding: 10px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-rating, .detail-views {
  color: #666;
  font-size: 14px;
}

.detail-body {
  min-height: 300px;
}

.video-container {
  text-align: center;
}

.video-player {
  width: 100%;
  max-height: 400px;
}

.article-content {
  line-height: 1.8;
  color: #333;
}

.article-content p {
  margin-bottom: 15px;
}

.detail-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  color: #909399;
  font-size: 14px;
}
</style>