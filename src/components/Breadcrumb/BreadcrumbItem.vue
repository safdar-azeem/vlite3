<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import type { BreadcrumbItemSchema, BreadcrumbSize } from './types'

interface Props extends BreadcrumbItemSchema {
  size?: BreadcrumbSize
  isCurrent?: boolean
  variant?: string
  itemIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isCurrent: false,
  variant: 'default',
  itemIndex: 0,
})

const emit = defineEmits<{
  (e: 'item-click', payload: { item: BreadcrumbItemSchema; index: number }): void
}>()

const tag = computed(() => {
  if (props.disabled || props.isCurrent) return 'span'
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'span'
})

const linkProps = computed(() => {
  if (props.disabled || props.isCurrent) return {}
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
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

function handleClick() {
  if (props.disabled || props.isCurrent) return
  const item: BreadcrumbItemSchema = {
    label: props.label!,
    to: props.to,
    href: props.href,
    icon: props.icon,
    disabled: props.disabled,
    active: props.active,
  }
  emit('item-click', { item, index: props.itemIndex })
}
</script>

<template>
  <li class="breadcrumb-item" :class="{ 'is-current': isCurrent, 'is-disabled': disabled }">
    <component
      :is="tag"
      v-bind="linkProps"
      class="breadcrumb-link"
      :class="{ current: isCurrent, disabled: disabled }"
      :aria-current="isCurrent ? 'page' : undefined"
      :aria-disabled="disabled || undefined"
      @click="handleClick">
      <Icon v-if="icon" :icon="icon" class="breadcrumb-icon" :class="iconSizeClasses" />
      <slot>{{ label }}</slot>
    </component>
  </li>
</template>

<style scoped>
.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
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
