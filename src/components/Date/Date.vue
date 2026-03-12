<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useVLiteConfig } from '@/core'

const props = withDefaults(
  defineProps<{
    /** The date value to format (can be string, number/timestamp, or Date object) */
    value?: string | number | Date
    /** Custom format string overriding the global configuration */
    format?: string
  }>(),
  {}
)

const config = useVLiteConfig()

const activeFormat = computed(() => {
  return props.format || config?.components?.date?.format || 'MM/DD/YYYY'
})

const formattedDate = computed(() => {
  if (!props.value) return '--'
  
  const d = dayjs(props.value)
  if (!d.isValid()) return String(props.value)
  
  return d.format(activeFormat.value)
})
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
