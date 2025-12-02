<template>
  <div class="header-account__container">
    <el-avatar
      class="avatar"
      v-if="userId"
      :src="profile?.avatarUrl"
      :size="30"
      @click="handleOpenLoginDialog"
    />

    <el-icon
      v-else
      size="36"
      class="icon-button"
      color="var(--el-color-primary)"
      @click="handleOpenLoginDialog"
    >
      <svg-icon name="icon-logo"></svg-icon>
    </el-icon>

    <el-text>{{ profile?.nickname || '点击头像登录' }}</el-text>

    <el-dialog
      v-model="dialogVisible"
      title="扫码登录"
      width="20%"
      center
      transition="dialog-bounce"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-alert
        title="由于网易限制，可能会无法成功扫码登录"
        type="warning"
        show-icon
        center
      />

      <br />

      <el-result class="scan-result" :sub-title="subTitle">
        <template #icon>
          <div class="qr-code__view">
            <el-image class="qr-code" fit="contain" :src="qrImg" />

            <div v-show="qrCheckCode === 800" class="mask">
              <el-button type="primary" text size="large" @click="getQrKey()">
                <el-icon>
                  <Refresh />
                </el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <template #extra>
          <el-button plain @click="handleCancelLogin">取消</el-button>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getQrCheckApi, getQrCreateApi, getQrKeyApi } from '@/api'
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { computed, onDeactivated, ref, watch } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'HeaderAccount',
})

const router = useRouter()
const userStore = useUserStore()
const profile = computed(() => userStore.userProfile)
const userId = computed(() => userStore.userAccount?.id)
const dialogVisible = ref<boolean>(false)
const qrKey = ref<string>('')
const qrImg = ref<string>('')
const qrCheckCode = ref<number>()
const subTitle = ref<string>('使用 App 进行扫码登录')
let timer = 0

const getQrKey = async () => {
  const {
    data: { unikey },
  } = await getQrKeyApi()
  qrKey.value = unikey

  const { data } = await getQrCreateApi(qrKey.value, true)
  qrImg.value = data.qrimg

  timer = setInterval(async () => {
    const { code, cookie, message } = await getQrCheckApi(qrKey.value, true)

    qrCheckCode.value = code

    if (code === 803 && !!cookie) {
      userStore.setUserCookie(cookie)
      ElMessage.success('登录成功')
      handleCancelLogin()
    } else {
      subTitle.value = message

      if (code === 800) {
        // 二维码不存在或已过期
        clearInterval(timer)
      }
    }
  }, 1000)
}

const handleOpenLoginDialog = async () => {
  // return userStore.logout()
  if (userId.value) {
    router.push(`/account/${userId.value}`)
    return
  }

  await getQrKey()
  dialogVisible.value = true
}

const handleCancelLogin = () => {
  dialogVisible.value = false
}

watch(
  () => dialogVisible.value,
  (value) => {
    if (!value) {
      clearInterval(timer)
    }
  },
)

onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.header-account__container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: end;
  .avatar {
    cursor: pointer;
  }
}
:deep(.scan-result) {
  padding: 0 40px;
  width: 100%;
  height: 100%;
  .el-result__icon {
    width: 100%;
    height: 100%;
  }
  .qr-code__view {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    .qr-code {
      width: 100%;
      aspect-ratio: 1;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
