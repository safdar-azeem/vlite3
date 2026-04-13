<script setup lang="ts">
import { computed } from 'vue'
import { useVLiteConfig } from '@/core'
import Tooltip from '../Tooltip.vue'

const props = withDefaults(
  defineProps<{
    value?: number | string
    currency?: string
    numberFormat?: 'standard' | 'compact'
    compactThreshold?: number
  }>(),
  {
    value: 0,
  }
)

const config = useVLiteConfig()

const activeCurrency = computed(() => {
  return props.currency || config?.components?.price?.currency || 'USD'
})

const activeFormat = computed(() => {
  return props.numberFormat || config?.components?.price?.numberFormat || 'compact'
})

const formattedPrice = computed(() => {
  const numericValue = Number(props.value) || 0
  try {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: activeCurrency.value,
    }
    
    const threshold = props.compactThreshold ?? config?.components?.price?.compactThreshold ?? 1000
    if (activeFormat.value === 'compact' && Math.abs(numericValue) >= threshold) {
      options.notation = 'compact'
      options.compactDisplay = 'short'
    }
    return new Intl.NumberFormat('en-US', options).format(numericValue)
  } catch (e) {
    return `$${numericValue.toFixed(2)}`
  }
})

const exactFormattedPrice = computed(() => {
  const numericValue = Number(props.value) || 0
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency.value,
    }).format(numericValue)
  } catch (e) {
    return `$${numericValue.toFixed(2)}`
  }
})

const isCompacted = computed(() => {
  const numericValue = Number(props.value) || 0
  const threshold = props.compactThreshold ?? config?.components?.price?.compactThreshold ?? 1000
  return activeFormat.value === 'compact' && Math.abs(numericValue) >= threshold
})
</script>

<template>
  <Tooltip :content="exactFormattedPrice" :disabled="!isCompacted">
    <span>{{ formattedPrice }}</span>
  </Tooltip>
</template>
