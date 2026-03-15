import { ref } from 'vue'
import type { IDropdownOption } from '@/types'

interface UseDropdownHydrationOptions {
  fetchSelected?: (ids: any[]) => Promise<IDropdownOption[]>
  /**
   * Returns the current set of options that are already available.
   * Hydration will skip IDs found here.
   */
  getAvailableOptions: () => IDropdownOption[]
  /**
   * Must return true before hydration is allowed to run.
   * Use this to gate hydration until the initial options fetch + delay is done.
   */
  isReady: () => boolean
}

/**
 * Manages hydration of selected values whose labels are not yet in the option list.
 * Defers fetching until isReady() returns true, so it never fires for IDs already
 * present in the initial options batch.
 */
export function useDropdownHydration(opts: UseDropdownHydrationOptions) {
  const selectedBuffer = ref<Map<any, IDropdownOption>>(new Map())
  const isHydrating = ref(false)

  const hydrateSelected = async (val: any) => {
    if (!opts.fetchSelected || val === undefined || val === null) return
    if (!opts.isReady()) return

    let idsToFetch: any[] = []
    if (Array.isArray(val)) {
      idsToFetch = val
    } else if (typeof val === 'object') {
      idsToFetch = Object.values(val)
    } else {
      idsToFetch = [val]
    }

    const available = opts.getAvailableOptions()

    const missingIds = idsToFetch.filter((id) => {
      const inBuffer = selectedBuffer.value.has(id)
      const inOptions = available.some((opt) => (opt.value ?? opt.label) === id)
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
      console.error('[Dropdown] Hydration failed:', e)
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

