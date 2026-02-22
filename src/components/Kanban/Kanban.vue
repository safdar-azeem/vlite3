<script setup lang="ts">
import KanbanBoard from './KanbanBoard.vue'
import type { KanbanColumn, KanbanLoadDataResult, KanbanChangeEvent } from './types'

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
  (e: 'update:data', val: Record<string | number, any[]>): void
}>()

const handleChange = (payload: KanbanChangeEvent) => {
  emit('change', payload)
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
  <div :class="['flex gap-4 overflow-x-auto p-1 custom-scrollbar-x', props.class]">
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
</style>

