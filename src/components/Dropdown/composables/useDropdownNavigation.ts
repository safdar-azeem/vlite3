import { ref, computed, nextTick, type Ref } from 'vue'
import type { IDropdownOption, IDropdownOptions } from '@/types'

interface UseDropdownNavigationProps {
  options: Ref<IDropdownOptions>
  searchQuery: Ref<string>
  containerRef: Ref<HTMLElement | null>
  emit: (event: 'select' | 'close', ...args: any[]) => void
  handleSelect: (option: IDropdownOption, index: number) => void
}

export function useDropdownNavigation(props: UseDropdownNavigationProps) {
  const focusedIndex = ref(-1)
  const isKeyboardMode = ref(false)

  const filteredOptions = computed(() => {
    const opts = props.options.value
    if (!props.searchQuery.value) return opts

    const query = props.searchQuery.value.toLowerCase()
    return opts.filter((option) => option.label.toLowerCase().includes(query))
  })

  const scrollToIndex = (index: number) => {
    if (!props.containerRef.value || index < 0) return

    const items = props.containerRef.value.querySelectorAll('[data-dropdown-item]')
    const targetItem = items[index] as HTMLElement

    if (targetItem) {
      targetItem.scrollIntoView({ block: 'nearest' })
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const visibleOptions = filteredOptions.value

    if (visibleOptions.length === 0) return

    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      isKeyboardMode.value = true
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        e.stopPropagation()
        if (focusedIndex.value < visibleOptions.length - 1) {
          focusedIndex.value++
        } else {
          focusedIndex.value = 0
        }
        scrollToIndex(focusedIndex.value)
        break

      case 'ArrowUp':
        e.preventDefault()
        e.stopPropagation()
        if (focusedIndex.value > 0) {
          focusedIndex.value--
        } else if (focusedIndex.value === -1) {
          focusedIndex.value = visibleOptions.length - 1
        } else {
          focusedIndex.value = visibleOptions.length - 1
        }
        scrollToIndex(focusedIndex.value)
        break

      case 'Enter':
        e.preventDefault()
        e.stopPropagation()
        if (focusedIndex.value >= 0 && focusedIndex.value < visibleOptions.length) {
          const option = visibleOptions[focusedIndex.value]
          // If it's a recursive item, Enter might not open it correctly unless we programmatically open the generic Dropdown?
          // For now, strictly handle leaf selection.
          if (!option.children) {
            props.handleSelect(option, focusedIndex.value)
          }
        }
        break

      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        props.emit('close')
        break
    }
  }

  const handleMouseMove = () => {
    if (isKeyboardMode.value) {
      isKeyboardMode.value = false
    }
  }

  const onMouseEnterItem = (index: number) => {
    focusedIndex.value = index
  }

  return {
    focusedIndex,
    isKeyboardMode,
    filteredOptions,
    handleKeyDown,
    handleMouseMove,
    onMouseEnterItem,
    scrollToIndex,
  }
}
