<template>
  <div class="farmer-container">
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <h2>👨‍🌾 农户端</h2>
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
            <el-menu-item index="ai">
              <span>🤖 AI病虫害识别</span>
            </el-menu-item>
            <el-menu-item index="technology">
              <span>📚 种植技术资料</span>
            </el-menu-item>
            <el-menu-item index="products">
              <span>📦 我的货源</span>
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
          <!-- AI病虫害识别 -->
          <div v-if="activeMenu === 'ai'" class="section">
            <h2>🤖 AI病虫害识别</h2>
            <el-card>
              <p class="tip">上传生姜叶片图片，AI将自动识别病虫害情况</p>

              <!-- 快速体验样品 -->
              <div class="quick-samples">
                <div class="samples-header">
                  <span class="samples-title">🎯 快速体验样品</span>
                  <span class="samples-tip">点击下方任意样品，立即体验 AI 识别效果</span>
                </div>
                <div class="samples-list">
                  <div
                    v-for="sample in sampleLibrary"
                    :key="sample.id"
                    class="sample-thumb"
                    :class="{ active: activeSampleId === sample.id }"
                    @click="trySample(sample)"
                  >
                    <div class="thumb-img">
                      <img :src="sample.image" :alt="sample.name" class="thumb-photo" />
                    </div>
                    <div class="thumb-name">{{ sample.name }}</div>
                  </div>
                </div>
              </div>

              <!-- 模式切换导航栏（上传 / 示例） -->
              <div class="mode-switch-bar">
                <div
                  class="mode-tab"
                  :class="{ active: !activeSampleId }"
                  @click="resetToUpload"
                >
                  <span class="mode-icon">📤</span>
                  <span>上传图片识别</span>
                </div>
                <div
                  v-for="sample in sampleLibrary"
                  :key="'nav-' + sample.id"
                  class="mode-tab"
                  :class="{ active: activeSampleId === sample.id }"
                  @click="trySample(sample)"
                >
                  <span class="mode-icon">🖼️</span>
                  <span>{{ sample.name }}</span>
                </div>
              </div>

              <!-- 识别中骨架屏（替代转圈动画） -->
              <div v-if="detecting" class="detecting-skeleton">
                <div class="skeleton-title">
                  <el-skeleton style="width: 160px;" />
                </div>
                <el-row :gutter="16">
                  <el-col :span="10">
                    <el-skeleton :rows="5" animated />
                  </el-col>
                  <el-col :span="14">
                    <el-skeleton :rows="6" animated />
                    <el-skeleton style="width: 80%; margin-top: 14px;" :rows="3" animated />
                  </el-col>
                </el-row>
              </div>

              <div class="ai-detect-layout">
                <!-- 左侧：图片上传框 -->
                <div class="left-panel">
                  <el-upload
                    class="upload-area-small"
                    drag
                    :action="API_BASE + '/api/v1/ai/disease-detect'"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="beforeUpload"
                    :on-change="handleFileChange"
                    :on-remove="handleRemove"
                    name="image"
                    accept="image/*"
                    :limit="1"
                    :auto-upload="true"
                  >
                    <div v-if="!previewImage && !activeSampleId" class="upload-placeholder">
                      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                      <div class="el-upload__text">
                        拖拽图片<br/>或 <em>点击上传</em>
                      </div>
                    </div>
                    <div v-else-if="activeSampleId && activeSamplePreview" class="upload-preview sample-preview-box">
                      <img :src="activeSamplePreview.image" :alt="activeSamplePreview.name" class="sample-preview-photo" />
                      <div class="sample-preview-label">{{ activeSamplePreview.name }}</div>
                      <button type="button" class="back-upload-btn" @click.stop="resetToUpload">
                        ← 返回上传照片
                      </button>
                    </div>
                    <div v-else class="upload-preview" @click="previewVisible = true">
                      <img :src="previewImage" class="preview-image-small" />
                      <div class="preview-mask"><el-icon><ZoomIn /></el-icon> 点击查看大图</div>
                    </div>
                  </el-upload>
                </div>

                <!-- 右侧：识别结果 -->
                <div class="right-panel">
                  <div v-if="detectResult" class="result-card">
                    <h3>🔍 AI识别结果</h3>
                    <el-descriptions :column="1" border size="small">
                      <el-descriptions-item label="检测结果">
                        <el-tag :type="detectResult.disease === '健康' ? 'success' : 'danger'" effect="dark">
                          {{ detectResult.disease }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="置信度">
                        <el-progress
                          :percentage="confidencePercent"
                          :format="() => confidencePercentText"
                          :stroke-width="10"
                          :color="detectResult.disease === '健康' ? '#67C23A' : '#F56C6C'"
                        />
                      </el-descriptions-item>
                      <el-descriptions-item label="严重程度">
                        <el-tag :type="detectResult.severity === '无' ? 'success' : 'warning'">
                          {{ detectResult.severity }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="品级判定">
                        <el-tag :type="detectResult.gradeType" effect="dark">
                          {{ detectResult.gradeLabel }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="建议收购价">
                        <span class="price-highlight">¥{{ detectResult.purchasePrice }}/斤</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="姜辣素估算区间">
                        <span class="gingerol-highlight">{{ detectResult.gingerolRange }}</span>
                      </el-descriptions-item>
                    </el-descriptions>

                    <div class="suggestion-box">
                      <h4>💡 农技处置 SOP</h4>
                      <ol class="sop-list">
                        <li v-for="(step, idx) in detectResult.sopSteps" :key="idx">
                          <span class="sop-index">{{ idx + 1 }}</span>
                          <span class="sop-text">{{ step }}</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <div v-else class="result-placeholder">
                    <el-icon class="placeholder-icon"><Loading /></el-icon>
                    <p>请上传图片或点击样品开始识别</p>
                  </div>
                </div>
              </div>

              <!-- AI分选详情面板 -->
              <div v-if="detectResult" class="analysis-card">
                <AIAnalysisPanel :diseaseResult="detectResult" />
              </div>
            </el-card>
          </div>

          <!-- 种植技术资料 -->
          <div v-if="activeMenu === 'technology'" class="section">
            <h2>📚 种植技术资料</h2>

            <!-- 第一级：分类图标卡片网格 -->
            <div v-if="!selectedCategory && !currentArticle" class="tech-categories-grid">
              <div
                v-for="cat in techCategories"
                :key="cat.key"
                class="category-card"
                @click="selectCategory(cat.key)"
              >
                <div class="category-icon">{{ cat.icon }}</div>
                <div class="category-name">{{ cat.name }}</div>
                <div class="category-count">{{ getArticleCount(cat.key) }} 篇资料</div>
              </div>
            </div>

            <!-- 第二级：子分类图标卡片 -->
            <div v-else-if="selectedCategory && !currentArticle && !selectedSubCategory" class="tech-categories-grid">
              <div class="breadcrumb-bar">
                <el-button type="primary" plain size="small" @click="backToCategories">
                  <el-icon><arrow-left /></el-icon> 返回全部分类
                </el-button>
                <span class="breadcrumb-title">{{ currentCategoryIcon }} {{ currentCategoryName }}</span>
              </div>
              <div
                v-for="sub in currentSubCategories"
                :key="sub.key"
                class="category-card sub-category-card"
                @click="selectSubCategory(sub.key)"
              >
                <div class="category-icon sub-icon">{{ getSubIcon(sub.key) }}</div>
                <div class="category-name">{{ sub.name }}</div>
                <div class="category-count">{{ getSubArticleCount(sub.key) }} 篇资料</div>
              </div>
            </div>

            <!-- 第三级：文章列表 -->
            <div v-else-if="selectedCategory && !currentArticle" class="article-list">
              <div class="breadcrumb-bar">
                <el-button type="primary" plain size="small" @click="backToSubCategories">
                  <el-icon><arrow-left /></el-icon> 返回上一级
                </el-button>
                <span class="breadcrumb-title">{{ currentCategoryIcon }} {{ currentCategoryName }} / {{ currentSubCategoryName }}</span>
              </div>
              <div v-if="filteredArticles.length > 0" class="articles-grid">
                <div
                  v-for="item in filteredArticles"
                  :key="item.id"
                  class="article-card"
                  @click="showArticle(item)"
                >
                  <div class="article-icon">{{ item.icon }}</div>
                  <div class="article-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                    <div class="article-meta">
                      <span>📖 {{ item.views }}</span>
                      <span>⭐ {{ item.rating }}</span>
                    </div>
                  </div>
                  <el-button type="primary" size="small">查看</el-button>
                </div>
              </div>
              <el-empty v-else description="暂无相关资料" />
            </div>

            <!-- 第四级：文章详情（保留作为完整阅读视图） -->
            <div v-else class="article-detail">
              <div class="breadcrumb-bar">
                <el-button type="primary" plain size="small" @click="backToArticleList">
                  <el-icon><arrow-left /></el-icon> 返回列表
                </el-button>
                <span class="breadcrumb-title">{{ currentArticle.icon }} {{ currentArticle.title }}</span>
              </div>
              <div class="article-body">
                <div v-html="currentArticle.content"></div>
              </div>
            </div>

            <!-- 资料详情对话框 -->
            <el-dialog
              v-model="articleDialogVisible"
              :title="currentArticle ? `${currentArticle.icon} ${currentArticle.title}` : '资料详情'"
              width="720px"
              class="article-dialog"
            >
              <div v-if="currentArticle" class="dialog-article">
                <div class="dialog-meta">
                  <el-tag type="success" size="small">📖 阅读量 {{ currentArticle.views }}</el-tag>
                  <el-tag type="warning" size="small">⭐ 评分 {{ currentArticle.rating }}</el-tag>
                  <el-tag size="small">📅 发布于 {{ currentArticle.publishTime || '2026-08-01' }}</el-tag>
                  <el-tag type="info" size="small">📂 {{ currentCategoryName }} / {{ currentSubCategoryName }}</el-tag>
                </div>
                <el-divider />
                <div class="dialog-content" v-html="currentArticle.content"></div>
              </div>
            </el-dialog>
          </div>

          <!-- 我的货源 -->
          <div v-if="activeMenu === 'products'" class="section">
            <h2>📦 我的货源</h2>
            <div class="product-header">
              <el-button type="primary" @click="showAddDialog = true">+ 添加货源</el-button>
              <el-button type="success" @click="refreshProducts" :loading="productsLoading">
                <el-icon><refresh /></el-icon> 刷新
              </el-button>
            </div>

            <el-empty v-if="myProducts.length === 0 && !productsLoading" description="暂无货源数据，点击「添加货源」上架您的第一批小黄姜" />

            <el-table v-else :data="myProducts" class="desktop-only" style="width: 100%" border v-loading="productsLoading" element-loading-text="加载中...">
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="origin" label="产地" />
              <el-table-column prop="traceabilityCode" label="溯源码" width="180">
                <template #default="{ row }">
                  <span class="trace-code">{{ row.traceabilityCode || '—' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="重量(斤)" />
              <el-table-column prop="price" label="价格(元/斤)" width="120">
                <template #default="{ row }">
                  <el-tag type="primary">¥{{ row.price }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="harvestDate" label="采收日期" />
              <el-table-column prop="grade" label="等级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getGradeType(row.grade)">{{ getGradeLabel(row.grade) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'available' ? 'success' : 'info'">
                    {{ row.status === 'available' ? '待售' : '已售' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button type="success" size="small" @click="editProduct(row)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteProduct(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 移动端货源卡片 -->
            <div class="mobile-card-list">
              <div v-for="item in myProducts" :key="item.id" class="mobile-card">
                <div class="mobile-card-header">
                  <span class="mobile-card-title">{{ item.origin }}</span>
                  <el-tag :type="item.status === 'available' ? 'success' : 'info'" size="small">
                    {{ item.status === 'available' ? '待售' : '已售' }}
                  </el-tag>
                </div>
                <div class="mobile-card-body">
                  <div class="mobile-card-row"><span>⚖️ 重量</span><span>{{ item.weight }}斤</span></div>
                  <div class="mobile-card-row"><span>💰 单价</span><span style="color:#67c23a;font-weight:bold;">¥{{ item.price }}/斤</span></div>
                  <div class="mobile-card-row"><span>📅 采收</span><span>{{ item.harvestDate }}</span></div>
                  <div class="mobile-card-row"><span>🏷️ 等级</span><span>{{ getGradeLabel(item.grade) }}</span></div>
                  <div class="mobile-card-row"><span>🔗 溯源码</span><span class="trace-code">{{ item.traceabilityCode || '—' }}</span></div>
                </div>
                <div class="mobile-card-footer">
                  <el-button type="success" size="small" @click="editProduct(item)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteProduct(item)">删除</el-button>
                </div>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="stats-row">
              <el-card class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-info">
                  <div class="stat-value">{{ myProducts.length }}</div>
                  <div class="stat-label">货源总数</div>
                </div>
              </el-card>
              <el-card class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <div class="stat-value">{{ availableCount }}</div>
                  <div class="stat-label">待售数量</div>
                </div>
              </el-card>
              <el-card class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <div class="stat-value">¥{{ totalAmount }}</div>
                  <div class="stat-label">预估总价</div>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 价格行情 -->
          <div v-if="activeMenu === 'price'" class="section">
            <h2>💰 价格行情</h2>
            <PricePage />
          </div>

          <!-- 溯源查询（农户端：可对节点发起留痕修改） -->
          <div v-if="activeMenu === 'trace'" class="section">
            <Traceability />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 移动端底部导航 -->
    <div class="mobile-tab-bar">
      <div class="tab-item" :class="{ active: activeMenu === 'ai' }" @click="handleMenuSelect('ai')">
        <span class="tab-icon">🤖</span><span>AI识别</span>
      </div>
      <div class="tab-item" :class="{ active: activeMenu === 'technology' }" @click="handleMenuSelect('technology')">
        <span class="tab-icon">📚</span><span>技术</span>
      </div>
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

    <!-- 添加/修改货源对话框 -->
    <el-dialog :model-value="showAddDialog" :title="isEdit ? '修改货源' : '添加货源'" width="500px">
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="产地" required>
          <el-input v-model="productForm.origin" placeholder="请输入产地，如：云南省罗平县" />
        </el-form-item>
        <el-form-item label="重量(斤)" required>
          <el-input-number v-model="productForm.weight" :min="0.1" :step="0.1" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="价格(元/斤)" required>
          <el-input-number v-model="productForm.price" :min="0.01" :precision="2" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="采收日期" required>
          <el-date-picker v-model="productForm.harvestDate" type="date" placeholder="选择采收日期" />
        </el-form-item>
        <el-form-item label="等级" required>
          <el-select v-model="productForm.grade" placeholder="选择等级">
            <el-option label="A级（优质）" value="A" />
            <el-option label="B级（良好）" value="B" />
            <el-option label="C级（普通）" value="C" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请描述产品特点..." />
        </el-form-item>
        <el-form-item label="产品图片">
          <el-upload
            class="upload-area"
            drag
            :action="API_BASE + '/api/v1/product/upload'"
            :on-success="handleImageUpload"
            :on-error="handleUploadError"
            name="image"
            accept="image/*"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽图片到此处或 <em>点击上传</em>
            </div>
          </el-upload>
          <img v-if="productForm.imageUrl" :src="API_BASE + productForm.imageUrl" class="preview-image" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveProduct">{{ isEdit ? '保存修改' : '提交' }}</el-button>
      </template>
    </el-dialog>

    <!-- 图片大图查看 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewImage ? [previewImage] : []"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Refresh, Loading, ArrowLeft, ZoomIn } from '@element-plus/icons-vue'
import PricePage from './PricePage.vue'
import Traceability from './Traceability.vue'
import AIAnalysisPanel from '../components/AIAnalysisPanel.vue'

const router = useRouter()
const API_BASE = ''
const activeMenu = ref('ai')
const user = ref({})

// AI识别结果
const detectResult = ref(null)
const uploadedImageUrl = ref('')
const previewImage = ref('')
const previewVisible = ref(false)
const detecting = ref(false)
const activeSampleId = ref(null)

// 快速体验样品库（使用 AI 生成的真实生姜照片）
const gingerImg = (prompt) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`

const sampleLibrary = [
  {
    id: 1,
    name: '正常姜',
    image: '/ginger-healthy.jpg'
  },
  {
    id: 2,
    name: '姜瘟病',
    image: '/ginger-blight-42.jpeg'
  },
  {
    id: 3,
    name: '叶枯病',
    image: '/ginger-leaf-blight-2-3.jpg'
  }
]

// 样品识别结果映射
const sampleResultMap = {
  1: {
    disease: '健康',
    confidence: '0.9856',
    severity: '无',
    gradeLabel: '特级',
    gradeType: 'success',
    purchasePrice: '8.5',
    gingerolRange: '2.8% - 3.2%',
    sopSteps: [
      '继续保持良好的田间管理，避免积水',
      '定期巡检，每周观察1次叶片状态',
      '采收后及时晾晒，储存于通风干燥处'
    ]
  },
  2: {
    disease: '姜瘟病',
    confidence: '0.9723',
    severity: '重度',
    gradeLabel: '等外',
    gradeType: 'danger',
    purchasePrice: '3.2',
    gingerolRange: '0.8% - 1.1%',
    sopSteps: [
      '立即拔除病株并集中销毁，防止扩散',
      '对病穴及周围1米土壤撒施石灰消毒',
      '全田喷施72%农用硫酸链霉素4000倍液，每7天一次，连续3次',
      '收获后禁止留种，与非姜科作物轮作3年以上'
    ]
  },
  3: {
    disease: '叶枯病',
    confidence: '0.9418',
    severity: '中度',
    gradeLabel: '二级',
    gradeType: 'warning',
    purchasePrice: '5.5',
    gingerolRange: '1.5% - 1.8%',
    sopSteps: [
      '剪除发病叶片并带出田外集中处理',
      '喷施10%苯醚甲环唑1500倍液，每7-10天一次',
      '加强通风透光，合理疏密种植',
      '雨后及时排水，降低田间湿度'
    ]
  }
}

// 当前选中样品的预览信息
const activeSamplePreview = computed(() => {
  if (!activeSampleId.value) return null
  return sampleLibrary.find(s => s.id === activeSampleId.value)
})

// 置信度数值（解决 IEEE754 浮点长尾，例如 0.9418*100=94.17999999999999）
const confidencePercent = computed(() => {
  if (!detectResult.value?.confidence) return 0
  const raw = parseFloat(detectResult.value.confidence)
  return isNaN(raw) ? 0 : +(raw * 100).toFixed(2)
})
// 置信度文本：保留 2 位小数 + %
const confidencePercentText = computed(() => {
  if (!detectResult.value?.confidence) return '0%'
  return confidencePercent.value + '%'
})

// 点击样品触发模拟识别
const trySample = (sample) => {
  if (detecting.value) return
  activeSampleId.value = sample.id
  detecting.value = true
  detectResult.value = null
  previewImage.value = ''

  // Mock 数据直接同步展示，无需模拟 AI 计算延迟
  setTimeout(() => {
    detecting.value = false
    detectResult.value = sampleResultMap[sample.id]
    ElMessage.success('AI 识别完成！')
  }, 0)
}

// 我的货源
const myProducts = ref([])
// 静态溯源码绑定（与溯源查询页快捷示例一致）
const TRACE_CODES = ['YXJ-26-001-A3F8B2', 'YXJ-2026-007-077565', 'YXJ-2026-008-4E1DC3']

// 添加/修改货源
const showAddDialog = ref(false)
const isEdit = ref(false)
const productForm = reactive({
  id: null,
  origin: '',
  weight: 0,
  price: 0,
  harvestDate: '',
  grade: 'B',
  description: '',
  imageUrl: ''
})

// 统计信息
const availableCount = computed(() => {
  return myProducts.value.filter(p => p.status === 'available').length
})

const totalAmount = computed(() => {
  return myProducts.value.reduce((sum, p) => {
    return sum + (p.price * p.weight)
  }, 0).toFixed(2)
})

// 种植技术分类
const techCategories = ref([
  { 
    key: 'seedling', 
    name: '选种育苗', 
    icon: '🌱',
    children: [
      { key: 'seed-selection', name: '姜种挑选' },
      { key: 'seed-treatment', name: '姜种处理' },
      { key: 'accelerating', name: '催芽技术' }
    ]
  },
  { 
    key: 'field', 
    name: '田间管理', 
    icon: '🌾',
    children: [
      { key: 'density', name: '种植密度' },
      { key: 'weeding', name: '中耕除草' },
      { key: 'water-management', name: '水分管理' },
      { key: 'shading', name: '遮阴管理' }
    ]
  },
  { 
    key: 'fertilizer', 
    name: '施肥技术', 
    icon: '🧪',
    children: [
      { key: 'base-fertilizer', name: '基肥施用' },
      { key: 'topdressing', name: '追肥技巧' },
      { key: 'foliar', name: '叶面施肥' }
    ]
  },
  { 
    key: 'disease', 
    name: '病虫害防治', 
    icon: '🐛',
    children: [
      { key: 'bacterial-wilt', name: '姜瘟病' },
      { key: 'anthracnose', name: '炭疽病' },
      { key: 'leaf-blight', name: '叶枯病' },
      { key: 'borer', name: '姜螟' },
      { key: 'aphid', name: '蚜虫' }
    ]
  },
  { 
    key: 'harvest', 
    name: '收获储存', 
    icon: '📦',
    children: [
      { key: 'harvest-time', name: '收获时机' },
      { key: 'storage', name: '储存方法' }
    ]
  },
  { 
    key: 'market', 
    name: '市场行情', 
    icon: '📊',
    children: [
      { key: 'price-trend', name: '价格趋势' },
      { key: 'sales-tips', name: '销售技巧' }
    ]
  }
])

// 选中的分类
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)

// 获取分类图标
const currentCategoryIcon = computed(() => {
  const cat = techCategories.value.find(c => c.key === selectedCategory.value)
  return cat ? cat.icon : ''
})

// 获取当前子分类名称
const currentSubCategoryName = computed(() => {
  if (!selectedSubCategory.value) return ''
  for (const cat of techCategories.value) {
    const sub = cat.children?.find(s => s.key === selectedSubCategory.value)
    if (sub) return sub.name
  }
  return ''
})

// 获取当前分类的子分类
const currentSubCategories = computed(() => {
  const cat = techCategories.value.find(c => c.key === selectedCategory.value)
  return cat?.children || []
})

// 获取子分类图标
const getSubIcon = (subKey) => {
  const iconMap = {
    'seed-selection': '🫘',
    'seed-treatment': '🧴',
    'accelerating': '🌱',
    'density': '📏',
    'weeding': '✂️',
    'water-management': '💧',
    'shading': '☂️',
    'base-fertilizer': '🌾',
    'top-fertilizer': '💪',
    'foliar-spray': '🧪',
    'bacterial-wilt': '🦠',
    'anthracnose': '🍂',
    'leaf-blight': '🍁',
    'borer': '🐛',
    'aphid': '🐜',
    'harvest-time': '⏰',
    'storage': '📦',
    'price-trend': '📈',
    'sales-skills': '💼'
  }
  return iconMap[subKey] || '📄'
}

// 获取分类下文章数量
const getArticleCount = (catKey) => {
  return techArticles.value.filter(a => a.category === catKey).length
}

// 获取子分类下文章数量
const getSubArticleCount = (subKey) => {
  return techArticles.value.filter(a => a.subCategory === subKey).length
}

// 选择分类
const selectCategory = (key) => {
  selectedCategory.value = key
  selectedSubCategory.value = null
  currentArticle.value = null
}

// 选择子分类
const selectSubCategory = (key) => {
  selectedSubCategory.value = key
  currentArticle.value = null
}

// 返回全部分类
const backToCategories = () => {
  selectedCategory.value = null
  selectedSubCategory.value = null
  currentArticle.value = null
}

// 返回子分类列表
const backToSubCategories = () => {
  selectedSubCategory.value = null
  currentArticle.value = null
}

// 当前分类名称
const currentCategoryName = computed(() => {
  const cat = techCategories.value.find(c => c.key === selectedCategory.value)
  return cat ? cat.name : ''
})

// 过滤后的文章
const filteredArticles = computed(() => {
  let articles = techArticles.value
  if (selectedCategory.value) {
    articles = articles.filter(a => a.category === selectedCategory.value)
  }
  if (selectedSubCategory.value) {
    articles = articles.filter(a => a.subCategory === selectedSubCategory.value)
  }
  return articles
})

// 种植技术文章
const techArticles = ref([
  {
    id: 1,
    title: '生姜种植技巧',
    icon: '🌱',
    description: '从选种到收获的完整种植指南',
    category: 'seedling',
    subCategory: 'seed-selection',
    views: 1256,
    rating: '4.8',
    publishTime: '2026-07-15',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🌱 生姜种植技巧</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、选种与处理</h3>
        <p>选择饱满、无病虫害的姜块作为种姜，单块重量以50-100克为宜。播种前将种姜晾晒2-3天，提高发芽率。可使用多菌灵溶液浸种消毒，预防病害。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、整地与施肥</h3>
        <p>选择土层深厚、疏松肥沃、排水良好的沙质壤土。播种前深翻土地30厘米以上，施足基肥，每亩施腐熟有机肥2000-3000公斤、复合肥50公斤。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、播种与密度</h3>
        <p>适宜播种期为清明至谷雨之间。采用穴播或条播，行距60-70厘米，株距20-25厘米，每亩播种量150-200公斤。播种后覆土5-10厘米。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、田间管理</h3>
        <p><strong>中耕除草：</strong>苗高15-20厘米时进行第一次中耕，以后每20-30天进行一次。</p>
        <p><strong>浇水：</strong>保持土壤湿润，特别是夏季高温季节要及时浇水，但避免积水。</p>
        <p><strong>培土：</strong>生长中后期分次培土，防止姜块外露变绿。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">五、收获与储存</h3>
        <p>霜降前后收获最为适宜。收获后晾干表面水分，可窖藏或堆放，保持温度10-15℃，湿度80-90%。</p>
      </div>
    `
  },
  {
    id: 2,
    title: '姜种挑选标准',
    icon: '🌰',
    description: '如何挑选优质姜种',
    category: 'seedling',
    subCategory: 'seed-selection',
    views: 892,
    rating: '4.7',
    publishTime: '2026-07-20',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🌰 姜种挑选标准</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、外观要求</h3>
        <p>选择姜块饱满、表皮光滑、色泽金黄的健康姜种。避免选择表皮皱缩、变色或有机械损伤的姜块。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、大小要求</h3>
        <p>单块姜种重量以50-100克为宜。过小的姜种养分不足，过大则浪费种姜。每块姜种上应有2-3个饱满的芽眼。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、健康检查</h3>
        <p>仔细检查姜种表面，确保无病虫害斑点、无腐烂迹象。切开姜种，内部应为淡黄色，无褐变或异味。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、品种选择</h3>
        <p>根据当地气候、土壤条件和市场需求选择适宜品种。推荐选用脱毒良种，产量高、品质好、抗病性强。</p>
      </div>
    `
  },
  {
    id: 3,
    title: '催芽技术要点',
    icon: '💡',
    description: '提高发芽率的关键技术',
    category: 'seedling',
    subCategory: 'accelerating',
    views: 678,
    rating: '4.6',
    publishTime: '2026-06-28',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">💡 催芽技术要点</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、晒种处理</h3>
        <p>播种前将姜种摊放在阳光下晾晒2-3天，每天翻动数次。晒种可促进姜种内部营养物质转化，提高发芽率。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、浸种消毒</h3>
        <p>使用50%多菌灵可湿性粉剂500倍液浸种30分钟，或用100倍石灰水浸种1小时。浸种后捞出沥干，可有效预防病害。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、温床催芽</h3>
        <p>将处理好的姜种放在温床或温室中，保持温度20-25℃，湿度80-90%。可使用湿沙或湿稻草覆盖，大约20-30天即可出芽。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、芽期管理</h3>
        <p>姜芽出土后要及时揭去覆盖物，增加光照。保持适宜温度，避免低温冻害。待姜芽长至1-2厘米时即可播种。</p>
      </div>
    `
  },
  {
    id: 4,
    title: '施肥管理',
    icon: '🧪',
    description: '科学施肥提高产量和品质',
    category: 'fertilizer',
    subCategory: 'base-fertilizer',
    views: 1023,
    rating: '4.8',
    publishTime: '2026-07-05',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🧪 生姜施肥管理</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、基肥</h3>
        <p>播种前每亩施腐熟有机肥2000-3000公斤，复合肥50公斤，硫酸锌1公斤。将肥料均匀撒施后翻入土中。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、追肥</h3>
        <p><strong>苗肥：</strong>苗高10-15厘米时，每亩追施尿素10公斤，促进幼苗生长。</p>
        <p><strong>壮苗肥：</strong>苗高30厘米左右时，每亩追施复合肥20公斤、尿素10公斤。</p>
        <p><strong>膨大肥：</strong>8-9月姜块膨大期，每亩追施复合肥30公斤、硫酸钾15公斤。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、叶面施肥</h3>
        <p>生长中后期可喷施0.2%磷酸二氢钾、0.1%硫酸锌等叶面肥，每隔7-10天一次，连续2-3次。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、施肥注意事项</h3>
        <ul>
          <li>避免偏施氮肥，注意氮磷钾平衡</li>
          <li>施肥时避免直接接触姜块</li>
          <li>雨后或灌溉后施肥效果更佳</li>
          <li>根据土壤肥力调整施肥量</li>
        </ul>
      </div>
    `
  },
  {
    id: 5,
    title: '浇水管理',
    icon: '💧',
    description: '合理灌溉保证生姜生长',
    category: 'field',
    subCategory: 'water-management',
    views: 856,
    rating: '4.7',
    publishTime: '2026-07-10',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">💧 生姜浇水管理</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、浇水原则</h3>
        <p>生姜喜湿润但不耐涝。全生长期要求土壤湿润，田间持水量保持在70-80%。避免积水，防止烂根。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、各生育期浇水</h3>
        <p><strong>播种出苗期：</strong>保持土壤湿润，促进发芽出苗。</p>
        <p><strong>幼苗期：</strong>适当控水，促进根系发育。</p>
        <p><strong>生长旺盛期：</strong>加大浇水量，特别是夏季高温季节，每3-5天浇一次水。</p>
        <p><strong>姜块膨大期：</strong>保持土壤湿润，促进姜块膨大。</p>
        <p><strong>收获前：</strong>适当控水，有利于储存。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、浇水方式</h3>
        <p><strong>沟灌：</strong>适用于大面积种植，灌水量大。</p>
        <p><strong>喷灌：</strong>节约用水，适合丘陵地区。</p>
        <p><strong>滴灌：</strong>节水高效，能精准供水。</p>
      </div>
    `
  },
  {
    id: 6,
    title: '姜瘟病防治',
    icon: '🦠',
    description: '姜瘟病的识别与综合防治',
    category: 'disease',
    subCategory: 'bacterial-wilt',
    views: 2156,
    rating: '4.9',
    publishTime: '2026-08-01',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #c0392b; margin-bottom: 20px;">🦠 姜瘟病防治</h2>
        
        <h3 style="color: #c0392b; margin-top: 20px; margin-bottom: 10px;">一、病害症状</h3>
        <p>姜瘟病又称姜腐败病，是生姜生产中最严重的病害之一。主要症状：</p>
        <ul>
          <li>叶片从下往上变黄萎蔫</li>
          <li>茎基部变软、水渍状</li>
          <li>内部组织变褐发黑</li>
          <li>有恶臭气味溢出</li>
          <li>姜块腐烂、水渍状</li>
        </ul>
        
        <h3 style="color: #c0392b; margin-top: 20px; margin-bottom: 10px;">二、发病规律</h3>
        <p>病菌可在土壤中存活2年以上，通过种姜、土壤、水流、农具等传播。高温高湿条件下容易暴发流行。</p>
        
        <h3 style="color: #27ae60; margin-top: 20px; margin-bottom: 10px;">三、防治方法</h3>
        <p><strong>农业防治：</strong></p>
        <ul>
          <li>选用无病种姜，播种前消毒</li>
          <li>合理轮作，与非姜科作物轮作3年以上</li>
          <li>增施有机肥，提高植株抗病力</li>
          <li>雨后及时排水，避免积水</li>
        </ul>
        <p><strong>物理防治：</strong></p>
        <ul>
          <li>发现病株及时拔除销毁</li>
          <li>用石灰消毒病穴</li>
          <li>农具使用后及时消毒</li>
        </ul>
        <p><strong>化学防治：</strong></p>
        <ul>
          <li>喷施72%农用硫酸链霉素可溶性粉剂4000倍液</li>
          <li>或喷施20%噻菌铜悬浮剂500倍液</li>
          <li>每隔7-10天喷一次，连续2-3次</li>
        </ul>
      </div>
    `
  },
  {
    id: 7,
    title: '炭疽病防治',
    icon: '🍂',
    description: '炭疽病的识别与防治方法',
    category: 'disease',
    subCategory: 'anthracnose',
    views: 1567,
    rating: '4.8',
    publishTime: '2026-07-25',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #e67e22; margin-bottom: 20px;">🍂 炭疽病防治</h2>
        
        <h3 style="color: #e67e22; margin-top: 20px; margin-bottom: 10px;">一、病害症状</h3>
        <p>炭疽病主要危害叶片，也可侵害茎秆和姜块。叶片发病初期出现圆形或近圆形病斑，后期病斑扩大，多个病斑融合致叶片枯死。</p>
        
        <h3 style="color: #e67e22; margin-top: 20px; margin-bottom: 10px;">二、发病规律</h3>
        <p>病菌以分生孢子盘在病残体上越冬，次年产生分生孢子进行初侵染。高温多雨、通风不良时发病严重。</p>
        
        <h3 style="color: #27ae60; margin-top: 20px; margin-bottom: 10px;">三、防治方法</h3>
        <ul>
          <li>清除病残体，减少菌源</li>
          <li>合理密植，保持通风透光</li>
          <li>发病初期喷施25%咪鲜胺乳油1000倍液</li>
          <li>或喷施10%苯醚甲环唑水分散粒剂1500倍液</li>
          <li>每隔7-10天喷一次，连续2-3次</li>
        </ul>
      </div>
    `
  },
  {
    id: 8,
    title: '姜螟防治',
    icon: '🐛',
    description: '姜螟虫的识别与防治',
    category: 'disease',
    subCategory: 'borer',
    views: 1324,
    rating: '4.7',
    publishTime: '2026-07-18',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #f39c12; margin-bottom: 20px;">🐛 姜螟防治</h2>
        
        <h3 style="color: #f39c12; margin-top: 20px; margin-bottom: 10px;">一、虫害症状</h3>
        <p>姜螟又称玉米螟，是生姜主要害虫之一。幼虫钻蛀茎秆，造成枯心或折断，排出粪便，影响生姜生长。</p>
        
        <h3 style="color: #f39c12; margin-top: 20px; margin-bottom: 10px;">二、防治方法</h3>
        <p><strong>物理防治：</strong></p>
        <ul>
          <li>灯光诱杀成虫（使用黑光灯或频振式杀虫灯）</li>
          <li>性诱剂诱杀</li>
        </ul>
        <p><strong>生物防治：</strong></p>
        <ul>
          <li>释放赤眼蜂等寄生性天敌</li>
          <li>使用Bt乳剂或苏云金杆菌可湿性粉剂</li>
        </ul>
        <p><strong>化学防治：</strong></p>
        <ul>
          <li>在低龄幼虫期喷施效果最佳</li>
          <li>使用50%辛硫磷乳油1000倍液</li>
          <li>或使用25%杀虫双水剂500倍液</li>
        </ul>
      </div>
    `
  },
  {
    id: 9,
    title: '收获时机与方法',
    icon: '✂️',
    description: '确定最佳收获时间和正确方法',
    category: 'harvest',
    subCategory: 'harvest-time',
    views: 967,
    rating: '4.6',
    publishTime: '2026-06-15',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">✂️ 收获时机与方法</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、收获时间</h3>
        <p>生姜的最佳收获时间因用途而异：</p>
        <ul>
          <li><strong>嫩姜：</strong>立秋至处暑之间收获，纤维少，辣味淡</li>
          <li><strong>老姜：</strong>霜降前后收获，纤维多，辣味浓，耐储存</li>
        </ul>
        <p>收获选择晴天，避免雨天收获导致姜块腐烂。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、收获方法</h3>
        <p>收获前3-5天停止浇水，便于土壤干燥。使用专用收获机械或人工挖掘，注意避免损伤姜块。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、采后处理</h3>
        <p>收获后及时清除泥土和杂质，保留2-3厘米的茎秆。将姜块放在通风处晾干表面水分，注意避免阳光直射。</p>
      </div>
    `
  },
  {
    id: 10,
    title: '储存方法',
    icon: '📦',
    description: '生姜的安全储存技术',
    category: 'harvest',
    subCategory: 'storage',
    views: 845,
    rating: '4.7',
    publishTime: '2026-06-10',
    content: `
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">📦 生姜储存方法</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、窖藏法</h3>
        <p>选择地势高燥、排水良好的地点挖窖。窖深2-3米，窖底铺一层湿沙。将姜块堆放窖中，保持温度10-15℃，湿度80-90%。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、堆放法</h3>
        <p>在室内通风处用湿沙或湿稻草覆盖姜块。堆高不超过1米，定期检查，发现腐烂姜块及时清除。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、储存注意事项</h3>
        <ul>
          <li>储存前确保姜块充分晾干</li>
          <li>避免温度低于10℃，防止受冻</li>
          <li>避免温度高于20℃，防止发芽</li>
          <li>定期检查，及时处理问题姜块</li>
        </ul>
      </div>
    `
  }
])

const currentArticle = ref(null)

const backToArticleList = () => {
  currentArticle.value = null
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    user.value = JSON.parse(userStr)
    loadMyProducts()
  } else {
    router.push('/')
  }
})

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/')
}

const handleFileChange = (file) => {
  if (file.raw) {
    activeSampleId.value = null
    previewImage.value = URL.createObjectURL(file.raw)
  }
}

const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    const raw = response.data.prediction
    detectResult.value = enrichResult(raw)
    uploadedImageUrl.value = response.data.imageUrl
    ElMessage.success('识别完成！')
  } else {
    ElMessage.error(response.message || '识别失败')
  }
}

// 根据后端返回的基础数据，自动补充品级/价格/SOP 等字段
const enrichResult = (raw) => {
  const disease = raw.disease || '未知'
  const isHealthy = disease === '健康' || disease === 'healthy'
  const confidence = raw.confidence || '0.90'

  if (isHealthy) {
    return {
      ...raw,
      gradeLabel: '特级',
      gradeType: 'success',
      purchasePrice: '8.5',
      gingerolRange: '2.8% - 3.2%',
      sopSteps: [
        '继续保持良好的田间管理，避免积水',
        '定期巡检，每周观察1次叶片状态',
        '采收后及时晾晒，储存于通风干燥处'
      ]
    }
  }

  const severity = raw.severity || '中度'
  const isSevere = severity === '重度'
  const gradeLabel = isSevere ? '等外' : (severity === '中度' ? '二级' : '一级')
  const gradeType = isSevere ? 'danger' : (severity === '中度' ? 'warning' : 'success')
  const purchasePrice = isSevere ? '3.2' : (severity === '中度' ? '5.5' : '6.8')
  const gingerolRange = isSevere ? '0.8% - 1.1%' : (severity === '中度' ? '1.5% - 1.8%' : '2.0% - 2.4%')

  const sopMap = {
    '姜瘟病': [
      '立即拔除病株并集中销毁，防止扩散',
      '对病穴及周围1米土壤撒施石灰消毒',
      '全田喷施72%农用硫酸链霉素4000倍液，每7天一次，连续3次',
      '收获后禁止留种，与非姜科作物轮作3年以上'
    ],
    '叶枯病': [
      '剪除发病叶片并带出田外集中处理',
      '喷施10%苯醚甲环唑1500倍液，每7-10天一次',
      '加强通风透光，合理疏密种植',
      '雨后及时排水，降低田间湿度'
    ]
  }

  return {
    ...raw,
    gradeLabel,
    gradeType,
    purchasePrice,
    gingerolRange,
    sopSteps: sopMap[disease] || [
      '及时清除病株，防止病害扩散',
      '喷施对应杀菌剂，每7-10天一次',
      '加强田间管理，注意通风排水',
      '收获后对土壤进行消毒处理'
    ]
  }
}

const handleRemove = () => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
  previewImage.value = ''
  activeSampleId.value = null
  uploadedImageUrl.value = ''
  detectResult.value = null
}

// 清除示例/上传，回到上传模式；并提示用户点击上传框
const resetToUpload = () => {
  handleRemove()
  ElMessage.info('已回到上传模式，请在左侧点击或拖拽上传图片')
}

const handleUploadError = () => {
  ElMessage.error('上传失败，请重试')
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt15M = file.size / 1024 / 1024 < 15

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
  }
  if (!isLt15M) {
    ElMessage.error('图片大小不能超过 15MB！')
  }
  return isImage && isLt15M
}

const articleDialogVisible = ref(false)

const showArticle = (article) => {
  currentArticle.value = article
  articleDialogVisible.value = true
  // 阅读量 +1（模拟）
  article.views = (parseInt(article.views) || 0) + 1
}

const productsLoading = ref(false)

const loadMyProducts = async () => {
  if (!user.value.id) return

  productsLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/v1/product/farmer/${user.value.id}`)
    const result = await res.json()
    if (result.code === 200 && Array.isArray(result.data)) {
      myProducts.value = result.data.map((p, idx) => ({
        ...p,
        traceabilityCode: TRACE_CODES[idx] || ''
      }))
    } else {
      myProducts.value = []
    }
  } catch (e) {
    ElMessage.error('加载货源失败，请稍后重试')
    myProducts.value = []
  } finally {
    productsLoading.value = false
  }
}

const refreshProducts = () => {
  loadMyProducts()
  ElMessage.success('刷新成功')
}

const closeDialog = () => {
  showAddDialog.value = false
  isEdit.value = false
  Object.assign(productForm, { 
    id: null, 
    origin: '', 
    weight: 0, 
    price: 0, 
    harvestDate: '', 
    grade: 'B',
    description: '',
    imageUrl: ''
  })
}

const saveProduct = async () => {
  // 表单验证
  if (!productForm.origin) {
    ElMessage.error('请输入产地')
    return
  }
  if (!productForm.weight || productForm.weight <= 0) {
    ElMessage.error('请输入有效重量')
    return
  }
  if (!productForm.price || productForm.price <= 0) {
    ElMessage.error('请输入有效价格')
    return
  }
  if (!productForm.harvestDate) {
    ElMessage.error('请选择采收日期')
    return
  }

  try {
    const url = `${API_BASE}/api/v1/product`
    const method = isEdit.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: productForm.id,
        farmerId: user.value.id,
        farmerName: user.value.realName || user.value.username,
        origin: productForm.origin,
        weight: productForm.weight,
        price: productForm.price,
        harvestDate: productForm.harvestDate,
        grade: productForm.grade,
        description: productForm.description,
        imageUrl: productForm.imageUrl
      })
    })
    
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success(isEdit.value ? '修改成功！' : '添加成功！')
      closeDialog()
      loadMyProducts()
    } else {
      ElMessage.error(result.message || (isEdit.value ? '修改失败' : '添加失败'))
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败，请重试' : '添加失败，请重试')
  }
}

const editProduct = (product) => {
  isEdit.value = true
  showAddDialog.value = true
  Object.assign(productForm, {
    id: product.id,
    origin: product.origin,
    weight: product.weight,
    price: product.price,
    harvestDate: product.harvestDate,
    grade: product.grade,
    description: product.description || '',
    imageUrl: product.imageUrl || ''
  })
}

const deleteProduct = (product) => {
  ElMessageBox.confirm(
    `确定要删除编号为 ${product.id} 的货源吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/product/${product.id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.code === 200) {
        ElMessage.success('删除成功！')
        loadMyProducts()
      } else {
        ElMessage.error(result.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const menuLoading = ref(false)

const handleMenuSelect = (key) => {
  if (activeMenu.value === key) return
  // 菜单切换：数据均为本地 Mock，直接切换，无需加载延迟
  activeMenu.value = key
  menuLoading.value = false
}

const getGradeType = (grade) => {
  const types = { 'A': 'success', 'B': 'primary', 'C': 'info' }
  return types[grade] || 'info'
}

const getGradeLabel = (grade) => {
  const labels = { 'A': 'A级（优质）', 'B': 'B级（良好）', 'C': 'C级（普通）' }
  return labels[grade] || grade
}

const handleImageUpload = (response) => {
  if (response.code === 200) {
    productForm.imageUrl = response.imageUrl
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '图片上传失败')
  }
}
</script>

<style scoped>
.farmer-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.user-info {
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
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

.upload-area {
  margin: 20px 0;
  width: 100%;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.upload-placeholder .el-icon--upload {
  font-size: 64px;
  margin-bottom: 20px;
}

/* AI检测布局 - 左右分栏 */
.ai-detect-layout {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}

.left-panel {
  flex-shrink: 0;
  width: 280px;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

/* 缩小的上传框 */
.upload-area-small {
  width: 280px;
}

.upload-area-small :deep(.el-upload-dragger) {
  width: 280px;
  height: 200px;
  padding: 0;
}

.upload-area-small .upload-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.upload-area-small .upload-placeholder .el-icon {
  font-size: 32px;
  color: #8c939d;
}

.upload-area-small .upload-placeholder .el-upload__text {
  font-size: 13px;
  margin-top: 8px;
}

.upload-area-small .upload-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.preview-image-small {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  border-radius: 4px;
}

/* 结果卡片样式 */
.result-card {
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7f0 0%, #e8f4e8 100%);
  border-radius: 12px;
  border: 1px solid #d4e4d4;
}

.result-card h3 {
  margin: 0 0 16px 0;
  color: #2d5a27;
  font-size: 18px;
}

.suggestion-box {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  border-left: 4px solid #2d5a27;
}

.suggestion-box h4 {
  margin: 0 0 8px 0;
  color: #2d5a27;
  font-size: 14px;
}

.suggestion-box p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

/* 空状态提示 */
.result-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
  color: #909399;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #c0c4cc;
}

.placeholder-icon.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .ai-detect-layout {
    flex-direction: column;
  }
  
  .left-panel,
  .upload-area-small {
    width: 100%;
  }
  
  .upload-area-small :deep(.el-upload-dragger) {
    width: 100%;
  }

  /* 手机端样品：3 栏略缩，头像缩小 */
  .samples-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .sample-thumb {
    padding: 10px 4px 8px;
    border-radius: 10px;
  }
  .thumb-img {
    width: 64px;
    height: 64px;
    padding: 2px;
  }
  .thumb-name {
    font-size: 12px;
  }
  .quick-samples {
    padding: 12px 10px;
  }
  .samples-title {
    font-size: 13px;
  }
  .samples-tip {
    font-size: 11px;
    padding: 2px 8px;
  }

  /* 手机端模式导航栏：单行可滑动 */
  .mode-switch-bar {
    padding: 4px;
    gap: 6px;
  }
  .mode-tab {
    padding: 6px 10px;
    font-size: 12px;
  }
  .mode-icon {
    font-size: 13px;
  }
}

.tech-card {
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.tech-card:hover {
  transform: translateY(-5px);
}

.tech-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.tech-card h3 {
  margin: 10px 0;
}

.cat-item {
  display: none;
}

/* 种植技术卡片网格布局 */
.tech-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.category-card {
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(45, 90, 39, 0.15);
  border-color: #2d5a27;
}

.category-icon {
  font-size: 48px;
  margin-bottom: 12px;
  display: block;
  transition: transform 0.3s;
}

.category-card:hover .category-icon {
  transform: scale(1.15);
}

.sub-icon {
  font-size: 42px;
}

.category-name {
  font-size: 16px;
  font-weight: bold;
  color: #2d5a27;
  margin-bottom: 8px;
}

.category-count {
  font-size: 12px;
  color: #999;
}

.sub-category-card {
  background: linear-gradient(145deg, #e8f5e9, #c8e6c9);
}

.sub-category-card:hover {
  background: linear-gradient(145deg, #c8e6c9, #a5d6a7);
}

/* 面包屑导航 */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.breadcrumb-title {
  font-size: 16px;
  font-weight: bold;
  color: #2d5a27;
}

/* 文章网格 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.article-list {
  margin-top: 20px;
}

.article-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.article-card:hover {
  border-color: #2d5a27;
  box-shadow: 0 2px 12px rgba(45, 90, 39, 0.1);
  transform: translateX(5px);
}

.article-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.article-info {
  flex: 1;
}

.article-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
}

.article-info p {
  margin: 0 0 8px 0;
  color: #909399;
  font-size: 13px;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #c0c4cc;
}

/* 文章详情样式 */
.article-detail {
  padding: 10px;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #2d5a27;
}

.article-header h2 {
  margin: 0;
  color: #2d5a27;
}

.article-body {
  line-height: 1.8;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.article-body :deep(h2) {
  color: #2d5a27;
  border-bottom: 2px solid #2d5a27;
  padding-bottom: 10px;
  margin-top: 25px;
  margin-bottom: 20px;
}

.article-body :deep(h3) {
  color: #4a7c59;
  padding-left: 10px;
  border-left: 4px solid #4a7c59;
  margin-top: 20px;
  margin-bottom: 10px;
}

.article-body :deep(ul) {
  padding-left: 20px;
}

.article-body :deep(li) {
  margin: 5px 0;
  line-height: 1.6;
}

.article-body :deep(p) {
  margin: 10px 0;
  text-indent: 2em;
}

.product-header {
  margin-bottom: 15px;
}

/* 统计卡片 */
.stats-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 资料详情对话框 */
.article-dialog :deep(.el-dialog__body) {
  padding: 16px 24px;
}

.dialog-article {
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.dialog-content {
  line-height: 1.8;
  color: #303133;
}

.dialog-content :deep(h2) {
  color: #2d5a27;
  margin: 0 0 12px 0;
}

.dialog-content :deep(h3) {
  color: #4a7c59;
  margin: 16px 0 8px;
}

.dialog-content :deep(p) {
  margin: 8px 0;
  color: #606266;
}

/* 快速体验样品 */
.quick-samples {
  margin: 14px 0 18px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 100%);
  border-radius: 12px;
  border: 1px dashed #409EFF;
}

.samples-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 6px;
}

.samples-title {
  font-size: 15px;
  font-weight: 700;
  color: #2d5a27;
  display: flex;
  align-items: center;
  gap: 6px;
}
.samples-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #228B22 0%, #4a9c4a 100%);
  border-radius: 2px;
}

.samples-tip {
  font-size: 12px;
  color: #909399;
  background: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

.samples-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.sample-thumb {
  cursor: pointer;
  text-align: center;
  padding: 14px 8px 12px;
  background: #fff;
  border-radius: 14px;
  border: 2px solid transparent;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.sample-thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.05) 0%, rgba(64, 158, 255, 0.05) 100%);
  pointer-events: none;
}

.sample-thumb:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.22);
  border-color: #409EFF;
}
.sample-thumb:hover::after {
  opacity: 1;
}

.sample-thumb.active {
  border-color: #228B22;
  background: linear-gradient(180deg, #f0f7f0 0%, #ffffff 100%);
  box-shadow: 0 6px 18px rgba(34, 139, 34, 0.25);
}

.thumb-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin: 0 auto 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #DAA520 0%, #228B22 100%);
  padding: 3px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}
.thumb-img > .thumb-photo {
  border-radius: 50%;
}

.thumb-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.sample-thumb.active .thumb-name {
  color: #228B22;
}

.active-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  background: #228B22;
  color: #fff;
  line-height: 1.4;
}

/* 激活卡片的头像光环 */
.sample-thumb.active .thumb-img {
  box-shadow: 0 0 0 3px rgba(34, 139, 34, 0.18), 0 3px 10px rgba(0, 0, 0, 0.12);
  transform: scale(1.03);
  transition: transform 0.3s;
}

/* AI 识别中的骨架屏样式 */
.detecting-skeleton {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 100%);
  border-radius: 8px;
  border: 1px dashed #409EFF;
  margin: 14px 0;
}

.skeleton-title {
  margin-bottom: 12px;
}

/* 识别中提示条 (已弃用骨架屏替代) */

/* 样品预览框 */
.sample-preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
}

.sample-preview-photo {
  width: 90%;
  height: 75%;
  object-fit: contain;
  border-radius: 6px;
  margin-bottom: 6px;
}

.sample-preview-label {
  font-size: 12px;
  font-weight: 600;
  color: #2d5a27;
  background: #f0f7f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.back-upload-btn {
  margin-top: 10px;
  padding: 6px 16px;
  font-size: 12px;
  color: #fff;
  background: #67C23A;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}
.back-upload-btn:hover {
  background: #5dae33;
  transform: translateY(-1px);
}

/* 模式切换导航栏 */
.mode-switch-bar {
  display: flex;
  gap: 8px;
  margin: 0 0 16px;
  padding: 6px;
  background: #f5f7fa;
  border-radius: 12px;
  overflow-x: auto;
  flex-wrap: nowrap;
}
.mode-switch-bar::-webkit-scrollbar {
  display: none;
}
.mode-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;
}
.mode-tab:hover {
  color: #228B22;
  border-color: #d2e8d2;
}
.mode-tab.active {
  background: linear-gradient(135deg, #228B22 0%, #4a9c4a 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(34, 139, 34, 0.25);
  font-weight: 600;
}
.mode-icon {
  font-size: 15px;
}

/* AI分选分析卡片 */
.analysis-card {
  margin-top: 20px;
  border: 2px solid #2d5a27;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(45, 90, 39, 0.1);
  overflow: hidden;
}

/* 价格高亮 */
.price-highlight {
  color: #F56C6C;
  font-weight: 700;
  font-size: 16px;
}

.gingerol-highlight {
  color: #2d5a27;
  font-weight: 600;
}

/* SOP 列表 */
.sop-list {
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: sop;
}

.sop-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.sop-list li:last-child {
  border-bottom: none;
}

.sop-index {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%);
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sop-text {
  flex: 1;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

/* 图片预览遮罩 */
.upload-preview {
  position: relative;
  cursor: zoom-in;
}

.upload-preview .preview-image-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-preview .preview-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 4px;
}

.upload-preview:hover .preview-mask {
  opacity: 1;
}

.upload-preview .preview-mask .el-icon {
  font-size: 24px;
}

/* 溯源码列样式 */
.trace-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
}
</style>