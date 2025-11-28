import { useUserStore } from '@/store'
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { customRef, ref, watch } from 'vue'

import type { LoadingInstance } from 'element-plus'

const loading = customRef((track, trigger) => {
  let count = 0

  return {
    get() {
      track()
      return count > 0
    },
    set(newValue: boolean) {
      count += newValue ? 1 : -1
      count = Math.max(0, count)
      trigger()
    },
  }
})

const loadingInstance = ref<LoadingInstance>()
// 不需要loading的接口
const notLoadingUrl = ['/check/music', '/song/url', '/lyric']

watch(
  () => loading.value,
  (newLoading) => {
    if (newLoading) {
      loadingInstance.value = ElLoading.service({
        fullscreen: true,
        lock: true,
        customClass: 'global-loading-svg',
        background: 'rgba(0, 0, 0, 0.7)',
        svgViewBox: '0 0 24 24',
        svg: `
          <rect width="2.8" height="12" x="1" y="6" fill="#fc3d49">
            <animate
              id="SVGLQdHQe4p"
              attributeName="y"
              begin="0;SVGg3vsIeGm.end-0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="6;1;6"
            />

            <animate
              attributeName="height"
              begin="0;SVGg3vsIeGm.end-0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="12;22;12"
            />
          </rect>

          <rect width="2.8" height="12" x="5.8" y="6" fill="#fc3d49">
            <animate
              attributeName="y"
              begin="SVGLQdHQe4p.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="6;1;6"
            />

            <animate
              attributeName="height"
              begin="SVGLQdHQe4p.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="12;22;12"
            />
          </rect>

          <rect width="2.8" height="12" x="10.6" y="6" fill="#fc3d49">
            <animate
              attributeName="y"
              begin="SVGLQdHQe4p.begin+0.2s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="6;1;6"
            />

            <animate
              attributeName="height"
              begin="SVGLQdHQe4p.begin+0.2s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="12;22;12"
            />
          </rect>

          <rect width="2.8" height="12" x="15.4" y="6" fill="#fc3d49">
            <animate
              attributeName="y"
              begin="SVGLQdHQe4p.begin+0.3s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="6;1;6"
            />

            <animate
              attributeName="height"
              begin="SVGLQdHQe4p.begin+0.3s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="12;22;12"
            />
          </rect>

          <rect width="2.8" height="12" x="20.2" y="6" fill="#fc3d49">
            <animate
              id="SVGg3vsIeGm"
              attributeName="y"
              begin="SVGLQdHQe4p.begin+0.4s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="6;1;6"
            />

            <animate
              attributeName="height"
              begin="SVGLQdHQe4p.begin+0.4s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
              values="12;22;12"
            />
          </rect>
      `,
      })
    } else {
      loadingInstance.value?.close()
    }
  },
)

class NeteaseRequest {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.params = {
          ...config.params,
          timestamp: Date.now(),
        }
        if (!notLoadingUrl.includes(config.url as string)) {
          loading.value = true
        }
        return config
      },
      (error: AxiosError) => {
        ElMessage.error(error.message || '请求失败')
        loading.value = false
        return Promise.reject(error)
      },
    )
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        const userStore = useUserStore()

        if (data.code === 400) {
          ElMessage.error(data.message || '参数错误')
          loading.value = false
          return Promise.reject(data)
        }

        if (data.code === 401) {
          userStore.logout()
          ElMessage.error(data.message || '登录过期，请重新登录')
          loading.value = false
          return Promise.reject(data)
        }

        // 800, 801, 802, 803 为扫码状态，不提示错误
        if (data.code !== 200 && ![800, 801, 802, 803].includes(data.code)) {
          ElMessage.error(data.message || '请求失败')
          loading.value = false
          return Promise.reject(data)
        }

        if (data.code === 'ECONNABORTED') {
          ElMessage.error('请求超时，请稍后再试')
          loading.value = false
          return Promise.reject(data)
        }

        loading.value = false
        return response.data
      },
      (error: AxiosError) => {
        ElMessage.error(error.message || '请求失败')
        loading.value = false

        return Promise.reject(error)
      },
    )
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }
  get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }
}

export default new NeteaseRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
