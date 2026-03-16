<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import Icon from './Icon.vue'
import { vRipple } from '../directives/vRipple'
import type { ButtonVariant, ButtonSize, ButtonRounded, ButtonProps } from '@/types'
import { $t } from '@/utils/i18n'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  rounded: 'md',
  disabled: false,
  loading: false,
  class: '',
})

const displayText = computed(() => (props.textI18n ? $t(props.textI18n) : props.text))

const slots = useSlots()
const isOnlyIcon = computed(
  () => props?.asIcon || (props.icon && !displayText.value && !slots.default)
)

// Detect if inside a ButtonGroup — in groups, icon-only buttons use text button sizing (height auto via CSS)
const buttonGroup = inject<{ isInGroup: boolean } | null>('buttonGroup', null)
const isInGroup = computed(() => !!buttonGroup?.isInGroup)

const classes = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none  focus:border focus:border-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer gap-2'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    'primary-light': 'bg-primary-light text-primary-fg-light hover:bg-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    'danger-light': 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    warning: 'bg-warning text-warning-fg hover:bg-warning/80',
    'warning-light': 'bg-warning-light text-warning-fg-light hover:bg-warning/20',
    info: 'bg-info text-info-fg hover:bg-info/80',
    'info-light': 'bg-info-light text-info-fg-light hover:bg-info/20',
    success: 'bg-success text-success-fg hover:bg-success/80',
    'success-light': 'bg-success-light text-success-fg-light hover:bg-success/20',

    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground',
    'outline-floating':
      'border px-3.5! border-input bg-transparent hover:bg-transparent text-foreground border-input active:scale-100!',
    'outline-primary': 'border border-primary text-primary hover:bg-primary/10',
    'outline-danger': 'border border-destructive text-destructive hover:bg-destructive/10',
    'outline-warning': 'border border-warning text-warning hover:bg-warning/10',
    'outline-info': 'border border-info text-info hover:bg-info/10',
    'outline-success': 'border border-success text-success hover:bg-success/10',

    ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizes: Record<ButtonSize, string> = {
    xs: 'h-6.5 px-2',
    sm: 'h-7.5 px-3',
    sm2: 'h-8 px-3',
    md: 'h-9 px-4 py-2',
    lg: 'h-10 px-4',
    xl: 'h-12 px-10',
  }

  const iconSizes: Record<ButtonSize, string> = {
    xs: 'h-6.5 w-6.5 min-h-6.5 min-w-6.5',
    sm: 'h-7.5 w-7.5 min-h-7.5 min-w-7.5',
    sm2: 'h-8 w-8 min-h-8 min-w-8',
    md: 'h-9 w-9 min-h-9 min-w-9',
    lg: 'h-9.5 w-9.5 min-h-9.5 min-w-9.5',
    xl: 'h-10 w-10 min-h-10 min-w-10',
  }

  // Inside a ButtonGroup: icon-only buttons use text button px but no fixed height (height comes from CSS stretch)
  const groupIconSizes: Record<ButtonSize, string> = {
    xs: 'px-2',
    sm: 'px-3',
    sm2: 'px-3',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-10',
  }

  const roundedVariants: Record<ButtonRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    sm2: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  let sizeClass: string
  if (isOnlyIcon.value) {
    sizeClass = isInGroup.value ? groupIconSizes[props.size] : iconSizes[props.size]
  } else {
    sizeClass = sizes[props.size]
  }

  return [
    baseClasses,
    variants[props.variant],
    roundedVariants[props.rounded],
    sizeClass,
    props.class,
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizes: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    sm2: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
    xl: 'w-4 h-4',
  }

  const iconSizes: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    sm2: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
    xl: 'w-4 h-4',
  }

  return isOnlyIcon.value ? iconSizes[props.size] : sizes[props.size]
})
</script>

<template>
  <button
    v-ripple
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    class="cursor-pointer">
    <Icon
      v-if="loading"
      icon="lucide:loader-2"
      class="animate-spin pointer-events-none"
      :class="iconClasses" />

    <Icon
      v-else-if="icon"
      :icon="icon"
      class="pointer-events-none"
      :class="[iconClass, iconClasses, isOnlyIcon ? 'mx-auto' : '']" />

    <span v-if="textClass" :class="textClass">
      <slot>{{ displayText }}</slot>
    </span>
    <slot v-else>{{ displayText }}</slot>

    <Icon
      v-if="iconRight && !loading"
      :icon="iconRight"
      :class="[iconRightClass, iconClasses]"
      class="h-4 w-4 pointer-events-none" />
  </button>
</template>
