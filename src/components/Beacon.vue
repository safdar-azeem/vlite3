<script setup lang="ts">
import { computed } from 'vue'

export type BeaconVariant = 'primary' | 'danger' | 'warning' | 'success' | 'info'
export type BeaconSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: BeaconVariant | string
  size?: BeaconSize | string
  class?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  class: '',
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }
  return sizes[props.size] || sizes.md
})

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary/80',
    danger: 'bg-danger/80',
    warning: 'bg-warning/80',
    success: 'bg-success/80',
    info: 'bg-info/80',
  }
  return colors[props.variant] || colors.primary
})

const dotColorClasses = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary',
    danger: 'bg-danger',
    warning: 'bg-warning',
    success: 'bg-success',
    info: 'bg-info',
  }
  return colors[props.variant] || colors.primary
})
</script>

<template>
  <span :class="['relative flex', sizeClasses, props.class]">
    <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', colorClasses]"></span>
    <span :class="['relative inline-flex rounded-full', sizeClasses, dotColorClasses]"></span>
  </span>
</template>
