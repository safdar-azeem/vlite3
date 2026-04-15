<script setup lang="ts">
import { computed } from 'vue'
import Avatar from './Avatar.vue'
import type { AvatarSize, AvatarRounded } from '@/types'

export type PresenceType = 'online' | 'offline' | 'busy' | 'dnd' | 'away'

interface Props {
  src?: string
  link?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  rounded?: AvatarRounded
  presence?: PresenceType
  label?: string
  secondaryLabel?: string
  hideDetails?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: 'full',
  hideDetails: false,
  class: '',
})

const presenceColor = computed(() => {
  switch (props.presence) {
    case 'online':
      return 'bg-success'
    case 'busy':
    case 'dnd':
      return 'bg-danger'
    case 'away':
      return 'bg-warning'
    case 'offline':
    default:
      return 'bg-muted-foreground'
  }
})

const presenceSizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'h-1.5 w-1.5 ring-1 border-[0.5px]',
    sm: 'h-2 w-2 ring-[1.5px] border-[0.5px]',
    md: 'h-2.5 w-2.5 ring-2 border-[0.5px]',
    lg: 'h-3.5 w-3.5 ring-2 border-1',
    xl: 'h-4 w-4 ring-2 border-1',
    '2xl': 'h-5 w-5 ring-[3px] border-1.5',
  }
  return sizes[props.size] || sizes.md
})

const textGroupClasses = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'gap-0',
    sm: 'gap-0',
    md: 'gap-0.5',
    lg: 'gap-0.5',
    xl: 'gap-1',
    '2xl': 'gap-1',
  }
  return sizes[props.size] || sizes.md
})

const labelClasses = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'text-[10px] font-medium leading-none',
    sm: 'text-xs font-medium leading-none',
    md: 'text-sm font-medium leading-none',
    lg: 'text-base font-semibold leading-none',
    xl: 'text-lg font-semibold leading-tight',
    '2xl': 'text-xl font-semibold leading-tight',
  }
  return sizes[props.size] || sizes.md
})

const secondaryLabelClasses = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'text-[9px] leading-none',
    sm: 'text-[10px] leading-none',
    md: 'text-xs leading-none',
    lg: 'text-sm leading-none',
    xl: 'text-sm leading-tight',
    '2xl': 'text-base leading-tight',
  }
  return sizes[props.size] || sizes.md
})
</script>

<template>
  <component
    :is="props.link ? 'router-link' : 'div'"
    v-bind="props.link ? { to: props.link } : {}"
    :class="[
      'inline-flex items-center gap-2.5',
      props.class,
      props.link && 'cursor-pointer hover:opacity-80 transition-opacity'
    ]"
  >
    <div class="relative inline-flex flex-shrink-0">
      <Avatar
        :src="props.src"
        :alt="props.alt"
        :fallback="props.fallback"
        :size="props.size"
        :rounded="props.rounded"
      />
      <span
        v-if="props.presence"
        :class="[
          'absolute bottom-0 right-0 rounded-full ring-background border-background',
          presenceColor,
          presenceSizeClasses
        ]"
      >
        <span v-if="props.presence === 'dnd'" class="absolute inset-0 flex items-center justify-center">
          <span class="w-1/2 h-[1px] bg-white rounded-full"></span>
        </span>
      </span>
    </div>

    <div v-if="!props.hideDetails && (props.label || props.secondaryLabel)" :class="['flex flex-col justify-center', textGroupClasses]">
      <span v-if="props.label" :class="['text-foreground', labelClasses]">
        {{ props.label }}
      </span>
      <span v-if="props.secondaryLabel" :class="['text-muted-foreground', secondaryLabelClasses]">
        {{ props.secondaryLabel }}
      </span>
    </div>
  </component>
</template>
