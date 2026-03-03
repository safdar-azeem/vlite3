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
  iconBoxShape: 'rounded',
  iconBoxStyle: 'transparent',
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
    props.attached ? 'gap-0 border-t border-l overflow-hidden' : 'gap-3 sm:gap-4.5',
    props.variant === 'shadow' && props.attached ? 'shadow-md' : '',
    props.class,
  ].join(' ')
})

const getItemClass = (item: StatItemSchema, index: number) => {
  const base = 'flex p-5 relative transition-all duration-200'

  const layoutClasses: Record<string, string> = {
    'icon-left': 'flex-row items-center gap-3 text-left',
    'icon-right': 'flex-row items-center justify-between gap-3 text-left',
    'icon-top': 'flex-col items-start gap-3 text-left',
    // title top, value bottom-left, icon bottom-right
    'title-top-icon-bottom-right': 'flex-col items-start gap-0 text-left',
    // centered: value on top (bigger/bold), title below — no icon
    'centered-value-title': 'flex-col items-center justify-center text-center gap-1',
    // floating icon overlapping card top-right corner
    'floating-icon': 'flex-col items-start gap-1 text-left',
    // split-bar: colored left border accent with stacked text
    'split-bar': 'flex-row items-center gap-3 text-left border-l-4',
  }

  const lClass = layoutClasses[props.layout] || layoutClasses['icon-left']

  let variantClasses = ''

  if (props.attached) {
    variantClasses = 'border-b border-r hover:bg-muted/30'
    if (props.variant !== 'transparent') {
      variantClasses += ' bg-card'
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
        variantClasses = `${solidMap[c] || solidMap.primary}`
        break
      }
      case 'outline':
        variantClasses = 'bg-body border'
        break
      case 'shadow':
        variantClasses = 'bg-body shadow-md border border-border/50'
        break
      case 'transparent':
        variantClasses = 'bg-transparent'
        break
    }
    variantClasses += ' rounded-lg'
  }

  return [base, lClass, variantClasses].join(' ')
}

const getItemStyle = (item: StatItemSchema) => {
  if (props.variant === 'solid' && !props.attached) {
    const c = item.color
    if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
      return { backgroundColor: `${c}15` }
    }
  }
  // split-bar layout: apply border-left color
  if (props.layout === 'split-bar') {
    const c = item.color
    const colorMap: Record<string, string> = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
      info: 'var(--color-info)',
    }
    if (c) {
      const borderColor = colorMap[c] || c
      return { borderLeftColor: borderColor }
    }
  }
  return {}
}

// Compute icon box shape class
const iconShapeClass = computed(() => {
  if (props.iconBoxShape === 'full-rounded') return 'rounded-full'
  if (props.iconBoxShape === 'none') return 'rounded-none'
  return 'rounded-lg'
})

const getIconBoxClass = (item: StatItemSchema) => {
  const base = `flex items-center justify-center shrink-0 ${iconShapeClass.value} p-3`
  const c = item.color || 'primary'

  // Transparent icon box: no background, only icon color
  if (props.iconBoxStyle === 'transparent') {
    const colorOnlyMap: Record<string, string> = {
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      success: 'text-success-dark',
      warning: 'text-warning-dark',
      danger: 'text-danger-dark',
      info: 'text-info-dark',
    }
    return `${base} bg-transparent ${colorOnlyMap[c] || 'text-primary'}`
  }

  // Filled icon box (default)
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
      success: 'bg-success-light text-success-dark',
      warning: 'bg-warning-light text-warning-dark',
      danger: 'bg-danger-light text-danger-dark',
      info: 'bg-info-light text-info-dark',
    }
    return `${base} ${map[c] || map.primary}`
  }
}

const getIconBoxStyle = (item: StatItemSchema) => {
  const c = item.color
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
}
</script>

<template>
  <div :class="containerClass">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      :class="getItemClass(item, index)"
      :style="getItemStyle(item)">
      <!-- ====== LAYOUT: title-top-icon-bottom-right ====== -->
      <template v-if="layout === 'title-top-icon-bottom-right'">
        <!-- Title at top -->
        <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate w-full'">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <!-- Bottom row: value left, icon right -->
        <div class="flex items-end justify-between w-full mt-3">
          <div>
            <p :class="valueSize || 'text-2xl font-bold text-foreground truncate'">
              {{ item.value }}
            </p>
            <div v-if="item.trend" class="mt-1 flex items-center gap-1 text-sm">
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
          <div v-if="item.icon" :class="getIconBoxClass(item)" :style="getIconBoxStyle(item)">
            <Icon :icon="item.icon" :class="iconSize || 'w-6 h-6'" />
          </div>
        </div>
      </template>

      <!-- ====== LAYOUT: centered-value-title (no icon) ====== -->
      <template v-else-if="layout === 'centered-value-title'">
        <p :class="valueSize || 'text-3xl font-bold text-foreground'">
          {{ item.value }}
        </p>
        <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground'">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <div v-if="item.trend" class="flex items-center gap-1 text-sm">
          <Icon
            :icon="item.trend.isPositive ? 'lucide:trending-up' : 'lucide:trending-down'"
            :class="item.trend.isPositive ? 'text-success' : 'text-danger'"
            class="w-4 h-4 shrink-0" />
          <span
            :class="item.trend.isPositive ? 'text-success-dark' : 'text-danger-dark'"
            class="font-medium">
            {{ item.trend.value }}
          </span>
        </div>
      </template>

      <!-- ====== LAYOUT: floating-icon (icon absolutely positioned top-right) ====== -->
      <template v-else-if="layout === 'floating-icon'">
        <div
          v-if="item.icon"
          :class="[getIconBoxClass(item), 'absolute top-4 right-4']"
          :style="getIconBoxStyle(item)">
          <Icon :icon="item.icon" :class="iconSize || 'w-6 h-6'" />
        </div>
        <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate pr-12'">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <p :class="valueSize || 'text-2xl font-bold text-foreground truncate mt-1'">
          {{ item.value }}
        </p>
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
      </template>

      <!-- ====== LAYOUT: split-bar (colored left border, stacked text, no icon) ====== -->
      <template v-else-if="layout === 'split-bar'">
        <div class="flex-1 flex flex-col justify-center min-w-0">
          <h3
            :class="
              titleSize ||
              'text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate'
            ">
            {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
          </h3>
          <p :class="valueSize || 'text-3xl font-black text-foreground truncate mt-0.5'">
            {{ item.value }}
          </p>
          <div v-if="item.trend" class="mt-1 flex items-center gap-1 text-sm">
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
      </template>

      <!-- ====== LAYOUTS: icon-left / icon-top / icon-right (original) ====== -->
      <template v-else>
        <div
          v-if="item.icon && layout !== 'icon-right'"
          :class="getIconBoxClass(item)"
          :style="getIconBoxStyle(item)">
          <Icon :icon="item.icon" :class="iconSize || 'w-6 h-6'" />
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
          <Icon :icon="item.icon" :class="iconSize || 'w-6 h-6'" />
        </div>
      </template>
    </div>
  </div>
</template>
