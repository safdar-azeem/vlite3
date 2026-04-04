<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceTotal, InvoiceVariant } from './types'
import { Price } from '../Price'

const props = withDefaults(
  defineProps<{
    totals: InvoiceTotal[]
    compact?: boolean
    variant?: InvoiceVariant | 'default'
    /** Optional custom class to override the container wrapper styles */
    containerClass?: string | any[] | Record<string, boolean>
  }>(),
  {
    compact: false,
    variant: 'default',
    containerClass: undefined,
  }
)

const _containerClass = computed(() => {
  if (props.containerClass !== undefined) return props.containerClass

  switch (props.variant) {
    case 'Variant1':
      return props.compact ? 'space-y-1.5' : 'space-y-2'
    case 'Variant2':
      return props.compact ? 'px-4 py-2.5 space-y-1' : 'px-5 py-3 space-y-1.5'
    case 'Variant3':
      return props.compact
        ? 'w-full max-w-[200px] space-y-1 text-xs'
        : 'w-full max-w-[240px] space-y-1.5 text-xs'
    case 'Variant4':
      return [
        'border border-border rounded-lg',
        props.compact ? 'p-4 space-y-2' : 'p-5 space-y-2.5',
      ]
    default:
      return props.compact ? 'space-y-1.5' : 'space-y-2'
  }
})

const getItemClass = (total: InvoiceTotal) => {
  if (total.isGrandTotal) {
    switch (props.variant) {
      case 'Variant1':
      default:
        return [
          'border-t border-border font-black text-foreground',
          props.compact ? 'pt-2 mt-1 text-base' : 'pt-3 mt-2 text-lg',
        ]
      case 'Variant2':
        return [
          'border-t border-border font-bold text-foreground',
          props.compact ? 'mt-1.5 pt-1.5 text-sm' : 'mt-2 pt-2 text-base',
        ]
      case 'Variant3':
        return [
          'border-t border-gray-300 font-bold text-gray-900',
          props.compact ? 'pt-1.5 mt-1.5 text-sm' : 'pt-2 mt-2 text-sm',
        ]
      case 'Variant4':
        return [
          'border-t border-gray-300 font-black text-gray-900',
          props.compact ? 'pt-2.5 mt-1 text-base' : 'pt-3 mt-1.5 text-lg',
        ]
    }
  } else {
    switch (props.variant) {
      case 'Variant1':
      default:
        return ['text-muted-foreground font-medium', props.compact ? 'text-xs' : 'text-sm']
      case 'Variant2':
        return ['font-medium text-muted-foreground', props.compact ? 'text-xs' : 'text-sm']
      case 'Variant3':
        return ['text-muted-foreground font-medium']
      case 'Variant4':
        return ['font-semibold text-muted-foreground', props.compact ? 'text-xs' : 'text-sm']
    }
  }
}

const getLabelClass = (total: InvoiceTotal) => {
  if (total.isGrandTotal) {
    if (
      props.variant === 'Variant1' ||
      props.variant === 'Variant4' ||
      props.variant === 'default'
    ) {
      return 'uppercase tracking-widest text-xs'
    }
  }
  return ''
}
</script>

<template>
  <div class="vl-invoice-totals" :class="_containerClass">
    <div
      v-for="(total, idx) in totals"
      :key="idx"
      class="flex justify-between items-center"
      :class="getItemClass(total)">
      <span :class="getLabelClass(total)">
        {{ total.label }}
      </span>
      <Price :value="total.value" />
    </div>
  </div>
</template>
