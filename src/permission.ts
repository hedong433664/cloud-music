import router from './router'
import Nprogess from 'nprogress'
import { useUserStore } from '@/store'

Nprogess.configure({
  showSpinner: false,
  minimum: 0.3,
})

router.beforeEach((_to, _from, next) => {
  Nprogess.start()
  const {
    userAccount,
    userProfile,
    userId,
    userLikeIds,
    getUserInfo,
    getUserLikeIds,
  } = useUserStore()

  if (userId) {
    if (!userAccount && !userProfile) {
      // 获取用户信息
      getUserInfo()
    }
    if (userLikeIds.length === 0) {
      // 获取用户喜欢列表
      getUserLikeIds()
    }
  }

  next()
})

router.afterEach(() => {
  Nprogess.done()
})
