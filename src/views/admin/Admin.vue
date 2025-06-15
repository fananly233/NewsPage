<template>
  <el-container style="height: 100vh">
    <!-- 顶部导航 -->
    <el-header style="background: #545c64; padding: 0">
      <div style="display: flex; justify-content: space-between; align-items: center; height: 100%; padding: 0 20px">
        <h2 style="color: white; margin: 0">新闻管理平台</h2>
        <div style="display: flex; align-items: center; gap: 20px">
          <span style="color: white">
            欢迎，{{ userStore.phone }} ({{ getRoleName(userStore.role) }})
          </span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" style="background: #f5f5f5">
        <el-menu default-active="dashboard" @select="handleMenuSelect">
          <el-menu-item index="dashboard">
            <el-icon><House /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          <el-menu-item index="news-manage" v-if="userStore.role !== 'visitor'">
            <el-icon><Document /></el-icon>
            <span>新闻管理</span>
          </el-menu-item>
          <el-menu-item index="category-manage" v-if="userStore.role === 'admin'">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main>
        <div v-if="currentView === 'dashboard'">
          <el-card>
            <h3>用户信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="手机号">{{ userStore.phone }}</el-descriptions-item>
              <el-descriptions-item label="角色">{{ getRoleName(userStore.role) }}</el-descriptions-item>
              <el-descriptions-item label="登录状态">
                <el-tag type="success">已登录</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="登录时间">{{ loginTime }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8">
              <el-card>
                <div style="text-align: center">
                  <h2 style="color: #409EFF">{{ newsCount }}</h2>
                  <p>新闻总数</p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div style="text-align: center">
                  <h2 style="color: #67C23A">{{ categoryCount }}</h2>
                  <p>分类总数</p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div style="text-align: center">
                  <h2 style="color: #E6A23C">{{ todayNews }}</h2>
                  <p>今日新增</p>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 权限提示 -->
          <el-card style="margin-top: 20px">
            <h3>权限说明</h3>
            <el-alert
              :title="getPermissionDescription()"
              :type="userStore.role === 'visitor' ? 'error' : 'info'"
              :closable="false"
            />
            <!-- 游客特殊提示 -->
            <div v-if="userStore.role === 'visitor'" style="margin-top: 15px">
              <el-alert
                title="您当前是游客身份，没有管理权限。如需管理权限，请联系管理员。"
                type="warning"
                :closable="false"
              />
              <div style="margin-top: 15px; text-align: center">
                <el-button type="primary" @click="goToHome">返回首页</el-button>
              </div>
            </div>
          </el-card>
        </div>

        <div v-else-if="currentView === 'news-manage'">
          <h3>新闻管理</h3>
          <el-alert
            title="新闻管理功能开发中..."
            type="warning"
            :closable="false"
            style="margin-bottom: 20px"
          />
          <p>根据角色权限：</p>
          <ul>
            <li v-if="userStore.role === 'admin'">管理员：可以管理所有新闻</li>
            <li v-if="userStore.role === 'editor'">编辑：可以审核和编辑新闻</li>
            <li v-if="userStore.role === 'reporter'">记者：可以创建和编辑自己的新闻</li>
          </ul>
        </div>

        <div v-else-if="currentView === 'category-manage'">
          <h3>分类管理</h3>
          <el-alert
            title="分类管理功能开发中... (仅管理员可见)"
            type="warning"
            :closable="false"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/userStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { House, Document, Folder } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const currentView = ref('dashboard')
const loginTime = ref('')
const newsCount = ref(0)
const categoryCount = ref(0)
const todayNews = ref(0)

onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  // 检查游客权限（额外保护）
  if (userStore.role === 'visitor') {
    ElMessage.warning('游客无权限访问管理后台，已自动跳转到首页')
    router.push('/')
    return
  }

  // 设置登录时间
  loginTime.value = new Date().toLocaleString()
  
  // 模拟获取统计数据
  loadStatistics()
})

function getRoleName(role) {
  const roleMap = {
    'reporter': '记者',
    'editor': '编辑',
    'admin': '管理员',
    'visitor': '访客'
  }
  return roleMap[role] || '未知角色'
}

function getPermissionDescription() {
  const permissionMap = {
    'admin': '管理员权限：可以管理所有内容，包括新闻管理和分类管理',
    'editor': '编辑权限：可以进行新闻管理，审核和编辑新闻内容',
    'reporter': '记者权限：可以创建和编辑自己的新闻',
    'visitor': '访客权限：无管理权限，建议返回首页浏览新闻内容'
  }
  return permissionMap[userStore.role] || '未知权限'
}

async function loadStatistics() {
  // 模拟数据，实际项目中应从API获取
  newsCount.value = 128
  categoryCount.value = 8
  todayNews.value = 12
}

function handleMenuSelect(key) {
  currentView.value = key
}

function goToHome() {
  router.push('/')
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
    router.push('/login')
  } catch {
    // 用户取消退出
  }
}
</script>

<style scoped>
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
}
</style>