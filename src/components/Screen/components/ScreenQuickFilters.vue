<script setup lang="ts">
/**
 * ScreenQuickFilters
 * ------------------
 * Renders a horizontal "line" tab bar for status-style quick filters.
 * Positioned between the Screen header and the content area.
 *
 * Supports optional numeric counts per tab (e.g. "Active (12)").
 * Uses the existing Tabes component internally via `variant="line"`.
 */
import { computed } from 'vue'
import { Tabes } from '../../Tabes'
import type { ScreenQuickFilter } from '../types'
import type { TabesOption, TabesVariant } from '../../Tabes/types'

const props = defineProps<{
  modelValue: string | number
  options: ScreenQuickFilter[]
  variant?: TabesVariant
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
  (e: 'change', val: string | number): void
}>()

/** Map ScreenQuickFilter → TabesOption, injecting count into label when present */
const tabesOptions = computed<TabesOption[]>(() =>
  props.options.map((opt) => ({
    value: opt.value,
    icon: opt.icon,
    labelI18n: opt.labelI18n,
    // Append count badge inline in the label string when provided
    label: opt.count !== undefined ? `${opt.label} (${opt.count})` : opt.label,
  }))
)

const handleChange = (val: string | number) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div class="w-max">
    <Tabes
      class="border-b-0! border-0! pb-0.5"
      :model-value="modelValue"
      :options="tabesOptions"
      :variant="variant || 'line'"
      @change="handleChange" />
  </div>
</template>
