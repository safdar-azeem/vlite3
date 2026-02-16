<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
  nextTick,
  toRef,
} from 'vue'
import Icon from '../Icon.vue'
import type { IDropdownOptions, IDropdownOption } from '@/types'
import Input from '../Input.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownBooleanItem from './DropdownBooleanItem.vue'
import DropdownGroupedLayout from './DropdownGroupedLayout.vue'
import { useDropdownNavigation } from './composables/useDropdownNavigation'
import { useDropdownIds } from './composables/useDropdownIds'

// Async import for recursion
const Dropdown = defineAsyncComponent(() => import('./Dropdown.vue'))

interface Props {
  options?: IDropdownOptions
  cachedOptions?: IDropdownOptions
  selected?: any
  selectedIndex?: number | null
  class?: string
  maxHeight?: string
  nestedPosition?: any
  nestedOffset?: [number, number]
  selectable?: boolean
  layout?: 'default' | 'grouped'
  columns?: number | string
  // Pagination & Search
  loading?: boolean
  hasMore?: boolean
  searchable?: boolean
  remote?: boolean
  direction?: 'ltr' | 'rtl'
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  cachedOptions: () => [],
  class: '',
  maxHeight: '300px',
  selectedIndex: null,
  nestedPosition: 'right-start',
  nestedOffset: () => [0, -5],
  selectable: true,
  layout: 'default',
  columns: 3,
  loading: false,
  hasMore: false,
  searchable: true,
  remote: false,
  direction: 'ltr',
})

const emit = defineEmits<{
  (e: 'select', option: IDropdownOption): void
  (e: 'close'): void
  (e: 'load-more'): void
  (e: 'search', query: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const { getMenuId, getAllRecursiveIds } = useDropdownIds()

// --- Search Logic ---
const showSearch = computed(() => {
  // If remote, respect searchable prop. If local, use existing > 10 logic or force searchable.
  if (props.remote) return props.searchable
  return props.searchable && (props.options?.length || 0) > 9
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (newQuery) => {
  if (props.remote) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (newQuery) {
        emit('search', newQuery)
      }
    }, 100)
  }
})

// --- Scroll / Pagination Logic ---
const handleScroll = (e: Event) => {
  const el = e.target as HTMLElement
  // Threshold: 20px from bottom (or 50px?)
  const threshold = 50
  const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold

  if (isNearBottom && props.hasMore && !props.loading) {
    emit('load-more')
  }
}

const handleSelect = (option: IDropdownOption, index?: number) => {
  if (option.disabled) return
  emit('select', option)
}

const {
  focusedIndex,
  isKeyboardMode,
  filteredOptions: navFilteredOptions, // rename
  handleKeyDown,
  handleMouseMove,
  onMouseEnterItem,
  scrollToIndex,
} = useDropdownNavigation({
  options: toRef(props, 'options'),
  searchQuery,
  containerRef,
  emit: (event: string, ...args: any[]) => (emit as any)(event, ...args),
  handleSelect: (opt, idx) => handleSelect(opt, idx),
})

// Fix for Remote Filtering:
// If remote is true:
//  - If Query is empty: Show Cached Options (Full History)
//  - If Query exists: Show Props.Options (Current Search Results)
const filteredOptions = computed(() => {
  if (props.remote) {
    if (!searchQuery.value) {
      return props.cachedOptions.length ? props.cachedOptions : props.options
    }
    return props.options
  }
  return navFilteredOptions.value
})

// Recursive Helper
const getChildSelected = (option: IDropdownOption) => {
  if (!props.selected || typeof props.selected !== 'object') return undefined
  if (option.key && option.key in props.selected) {
    return props.selected[option.key]
  }
  return undefined
}

const isOptionSelected = (option: IDropdownOption) => {
  if (option.disabled) return false

  if (Array.isArray(props.selected)) {
    return props.selected.includes(option.value)
  }

  if (props.selected && typeof props.selected === 'object') {
    if (option.key) {
      return props.selected[option.key] === option.value
    }
    return props.selected === option.value
  }
  return props.selected === option.value
}

// Boolean option helpers
const getBooleanValue = (option: IDropdownOption): boolean => {
  if (!option.key || !props.selected || typeof props.selected !== 'object') {
    return false
  }
  return !!props.selected[option.key]
}

const handleBooleanChange = (value: boolean, option: IDropdownOption) => {
  if (!option.key) return

  const virtualOption: IDropdownOption = {
    label: option.label,
    value: value,
    key: option.key,
    data: option.data,
  }
  emit('select', virtualOption)
}

const handleRecursiveSelect = (
  parentOption: IDropdownOption,
  payload: { value: any; data?: any }
) => {
  let valueToEmit = payload.value

  if (parentOption.key) {
    valueToEmit = { [parentOption.key]: valueToEmit }
  }

  const virtualOption: IDropdownOption = {
    label: parentOption.label,
    value: valueToEmit,
    data: payload.data,
    key: parentOption.key,
  }

  emit('select', virtualOption)
}

// Initial Scroll Logic
const scrollToSelected = async () => {
  await nextTick()
  let targetIndex = -1

  // Scroll logic mainly for 'default' linear list.
  // For grouped, we might need different logic, but skip for now as 'scrollToIndex' assumes linear list refs.
  if (props.layout === 'grouped') return

  if (props.selectedIndex !== null && props.selectedIndex >= 0) {
    targetIndex = props.selectedIndex
  } else if (props.selected !== undefined && typeof props.selected !== 'object') {
    targetIndex = props.options.findIndex((opt) => opt.value === props.selected)
  }

  if (targetIndex !== -1) {
    scrollToIndex(targetIndex)
  }
}

watch(
  () => filteredOptions.value,
  () => {
    focusedIndex.value = -1
  }
)

onMounted(() => {
  scrollToSelected()
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="dropdown-menu w-full min-w-[150px] flex flex-col" :dir="direction">
    <div v-if="showSearch" class="bg-body border-b mb-1 z-10 rounded-t-md shrink-0">
      <Input
        v-model="searchQuery"
        placeholder="Search..."
        icon="lucide:search"
        size="sm"
        class="font-medium!"
        variant="transparent"
        :show-clear-button="false" />
    </div>

    <div v-if="$slots.header" class="shrink-0">
      <slot name="header" />
    </div>

    <div
      ref="containerRef"
      tabindex="0"
      role="menu"
      v-if="props?.options.length > 0 || $slots.menu"
      :class="[
        'w-full p-1 space-y-0.5 overflow-y-auto overflow-x-hidden focus:outline-none flex-1',
        props.class,
      ]"
      :style="{ maxHeight: props.maxHeight }"
      @mousemove="handleMouseMove"
      @scroll="handleScroll">
      <div
        v-if="filteredOptions.length === 0 && options?.length > 0 && !loading"
        class="px-2 py-6 text-center text-sm text-muted-foreground">
        No options found
      </div>

      <template v-if="layout === 'grouped'">
        <DropdownGroupedLayout
          :options="filteredOptions"
          :selected="selected"
          :selectable="selectable"
          :columns="columns"
          @select="handleSelect" />
      </template>

      <template v-else>
        <template v-for="(option, index) in filteredOptions" :key="index">
          <div v-if="option.label === '---'" class="h-px bg-border my-1 mx-1" />

          <DropdownBooleanItem
            v-else-if="option.data?.isBoolean"
            :option="option"
            :value="getBooleanValue(option)"
            :focused="isKeyboardMode && focusedIndex === index"
            @change="handleBooleanChange"
            @mouseenter="onMouseEnterItem(index)" />

          <template v-else-if="option.children && option.children.length > 0">
            <Dropdown
              :position="option.position || props.nestedPosition"
              :offset="option.offset || props.nestedOffset"
              class="w-full"
              :options="option.children"
              :selected="getChildSelected(option)"
              :menuId="getMenuId(option)"
              :nestedPosition="props.nestedPosition"
              :nestedOffset="props.nestedOffset"
              :selectable="props.selectable"
              :ignoreClickOutside="getAllRecursiveIds(option.children)"
              :direction="direction"
              @onSelect="(payload: any) => handleRecursiveSelect(option, payload)">
              <template #trigger>
                <div
                  data-dropdown-item
                  class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none transition-colors justify-between w-full"
                  :class="[
                    isKeyboardMode && focusedIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                    option.disabled ? 'opacity-50 cursor-not-allowed' : '',
                  ]"
                  @mouseenter="onMouseEnterItem(index)">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <Icon
                      v-if="option.icon"
                      :icon="option.icon"
                      class="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                    <span class="truncate">{{ option.label }}</span>
                  </div>
                  <Icon
                    :icon="direction === 'rtl' ? 'lucide:chevron-left' : 'lucide:chevron-right'"
                    class="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                </div>
              </template>
            </Dropdown>
          </template>

          <DropdownItem
            v-else
            :option="option"
            :index="index"
            :selected="isOptionSelected(option)"
            :focused="isKeyboardMode && focusedIndex === index"
            :selectable="selectable"
            @click="handleSelect(option, index)"
            @mouseenter="onMouseEnterItem(index)">
            <template #default="slotProps" v-if="$slots.item">
              <slot name="item" v-bind="slotProps" />
            </template>
          </DropdownItem>
        </template>
      </template>

      <div v-if="loading" class="flex justify-center py-2">
        <Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin text-muted-foreground" />
      </div>

      <slot name="menu" />
    </div>

    <div v-if="$slots.footer" class="shrink-0 border-t mt-1 pt-1">
      <slot name="footer" />
    </div>
  </div>
</template>
