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
import { computed, onDeactivated, onMounted, ref, watch } from 'vue'
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

onMounted(() => {
  if (!userStore.userCookie) {
    // 模拟登录成功，设置cookie
    userStore.setUserCookie(
      'NMTID=00OdXgMkK7DD_ir-E_PrZtN_NbVkBQAAAGUHBDv_Q; _ntes_nnid=90ee2c9b629a0e0dfd79390254c03973,1735637671840; _ntes_nuid=90ee2c9b629a0e0dfd79390254c03973; WEVNSM=1.0.0; WNMCID=vaummk.1735637673418.01.0; sDeviceId=YD-U9EnYotE1zJFR1URAFfDJVehVgNIyuY6; WM_TID=B7UMZcR1JK9FVBBQUQKXMVLlQhYJ3CKx; __snaker__id=NVusDIVQYebV71gL; ntes_utid=tid._.69MsCsq97jpBRkVBBQLTJUekVhYNn6d5._.0; ntes_kaola_ad=1; NTES_P_UTID=mxj8dSeHiFc99YWrQ6sJlOZpP2whFK69|1749871126; P_INFO=m17671045489_1@163.com|1749871126|1|mail163|00&99|null&null&null#hub&420100#10#0#0|176489&1||17671045489@163.com; _iuqxldmzr_=32; WM_NI=3uB6kI8muMO9xBwDJgcN4VH4twLObDnNyqEJI%2Bh3RYAcWuGXelbVixusZwtVrPvIUKALfVI1DGh1qDnomWoEsk3zWKIdESX9sVmLCNfkoytvCJYAUhz5a9tRQp%2Bx0cebc08%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6ee87d04b90a78493f55298ac8bb7c45e968f9f83c2629cf5aba5c95aa587ba83ce2af0fea7c3b92af1ab8ed7ea43fcb3bbaece33bc9eb9a5c96da192fcb7cb40b8a984b0e150ae92b792c8428bf5a8d4d15383bd9996c654a7b4aeb7ec74b7ad9698f75eb290baaad8418394aab7cc3b8899a8d2f450aeb1a3b8ee4fb1b5fd9bd6418bbc8bb4db33b18aa3adc246a6b5a19af77e819697a2d864baebafdaf75a93b0e599b369a7beadd1bb37e2a3; JSESSIONID-WYYY=DUzhUaGB%5COHV6ykgdi%2Bvjx7SnIIUmr%5CEtJp7zlRzYsNgfc1E6%2FgQS4%5C%2F7ZN8wE8o%5CmOvIm%2FBWRjzjbnosN%2FNybJFCZDblUgunk%5CzKMiCzs3F%2Fq6ZeQd1V8hzjXnPzfRjxIlGB29nncSAWryrBko1tAAgBCzTKMF%5CbZH6lIItuk1bw0Wo%3A1763014328841; gdxidpyhxdE=LifmiVHtntslHGeYDVxQ7%2BrbChJHcS%2BVW4BgJUNbHEYu1VVEgxVxYUzHYyMwzyTEfmImPOYRJkb%2B%2FfVnGAqbHS0f4SzvkXYSKTJ2STM63Shp2ALvCo%2FdbsxhqD0dekznUtPwHYNL2B75wh93u3EU9VU4lmNG61NfRGGwJ%2Fuoxixho0Q8%3A1763013430959; __csrf=085512a67b4213cb7c06add5f01bc3f8; MUSIC_U=00F447A2297EB52278989971FE428C02590EE19529900ACCCC1FE5199787A3E67E68FDB8A7FE14BAABAE7561E3E13317CDE30A3713A899CFB841919B4F3DF6D5013CF32AE4498805854B576B748B410C52EFD1FAC76D6D5342C3FE17BE19B836F5FC4C214623B2341A14D0F81C35ECDB782B006776ED16F8467B175D48FDAB8313F8FB4E59BBC621A97FD11D099CDE8541C6F823F6EAB88204259E0B559C98232643BE0B44CC153AA78B7ABCB2F7A804692593686D9A9F65EE803A2FB3B79E3A4F142B1339185A68B20F4346EB848A43C73A86B37369181D1E1A39E2B92AE24A5BA7779250E560F52FACF824C4FFC2666B0E34A78BABA524312F4426FF2BED3F85864A5C072E4066656AE178E213C2E22AA7DEA9E3D9949AD0B93D1AFC35231A942A2334D7B565FBC296F24A69A64DE9D54CE0243B1568333F6E15D1624F68B8F46033D3FEE47A1467E95ABBFE5B73A20818C0247CE6970BCE62B03473D8E155F8614A43EFBA0073825EC03653447C0B264DF0C24501C3C674D0D16C5D3573DC8366B958F185E32BDB6207452E475A094D',
    )
  }
})

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
