<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useKanbanBoard } from './useKanbanBoard'
import type { KanbanColumn, KanbanLoadDataResult, KanbanChangeEvent } from './types'
import { $t } from '@/utils'
import Spinner from '../Spinner/Spinner.vue'

const props = defineProps<{
  column: KanbanColumn
  group?: string
  itemKey?: string
  loadData?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>
  columnData?: any[]
  boardClass?: string
  headerClass?: string
  bodyClass?: string
  draggableClass?: string
  ghostClass?: string
  /**
   * Optional predicate forwarded from the parent <Kanban> component.
   * When it returns true for a given item, that item's wrapper receives
   * the CSS class "kanban-item--disabled" which is set as the
   * VueDraggable `filter` selector — Sortable.js will skip those elements
   * during drag operations while still rendering them normally.
   */
  isItemDisabled?: (item: any) => boolean
}>()

const emit = defineEmits<{
  (e: 'change', payload: KanbanChangeEvent): void
  (e: 'update:columnData', items: any[]): void
}>()

const scrollContainer = ref<HTMLElement | null>(null)

const { items, isInitialLoading, isLoadingMore, pageInfo, loadInitial, loadMore } = useKanbanBoard(
  props.column.id,
  props.loadData,
  props.columnData
)

const handleItemsUpdate = (newItems: any[]) => {
  items.value = newItems
  emit('update:columnData', newItems)
}

watch(
  () => props.columnData,
  (newVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(items.value)) {
      items.value = [...newVal]
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.loadData && (!props.columnData || props.columnData.length === 0)) {
    loadInitial()
  }
})

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    loadMore()
  }
}

const onAdd = (e: any) => {
  emit('change', { type: 'add', event: e, columnId: props.column.id })
}

const onRemove = (e: any) => {
  emit('change', { type: 'remove', event: e, columnId: props.column.id })
}

const onUpdateEvent = (e: any) => {
  emit('change', { type: 'update', event: e, columnId: props.column.id })
}

const displayTitle = computed(() =>
  props.column.titleI18n ? $t(props.column.titleI18n) : props.column.title
)

/**
 * Whether the entire board/column is disabled.
 * When true, VueDraggable operates in sort:false + no cross-column mode
 * by passing a disabled group config, and the board gets a visual hint.
 */
const isBoardDisabled = computed(() => props.column.disabled === true)

/**
 * VueDraggable group option.
 *
 * - Normal board  → items can be dragged in and out freely (group name only).
 * - Disabled board → pull:false + put:false locks the column completely so
 *   Sortable.js itself rejects any drag entering or leaving this column,
 *   providing a native, instant rejection without needing JS guards.
 */
const draggableGroup = computed(() => {
  if (isBoardDisabled.value) {
    return { name: props.group, pull: false, put: false }
  }
  return props.group
})

/**
 * CSS class appended to every item that is individually disabled.
 * VueDraggable's `filter` prop accepts a CSS selector; Sortable.js will
 * ignore elements matching it during drag start — the item is rendered
 * normally but cannot be picked up.
 */
const DISABLED_ITEM_CLASS = 'kanban-item--disabled'

/**
 * Resolve whether a specific item should be individually disabled.
 */
const isItemDisabledFn = (item: any): boolean => {
  return typeof props.isItemDisabled === 'function' ? props.isItemDisabled(item) : false
}
</script>

<template>
  <div
    :class="[
      'flex flex-col bg-card rounded-lg overflow-hidden shrink-0 border border-border/50 w-full flex-1 min-w-75',
      // Visual indicator for a fully-disabled/locked board
      isBoardDisabled && 'kanban-board--disabled',
      boardClass,
    ]">
    <div :class="['p-3 border-b border-border/80 ', headerClass]">
      <slot name="header" :column="column" :pageInfo="pageInfo">
        <div class="flex items-center justify-between font-semibold text-foreground">
          <span>{{ displayTitle }}</span>
          <!-- Lock badge shown only when the entire board is disabled -->
          <span
            v-if="isBoardDisabled"
            class="kanban-lock-badge"
            title="This column is locked — items cannot be moved in or out">
            🔒
          </span>
        </div>
      </slot>
    </div>

    <div
      ref="scrollContainer"
      :class="[
        'flex-1 flex flex-col overflow-y-auto p-3 custom-scrollbar scrollable-container',
        bodyClass,
      ]"
      @scroll="handleScroll">
      <div
        v-if="isInitialLoading && items.length === 0"
        class="flex-1 flex flex-col gap-3 min-h-[50px] py-1">
        <div
          v-for="i in 3"
          :key="'skeleton-' + i"
          v-once
          class="bg-body p-3 rounded-md shadow-sm border border-border animate-pulse flex flex-col gap-3">
          <div class="h-4 bg-muted/60 rounded w-2/3"></div>
          <div class="h-3 bg-muted/60 rounded w-1/3"></div>
        </div>
      </div>

      <template v-else>
        <slot name="prepend-item" :column="column" :items="items" />

        <VueDraggable
          :model-value="items"
          @update:model-value="handleItemsUpdate"
          :group="draggableGroup"
          :animation="150"
          :ghostClass="ghostClass || 'kanban-ghost'"
          :class="['flex-1 flex flex-col gap-2 min-h-[50px] py-1', draggableClass]"
          :filter="`.${DISABLED_ITEM_CLASS}`"
          :preventOnFilter="true"
          @add="onAdd"
          @remove="onRemove"
          @update="onUpdateEvent">
          <div
            v-for="item in items"
            :key="item[itemKey || 'id']"
            v-memo="[item]"
            :class="[
              // Board-disabled → all items show default cursor (no grab)
              // Item-disabled  → specific item shows not-allowed cursor
              isBoardDisabled
                ? 'cursor-default'
                : isItemDisabledFn(item)
                  ? `${DISABLED_ITEM_CLASS} cursor-not-allowed`
                  : 'cursor-grab active:cursor-grabbing',
            ]">
            <slot
              name="item"
              :item="item"
              :column="column"
              :is-disabled="isBoardDisabled || isItemDisabledFn(item)">
              <div
                :class="[
                  'bg-body p-3 rounded-md shadow-sm border border-border text-sm',
                  (isBoardDisabled || isItemDisabledFn(item)) && 'opacity-60',
                ]">
                {{ item.title || item.name || item.id }}
              </div>
            </slot>
          </div>
        </VueDraggable>

        <slot name="append-item" :column="column" :items="items" />

        <div v-if="isLoadingMore" class="py-4 flex justify-center shrink-0">
          <Spinner size="sm" variant="dots" color="primary" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 10px;
}
.scrollable-container {
  will-change: transform;
  contain: layout style;
}

/* Disabled board: subtle background tint + reduced opacity to signal locked state */
.kanban-board--disabled {
  opacity: 0.75;
  background-color: color-mix(in srgb, var(--color-card) 85%, var(--color-muted) 15%);
}

/* Lock badge next to the column title */
.kanban-lock-badge {
  font-size: 0.75rem;
  line-height: 1;
  user-select: none;
}
</style>
