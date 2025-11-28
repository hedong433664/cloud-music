<template>
  <div class="playlist-detail__container">
    <div class="playlist-description" v-show="!!playlistDetail">
      <div class="cover-view">
        <el-image
          class="cover"
          :src="playlistDetail?.coverImgUrl + '?param=200y200'"
        >
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

        <div class="play-count">
          <el-icon color="#ffffff" size="16">
            <svg-icon name="icon-listen" />
          </el-icon>
          {{ playlistDetail?.playCount || 0 }}
        </div>
      </div>

      <div class="info-view">
        <div class="name">{{ playlistDetail?.name }}</div>

        <div class="creator-info">
          <el-image
            class="avatar"
            :src="playlistDetail?.creator.avatarUrl + '?param=50y50'"
          />

          <el-link
            @click="handleUserDetail(playlistDetail?.creator.userId as number)"
          >
            {{ playlistDetail?.creator.nickname }}
          </el-link>
        </div>

        <div class="create-time">
          {{ useDateFormat(playlistDetail?.createTime, 'YYYY-MM-DD') }}创建
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

    <el-tabs v-model="activeName" @tab-change="handleTabChange">
      <el-tab-pane label="歌曲" name="songs" lazy>
        <SongTable
          ref="SongTableRef"
          :playlist-id="playlistId"
          :total="playlistDetail?.trackCount"
        />
      </el-tab-pane>

      <el-tab-pane label="评论" name="comment" lazy>
        <Comment :id="playlistId" type="2" />
      </el-tab-pane>

      <el-tab-pane label="收藏者" name="subscribers" lazy>
        <Subscribers
          v-model:limit="subscribersLimit"
          v-model:offset="subscribersOffset"
          :data="subscribers"
          @pagination="getSubscribers()"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { getPlaylistDetailApi, getPlaylistSubscribersApi } from '@/api'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setBackgroundColor, getPalette } from '@/utils'
import { useDateFormat } from '@vueuse/core'
import Subscribers from './Subscribers.vue'

import type { PlaylistItem, Profile } from '@/api/types/type'
import type SongTable from '@/components/SongTable.vue'
import type { TabPaneName } from 'element-plus'

defineOptions({
  name: 'PlaylistDetail',
})

const route = useRoute()
const router = useRouter()
const playlistId = computed(() => route.params.id as string)
const playlistDetail = ref<PlaylistItem>()
const activeName = ref('songs')
const SongTableRef = ref<InstanceType<typeof SongTable>>()

const subscribers = ref<Profile[]>([])
const subscribersCount = ref<number>(0)
const subscribersLimit = ref<number>(20)
const subscribersOffset = ref<number>(0)

const getPlaylistDetail = async () => {
  const res = await getPlaylistDetailApi(playlistId.value)
  const [rgb] = await getPalette(res.playlist.coverImgUrl)
  setBackgroundColor(rgb)
  playlistDetail.value = res.playlist
}

const getSubscribers = async () => {
  const res = await getPlaylistSubscribersApi({
    id: playlistId.value as string,
    limit: subscribersLimit.value,
    offset: subscribersOffset.value,
  })

  subscribers.value = res.subscribers
  subscribersCount.value = res.total
}

const handleUserDetail = (userId: number) => {
  router.push(`/account/${userId}`)
}

const playAll = () => {
  SongTableRef.value?.handlePlayAll()
}

const handleTabChange = (name: TabPaneName) => {
  if (name === 'subscribers') {
    getSubscribers()
  }
}

watch(
  () => route.params.id,
  () => {
    getPlaylistDetail()
  },
)

onMounted(() => {
  getPlaylistDetail()
})
</script>

<style lang="scss" scoped>
.playlist-detail__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .playlist-description {
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
</style>
