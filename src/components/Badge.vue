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
  | 'purple'
  | 'teal'
  | 'indigo'
  | 'orange'
  | 'pink'
  | 'cyan'

interface Props {
  variant?: BadgeVariant | string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
})

const classes = computed(() => {
  const baseClasses =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

  const variants: Record<string, string> = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    outline: 'text-foreground border-border',

    /* Base Semantics */
    secondary: 'border-secondary-subtle-border bg-secondary-subtle text-secondary-subtle-fg hover:opacity-80',
    danger: 'border-danger-subtle-border bg-danger-subtle text-danger-subtle-fg hover:opacity-80',
    warning: 'border-warning-subtle-border bg-warning-subtle text-warning-subtle-fg hover:opacity-80',
    info: 'border-info-subtle-border bg-info-subtle text-info-subtle-fg hover:opacity-80',
    success: 'border-success-subtle-border bg-success-subtle text-success-subtle-fg hover:opacity-80',

    /* Extended Semantics */
    purple: 'border-purple-subtle-border bg-purple-subtle text-purple-subtle-fg hover:opacity-80',
    teal: 'border-teal-subtle-border bg-teal-subtle text-teal-subtle-fg hover:opacity-80',
    indigo: 'border-indigo-subtle-border bg-indigo-subtle text-indigo-subtle-fg hover:opacity-80',
    orange: 'border-orange-subtle-border bg-orange-subtle text-orange-subtle-fg hover:opacity-80',
    pink: 'border-pink-subtle-border bg-pink-subtle text-pink-subtle-fg hover:opacity-80',
    cyan: 'border-cyan-subtle-border bg-cyan-subtle text-cyan-subtle-fg hover:opacity-80',
  }

  return [baseClasses, variants[props.variant] || variants['default'], props.class].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
