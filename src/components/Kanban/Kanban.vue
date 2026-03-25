<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from './KanbanBoard.vue'
import type { KanbanColumn, KanbanLoadDataResult, KanbanChangeEvent, KanbanMoveEvent } from './types'

const props = withDefaults(defineProps<{
  columns: KanbanColumn[]
  group?: string
  itemKey?: string
  loadData?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>
  data?: Record<string | number, any[]>
  boardClass?: string
  headerClass?: string
  bodyClass?: string
  draggableClass?: string
  ghostClass?: string
  class?: string
}>(), {
  group: 'kanban-group',
  itemKey: 'id',
  class: 'h-full w-full'
})

const emit = defineEmits<{
  (e: 'change', payload: KanbanChangeEvent): void
  (e: 'move', payload: KanbanMoveEvent): void
  (e: 'update:data', val: Record<string | number, any[]>): void
}>()

// Internal state to track cross-column moves and consolidate the dual events
const moveBuffer = ref<{
  remove?: { columnId: string | number; event: any }
  add?: { columnId: string | number; event: any }
}>({})

const handleChange = (payload: KanbanChangeEvent) => {
  emit('change', payload)

  // Consolidated logic for cross-column moves
  if (payload.type === 'remove') {
    moveBuffer.value.remove = { columnId: payload.columnId, event: payload.event }
  } else if (payload.type === 'add') {
    moveBuffer.value.add = { columnId: payload.columnId, event: payload.event }
  } else if (payload.type === 'update') {
    // This handles reordering within the same column
    emit('move', {
      itemId: payload.event.data?.[props.itemKey] || payload.event.item?._underlying_vm_?.[props.itemKey],
      item: payload.event.data,
      fromColumnId: payload.columnId,
      toColumnId: payload.columnId,
      oldIndex: payload.event.oldIndex,
      newIndex: payload.event.newIndex
    })
  }

  // If we have both parts of a cross-column move, emit the consolidated 'move' event
  if (moveBuffer.value.remove && moveBuffer.value.add) {
    const { remove, add } = moveBuffer.value
    emit('move', {
      itemId: add.event.data?.[props.itemKey],
      item: add.event.data,
      fromColumnId: remove.columnId,
      toColumnId: add.columnId,
      oldIndex: remove.event.oldIndex,
      newIndex: add.event.newIndex
    })
    // Reset buffer
    moveBuffer.value = {}
  }

  // Clear buffer if it's a partial event that doesn't complete (safety)
  setTimeout(() => {
    moveBuffer.value = {}
  }, 100)
}

const updateColumnData = (columnId: string | number, items: any[]) => {
  if (props.data) {
    emit('update:data', { ...props.data, [columnId]: items })
  }
}

const columnData = (colId: string | number) => {
  return props.data ? props.data[colId] || [] : []
}
</script>

<template>
  <div :class="['flex gap-4 overflow-x-auto p-1 custom-scrollbar-x scrollable-container', props.class]">
    <KanbanBoard
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :group="group"
      :item-key="itemKey"
      :load-data="loadData"
      :column-data="columnData(column.id)"
      :board-class="boardClass"
      :header-class="headerClass"
      :body-class="bodyClass"
      :draggable-class="draggableClass"
      :ghost-class="ghostClass"
      @change="handleChange"
      @update:columnData="(items) => updateColumnData(column.id, items)"
    >
      <template #header="slotProps">
        <slot name="column-header" v-bind="slotProps" />
      </template>

      <template #prepend-item="slotProps">
        <slot name="prepend-item" v-bind="slotProps" />
      </template>

      <template #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>

      <template #append-item="slotProps">
        <slot name="append-item" v-bind="slotProps" />
      </template>
    </KanbanBoard>
  </div>
</template>

<style scoped>
.custom-scrollbar-x::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar-x::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 10px;
}
.scrollable-container {
  will-change: transform;
  contain: layout style;
}
</style>
