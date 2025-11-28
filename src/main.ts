import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { vLoading } from 'element-plus'

import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'
import SongTable from './components/SongTable.vue'
import Comment from './components/Comment.vue'

import './permission'
import '@/styles/index.scss'
import 'virtual:svg-icons-register'
import 'nprogress/nprogress.css'

async function bootstrap() {
  const app = createApp(App)
  app.component('SvgIcon', SvgIcon)
  app.component('SongTable', SongTable)
  app.component('Comment', Comment)
  app.directive('loading', vLoading)
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

bootstrap()
