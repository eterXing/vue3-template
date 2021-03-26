/*
 * @Date: 2021-03-19 17:32:47
 * @LastEditTime: 2021-03-24 15:45:05
 * @Description: 入口
 */
import { createApp } from 'vue'
import App from '@/App.vue'
const app = createApp(App)

// 引入elementui
import ElementPlus from 'element-plus'
import '@/assets/css/element-variables.scss'
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

// 引入router
import router from '@/router/index'
app.use(router)

// 引入vuex
import store from "@/store"
app.use(store)

// 样式重置
import '@/assets/css/reset.scss'

import http from '@/request/http'
app.use(http)

app.mount('#app')
