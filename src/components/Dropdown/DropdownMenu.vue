<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Icon from '../Icon.vue'
import type { IDropdownOptions, IDropdownOption } from '@/types'
import Input from '../Input.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownBooleanItem from './DropdownBooleanItem.vue'
import DropdownGroupedLayout from './DropdownGroupedLayout.vue'
import { useDropdownNavigation } from './composables/useDropdownNavigation'
import { useDropdownIds } from './composables/useDropdownIds'
import { $t } from '@/utils/i18n'

import Dropdown from './Dropdown.vue'

interface Props {
  options?: (IDropdownOption | string | number)[]
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
  loading?: boolean
  hasMore?: boolean
  searchable?: boolean
  remote?: boolean
  debounceTime?: number
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
  debounceTime: 300,
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

const tEmpty = computed(() => {
  const res = $t('vlite.dropdown.empty')
  return res !== 'vlite.dropdown.empty' ? res : 'No options found'
})

const tSearch = computed(() => {
  const res = $t('vlite.dropdown.search')
  return res !== 'vlite.dropdown.search' ? res : 'Search...'
})

// Normalize string options into option objects internally
const normalizedOptions = computed<IDropdownOption[]>(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: String(opt) }
    }
    return opt as IDropdownOption
  })
})

const showSearch = computed(() => {
  if (props.remote) return props.searchable
  return props.searchable && (normalizedOptions.value.length || 0) > 9
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (newQuery) => {
  if (props.remote) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (newQuery !== undefined) {
        emit('search', newQuery)
      }
    }, props.debounceTime)
  }
})

const handleScroll = (e: Event) => {
  const el = e.target as HTMLElement
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
  filteredOptions: navFilteredOptions,
  handleKeyDown,
  handleMouseMove,
  onMouseEnterItem,
  scrollToIndex,
} = useDropdownNavigation({
  options: normalizedOptions,
  searchQuery,
  containerRef,
  emit: (event: string, ...args: any[]) => (emit as any)(event, ...args),
  handleSelect: (opt, idx) => handleSelect(opt, idx),
})

const filteredOptions = computed(() => {
  if (props.remote) {
    if (!searchQuery.value) {
      return props.cachedOptions.length ? props.cachedOptions : normalizedOptions.value
    }
    return normalizedOptions.value
  }
  return navFilteredOptions.value
})

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
    _originalOption: option,
    _path: [option],
  }
  emit('select', virtualOption)
}

const handleRecursiveSelect = (
  parentOption: IDropdownOption,
  payload: { value: any; data?: any; option?: IDropdownOption }
) => {
  let valueToEmit = payload.value

  if (parentOption.key) {
    valueToEmit = { [parentOption.key]: valueToEmit }
  }

  // Aggregate the path of traversal
  const childOption = payload.option
  const childPath =
    childOption?._path || [childOption?._originalOption || childOption].filter(Boolean)

  const virtualOption: IDropdownOption = {
    label: parentOption.label,
    value: valueToEmit,
    data: payload.data,
    key: parentOption.key,
    _originalOption: childOption?._originalOption || childOption,
    _path: [parentOption, ...childPath] as IDropdownOption[],
  }

  emit('select', virtualOption)
}

const scrollToSelected = async () => {
  await nextTick()
  let targetIndex = -1

  if (props.layout === 'grouped') return

  if (props.selectedIndex !== null && props.selectedIndex >= 0) {
    targetIndex = props.selectedIndex
  } else if (props.selected !== undefined && typeof props.selected !== 'object') {
    targetIndex = normalizedOptions.value.findIndex((opt) => opt.value === props.selected)
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

const getDisplayLabel = (option: IDropdownOption) =>
  option.labelI18n ? $t(option.labelI18n) : option.label

/**
 * Determines whether to show the chevron for a given option with children.
 * Defaults to true unless explicitly set to false via option.showChevron.
 */
const shouldShowChevron = (option: IDropdownOption): boolean => {
  return option.showChevron !== false
}
</script>

<template>
  <div class="dropdown-menu w-full min-w-[150px] flex flex-col" :dir="direction">
    <div v-if="showSearch" class="bg-body border-b z-10 rounded-t-md shrink-0">
      <Input
        v-model="searchQuery"
        :placeholder="tSearch"
        icon="lucide:search"
        size="sm"
        :autofocus="true"
        class="font-medium!"
        input-class="-ml-1"
        variant="transparent"
        icon-class="h-3.5! w-3.5!"
        :show-clear-button="false" />
    </div>

    <div v-if="$slots.header" class="shrink-0">
      <slot name="header" />
    </div>

    <div
      ref="containerRef"
      :tabindex="showSearch ? -1 : 0"
      role="menu"
      v-if="normalizedOptions.length > 0 || $slots.menu"
      :class="[
        'w-full p-1 space-y-0.5 overflow-y-auto overflow-x-hidden focus:outline-none flex-1 scrollbar-thin',
        props.class,
      ]"
      :style="{ maxHeight: props.maxHeight }"
      @mousemove="handleMouseMove"
      @scroll="handleScroll">
      <div
        v-if="filteredOptions.length === 0 && normalizedOptions.length > 0 && !loading"
        class="px-2 py-6 text-center text-sm text-muted-foreground">
        {{ tEmpty }}
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
              :is-nested="true"
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
                  :tabindex="0"
                  data-dropdown-item
                  class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none transition-colors justify-between w-full focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1"
                  :class="[
                    isKeyboardMode && focusedIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                    option.disabled ? 'opacity-50 cursor-not-allowed' : '',
                    option.triggerClass || option.class || '',
                  ]"
                  @mouseenter="onMouseEnterItem(index)">
                  <div class="flex items-center flex-1 min-w-0">
                    <Icon
                      v-if="option.icon || option.emoji"
                      :icon="option.icon"
                      :emoji="option.emoji"
                      class="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                    <span class="truncate">{{ getDisplayLabel(option) }}</span>
                  </div>
                  <Icon
                    v-if="shouldShowChevron(option)"
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

    <div v-if="$slots.footer" class="shrink-0">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/*
  Promote the dropdown menu to its own compositor layer.
  This isolates hover and focus repaints on child items so they
  never trigger a repaint or re-composite of the parent overlay or viewport.
*/
.dropdown-menu {
  will-change: transform;
  contain: layout style;
}
</style>
