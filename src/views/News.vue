<template>
  <NewsDetail :news="news" v-if="news" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../utils/axios'
import NewsDetail from '../components/NewsDetail.vue'

const route = useRoute()
const news = ref(null)

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`/news/${id}`)
  news.value = res.data
})
</script>
