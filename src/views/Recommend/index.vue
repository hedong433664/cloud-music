<template>
  <div class="recommend-container">
    <div class="banner-view">
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="banner in bannerList" :key="banner.targetId">
          <el-image class="banner-img" :src="banner.imageUrl" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <h3 class="title">推荐歌单</h3>

    <div class="card-wrapper__view">
      <el-row :gutter="20">
        <el-col
          v-for="item in playlist"
          :key="item.id"
          :span="3"
          :xs="12"
          :sm="6"
          :md="4"
          :lg="4"
          :xl="3"
        >
          <div class="card-item" @click="handlePlaylistDetail(item.id)">
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

            <div class="play-count">
              <el-icon size="14">
                <svg-icon name="icon-play-solid" />
              </el-icon>
              {{ formatCount(item.playCount) }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBannersApi, getPersonalizedApi } from '@/api'
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCount, setBackgroundColor } from '@/utils'

import type { Banner, PersonalizedItem } from '@/api/types/type'

defineOptions({
  name: 'Recommend',
})

const router = useRouter()
const bannerList = ref<Banner[]>([])
const playlist = ref<PersonalizedItem[]>([])

const getBanners = async () => {
  const { banners } = await getBannersApi()
  bannerList.value = banners
}

const getPersonalized = async () => {
  const { result } = await getPersonalizedApi()
  playlist.value = result
}

const handlePlaylistDetail = (id: number) => {
  router.push(`/playlistDetail/${id}`)
}

onActivated(() => {
  setBackgroundColor()
  getBanners()
  getPersonalized()
})
</script>

<style lang="scss" scoped>
.recommend-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 100px;
  box-sizing: border-box;
  .banner-view {
    display: flex;
    align-items: center;
    justify-content: center;
    .banner-img {
      border-radius: 10px;
    }
  }
}
:deep(.el-carousel) {
  width: 100%;
  aspect-ratio: 2160 / 400;
  border-radius: 10px;
  .el-carousel__container {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    .el-carousel__item {
      height: auto;
      aspect-ratio: 1080 / 400;
      border-radius: 10px;
    }
  }
}
</style>
