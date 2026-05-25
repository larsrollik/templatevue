import { createApp } from 'vue'
import App from './App.vue'
import { loadConfig } from './config'

loadConfig().then(() => {
  createApp(App).mount('#app')
})
