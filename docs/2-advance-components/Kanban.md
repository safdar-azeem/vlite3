# Kanban Board

**Import:** `import { Kanban } from 'vlite3'`

### Description

A high-performance, production-ready Kanban system built for Vue 3. It supports cross-column drag-and-drop, infinite scrolling per column, and consolidated event handling to simplify backend synchronization.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `KanbanColumn[]` | **Required** | Defines the vertical boards/status columns. |
| `data` | `Record<string, any[]>` | `{}` | The items for each column, keyed by `column.id`. (Supports `v-model:data`) |
| `group` | `string` | `'kanban-group'` | Unique identifier to allow dragging between different Kanban instances. |
| `itemKey` | `string` | `'id'` | The property name used as a unique identifier for items. |
| `loadData` | `Function` | `undefined` | Async function for infinite scrolling: `(colId, page) => Promise<Result>`. |
| `boardClass` | `string` | `undefined` | Custom CSS class for the column container (e.g., to set width). |
| `headerClass` | `string` | `undefined` | Custom CSS class for the column header. |
| `bodyClass` | `string` | `undefined` | Custom CSS class for the scrollable item list. |
| `draggableClass` | `string` | `undefined` | Class applied to the draggable area inside a column. |
| `ghostClass` | `string` | `'kanban-ghost'` | Class applied to the "phantom" item during drag. |

---

### Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `@update:data` | `Record<string, any[]>` | Emitted when the data structure changes. Used for 2-way binding. |
| `@move` | `KanbanMoveEvent` | **Recommended.** Consolidated event emitted once per move (even across columns). Perfect for API calls. |
| `@change` | `KanbanChangeEvent` | Low-level event. Emits 'add', 'remove', or 'update' for each individual column change. |

---

### Type Definitions

```ts
export interface KanbanColumn {
  id: string | number;
  title: string;
  titleI18n?: string; // Optional key for localization
}

export interface KanbanMoveEvent {
  itemId: string | number;     // The ID of the item moved
  item: any;                   // The full item data
  fromColumnId: string | number;
  toColumnId: string | number;
  oldIndex: number;
  newIndex: number;
}
```

---

### Implementation Guide

#### 1. Basic Setup
```vue
<script setup>
import { ref } from 'vue'
import { Kanban } from 'vlite3'

const columns = [{ id: 'todo', title: 'To Do' }, { id: 'done', title: 'Done' }]
const boardData = ref({ todo: [{ id: 1, title: 'Task A' }], done: [] })

const onMove = (e) => {
  // Single consolidated event for your API
  console.log(`Item ${e.itemId} moved from ${e.fromColumnId} to ${e.toColumnId}`)
}
</script>

<template>
  <Kanban v-model:data="boardData" :columns="columns" @move="onMove" />
</template>
```

#### 2. Advanced Customization (Slots)
The Kanban component uses scoped slots for maximum UI flexibility.

| Slot Name | Scoped Props | Usage |
| :--- | :--- | :--- |
| `column-header` | `{ column, pageInfo }` | Replace the entire header UI. |
| `prepend-item` | `{ column, items }` | Add a "Create Task" button at the top of a column. |
| `item` | `{ item, column }` | **Crucial.** Customize the card design. |
| `append-item` | `{ column, items }` | Add footers or summary info at the bottom. |



---

### Senior Engineer's Notes (Best Practices)

1.  **Event Handling:** Always prefer `@move` over `@change`. `@change` triggers twice when moving between columns (one `remove`, one `add`). `@move` abstracts this complexity and provides a single payload suitable for database updates.
2.  **Performance:** The board uses `v-memo` internally on items. Ensure your item data is as flat as possible for optimal re-rendering.
3.  **Layout:** The Kanban container uses `overflow-x: auto`. Ensure the parent container has a defined height (e.g., `h-screen` or `h-[600px]`) to enable independent vertical scrolling for columns.
4.  **Lazy Loading:** When using `loadData`, the component manages pagination state automatically. Ensure your backend returns the total page count to prevent unnecessary requests.
