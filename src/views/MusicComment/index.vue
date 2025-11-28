<template>
  <div class="music-comment__container">
    <h2>{{ songName }}</h2>

    <Comment :id="songId" type="0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'MusicComment',
})

const route = useRoute()
const songId = computed(() => route.params.id as string)
const songName = computed(() => route.query.songName as string)
</script>

<style lang="scss" scoped>
.music-comment__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
