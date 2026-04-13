<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/utils/i18n'
import { formatCurrency, formatNumber } from '@/utils/functions'
import type { StatItemSchema, StatsVariant, StatsLayout, IconBoxShape, IconBoxStyle } from './types'
import StatTrend from './components/StatTrend.vue'
import StatIconBox from './components/StatIconBox.vue'
import Tooltip from '../Tooltip.vue'
import { configState } from '@/core'

// Provide all the individual item props
const props = withDefaults(
  defineProps<{
    item: StatItemSchema
    variant?: StatsVariant
    layout?: StatsLayout
    attached?: boolean
    loading?: boolean
    titleSize?: string
    valueSize?: string
    iconSize?: string
    iconBoxShape?: IconBoxShape
    iconBoxStyle?: IconBoxStyle
  }>(),
  {
    variant: 'outline',
    layout: 'icon-left',
    attached: false,
    loading: false,
    titleSize: '',
    valueSize: '',
    iconSize: '',
    iconBoxShape: 'rounded',
    iconBoxStyle: 'filled',
  }
)

/**
 * Returns the display value for a stat item.
 * When item.isPrice is true, formats the value as a currency string
 * using the globally configured currency (via formatCurrency).
 * Otherwise returns the raw value as-is.
 */
function displayValue(item: StatItemSchema): string | number {
  const value = Number(item.value)
  if (item.isPrice) return formatCurrency(value, { numberFormat: item.numberFormat || 'compact', compactThreshold: item.compactThreshold })
  if (item.numberFormat) return formatNumber(value, { numberFormat: item.numberFormat, compactThreshold: item.compactThreshold })
  return item.value
}

const isItemCompacted = computed(() => {
  const value = Number(props.item.value) || 0
  if (!props.item.isPrice && !props.item.numberFormat) return false
  const activeFormat = props.item.numberFormat || (props.item.isPrice ? 'compact' : 'standard')
  if (activeFormat !== 'compact') return false
  const threshold = props.item.compactThreshold ?? configState?.components?.price?.compactThreshold ?? 1000
  return Math.abs(value) >= threshold
})

const exactValue = computed(() => {
  const value = Number(props.item.value) || 0
  if (props.item.isPrice) return formatCurrency(value, { numberFormat: 'standard' })
  if (props.item.numberFormat) return formatNumber(value, { numberFormat: 'standard' })
  return String(props.item.value)
})

const itemClass = computed(() => {
  const base =
    props.layout === 'inline-label-value'
      ? 'flex px-3.5 py-3'
      : props.layout === 'centered-value-title'
        ? 'flex px-1 py-1'
        : 'flex p-3'

  const layoutClasses: Record<string, string> = {
    'icon-left': 'flex-row items-center gap-3 text-left',
    'icon-right': 'flex-row items-center justify-between gap-3 text-left',
    'icon-top': 'flex-col items-start gap-1 px-5! pt-2! text-left',
    'title-top-icon-bottom-right': 'flex-col items-start gap-0 text-left px-5! py-4!',
    'centered-value-title': 'flex-col items-center justify-center text-center gap-0',
    'floating-icon': 'flex-col items-start gap-1 text-left relative',
    'split-bar': 'flex-row items-center gap-3 text-left border-l-4',
    'inline-label-value': 'flex-row items-center gap-2.5 text-left',
  }

  const lClass = layoutClasses[props.layout] || layoutClasses['icon-left']

  let variantClasses = ''

  if (props.attached) {
    if (props.variant === 'transparent') {
      variantClasses =
        'border-b border-r border-transparent bg-transparent hover:bg-muted/30 transition-colors'
    } else if (props.variant === 'outline') {
      variantClasses =
        'border-b border-r border-border bg-transparent hover:bg-muted/30 transition-colors'
    } else {
      variantClasses = 'border-b border-r border-border bg-card hover:bg-muted/30 transition-colors'
    }
  } else {
    switch (props.variant) {
      case 'solid': {
        const c = props.item.color || 'primary'
        const solidMap: Record<string, string> = {
          primary: 'bg-primary-light dark:ring-1 dark:ring-inset dark:ring-primary/20',
          secondary: 'bg-secondary dark:ring-1 dark:ring-inset dark:ring-secondary-foreground/20',
          success: 'bg-success-light dark:ring-1 dark:ring-inset dark:ring-success/20',
          warning: 'bg-warning-light dark:ring-1 dark:ring-inset dark:ring-warning/20',
          danger: 'bg-danger-light dark:ring-1 dark:ring-inset dark:ring-danger/20',
          info: 'bg-info-light dark:ring-1 dark:ring-inset dark:ring-info/20',
        }
        variantClasses = `${solidMap[c] || solidMap.primary}`
        break
      }
      case 'outline':
        variantClasses = 'border border-border'
        break
      case 'shadow':
        variantClasses = 'bg-card shadow-md border border-border/50'
        break
      case 'transparent':
        variantClasses = 'bg-transparent'
        break
    }
    variantClasses += ' rounded-lg'
  }

  return [base, lClass, variantClasses].join(' ')
})

const itemStyle = computed(() => {
  if (props.variant === 'solid' && !props.attached) {
    const c = props.item.color
    if (c && !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(c)) {
      return { backgroundColor: `${c}15` }
    }
  }
  if (props.layout === 'split-bar') {
    const c = props.item.color
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
})
</script>

<template>
  <div :class="itemClass" :style="itemStyle">
    <template v-if="layout === 'title-top-icon-bottom-right'">
      <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate w-full'">
        {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
      </h3>
      <div class="flex items-center justify-between w-full mt-1">
        <div>
          <div v-if="loading" class="h-8 w-24 bg-gray-50 animate-pulse rounded-md"></div>
          <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
            <p :class="valueSize || 'text-2xl font-bold text-foreground truncate'">
              {{ displayValue(item) }}
            </p>
          </Tooltip>
          <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
        </div>
        <StatIconBox
          v-if="item.icon"
          :item="item"
          :variant="variant"
          :layout="layout"
          :attached="attached"
          :icon-box-shape="iconBoxShape"
          :icon-box-style="iconBoxStyle"
          :icon-size="iconSize" />
      </div>
    </template>

    <template v-else-if="layout === 'centered-value-title'">
      <div v-if="loading" class="h-9 w-24 bg-gray-50 animate-pulse rounded-md"></div>
      <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
        <p :class="valueSize || 'text-3xl font-bold text-foreground'">
          {{ displayValue(item) }}
        </p>
      </Tooltip>
      <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground'">
        {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
      </h3>
      <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
    </template>

    <template v-else-if="layout === 'floating-icon'">
      <StatIconBox
        v-if="item.icon"
        :item="item"
        :variant="variant"
        :layout="layout"
        :attached="attached"
        :icon-box-shape="iconBoxShape"
        :icon-box-style="iconBoxStyle"
        :icon-size="iconSize"
        class="absolute top-4 right-4" />
      <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate pr-12'">
        {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
      </h3>
      <div v-if="loading" class="h-8 w-20 bg-gray-50 animate-pulse rounded-md mt-1"></div>
      <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
        <p :class="valueSize || 'text-2xl font-bold text-foreground truncate mt-1'">
          {{ displayValue(item) }}
        </p>
      </Tooltip>
      <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
    </template>

    <template v-else-if="layout === 'split-bar'">
      <div class="flex-1 flex flex-col justify-center min-w-0">
        <h3
          :class="
            titleSize ||
            'text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate'
          ">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <div v-if="loading" class="h-9 w-24 bg-gray-50 animate-pulse rounded-md mt-0.5"></div>
        <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
          <p :class="valueSize || 'text-3xl font-black text-foreground truncate mt-0.5'">
            {{ displayValue(item) }}
          </p>
        </Tooltip>
        <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
      </div>
    </template>

    <template v-else-if="layout === 'inline-label-value'">
      <StatIconBox
        v-if="item.icon"
        :item="item"
        :variant="variant"
        :layout="layout"
        :attached="attached"
        :icon-box-shape="iconBoxShape"
        :icon-box-style="iconBoxStyle"
        :icon-size="iconSize" />
      <span
        :class="titleSize || '-text-fs-2 font-medium text-muted-foreground truncate'"
        class="flex-1 min-w-0">
        {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
      </span>
      <div v-if="loading" class="h-6 w-5 bg-gray-50 animate-pulse rounded-sm shrink-0"></div>
      <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
        <span
          :class="valueSize || '-text-fs-1 font-semibold text-foreground tabular-nums shrink-0'">
          {{ displayValue(item) }}
        </span>
      </Tooltip>
      <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
    </template>

    <template v-else>
      <StatIconBox
        v-if="item.icon && layout !== 'icon-right'"
        :item="item"
        :variant="variant"
        :layout="layout"
        :attached="attached"
        :icon-box-shape="iconBoxShape"
        :icon-box-style="iconBoxStyle"
        :icon-size="iconSize" />

      <div class="flex-1 flex flex-col justify-center min-w-0">
        <h3 :class="titleSize || 'text-sm font-medium text-muted-foreground truncate'">
          {{ item.titleI18n ? $t(item.titleI18n) : item.title }}
        </h3>
        <div class="flex items-baseline gap-2 mt-1">
          <div v-if="loading" class="h-8 w-24 bg-gray-50 animate-pulse rounded-md"></div>
          <Tooltip v-else :content="exactValue" :disabled="!isItemCompacted">
            <p :class="valueSize || 'text-2xl font-bold text-foreground truncate'">
              {{ displayValue(item) }}
            </p>
          </Tooltip>
        </div>
        <StatTrend v-if="item.trend && !loading" :trend="item.trend" :layout="layout" />
      </div>

      <StatIconBox
        v-if="item.icon && layout === 'icon-right'"
        :item="item"
        :variant="variant"
        :layout="layout"
        :attached="attached"
        :icon-box-shape="iconBoxShape"
        :icon-box-style="iconBoxStyle"
        :icon-size="iconSize" />
    </template>
  </div>
</template>
