import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    phone: '',
    role: '', // 'reporter', 'editor', 'admin', 'visitor'
    isLoggedIn: false
  }),
  actions: {
    login(userInfo) {
      this.phone = userInfo.phone
      this.role = userInfo.role
      this.isLoggedIn = true
      // 保存到本地存储
      localStorage.setItem('userInfo', JSON.stringify({
        phone: userInfo.phone,
        role: userInfo.role,
        isLoggedIn: true
      }))
    },
    logout() {
      this.phone = ''
      this.role = ''
      this.isLoggedIn = false
      // 清空本地存储
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rememberedPhone')
    },
    // 从本地存储恢复用户信息
    restoreUser() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const user = JSON.parse(userInfo)
        this.phone = user.phone
        this.role = user.role
        this.isLoggedIn = user.isLoggedIn
      }
    }
  }
})