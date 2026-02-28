<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import Button from '../Button.vue'
import type { ChipProps, ChipVariant } from './types'
import { $t } from '@/utils/i18n'

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'subtle',
  size: 'medium',
  disabled: false,
  clickable: false,
  deletable: false,
  text: '',
  class: '',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'delete', event: MouseEvent): void
}>()

const displayText = computed(() => props.textI18n ? $t(props.textI18n) : props.text)

const isInteractive = computed(() => props.clickable && !props.disabled)

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return
  if (props.clickable) {
    emit('click', e)
  }
}

const handleDelete = (e: MouseEvent) => {
  if (props.disabled) return
  e.stopPropagation()
  emit('delete', e)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (!props.clickable && !props.deletable) return

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (props.clickable) {
      emit('click', e as unknown as MouseEvent)
    }
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (props.deletable) {
      e.preventDefault()
      emit('delete', e as unknown as MouseEvent)
    }
  }
}

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 border box-border whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-5 text-[10px] px-1.5 gap-1'
    case 'large':
      return 'h-8 text-sm px-3 gap-2'
    case 'medium':
    default:
      return 'h-6 text-xs px-2.5 gap-1.5'
  }
})

const variantClasses = computed(() => {
  if (props.disabled) {
    return 'bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed'
  }

  const interactiveHover = isInteractive.value
    ? 'cursor-pointer hover:shadow-sm active:scale-[0.98]'
    : 'cursor-default'

  const variants: Record<ChipVariant, string> = {
    solid: `bg-primary text-primary-fg border-transparent ${isInteractive.value ? 'hover:bg-primary/90' : ''}`,
    outline: `bg-transparent border-input text-foreground ${isInteractive.value ? 'hover:bg-accent hover:text-accent-foreground' : ''}`,
    ghost: `bg-transparent border-transparent text-muted-foreground ${isInteractive.value ? 'hover:bg-accent hover:text-accent-foreground' : ''}`,
    subtle: `bg-accent/50 text-foreground border-transparent ${isInteractive.value ? 'hover:bg-accent' : ''}`,

    secondary: `bg-secondary text-secondary-foreground border-transparent ${isInteractive.value ? 'hover:bg-secondary/80' : ''}`,
    success: `bg-success text-success-fg border-transparent ${isInteractive.value ? 'hover:bg-success/80' : ''}`,
    warning: `bg-warning text-warning-fg border-transparent ${isInteractive.value ? 'hover:bg-warning/80' : ''}`,
    danger: `bg-destructive text-destructive-foreground border-transparent ${isInteractive.value ? 'hover:bg-destructive/90' : ''}`,
    info: `bg-info text-info-fg border-transparent ${isInteractive.value ? 'hover:bg-info/80' : ''}`,
  }

  return `${variants[props.variant]} ${interactiveHover}`
})

const rootClasses = computed(() => {
  return [baseClasses, sizeClasses.value, variantClasses.value, props.class].join(' ')
})

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-3 w-3'
    case 'large':
      return 'h-4 w-4'
    case 'medium':
    default:
      return 'h-3.5 w-3.5'
  }
})

const closeIconSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-2.5 w-2.5'
    case 'large':
      return 'h-3.5 w-3.5'
    case 'medium':
    default:
      return 'h-3 w-3'
  }
})
</script>

<template>
  <div
    :class="rootClasses"
    :role="clickable ? 'button' : 'status'"
    :tabindex="isInteractive || deletable ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeyDown">
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" :class="[iconSizeClass, 'shrink-0', displayText ? '-ml-0.5' : '']" />
    </slot>

    <span v-if="displayText || $slots.default" class="truncate">
      <slot>{{ displayText }}</slot>
    </span>

    <Button
      v-if="deletable"
      variant="ghost"
      size="xs"
      rounded="full"
      :disabled="disabled"
      class="ml-auto p-0.5! h-auto! w-auto! hover:bg-[#8282823c]"
      :class="[displayText ? (size === 'small' ? '-mr-0.5' : '-mr-1') : '']"
      @click="handleDelete">
      <Icon icon="lucide:x" :class="closeIconSizeClass" />
    </Button>
  </div>
</template>

