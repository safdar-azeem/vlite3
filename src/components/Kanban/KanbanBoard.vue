<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import Spinner from '../Spinner/Spinner.vue'
import { useKanbanBoard } from './useKanbanBoard'
import type { KanbanColumn, KanbanLoadDataResult, KanbanChangeEvent } from './types'

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

// Sync up: Propagate internal drag-and-drop changes up to parent
const handleItemsUpdate = (newItems: any[]) => {
  items.value = newItems
  emit('update:columnData', newItems)
}

// Sync down: Only update local state if parent explicitly forces new distinct data
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
  // Trigger loadMore when scrolled near the bottom (within 50px)
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
</script>

<template>
  <div
    :class="[
      'flex flex-col bg-card rounded-lg overflow-hidden shrink-0 border border-border/60',
      boardClass || 'w-80',
    ]">
    <div :class="['p-3 border-b border-border/80 ', headerClass]">
      <slot name="header" :column="column" :pageInfo="pageInfo">
        <div class="flex items-center justify-between font-semibold text-foreground">
          <span>{{ column.title }}</span>
        </div>
      </slot>
    </div>

    <div
      ref="scrollContainer"
      :class="['flex-1 flex flex-col overflow-y-auto p-3  custom-scrollbar', bodyClass]"
      @scroll="handleScroll">
      <div
        v-if="isInitialLoading && items.length === 0"
        class="flex-1 flex flex-col gap-3 min-h-[50px] py-1">
        <div
          v-for="i in 3"
          :key="'skeleton-' + i"
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
          :group="group"
          :animation="150"
          :ghostClass="ghostClass || 'kanban-ghost'"
          :class="['flex-1 flex flex-col  gap-2 min-h-[50px] py-1', draggableClass]"
          @add="onAdd"
          @remove="onRemove"
          @update="onUpdateEvent">
          <div
            v-for="item in items"
            :key="item[itemKey || 'id']"
            class="cursor-grab active:cursor-grabbing">
            <slot name="item" :item="item" :column="column">
              <div class="bg-body p-3 rounded-md shadow-sm border border-border text-sm">
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
</style>
