<template>
  <div>
    <el-button @click="goBack" style="margin-bottom: 20px">
      <el-icon><ArrowLeft /></el-icon>
      返回分类列表
    </el-button>
    
    <h2>{{ categoryName }}</h2>
    
    <div v-if="loading">加载中...</div>
    <NewsList 
      v-else-if="newsStore.newsList.length > 0" 
      :newsList="newsStore.newsList" 
      @select="goToDetail" 
    />
    <div v-else style="text-align: center; color: #999; margin-top: 50px">
      该分类下暂无新闻
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useNewsStore } from '../store/news'
import NewsList from '../components/NewsList.vue'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const loading = ref(true)

const categoryId = computed(() => route.params.categoryId)
const categoryName = computed(() => {
  const cat = newsStore.categories.find(c => c.id == categoryId.value)
  return cat ? cat.name : '未知分类'
})

onMounted(async () => {
  try {
    // 如果分类数据还没加载，先加载分类
    if (newsStore.categories.length === 0) {
      await newsStore.loadCategories()
    }
    
    // 加载该分类下的新闻
    await newsStore.loadNewsByCategory(categoryId.value)
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push({ name: 'Home' })
}

function goToDetail(newsId) {
  router.push({ name: 'News', params: { id: newsId } })
}
</script>