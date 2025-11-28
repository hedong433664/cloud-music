import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Account, Profile } from '@/api/types/type'
import {
  getUserInfoApi,
  getUserLikeListApi,
  likeMusicApi,
  logoutApi,
} from '@/api'
import { setCookiesFromString } from '@/utils'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(
  'user',
  () => {
    const userId = ref<number>()
    const userCookie = ref('')
    const userAccount = ref<Account>()
    const userProfile = ref<Profile>()
    const userLikeIds = ref<number[]>([])
    const likeLoading = ref(false)

    const setUserCookie = (cookie: string) => {
      userCookie.value = cookie
      setCookiesFromString(cookie)
      getUserInfo()
    }

    const getUserInfo = async () => {
      const { profile, account } = await getUserInfoApi({
        cookie: userCookie.value,
      })
      userProfile.value = profile
      userAccount.value = account
      userId.value = profile.userId
      getUserLikeIds()
    }

    const getUserLikeIds = async () => {
      const { ids } = await getUserLikeListApi(
        userProfile.value?.userId as number,
      )
      userLikeIds.value = ids
    }

    const toggleLike = async (id: number | string) => {
      if (!userId.value) {
        ElMessage.warning('请先登录')
        return
      }
      if (likeLoading.value) {
        return
      }
      try {
        likeLoading.value = true
        const isLike = userLikeIds.value.includes(Number(id))
        await likeMusicApi({
          id,
          like: !isLike,
        })
      } catch (error) {
        console.error(error)
      } finally {
        likeLoading.value = false
        // 更新喜欢列表
        getUserLikeIds()
      }
    }

    const logout = async () => {
      await logoutApi()
      // 清除cookie
      setCookiesFromString('')
      userCookie.value = ''
      userAccount.value = undefined
      userProfile.value = undefined
      userLikeIds.value = []
      userId.value = undefined
    }

    return {
      userId,
      userCookie,
      userAccount,
      userProfile,
      userLikeIds,
      setUserCookie,
      getUserInfo,
      getUserLikeIds,
      toggleLike,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['userCookie', 'userId'],
    },
  },
)
