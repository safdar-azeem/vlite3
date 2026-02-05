<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  class: '',
})

const classes = computed(() => {
  return [
    'flex',
    props.orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row items-center space-x-1',
    props.class,
  ].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
