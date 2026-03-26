# Kanban Board

**Import:** `import { Kanban } from 'vlite3'`

### Description

A high-performance, production-ready Kanban system built for Vue 3. It supports cross-column drag-and-drop, infinite scrolling per column, intelligent auto-grouping from flat arrays, and consolidated fractional indexing for optimal database performance.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `KanbanColumn[]` | **Required** | Defines the vertical boards/status columns. |
| `rawData` | `any[]` | `undefined` | **Recommended.** Provide a flat array. The board will automatically group, sort, and manage drag-and-drop positions internally. |
| `groupKey` | `string` | `'status'` | The object property used to group flat `rawData` into columns (e.g., `'status'` or `'stage'`). |
| `positionKey` | `string` | `'position'` | The object property used to define the sorting order within a column. |
| `data` | `Record<string, any[]>` | `{}` | Legacy manual grouping structure. (Supports `v-model:data`) |
| `group` | `string` | `'kanban-group'` | Unique identifier to allow dragging between different Kanban instances. |
| `itemKey` | `string` | `'id'` | The property name used as a unique identifier for items. |
| `loadData` | `Function` | `undefined` | Async function for infinite scrolling: `(colId, page) => Promise<Result>`. |
| `boardClass` | `string` | `undefined` | Custom CSS class for the column container. |

---

### Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `@item-moved` | `(itemId, toColumnId, newPosition, item)` | **The ultimate API event.** Emits the calculated fractional index when dropped. Perfect for updating the backend instantly. |
| `@update:data` | `Record<string, any[]>` | Emitted when the manual `data` structure changes. |
| `@move` | `KanbanMoveEvent` | High-level move event detailing `fromColumn`, `toColumn`, `oldIndex`, `newIndex`. |

---

### Implementation Guide

#### The Auto-Calculation Approach (Recommended)
By supplying a flat array (`rawData`), the `<Kanban>` component fully abstracts away complex grouping watchers, map sorting, and the mathematical fractional indexing required to compute exact drag-and-drop placements (LexoRank style positioning).

```vue
<script setup>
import { Kanban } from 'vlite3'

// 1. Just fetch your flat array of tasks
const data = [{ id: 1, title: 'Task A', status: 'todo', position: 1024 }]
const columns = [{ id: 'todo', title: 'To Do' }, { id: 'done', title: 'Done' }]

// 2. Map the @item-moved event directly to your API mutation
const syncWithBackend = async (id, newStatus, newPosition) => {
    await api.tasks.update(id, { status: newStatus, position: newPosition })
}
</script>

<template>
  <Kanban 
    :raw-data="data" 
    group-key="status" 
    position-key="position"
    :columns="columns" 
    @item-moved="syncWithBackend" 
  />
</template>
```

#### Slots Customization
| Slot Name | Scoped Props | Usage |
| :--- | :--- | :--- |
| `column-header` | `{ column, pageInfo }` | Replace the entire header UI. |
| `prepend-item` | `{ column, items }` | Add a "Create Task" button at the top of a column. |
| `item` | `{ item, column }` | **Crucial.** Customize the card design. |
| `append-item` | `{ column, items }` | Add footers or summary info at the bottom. |

---

### Senior Engineer's Notes (Best Practices)

1.  **Stop writing boilerplate:** Always prefer `:raw-data` and `@item-moved` over manually managing a `Record<string, any[]>` grouping state and computing next/prev positions manually.
2.  **Optimistic UI Built-In:** The component manages its own internal reactivity on drops. It automatically updates the object locally so the UI feels instantaneous while your API call is being made.
3.  **Performance:** The board uses `v-memo` internally on items and explicitly prevents parent state reactivity death-loops by shallow cloning your `rawData` input.
