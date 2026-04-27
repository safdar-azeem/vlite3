<script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'
import Icon from './Icon.vue'
import { vRipple } from '../directives/vRipple'
import type { ButtonVariant, ButtonSize, ButtonRounded, ButtonProps } from '@/types'
import { $t } from '@/utils/i18n'

// Variant → classes for the tile icon background circle
const tileIconBgMap: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  'primary-light': 'bg-primary-light text-primary-fg-light',
  secondary: 'bg-secondary text-secondary-foreground',
  danger: 'bg-danger text-danger-fg',
  'danger-light': 'bg-danger-light text-destructive',
  warning: 'bg-warning text-warning-fg',
  'warning-light': 'bg-warning-light text-warning-fg-light',
  info: 'bg-info text-info-fg',
  'info-light': 'bg-info-light text-info-fg-light',
  success: 'bg-success text-success-fg',
  'success-light': 'bg-success-light text-success-fg-light',
  outline: 'bg-muted text-foreground',
  'outline-floating': 'bg-muted text-foreground',
  'outline-primary': 'bg-primary/10 text-primary',
  'outline-danger': 'bg-destructive/10 text-destructive',
  'outline-warning': 'bg-warning/10 text-warning',
  'outline-info': 'bg-info/10 text-info',
  'outline-success': 'bg-success/10 text-success',
  ghost: 'bg-accent text-accent-foreground',
  link: 'bg-primary/10 text-primary',
  transparent: 'bg-muted text-foreground',
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  rounded: 'md',
  disabled: false,
  loading: false,
  class: '',
  layout: 'horizontal',
  tileIconBg: undefined,
})

const attrs = useAttrs()
const resolvedLayout = computed(() => {
  const l = props.layout || attrs.layout
  if (l === 'tile') return 'tile'
  if (l === 'vertical') return 'vertical'
  return 'horizontal'
})

const isTile = computed(() => resolvedLayout.value === 'tile')

/** Classes for the icon circle background in tile mode */
const tileCircleClasses = computed(() => {
  const bg = props.tileIconBg ?? props.variant
  return tileIconBgMap[bg] ?? tileIconBgMap.primary
})

const tileCircleSizeClasses = computed(() => {
  const map: Record<ButtonSize, string> = {
    xs: 'w-9 h-9',
    sm: 'w-10 h-10',
    sm2: 'w-11 h-11',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  }
  return map[props.size]
})

const displayText = computed(() => (props.textI18n ? $t(props.textI18n) : props.text))

const slots = useSlots()
const isOnlyIcon = computed(
  () => props?.asIcon || (props.icon && !displayText.value && !slots.default)
)

const classes = computed(() => {
  const layoutGap = resolvedLayout.value === 'tile'
    ? 'flex-col gap-1.5 items-center'
    : resolvedLayout.value === 'vertical'
      ? 'flex-col gap-1.5'
      : 'gap-2'

  const baseClasses = `inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer ${layoutGap} ${isOnlyIcon.value ? 'icon-only shrink-0' : ''}`

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    'primary-light': 'bg-primary-light text-primary-fg-light hover:bg-primary/15',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    danger: 'bg-danger text-danger-fg hover:bg-danger/90',
    'danger-light': 'bg-danger-light text-destructive hover:bg-danger/20 dark:hover:bg-danger/40',
    warning: 'bg-warning text-warning-fg hover:bg-warning/80',
    'warning-light': 'bg-warning-light text-warning-fg-light hover:bg-warning/25',
    info: 'bg-info text-info-fg hover:bg-info/80',
    'info-light': 'bg-info-light text-info-fg-light hover:bg-info/30',
    success: 'bg-success text-success-fg hover:bg-success/80',
    'success-light':
      'bg-success-light text-success-fg-light hover:bg-success/20 dark:hover:bg-success/35',

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
    transparent: '',
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
    lg: 'h-10 w-10 min-h-10 min-w-10',
    xl: 'h-12 w-12 min-h-12 min-w-12',
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

  let sizeClass = isOnlyIcon.value ? iconSizes[props.size] : sizes[props.size]

  if (resolvedLayout.value === 'tile') {
    const tileSizes: Record<ButtonSize, string> = {
      xs: 'h-auto py-2 px-2 min-w-16',
      sm: 'h-auto py-2.5 px-3 min-w-18',
      sm2: 'h-auto py-2.5 px-3 min-w-18',
      md: 'h-auto py-3 px-4 min-w-20',
      lg: 'h-auto py-3.5 px-4 min-w-24',
      xl: 'h-auto py-4 px-5 min-w-28',
    }
    sizeClass = tileSizes[props.size]
  } else if (resolvedLayout.value === 'vertical') {
    const verticalSizes: Record<ButtonSize, string> = {
      xs: 'h-auto py-1.5 px-2 min-w-16',
      sm: 'h-auto py-2 px-3 min-w-20',
      sm2: 'h-auto py-2 px-3 min-w-20',
      md: 'h-auto py-2.5 px-4 min-w-24',
      lg: 'h-auto py-3 px-4 min-w-28',
      xl: 'h-auto py-4 px-10 min-w-32',
    }
    sizeClass = verticalSizes[props.size]
  }

  // In tile mode the outer button has no fill — the icon circle carries the color
  const variantClass = isTile.value ? 'text-foreground' : variants[props.variant]

  return [
    baseClasses,
    variantClass,
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

  let iconClassStr = isOnlyIcon.value ? iconSizes[props.size] : sizes[props.size]
  if (resolvedLayout.value === 'vertical') {
    iconClassStr += ' scale-[1.3] mt-1'
  }
  return iconClassStr
})
</script>

<template>
  <button
    v-ripple
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :data-testid="
      $attrs['data-testid'] ||
      (displayText
        ? `btn-${displayText
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')}`
        : icon
          ? `btn-${icon.replace(/[^a-zA-Z0-9]+/g, '-')}`
          : 'button')
    "
    class="cursor-pointer">
    <!-- ── Tile layout: icon inside a circle ─────────────────── -->
    <template v-if="isTile">
      <span
        class="inline-flex items-center justify-center rounded-full shrink-0 transition-colors"
        :class="[tileCircleClasses, tileCircleSizeClasses]">
        <Icon
          v-if="loading"
          icon="lucide:loader-2"
          class="animate-spin pointer-events-none"
          :class="iconClasses" />
        <Icon
          v-else-if="icon"
          :icon="icon"
          class="pointer-events-none"
          :class="[iconClass, iconClasses]" />
      </span>

      <span
        v-if="displayText || $slots.default"
        class="text-xs font-medium leading-tight text-center truncate max-w-full"
        :class="textClass">
        <slot>{{ displayText }}</slot>
      </span>
    </template>

    <!-- ── Default / horizontal / vertical layouts ────────── -->
    <template v-else>
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
    </template>
  </button>
</template>
