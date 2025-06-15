<template>
  <div>
    <div class="header">
      <h1>新闻分类</h1>
      <div class="header-actions">
        <!-- 如果用户已登录 -->
        <div v-if="userStore.isLoggedIn" class="user-info">
          <span class="welcome-text">欢迎，{{ userStore.phone }}</span>
          <!-- 只有非游客用户才能进入管理后台 -->
          <el-button 
            v-if="userStore.role !== 'visitor'" 
            type="primary" 
            @click="goToAdmin"
          >
            管理后台
          </el-button>
          <el-button type="info" @click="handleLogout">退出登录</el-button>
        </div>
        <!-- 如果用户未登录 -->
        <div v-else>
          <el-button type="primary" @click="goToLogin">登录</el-button>
        </div>
      </div>
    </div>
    <CategoryList :categories="newsStore.categories" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '../store/news'
import { useUserStore } from '../store/userStore'
import CategoryList from '../components/CategoryList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const newsStore = useNewsStore()
const userStore = useUserStore()

onMounted(async () => {
  // 恢复用户登录状态
  if (!userStore.isLoggedIn) {
    userStore.restoreUser()
  }
  
  await newsStore.loadCategories()
})

function goToLogin() {
  router.push('/login')
}

function goToAdmin() {
  // 检查用户权限
  if (userStore.role === 'visitor') {
    ElMessage.warning('您没有权限访问管理后台')
    return
  }
  router.push('/admin')
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    userStore.logout()
    ElMessage.success('退出登录成功')
    // 退出后刷新页面状态
    window.location.reload()
  } catch {
    // 用户取消退出
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: #606266;
  font-size: 14px;
}
</style>