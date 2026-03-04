<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import type { BreadcrumbItemSchema, BreadcrumbSize } from './types'

interface Props extends BreadcrumbItemSchema {
  size?: BreadcrumbSize
  isCurrent?: boolean
  variant?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isCurrent: false,
  variant: 'default',
})

const tag = computed(() => {
  if (props.disabled || props.isCurrent) return 'span'
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'span'
})

const linkProps = computed(() => {
  if (props.to && !props.disabled && !props.isCurrent) {
    return { to: props.to }
  }
  if (props.href && !props.disabled && !props.isCurrent) {
    return { href: props.href }
  }
  return {}
})

const iconSizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }
  return sizes[props.size] || sizes.md
})
</script>

<template>
  <li class="breadcrumb-item" :class="{ 'is-current': isCurrent, 'is-disabled': disabled }">
    <component
      :is="tag"
      v-bind="linkProps"
      class="breadcrumb-link"
      :class="{ current: isCurrent, disabled: disabled }"
      :aria-current="isCurrent ? 'page' : undefined"
      :aria-disabled="disabled || undefined">
      <Icon v-if="icon" :icon="icon" class="breadcrumb-icon" :class="iconSizeClasses" />
      <slot>{{ label }}</slot>
    </component>
  </li>
</template>

<style scoped>
.breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  color: var(--color-muted-foreground);
  text-decoration: none;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
  border-radius: var(--radius-sm);
}

.breadcrumb-link:not(.current):not(.disabled):hover {
  color: var(--color-foreground);
}

.breadcrumb-link.current {
  color: var(--color-foreground);
  font-weight: 600;
  cursor: default;
}

.breadcrumb-link.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.breadcrumb-icon {
  flex-shrink: 0;
}
</style>
