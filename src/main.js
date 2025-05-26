import { createApp } from 'vue'
import App from './App.vue'
import element from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(element)
app.mount('#app')
