<template>
  <div class="skeleton-wrapper">
    <div 
      v-for="i in count" 
      :key="i" 
      class="skeleton-item"
      :style="{ height: height + 'px' }"
    >
      <div class="skeleton-line" :style="{ width: lineWidth + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  },
  height: {
    type: Number,
    default: 40
  },
  lineWidth: {
    type: Number,
    default: 80
  }
})
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}

.skeleton-item {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400% 100%;
  border-radius: 4px;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
