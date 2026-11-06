import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'

import App from './App.vue'
import router from './router'
import '@fontsource/anton'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/600.css'
import '@fontsource/archivo/800.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import '@fontsource/permanent-marker'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

if (typeof window !== 'undefined' && import.meta.env.PROD) {
  inject({ framework: 'vue' })
}
