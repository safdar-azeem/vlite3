<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '../Icon.vue'
import { Dropdown, DropdownMenu } from '@/components/Dropdown'
import Badge from '@/components/Badge.vue'
import type { IDropdownOption } from '@/types'
import { $t } from '@/utils/i18n'
import { useMultiSelectHydration } from './composables/useMultiSelectHydration'

// Props
interface Props {
  modelValue?: any[]
  options?: (IDropdownOption | string | number)[]
  placeholder?: string
  placeholderI18n?: string
  emptyMessage?: string
  searchEmptyMessage?: string
  disabled?: boolean
  readonly?: boolean
  searchable?: boolean

  variant?: 'default' | 'outline' | 'solid' | 'floating' | string
  size?: 'sm' | 'md' | 'lg'
  maxVisible?: number
  loading?: boolean
  hasMore?: boolean
  remote?: boolean
  debounceTime?: number
  fetchSelected?: (ids: any[]) => Promise<IDropdownOption[]>
  layout?: 'default' | 'grouped'
  showControls?: boolean
  wrap?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  disabled: false,
  readonly: false,
  searchable: true,
  emptyMessage: 'No options found',
  variant: 'outline',
  size: 'md',
  maxVisible: 3,
  loading: false,
  hasMore: false,
  remote: false,
  debounceTime: 300,
  layout: 'default',
  showControls: true,
  wrap: true,
  rounded: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
  (e: 'load-more'): void
  (e: 'search', query: string): void
}>()

const isOpen = ref(false)

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) return $t(props.placeholderI18n)
  if (props.placeholder) return props.placeholder
  const res = $t('vlite.multiSelect.placeholder')
  return res !== 'vlite.multiSelect.placeholder' ? res : 'Select items...'
})

// Normalize incoming options into object format for rendering logic consistency
const normalizedOptions = computed<IDropdownOption[]>(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: String(opt) }
    }
    return opt as IDropdownOption
  })
})

// Track whether the initial options batch has settled (loaded + 1s delay)
const initialOptionsLoaded = ref(false)
const hydrationReady = ref(false)

watch(
  normalizedOptions,
  (newVal) => {
    if (!initialOptionsLoaded.value && newVal.length > 0) {
      initialOptionsLoaded.value = true
      // Wait 1 second after initial options arrive before allowing hydration
      setTimeout(() => {
        hydrationReady.value = true
        // Re-run hydration now that we are ready
        hydration.hydrateSelected(props.modelValue || [])
      }, 10)
    }
  },
  { immediate: true }
)

// The combined list of options for the current view
const combinedOptions = computed(() => {
  const result = [...normalizedOptions.value]
  const existingValues = new Set(result.map((o) => o.value ?? o.label))

  hydration.selectedBuffer.value.forEach((opt, val) => {
    if (!existingValues.has(val)) {
      result.unshift(opt)
      existingValues.add(val)
    }
  })
  return result
})

// --- HYDRATION ---
const hydration = useMultiSelectHydration({
  fetchSelected: props.fetchSelected,
  getValues: () => props.modelValue || [],
  getOptions: () => combinedOptions.value,
  isInitialLoadDone: () => hydrationReady.value,
})

// Watch for modelValue changes and hydrate only after ready
watch(
  () => props.modelValue,
  (newVal) => {
    if (hydrationReady.value) {
      hydration.hydrateSelected(newVal || [])
    }
  },
  { deep: true }
)
// -----------------------------------------

// Compute selections based on combined Options so labels resolve properly even if off-page
const selectedOptions = computed(() => {
  return combinedOptions.value.filter((opt) => {
    const val = opt.value ?? opt.label
    return props.modelValue.includes(val)
  })
})

const visibleSelections = computed(() => {
  return selectedOptions.value.slice(0, props.maxVisible)
})

const hiddenCount = computed(() => {
  return selectedOptions.value.length - props.maxVisible
})

const handleSelect = (option: IDropdownOption) => {
  if (props.disabled || props.readonly) return // Security check

  const val = option.value ?? option.label

  // Save to buffer immediately so it persists across searches
  if (!hydration.selectedBuffer.value.has(val)) {
    hydration.selectedBuffer.value.set(val, option)
  }

  const newValue = [...props.modelValue]
  const index = newValue.indexOf(val)

  if (index === -1) {
    newValue.push(val)
  } else {
    newValue.splice(index, 1)
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const removeOption = (value: any) => {
  if (props.disabled || props.readonly) return // Security check

  const newValue = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const clearAll = () => {
  if (props.disabled || props.readonly) return // Security check

  emit('update:modelValue', [])
  emit('change', [])
}

// Styling
const triggerClasses = computed(() => {
  const roundedClass = props.rounded === 'none' ? 'rounded-none' : `rounded-${props.rounded}`
  const spacingClass = props.variant === 'transparent' ? 'px-2 py-0' : 'px-3 py-1.5'
  const heightClass = props.variant === 'transparent' ? 'h-full min-h-[40px]' : 'min-h-[40px]'

  return [
    `flex items-center justify-between w-full ${spacingClass} ${heightClass} ${roundedClass} border text-sm transition-colors outline-none`,
    props.disabled
      ? 'opacity-50 cursor-not-allowed bg-muted'
      : props.readonly
        ? `cursor-default ${props.variant === 'transparent' || props.variant === 'floating' ? 'bg-transparent text-foreground' : 'bg-background'}`
        : `cursor-pointer ${
            props.variant === 'floating'
              ? 'bg-transparent text-foreground'
              : props.variant === 'transparent'
                ? 'bg-transparent text-foreground'
                : 'bg-background hover:bg-gray-50/70'
          }`,
    props.variant === 'outline' || props.variant === 'floating'
      ? 'border-input focus-visible:ring-1 focus-visible:ring-primary'
      : props.variant === 'transparent'
        ? 'border-transparent'
        : 'border-transparent bg-muted',
    isOpen.value && props.variant !== 'transparent'
      ? 'border-primary/20 ring-1 ring-primary/20'
      : '',
  ].join(' ')
})

const badgeSize = computed(() => (props.size === 'sm' ? 'xs' : 'sm'))
</script>

<template>
  <Dropdown
    v-model:isOpen="isOpen"
    :close-on-select="false"
    :selectable="true"
    :searchable="false"
    :remote="false"
    :disabled="disabled || readonly">
    <template #trigger>
      <div
        :class="triggerClasses"
        :tabindex="disabled || readonly ? -1 : 0"
        @keydown.enter.prevent="!(disabled || readonly) && (isOpen = !isOpen)"
        @keydown.space.prevent="!(disabled || readonly) && (isOpen = !isOpen)"
        :data-testid="$attrs['data-testid'] || ($attrs.name ? `multiselect-${$attrs.name}` : 'multiselect')">
        <div
          class="flex gap-1.5 items-center flex-1 min-w-0"
          :class="[wrap ? 'flex-wrap py-0.5' : 'flex-nowrap overflow-hidden py-1']">
          <span v-if="selectedOptions.length === 0" class="text-muted-foreground pl-0.5 truncate">
            {{ displayPlaceholder }}
          </span>

          <template v-else>
            <Badge
              v-for="opt in visibleSelections"
              :key="opt.value"
              :variant="variant === 'transparent' ? 'outline' : 'secondary'"
              :size="badgeSize"
              :rounded="rounded === 'none' ? 'sm' : 'full'"
              class="gap-1 pr-1 truncate min-w-0 shrink"
              :class="[
                wrap ? 'max-w-[150px]' : '',
                variant === 'transparent'
                  ? 'border-transparent bg-muted/50 text-foreground font-medium shadow-none'
                  : '',
              ]">
              <span class="truncate min-w-0">{{
                opt.labelI18n ? $t(opt.labelI18n) : opt.label
              }}</span>
              <button
                v-if="!(disabled || readonly)"
                type="button"
                @click.stop="removeOption(opt.value)"
                class="rounded transition-colors shrink-0 flex items-center justify-center p-px"
                :class="
                  variant === 'transparent'
                    ? 'text-muted-foreground hover:bg-black/10 hover:text-foreground'
                    : 'hover:bg-destructive/10 hover:text-destructive p-0.5 rounded-full'
                ">
                <Icon icon="lucide:x" class="w-3 h-3" />
              </button>
            </Badge>

            <Badge
              v-if="hiddenCount > 0"
              :variant="variant === 'transparent' ? 'outline' : 'secondary'"
              :size="badgeSize"
              :rounded="rounded === 'none' ? 'sm' : 'full'"
              class="shrink-0"
              :class="
                variant === 'transparent'
                  ? 'border-transparent bg-muted/50 text-muted-foreground font-medium shadow-none'
                  : ''
              ">
              +{{ hiddenCount }}
            </Badge>
          </template>
        </div>

        <div
          v-if="showControls && !(disabled || readonly)"
          class="flex items-center gap-2 pl-2 shrink-0 text-muted-foreground">
          <Icon
            v-if="selectedOptions.length > 0 && !(disabled || readonly)"
            icon="lucide:x"
            class="w-4 h-4 hover:text-foreground transition-colors"
            @click.stop="clearAll" />
          <div class="w-px h-4 bg-border mx-0.5"></div>
          <Icon
            icon="lucide:chevron-down"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }" />
        </div>
      </div>
    </template>

    <template #default>
      <DropdownMenu
        v-if="!(disabled || readonly)"
        :options="normalizedOptions"
        :cachedOptions="combinedOptions"
        :selected="modelValue"
        :emptyMessage="emptyMessage"
        :searchEmptyMessage="searchEmptyMessage"
        class="min-w-[300px]"
        :loading="loading || hydration.isHydrating.value"
        :hasMore="hasMore"
        :searchable="searchable"
        :remote="remote"
        :debounceTime="debounceTime"
        :layout="layout"
        @select="handleSelect"
        @close="isOpen = false"
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
  </Dropdown>
</template>
