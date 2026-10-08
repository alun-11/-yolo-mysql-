<template>
  <AppLoading v-if="isLoading" />
  <div v-else class="app-wrapper">
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <SiteFooter v-if="showFooter" class="app-footer" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLoading from './components/AppLoading.vue'
import SiteFooter from './components/SiteFooter.vue'

const isLoading = ref(true)
const router = useRouter()
const route = useRoute()

// 只在非登录页面显示页脚
const showFooter = computed(() => {
  return route.path !== '/' && route.path !== '/login'
})

onMounted(() => {
  // 首次加载动画（演示场景保留短暂仪式感，不超过 1s）
  setTimeout(() => {
    isLoading.value = false
  }, 800)

  // 路由变化时的过渡效果
  router.beforeEach((to, from, next) => {
    next()
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 0 auto;
  width: 100%;
}

.app-footer {
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
