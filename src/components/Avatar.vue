<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from './Icon.vue'
import type { AvatarSize, AvatarRounded } from '@/types'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  rounded?: AvatarRounded
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'Avatar',
  size: 'md',
  rounded: 'full',
  class: '',
})

const hasError = ref(false)
const isLoaded = ref(false)

// Reset state when src changes
watch(
  () => props.src,
  () => {
    hasError.value = false
    isLoaded.value = false
  }
)

const onError = () => {
  hasError.value = true
  isLoaded.value = false
}

const onLoad = () => {
  isLoaded.value = true
  hasError.value = false
}

const showImage = computed(() => {
  return props.src && !hasError.value
})

const initials = computed(() => {
  if (props.fallback) return props.fallback

  if (!props.alt) return ''

  const words = props.alt.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
})

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-15 w-15 text-base',
  xl: 'h-18 w-18 text-lg',
  '2xl': 'h-20 w-20 text-xl',
}

const roundedClasses: Record<AvatarRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

const containerClass = computed(() => {
  return [
    'relative flex shrink-0 overflow-hidden bg-muted border border-border/50',
    sizeClasses[props.size],
    roundedClasses[props.rounded],
    props.class,
  ].join(' ')
})

const fallbackClass = computed(() => {
  return 'flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium'
})
</script>

<template>
  <div :class="containerClass">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full object-cover"
      @error="onError"
      @load="onLoad" />
    <div v-else :class="fallbackClass">
      <slot name="fallback">
        <span v-if="initials">{{ initials }}</span>
        <Icon v-else icon="lucide:user" class="h-1/2 w-1/2" />
      </slot>
    </div>
  </div>
</template>
