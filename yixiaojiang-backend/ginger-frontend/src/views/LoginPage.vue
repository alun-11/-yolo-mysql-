<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 标题 -->
      <h1 class="title">🌾 壹小姜管理系统</h1>
      <p class="subtitle">罗平小黄姜价格监测与溯源平台</p>

      <!-- 身份选择 -->
      <div class="role-tabs">
        <div
          class="role-tab"
          :class="{ active: role === 'farmer' }"
          @click="switchRole('farmer')"
        >
          👨‍ 农民
        </div>
        <div
          class="role-tab"
          :class="{ active: role === 'merchant' }"
          @click="switchRole('merchant')"
        >
          🏪 商户
        </div>
        <div
          class="role-tab"
          :class="{ active: role === 'admin' }"
          @click="switchRole('admin')"
        >
          👨‍💼 管理员
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form :model="loginForm" class="login-form">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          prefix-icon="User"
          size="large"
        />

        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          size="large"
          show-password
        />

        <el-button
          type="primary"
          size="large"
          style="width: 100%; margin-top: 20px"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const role = ref('farmer') // 默认农户
const API_BASE = ''

const loginForm = reactive({
  username: '',
  password: ''
})

// 切换身份（清空表单）
const switchRole = (newRole) => {
  role.value = newRole
  loginForm.username = ''
  loginForm.password = ''
}

// 登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  try {
    const response = await fetch(`${API_BASE}/api/v1/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password
      })
    })

    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      const user = result.data
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(user))
      ElMessage.success('登录成功！')
      
      // 根据用户角色跳转到对应页面
      if (user.role === 'farmer') {
        router.push('/farmer')
      } else if (user.role === 'merchant') {
        router.push('/merchant')
      } else if (user.role === 'admin') {
        router.push('/admin')
      }
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络连接')
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
/* 品牌视觉升级 */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 品牌渐变背景：深青绿到浅绿，清新自然有科技感 */
  background: linear-gradient(135deg, #134E5E 0%, #71B280 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 10%, transparent 50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  color: #2d5a27;
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 30px 0;
  font-size: 14px;
}

/* 身份切换标签 */
.role-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.role-tab {
  flex: 1;
  padding: 14px 12px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  color: #666;
  border: 2px solid transparent;
}

.role-tab:hover {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 90, 39, 0.15);
}

.role-tab.active {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(45, 90, 39, 0.4);
  transform: translateY(-2px);
  border-color: #D4A574;
}

.login-form {
  margin-bottom: 25px;
}

/* 登录按钮品牌样式 */
.login-form :deep(.el-button--primary) {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%) !important;
  border: none !important;
  font-weight: 600;
  font-size: 16px;
  padding: 14px;
  border-radius: 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(45, 90, 39, 0.3);
}

.login-form :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #1a4a1a 0%, #3a6c49 100%) !important;
  box-shadow: 0 6px 20px rgba(45, 90, 39, 0.4);
  transform: translateY(-2px);
}

.login-form :deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 输入框样式 */
.login-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 8px rgba(45, 90, 39, 0.15);
}
</style>