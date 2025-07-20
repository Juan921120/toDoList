<template>
   <div class="user-container">
        <div class="user-info-bar">
            <img class="user-avatar" src="/images/default-user.png" alt="用户头像" />
            <span class="user-name">login</span>
        </div>
    </div>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">注册</h2>
      <form @submit.prevent="handleRegister" class="register-form">
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
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="请再次输入密码"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  // 表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = '请填写完整的注册信息'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (password.value.length < 6) {
    error.value = '密码长度至少6位'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post('/api/auth/register', {
      username: username.value,
      password: password.value
    })

    if (response.data.success) {
      success.value = '注册成功！正在跳转到登录页面...'
      
      // 如果注册后直接返回了token，可以选择自动登录
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token)
        if (response.data.data?.username) {
          localStorage.setItem('username', response.data.data.username)
        }
        // 注册成功后直接跳转到待办页面
        setTimeout(() => {
          router.push('/todo')
        }, 2000)
      } else {
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } else {
      error.value = response.data.message || '注册失败'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '注册失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>


.register-card {
  box-sizing: border-box;
  padding: 40px;
  background: #fff8f0;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: calc(100% - 40px);
  margin: 10px auto 0;
  border: 3px solid #ffccaa;
}

.register-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.register-form {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background-color: #ff7a5a;
}

.register-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #ff9980;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
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

.success-message {
  background-color: #e8f5e8;
  color: #2e7d32;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
  border: 1px solid #c8e6c9;
}


</style> 