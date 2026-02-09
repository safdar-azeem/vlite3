import { reactive, inject, type InjectionKey } from 'vue'
import type { VLiteConfig } from '../types/config.type'

/**
 * Unique symbol for injecting the VLite configuration.
 */
export const VLITE_CONFIG_KEY: InjectionKey<VLiteConfig> = Symbol('vlite-config')

/**
 * Default configuration state.
 */
const defaultConfig: VLiteConfig = {
  services: {},
}

/**
 * Global reactive configuration state.
 * This acts as a singleton fallback if inject() is used outside a component
 * or if the plugin wasn't installed (though installation is recommended).
 */
export const configState = reactive<VLiteConfig>({ ...defaultConfig })

/**
 * Helper to update the global configuration.
 */
export function updateConfig(updates: Partial<VLiteConfig>) {
  Object.assign(configState, updates)
}

/**
 * Composable to access the VLite configuration.
 * It attempts to inject from the Vue context first, falling back to the global singleton.
 */
export function useVLiteConfig() {
  return inject(VLITE_CONFIG_KEY, configState)
}

