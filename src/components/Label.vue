<script setup lang="ts">
import { computed } from 'vue'

export type LabelSize = 'xs' | 'sm' | 'md' | 'lg'

export interface LabelProps {
  for?: string
  class?: string
  size?: LabelSize
}

const props = withDefaults(defineProps<LabelProps>(), {
  class: '',
  size: 'md',
})

const classes = computed(() => {
  const sizeClasses: Record<LabelSize, string> = {
    xs: '-text-fs-3.5',
    sm: '-text-fs-3',
    md: '-text-fs-2',
    lg: 'text-base',
  }

  return [
    sizeClasses[props.size],
    'leading-none text-gray-800 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class,
  ].join(' ')
})
</script>

<template>
  <label :for="props.for" :class="classes">
    <slot />
  </label>
</template>
