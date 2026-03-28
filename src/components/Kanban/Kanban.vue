<script setup lang="ts">
import { ref, watch } from 'vue'
import KanbanBoard from './KanbanBoard.vue'
import type { KanbanChangeEvent, KanbanMoveEvent, KanbanProps } from './types'

const props = withDefaults(defineProps<KanbanProps>(), {
  group: 'kanban-group',
  itemKey: 'id',
  groupKey: 'status',
  positionKey: 'position',
  class: 'h-full w-full',
})

const emit = defineEmits<{
  (e: 'change', payload: KanbanChangeEvent): void
  (e: 'move', payload: KanbanMoveEvent): void
  (e: 'update:data', val: Record<string | number, any[]>): void
  (
    e: 'item-moved',
    itemId: string | number,
    toColumnId: string | number,
    newPosition: number,
    item: any
  ): void
}>()

// Internal state to track cross-column moves and consolidate the dual events
const moveBuffer = ref<{
  remove?: { columnId: string | number; event: any }
  add?: { columnId: string | number; event: any }
}>({})

const internalBoardData = ref<Record<string, any[]>>({})

// Watch data & rawData to populate internal reactive board
watch(
  [() => props.data, () => props.rawData],
  ([newData, newRawData]) => {
    if (newRawData && Array.isArray(newRawData)) {
      // Auto-group flat arrays based on groupKey and positionKey
      const grouped: Record<string, any[]> = {}
      props.columns.forEach((col) => (grouped[col.id] = []))

      newRawData.forEach((item: any) => {
        const gVal = item[props.groupKey]
        if (grouped[gVal]) {
          grouped[gVal].push({ ...item }) // Shallow clone to avoid optimistic UI mutation side effects
        } else {
          grouped[gVal] = [{ ...item }]
        }
      })

      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => (a[props.positionKey] || 0) - (b[props.positionKey] || 0))
      })

      internalBoardData.value = grouped
    } else if (newData) {
      internalBoardData.value = { ...newData } as Record<string, any[]>
    }
  },
  { immediate: true, deep: true }
)

const calculateNewPosition = (list: any[], newIndex: number) => {
  let prevPos = 0
  let nextPos = 0

  if (newIndex > 0) prevPos = Number(list[newIndex - 1]?.[props.positionKey]) || 0
  if (newIndex < list.length - 1) nextPos = Number(list[newIndex + 1]?.[props.positionKey]) || 0

  if (prevPos === 0 && nextPos === 0) return 1024
  if (prevPos === 0) return nextPos / 2
  if (nextPos === 0) return prevPos + 1024
  return (prevPos + nextPos) / 2
}

const handleMoveCalculation = (colId: string | number, newIndex: number) => {
  const list = internalBoardData.value[colId]
  if (!list) return

  const item = list[newIndex]
  if (!item) return

  const newPos = calculateNewPosition(list, newIndex)

  // Optimistic Local Update
  item[props.positionKey] = newPos
  item[props.groupKey] = colId

  // Emit magic event for backend sync
  emit('item-moved', item[props.itemKey], colId, newPos, item)
}

const handleChange = (payload: KanbanChangeEvent) => {
  emit('change', payload)

  if (payload.type === 'remove') {
    moveBuffer.value.remove = { columnId: payload.columnId, event: payload.event }
  } else if (payload.type === 'add') {
    moveBuffer.value.add = { columnId: payload.columnId, event: payload.event }
  } else if (payload.type === 'update') {
    // Same column reorder
    handleMoveCalculation(payload.columnId, payload.event.newIndex)

    emit('move', {
      itemId:
        payload.event.data?.[props.itemKey] || payload.event.item?._underlying_vm_?.[props.itemKey],
      item: payload.event.data,
      fromColumnId: payload.columnId,
      toColumnId: payload.columnId,
      oldIndex: payload.event.oldIndex,
      newIndex: payload.event.newIndex,
    })
  }

  // If we have both parts of a cross-column move, emit consolidated event & calculate position
  if (moveBuffer.value.remove && moveBuffer.value.add) {
    const { remove, add } = moveBuffer.value

    handleMoveCalculation(add.columnId, add.event.newIndex)

    emit('move', {
      itemId: add.event.data?.[props.itemKey],
      item: add.event.data,
      fromColumnId: remove.columnId,
      toColumnId: add.columnId,
      oldIndex: remove.event.oldIndex,
      newIndex: add.event.newIndex,
    })

    moveBuffer.value = {} // Reset buffer
  }

  setTimeout(() => {
    moveBuffer.value = {} // Safety clear
  }, 100)
}

const updateColumnData = (columnId: string | number, items: any[]) => {
  internalBoardData.value[columnId] = items
  if (props.data) {
    emit('update:data', { ...props.data, [columnId]: items })
  }
}

const columnData = (colId: string | number) => {
  return internalBoardData.value[colId] || []
}
</script>

<template>
  <div
    :class="[
      'flex gap-4 overflow-x-auto p-1 custom-scrollbar-x scrollable-container',
      props.class,
    ]">
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
      @update:columnData="(items) => updateColumnData(column.id, items)">
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
