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
  return props.format || config?.components?.datetime?.format || 'MM/DD/YYYY'
})

const formattedDate = computed(() => {
  if (!props.value) return '--'

  if (typeof props.value === 'string') {
    const val = props.value.trim()
    // Check if value is a pure time string like "09:00", "9:00", or "17:00:00"
    if (/^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(val)) {
      const parts = val.split(':')
      const hh = parts[0].padStart(2, '0')
      const mm = parts[1]
      const ss = parts[2] || '00'

      // Prepend a dummy date so dayjs can parse it validly
      const dummyDate = `1970-01-01T${hh}:${mm}:${ss}`
      const d = dayjs(dummyDate)

      if (d.isValid()) {
        // Default to 'h:mm A' for time-only strings unless an explicit format is provided
        const timeFormat = props.format || 'h:mm A'
        return d.format(timeFormat)
      }
    }
  }
  
  const d = dayjs(props.value)
  if (!d.isValid()) return String(props.value)
  
  return d.format(activeFormat.value)
})
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
