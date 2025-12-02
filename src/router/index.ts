import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: 'recommend',
        name: 'Recommend',
        component: () => import('@/views/Recommend/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: 'searchMultiMatch',
        name: 'SearchMultiMatch',
        component: () => import('@/views/SearchMultiMatch/index.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: 'account/:id',
        name: 'Account',
        component: () => import('@/views/Account/index.vue'),
      },
      {
        path: 'playlistDetail/:id',
        name: 'PlaylistDetail',
        component: () => import('@/views/PlaylistDetail/index.vue'),
      },
      {
        path: 'albumDetail/:id',
        name: 'albumDetail',
        component: () => import('@/views/AlbumDetail/index.vue'),
      },
      {
        path: 'musicComment/:id',
        name: 'MusicComment',
        component: () => import('@/views/MusicComment/index.vue'),
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/404.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/404',
  },
]

const router = createRouter({
  // 使用 Vite 的 base 配置
  history: createWebHashHistory(),
  routes: staticRoutes,
})

export default router

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
