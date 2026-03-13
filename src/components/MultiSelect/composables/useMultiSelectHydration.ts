import { ref, watch } from 'vue'
import type { IDropdownOption } from '@/types'

interface UseMultiSelectHydrationOptions {
  getValues: () => any[]
  getOptions: () => IDropdownOption[]
  fetchSelected?: (ids: any[]) => Promise<IDropdownOption[]>
  isInitialLoadDone: () => boolean
}

/**
 * Handles hydration of selected values that are not present in the current options list.
 * Waits until initial options load is complete before checking for missing IDs.
 */
export function useMultiSelectHydration(opts: UseMultiSelectHydrationOptions) {
  const selectedBuffer = ref<Map<any, IDropdownOption>>(new Map())
  const isHydrating = ref(false)

  const hydrateSelected = async (values: any[]) => {
    if (!opts.fetchSelected || !values?.length) return
    if (!opts.isInitialLoadDone()) return

    const currentOptions = opts.getOptions()

    // Only fetch IDs that are missing from BOTH buffer and current options
    const missingIds = values.filter((v) => {
      const inBuffer = selectedBuffer.value.has(v)
      const inOptions = currentOptions.some((opt) => (opt.value ?? opt.label) === v)
      return !inBuffer && !inOptions
    })

    if (!missingIds.length) return

    isHydrating.value = true
    try {
      const fetched = await opts.fetchSelected(missingIds)
      fetched.forEach((opt) => {
        selectedBuffer.value.set(opt.value ?? opt.label, opt)
      })
    } catch (e) {
      console.error('[MultiSelect] Hydration failed:', e)
    } finally {
      isHydrating.value = false
    }
  }

  return {
    selectedBuffer,
    isHydrating,
    hydrateSelected,
  }
}
