<template>
  <div class="song-table__container" @click="handleClick">
    <el-table
      :data="songs"
      :height="height"
      show-overflow-tooltip
      highlight-current-row
      @cell-mouse-enter="(row) => (hoverSongId = row.id)"
      @cell-mouse-leave="() => (hoverSongId = null)"
      @row-dblclick="handlePlay"
      @row-contextmenu="handleContextmenu"
    >
      <el-table-column type="index" label="#" width="50" align="center">
        <template #default="{ $index, row }">
          <el-icon
            v-if="
              currentSongId === row.id && playerStatus && hoverSongId !== row.id
            "
            color="var(--el-color-primary)"
            size="20"
          >
            <svg-icon name="icon-playing" />
          </el-icon>

          <el-icon
            class="icon-button"
            v-else-if="hoverSongId === row.id"
            size="18"
            @click="handlePlay(row)"
          >
            <svg-icon
              :name="
                playerStatus && currentSongId === row.id
                  ? 'icon-pause-solid'
                  : 'icon-play-solid'
              "
            />
          </el-icon>

          <div v-else>{{ $index + 1 + offset }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="标题" min-width="120">
        <template #default="{ row }">
          <div class="song-name__view">
            <el-image
              v-if="!!row.al?.picUrl"
              class="cover"
              :src="row.al?.picUrl + '?param=60y60'"
            />

            <div
              class="info"
              :style="{
                '--color':
                  currentSongId === row.id
                    ? 'var(--el-color-primary)'
                    : 'inherit',
              }"
            >
              <div class="name">
                <strong>{{ row.name }}</strong>
                {{ row.alia?.length ? `（${row.alia.join(' / ')}）` : '' }}
              </div>

              <div class="singer">
                <el-space spacer="/">
                  <el-link
                    v-for="ar in row.ar"
                    :key="ar.id"
                    @click="router.push(`/account/${ar?.id}`)"
                  >
                    {{ ar.name }}
                  </el-link>
                </el-space>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="al" label="专辑" min-width="120">
        <template #default="{ row }">
          <el-link @click="router.push(`/albumDetail/${row.al?.id}`)">
            <strong>{{ row.al?.name }}</strong>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="喜欢" min-width="60">
        <template #default="{ row }">
          <el-icon
            class="icon-button"
            size="22"
            :color="
              userLikeIds.includes(row.id)
                ? 'var(--el-color-primary)'
                : '#d0d0d1'
            "
            @click="userStore.toggleLike(row.id)"
          >
            <svg-icon
              :name="userLikeIds.includes(row.id) ? 'icon-loved' : 'icon-love'"
            />
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="时长" width="120">
        <template #default="{ row }">
          {{ formatSecond(row.dt) }}
        </template>
      </el-table-column>
    </el-table>

    <el-dropdown
      ref="dropdownRef"
      :virtual-ref="triggerRef"
      :show-arrow="false"
      :popper-options="{
        modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
      }"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom-start"
      @command="handleCommand"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="play">
            <el-icon>
              <svg-icon name="icon-play-solid" />
            </el-icon>
            播放
          </el-dropdown-item>

          <el-dropdown-item command="addSong">
            <el-icon size="16">
              <svg-icon name="icon-add-song" />
            </el-icon>
            下一首播放
          </el-dropdown-item>

          <el-dropdown-item command="download">
            <el-icon size="16">
              <svg-icon name="icon-download" />
            </el-icon>
            下载
          </el-dropdown-item>

          <el-dropdown-item command="copy">
            <el-icon>
              <svg-icon name="icon-copy" />
            </el-icon>
            复制链接
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div v-if="!hidePagination && total > 0" class="pagination">
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
import { getPlaylistTrackAllApi, getSongDetailApi, getSongUrlApi } from '@/api'
import { computed, ref, watch } from 'vue'
import { downloadFile, formatSecond } from '@/utils'
import { usePlayerStore, useUserStore } from '@/store'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import type { SongDetail } from '@/api/types/type'
import type { TableProps, DropdownInstance } from 'element-plus'
defineOptions({
  name: 'SongTable',
})

type Props = {
  playlistId?: string | number
  data?: SongDetail[]
  total?: number
  height?: TableProps<any>['height']
  hidePagination?: boolean
  isAlbum?: boolean
  songIds?: (string | number)[]
}

type Emits = {
  (e: 'pagination', limit: number, offset: number): void
}

const emits = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  total: 0,
  height: 'auto',
  hidePagination: false,
})
const router = useRouter()

const limit = defineModel('limit', {
  type: Number || String,
  default: 10,
})
const offset = defineModel('offset', {
  type: Number || String,
  default: 0,
})
const userStore = useUserStore()
const userLikeIds = computed(() => userStore.userLikeIds)
const songs = ref<SongDetail[]>(props.data)
const currentContextmenuRow = ref<SongDetail | null>(null)
const playerStore = usePlayerStore()
const currentSongId = computed(() => playerStore.currentSong?.id)
const playerStatus = computed(() => playerStore.playerStatus)
const hoverSongId = ref<number | null>(null)
const dropdownRef = ref<DropdownInstance>()
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value,
})

const handleClick = () => {
  dropdownRef.value?.handleClose()
  currentContextmenuRow.value = null
}

const handleContextmenu = (
  row: SongDetail,
  _column: any,
  event: MouseEvent,
) => {
  currentContextmenuRow.value = row

  const { clientX, clientY } = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropdownRef.value?.handleOpen()
}

const handleCommand = async (command: string) => {
  if (command === 'play') {
    playerStore.play(currentContextmenuRow.value!)
    return
  }
  if (command === 'addSong') {
    playerStore.addToPlaylist(currentContextmenuRow.value!)
    return
  }
  if (command === 'download' || command === 'copy') {
    const { data } = await getSongUrlApi(currentContextmenuRow.value!.id)
    if (command === 'download') {
      try {
        await downloadFile(
          data[0].url,
          currentContextmenuRow.value!.name + '.mp3',
        )
        ElMessage.success('下载成功')
      } catch (_error) {
        ElMessage.error('下载失败')
      }
    }

    if (command === 'copy') {
      const { copy } = useClipboard()
      copy(data[0].url)
      ElMessage.success('复制成功')
    }
  }
}

const getSongs = async () => {
  if (props.playlistId) {
    const res = await getPlaylistTrackAllApi({
      id: props.playlistId,
      limit: limit.value,
      offset: offset.value,
    })

    songs.value = res.songs
  } else {
    songs.value = props.data || []
  }
}

const getAlbumSongs = async () => {
  if (props.songIds?.length) {
    const res = await getSongDetailApi(props.songIds.join(','))

    songs.value = res.songs
  } else {
    songs.value = props.data || []
  }
}

const handlePagination = (page: number) => {
  offset.value = (page - 1) * limit.value
  emits('pagination', limit.value, offset.value)
  getSongs()
}

const handlePlay = (row: SongDetail) => {
  playerStore.play(row)
}

const handlePlayAll = () => {
  playerStore.playAll(songs.value)
}

watch(
  [() => props.playlistId, () => props.data, () => props.songIds],
  ([newPlaylistId, newSongs, newSongIds]) => {
    if (newPlaylistId) {
      getSongs()
    }

    if (newSongs.length) {
      songs.value = props.data
    }

    if (newSongIds) {
      getAlbumSongs()
    }
  },
  {
    immediate: true,
  },
)

defineExpose({
  handlePlayAll,
})
</script>

<style lang="scss" scoped>
.song-table__container {
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
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-border: none;
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-table-current-row-bg-color: rgba(255, 255, 255, 0.05);
  .el-table__inner-wrapper::before {
    background-color: transparent;
  }
  .el-table__body-wrapper {
    background-color: transparent;
  }
  .el-table__cell {
    padding: 10px 0;
  }
  .el-table__row {
    td:first-child {
      border-radius: 10px 0 0 10px;
    }
    td:last-child {
      border-radius: 0 10px 10px 0;
    }
  }
}
.song-name__view {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  .cover {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
  .info {
    width: calc(100% - 40px - 10px);
    color: var(--color, inherit);
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color, inherit);
    }
    .singer {
      .el-link {
        --el-link-text-color: var(--color);
      }
    }
  }
}
</style>
