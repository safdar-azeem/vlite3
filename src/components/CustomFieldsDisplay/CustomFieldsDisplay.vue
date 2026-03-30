<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import { $t } from '@/utils/i18n'
import type { CustomFieldItem, CustomFieldsDisplayVariant } from './types'

interface Props {
  title?: string
  titleI18n?: string
  icon?: string
  fields?: CustomFieldItem[]
  variant?: CustomFieldsDisplayVariant
  columns?: 1 | 2 | 3 | 4
  emptyText?: string
  keyProp?: string
  valueProp?: string
  class?: string
  listValueThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  variant: 'grid',
  columns: 2,
  emptyText: '--',
  keyProp: 'key',
  valueProp: 'value',
  listValueThreshold: 60,
})

const displayTitle = computed(() => {
  if (props.titleI18n) return $t(props.titleI18n)
  return props.title ?? ''
})

const formatValue = (val: any) => {
  if (val === null || val === undefined || val === '') return props.emptyText
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.join(', ')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

const isLongValue = (val: any): boolean => {
  const formatted = formatValue(val)
  return formatted.length > props.listValueThreshold
}

const wrapperClass = computed(() => {
  if (props.variant === 'list') {
    return 'flex flex-col border border-border rounded-md bg-body overflow-hidden'
  }
  return 'flex flex-col w-full'
})

const containerClass = computed(() => {
  const colMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4',
  }

  if (props.variant === 'grid') return `grid gap-4 px-2 ${colMap[props.columns] || colMap[2]}`
  if (props.variant === 'card') return `grid gap-3.5 ${colMap[props.columns] || colMap[2]}`
  if (props.variant === 'list') return 'flex flex-col divide-y divide-border'
  if (props.variant === 'inline') return 'flex flex-wrap gap-3'
  return ''
})

const getListItemClass = (field: CustomFieldItem) => {
  if (props.variant !== 'list') return itemClass.value
  const long = isLongValue(field[props.valueProp])
  // On small screens always stack (flex-col), on sm+ go inline unless value is long
  return [
    'flex py-3 pl-3 pr-3.5 transition-colors hover:bg-muted/30 min-w-0',
    long
      ? 'flex-col items-start gap-1'
      : 'flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0',
  ]
}

const getListValueClass = (field: CustomFieldItem) => {
  if (props.variant !== 'list') return valueClass.value
  const long = isLongValue(field[props.valueProp])
  return [
    'text-sm font-normal text-foreground break-words',
    long ? 'w-full' : 'w-full sm:w-auto sm:text-right sm:max-w-[60%]',
  ]
}

const itemClass = computed(() => {
  if (props.variant === 'grid') return 'flex flex-col space-y-1 min-w-0'
  if (props.variant === 'list')
    return 'flex justify-between items-start py-3 pl-3 pr-3.5 transition-colors hover:bg-muted/30 min-w-0'
  if (props.variant === 'card')
    return 'flex flex-col space-y-1.5 p-3 rounded-lg border border-border bg-card  min-w-0'
  if (props.variant === 'inline')
    return 'flex items-center space-x-2 bg-muted/40 border border-border px-3 py-1.5 rounded-full min-w-0'
  return ''
})

const labelClass = computed(() => {
  if (props.variant === 'inline')
    return 'text-xs font-medium text-foreground truncate max-w-[120px]'
  if (props.variant === 'list')
    return 'text-sm! font-medium! text-foreground! leading-snug truncate mr-4 shrink-0'
  return 'text-xs font-semibold text-foreground uppercase tracking-wider truncate'
})

const valueClass = computed(() => {
  if (props.variant === 'inline')
    return 'text-sm font-semibold text-foreground truncate max-w-[200px]'
  if (props.variant === 'list')
    return 'text-sm font-normal text-foreground text-right break-words max-w-[60%]'
  return 'text-sm text-foreground break-words'
})
</script>

<template>
  <div :class="['custom-fields-display', wrapperClass, props.class]">
    <div
      v-if="displayTitle || icon || $slots.title"
      :class="[
        variant == 'list'
          ? 'px-3 py-2.5 border-b border-border/70 flex items-center gap-2 bg-muted/60'
          : 'bg-muted  p-2  rounded flex items-center gap-2 mb-4.5',
      ]">
      <slot name="title">
        <Icon v-if="icon" :icon="icon" class="w-4 h-4 text-muted-foreground shrink-0" />
        <h3 class="text-sm font-semibold text-gray-900 tracking-tight">{{ displayTitle }}</h3>
      </slot>
    </div>

    <div :class="containerClass">
      <template v-if="fields && fields.length > 0">
        <div
          v-for="(field, index) in fields"
          :key="index"
          :class="variant === 'list' ? getListItemClass(field) : itemClass">
          <div class="cf-label shrink-0" :class="labelClass">
            <slot name="key" :field="field" :index="index">
              {{ field[keyProp] }}
              <template v-if="props.variant === 'inline'">:</template>
            </slot>
          </div>
          <div class="cf-value" :class="variant === 'list' ? getListValueClass(field) : valueClass">
            <slot name="value" :field="field" :index="index">
              {{ formatValue(field[valueProp]) }}
            </slot>
          </div>
        </div>
      </template>
      <div
        v-else
        class="text-sm text-muted-foreground py-6 text-center w-full bg-muted/5 rounded-lg border border-dashed border-border"
        :class="variant === 'list' ? 'border-none rounded-none' : ''">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>
  </div>
</template>
