<template>
  <ElConfigProvider :locale="zhCn">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup lang="tsx">
import { onMounted } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useUserStore } from './store'
import { setCookiesFromString } from './utils'

const userStore = useUserStore()

onMounted(() => {
  setCookiesFromString(userStore.userCookie)
  // 设置html.dark
  document.documentElement.classList.add('dark')
})
</script>
