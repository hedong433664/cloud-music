<template>
  <div class="subscribers-pane__container">
    <div class="card-wrapper__view">
      <el-row :gutter="20">
        <el-col
          v-for="item in data"
          :key="item.userId"
          :span="3"
          :xs="12"
          :sm="6"
          :md="4"
          :lg="3"
          :xl="3"
        >
          <div
            class="card-item round"
            @click="handleAccountDetail(item.userId)"
          >
            <el-image
              class="cover"
              :src="item.avatarUrl + '?param=200y200'"
              lazy
            />

            <div class="description">
              <el-text line-clamp="2" class="name">
                {{ item.nickname }}
              </el-text>

              <el-text line-clamp="2" class="signature">
                {{ item.signature }}
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

import type { Profile } from '@/api/types/type'

defineOptions({
  name: 'Subscribers',
})

type Emits = {
  (e: 'pagination', limit: number, offset: number): void
}

defineProps({
  data: {
    type: Array as () => Profile[],
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

const handleAccountDetail = (id: number) => {
  router.push(`/account/${id}`)
}
</script>

<style lang="scss" scoped>
.subscribers-pane__container {
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
