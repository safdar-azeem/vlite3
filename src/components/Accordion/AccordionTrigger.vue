<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import type { AccordionSize, IconVariant } from './types'

interface Props {
  class?: string
  icon?: string
  open?: boolean
  disabled?: boolean
  index?: number
  showIndex?: boolean
  size?: AccordionSize
  openIcon?: string
  closeIcon?: string
  iconVariant?: IconVariant
  activeIconVariant?: IconVariant
  chevron?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  chevron: true,
  showIndex: false,
  size: 'md',
  iconVariant: 'simple',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return
  emit('click', e)
}

const currentIcon = computed(() => {
  if (props.open && props.openIcon) return props.openIcon
  if (!props.open && props.closeIcon) return props.closeIcon
  return 'lucide:chevron-down'
})

const iconRotationClass = computed(() => {
  if (props.openIcon && props.closeIcon) return ''
  return props.open ? 'rotate-180' : ''
})

const currentIconVariant = computed(() => {
  if (props.open && props.activeIconVariant) return props.activeIconVariant
  return props.iconVariant
})

const iconContainerClass = computed(() => {
  const base = 'flex items-center justify-center shrink-0 transition-all duration-300'

  const sizes: Record<AccordionSize, string> = {
    sm: 'h-6.5 w-6.5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const variants: Record<string, string> = {
    simple: 'text-muted-foreground bg-transparent',
    solid: 'text-foreground bg-muted',
    outline: 'text-foreground border bg-transparent',
    primary: 'text-primary-dark bg-primary-light',
    ghost: 'text-muted-foreground hover:bg-accent bg-transparent',
  }

  const variantClass = variants[currentIconVariant.value] || variants['simple']

  if (currentIconVariant.value === 'simple')
    return `text-muted-foreground group-hover:text-foreground ${iconRotationClass.value}`

  return `${base} ${sizes[props.size]} rounded-full ${variantClass} ${iconRotationClass.value}`
})

const iconSizeClass = computed(() => {
  const sizes: Record<AccordionSize, string> = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }
  return sizes[props.size]
})

const indexSizeClass = computed(() => {
  const sizes: Record<AccordionSize, string> = {
    sm: 'h-6.5 w-6.5 text-[11px]',
    md: 'h-7 w-7 text-xs',
    lg: 'h-9 w-9 text-sm',
  }
  return sizes[props.size]
})
</script>

<template>
  <button
    type="button"
    class="group flex flex-1 w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    :class="[props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', props.class]"
    :data-state="props.open ? 'open' : 'closed'"
    :disabled="props.disabled"
    @click="handleClick">
    <div class="flex items-center" :class="size == 'sm' ? 'gap-2' : 'gap-2.5'">
      <div
        v-if="showIndex && index !== undefined"
        :class="[
          'flex items-center justify-center rounded-full bg-primary-light text-primary font-bold shrink-0',
          indexSizeClass,
        ]">
        {{ index }}
      </div>

      <Icon
        v-if="icon"
        :icon="icon"
        :class="[
          'shrink-0 text-muted-foreground group-hover:text-foreground transition-colors',
          iconSizeClass,
        ]" />

      <div class="flex flex-col">
        <slot />
      </div>
    </div>

    <slot name="icon">
      <div v-if="chevron || openIcon || closeIcon" :class="iconContainerClass">
        <Icon
          :icon="currentIcon"
          :class="[
            'shrink-0 transition-transform duration-200',
            iconSizeClass,
            currentIconVariant !== 'simple' ? 'rotate-0' : '',
          ]" />
      </div>
    </slot>
  </button>
</template>
