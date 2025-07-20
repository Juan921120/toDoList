import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/Register.vue')
  },
  {
    path: '/todo',
    name: 'TodoList',
    component: () => import('@/components/TodoList.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('路由守卫触发：', { to: to.path, from: from.path })
  const token = localStorage.getItem('token')
  console.log('当前 token：', token ? '存在' : '不存在')
  
  // 如果访问登录或注册页面，直接放行
  if (to.path === '/login' || to.path === '/register') {
    console.log('访问登录/注册页面，直接放行')
    next()
    return
  }
  
  // 如果没有 token，跳转到登录页
  if (!token) {
    console.log('没有 token，跳转到登录页')
    next('/login')
    return
  }
  
  // 有 token，允许访问
  console.log('有 token，允许访问')
  next()
})

export default router 