<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../../Icon.vue'
import type { StatTrend, StatsLayout } from '../types'

const props = defineProps<{
  trend: StatTrend
  layout?: StatsLayout
}>()

const isInline = computed(() => props.layout === 'inline-label-value')
const isCentered = computed(() => props.layout === 'centered-value-title')

const containerClass = computed(() => {
  if (isInline.value) {
    return [
      'shrink-0 flex items-center gap-0.5 text-xs font-medium',
      props.trend.isPositive ? 'text-success-dark' : 'text-danger-dark'
    ].join(' ')
  }
  
  const base = 'flex items-center text-sm'
  
  if (isCentered.value) {
    return `${base} gap-1`
  }

  if (props.layout === 'floating-icon' || props.layout === 'icon-left' || props.layout === 'icon-right' || props.layout === 'icon-top') {
    return `${base} mt-2 gap-1.5`
  }
  
  return `${base} mt-1 gap-1`
})
</script>

<template>
  <span v-if="isInline" :class="containerClass">
    <Icon
      :icon="trend.isPositive ? 'lucide:trending-up' : 'lucide:trending-down'"
      class="w-3 h-3" />
    {{ trend.value }}
  </span>
  <div v-else :class="containerClass">
    <Icon
      :icon="trend.isPositive ? 'lucide:trending-up' : 'lucide:trending-down'"
      :class="trend.isPositive ? 'text-success' : 'text-danger'"
      class="w-4 h-4 shrink-0" />
    <span
      :class="trend.isPositive ? 'text-success-dark' : 'text-danger-dark'"
      class="font-medium whitespace-nowrap">
      {{ trend.value }}
    </span>
    <span v-if="trend.label && !isCentered" class="text-muted-foreground truncate">
      {{ trend.label }}
    </span>
  </div>
</template>
