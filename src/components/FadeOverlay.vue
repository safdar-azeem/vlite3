<script setup lang="ts">
import { computed } from 'vue'

export interface FadeOverlayProps {
  direction?: 'top' | 'bottom' | 'left' | 'right'
  coverage?: string | number
}

const props = withDefaults(defineProps<FadeOverlayProps>(), {
  direction: 'bottom',
  coverage: '20%',
})

const positionStyles = computed(() => {
  const coverageValue = typeof props.coverage === 'number' ? `${props.coverage}%` : props.coverage

  // Fades to the theme's background color which natively adapts to dark/light mode
  const color = 'var(--color-background)'

  switch (props.direction) {
    case 'top':
      return {
        top: 0,
        left: 0,
        right: 0,
        height: coverageValue,
        background: `linear-gradient(to top, transparent, ${color})`,
      }
    case 'bottom':
      return {
        bottom: 0,
        left: 0,
        right: 0,
        height: coverageValue,
        background: `linear-gradient(to bottom, transparent, ${color})`,
      }
    case 'left':
      return {
        top: 0,
        bottom: 0,
        left: 0,
        width: coverageValue,
        background: `linear-gradient(to left, transparent, ${color})`,
      }
    case 'right':
      return {
        top: 0,
        bottom: 0,
        right: 0,
        width: coverageValue,
        background: `linear-gradient(to right, transparent, ${color})`,
      }
    default:
      return {}
  }
})
</script>

<template>
  <div class="absolute pointer-events-none z-10" :style="positionStyles"></div>
</template>
