<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import { $t } from '@/utils/i18n'

export interface ChoiceBoxOption {
  id: string | number
  title: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  disabled?: boolean
  badge?: string
  badgeI18n?: string
  [key: string]: any // Support for passing arbitrary data for custom slots
}

export type ChoiceBoxVariant = '1' | '2' | '3' | '4' | '5'
export type ChoiceBoxIndicatorType = 'default' | 'checkbox' | 'radio' | 'switch' | 'none'
export type ChoiceBoxIndicatorPosition = 'left' | 'right' | 'top-right'
export type ChoiceBoxSize = 'sm' | 'md' | 'lg'

interface Props {
  modelValue?: string | number | (string | number)[] | null
  options: ChoiceBoxOption[]
  multiple?: boolean
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  disabled?: boolean
  grid?: number // 0 for flex-wrap, 1-4 for grid columns
  gap?: number
  variant?: ChoiceBoxVariant
  indicatorType?: ChoiceBoxIndicatorType
  indicatorPosition?: ChoiceBoxIndicatorPosition
  size?: ChoiceBoxSize
  lineThroughOnSelect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  grid: 1,
  gap: 4,
  variant: '1',
  indicatorType: 'default',
  indicatorPosition: 'top-right',
  size: 'md',
  lineThroughOnSelect: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[] | null): void
  (e: 'change', value: string | number | (string | number)[] | null): void
}>()

const displayTitle = computed(() => (props.titleI18n ? $t(props.titleI18n) : props.title))
const displayDescription = computed(() =>
  props.descriptionI18n ? $t(props.descriptionI18n) : props.description
)

const getOptionTitle = (opt: ChoiceBoxOption) => (opt.titleI18n ? $t(opt.titleI18n) : opt.title)
const getOptionDesc = (opt: ChoiceBoxOption) =>
  opt.descriptionI18n ? $t(opt.descriptionI18n) : opt.description
const getOptionBadge = (opt: ChoiceBoxOption) => (opt.badgeI18n ? $t(opt.badgeI18n) : opt.badge)

const isSelected = (id: string | number) => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(id)
  }
  return props.modelValue === id
}

const toggleOption = (id: string | number) => {
  if (props.disabled) return
  const option = props.options.find((o) => o.id === id)
  if (option?.disabled) return

  let newValue: any

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(id)
    if (index === -1) {
      current.push(id)
    } else {
      current.splice(index, 1)
    }
    newValue = current
  } else {
    newValue = id
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const gridClass = computed(() => {
  switch (props.grid) {
    case 0:
      return 'flex flex-wrap'
    case 1:
      return 'grid grid-cols-1'
    case 2:
      return 'grid grid-cols-1 sm:grid-cols-2'
    case 3:
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    case 4:
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid grid-cols-1'
  }
})

const gapClass = computed(() => {
  if (props.variant === '2') return 'gap-0'
  
  switch (props.gap) {
    case 0: return 'gap-0'
    case 2: return 'gap-2'
    case 3: return 'gap-3'
    case 4: return 'gap-4'
    case 6: return 'gap-6'
    case 8: return 'gap-8'
    default: return 'gap-4'
  }
})

const getVariantClasses = (option: ChoiceBoxOption) => {
  const trulySelected = isSelected(option.id)
  const selected = trulySelected && !props.lineThroughOnSelect
  
  const base = 'relative flex items-center cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
  const disabledClass = props.disabled || option.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''

  const padMap: Record<string, Record<string, string>> = {
    '1': { sm: 'p-3', md: 'p-4', lg: 'p-5' },
    '2': { sm: 'py-3 px-3', md: 'py-4 px-4', lg: 'py-5 px-5' },
    '3': { sm: 'p-3', md: 'p-4', lg: 'p-5' },
    '4': { sm: 'p-4', md: 'p-5', lg: 'p-6' },
    '5': { sm: 'px-3 py-1.5', md: 'px-4 py-2', lg: 'px-5 py-2.5' }
  }
  const padClass = padMap[props.variant]?.[props.size] || padMap[props.variant]['md']

  let variantClass = ''

  switch (props.variant) {
    case '1':
      variantClass = `rounded-xl border ${padClass} ${
        selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40 hover:bg-accent/30'
      }`
      break
    case '2':
      variantClass = `border-b border-border ${padClass} last:border-0 ${
        selected ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent hover:bg-accent/30'
      }`
      break
    case '3':
      variantClass = `rounded-xl ${padClass} ${
        selected ? 'bg-primary/15' : 'bg-muted/60 hover:bg-muted'
      }`
      break
    case '4':
      variantClass = `rounded-2xl border-[2.5px] ${padClass} ${
        selected ? 'border-primary bg-transparent' : 'border-border/80 bg-transparent hover:border-muted-foreground/40'
      }`
      break
    case '5':
      const hasIndicator = props.indicatorType !== 'none' && props.indicatorType !== 'default'
      variantClass = `rounded-full border ${padClass} justify-center ${
        selected 
          ? (hasIndicator ? 'border-primary bg-primary/10 text-primary' : 'border-primary bg-primary text-primary-foreground') 
          : 'border-border bg-background hover:bg-accent'
      }`
      break
  }

  return [base, variantClass, disabledClass].filter(Boolean).join(' ')
}

// Sizing Computeds
const titleSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-sm'
  if (props.size === 'lg') return 'text-base'
  return 'text-[15px]'
})

const descSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-[12px]'
  if (props.size === 'lg') return 'text-[14px]'
  return 'text-[13px]'
})

const iconWrapSizeClass = computed(() => {
  if (props.variant === '5') return 'h-5 w-5 bg-transparent'
  if (props.size === 'sm') return 'h-8 w-8'
  if (props.size === 'lg') return 'h-12 w-12'
  return 'h-10 w-10'
})

const iconSizeClass = computed(() => {
  if (props.size === 'sm') return 'h-4 w-4'
  if (props.size === 'lg') return 'h-6 w-6'
  return 'h-5 w-5'
})

// Control indicators sizing to match
const indicatorIconSizeClass = computed(() => props.size === 'sm' ? 'h-4 w-4' : props.size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')
const radioSizeClass = computed(() => props.size === 'sm' ? 'h-4 w-4' : props.size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')
const radioDotClass = computed(() => props.size === 'sm' ? 'h-2 w-2' : props.size === 'lg' ? 'h-3 w-3' : 'h-2.5 w-2.5')
</script>

<template>
  <div class="w-full">
    <div v-if="displayTitle || displayDescription" class="mb-4">
      <h3 v-if="displayTitle" class="text-base font-semibold text-foreground">
        {{ displayTitle }}
      </h3>
      <p v-if="displayDescription" class="text-sm text-muted-foreground mt-1">
        {{ displayDescription }}
      </p>
    </div>

    <div :class="[gridClass, gapClass]">
      <div
        v-for="option in options"
        :key="option.id"
        :class="getVariantClasses(option)"
        @click="toggleOption(option.id)"
        tabindex="0"
        @keydown.enter.space.prevent="toggleOption(option.id)">
        
        <div v-if="indicatorPosition === 'left' && indicatorType !== 'none'" class="shrink-0 mr-3 flex items-center">
          <slot name="indicator" :option="option" :selected="isSelected(option.id)">
            <div v-if="indicatorType === 'checkbox'" class="pointer-events-none flex items-center shrink-0">
              <CheckBox :model-value="isSelected(option.id)" :size="size" />
            </div>
            <div v-else-if="indicatorType === 'radio'" :class="[radioSizeClass, isSelected(option.id) && !lineThroughOnSelect ? 'border-primary' : 'border-muted-foreground/50']" class="rounded-full border-[2px] flex items-center justify-center transition-colors shrink-0">
              <div v-if="isSelected(option.id)" :class="[radioDotClass, lineThroughOnSelect ? 'bg-muted-foreground/50' : 'bg-primary']" class="rounded-full"></div>
            </div>
            <div v-else-if="indicatorType === 'switch'" class="pointer-events-none flex items-center shrink-0">
              <Switch :model-value="isSelected(option.id)" />
            </div>
            <div v-else-if="indicatorType === 'default'" class="flex items-center shrink-0 transition-colors" :class="isSelected(option.id) ? (lineThroughOnSelect ? 'text-muted-foreground opacity-50' : (variant === '5' ? 'text-primary-foreground' : 'text-primary')) : 'text-transparent'">
              <Icon v-if="multiple" icon="lucide:check-square" :class="indicatorIconSizeClass" />
              <Icon v-else icon="lucide:check-circle-2" :class="indicatorIconSizeClass" />
            </div>
          </slot>
        </div>

        <div class="flex flex-1 gap-3 items-center" :class="{'justify-center': variant === '5'}">
          <slot name="option" :option="option" :selected="isSelected(option.id)">
            <div v-if="option.icon" class="shrink-0 flex items-center justify-center">
              <div
                class="flex items-center justify-center rounded-full transition-colors"
                :class="[
                  iconWrapSizeClass,
                  isSelected(option.id) && variant !== '5' && !lineThroughOnSelect
                    ? (variant === '2' ? 'bg-muted text-foreground' : 'bg-primary/10 text-primary')
                    : variant !== '5' ? 'bg-muted text-muted-foreground' : 'text-current',
                  lineThroughOnSelect && isSelected(option.id) ? 'opacity-50' : ''
                ]">
                <Icon :icon="option.icon" :class="iconSizeClass" />
              </div>
            </div>

            <div class="flex flex-col flex-1 justify-center" :class="{'items-center text-center': variant === '5' && !option.icon}">
              <div class="flex items-center gap-2">
                <span
                  class="font-medium transition-colors"
                  :class="[
                    titleSizeClass,
                    isSelected(option.id) && !lineThroughOnSelect
                      ? (variant === '5' && (indicatorType === 'none' || indicatorType === 'default') ? 'text-primary-foreground' : (variant === '2' ? 'text-foreground font-semibold' : 'text-primary'))
                      : 'text-foreground'
                  ]">
                  <span :class="{'line-through opacity-50': option.disabled || (lineThroughOnSelect && isSelected(option.id))}">{{ getOptionTitle(option) }}</span>
                </span>
                <span
                  v-if="option.badge || option.badgeI18n"
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                  :class="
                    isSelected(option.id) && !lineThroughOnSelect
                      ? (variant === '5' ? 'bg-background/20 text-current' : 'bg-primary text-primary-foreground')
                      : 'bg-muted text-muted-foreground'
                  ">
                  {{ getOptionBadge(option) }}
                </span>
              </div>
              <span
                v-if="(option.description || option.descriptionI18n) && variant !== '5'"
                class="mt-0.5 leading-relaxed transition-colors"
                :class="[
                  descSizeClass, 
                  'text-muted-foreground',
                  lineThroughOnSelect && isSelected(option.id) ? 'line-through opacity-50' : ''
                ]">
                {{ getOptionDesc(option) }}
              </span>
            </div>
          </slot>
        </div>

        <div v-if="indicatorPosition === 'right' && indicatorType !== 'none'" class="shrink-0 ml-3 flex items-center">
          <slot name="indicator" :option="option" :selected="isSelected(option.id)">
            <div v-if="indicatorType === 'checkbox'" class="pointer-events-none flex items-center shrink-0">
              <CheckBox :model-value="isSelected(option.id)" :size="size" />
            </div>
            <div v-else-if="indicatorType === 'radio'" :class="[radioSizeClass, isSelected(option.id) && !lineThroughOnSelect ? 'border-primary' : 'border-muted-foreground/50']" class="rounded-full border-[2px] flex items-center justify-center transition-colors shrink-0">
              <div v-if="isSelected(option.id)" :class="[radioDotClass, lineThroughOnSelect ? 'bg-muted-foreground/50' : 'bg-primary']" class="rounded-full"></div>
            </div>
            <div v-else-if="indicatorType === 'switch'" class="pointer-events-none flex items-center shrink-0">
              <Switch :model-value="isSelected(option.id)" />
            </div>
            <div v-else-if="indicatorType === 'default'" class="flex items-center shrink-0 transition-colors" :class="isSelected(option.id) ? (lineThroughOnSelect ? 'text-muted-foreground opacity-50' : (variant === '5' ? 'text-primary-foreground' : 'text-primary')) : 'text-transparent'">
              <Icon v-if="multiple" icon="lucide:check-square" :class="indicatorIconSizeClass" />
              <Icon v-else icon="lucide:check-circle-2" :class="indicatorIconSizeClass" />
            </div>
          </slot>
        </div>

        <div v-if="indicatorPosition === 'top-right' && indicatorType !== 'none'" class="absolute flex items-center" :class="['1', '3', '4'].includes(variant) ? 'top-4 right-4' : 'top-1/2 -translate-y-1/2 right-4'">
           <slot name="indicator" :option="option" :selected="isSelected(option.id)">
              <div v-if="indicatorType === 'checkbox'" class="pointer-events-none flex items-center shrink-0" :class="!lineThroughOnSelect ? 'text-primary' : ''">
                <CheckBox :model-value="isSelected(option.id)" :size="size" />
              </div>
              <div v-else-if="indicatorType === 'radio'" :class="[radioSizeClass, isSelected(option.id) && !lineThroughOnSelect ? 'border-primary' : 'border-muted-foreground/50']" class="rounded-full border-[2px] flex items-center justify-center transition-colors shrink-0">
                <div v-if="isSelected(option.id)" :class="[radioDotClass, lineThroughOnSelect ? 'bg-muted-foreground/50' : 'bg-primary']" class="rounded-full"></div>
              </div>
              <div v-else-if="indicatorType === 'switch'" class="pointer-events-none flex items-center shrink-0">
                <Switch :model-value="isSelected(option.id)" />
              </div>
              <div v-else-if="indicatorType === 'default'" class="flex items-center shrink-0 transition-colors" :class="isSelected(option.id) ? (lineThroughOnSelect ? 'text-muted-foreground opacity-50' : 'text-primary') : 'text-transparent'">
                <Icon v-if="isSelected(option.id) && multiple" icon="lucide:check-square" :class="indicatorIconSizeClass" />
                <Icon v-else-if="isSelected(option.id) && !multiple" icon="lucide:check-circle-2" :class="indicatorIconSizeClass" />
              </div>
           </slot>
        </div>

      </div>
    </div>
  </div>
</template>
