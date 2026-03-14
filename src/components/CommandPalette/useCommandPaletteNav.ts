import { ref, onUnmounted, type Ref } from 'vue'
import { nextTick } from 'vue'
import type { FlatList, CommandPaletteItem } from './types'

export function useCommandPaletteNav(options: {
  flatList: Ref<FlatList>
  listRef: Ref<HTMLElement | null>
  onExecute: (item: CommandPaletteItem) => void
  onClose: () => void
}) {
  const activeIndex = ref(0)

  // -------------------------------------------------------------------------
  // Pointer-events lock during keyboard navigation
  // Prevents mouseenter from overriding the keyboard-selected item while the
  // user is pressing arrow keys and the cursor happens to be over the list.
  // -------------------------------------------------------------------------

  const isPointerLocked = ref(false)
  let pointerLockTimer: ReturnType<typeof setTimeout> | null = null

  const lockPointerEvents = () => {
    isPointerLocked.value = true
    if (pointerLockTimer) clearTimeout(pointerLockTimer)
    // Re-enable 200 ms after the last keydown — enough to clear hover flicker
    pointerLockTimer = setTimeout(() => {
      isPointerLocked.value = false
    }, 200)
  }

  // -------------------------------------------------------------------------
  // rAF-throttled mouseenter
  // Coalesces rapid hover events to at most one update per animation frame
  // instead of 60+ per second as the mouse sweeps across items.
  // -------------------------------------------------------------------------

  let hoverRaf: number | null = null

  const handleItemMouseenter = (index: number) => {
    if (isPointerLocked.value) return
    if (hoverRaf !== null) cancelAnimationFrame(hoverRaf)
    hoverRaf = requestAnimationFrame(() => {
      activeIndex.value = index
      hoverRaf = null
    })
  }

  // -------------------------------------------------------------------------
  // Scroll active item into view without layout thrashing
  // -------------------------------------------------------------------------

  const scrollActiveIntoView = () => {
    nextTick(() => {
      const el = options.listRef.value?.querySelector('[data-active="true"]') as HTMLElement | null
      if (!el) return
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }

  // -------------------------------------------------------------------------
  // Keyboard handler
  // -------------------------------------------------------------------------

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      options.onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      lockPointerEvents()
      activeIndex.value = Math.min(activeIndex.value + 1, options.flatList.value.total - 1)
      scrollActiveIntoView()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      lockPointerEvents()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      scrollActiveIntoView()
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      for (const group of options.flatList.value.groups) {
        for (const row of group.rows) {
          if (row.index === activeIndex.value) {
            options.onExecute(row.item)
            return
          }
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  onUnmounted(() => {
    if (hoverRaf !== null) cancelAnimationFrame(hoverRaf)
    if (pointerLockTimer) clearTimeout(pointerLockTimer)
  })

  return { activeIndex, isPointerLocked, handleKeydown, handleItemMouseenter }
}
