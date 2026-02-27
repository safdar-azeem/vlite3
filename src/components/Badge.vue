<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'danger'
  | 'outline'
  | 'warning'
  | 'info'
  | 'success'

interface Props {
  variant?: BadgeVariant
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
})

const classes = computed(() => {
  const baseClasses =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

  const variants: Record<BadgeVariant, string> = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    danger: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    warning: 'border-transparent bg-warning text-warning-fg hover:bg-warning/80',
    info: 'border-transparent bg-info text-info-fg hover:bg-info/80',
    success: 'border-transparent bg-success text-success-fg hover:bg-success/80',
    outline: 'text-foreground border-border',
  }

  return [baseClasses, variants[props.variant], props.class].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
