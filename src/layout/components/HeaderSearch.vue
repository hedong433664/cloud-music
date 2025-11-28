<template>
  <el-autocomplete
    v-model="keywords"
    style="max-width: 300px"
    value-key="searchWord"
    popper-class="search-autocomplete"
    fit-input-width
    clearable
    :placeholder="placeholder"
    :prefix-icon="Search"
    :fetch-suggestions="querySearchAsync"
    @select="handleSelect"
    @keyup.enter="handleSelect"
  >
    <template #default="{ item: option }">
      <div class="hot-item">
        <div class="top">
          {{
            searchHotDetails.findIndex(
              (item) => item.searchWord === option.searchWord,
            ) + 1
          }}
        </div>

        <div class="word">{{ option.searchWord }}</div>

        <el-image class="icon" v-if="!!option.iconUrl" :src="option.iconUrl">
          <template #error>
            <span></span>
          </template>
        </el-image>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { onDeactivated, onMounted, ref } from 'vue'
import { getSearchHotDetailsApi } from '@/api'

import type { HotItem } from '@/api/types/type'

defineOptions({
  name: 'HeaderSearch',
})

const router = useRouter()
const keywords = ref<string>('')
const searchHotDetails = ref<HotItem[]>([])
const placeholder = ref<string>('')
let timer: number = 0
let placeholderIndex = 0

// 搜索框搜索建议
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (queryString) {
    return cb(
      searchHotDetails.value.filter((item) =>
        item.searchWord?.includes(queryString),
      ),
    )
  }

  cb(searchHotDetails.value)
}

// 搜索框选中建议
const handleSelect = (item: HotItem) => {
  keywords.value = keywords.value || placeholder.value

  router.push({
    path: '/searchMultiMatch',
    query: {
      keywords: item.searchWord || keywords.value,
    },
  })
}

// 循环设置placeholder
const setPlaceholder = () => {
  placeholder.value = searchHotDetails.value[placeholderIndex]
    .searchWord as string
  placeholderIndex =
    placeholderIndex === searchHotDetails.value.length - 1
      ? 0
      : placeholderIndex + 1
}

onMounted(() => {
  keywords.value = router.currentRoute.value.query.keywords as string
  getSearchHotDetailsApi()
    .then(({ data }) => {
      searchHotDetails.value = data
      placeholder.value = data[0].searchWord as string
      timer = setInterval(setPlaceholder, 5000)
    })
    .catch(() => (searchHotDetails.value = []))
})

onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.search-autocomplete .el-autocomplete-suggestion__list {
  .hot-item {
    display: flex;
    align-items: center;
    gap: 10px;
    .top {
      flex-shrink: 0;
      width: 14px;
      text-align: center;
      font-weight: bold;
    }
    .word {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #d6d6d8;
    }
    .icon {
      width: fit-content;
      height: 12px;
    }
  }
  li:nth-child(1) .hot-item {
    .top {
      color: var(--el-color-primary);
    }
    .word {
      font-weight: bold;
    }
  }
  li:nth-child(2) .hot-item {
    .top {
      color: var(--el-color-primary);
    }
    .word {
      font-weight: bold;
    }
  }
  li:nth-child(3) .hot-item {
    .top {
      color: var(--el-color-primary);
    }
    .word {
      font-weight: bold;
    }
  }
}
</style>
