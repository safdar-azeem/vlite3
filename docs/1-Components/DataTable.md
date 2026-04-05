# DataTable

**Import:** `import { DataTable } from 'vlite3'`

### Props

| Prop                    | Type                       | Default             | Description                     |
| :---------------------- | :------------------------- | :------------------ | :------------------------------ |
| `rows`                  | `any[]`                    | `[]`                | Data array to display           |
| `headers`               | `TableHeader[]`            | `[]`                | Column definitions              |
| `keyField`              | `string`                   | `'auto'`            | Unique row identifier. `'auto'` picks `id` or `_id` from the first row. |
| `loading`               | `boolean`                  | `false`             | Show loading skeleton           |
| `hideSelectable`        | `boolean`                  | `false`             | Disable row selection. Automatically disabled when `hideSelectable: true`. |
| `sortable`              | `boolean`                  | `false`             | Enable column sorting           |
| `showPagination`        | `boolean`                  | `true`              | Show footer pagination          |
| `paginationProps`       | `DataTablePaginationProps` | Default config      | Props forwarded to `Pagination` |
| `pageInfo`              | `PageInfo`                 | —                   | Pagination metadata             |
| `striped`               | `boolean`                  | `false`             | Zebra striping                  |
| `hoverable`             | `boolean`                  | `true`              | Highlight row on hover          |
| `bordered`              | `boolean`                  | `true`              | Outer border                    |
| `compact`               | `boolean`                  | `false`             | Reduced padding                 |
| `variant`               | `'default' \| 'raised'`    | `'default'`         | Table style variant             |
| `emptyTitle`            | `string`                   | `'No data available'` | Empty state title             |
| `emptyTitleI18n`        | `string`                   | —                   | i18n key for empty title        |
| `emptyDescription`      | `string`                   | —                   | Empty state description         |
| `emptyDescriptionI18n`  | `string`                   | —                   | i18n key for empty description  |
| `emptyIcon`             | `string`                   | `'lucide:inbox'`    | Empty state icon                |

---

### Events

| Event                  | Payload           | Description |
| :--------------------- | :---------------- | :---------- |
| `@change`              | `TableState`      | Emitted on sort, pagination, or filter change. See `TableState` below. |
| `@select`              | `SelectionState`  | Emitted when row selection changes. |
| `@rowClick`            | `RowClickPayload` | Emitted when a row is clicked. |
| `@delete`              | `any[]`           | Emitted after delete confirmation with selected rows. |
| `@update:selectedRows` | `any[]`           | v-model binding for selected rows. |
| `@update:itemsPerPage` | `number`          | Emitted when items-per-page changes. |

---

### `@change` Payload — `TableState`
```ts
{
  pagination: { page: number; limit: number }
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  filter:     Record<string, any>
}
```

> `sort.field` will be the resolved `sortKey` value when one is set on the header, otherwise it is the column `field`. This is the value sent to the backend.

---

### Types
```ts
export type DataTablePaginationProps = Omit<PaginationProps, 'currentPage' | 'totalPages'>

export interface TableHeader {
  field:          string
  title:          string
  titleI18n?:     string
  /**
   * The key sent to the backend when sorting this column.
   * Falls back to `field` when not provided.
   * Use when the display field differs from the database column name.
   * Example: field: 'employee' (custom slot), sortKey: 'employeeName'
   */
  sortKey?:       string
  width?:         string
  minWidth?:      string
  sortable?:      boolean
  hideOnMobile?:  boolean
  align?:         'left' | 'center' | 'right'
  format?:        (value: any, row?: any) => string
  class?:         string | ((value: any, row?: any) => string)
  capitalize?:    boolean
  addStatusColor?: boolean
  type?:          'text' | 'price' | 'date' | 'number'
}

export interface TableState {
  pagination: { page: number; limit: number }
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  filter:     Record<string, any>
}

export interface TableFilter {
  pagination: { page: number; limit: number }
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  filter:     Record<string, any>
}
```

---

### Slots

| Slot             | Props                          | Description |
| :--------------- | :----------------------------- | :---------- |
| `[header.field]` | `{ value, row, index, field }` | Custom cell content. E.g. `#name="{ value, row }"` |
| `empty`          | —                              | Replaces the entire empty state |
| `empty-action`   | —                              | Action button inside the default empty state |

---

### `sortKey` — sorting a custom slot column

When a column uses a custom slot (e.g. `#employee`) to render a composite field, the display `field` value does not correspond to a real database column. Use `sortKey` to specify the actual backend field that should be used in the sort payload.
```ts
const headers = computed<TableHeader[]>(() => [
  {
    field: 'employee',       // used for the slot name (#employee) and display
    sortKey: 'employeeName', // sent to the backend in sort.field when this column is sorted
    title: 'Employee',
    sortable: true,
  },
  {
    field: 'department',
    sortKey: 'department.departmentName', // supports dot-notation for nested fields
    title: 'Department',
    sortable: true,
  },
  {
    field: 'status',
    title: 'Status',
    sortable: true,
    // no sortKey — 'status' is used directly
  },
])
```

When the user clicks the **Employee** column header, the emitted `sort` will be `{ field: 'employeeName', order: 'asc' }` — not `{ field: 'employee' }`. The column header highlight also tracks the resolved key correctly.

---

### Screen context (automatic behaviour)

When `DataTable` is rendered as a child of `Screen` (via `:table` prop or `#table` slot), it automatically detects the `Screen` context via Vue's `provide/inject` and:

- **Enables row selection** — required for Screen's bulk-delete feature.
- **Forwards sort and pagination state** to Screen's `refetch` — no extra wiring needed. Sort payloads respect `sortKey` when set.

---

### Standalone usage
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataTable } from 'vlite3'
import type { TableHeader, TableState } from 'vlite3'

const headers: TableHeader[] = [
  { field: 'employee', sortKey: 'employeeName', title: 'Employee', sortable: true },
  { field: 'email',    title: 'Email',  sortable: true },
  { field: 'status',   title: 'Status', sortable: true },
]

const rows    = ref([])
const loading = ref(false)
const pageInfo = ref()

const fetchData = async (state?: TableState) => {
  loading.value = true
  // state.sort.field will be 'employeeName' when the Employee column is sorted
  const res = await myApi.getEmployees(state)
  rows.value    = res.items
  pageInfo.value = res.pageInfo
  loading.value = false
}

onMounted(() => fetchData())
</script>

<template>
  <DataTable
    :rows="rows"
    :headers="headers"
    :loading="loading"
    :page-info="pageInfo"
    sortable
    @change="fetchData">
    <template #employee="{ row }">
      <div class="flex items-center gap-3">
        <img v-if="row.avatar" :src="row.avatar" class="w-9 h-9 rounded-full object-cover" />
        <div class="flex flex-col">
          <span class="font-medium text-sm">{{ row.employeeName }}</span>
          <span class="text-xs text-muted-foreground">{{ row.employeeId }}</span>
        </div>
      </div>
    </template>
  </DataTable>
</template>
```

---

### Usage inside Screen (recommended)
```vue
<!-- EmployeeTable.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { DataTable, type TableHeader } from 'vlite3'

defineProps<{ data: any[]; loading: boolean; delete?: Function }>()

const headers = computed<TableHeader[]>(() => [
  {
    field: 'employee',
    sortKey: 'employeeName', // backend receives 'employeeName', not 'employee'
    title: 'Employee',
    sortable: true,
  },
  { field: 'email',      title: 'Email',      sortable: true },
  {
    field: 'department',
    sortKey: 'department.departmentName',
    title: 'Department',
    sortable: true,
  },
  { field: 'status',  title: 'Status',  sortable: true },
  { field: 'actions', title: '', align: 'right' },
])
</script>

<template>
  <DataTable :headers="headers" :rows="data" sortable :loading="loading">
    <template #employee="{ row }">
      <div class="flex items-center gap-3">
        <img v-if="row.avatar" :src="row.avatar" class="w-9 h-9 rounded-full object-cover border shrink-0" />
        <div v-else class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
          {{ row.employeeName?.charAt(0) }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-medium text-sm truncate">{{ row.employeeName }}</span>
          <span class="text-xs text-muted-foreground">{{ row.employeeId }}</span>
        </div>
      </div>
    </template>
    <template #department="{ row }">{{ row.department?.departmentName || '-' }}</template>
    <template #status="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'secondary'">{{ value }}</Badge>
    </template>
    <template #actions="{ row }">
      <div class="flex justify-end gap-1">
        <Button variant="ghost" size="sm" icon="lucide:trash-2" class="text-red-500" @click="props.delete?.([row])" />
      </div>
    </template>
  </DataTable>
</template>
```
```vue
<!-- EmployeesPage.vue -->
<template>
  <Screen
    name="employees"
    title="Employees"
    :data="items"
    :loading="loading"
    :page-info="pageInfo"
    :table="EmployeeTable"
    :refetch="handleRefetch"
    @delete="handleDelete" />
</template>
```

> Clicking the **Employee** column header sends `{ sort: { field: 'employeeName', order: 'asc' } }` to `handleRefetch` — the backend-friendly key, not the slot name.
