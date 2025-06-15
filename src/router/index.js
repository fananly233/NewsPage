import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/userStore";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/category/:categoryId',
    name: 'Category',
    component: () => import('../views/Category.vue')
  },
  {
    path: '/news/:id',
    name: 'News',
    component: () => import('../views/News.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Admin.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：判断是否登录
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 恢复用户登录状态（页面刷新时）
  if (!userStore.isLoggedIn) {
    userStore.restoreUser()
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdminRole && userStore.role === 'visitor') {
    // 游客没有权限访问管理后台，跳转到首页
    next('/')
    return
  }

  next()
})

export default router