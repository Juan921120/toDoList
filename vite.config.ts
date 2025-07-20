import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
   base: './', // 关键一行！
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173, // 或你用的其他端口
    proxy: {
      // 仅把 /api 开头的请求代理给后端
      '^/api/.*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 可选：去掉 /api 前缀
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  },

})

