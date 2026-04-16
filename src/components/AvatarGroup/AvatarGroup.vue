<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Tooltip from '@/components/Tooltip.vue'
import type { AvatarSize, AvatarRounded } from '@/types'

export interface AvatarGroupItem {
  src?: string
  alt?: string
  fallback?: string
  heading?: string
  text?: string
}

export interface Props {
  items: AvatarGroupItem[]
  max?: number
  size?: AvatarSize
  rounded?: AvatarRounded
  overlap?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 4,
  size: 'md',
  rounded: 'full',
  overlap: 'md',
  class: '',
})

const visibleItems = computed(() => props.items.slice(0, props.max))
const overflowCount = computed(() => Math.max(0, props.items.length - props.max))

// Negative margin to create overlap effect
const overlapClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: '-ml-1',
  md: '-ml-2',
  lg: '-ml-3',
}

// Ring to visually separate stacked avatars
const ringClass = 'ring-2 ring-background'

// Size pixel map mirrors Avatar.vue sizeClasses for the overflow badge
const sizePixels: Record<AvatarSize, string> = {
  xs: '1.5rem',
  sm: '1.875rem',
  md: '2.5rem',
  lg: '3.5rem',
  xl: '4.5rem',
  '2xl': '5.5rem',
}

const fontSizes: Record<AvatarSize, string> = {
  xs: '10px',
  sm: '0.75rem',
  md: '0.875rem',
  lg: '1rem',
  xl: '1.125rem',
  '2xl': '1.25rem',
}
</script>

<template>
  <div :class="['flex items-center', props.class]">
    <div
      v-for="(item, index) in visibleItems"
      :key="index"
      :class="[index !== 0 ? overlapClass[overlap] : '', 'relative shrink-0']">
      <Tooltip
        :disabled="!item.heading && !item.text"
        placement="top"
        contentClass="min-w-[100px] px-10!">
        <Avatar
          :src="item.src"
          :alt="item.alt"
          :fallback="item.fallback"
          :size="size"
          :rounded="rounded"
          :class="ringClass" />
        <template #content>
          <div class="flex flex-col gap-0.5 text-left">
            <span v-if="item.heading" class="font-semibold text-sm text-tooltip-foreground">
              {{ item.heading }}
            </span>
            <span v-if="item.text" class="text-xs text-tooltip-foreground/70">
              {{ item.text }}
            </span>
          </div>
        </template>
      </Tooltip>
    </div>

    <!-- Overflow badge -->
    <div
      v-if="overflowCount > 0"
      :class="[
        overlapClass[overlap],
        'relative shrink-0 flex items-center justify-center',
        'bg-muted text-muted-foreground font-medium',
        ringClass,
        rounded === 'full'
          ? 'rounded-full'
          : rounded === 'none'
            ? 'rounded-none'
            : `rounded-${rounded}`,
      ]"
      :style="{
        // Match the same size as Avatar sizeClasses
        width: sizePixels[size],
        height: sizePixels[size],
        fontSize: fontSizes[size],
      }">
      +{{ overflowCount }}
    </div>
  </div>
</template>
