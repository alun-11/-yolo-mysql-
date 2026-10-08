<template>
  <div class="app-loading">
    <div class="loading-content">
      <div class="logo-animation">
        <span class="logo-icon">🌾</span>
      </div>
      <h2 class="loading-title">壹小姜 · 数智助农</h2>
      <p class="loading-subtitle">罗平小黄姜价格监测与溯源平台</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loadingText = ref('正在加载...')

const loadingMessages = [
  '正在加载...',
  '连接服务器...',
  '加载数据中...',
  '即将完成...'
]

onMounted(() => {
  let index = 0
  const timer = setInterval(() => {
    index = (index + 1) % loadingMessages.length
    loadingText.value = loadingMessages[index]
  }, 400)

  // 0 延迟：父组件控制消失时机，此处只负责清理循环
  setTimeout(() => {
    clearInterval(timer)
  }, 0)
})
</script>

<style scoped>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #8fbc8f 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.logo-animation {
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

.logo-icon {
  font-size: 80px;
  display: inline-block;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.loading-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.loading-subtitle {
  font-size: 16px;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: dot-pulse 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-text {
  font-size: 14px;
  opacity: 0.8;
  animation: text-fade 1.5s infinite;
}

@keyframes text-fade {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
