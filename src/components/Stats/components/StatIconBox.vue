<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../../Icon.vue'
import type {
  StatItemSchema,
  StatsVariant,
  StatsLayout,
  IconBoxShape,
  IconBoxStyle,
} from '../types'

const props = defineProps<{
  item: StatItemSchema
  variant?: StatsVariant
  layout?: StatsLayout
  attached?: boolean
  iconBoxShape?: IconBoxShape
  iconBoxStyle?: IconBoxStyle
  iconSize?: string
  class?: string
}>()

const isInline = computed(() => props.layout === 'inline-label-value')

const iconShapeClass = computed(() => {
  if (props.iconBoxShape === 'full-rounded') return 'rounded-full'
  if (props.iconBoxShape === 'none') return 'rounded-none'
  return 'rounded-lg'
})

const boxClass = computed(() => {
  if (isInline.value) {
    const c = props.item.color || 'primary'
    const colorMap: Record<string, string> = {
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      success: 'text-success-subtle-fg',
      warning: 'text-warning-subtle-fg',
      danger: 'text-danger-subtle-fg',
      info: 'text-info-subtle-fg',
    }
    return `shrink-0 ${colorMap[c] || 'text-primary'} ${props.class || ''}`
  }

  const base = `flex items-center justify-center shrink-0 ${iconShapeClass.value} p-3 ${props.class || ''}`
  const c = props.item.color || 'primary'

  if (props.iconBoxStyle === 'transparent') {
    const colorOnlyMap: Record<string, string> = {
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      success: 'text-success-subtle-fg',
      warning: 'text-warning-subtle-fg',
      danger: 'text-danger-subtle-fg',
      info: 'text-info-subtle-fg',
    }
    return `${base} bg-transparent ${colorOnlyMap[c] || 'text-primary'}`
  }

  if (props.variant === 'solid' && !props.attached) {
    const solidMap: Record<string, string> = {
      primary: 'bg-primary text-primary-fg',
      secondary: 'bg-foreground text-background',
      success: 'bg-success text-success-fg',
      warning: 'bg-warning text-warning-fg',
      danger: 'bg-danger text-danger-fg',
      info: 'bg-info text-info-fg',
    }
    return `${base} ${solidMap[c] || solidMap.primary}`
  } else {
    const map: Record<string, string> = {
      primary: 'bg-primary-light text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success-subtle text-success-subtle-fg',
      warning: 'bg-warning-subtle text-warning-subtle-fg',
      danger: 'bg-danger-subtle text-danger-subtle-fg',
      info: 'bg-info-subtle text-info-subtle-fg',
    }
    return `${base} ${map[c] || map.primary}`
  }
})

const boxStyle = computed(() => {
  const c = props.item.color
  if (isInline.value) {
    if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
      return { color: c }
    }
    return {}
  }

  if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
    if (props.iconBoxStyle === 'transparent') {
      return { color: c }
    }
    if (props.variant === 'solid' && !props.attached) {
      return { backgroundColor: c, color: '#fff' }
    }
    return { color: c, backgroundColor: `${c}20` }
  }
  return {}
})
</script>

<template>
  <div v-if="!isInline && item.icon" :class="boxClass" :style="boxStyle">
    <Icon :icon="item.icon" :class="iconSize || 'w-6 h-6'" />
  </div>
  <Icon
    v-else-if="isInline && item.icon"
    :icon="item.icon"
    :class="[boxClass, iconSize || 'w-4.5 h-4.5']"
    :style="boxStyle"
  />
</template>
