<template>
  <div class="player-lyric__container">
    <div class="song-name">{{ songName }}</div>

    <div class="song-info">
      <div class="album">
        专辑：
        <el-link @click="router.push(`/albumDetail/${album?.id}`)">
          {{ album?.name }}
        </el-link>
      </div>

      <div class="singer">
        歌手：
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

    <el-scrollbar
      class="lyric-container"
      wrap-style="padding-right: 20px"
      @mouseenter="isTouch = true"
      @mouseleave="isTouch = false"
    >
      <div class="lyric-wrapper">
        <p class="placeholder"></p>

        <p
          class="lyric-item"
          v-for="(lyric, index) in currentSongLyric"
          :key="lyric.time"
          :class="{ 'is-active': isActive(index) }"
          :style="{
            textAlign: lyricAlign,
          }"
        >
          {{ lyric.text }}
          {{ lyricScroll(index) }}
        </p>

        <p class="placeholder"></p>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/store'
import { computed, ref, watch } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'PlayerLyric',
})

withDefaults(
  defineProps<{
    lyricAlign: 'left' | 'center' | 'right'
  }>(),
  {
    lyricAlign: 'left',
  },
)

const playerVisible = defineModel('playerVisible', {
  type: Boolean,
  default: false,
})

const router = useRouter()
const route = useRoute()
const playerStore = usePlayerStore()
const songName = computed(() => playerStore.currentSong?.name)
const singer = computed(() => playerStore.currentSong?.ar)
const album = computed(() => playerStore.currentSong?.al)
const currentSongLyric = computed(() => playerStore.currentSongLyric!)
const currentTime = computed(() => playerStore.currentTime * 1000)
const isTouch = ref(false)

const isActive = (index: number) => {
  if (index === 0) {
    return currentTime.value < currentSongLyric.value[index].time
  } else if (index === currentSongLyric.value.length - 1) {
    return currentTime.value > currentSongLyric.value[index].time
  } else {
    return (
      currentTime.value >= currentSongLyric.value[index].time &&
      currentTime.value < currentSongLyric.value[index + 1].time
    )
  }
}

const lyricScroll = (index: number) => {
  if (isActive(index) && !isTouch.value && playerVisible.value) {
    useThrottleFn(() => {
      document.querySelectorAll('.lyric-item')[index]?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    }, 1000)()
  }
}

watch(
  () => route.path,
  () => {
    playerVisible.value = false
  },
)
</script>

<style lang="scss" scoped>
.player-lyric__container {
  flex: 1 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .song-name {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
  }
  .song-info {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 15px;
    .album,
    .singer {
      line-height: 20px;
    }
    .lyric-align {
      display: flex;
      align-items: center;
    }
  }
  .lyric-container {
    width: 50%;
    :deep(.el-scrollbar__wrap) {
      transform: perspective(1200px);
      mask-image: linear-gradient(
        0deg,
        transparent,
        #fff 50%,
        #fff 50%,
        transparent
      );
    }
    .lyric-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      .placeholder {
        width: 100%;
        margin: 0;
        height: 500px;
      }
      .lyric-item {
        color: #a9a6b1;
        min-height: 20px;
        margin: 10px 0;
        transition: all 0.3s;
        &.is-active {
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
