<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'
import type { ListField, StackedBorderStyle } from './types'
import { getObjectValue, getStatusColorClass, formatDate, formatPrice, formatNumber } from './utils'

interface Props {
  field: ListField
  data: Record<string, any>
  isLast?: boolean
  showBorderBottom?: boolean
  variant?: string
  showColon?: boolean
  index?: number
  /**
   * For the stacked variant only.
   * The column position of this item within its row (0-based).
   * Passed down from List.vue as `idx % stackedColCount`.
   */
  stackedColIndex?: number
  /**
   * For the stacked variant only.
   * Controls whether left border dividers appear between cells.
   * - `'none'`    — No borders (default, stock look).
   * - `'divider'` — Left border on non-first cells per row + extra left padding.
   */
  stackedBorderStyle?: StackedBorderStyle
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false,
  showBorderBottom: true,
  variant: 'default',
  showColon: true,
  index: 0,
  stackedColIndex: 0,
  stackedBorderStyle: 'none',
})

const showSensitive = ref(false)

const rawValue = computed(() => getObjectValue(props.field.key, props.data))

const resolvedValue = computed(() => {
  const val = rawValue.value

  if (props.field.format) {
    return props.field.format(val, props.data)
  }

  if (val === null || val === undefined || val === '') {
    return props.field.emptyText ?? '--'
  }

  switch (props.field.type) {
    case 'date':
      return formatDate(val, false)
    case 'dateTime':
      return formatDate(val, true)
    case 'time':
      return formatDate(val, true)
    case 'price':
      return formatPrice(val)
    case 'number':
      return formatNumber(val)
    case 'boolean':
      return val ? 'Yes' : 'No'
    default:
      return String(val)
  }
})

const labelText = computed(() =>
  props.field.titleI18n ? $t(props.field.titleI18n) : (props.field.title ?? props.field.key)
)

const valueClass = computed(() => {
  const classes: string[] = []

  if (props.field.addStatusColor) {
    const sc = getStatusColorClass(resolvedValue.value)
    if (sc) classes.push(sc)
  }

  if (props.field.class) {
    if (typeof props.field.class === 'function') {
      const dynamic = props.field.class(rawValue.value, props.data)
      if (dynamic) classes.push(dynamic)
    } else {
      classes.push(props.field.class)
    }
  }

  return classes.join(' ')
})

const isImageType = computed(() => props.field.type === 'image')

const isStripedOdd = computed(() => props.variant === 'striped' && props.index % 2 !== 0)

const isStacked = computed(() => props.variant === 'stacked')

/**
 * Stacked cell padding/border class.
 *
 * `stackedBorderStyle === 'none'`    → uniform padding for all cells, no extra borders (stock default).
 * `stackedBorderStyle === 'divider'` → non-first cells in a row get a left border + extra left padding.
 */
const stackedCellClass = computed(() => {
  if (props.stackedBorderStyle === 'divider' && props.stackedColIndex !== 0) {
    // Non-first cell: left divider border + increased left padding
    return 'border-l border-border pl-4 pr-3.5 py-2'
  }
  // Default / stock: uniform padding, no extra borders
  return 'px-3.5 py-2'
})
</script>

<template>
  <!-- ═══ Stacked layout (label on top, value below) ═══ -->
  <div
    v-if="isStacked"
    :class="[
      'list-field-row list-field-row--stacked flex flex-col gap-0.5 min-w-0',
      stackedCellClass,
    ]"
    role="row">
    <!-- Label -->
    <div class="flex items-center gap-1.5 min-w-0">
      <Icon v-if="field.icon" :icon="field.icon" class="w-3 h-3 text-muted-foreground shrink-0" />
      <span class="text-xs font-normal text-muted-foreground leading-snug truncate">
        {{ labelText }}
      </span>
    </div>

    <!-- Value area -->
    <div class="min-w-0">
      <!-- Named slot override -->
      <template v-if="$slots[field.key]">
        <slot :name="field.key" :value="rawValue" :resolved="resolvedValue" :data="data" />
      </template>

      <!-- Custom Vue component -->
      <template v-else-if="field.component">
        <component :is="field.component" :data="data" :value="rawValue" />
      </template>

      <!-- Sensitive / masked value -->
      <template v-else-if="field.isSensitive">
        <div class="flex items-center gap-1.5">
          <span
            v-if="showSensitive"
            class="text-sm font-semibold text-foreground break-words leading-snug"
            :class="valueClass"
            v-html="resolvedValue" />
          <span
            v-else
            class="text-sm font-semibold text-foreground tracking-widest select-none"
            aria-hidden="true">
            &#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;
          </span>
          <button
            type="button"
            class="shrink-0 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            :aria-label="showSensitive ? 'Hide value' : 'Show value'"
            @click="showSensitive = !showSensitive">
            <Icon :icon="showSensitive ? 'lucide:eye-off' : 'lucide:eye'" class="w-3 h-3" />
          </button>
        </div>
      </template>

      <!-- Image / avatar -->
      <template v-else-if="isImageType">
        <img
          :src="resolvedValue"
          :alt="labelText"
          class="w-8 h-8 rounded-full object-cover border border-border mt-0.5" />
      </template>

      <!-- Default rendered value -->
      <template v-else>
        <span
          class="text-sm font-semibold text-foreground break-words leading-snug"
          :class="valueClass"
          v-html="resolvedValue" />
      </template>
    </div>
  </div>

  <!-- ═══ Default horizontal layout (label left, value right) ═══ -->
  <div
    v-else
    class="list-field-row flex justify-between gap-3 px-3 py-2.5 transition-colors"
    :class="[
      showBorderBottom && !isLast ? 'border-b border-border' : '',
      isStripedOdd ? 'bg-muted/40' : '',
      variant === 'compact' ? 'py-1.5!' : '',
      variant === 'minimal' ? 'px-0!' : '',
    ]"
    role="row">
    <!-- Label -->
    <div class="flex items-center gap-1.5 shrink-0 min-w-0 max-w-[48%]">
      <Icon v-if="field.icon" :icon="field.icon" class="w-3.5 h-3.5 text-gray-800 shrink-0" />
      <span class="text-sm font-medium text-gray-800 truncate leading-snug">
        {{ labelText }}{{ showColon ? ':' : '' }}
      </span>
    </div>

    <!-- Value area -->
    <div class="flex items-center justify-end gap-2 min-w-0 flex-1">
      <!-- Named slot override -->
      <template v-if="$slots[field.key]">
        <slot :name="field.key" :value="rawValue" :resolved="resolvedValue" :data="data" />
      </template>

      <!-- Custom Vue component -->
      <template v-else-if="field.component">
        <component :is="field.component" :data="data" :value="rawValue" />
      </template>

      <!-- Sensitive / masked value -->
      <template v-else-if="field.isSensitive">
        <span
          v-if="showSensitive"
          class="text-sm text-gray-600 text-right break-words"
          :class="valueClass"
          v-html="resolvedValue" />
        <span v-else class="text-sm text-gray-600 tracking-widest select-none" aria-hidden="true">
          &#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;
        </span>
        <button
          type="button"
          class="shrink-0 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          :aria-label="showSensitive ? 'Hide value' : 'Show value'"
          @click="showSensitive = !showSensitive">
          <Icon :icon="showSensitive ? 'lucide:eye-off' : 'lucide:eye'" class="w-3.5 h-3.5" />
        </button>
      </template>

      <!-- Image / avatar -->
      <template v-else-if="isImageType">
        <img
          :src="resolvedValue"
          :alt="labelText"
          class="w-8 h-8 rounded-full object-cover border border-border" />
      </template>

      <!-- Default rendered value -->
      <template v-else>
        <span
          class="text-sm text-gray-900 text-right break-words leading-snug"
          :class="valueClass"
          v-html="resolvedValue" />
      </template>
    </div>
  </div>
</template>
