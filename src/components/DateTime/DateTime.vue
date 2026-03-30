<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/functions'

const props = withDefaults(
  defineProps<{
    /** The date value to format (can be string, number/timestamp, or Date object) */
    value?: string | number | Date
    /** Custom format string overriding the global configuration */
    format?: string
    /** Semantic formatting type ('date', 'dateTime', 'time') */
    type?: 'date' | 'dateTime' | 'time'
  }>(),
  {}
)

const formattedDate = computed(() => {
  return formatDate(props.value, props.format, props.type)
})
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
