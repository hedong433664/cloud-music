<template>
  <div class="layout-header__container">
    <el-button type="info" @click="router.back()">
      <el-icon>
        <ArrowLeftBold />
      </el-icon>
    </el-button>

    <HeaderSearch />

    <HeaderAccount />
  </div>
</template>

<script setup lang="ts">
import HeaderSearch from './components/HeaderSearch.vue'
import HeaderAccount from './components/HeaderAccount.vue'

import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LayoutHeader',
})

const router = useRouter()
</script>

<style lang="scss" scoped>
.layout-header__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
