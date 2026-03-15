<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Icon from '../Icon.vue'
import ListFieldRow from './ListFieldRow.vue'
import { $t } from '@/utils/i18n'
import type { ListField, ListProps } from './types'
import { getObjectValue } from './utils'

const props = withDefaults(defineProps<ListProps>(), {
  columns: 2,
  variant: 'default',
  class: '',
  showColon: true,
  loading: false,
  skeletonRows: 6,
  stackedBorderStyle: 'none',
})

const slots = useSlots()

// ── Resolve visible fields ────────────────────────────
const visibleFields = computed<ListField[]>(() => {
  return props.fields.filter((field) => {
    const value = getObjectValue(field.key, props.data)

    if (field.whenTrue && !value) return false

    if (field.when) {
      return field.when(value, props.data)
    }

    return true
  })
})

// ── Column layout ─────────────────────────────────────
interface ColumnLayout {
  left: ListField[]
  right: ListField[]
  full: ListField[]
}

const columnLayout = computed<ColumnLayout>(() => {
  if (props.columns === 1) {
    return { left: [], right: [], full: visibleFields.value }
  }

  const left: ListField[] = []
  const right: ListField[] = []
  const full: ListField[] = []

  for (const field of visibleFields.value) {
    if (field.lineByLine) {
      full.push(field)
      continue
    }
    if (left.length <= right.length) {
      left.push(field)
    } else {
      right.push(field)
    }
  }

  // Balance columns: move overflow rows to full-width
  const diff = Math.abs(left.length - right.length)
  if (diff >= 2) {
    const longer = left.length > right.length ? left : right
    const overflow = longer.splice(longer.length - Math.floor(diff / 2))
    full.unshift(...overflow)
  }

  return { left, right, full }
})

const hasFullItems = computed(() => columnLayout.value.full.length > 0)
const hasColumnItems = computed(
  () => columnLayout.value.left.length > 0 || columnLayout.value.right.length > 0
)

// ── Title ─────────────────────────────────────────────
const displayTitle = computed(() => {
  if (props.titleI18n) return $t(props.titleI18n)
  return props.title ?? ''
})

// ── Container class ───────────────────────────────────
const isStacked = computed(() => props.variant === 'stacked')

const containerClass = computed(() => {
  const variantMap: Record<string, string> = {
    default: 'border border-border rounded',
    card: 'border border-border rounded bg-card shadow-sm',
    minimal: 'rounded',
    striped: 'border border-border rounded',
    compact: 'border border-border rounded',
    'bordered-rows': 'rounded border border-border',
    stacked: 'border border-border rounded',
  }
  return [
    'list-component w-full overflow-hidden',
    variantMap[props.variant] ?? variantMap.default,
    props.class,
  ].join(' ')
})

const gridClass = computed(() => {
  if (props.columns === 1) return 'grid grid-cols-1'
  if (props.columns === 3) return 'grid grid-cols-1 md:grid-cols-3'
  return 'grid grid-cols-1 md:grid-cols-2'
})

const leftDividerClass = computed(() => {
  if (props.columns === 1) return ''
  return 'border-r border-border/70'
})

// ── Stacked grid ─────────────────────────────────────
const stackedColCount = computed(() => {
  if (props.columns === 1) return 1
  if (props.columns === 3) return 3
  return 2
})

const stackedGridClass = computed(() => {
  if (props.columns === 1) return 'grid grid-cols-1 pb-2.5 pt-1 px-1'
  if (props.columns === 3) return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pb-2.5 pt-1 px-1'
  return 'grid grid-cols-1 sm:grid-cols-2 pb-2.5 pt-1 px-1'
})

// Collect passthrough slot names (everything except structural ones)
const fieldSlotNames = computed(() =>
  Object.keys(slots).filter((k) => !['title', 'header', 'footer'].includes(k))
)

// ── Skeleton ──────────────────────────────────────────
const skeletonItems = computed(() => Array.from({ length: props.skeletonRows }))

// ── Stacked skeleton cell class ───────────────────────
function stackedSkeletonCellClass(i: number): string {
  if (props.stackedBorderStyle === 'divider' && i % stackedColCount.value !== 0) {
    return 'flex flex-col gap-1.5 py-2 border-l border-border pl-4 pr-3.5'
  }
  return 'flex flex-col gap-1.5 px-3.5 py-2'
}
</script>

<template>
  <div :class="containerClass" role="table" aria-label="Information list">
    <div
      v-if="displayTitle || titleIcon || $slots.title"
      class="px-3 py-2.5 border-b border-border/70 flex items-center gap-2 bg-gray-50">
      <slot name="title">
        <Icon v-if="titleIcon" :icon="titleIcon" class="w-4 h-4 text-muted-foreground shrink-0" />
        <h3 class="text-sm font-semibold text-gray-900 tracking-tight">{{ displayTitle }}</h3>
      </slot>
    </div>

    <template v-if="loading">
      <template v-if="isStacked">
        <div class="sm:hidden">
          <div
            v-for="(_, i) in skeletonItems"
            :key="'sk-sm-' + i"
            class="flex justify-between gap-3 px-3 py-2.5 border-b border-border/70 last:border-b-0">
            <div class="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div class="h-4 w-2/5 rounded bg-muted/60 animate-pulse" />
          </div>
        </div>
        <div class="hidden sm:block">
          <div :class="stackedGridClass">
            <div
              v-for="(_, i) in skeletonItems"
              :key="'sk-s-' + i"
              :class="stackedSkeletonCellClass(i)">
              <div class="h-3 w-1/3 rounded bg-muted/60 animate-pulse" />
              <div class="h-4 w-2/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </template>
      <div v-else :class="gridClass">
        <div>
          <div
            v-for="(_, i) in skeletonItems"
            :key="'sk-l-' + i"
            class="flex justify-between gap-3 px-3 py-2.5 border-b border-border/70 last:border-b-0">
            <div class="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div class="h-4 w-2/5 rounded bg-muted/60 animate-pulse" />
          </div>
        </div>
        <div v-if="columns !== 1" :class="leftDividerClass">
          <div
            v-for="(_, i) in skeletonItems"
            :key="'sk-r-' + i"
            class="flex justify-between gap-3 px-3 py-2.5 border-b border-border/70 last:border-b-0">
            <div class="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div class="h-4 w-2/5 rounded bg-muted/60 animate-pulse" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <template v-if="isStacked">
        <div class="sm:hidden">
          <ListFieldRow
            v-for="(field, idx) in visibleFields"
            :key="'mob-' + field.key + idx"
            v-memo="[field, getObjectValue(field.key, props.data), variant, showColon]"
            :field="field"
            :data="props.data"
            :index="idx"
            variant="default"
            :show-colon="showColon"
            :is-last="idx === visibleFields.length - 1"
            :show-border-bottom="idx < visibleFields.length - 1">
            <template
              v-for="slotName in fieldSlotNames"
              :key="slotName"
              v-slot:[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </ListFieldRow>
        </div>

        <div class="hidden sm:block">
          <div :class="stackedGridClass">
            <ListFieldRow
              v-for="(field, idx) in visibleFields"
              :key="field.key + idx"
              v-memo="[field, getObjectValue(field.key, props.data), variant, showColon]"
              :field="field"
              :data="props.data"
              :index="idx"
              :variant="variant"
              :show-colon="false"
              :is-last="idx === visibleFields.length - 1"
              :show-border-bottom="false"
              :stacked-col-index="idx % stackedColCount"
              :stacked-border-style="stackedBorderStyle">
              <template
                v-for="slotName in fieldSlotNames"
                :key="slotName"
                v-slot:[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </ListFieldRow>
          </div>
        </div>

        <div
          v-if="visibleFields.length === 0"
          class="px-3 py-8 text-center text-sm text-muted-foreground">
          No information to display.
        </div>
      </template>

      <template v-else>
        <div :class="gridClass">
          <div v-if="columnLayout.left.length > 0" :class="leftDividerClass">
            <ListFieldRow
              v-for="(field, idx) in columnLayout.left"
              :key="field.key + idx"
              v-memo="[field, getObjectValue(field.key, props.data), variant, showColon]"
              :field="field"
              :data="props.data"
              :index="idx"
              :variant="variant"
              :show-colon="showColon"
              :is-last="idx === columnLayout.left.length - 1"
              :show-border-bottom="
                idx < columnLayout.left.length - 1 ||
                (idx === columnLayout.left.length - 1 && !hasFullItems)
              ">
              <template
                v-for="slotName in fieldSlotNames"
                :key="slotName"
                v-slot:[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </ListFieldRow>
          </div>

          <div v-if="columns !== 1 && columnLayout.right.length > 0">
            <ListFieldRow
              v-for="(field, idx) in columnLayout.right"
              :key="field.key + idx"
              v-memo="[field, getObjectValue(field.key, props.data), variant, showColon]"
              :field="field"
              :data="props.data"
              :index="idx"
              :variant="variant"
              :show-colon="showColon"
              :is-last="idx === columnLayout.right.length - 1"
              :show-border-bottom="
                idx < columnLayout.right.length - 1 ||
                (idx === columnLayout.right.length - 1 && !hasFullItems)
              ">
              <template
                v-for="slotName in fieldSlotNames"
                :key="slotName"
                v-slot:[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </ListFieldRow>
          </div>

          <div v-if="columns === 3">
            </div>
        </div>

        <div v-if="hasFullItems" :class="hasColumnItems ? 'border-t border-border' : ''">
          <ListFieldRow
            v-for="(field, idx) in columnLayout.full"
            :key="field.key + idx"
            v-memo="[field, getObjectValue(field.key, props.data), variant, showColon]"
            :field="field"
            :data="props.data"
            :index="idx"
            :variant="variant"
            :show-colon="showColon"
            :is-last="idx === columnLayout.full.length - 1"
            :show-border-bottom="idx < columnLayout.full.length - 1">
            <template
              v-for="slotName in fieldSlotNames"
              :key="slotName"
              v-slot:[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </ListFieldRow>
        </div>

        <div
          v-if="visibleFields.length === 0"
          class="px-3 py-8 text-center text-sm text-muted-foreground">
          No information to display.
        </div>
      </template>
    </template>

    <div v-if="$slots.footer" class="border-t border-border/70 px-3 py-2.5">
      <slot name="footer" />
    </div>
  </div>
</template>
