<script setup lang="ts">
import { computed, inject, unref } from 'vue'
import Label from './Label.vue'
import type { RadioSize, RadioColor } from '@/types'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: any
  value?: any
  disabled?: boolean
  label?: string
  labelI18n?: string
  id?: string
  class?: string
  size?: RadioSize
  color?: RadioColor
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  disabled: false,
  class: '',
  size: undefined,
  color: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

// Inject from RadioGroup if available
const radioGroup = inject<{
  modelValue: any
  updateValue: (val: any) => void
  name: string
  disabled: boolean
  size: RadioSize
  color: RadioColor
} | null>('radioGroup', null)

const isChecked = computed(() => {
  if (radioGroup) {
    return unref(radioGroup.modelValue) === props.value
  }
  return props.modelValue === props.value
})

const isDisabled = computed(() => {
  return unref(radioGroup?.disabled) || props.disabled
})

const currentSize = computed(() => {
  return props.size || unref(radioGroup?.size) || 'md'
})

const currentColor = computed(() => {
  return props.color || unref(radioGroup?.color) || 'primary'
})

const currentName = computed(() => {
  return unref(radioGroup?.name) || props.name || `radio-${Math.random().toString(36).substring(2, 9)}`
})

const displayLabel = computed(() => (props.labelI18n ? $t(props.labelI18n) : props.label))

const toggle = () => {
  if (isDisabled.value) return
  if (radioGroup) {
    radioGroup.updateValue(props.value)
  } else {
    emit('update:modelValue', props.value)
  }
}

const sizeClasses: Record<RadioSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4.5 w-4.5',
  lg: 'h-5 w-5',
  xl: 'h-5.5 w-5.5',
}

const innerSizeClasses: Record<RadioSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
}

const colorMap: Record<RadioColor, { border: string; bg: string; ring: string }> = {
  primary: { border: 'border-primary!', bg: 'bg-primary', ring: 'focus-visible:ring-primary' },
  secondary: { border: 'border-secondary!', bg: 'bg-secondary', ring: 'focus-visible:ring-secondary' },
  success: { border: 'border-success!', bg: 'bg-success', ring: 'focus-visible:ring-success' },
  warning: { border: 'border-warning!', bg: 'bg-warning', ring: 'focus-visible:ring-warning' },
  danger: { border: 'border-danger!', bg: 'bg-danger', ring: 'focus-visible:ring-danger' },
  info: { border: 'border-info!', bg: 'bg-info', ring: 'focus-visible:ring-info' },
}

const radioClass = computed(() => {
  const map = colorMap[currentColor.value] || colorMap.primary

  return [
    'peer shrink-0 rounded-full border transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'cursor-pointer bg-transparent flex items-center justify-center',
    sizeClasses[currentSize.value],
    isChecked.value ? map.border : 'border-gray-400!',
    map.ring,
    props.class,
  ].join(' ')
})

const innerDotClass = computed(() => {
  const map = colorMap[currentColor.value] || colorMap.primary

  return [
    'rounded-full transition-transform duration-200',
    isChecked.value ? 'scale-100' : 'scale-0',
    innerSizeClasses[currentSize.value],
    map.bg
  ].join(' ')
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      type="button"
      role="radio"
      :aria-checked="isChecked"
      :data-state="isChecked ? 'checked' : 'unchecked'"
      :disabled="isDisabled"
      :class="radioClass"
      :id="id"
      :name="currentName"
      :data-testid="$attrs['data-testid'] || (id ? `radio-${id}` : (displayLabel ? `radio-${displayLabel.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : 'radio'))"
      @click.prevent="toggle">
      <div :class="innerDotClass"></div>
    </button>
    <Label
      v-if="displayLabel || $slots.default"
      :for="id"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      @click="toggle">
      <slot>{{ displayLabel }}</slot>
    </Label>
  </div>
</template>
