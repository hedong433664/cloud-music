<template>
  <div class="error-page global-page-fill">
    <el-result icon="error" title="404" sub-title="对不起，您访问的页面不存在">
      <template #extra>
        <el-button type="primary" @click="router.replace('/recommend')">
          返回推荐页
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: '404',
})
const router = useRouter()
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
