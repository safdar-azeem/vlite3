# Screen

**Import:** `import { Screen } from 'vlite3'`

### Description

A high-level smart wrapper component designed to standardize page layouts. It automatically manages titles, search, pagination, custom filters, primary actions (Add buttons/modals), empty states, delete operations, and seamlessly toggles between `list` and `table` child components. View mode (table/list) is automatically persisted.

### Props

| Prop                   | Type                    | Default              | Description                                                                                                                                                  |
| :--------------------- | :---------------------- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | `string`                | `''`                 | Optional identifier used to persist the view state (list vs table)                                                                                           |
| `title`                | `string`                | `''`                 | Page title                                                                                                                                                   |
| `titleI18n`            | `string`                | —                    | I18n key for page title                                                                                                                                      |
| `description`          | `string`                | `''`                 | Subtitle/description text below the title                                                                                                                    |
| `descriptionI18n`      | `string`                | —                    | I18n key for description text                                                                                                                                |
| `data`                 | `any[]`                 | `[]`                 | Array of data passed down to table/list components                                                                                                           |
| `loading`              | `boolean`               | `false`              | Loading state, passed down to child components                                                                                                               |
| `pageInfo`             | `PageInfo`              | —                    | Pagination object (currentPage, totalPages, totalItems)                                                                                                      |
| `refetch`              | `Function`              | —                    | Callback function triggered on search, pagination, filter, or refresh. Payload: `{ pageinfo: { page, limit }, pagination: { page, limit }, search, filter }` |
| `list`                 | `Component`             | —                    | Vue component to render for the "List" view                                                                                                                  |
| `table`                | `Component`             | —                    | Vue component to render for the "Table" view                                                                                                                 |
| `canSearch`            | `boolean`               | `true`               | Show the search input                                                                                                                                        |
| `canAdd`               | `boolean`               | `true`               | Show the Add action button                                                                                                                                   |
| `showRefresh`          | `boolean`               | `false`              | Show a refresh icon button next to filters                                                                                                                   |
| `filterSchema`         | `IForm[]`               | `[]`                 | Form schema for the dynamic filter dropdown/modal                                                                                                            |
| `filterType`           | `'modal' \| 'dropdown'` | `'modal'`            | How to display the filters                                                                                                                                   |
| `pagination`           | `boolean`               | `true`               | Enable/show bottom pagination                                                                                                                                |
| `paginationProps`      | `ScreenPaginationProps` | (see below)          | Props forwarded to the internal Pagination component                                                                                                         |
| `customHeader`         | `boolean`               | `false`              | Completely replace the top section with `#custom-header`                                                                                                     |
| `addBtn`               | `AddBtnConfig`          | —                    | Configuration for the Add button (label, modal, link, etc.)                                                                                                  |
| `addComponent`         | `Component`             | —                    | Component to render instead of the default Add button                                                                                                        |
| `emptyTitle`           | `string`                | `'No records found'` | Title shown when data is empty                                                                                                                               |
| `emptyTitleI18n`       | `string`                | —                    | I18n key for empty text title                                                                                                                                |
| `emptyDescription`     | `string`                | (default text)       | Description shown when data is empty                                                                                                                         |
| `emptyDescriptionI18n` | `string`                | —                    | I18n key for empty description                                                                                                                               |
| `emptyIcon`            | `string`                | `'lucide:inbox'`     | Iconify ID shown when data is empty                                                                                                                          |

### AddBtnConfig (`addBtn` Prop)

```ts
export interface AddBtnConfig {
  label?: string
  icon?: string
  variant?: ButtonVariant
  to?: string | Record<string, any> // For Vue Router links
  href?: string // For external links
  target?: string
  onClick?: () => void // Custom click handler
  modal?: Component // Vue Component to open inside a Modal
  modalProps?: Record<string, any> // Props passed to the Modal
  buttonProps?: Record<string, any> // Props passed to the Button
}
```

### Events

- `@add`: Emitted when the default Add button is clicked (if `addBtn.onClick` or `addBtn.modal` is not used).
- `@delete`: Emitted when the user confirms the deletion of selected items. Payload: `items: any[]`

### Slots

| Slot            | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `title`         | Override the title element                                          |
| `description`   | Override the description element                                    |
| `before-search` | Inject elements just before the search, refresh, and filter buttons |
| `actions`       | Override the entire Add Button / Action area                        |
| `after-add`     | Inject elements just after the Add button                           |
| `custom-header` | Replace the entire header block (requires `customHeader` prop)      |
| `empty`         | Replace the default empty state UI                                  |

### Child Component Interface (List / Table)

When you pass a component to the `list` or `table` props, the `Screen` component automatically injects specific props into them. Your custom list or table components must be prepared to accept these props:

| Injected Prop | Type       | Description                                                                        |
| ------------- | ---------- | ---------------------------------------------------------------------------------- |
| `data`        | `any[]`    | The data array passed to the Screen component.                                     |
| `loading`     | `boolean`  | The loading state passed to the Screen component.                                  |
| `refetch`     | `Function` | The refetch function passed to the Screen component.                               |
| `delete`      | `Function` | Function to trigger the delete confirmation modal from within the child component. |

**Example of a valid child component (`UserTable.vue`):**

```vue
<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  refetch: { type: Function, default: () => {} },
})
</script>

<template>
  <DataTable
    :rows="data"
    :loading="loading"
    selectable // Screen will handle delete and selected rows automatically
  />
</template>

```

**Example of valid list child component (`UserList.vue`):**

```vue
<script setup>
const props = defineProps<{
  data?: any[]
  loading?: boolean
  delete?: (items: any[]) => void
}>()
</script>

<template>
  <DataList
    :data="data || []"
    :loading="loading"
    class-name="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <template #item="{ item }">
      <div
        class="p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <h3 class="font-semibold text-foreground text-lg">{{ item.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ item.email }}</p>
          </div>
          <span
            class="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
            :class="
              item.status === 'active'
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            ">
            {{ item.status }}
          </span>
        </div>

        <div class="mt-auto flex justify-between items-center pt-4 border-t border-border">
          <div class="flex items-center text-sm text-muted-foreground gap-1.5">
            <Icon icon="lucide:shield" class="w-4 h-4" />
            <span class="capitalize">{{ item.role || 'User' }}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon="lucide:trash-2"
            class="text-destructive border-destructive hover:bg-destructive/10"
            @click="props.delete?.([item])">
            Delete
          </Button>
        </div>
      </div>
    </template>
  </DataList>
</template>
```

### Usage

#### 1. Basic Setup with Table and Deletion

```vue
<script setup>
import { Screen } from 'vlite3'
import UserTable from './UserTable.vue'

const users = [
  /* data */
]
const fetchUsers = (params) => {
  console.log('Fetching with:', params)
}

const handleDelete = (items) => {
  console.log('Deleting items:', items)
  // call API to delete items, then refetch
}
</script>

<template>
  <Screen
    name="users-view"
    title="Users"
    description="Manage system users."
    :data="users"
    :table="UserTable"
    :refetch="fetchUsers"
    @add="openCreateUserForm"
    @delete="handleDelete" />
</template>
```

#### 2. Toggle Between Table and List View

When you provide both `table` and `list` props, the Screen component automatically renders a toggle switch and persists your choice.

```vue
<script setup>
import { Screen } from 'vlite3'
import ProductTable from './ProductTable.vue'
import ProductGrid from './ProductGrid.vue'
</script>

<template>
  <Screen
    name="products-directory"
    title="Products"
    :data="products"
    :table="ProductTable"
    :list="ProductGrid"
    :add-btn="{ label: 'New Product', icon: 'lucide:plus' }" />
</template>
```

#### 3. Advanced Filtering & Refresh Button

Use the `filterSchema` to automatically generate a powerful filter UI. Enable `showRefresh` for quick data reloading.

```vue
<script setup>
import { Screen } from 'vlite3'
import OrderList from './OrderList.vue'
import AddOrderModal from './AddOrderModal.vue'

const filters = [
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Completed', value: 'completed' },
    ],
  },
  { name: 'dateRange', label: 'Date Range', type: 'date' },
]
</script>

<template>
  <Screen
    name="orders-screen"
    title="Orders"
    :data="orders"
    :list="OrderList"
    show-refresh
    filter-type="dropdown"
    :filter-schema="filters"
    :add-btn="{
      label: 'Create Order',
      modal: AddOrderModal,
      modalProps: { title: 'Create New Order', maxWidth: 'max-w-xl' },
    }" />
</template>
```

#### 4. Customizing the Empty State

You can completely override what appears when `data` is empty.

```vue
<template>
  <Screen title="Invoices" :data="[]">
    <template #empty>
      <div class="p-12 text-center border-2 border-dashed rounded-lg bg-gray-50">
        <h2 class="text-xl font-bold text-gray-700">No Invoices Yet</h2>
        <p class="text-gray-500 mb-4">Create your first invoice to get started.</p>
        <Button variant="primary" icon="lucide:file-plus">Create Invoice</Button>
      </div>
    </template>
  </Screen>
</template>
```
