<template>
  <el-menu @select="handleSelect" :default-active="activeId?.toString()">
    <el-menu-item
      v-for="category in categories"
      :key="category.id"
      :index="category.id.toString()"
    >
      {{ category.name }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  categories: Array,
  activeId: Number
})

const router = useRouter()

function handleSelect(id) {
  router.push({ name: 'Category', query: { categoryId: id } })
}
</script>
