<template>
  <div v-if="news">
    <h2>{{ news.title }}</h2>
    <p>作者：{{ news.author }} | 发布时间：{{ news.createdAt.slice(0, 10) }}</p>
    <img :src="news.imageUrl" style="max-width: 100%" />
    <div v-html="news.content"></div>

    <div v-if="news.attachments.length > 0">
      <h4>附件下载：</h4>
      <ul>
        <li v-for="file in news.attachments" :key="file.name">
          <a :href="file.url" target="_blank">{{ file.name }} ({{ file.size }})</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  news: Object
})
</script>
