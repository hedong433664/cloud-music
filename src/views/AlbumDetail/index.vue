<template>
  <div class="album-detail__container">
    <div class="album-description" v-show="!!albumDetail">
      <div class="cover-view">
        <el-image class="cover" :src="albumDetail?.picUrl + '?param=200y200'">
          <template #error>
            <el-skeleton loading animated>
              <template #template>
                <el-skeleton-item
                  variant="image"
                  style="width: 200px; height: 200px"
                />
              </template>
            </el-skeleton>
          </template>
        </el-image>
      </div>

      <div class="info-view">
        <div class="name">{{ albumDetail?.name }}</div>

        <div class="creator-info">
          <el-image
            class="avatar"
            :src="albumDetail?.artist.picUrl + '?param=50y50'"
          />

          <el-link @click="handleUserDetail(albumDetail?.artist.id as number)">
            {{ albumDetail?.artist.name }}
          </el-link>
        </div>

        <div class="create-time">
          {{ useDateFormat(albumDetail?.publishTime, 'YYYY-MM-DD') }}发布
        </div>

        <div class="buttons">
          <el-button type="primary" @click="playAll">
            <el-icon>
              <svg-icon name="icon-play-solid" />
            </el-icon>
            &nbsp;播放全部
          </el-button>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲" name="songs" lazy>
        <SongTable
          ref="SongTableRef"
          is-album
          :song-ids="songIds"
          hide-pagination
        />
      </el-tab-pane>

      <el-tab-pane label="评论" name="comment" lazy>
        <Comment :id="albumId" type="3" />
      </el-tab-pane>

      <el-tab-pane label="专辑详情" name="albumDescription" lazy>
        <div class="description">
          <h3 class="title">专辑简介</h3>

          <div class="info" v-html="albumDetail?.description" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getAlbumDetailApi } from '@/api'
import { setBackgroundColor, getPalette } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'

import type { Album, SongDetail } from '@/api/types/type'
import type SongTable from '@/components/SongTable.vue'

defineOptions({
  name: 'AlbumDetail',
})

const route = useRoute()
const router = useRouter()
const albumId = computed(() => route.params.id as string)
const activeName = ref('songs')
const albumDetail = ref<Album>()
const songIds = ref<(string | number)[]>([])
const SongTableRef = ref<InstanceType<typeof SongTable>>()

const getAlbumDetail = async () => {
  const res = await getAlbumDetailApi(albumId.value)
  const [rgb] = await getPalette(res.album.picUrl)

  albumDetail.value = res.album
  albumDetail.value.description = res.album.description.replace(/\n/g, '<br>')
  setBackgroundColor(rgb)
  songIds.value = res.songs.map((item: SongDetail) => item.id)
}

const handleUserDetail = (userId: number) => {
  router.push(`/account/${userId}`)
}

const playAll = () => {
  SongTableRef.value?.handlePlayAll()
}

onMounted(() => {
  getAlbumDetail()
})
</script>

<style lang="scss" scoped>
.album-detail__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .album-description {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 200px;
    .cover-view {
      position: relative;
      width: 200px;
      height: 100%;
      .cover {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        opacity: 0.8;
      }
      .play-count {
        position: absolute;
        right: 10px;
        top: 10px;
        display: flex;
        align-items: center;
        gap: 2px;
        color: #ffffff;
      }
    }
    .info-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 10px;
      .name {
        font-size: 20px;
        font-weight: 600;
      }
      .creator-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        gap: 10px;
        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
      }
      .create-time {
        font-size: 12px;
        color: #9d97ad;
      }
      .buttons {
        margin-top: auto;
      }
    }
  }
}
.description {
  .title {
    margin: 20px 0;
  }
  .info {
    font-size: 14px;
    color: #a6a4ab;
  }
}
</style>
