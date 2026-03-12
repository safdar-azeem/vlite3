import type { App } from 'vue'
import { configState, VLITE_CONFIG_KEY } from './config'
import type { VLiteConfig } from '../types/config.type'

/**
 * Creates the VLite plugin instance.
 */
export function createVLite(options: VLiteConfig = {}) {
  return {
    install(app: App) {
      // 1. Merge provided options into the reactive state
      if (options) {
        if (options.services) {
          configState.services = { ...configState.services, ...options.services }
        }
        if (options.importData) {
          configState.importData = { ...configState.importData, ...options.importData }
        }
        if (options.exportData) {
          configState.exportData = { ...configState.exportData, ...options.exportData }
        }
        if (options.components) {
          configState.components = {
            ...configState.components,
            ...options.components,
            form: {
              ...(configState.components?.form || {}),
              ...(options.components.form || {}),
            },
            price: {
              ...(configState.components?.price || {}),
              ...(options.components.price || {}),
            },
            date: {
              ...(configState.components?.date || {}),
              ...(options.components.date || {}),
            },
          }
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
