import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      '.cpolar.top',   // 允许所有 cpolar 子域名
            '.cpolar.cn',
            '.ngrok-free.app', // 允许所有 ngrok 免费版子域名
            '.ngrok-free.dev', // ngrok 新版免费域名
            '.ngrok.io',
            'localhost',
            '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    }
  }
})