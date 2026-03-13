<script setup lang="ts">
import ToolTip from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
import { computed, ref, watch, reactive, toRefs, provide } from 'vue'
import type { IDropdownOptions, IDropdownOption, ButtonProps } from '@/types'
import type { TooltTipPlacement } from 'v-tooltip-lite/types'
import DropdownMenu from './DropdownMenu.vue'
import DropdownTrigger from './DropdownTrigger.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useDropdownIds } from './composables/useDropdownIds'
import { useDropdownSelection } from './composables/useDropdownSelection'
import { useDropdownHydration } from './composables/useDropdownHydration'

const props = withDefaults(
  defineProps<{
    selected?: any
    modelValue?: any
    className?: string
    emptyMessage?: string
    position?: TooltTipPlacement
    closeOnSelect?: boolean
    toggleSelection?: boolean
    options?: (IDropdownOption | string | number)[]
    canCloseOutside?: boolean
    caret?: boolean
    offset?: [number, number]
    isOpen?: boolean
    teleport?: boolean
    selectedIndex?: number | null
    maxHeight?: string
    width?: string
    ignoreClickOutside?: string[]
    menuId?: string
    nestedPosition?: TooltTipPlacement
    nestedOffset?: [number, number]
    showSelectedLabel?: boolean
    selectable?: boolean
    doubleConfirmation?: boolean
    layout?: 'default' | 'grouped'
    columns?: number | string
    // Pagination & Search
    loading?: boolean
    hasMore?: boolean
    searchable?: boolean
    remote?: boolean
    debounceTime?: number
    fetchSelected?: (ids: any[]) => Promise<IDropdownOption[]>
    triggerProps?: ButtonProps
    direction?: 'ltr' | 'rtl'
    isNested?: boolean // Used internally to identify child vs root dropdowns
  }>(),
  {
    options: () => [],
    canCloseOutside: true,
    closeOnSelect: true,
    toggleSelection: true,
    emptyMessage: 'No options found',
    offset: () => [0, 8],
    isOpen: undefined,
    teleport: true,
    selectedIndex: null,
    maxHeight: '300px',
    showSelectedLabel: true,
    selectable: true,
    doubleConfirmation: false,
    layout: 'default',
    columns: 3,
    loading: false,
    hasMore: false,
    searchable: true,
    remote: false,
    debounceTime: 300,
    direction: 'ltr',
    isNested: false,
  }
)

const emit = defineEmits<{
  (e: 'onSelect', payload: { value: any; data?: any; option?: IDropdownOption }): void
  (e: 'update:modelValue', value: any): void
  (e: 'onOpen'): void
  (e: 'onClose'): void
  (e: 'update:isOpen', value: boolean): void
  (e: 'load-more'): void
  (e: 'search', query: string): void
}>()

const showConfirmation = ref(false)
const pendingOption = ref<IDropdownOption | null>(null)
const confirmationConfig = ref<{
  title: string
  description: string
  confirmText: string
  cancelText: string
  variant: 'danger' | 'primary' | 'warning' | 'success' | 'info'
}>({
  title: 'Confirm Selection',
  description: 'Are you sure you want to select this option?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
})

const finalPosition = computed(() => {
  if (props.position) return props.position
  return props.direction === 'rtl' ? 'bottom-end' : 'bottom-start'
})

const finalNestedPosition = computed(() => {
  if (props.nestedPosition) return props.nestedPosition
  return props.direction === 'rtl' ? 'left-start' : 'right-start'
})

const internalIsOpen = ref(props.isOpen || false)
const activeChildrenCount = ref(0)

watch(
  () => props.isOpen,
  (val) => {
    if (val !== undefined) {
      internalIsOpen.value = val
    }
  }
)

const handleVisibilityChange = (val: boolean) => {
  internalIsOpen.value = val
  emit('update:isOpen', val)
  if (val) emit('onOpen')
  else emit('onClose')
}

const handleClose = () => {
  handleVisibilityChange(false)
}

const handleChildToggle = (childIsOpen: boolean) => {
  if (childIsOpen) {
    activeChildrenCount.value++
  } else {
    activeChildrenCount.value = Math.max(0, activeChildrenCount.value - 1)
  }
}

// Provide a context for child components (like Modal/SidePanel) to safely communicate state
provide('dropdown-context', {
  close: handleClose,
  onChildToggle: handleChildToggle,
})

const normalizedPropsOptions = computed<IDropdownOption[]>(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: String(opt) }
    }
    return opt as IDropdownOption
  })
})

const internalOptions = ref<IDropdownOptions>([])

// Track whether the initial options batch has been received
const initialOptionsLoaded = ref(false)
// Track whether the 1-second settle delay has passed after initial load
const hydrationReady = ref(false)

watch(
  normalizedPropsOptions,
  (newVal) => {
    if (!newVal) return

    if (props.remote) {
      const newOptions = [...internalOptions.value]
      newVal.forEach((opt) => {
        const exists = newOptions.some((existing) => {
          if (existing.value !== undefined && opt.value !== undefined) {
            if (typeof existing.value === 'object' && existing.key && opt.key) {
              return existing.key === opt.key && existing.value[existing.key] === opt.value[opt.key]
            }
            return existing.value === opt.value
          }
          return existing.label === opt.label
        })

        if (!exists) {
          newOptions.push(opt)
        }
      })
      internalOptions.value = newOptions
    } else {
      internalOptions.value = newVal
    }

    // Mark initial load done on the first non-empty options batch
    if (!initialOptionsLoaded.value && newVal.length > 0) {
      initialOptionsLoaded.value = true
      // Wait 1 second after options arrive before allowing hydration,
      // so transient loading states fully settle first
      setTimeout(() => {
        hydrationReady.value = true
        // Re-run hydration now that we are ready
        hydrateSelected(currentValue.value)
      }, 10)
    }
  },
  { immediate: true } // Performance fix: Removed deep: true to prevent heavy recursion mapping
)

const combinedOptions = computed(() => {
  const result = [...internalOptions.value]
  const existingValues = new Set(result.map((o) => o.value ?? o.label))

  selectedBuffer.value.forEach((opt, val) => {
    if (!existingValues.has(val)) {
      result.unshift(opt)
      existingValues.add(val)
    }
  })
  return result
})

const { selectedBuffer, isHydrating, hydrateSelected } = useDropdownHydration({
  fetchSelected: props.fetchSelected,
  getAvailableOptions: () => combinedOptions.value,
  isReady: () => hydrationReady.value,
})

const { getAllRecursiveIds } = useDropdownIds()

const selectionProps = reactive({
  ...toRefs(props),
  options: combinedOptions,
})

const { currentValue, selectedLabel, selectOption } = useDropdownSelection(
  selectionProps as any,
  emit
)

const finalIgnoreClickOutside = computed(() => {
  const propsList = props.ignoreClickOutside || []
  const recursiveIds = getAllRecursiveIds(combinedOptions.value)

  return [...new Set([...propsList, ...recursiveIds])]
})

// Watch for modelValue changes and hydrate only after ready
watch(
  () => currentValue.value,
  (newVal) => {
    if (hydrationReady.value) {
      hydrateSelected(newVal)
    }
  },
  { deep: true }
)

const handleOptionSelect = (option: import('@/types').IDropdownOption) => {
  const needsConfirmation = props.doubleConfirmation || !!option.confirmation

  if (needsConfirmation) {
    pendingOption.value = option

    if (typeof option.confirmation === 'object') {
      confirmationConfig.value = {
        title: option.confirmation.title || 'Confirm Selection',
        description:
          option.confirmation.description || 'Are you sure you want to select this option?',
        confirmText: option.confirmation.confirmText || 'Confirm',
        cancelText: option.confirmation.cancelText || 'Cancel',
        variant: option.confirmation.variant || 'primary',
      }
    } else {
      confirmationConfig.value = {
        title: 'Confirm Selection',
        description: `Are you sure you want to select "${option.label}"?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'primary',
      }
    }

    showConfirmation.value = true
    handleClose()
  } else {
    performSelection(option)
    if (props.closeOnSelect) {
      handleClose()
    }
  }
}

const performSelection = (option: import('@/types').IDropdownOption) => {
  const val = option.value ?? option.label
  if (!selectedBuffer.value.has(val)) {
    selectedBuffer.value.set(val, option)
  }

  const finalValues = selectOption(option)

  if (!props.isNested) {
    const leafOption = option._originalOption || option
    const leafValue = leafOption.value ?? leafOption.label

    const path = option._path || [leafOption]

    path.forEach((opt) => {
      if (typeof opt.onSelect === 'function') {
        opt.onSelect({
          value: leafValue,
          option: opt,
          data: combinedOptions.value || [],
          values: finalValues,
        })
      }
    })
  }
}

const confirmSelection = () => {
  if (pendingOption.value) {
    performSelection(pendingOption.value)
    pendingOption.value = null
    showConfirmation.value = false
  }
}

const cancelSelection = () => {
  pendingOption.value = null
  showConfirmation.value = false
}
</script>

<template>
  <div class="relative inline-block text-left" :style="{ direction: direction }">
    <ToolTip
      content=""
      trigger="click"
      :arrow="false"
      :teleport="teleport"
      :offset="offset"
      :placement="finalPosition"
      :isOpen="internalIsOpen"
      :keepAlive="activeChildrenCount > 0"
      :menuId="menuId"
      :ignoreClickOutside="finalIgnoreClickOutside"
      class="w-full"
      :className="'dropdown ' + (className || '')"
      @onShow="$emit('onOpen')"
      @onHide="$emit('onClose')"
      @update:isOpen="handleVisibilityChange"
      triggerClass="w-full"
      :styles="{ padding: '0' }">
      <template #trigger="{ isOpen }">
        <slot name="trigger" v-bind="{ selectedLabel, isOpen }">
          <DropdownTrigger
            :selected-label="selectedLabel"
            :is-open="isOpen"
            :direction="direction"
            :triggerProps="triggerProps"
            class="w-full" />
        </slot>
      </template>

      <template #default>
        <slot />

        <DropdownMenu
          v-if="
            normalizedPropsOptions.length ||
            combinedOptions.length ||
            $slots.menu ||
            $slots.item ||
            remote ||
            searchable
          "
          :options="normalizedPropsOptions"
          :cachedOptions="combinedOptions"
          :class="className"
          :selected="currentValue"
          :selectedIndex="selectedIndex"
          :maxHeight="maxHeight"
          :nestedPosition="finalNestedPosition"
          :nestedOffset="nestedOffset"
          :selectable="selectable"
          :direction="direction"
          :layout="layout"
          :columns="columns"
          :loading="loading || isHydrating"
          :hasMore="hasMore"
          :searchable="searchable"
          :remote="remote"
          :debounceTime="debounceTime"
          @select="handleOptionSelect"
          @close="handleClose"
          @load-more="$emit('load-more')"
          @search="(q) => $emit('search', q)">
          <template #menu v-if="$slots.menu">
            <slot name="menu" />
          </template>

          <template #item="slotProps" v-if="$slots.item">
            <slot name="item" v-bind="slotProps" />
          </template>

          <template #header v-if="$slots.header">
            <slot name="header" />
          </template>

          <template #footer v-if="$slots.footer">
            <slot name="footer" />
          </template>
        </DropdownMenu>
      </template>
    </ToolTip>

    <ConfirmationModal
      :show="showConfirmation"
      :title="confirmationConfig.title"
      :description="confirmationConfig.description"
      :confirm-text="confirmationConfig.confirmText"
      :cancel-text="confirmationConfig.cancelText"
      :variant="confirmationConfig.variant"
      @confirm="confirmSelection"
      @cancel="cancelSelection" />
  </div>
</template>
