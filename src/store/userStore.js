import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    phone: '',
    role: '', // 'reporter' or 'editor'
    isLoggedIn: false
  }),
  actions: {
    login(userInfo) {
      this.phone = userInfo.phone
      this.role = userInfo.role
      this.isLoggedIn = true
    },
    logout() {
      this.phone = ''
      this.role = ''
      this.isLoggedIn = false
    }
  },
  persist: {
    paths: ['phone']
  }
})