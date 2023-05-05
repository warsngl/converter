import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'

import store from './store'
import App from './App.vue'
import './assets/index.css'
import Home from './pages/Home.vue'

const routes=[
  {path:'/', component: Home},
]
const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

createApp(App).use(router).use(store).mount('#app')
