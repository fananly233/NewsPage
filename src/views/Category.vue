<template>
  <el-container>
    <el-aside width="200px">
      <CategoryList :categories="categories" :activeId="Number(categoryId)" />
    </el-aside>
    <el-main>
      <h2>分类：{{ categoryName }}</h2>
      <NewsList :newsList="newsList" @select="goToDetail" />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryList from '../components/CategoryList.vue'
import NewsList from '../components/NewsList.vue'
import axios from '../utils/axios'

const categories = ref([])
const newsList = ref([])
const route = useRoute()
const router = useRouter()

const categoryId = ref(route.query.categoryId || '')
const categoryName = ref('')

watch(() => route.query.categoryId, (val) => {
  categoryId.value = val
  fetchNews()
})

onMounted(async () => {
  const res = await axios.get('/categories')
  categories.value = res.data
  updateCategoryName()
  fetchNews()
})

function updateCategoryName() {
  const cat = categories.value.find(c => c.id == categoryId.value)
  categoryName.value = cat ? cat.name : '未知分类'
}

async function fetchNews() {
  const res = await axios.get('/news', {
    params: { categoryId: categoryId.value }
  })
  newsList.value = res.data.list
  updateCategoryName()
}

function goToDetail(id) {
  router.push({ name: 'News', params: { id } })
}
</script>
