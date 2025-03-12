import './assets/main.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(Antd)
app.use(pinia)
app.use(router)
router.beforeEach((to, from, next) => {
  const mainTitle = 'RDZ-TH Dashboard'
  document.title = `${to.meta.breadcrumb || to.name} - ${mainTitle}`
  next()
})
app.mount('#app')
