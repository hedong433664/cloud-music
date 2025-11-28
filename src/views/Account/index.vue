<template>
  <div class="account-container">
    <div class="user-detail__view">
      <el-image class="avatar" :src="userDetail?.profile.avatarUrl">
        <template #error>
          <el-skeleton loading animated>
            <template #template>
              <el-skeleton-item
                variant="image"
                style="width: 150px; height: 150px"
              />
            </template>
          </el-skeleton>
        </template>
      </el-image>

      <div class="info">
        <div class="nickname">{{ userDetail?.profile.nickname }}</div>

        <div class="level-gender">
          <div class="level">LV.{{ userDetail?.level }}</div>

          <div class="gender">
            <el-icon v-if="userDetail?.profile.gender === 1" color="#32a9fc">
              <Female />
            </el-icon>

            <el-icon v-else color="#F56C6C"><Male /></el-icon>
          </div>
        </div>

        <div class="follows-followeds">
          <div class="follows">关注：{{ userDetail?.profile.follows }}</div>

          <div class="followeds">粉丝：{{ userDetail?.profile.followeds }}</div>
        </div>

        <div class="signature">简介：{{ userDetail?.profile.signature }}</div>
      </div>
    </div>

    <h3 class="playlist-title">
      {{
        isOneself
          ? '我创建的歌单'
          : `${userDetail?.profile.nickname || ''}创建的歌单`
      }}
    </h3>

    <div class="card-wrapper__view">
      <el-row :gutter="20">
        <el-col
          v-for="item in userPlaylist"
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
              :src="item.coverImgUrl + '?param=200y200'"
              lazy
            />

            <div class="description">
              <el-text line-clamp="2" class="name">
                {{ item.name }}
              </el-text>

              <div class="track-count">{{ item.trackCount }}首</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserDetailByIdApi, getUserPlaylistApi } from '@/api'
import { useUserStore } from '@/store'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Male, Female } from '@element-plus/icons-vue'

import type { UserDetailResponse } from '@/api/types/response'
import type { PlaylistItem } from '@/api/types/type'
import { setBackgroundColor } from '@/utils'

defineOptions({
  name: 'Account',
})

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const userId = computed(() => Number(route.params.id))
const isOneself = computed(() => userId.value === userStore.userAccount?.id)
const userDetail = ref<UserDetailResponse>()
const userPlaylist = ref<PlaylistItem[]>([])

const getUserDetail = async () => {
  const res = await getUserDetailByIdApi(userId.value)
  userDetail.value = res
}

const getUserPlaylist = async () => {
  const { playlist } = await getUserPlaylistApi(userId.value)
  userPlaylist.value = playlist
}

const handlePlaylistDetail = (id: number) => {
  router.push(`/playlistDetail/${id}`)
}

onMounted(() => {
  setBackgroundColor()
  getUserDetail()
  getUserPlaylist()
})
</script>

<style lang="scss" scoped>
.account-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .user-detail__view {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    gap: 20px;
    .avatar {
      flex-shrink: 0;
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .nickname {
        font-size: 24px;
        font-weight: bold;
      }
      .level-gender {
        display: flex;
        gap: 10px;
        .level {
          height: 20px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border-radius: 10px;
          background-color: rgba($color: #ffffff, $alpha: 0.2);
        }
        .gender {
          width: 20px;
          height: 20px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background-color: rgba($color: #ffffff, $alpha: 0.2);
        }
      }
      .follows-followeds {
        display: flex;
        gap: 10px;
      }
      .signature {
        font-size: 12px;
        color: #a6a4ab;
      }
    }
  }
  .playlist-title {
    color: #d0d0d1;
  }
}
</style>
