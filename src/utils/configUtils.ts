import { useVLiteConfig } from '../core/config'
import type { VLiteConfig } from '../types/config.type'

/**
 * Retrieves the global configuration for a specific component from createVLite configuration.
 * If no configuration is provided globally, it returns null.
 * 
 * @param componentKey - The key of the component configured in VLiteConfig.components
 * @returns The component configuration object or null
 */
export function getComponentConfig<K extends keyof NonNullable<VLiteConfig['components']>>(
  componentKey: K
): NonNullable<VLiteConfig['components']>[K] | null {
  const config = useVLiteConfig()
  return config?.components?.[componentKey] ?? null
}
