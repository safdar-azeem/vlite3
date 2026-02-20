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
  ghostClass?: string
}>()

const emit = defineEmits<{
  (e: 'change', payload: KanbanChangeEvent): void
  (e: 'update:columnData', items: any[]): void
}>()

const scrollContainer = ref<HTMLElement | null>(null)

const { items, isLoading, pageInfo, loadInitial, loadMore } = useKanbanBoard(
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
      'flex flex-col bg-muted/40 rounded-lg overflow-hidden shrink-0 border border-border/50',
      boardClass || 'w-80',
    ]">
    <div class="p-3 border-b border-border/50 bg-background/50">
      <slot name="header" :column="column" :pageInfo="pageInfo">
        <div class="flex items-center justify-between font-semibold text-foreground">
          <span>{{ column.title }}</span>
          <span class="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
            {{ pageInfo.totalItems }}
          </span>
        </div>
      </slot>
    </div>

    <div
      ref="scrollContainer"
      class="flex-1 flex flex-col overflow-y-auto p-3 custom-scrollbar"
      @scroll="handleScroll">
      <VueDraggable
        :model-value="items"
        @update:model-value="handleItemsUpdate"
        :group="group"
        :animation="150"
        :ghostClass="ghostClass || 'kanban-ghost'"
        class="flex-1 flex flex-col gap-3 min-h-[100px]"
        @add="onAdd"
        @remove="onRemove"
        @update="onUpdateEvent">
        <div
          v-for="item in items"
          :key="item[itemKey || 'id']"
          class="cursor-grab active:cursor-grabbing">
          <slot name="item" :item="item" :column="column">
            <div class="bg-card p-3 rounded-md shadow-sm border border-border text-sm">
              {{ item.title || item.name || item.id }}
            </div>
          </slot>
        </div>
      </VueDraggable>

      <div v-if="isLoading" class="py-4 flex justify-center">
        <Spinner size="sm" variant="dots" color="primary" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 10px;
}
</style>

<style></style>
