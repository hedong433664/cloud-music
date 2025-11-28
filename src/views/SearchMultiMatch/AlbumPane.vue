<template>
  <div class="album-pane__container">
    <div class="card-wrapper__view">
      <el-row :gutter="20">
        <el-col
          v-for="item in data"
          :key="item.id"
          :span="3"
          :xs="12"
          :sm="6"
          :md="4"
          :lg="3"
          :xl="3"
        >
          <div class="card-item" @click="handleAlbumDetail(item.id)">
            <el-image
              class="cover"
              :src="item.picUrl + '?param=200y200'"
              lazy
            />

            <div class="description">
              <el-text line-clamp="2" class="name">
                {{ item.name }}
              </el-text>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="total > 0" class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handlePagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { Album } from '@/api/types/type'

defineOptions({
  name: 'AlbumPane',
})

type Emits = {
  (e: 'pagination', limit: number, offset: number): void
}

defineProps({
  data: {
    type: Array as () => Album[],
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits<Emits>()
const router = useRouter()
const limit = defineModel('limit', {
  type: Number || String,
  default: 20,
})
const offset = defineModel('offset', {
  type: Number || String,
  default: 0,
})

const handlePagination = (page: number) => {
  offset.value = (page - 1) * limit.value
  emits('pagination', limit.value, offset.value)
}

const handleAlbumDetail = (id: number) => {
  router.push(`/albumDetail/${id}`)
}
</script>

<style lang="scss" scoped>
.album-pane__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
