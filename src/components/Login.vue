<template>
  <div class="user-container">
        <div class="user-info-bar">
            <img class="user-avatar" src="/images/default-user.png" alt="用户头像" />
            <span class="user-name">login</span>
        </div>
    </div>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">登录</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="请输入用户名"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请填写完整的登录信息'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    if (response.data.success) {
      console.log('登录成功，响应数据：', response.data)
      
      // 保存 token 和用户信息
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token)
        console.log('Token 已保存')
      }
      if (response.data.data?.username) {
        localStorage.setItem('username', response.data.data.username)
        console.log('用户名已保存')
      }
      
      // token 已经通过拦截器自动设置
      
      // 登录成功，跳转到待办列表页面
      console.log('准备跳转到 /todo')
      await router.push('/todo')
      console.log('跳转完成')
    } else {
      error.value = response.data.message || '登录失败'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '登录失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  margin-top: 10px;
  min-height: 100vh;
  background-image:
    url('/images/cat-paw.png'),
    url('/images/cat-paw.png');
  background-size: 80px 80px, 80px 80px;
  background-position: 0 0, 40px 40px;
  background-repeat: repeat, repeat;
  background-color: #FFEEE2;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif;
}

.login-card {
  background: #fff8f0;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: calc(100% - 40px);
  margin: 20px auto 0;
  max-width: 400px;
  border: 3px solid #ffccaa;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #555;
  font-weight: bold;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #FEDEB8;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background-color: white;
}

.form-input:focus {
  border-color: #ff9980;
}

.login-btn {
  background-color: #ff9980;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background-color: #ff7a5a;
}

.login-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #ff9980;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #ffedeb;
  color: #d32f2f;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
  border: 1px solid #ffcdd2;
}

@media (max-width: 480px) {
  .login-card {
   margin: 0 auto;
   width: calc(100% - 120px);
  }
  
  .login-title {
    font-size: 20px;
  }
}
</style> 