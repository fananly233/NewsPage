<template>
  <div>
    <el-button @click="goBack" style="margin-bottom: 20px">
      <el-icon><ArrowLeft /></el-icon>
      返回新闻列表
    </el-button>
    
    <NewsDetail :news="newsStore.newsDetail" v-if="newsStore.newsDetail" />
    <div v-else-if="loading" style="text-align: center; margin-top: 50px">
      加载中...
    </div>
    <div v-else style="text-align: center; color: #999; margin-top: 50px">
      新闻不存在
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useNewsStore } from '../store/news'
import NewsDetail from '../components/NewsDetail.vue'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const loading = ref(true)

onMounted(async () => {
  try {
    const newsId = route.params.id
    await newsStore.loadNewsDetail(newsId)
  } catch (error) {
    console.error('获取新闻详情失败:', error)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}
</script>