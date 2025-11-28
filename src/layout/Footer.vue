<template>
  <div class="layout-footer__container">
    <div
      class="slider-bar"
      :style="{
        '--slider-bar-bg-color': `${coverMainColor}`,
      }"
    >
      <el-slider
        v-show="!!songUrl"
        v-model="currentTime"
        size="small"
        :format-tooltip="formatProgressTooltip"
        :disabled="!songUrl"
      />
    </div>

    <div class="left-view">
      <div
        v-show="!!songUrl"
        class="disc-box"
        @click="playerVisible = !playerVisible"
      >
        <el-image class="disc" :src="disc" />

        <el-image
          class="cover is-rotate"
          :src="cover"
          :style="{
            animationPlayState: playerStatus ? 'running' : 'paused',
          }"
        />
      </div>

      <div v-show="!!songUrl" class="song-info">
        <div class="song-name">{{ songName }}</div>

        <div class="singer">
          <el-space spacer="/">
            <el-link
              v-for="ar in singer"
              :key="ar.id"
              @click="router.push(`/account/${ar?.id}`)"
            >
              {{ ar.name }}
            </el-link>
          </el-space>
        </div>
      </div>

      <el-icon
        v-show="!!songUrl"
        class="icon-button"
        size="22"
        :color="
          userLikeIds.includes(songId as number)
            ? 'var(--el-color-primary)'
            : '#d0d0d1'
        "
      >
        <svg-icon
          :name="
            userLikeIds.includes(songId as number) ? 'icon-loved' : 'icon-love'
          "
        />
      </el-icon>

      <el-icon
        v-show="!!songUrl"
        class="icon-button"
        size="20"
        @click="handleMusicComment"
      >
        <svg-icon name="icon-comment"></svg-icon>
      </el-icon>
    </div>

    <div class="center-view">
      <el-icon
        class="icon-button"
        size="22"
        color="#d0d0d1"
        @click="playerStore.toggleSingleLoop()"
      >
        <svg-icon :name="singleLoop ? 'icon-loop' : 'icon-list-loop'" />
      </el-icon>

      <el-icon
        class="icon-button"
        size="24"
        color="#d0d0d1"
        @click="playerStore.prevSong()"
      >
        <svg-icon name="icon-previous-song" />
      </el-icon>

      <el-icon
        class="icon-button"
        size="42"
        color="var(--el-color-primary)"
        @click="play()"
      >
        <svg-icon :name="playerStatus ? 'icon-pause' : 'icon-play'" />
      </el-icon>

      <el-icon
        class="icon-button"
        size="24"
        color="#d0d0d1"
        @click="playerStore.nextSong()"
      >
        <svg-icon name="icon-next-song" />
      </el-icon>

      <el-icon
        class="open-playlist-button icon-button"
        size="20"
        @click="playlistVisible = !playlistVisible"
      >
        <svg-icon name="icon-playlist" />
      </el-icon>
    </div>

    <div class="right-view">
      <el-icon size="22" class="icon-button" @click="playerStore.toggleMute()">
        <svg-icon :name="muted ? 'icon-muted' : 'icon-volume'" />
      </el-icon>

      <div class="volume-view">
        <el-slider v-model="volume" size="small" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore, useUserStore } from '@/store'
import { computed, ref, watch } from 'vue'
import { formatSecond, getPalette } from '@/utils'
import { ElMessage } from 'element-plus'

import disc from '@/assets/image/disc.png'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'LayoutFooter',
})

const playerVisible = defineModel('playerVisible', {
  type: Boolean,
  default: false,
})

const playlistVisible = defineModel('playlistVisible', {
  type: Boolean,
  default: false,
})

const router = useRouter()
const route = useRoute()
const playerStore = usePlayerStore()
const userStore = useUserStore()
const userLikeIds = computed(() => userStore.userLikeIds)
const currentTime = computed<number>({
  get() {
    return (playerStore.currentTime / (playerStore.durationTime / 1000)) * 100
  },
  set(value: number) {
    playerStore.setCurrentTime(
      (value / 100) * (playerStore.durationTime / 1000),
    )
  },
})
const volume = computed({
  get() {
    return playerStore.volume * 100
  },
  set(value: number) {
    playerStore.setVolume(value / 100)
  },
})

const songId = computed(() => playerStore.currentSong?.id)
const songName = computed(() => playerStore.currentSong?.name)
const singer = computed(() => playerStore.currentSong?.ar)
const songUrl = computed(() => playerStore.currentSongUrl)
const cover = computed(() => playerStore.currentSong?.al.picUrl)
const playerStatus = computed(() => playerStore.playerStatus)
const singleLoop = computed(() => playerStore.singleLoop)
const muted = computed(() => playerStore.muted)
const coverMainColor = ref<string>('--el-slider-main-bg-color')

const formatProgressTooltip = () => {
  return `${formatSecond(playerStore.currentTime, true)} / ${formatSecond(playerStore.durationTime)}`
}

const play = () => {
  if (!songUrl.value) {
    return ElMessage.warning('当前没有可播放的歌曲')
  }
  playerStore.togglePlayerStatus()
}

const getCoverMainColor = async () => {
  const [rgb] = await getPalette(cover.value as string)

  coverMainColor.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

const handleMusicComment = () => {
  router.push(`/musicComment/${songId.value}?songName=${songName.value}`)
}

watch([cover, () => route.path], ([newCover, newPath]) => {
  if (newCover) {
    getCoverMainColor()
  }
  if (newPath) {
    playerVisible.value = false
  }
})
</script>

<style lang="scss" scoped>
.layout-footer__container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .slider-bar {
    position: absolute;
    width: 100%;
    top: -10px;
    left: 0;
    :deep(.el-slider) {
      --el-slider-height: 2px;
      --el-slider-button-size: 8px;
      --el-slider-button-wrapper-offset: -17px;
      .el-slider__bar {
        // 从左到右线性渐变色
        background: linear-gradient(
          90deg,
          transparent,
          var(--slider-bar-bg-color)
        );
      }
      .el-slider__button-wrapper {
        display: none;
      }
      .el-slider__runway:has(> .dragging) {
        .el-slider__button-wrapper {
          display: block;
        }
      }
    }
    &:hover :deep(.el-slider) {
      --el-slider-height: 5px;
      --el-slider-button-size: 12px;
      --el-slider-button-wrapper-offset: -15px;
      .el-slider__button-wrapper {
        display: block;
      }
    }
  }
  .left-view,
  .center-view,
  .right-view {
    flex: 1 0 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  }
  .left-view {
    gap: 10px;
    justify-content: flex-start;
    .disc-box {
      position: relative;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      .disc {
        position: absolute;
        width: 70px;
        height: 70px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .cover {
        position: absolute;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
      }
      user-select: none;
      cursor: pointer;
    }
    .is-rotate {
      animation: rotate 15s linear infinite;
      animation-play-state: paused;
    }
    .song-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      gap: 5px;
      .song-name {
        font-size: 16px;
        color: #ffffff;
      }
      .singer {
        font-size: 14px;
        color: #a9a6b1;
      }
    }
  }
  .center-view {
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  .right-view {
    gap: 16px;
    justify-content: flex-end;
    .volume-view {
      min-width: 100px;
      :deep(.el-slider) {
        --el-slider-height: 5px;
        --el-slider-button-size: 12px;
        --el-slider-button-wrapper-offset: -16px;
      }
    }
  }
  .player-drawer__header {
    display: flex;
    align-items: center;
  }
}
</style>
