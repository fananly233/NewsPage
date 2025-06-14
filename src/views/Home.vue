<template>
  <el-container>
    <el-aside width="200px">
      <CategoryList :categories="categories" />
    </el-aside>
    <el-main>
      <NewsList :newsList="newsList" @select="goToDetail" />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CategoryList from '../components/CategoryList.vue'
import NewsList from '../components/NewsList.vue'
import axios from '../utils/axios'

const categories = ref([])
const newsList = ref([])
const router = useRouter()

onMounted(async () => {
  const res1 = await axios.get('/categories')
  categories.value = res1.data

  const res2 = await axios.get('/news')
  newsList.value = res2.data.list
})

function goToDetail(id) {
  router.push({ name: 'News', params: { id } })
}
</script>
