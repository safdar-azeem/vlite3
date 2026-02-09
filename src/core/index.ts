import type { App } from 'vue'
import { configState, VLITE_CONFIG_KEY } from './config'
import type { VLiteConfig } from '../types/config.type'

/**
 * Creates the VLite plugin instance.
 *
 * @example
 * // main.ts
 * import { createApp } from 'vue'
 * import { createVLite } from 'vlite3'
 *
 * const app = createApp(App)
 *
 * const vlite = createVLite({
 * services: {
 * upload: async (file) => {
 * // Custom API call here
 * const formData = new FormData()
 * formData.append('file', file)
 * const res = await axios.post('/api/upload', formData)
 * return res.data.url
 * }
 * }
 * })
 *
 * app.use(vlite)
 * app.mount('#app')
 */
export function createVLite(options: VLiteConfig = {}) {
  return {
    install(app: App) {
      // 1. Merge provided options into the reactive state
      if (options) {
        if (options.services) {
          configState.services = { ...configState.services, ...options.services }
        }
      }

      // 2. Provide the config to the application tree
      app.provide(VLITE_CONFIG_KEY, configState)

      // 3. Attach to globalProperties for Options API support (optional)
      app.config.globalProperties.$vlite = configState
    },
  }
}

export * from './config'
