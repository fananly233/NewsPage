<template>
  <el-row :gutter="20">
    <el-col 
      v-for="category in categories"
      :key="category.id"
      :span="8"
      style="margin-bottom: 20px"
    >
      <el-card 
        :body-style="{ padding: '20px', textAlign: 'center' }"
        @click="handleSelect(category.id)"
        style="cursor: pointer; height: 120px; display: flex; align-items: center; justify-content: center"
        shadow="hover"
      >
        <h3>{{ category.name }}</h3>
        <p style="color: #999; margin-top: 10px">{{ category.description || '查看该分类下的新闻' }}</p>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  categories: Array
})

const router = useRouter()

function handleSelect(categoryId) {
  router.push({ name: 'Category', params: { categoryId } })
}
</script>
