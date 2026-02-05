<script setup lang="ts">
import { computed } from 'vue'
import type { TabesOption, TabesSize, TabesVariant } from './types'
import Icon from '../Icon.vue'

interface Props {
  options: TabesOption[]
  modelValue: string | number
  size?: TabesSize
  variant?: TabesVariant
  block?: boolean
  textClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'surface',
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const handleSelect = (option: TabesOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const containerClasses = computed(() => {
  const base = 'inline-flex rounded-lg relative isolate transition-all duration-200'

  const variantStyles: Record<TabesVariant, string> = {
    surface: 'bg-secondary p-1',
    primary: 'bg-secondary p-1',
    secondary: 'bg-secondary p-1', // Default secondary container
    danger: 'bg-danger/10 p-1',
    success: 'bg-success/10 p-1',
    outline: 'bg-transparent border border-border p-1',
    line: 'bg-transparent gap-6 rounded-none p-0 border-b border-border w-full', // Tabs style
  }

  return [base, variantStyles[props.variant], props.block ? 'flex w-full' : '']
})

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-xs px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

const itemBaseClasses = computed(() => {
  // Line variant needs different base styles (no rounded corners usually, or bottom rounded? No, usually text)
  const isLine = props.variant === 'line'
  const base = isLine
    ? 'relative z-10 flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 -mb-[1px] border-b-2 border-transparent hover:text-foreground'
    : 'relative z-10 flex-1 flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out cursor-pointer select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

  return [base]
})

const getItemClasses = (option: TabesOption) => {
  const isActive = option.value === props.modelValue
  const isLine = props.variant === 'line'

  let activeStateClasses = ''
  if (!isActive) {
    activeStateClasses = isLine
      ? 'text-muted-foreground'
      : 'text-muted-foreground hover:text-foreground/80'
  }

  const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [itemBaseClasses.value, activeStateClasses, disabledClasses].join(' ')
}

const getActiveStyle = (option: TabesOption) => {
  if (option.value !== props.modelValue) return ''

  const variantActiveStyles: Record<TabesVariant, string> = {
    surface: 'bg-background text-foreground shadow-sm',
    primary: 'bg-primary text-primary-foreground shadow-sm',
    secondary: 'bg-secondary-foreground text-secondary shadow-sm', // Inverted for contrast
    danger: 'bg-danger text-danger-fg shadow-sm',
    success: 'bg-success text-success-fg shadow-sm',
    outline: 'bg-accent/50 text-accent-foreground ring-1 ring-border shadow-sm',
    line: 'text-primary border-primary', // Border-b-2 handled by base class + border color here
  }

  return variantActiveStyles[props.variant]
}
</script>

<template>
  <div :class="containerClasses" role="tablist">
    <button
      v-for="opt in options"
      :key="opt.value"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :disabled="opt.disabled"
      :class="[getItemClasses(opt), getActiveStyle(opt), sizeClasses[props.size]]"
      @click="handleSelect(opt)"
      type="button">
      <Icon v-if="opt.icon" :icon="opt.icon" :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      <span :class="textClass">{{ opt.label }}</span>
    </button>
  </div>
</template>
