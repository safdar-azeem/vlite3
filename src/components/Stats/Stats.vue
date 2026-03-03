<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'
import type { StatsProps, StatItemSchema } from './types'

const props = withDefaults(defineProps<StatsProps>(), {
  variant: 'outline',
  layout: 'icon-left',
  columns: 4,
  attached: false,
  titleSize: '',
  valueSize: '',
  iconSize: '',
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
  return [
    'grid',
    gridColsClass.value,
    props.attached ? 'gap-0 border-t border-l  overflow-hidden' : 'gap-4 sm:gap-6',
    props.variant === 'shadow' && props.attached ? 'shadow-md' : '',
    props.class,
  ].join(' ')
})

const getItemClass = (item: StatItemSchema, index: number) => {
  const base = 'flex p-5 relative transition-all duration-200'

  const layoutClasses = {
    'icon-left': 'flex-row items-center gap-4 text-left',
    'icon-right': 'flex-row items-center justify-between gap-4 text-left',
    'icon-top': 'flex-col items-start gap-4 text-left',
  }[props.layout]

  let variantClasses = ''

  if (props.attached) {
    variantClasses = 'border-b border-r hover:bg-muted/30'
    if (props.variant !== 'transparent') {
      variantClasses += 'bg-card'
    }
  } else {
    switch (props.variant) {
      case 'solid': {
        const c = item.color || 'primary'
        const solidMap: Record<string, string> = {
          primary: 'bg-primary-light',
          secondary: 'bg-secondary',
          success: 'bg-success-light',
          warning: 'bg-warning-light',
          danger: 'bg-danger-light',
          info: 'bg-info-light',
        }
        variantClasses = `${solidMap[c] || solidMap.primary} `
        break
      }
      case 'outline':
        variantClasses = 'bg-body border'
        break
      case 'shadow':
        variantClasses = 'bg-body shadow-md border border-border/50'
        break
      case 'transparent':
        variantClasses = 'bg-transparent '
        break
    }

    variantClasses += ' rounded-xl'
  }

  return [base, layoutClasses, variantClasses].join(' ')
}

const getItemStyle = (item: StatItemSchema) => {
  if (props.variant === 'solid' && !props.attached) {
    const c = item.color
    if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
      // For custom hex colors, add a 15% opacity background
      return { backgroundColor: `${c}15` }
    }
  }
  return {}
}

const getIconBoxClass = (item: StatItemSchema) => {
  const base = 'flex items-center justify-center shrink-0 rounded-lg p-3 '
  const c = item.color || 'primary'

  if (props.variant === 'solid' && !props.attached) {
    const solidMap: Record<string, string> = {
      primary: 'bg-primary text-primary-fg',
      secondary: 'bg-foreground text-background',
      success: 'bg-success text-success-fg',
      warning: 'bg-warning text-warning-fg',
      danger: 'bg-danger text-danger-fg',
      info: 'bg-info text-info-fg',
    }
    return base + (solidMap[c] || solidMap.primary)
  } else {
    const map: Record<string, string> = {
      primary: 'bg-primary-light text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success-light text-success-dark',
      warning: 'bg-warning-light text-warning-dark',
      danger: 'bg-danger-light text-danger-dark',
      info: 'bg-info-light text-info-dark',
    }
    return base + (map[c] || map.primary)
  }
}

const getIconBoxStyle = (item: StatItemSchema) => {
  const c = item.color
  if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
    if (props.variant === 'solid' && !props.attached) {
      return { backgroundColor: c, color: '#fff' }
    }
    return { color: c, backgroundColor: `${c}20` }
  }
  return {}
}
</script>

<template>
  <div :class="containerClass">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      :class="getItemClass(item, index)"
      :style="getItemStyle(item)">
      <div
        v-if="item.icon && layout !== 'icon-right'"
        :class="getIconBoxClass(item)"
        :style="getIconBoxStyle(item)">
        <Icon :icon="item.icon" :class="iconSize || 'w-5 h-5'" />
      </div>

      <div class="flex-1 flex flex-col justify-center min-w-0">
        <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate'">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <div class="flex items-baseline gap-2 mt-1">
          <p :class="valueSize || 'text-2xl font-bold text-foreground truncate'">
            {{ item.value }}
          </p>
        </div>

        <div v-if="item.trend" class="mt-2 flex items-center gap-1.5 text-sm">
          <Icon
            :icon="item.trend.isPositive ? 'lucide:trending-up' : 'lucide:trending-down'"
            :class="item.trend.isPositive ? 'text-success' : 'text-danger'"
            class="w-4 h-4 shrink-0" />
          <span
            :class="item.trend.isPositive ? 'text-success-dark' : 'text-danger-dark'"
            class="font-medium whitespace-nowrap">
            {{ item.trend.value }}
          </span>
          <span v-if="item.trend.label" class="text-muted-foreground truncate">
            {{ item.trend.label }}
          </span>
        </div>
      </div>

      <div
        v-if="item.icon && layout === 'icon-right'"
        :class="getIconBoxClass(item)"
        :style="getIconBoxStyle(item)">
        <Icon :icon="item.icon" :class="iconSize || 'w-5 h-5'" />
      </div>
    </div>
  </div>
</template>
