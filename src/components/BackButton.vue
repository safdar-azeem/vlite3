<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from './Button.vue'
import type { ButtonSize } from '@/types'

export interface BackButtonProps {
  /** Icon to display, defaults to a left arrow */
  icon?: string
  /** Button size variant */
  size?: ButtonSize
  /** Tooltip text shown on hover */
  tooltip?: string
  /** Custom CSS classes */
  class?: string
  /**
   * Fallback path when there's no browser history to go back to.
   * Defaults to '/'
   */
  fallback?: string
}

const props = withDefaults(defineProps<BackButtonProps>(), {
  icon: 'heroicons-solid:arrow-left',
  size: 'sm',
  tooltip: 'Go back',
  class: '',
  fallback: '/',
})

const router = useRouter()

function goBack() {
  // If we have real history (not the first page the user landed on), go back.
  // window.history.length > 1 is always true in many browsers, so we also
  // check if the previous entry in the router history exists.
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push(props.fallback)
  }
}
</script>

<template>
  <Button
    variant="ghost"
    :icon="icon"
    :size="size"
    :title="tooltip"
    :class="props.class"
    @click="goBack" />
</template>
