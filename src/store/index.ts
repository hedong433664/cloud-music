import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import type { App } from 'vue'

export { useUserStore } from './models/user'
export { usePlayerStore } from './models/player'

export function setupStore(app: App<Element>) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
