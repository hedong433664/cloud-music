<template>
  <div class="player-disc__container">
    <div
      :class="['disc', { etherealize: discStyle === 'etherealize' }]"
      :style="{
        '--cover-url': `url('${cover}')`,
        '--play-state': `${playerStatus ? 'running' : 'paused'}`,
      }"
    >
      <div
        class="needle"
        v-show="discStyle === 'disc'"
        :style="{
          transform: playerStatus ? 'rotate(10deg)' : 'rotate(-30deg)',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/store'
import { computed } from 'vue'

defineOptions({
  name: 'PlayerDisc',
})

withDefaults(
  defineProps<{
    discStyle: 'disc' | 'etherealize'
  }>(),
  {
    discStyle: 'disc',
  },
)

const playerStore = usePlayerStore()
const cover = computed(() => playerStore.currentSong?.al?.picUrl)
const playerStatus = computed(() => playerStore.playerStatus)
</script>

<style lang="scss" scoped>
.player-disc__container {
  flex: 1 0 0;
  display: flex;
  justify-content: end;
  .disc {
    position: relative;
    width: 50%;
    margin-top: 100px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 15px;
    border-radius: 50%;
    background: url('@/assets/image/disc.png') no-repeat;
    background-size: calc(100% - 30px) calc(100% - 30px);
    background-position: 15px 15px;
    background-color: rgba($color: #ffffff, $alpha: 0.1);
    border: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    &::before {
      content: '';
      position: absolute;
      width: 55%;
      height: 55%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: var(--cover-url) no-repeat;
      background-size: cover;
      animation: rotate 15s linear infinite;
      animation-play-state: var(--play-state, 'paused');
    }
    .needle {
      position: absolute;
      width: 30%;
      aspect-ratio: 4 / 5;
      top: -20%;
      left: 50%;
      transform: translateX(-5%);
      background: url('@/assets/image/needle.png') no-repeat;
      background-size: cover;
      transform-origin: 10% 10%;
      transition: all 0.3s;
    }
  }
  .etherealize {
    background: none;
    border: none;
    &::before {
      width: 80%;
      height: 80%;
    }
  }
}
</style>
