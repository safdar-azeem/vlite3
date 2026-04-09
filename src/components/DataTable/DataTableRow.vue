<script setup lang="ts">
import { computed } from 'vue'
import CheckBox from '../CheckBox.vue'
import Price from '../Price/Price.vue'
import DateTime from '../DateTime/DateTime.vue'
import type { TableHeader } from './types'

interface Props {
  row: any
  headers: TableHeader[]
  index: number
  keyField: string
  selectable?: boolean
  isSelected?: boolean
  hoverable?: boolean
  striped?: boolean
  compact?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  cellBordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyField: '_id',
  selectable: false,
  isSelected: false,
  hoverable: true,
  striped: false,
  compact: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'select', id: any): void
  (e: 'rowClick', payload: { row: any; index: number }): void
}>()

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const formatValue = (header: TableHeader, value: any, row: any): string => {
  if (header.format) {
    return header.format(value, row)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  if (header.type === 'number') {
    return new Intl.NumberFormat('en-US').format(Number(value))
  }

  return String(value)
}

const getCellClass = (header: TableHeader, value: any, row: any): string => {
  const classes: string[] = []

  if (header.width && /(?:^|\s|:)w-/.test(header.width)) {
    classes.push(header.width)
  }

  if (header.minWidth && /(?:^|\s|:)min-w-/.test(header.minWidth)) {
    classes.push(header.minWidth)
  }

  if (header.capitalize) {
    classes.push('capitalize')
  }

  if (header.addStatusColor) {
    const statusClasses = getStatusClass(value)
    if (statusClasses) classes.push(statusClasses)
  }

  if (typeof header.class === 'function') {
    const dynamicClass = header.class(value, row)
    if (dynamicClass) classes.push(dynamicClass)
  } else if (header.class) {
    classes.push(header.class)
  }

  return classes.join(' ')
}

const getStatusClass = (value: any): string => {
  const statusMap: Record<string, string> = {
    active: 'text-success font-medium',
    inactive: 'text-muted-foreground',
    pending: 'text-warning font-medium',
    completed: 'text-success font-medium',
    cancelled: 'text-destructive font-medium',
    failed: 'text-destructive font-medium',
    success: 'text-success font-medium',
    error: 'text-destructive font-medium',
    warning: 'text-warning font-medium',
    info: 'text-info font-medium',
    high: 'text-destructive font-medium',
    medium: 'text-warning font-medium',
    low: 'text-muted-foreground',
  }

  const normalized = String(value)
    .toLowerCase()
    .replace(/[-_\s]/g, '')
  return statusMap[normalized] || ''
}

const alignClass = (header: TableHeader): string => {
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[header.align || 'left']
}

const rowId = computed(() => getNestedValue(props.row, props.keyField))

const getSizeClass = () => {
  const { size, compact, cellBordered } = props
  if (size === 'xs' || compact)
    return `py-1.5! -text-fs-1.5! ${cellBordered ? 'px-3!' : 'pr-3 max-sm:pr-10!'}`
  if (size === 'sm') return `py-2! -text-fs-1.5! ${cellBordered ? 'px-3!' : 'pr-4 max-sm:pr-10!'}`
  if (size === 'lg') return `py-4! text-base ${cellBordered ? 'px-4!' : 'pr-6 max-sm:pr-12!'}`
  return `py-3! -text-fs-1.5! ${cellBordered ? 'px-3.5!' : 'pr-5! max-sm:pr-10!'}`
}

const handleRowClick = () => {
  emit('rowClick', { row: props.row, index: props.index })
}

const handleSelect = () => {
  emit('select', rowId.value)
}
</script>

<template>
  <tr
    class="border-b data-[state=selected]:bg-muted h-full"
    :class="[
      hoverable ? 'hover:bg-muted/20' : '',
      striped && index % 2 === 1 ? 'bg-muted/20' : 'bg-background',
      isSelected ? 'bg-muted! hover:bg-muted/30' : '',
      'group',
    ]"
    :data-state="isSelected ? 'selected' : undefined"
    @click="handleRowClick">
    <td v-if="selectable" class="px-0! py-1! align-middle text-center" @click.stop>
      <div class="flex items-center justify-center">
        <CheckBox :model-value="isSelected" size="xs" @update:model-value="handleSelect" />
      </div>
    </td>

    <td
      v-for="header in headers"
      :key="header.field"
      class="align-middle overflow-hidden max-w-[400px] whitespace-normal wrap-break-word"
      :style="{
        ...(header.width && !/(?:^|\s|:)w-/.test(header.width) ? { width: header.width } : {}),
        ...(header.minWidth && !/(?:^|\s|:)min-w-/.test(header.minWidth)
          ? { minWidth: header.minWidth }
          : {}),
      }"
      :class="[
        getSizeClass(),
        alignClass(header),
        header.hideOnMobile ? 'hidden md:table-cell' : '',
        getCellClass(header, getNestedValue(row, header.field), row),
      ]">
      <div class="max-h-[80px] overflow-y-auto w-full">
        <slot
          :name="header.field"
          :value="getNestedValue(row, header.field)"
          :row="row"
          :index="index"
          :field="header.field">
          <Price
            v-if="header.type === 'price'"
            :value="getNestedValue(row, header.field)"
            class="block"
            :title="String(getNestedValue(row, header.field))" />

          <DateTime
            v-else-if="header.type === 'date'"
            :value="getNestedValue(row, header.field)"
            class="block"
            :title="String(getNestedValue(row, header.field))" />

          <span
            v-else
            class="block"
            :title="String(getNestedValue(row, header.field))"
            v-html="formatValue(header, getNestedValue(row, header.field), row)" />
        </slot>
      </div>
    </td>
  </tr>
</template>
