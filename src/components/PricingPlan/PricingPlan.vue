<script setup lang="ts">
import { computed } from 'vue'
import type { PricingPlanItemSchema, PricingPlanVariant } from './types'
import PricingPlanItem from './PricingPlanItem.vue'

interface Props {
  modelValue?: string | number | null
  items: PricingPlanItemSchema[]
  variant?: PricingPlanVariant
  columns?: number | string
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  items: () => [],
  variant: 'outline',
  columns: 3,
  gap: 6,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const handleSelect = (item: PricingPlanItemSchema) => {
  emit('update:modelValue', item.id)
  emit('change', item.id)
}

// Grid Styles
const gridStyle = computed(() => {
  const cols = props.columns
  let colTemplate = ''

  if (typeof cols === 'number') {
    colTemplate = `repeat(${cols}, minmax(0, 1fr))`
  } else {
    colTemplate = cols
  }

  return {
    display: 'grid',
    gridTemplateColumns: colTemplate,
    gap: `${props.gap * 4}px`, // assuming prop is in standard tailwind units (4px), or just pixels?
    // Let's use it as tailwind multiplier for consistency if possible, but style takes pixels usually.
    // If user passed 6, usually means gap-6 (1.5rem = 24px).
    // Let's map it roughly or just use class if possible.
    // Actually dynamic gap via style is easier for custom.
    // Let's assume input is pixels if large, or multiple of 4 if small?
    // Let's just rely on classes for standard gaps, or style for custom.
    // To be safe and simple, let's use class for standard grid, or style for columns.
  }
})

// Responsive Grid Classes (Tailwind)
// If columnsProp is dynamic, we use style.
// If not, we might want responsive defaults?
// The user asked for "proper layout".
// Let's try to be smart: Use a responsive grid class by default if columns is 3.
const gridClasses = computed(() => {
  // If it's the default 3, use responsive tailwind
  if (props.columns === 3) {
    return 'grid grid-cols-1 md:grid-cols-3'
  }
  if (props.columns === 2) {
    return 'grid grid-cols-1 md:grid-cols-2'
  }
  if (props.columns === 4) {
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  // Fallback to style for custom
  return ''
})

const finalGapClass = computed(() => {
  // Map number to tailwind gap class
  return `gap-${props.gap}`
})

const containerStyle = computed(() => {
  if (gridClasses.value) return {} // handled by classes
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
    gap: `${props.gap * 4}px`,
  }
})
</script>

<template>
  <div class="w-full" :class="[gridClasses, finalGapClass]" :style="containerStyle">
    <PricingPlanItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :selected="modelValue === item.id"
      :variant="variant"
      @select="handleSelect" />
  </div>
</template>
