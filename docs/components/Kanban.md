# Kanban

**Import:** `import { Kanban } from 'vlite3'`

### Description
A fully functional, production-ready drag-and-drop Kanban board supporting multiple dynamic columns, customizable item templates, cross-board dragging, and infinite scrolling/pagination handlers per column.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `boards` | `KanbanBoardSchema[]` | required | Array of columns/boards |
| `items` | `KanbanItemSchema[]` | required | Array of items (tasks) |
| `boardKey` | `string` | `'boardId'` | The property on items that maps to a board ID |
| `itemKey` | `string` | `'id'` | The unique identifier property for items |
| `group` | `string` | `'kanban'` | D&D group identifier (prevents cross-contamination) |
| `hasMore` | `Record<string, boolean>` | `{}` | Key-value map showing if a board has more items to load |
| `loading` | `boolean \| Record<string, boolean>` | `false` | Loading state, can be global or per-board |
| `boardClass` | `string` | `''` | Custom class for the board container |
| `itemClass` | `string` | `''` | Custom class for the default item wrapper |

### Type Definitions

```ts
export interface KanbanBoardSchema {
  id: string
  title: string
  [key: string]: any
}

export interface KanbanItemSchema {
  id: string | number
  [key: string]: any
}

```

### Events

* `@update:items` (items: `KanbanItemSchema[]`): Emitted when items are rearranged or moved between boards. Suitable for `v-model:items`.
* `@change` (items: `KanbanItemSchema[]`): Emitted on any board interaction.
* `@load-more` (boardId: `string`): Emitted when a column's load more button is clicked.

### Slots

| Slot | Description | Scoped Props |
| --- | --- | --- |
| `header` | Replaces the default board header globally | `{ board }` |
| `header-[boardId]` | Replaces the header for a specific board ID | `{ board }` |
| `item` | Content template for the individual items/cards | `{ item, board }` |
| `footer` | Replaces the default footer (where "Load More" lives) | `{ board }` |

### Usage

#### Basic Implementation

```vue
<script setup>
import { ref } from 'vue'

const boards = ref([
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
])

const items = ref([
  { id: '1', boardId: 'todo', title: 'Research competitors' },
  { id: '2', boardId: 'in-progress', title: 'Develop Kanban component' },
  { id: '3', boardId: 'done', title: 'Setup Vue 3 project' }
])
</script>

<template>
  <Kanban v-model:items="items" :boards="boards" />
</template>

```

#### Advanced Templating & Pagination

```vue
<Kanban 
  v-model:items="tasks" 
  :boards="columns"
  :has-more="{ 'todo': true }"
  @load-more="fetchMore"
>
  <template #header="{ board }">
    <div class="flex items-center gap-2 p-3 font-bold">
      <span class="w-3 h-3 rounded-full" :class="board.color"></span>
      {{ board.title }}
    </div>
  </template>

  <template #item="{ item }">
    <div class="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="font-medium">{{ item.title }}</h4>
      <div class="flex justify-between mt-2">
        <Badge :variant="item.priority === 'High' ? 'danger' : 'secondary'">
          {{ item.priority }}
        </Badge>
        <Avatar :src="item.assignee" size="xs" />
      </div>
    </div>
  </template>
</Kanban>

```

