import type { Component } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { VliteScreen } from './VliteScreen'
import type { RenderVliteOptions } from './types'

/**
 * Mount a vlite3 component and return a fluent `VliteScreen` wrapper.
 *
 * This is the primary entry point for testing vlite3 components.
 * It wraps `@vue/test-utils` `mount()` and returns a `VliteScreen`
 * that understands vlite3's component conventions.
 *
 * **Important**: This function is framework-agnostic. It does NOT inject
 * any Apollo client, authentication, or ERP-specific configuration.
 * Pass those via the `global.plugins` option.
 *
 * @example
 * ```typescript
 * import { renderVlite } from 'vlite3/test'
 * import { apollo } from '@/config/apollo.config'
 * import MyForm from './MyForm.vue'
 *
 * const screen = renderVlite(MyForm, {
 *   props: { data: {} },
 *   global: { plugins: [apollo] },
 * })
 *
 * await screen.fillForm(schema, mockData)
 * await screen.triggerSubmit()
 * ```
 */
export async function renderVlite(
  component: Component,
  options?: RenderVliteOptions
): Promise<VliteScreen> {
  const mountDelay = options?.mountDelay ?? 250

  const wrapper = mount(component, {
    props: options?.props,
    global: options?.global,
  })

  // Wait for the component to fully mount and any async initialization
  await flushPromises()
  if (mountDelay > 0) {
    await new Promise((r) => setTimeout(r, mountDelay))
  }

  return new VliteScreen(wrapper)
}
