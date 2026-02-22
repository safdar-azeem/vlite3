<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  for?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const classes = computed(() => {
  return [
    'text-sm  leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class,
  ].join(' ')
})
</script>

<template>
  <label :for="props.for" :class="classes">
    <slot />
  </label>
</template>
