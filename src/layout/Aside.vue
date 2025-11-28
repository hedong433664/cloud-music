<template>
  <div class="layout-aside__container">
    <div class="log-wrapper">
      <el-image src="/logo.svg" />

      <span class="logo-text">Cloud Music</span>
    </div>

    <el-scrollbar
      class="menu-wrapper"
      :wrap-style="{
        padding: '20px',
      }"
    >
      <el-menu class="menu" router :default-active="activeMenu">
        <el-menu-item index="/recommend">
          <template #title>
            <el-icon>
              <svg-icon name="icon-music-library" />
            </el-icon>

            <span class="menu-name">推荐</span>
          </template>
        </el-menu-item>

        <el-divider
          style="--el-border-color: rgba(255, 255, 255, 0.1)"
          v-if="userPlaylist.length"
        />

        <el-menu-item
          v-for="playlist in userPlaylist"
          :key="playlist.id"
          :index="`/playlistDetail/${playlist.id}`"
        >
          <template #title>
            <el-icon>
              <svg-icon
                :name="
                  playlist.specialType === 5 ? 'icon-loved' : 'icon-playlist'
                "
              />
            </el-icon>

            <span class="menu-name">{{ playlist.name }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { getUserPlaylistApi } from '@/api'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { PlaylistItem } from '@/api/types/type'
import { useUserStore } from '@/store'

defineOptions({
  name: 'LayoutAside',
})

const userStore = useUserStore()
const userId = computed(() => userStore.userProfile?.userId)
const route = useRoute()
const activeMenu = ref<string>('/recommend')
const userPlaylist = ref<PlaylistItem[]>([])

const getUserPlaylist = async () => {
  if (!userId.value) return

  const { playlist } = await getUserPlaylistApi(userId.value)
  userPlaylist.value = playlist
}

watch(
  [() => route.path, userId],
  ([newPath, newUserId]) => {
    activeMenu.value = newPath
    if (newUserId) {
      getUserPlaylist()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.layout-aside__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .log-wrapper {
    flex-shrink: 0;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 20px;
    font-weight: bold;
    box-sizing: border-box;
    user-select: none;
    cursor: default;
  }
  .menu-wrapper {
    flex: 1;
    .menu {
      --el-menu-bg-color: transparent;
      --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1);
      --el-menu-text-color: #d1d1d3;
      --el-menu-active-color: #ffffff;
      --el-menu-item-height: 36px;
      --el-menu-base-level-padding: 10px;
      border: none;
      .el-menu-item {
        border-radius: 8px;
        & {
          margin-bottom: 10px;
        }

        &:last-child {
          margin-bottom: 0;
        }

        &.is-active {
          background-color: var(--el-color-primary);
        }
        .menu-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
