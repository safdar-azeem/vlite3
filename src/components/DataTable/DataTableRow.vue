<script setup lang="ts">
import { computed } from 'vue'
import CheckBox from '../CheckBox.vue'
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
}

const props = withDefaults(defineProps<Props>(), {
  keyField: '_id',
  selectable: false,
  isSelected: false,
  hoverable: true,
  striped: false,
  compact: false,
})

const emit = defineEmits<{
  (e: 'select', id: any): void
  (e: 'rowClick', payload: { row: any; index: number }): void
}>()

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const formatValue = (header: TableHeader, value: any, row: any): string => {
  if (header.format) {
    return header.format(value, row)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  if (header.type === 'price') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(value))
  }

  if (header.type === 'date') {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (header.type === 'number') {
    return new Intl.NumberFormat('en-US').format(Number(value))
  }

  return String(value)
}

const getCellClass = (header: TableHeader, value: any, row: any): string => {
  const classes: string[] = []

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

const handleRowClick = () => {
  emit('rowClick', { row: props.row, index: props.index })
}

const handleSelect = () => {
  emit('select', rowId.value)
}
</script>

<template>
  <tr
    class="border-b border-border/70 transition-colors data-[state=selected]:bg-muted h-full"
    :class="[
      hoverable ? 'hover:bg-muted/50' : '',
      striped && index % 2 === 1 ? 'bg-muted/20' : 'bg-background',
      isSelected ? 'bg-muted! hover:bg-muted/30' : '',
      'group',
    ]"
    :data-state="isSelected ? 'selected' : undefined"
    @click="handleRowClick">
    <td
      v-if="selectable"
      class="w-[48px] px-0 py-3 align-middle text-center"
      style="width: 48px"
      @click.stop>
      <div class="flex items-center justify-center">
        <CheckBox :model-value="isSelected" size="xs" @update:model-value="handleSelect" />
      </div>
    </td>

    <td
      v-for="header in headers"
      :key="header.field"
      class="align-middle overflow-hidden"
      :class="[
        compact ? 'p-2 text-xs' : 'py-3! px-3 text-sm',
        alignClass(header),
        header.hideOnMobile ? 'hidden md:table-cell' : '',
        getCellClass(header, getNestedValue(row, header.field), row),
      ]">
      <slot :name="header.field" :value="row" :row="row" :index="index" :field="header.field">
        <span
          class="truncate block"
          :title="String(getNestedValue(row, header.field))"
          v-html="formatValue(header, getNestedValue(row, header.field), row)" />
      </slot>
    </td>
  </tr>
</template>
