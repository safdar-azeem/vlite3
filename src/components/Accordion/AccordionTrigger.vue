<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'

interface Props {
  class?: string
  icon?: string
  open?: boolean
  disabled?: boolean
  index?: number
  showIndex?: boolean

  // Custom icons from parent/root
  openIcon?: string
  closeIcon?: string
  // Icon Style
  iconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'
  activeIconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'
  chevron?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  chevron: true,
  showIndex: false,
  iconVariant: 'simple',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return
  emit('click', e)
}

// Icon Logic
const currentIcon = computed(() => {
  // If specific open/close icons are provided
  if (props.open && props.openIcon) return props.openIcon
  if (!props.open && props.closeIcon) return props.closeIcon

  // Default chevron behavior
  return 'lucide:chevron-down'
})

const iconRotationClass = computed(() => {
  // Only rotate if we are NOT using distinct icons (i.e. using chevron for both or same icon)
  if (props.openIcon && props.closeIcon) return ''
  return props.open ? 'rotate-180' : ''
})

const currentIconVariant = computed(() => {
  if (props.open && props.activeIconVariant) return props.activeIconVariant
  return props.iconVariant
})

const iconContainerClass = computed(() => {
  const base = 'flex items-center justify-center shrink-0 transition-all duration-300'
  const size = 'h-8 w-8 rounded-full'

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

  return `${base} ${size} ${variantClass} ${iconRotationClass.value}`
})
</script>

<template>
  <button
    type="button"
    class="group flex flex-1 w-full items-center justify-between py-3 text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    :class="[props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', props.class]"
    :data-state="props.open ? 'open' : 'closed'"
    :disabled="props.disabled"
    @click="handleClick">
    <div class="flex items-center gap-3">
      <div
        v-if="showIndex && index !== undefined"
        class="flex items-center justify-center h-7 w-7 rounded-full bg-primary-light text-primary text-xs font-bold shrink-0">
        {{ index }}
      </div>

      <Icon
        v-if="icon"
        :icon="icon"
        class="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />

      <div class="flex flex-col">
        <slot />
      </div>
    </div>

    <slot name="icon">
      <div v-if="chevron || openIcon || closeIcon" :class="iconContainerClass">
        <Icon
          :icon="currentIcon"
          :class="['h-4 w-4 shrink-0 transition-transform duration-200', currentIconVariant !== 'simple' ? 'rotate-0' : '']" />
      </div>
    </slot>
  </button>
</template>
