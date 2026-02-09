<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import Label from './Label.vue'
import type { CheckboxSize, CheckboxRounded } from '@/types'

interface Props {
  modelValue?: boolean
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  label?: string
  id?: string
  class?: string
  size?: CheckboxSize
  rounded?: CheckboxRounded
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  checked: false, // Alias
  disabled: false,
  indeterminate: false,
  class: '',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:checked', value: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  const newValue = !(props.modelValue || props.checked)
  emit('update:modelValue', newValue)
  emit('update:checked', newValue)
}

const sizeClasses: Record<CheckboxSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4.5 w-4.5',
  lg: 'h-5 w-5',
  xl: 'h-5.5 w-5.5',
}

const iconSizeClasses: Record<CheckboxSize, string> = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
}

const roundedClasses: Record<CheckboxRounded, string> = {
  none: 'rounded-none',
  xs: 'rounded-[3px]',
  sm: 'rounded-[4px]',
  md: 'rounded-sm',
  lg: 'rounded-md',
  xl: 'rounded-lg',
  '2xl': 'rounded-xl',
  full: 'rounded-full',
}

const buttonClass = computed(() => {
  return [
    'peer shrink-0 border border-primary transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', // Kept ring for accessibility visibility on small elements
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
    'cursor-pointer bg-transparent', // Default background
    sizeClasses[props.size],
    roundedClasses[props.rounded || props.size],
    props.class,
  ].join(' ')
})

const state = computed(() => {
  if (props.indeterminate) return 'indeterminate'
  return props.modelValue || props.checked ? 'checked' : 'unchecked'
})

const iconClass = computed(() => {
  return [
    'transition-transform duration-200',
    state.value === 'checked' || state.value === 'indeterminate' ? 'scale-100' : 'scale-0',
    iconSizeClasses[props.size],
  ].join(' ')
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      type="button"
      role="checkbox"
      :aria-checked="indeterminate ? 'mixed' : modelValue"
      :data-state="state"
      :disabled="disabled"
      :class="buttonClass"
      :id="id"
      @click="toggle">
      <div
        v-if="state === 'checked' || state === 'indeterminate'"
        class="flex items-center justify-center text-current w-full h-full">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0">
          <Icon v-if="state === 'checked'" icon="lucide:check" :class="iconSizeClasses[size]" />
          <Icon
            v-else-if="state === 'indeterminate'"
            icon="lucide:minus"
            :class="iconSizeClasses[size]" />
        </Transition>
      </div>
    </button>
    <Label
      v-if="label"
      :for="id"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      @click="toggle">
      {{ label }}
    </Label>
  </div>
</template>
