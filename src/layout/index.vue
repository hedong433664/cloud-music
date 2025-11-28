<template>
  <div class="app-layout__container">
    <el-container>
      <el-container>
        <el-aside width="220px">
          <Aside />
        </el-aside>

        <el-container>
          <el-header>
            <Header />
          </el-header>

          <el-main>
            <Main />
          </el-main>
        </el-container>
      </el-container>

      <el-footer>
        <transition name="el-zoom-in-bottom">
          <Footer
            v-show="!playerVisible"
            v-model:player-visible="playerVisible"
            v-model:playlist-visible="playlistVisible"
          />
        </transition>
      </el-footer>
    </el-container>

    <el-drawer
      v-model="playerVisible"
      class="player-drawer"
      size="100%"
      direction="btt"
      :close-delay="30"
      :open-delay="30"
      :show-close="false"
    >
      <template #header="{ close }">
        <div class="player-drawer__header">
          <el-button type="info" @click="close">
            <el-icon>
              <ArrowDownBold />
            </el-icon>
          </el-button>

          <el-popover placement="bottom" :width="200" trigger="click">
            <template #default>
              <el-form :model="settingForm" label-position="top">
                <el-form-item label="唱片风格">
                  <el-segmented
                    v-model="settingForm.discStyle"
                    :options="discStyleOptions"
                  />
                </el-form-item>

                <el-form-item label="对齐方式">
                  <el-segmented
                    v-model="settingForm.lyricAlign"
                    :options="lyricAlignOptions"
                  >
                    <template #default="scope">
                      <el-icon size="10">
                        <component :is="scope.item.icon" />
                      </el-icon>
                    </template>
                  </el-segmented>
                </el-form-item>
              </el-form>
            </template>

            <template #reference>
              <el-icon size="20" class="icon-button">
                <Setting />
              </el-icon>
            </template>
          </el-popover>
        </div>
      </template>

      <template #default>
        <el-scrollbar height="calc(100vh - 80px - 90px)">
          <div class="player-container">
            <div class="disc-lyric__wrapper">
              <PlayerDisc :discStyle="settingForm.discStyle" />

              <PlayerLyric
                v-model:player-visible="playerVisible"
                :lyricAlign="settingForm.lyricAlign"
              />
            </div>
          </div>
        </el-scrollbar>
      </template>

      <template #footer>
        <canvas ref="canvasRef" class="waveform" />

        <transition name="el-zoom-in-top">
          <Footer
            v-show="playerVisible"
            v-model:player-visible="playerVisible"
            v-model:playlist-visible="playlistVisible"
          />
        </transition>
      </template>
    </el-drawer>

    <el-drawer
      ref="playlistDrawerRef"
      v-model="playlistVisible"
      class="playlist-drawer"
      append-to-body
      modal-penetrable
      :modal="false"
      :show-close="false"
    >
      <template #header>
        <div class="playlist-header">
          播放列表
          <span class="total">
            {{ currentPlaylist.length }}
          </span>
        </div>
      </template>

      <SongTable
        :data="currentPlaylist"
        hide-pagination
        height="calc(100vh - 80px - 70px - 90px - 20px)"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'
import Footer from './Footer.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import PlayerDisc from './components/PlayerDisc.vue'
import PlayerLyric from './components/PlayerLyric.vue'
import { Setting, ArrowLeft, Minus, ArrowRight } from '@element-plus/icons-vue'

import { computed, onMounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { usePlayerStore } from '@/store'

defineOptions({
  name: 'Layout',
})

const playerVisible = ref(false)
const playlistVisible = ref(false)
const playlistDrawerRef = ref()
const playerStore = usePlayerStore()
const currentPlaylist = computed(() => playerStore.currentPlaylist)
const canvasRef = ref<HTMLCanvasElement>()
const ctx = computed(() => canvasRef.value?.getContext('2d'))
const barWidth = ref<number>(0)
const barHeight = ref<number>(0)
const x = ref<number>(0)
const cancel = ref<() => void>()

type FormType = {
  discStyle: 'disc' | 'etherealize'
  lyricAlign: 'left' | 'center' | 'right'
}
const settingForm = ref<FormType>({
  discStyle: 'disc',
  lyricAlign: 'left',
})

const discStyleOptions = [
  { value: 'disc', label: '黑胶' },
  { value: 'etherealize', label: '灵动' },
]

const lyricAlignOptions = [
  { value: 'left', label: 'left', icon: ArrowLeft },
  { value: 'center', label: 'center', icon: Minus },
  { value: 'right', label: 'right', icon: ArrowRight },
]

onClickOutside(
  playlistDrawerRef,
  () => {
    playlistVisible.value = false
  },
  {
    ignore: ['.playlist-drawer .el-drawer__body', '.open-playlist-button'],
  },
)

const draw = (dataArray: number[]) => {
  if (!canvasRef.value || !ctx.value) {
    return
  }
  x.value = 0
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  for (let i = 0; i < dataArray.length; i++) {
    barHeight.value = dataArray[i]
    barWidth.value = canvasRef.value.width / dataArray.length
    ctx.value.fillStyle = `rgb(252, 61, 73)`
    ctx.value.fillRect(
      x.value,
      canvasRef.value.height - barHeight.value / 2,
      barWidth.value,
      barHeight.value / 2,
    )
    x.value += barWidth.value + 1
  }
}

watch(
  () => settingForm.value.discStyle,
  (value) => {
    if (value === 'etherealize') {
      cancel.value = playerStore.updateDraw(draw)
    } else {
      cancel.value?.()
      ctx.value?.clearRect(
        0,
        0,
        canvasRef.value!.width,
        canvasRef.value!.height,
      )
    }
  },
)

onMounted(() => {
  canvasRef.value!.width = window.innerWidth * devicePixelRatio
  canvasRef.value!.height = 90 * devicePixelRatio
})
</script>

<style lang="scss" scoped>
.app-layout__container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .el-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    --container-item-padding: 0;
    .el-header {
      --el-header-padding: var(--container-item-padding);
      --el-header-height: 80px;
      background: transparent;
      box-sizing: border-box;
    }
    .el-aside {
      padding: var(--container-item-padding);
      background: rgba($color: #ffffff, $alpha: 0.03);
      box-shadow: var(--el-box-shadow-dark);
      box-sizing: border-box;
    }
    .el-main {
      --el-main-padding: var(--container-item-padding);
      background: transparent;
      box-sizing: border-box;
    }
    .el-footer {
      --el-footer-padding: var(--container-item-padding);
      --el-footer-height: 90px;
      background: transparent;
      box-shadow: var(--el-box-shadow-dark);
      box-sizing: border-box;
    }
  }
}

.el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: rgba(255, 255, 255, 0.2);
  --el-border-radius-base: 16px;
}

:deep(.player-drawer) {
  --el-drawer-bg-color: transparent;
  backdrop-filter: blur(10px);
  .el-drawer__header {
    padding: 20px;
    margin: 0;
  }
  .player-drawer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-drawer__body {
    padding: 0 20px;
    .player-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-sizing: border-box;
      .disc-lyric__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 80px - 90px);
        gap: 100px;
        box-sizing: border-box;
      }
    }
  }
  .el-drawer__footer {
    position: relative;
    height: var(--el-footer-height, 90px);
    padding: 0;
    overflow: visible;
    .waveform {
      position: absolute;
      bottom: var(--el-footer-height, 90px);
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 1;
    }
  }
}
</style>
