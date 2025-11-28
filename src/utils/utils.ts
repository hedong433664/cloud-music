import { staticRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName || 'audio.mp3'
    document.body.appendChild(link)
    link.click()

    // 清理资源
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    }, 100)
  } catch (error) {
    console.error('Download failed:', error)
    // 降级到原始方法
    const fallbackLink = document.createElement('a')
    fallbackLink.href = url
    fallbackLink.download = fileName || 'audio.mp3'
    fallbackLink.click()
  }
}

export const getCacheViewNames = (routes: RouteRecordRaw[] = staticRoutes) => {
  // 递归获取缓存的路由
  const cacheViewNames: string[] = []

  routes.forEach((route) => {
    if (route.meta?.keepAlive) {
      cacheViewNames.push(route.name as string)
    }
    if (route.children) {
      cacheViewNames.push(
        ...getCacheViewNames(route.children as RouteRecordRaw[]),
      )
    }
  })

  return cacheViewNames
}
