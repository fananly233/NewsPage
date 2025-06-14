import { defineStore } from 'pinia'
import axios from '../utils/axios'

export const useNewsStore = defineStore('news', {
  state: () => ({
    categories: [],
    newsList: [],
    newsDetail: null
  }),
  actions: {
    async loadCategories() {
      try {
        const res = await axios.get('/categories')
        this.categories = res.data // ✅ 修复：提取data字段
      } catch (err) {
        console.error('加载栏目失败', err)
      }
    },
    async loadNewsByCategory(categoryId) {
      try {
        const res = await axios.get('/news', {
          params: { categoryId }
        })
        this.newsList = res.data?.list || [] // ✅ 修复：提取分页列表
      } catch (err) {
        console.error('加载新闻列表失败', err)
      }
    },
    async loadNewsDetail(newsId) {
      try {
        const res = await axios.get(`/news/${newsId}`)
        this.newsDetail = res.data // ✅ 修复：提取详情对象
      } catch (err) {
        console.error('加载新闻详情失败', err)
      }
    }
  }
})
