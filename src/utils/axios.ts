import axios from 'axios'
import { useRouter } from 'vue-router'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token 过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      // 使用 router 而不是 window.location
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 初始化时恢复 token
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api 