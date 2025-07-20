import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
   base: './', // 关键一行！
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173 // 或你用的其他端口
    ,
    proxy: {
      '/task': {
        target: 'http://localhost:8080', // 你的 Spring Boot 后端地址
        changeOrigin: true
      }
    }
  }
})
