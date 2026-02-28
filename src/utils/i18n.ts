import { configState } from '@/core/config'

/**
 * Global translation function.
 * Uses the globally registered translation handler (e.g., vue-i18n) if configured.
 * Falls back to returning the key if no translation service is setup.
 *
 * This can be used safely inside or outside of Vue components.
 */
export const $t = (key: string, ...args: any[]): string => {
  if (configState?.services?.t) {
    return configState.services.t(key, ...args)
  }
  return key
}
