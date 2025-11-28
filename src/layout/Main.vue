<template>
  <div class="layout-main__container">
    <el-scrollbar
      height="calc(100vh - 80px - 90px)"
      :wrap-style="{
        padding: '20px',
      }"
      wrap-class="layout-main-scrollbar-wrapper"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in" appear>
          <keep-alive :include="cacheView">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>

      <el-backtop
        target=".layout-main-scrollbar-wrapper"
        :right="50"
        :bottom="100"
      >
        <el-icon size="30">
          <svg-icon name="icon-top" />
        </el-icon>
      </el-backtop>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { getCacheViewNames } from '@/utils'
import { computed } from 'vue'

defineOptions({
  name: 'LayoutMain',
})

const cacheView = computed(() => getCacheViewNames())
</script>

<style lang="scss" scoped>
/* fade-slide */
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.3s;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.layout-main__container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.el-backtop {
  height: 50px;
  width: 50px;
}
</style>
