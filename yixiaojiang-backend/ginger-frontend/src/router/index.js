import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/farmer',
    name: 'Farmer',
    component: () => import('../views/FarmerPage.vue'),
    meta: { requiresAuth: true, role: 'farmer' }
  },
  {
    path: '/merchant',
    name: 'Merchant',
    component: () => import('../views/MerchantPage.vue'),
    meta: { requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminPage.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import('../views/PricePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    // 公开溯源页：手机扫二维码直达，无需登录
    path: '/trace',
    name: 'Trace',
    component: () => import('../views/Traceability.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.requiresAuth && !user) {
    next('/')
  } else if (to.meta.role && user && user.role !== to.meta.role) {
    // 如果用户角色与页面角色不匹配，跳转到对应角色的页面
    next('/' + user.role)
  } else if (to.path === '/' && user) {
    next('/' + user.role)
  } else {
    next()
  }
})

export default router