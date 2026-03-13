# DataTable

**Import:** `import { DataTable } from 'vlite3'`

### Props

| Prop                    | Type                       | Default             | Description                     |
| :---------------------- | :------------------------- | :------------------ | :------------------------------ |
| `rows`                  | `any[]`                    | `[]`                | Data array to display           |
| `headers`               | `TableHeader[]`            | `[]`                | Column definitions              |
| `keyField`              | `string`                   | `'auto'`            | Unique row identifier. `'auto'` picks `id` or `_id` from the first row. |
| `search`                | `string`                   | `''`                | External search query string    |
| `showSearch`            | `boolean`                  | `true`              | Show built-in search input. Automatically `false` when inside `Screen`. |
| `searchPlaceholder`     | `string`                   | `'Search...'`       | Placeholder for search input    |
| `searchPlaceholderI18n` | `string`                   | —                   | i18n key for search placeholder |
| `loading`               | `boolean`                  | `false`             | Show loading skeleton           |
| `selectable`            | `boolean`                  | `false`             | Enable row selection. Automatically `true` when inside `Screen`. |
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

| Event                    | Payload              | Description |
| :----------------------- | :------------------- | :---------- |
| `@change`                | `TableState`         | Emitted on sort, pagination, or search change. See `TableState` below. |
| `@select`                | `SelectionState`     | Emitted when row selection changes. |
| `@rowClick`              | `RowClickPayload`    | Emitted when a row is clicked. |
| `@delete`                | `any[]`              | Emitted after delete confirmation with selected rows. |
| `@update:selectedRows`   | `any[]`              | v-model binding for selected rows. |
| `@update:itemsPerPage`   | `number`             | Emitted when items-per-page changes. |

---

### `@change` Payload — `TableState`
```ts
{
  pagination: { page: number; limit: number }
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  search:     string
  filter:     Record<string, any>
}
```

> **Note:** When `DataTable` is used inside `Screen` (via `:table` prop or `#table` slot), `@change` is still emitted normally **and** the state is automatically forwarded to `Screen`'s `refetch` via the injected context — no wiring needed in your child component.

---

### Types
```ts
export type DataTablePaginationProps = Omit<PaginationProps, 'currentPage' | 'totalPages'>

export interface TableHeader {
  field: string
  title: string
  titleI18n?: string
  width?: string
  minWidth?: string
  sortable?: boolean
  hideOnMobile?: boolean
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row?: any) => string
  class?: string | ((value: any, row?: any) => string)
  capitalize?: boolean
  addStatusColor?: boolean
  type?: 'text' | 'price' | 'date' | 'number'
}

export interface TableState {
  pagination: { page: number; limit: number }
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  search:     string
  filter:     Record<string, any>
}

export interface TableFilter {
  pagination: { page: number; limit: number }
  search:     string
  sort:       { field: string; order: 'asc' | 'desc' | '' }
  filter:     Record<string, any>
}
```

---

### Slots

| Slot              | Props                          | Description |
| :---------------- | :----------------------------- | :---------- |
| `[header.field]`  | `{ value, row, index, field }` | Custom cell content. E.g. `#name="{ value, row }"` |
| `toolbar-left`    | —                              | Left side of the toolbar |
| `toolbar-right`   | —                              | Right side of the toolbar |
| `empty`           | —                              | Replaces the entire empty state |
| `empty-action`    | —                              | Action button inside the default empty state |

---

### Screen context (automatic behaviour)

When `DataTable` is rendered as a child of `Screen` (via `:table` prop or `#table` slot), it automatically detects the `Screen` context via Vue's `provide/inject` and:

- **Hides its own search toolbar** — Screen owns the search input.
- **Enables row selection** — required for Screen's bulk-delete feature.
- **Forwards sort, pagination, and search state** to Screen's `refetch` — no extra wiring needed in your child component. Every sort click triggers `Screen`'s `refetch` with the full standardised payload.

This means a `BranchTable.vue` only needs to declare `sortable` on `DataTable` and the sort state is automatically propagated up to the page query with zero extra code.

---

### Standalone usage
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataTable } from 'vlite3'
import type { TableHeader, TableState } from 'vlite3'

const headers: TableHeader[] = [
  { field: 'name',   title: 'Name',   sortable: true },
  { field: 'email',  title: 'Email',  sortable: true },
  { field: 'status', title: 'Status', sortable: true },
]

const rows = ref([])
const loading = ref(false)
const pageInfo = ref()

const fetchData = async (state?: TableState) => {
  loading.value = true
  // state shape: { pagination, sort, search, filter }
  const res = await myApi.getUsers(state)
  rows.value = res.items
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
    selectable
    @change="fetchData">
    <template #status="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'secondary'">{{ value }}</Badge>
    </template>

    <template #toolbar-right>
      <Button icon="lucide:plus">Add User</Button>
    </template>
  </DataTable>
</template>
```

---

### Usage inside Screen (recommended)

When `DataTable` is used as a child of `Screen`, **you do not need to handle `@change` or wire up sorting yourself**. Screen intercepts the sort state automatically.
```vue
<!-- BranchTable.vue — child component passed to Screen -->
<script setup lang="ts">
import { computed } from 'vue'
import { DataTable, type TableHeader } from 'vlite3'

defineProps<{
  data:    any[]
  loading: boolean
  delete?: Function
}>()

const headers = computed<TableHeader[]>(() => [
  { field: 'branchName', title: 'Branch Name', sortable: true },
  { field: 'email',      title: 'Email' },
  { field: 'phone',      title: 'Phone' },
  { field: 'actions',   title: '', align: 'right' },
])
</script>

<template>
  <!-- sortable declared here — sort state auto-flows to Screen's refetch -->
  <DataTable :headers="headers" :rows="data" sortable :loading="loading">
    <template #actions="{ row }">
      <Button variant="ghost" size="sm" icon="lucide:trash-2" @click="props.delete?.([row])" />
    </template>
  </DataTable>
</template>
```
```vue
<!-- BranchesPage.vue — the Screen that owns the query -->
<script setup lang="ts">
import { computed } from 'vue'
import { Screen } from 'vlite3'
import { useGetBranchesQuery, useDeleteBranchesMutation } from '@/graphql'
import BranchTable from './BranchTable.vue'

const { result, loading, refetch } = useGetBranchesQuery({ pagination: { page: 1, limit: 10 } })

const items    = computed(() => result.value?.getBranches?.items   || [])
const pageInfo = computed(() => result.value?.getBranches?.pageInfo)

// payload shape: { pagination, search, sort, filter }
const handleRefetch = (p: any) => refetch(p)
</script>

<template>
  <Screen
    name="branches"
    title="Branches"
    :data="items"
    :loading="loading"
    :page-info="pageInfo"
    :table="BranchTable"
    :refetch="handleRefetch"
    @delete="handleDelete" />
</template>
```

> Clicking a sortable column header in `BranchTable` automatically calls `handleRefetch` with `{ pagination, search, sort: { field: 'branchName', order: 'asc' }, filter }` — no extra code needed.
