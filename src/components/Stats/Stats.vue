<script setup lang="ts">
import { computed } from 'vue'
import type { StatsProps } from './types'
import StatItem from './StatItem.vue'

const props = withDefaults(defineProps<StatsProps>(), {
  variant: 'outline',
  layout: 'icon-left',
  columns: 4,
  attached: false,
  loading: false,
  titleSize: '',
  valueSize: '',
  iconSize: '',
  iconBoxShape: 'rounded',
  iconBoxStyle: 'filled',
  class: '',
})

const gridColsClass = computed(() => {
  const c = Number(props.columns) || 4
  if (c === 1) return 'grid-cols-1'
  if (c === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (c === 3) return 'grid-cols-1 sm:grid-cols-3'
  if (c === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  if (c === 5) return 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5'
  if (c === 6) return 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})

const containerClass = computed(() => {
  // Transparent + attached: no outer borders — they would show as a visible line
  // since there is no background to blend them away.
  const attachedBorderClass =
    props.attached && props.variant !== 'transparent'
      ? 'border-t border-l border-border overflow-hidden'
      : 'overflow-hidden'

  return [
    'grid',
    gridColsClass.value,
    props.attached ? `gap-0 ${attachedBorderClass}` : 'gap-3 sm:gap-4.5',
    props.variant === 'shadow' && props.attached ? 'shadow-md' : '',
    props?.layout === 'inline-label-value' ? 'rounded-sm' : '',
    props.class,
  ].join(' ')
})
</script>

<template>
  <div :class="containerClass">
    <StatItem
      v-for="(item, index) in items"
      :key="item.id || index"
      :item="item"
      :variant="variant"
      :layout="layout"
      :attached="attached"
      :loading="loading"
      :titleSize="titleSize"
      :valueSize="valueSize"
      :iconSize="iconSize"
      :iconBoxShape="iconBoxShape"
      :iconBoxStyle="iconBoxStyle"
    />
  </div>
</template>
