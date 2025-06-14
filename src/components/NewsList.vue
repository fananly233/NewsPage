<template>
  <el-row :gutter="20">
    <el-col
      v-for="news in newsList"
      :key="news.id"
      :span="12"
      @click="select(news.id)"
      style="cursor: pointer"
    >
      <el-card :body-style="{ padding: '10px' }">
        <img :src="news.imageUrl" style="width: 100%; height: 200px; object-fit: cover" />
        <h3>{{ news.title }}</h3>
        <p>{{ news.summary }}</p>
        <small>{{ news.createdAt.slice(0, 10) }}</small>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
const props = defineProps({
  newsList: Array
})

const emit = defineEmits(['select'])

function select(id) {
  emit('select', id)
}
</script>
