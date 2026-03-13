# Screen

**Import:** `import { Screen } from 'vlite3'`

### Description

`Screen` is a high-level smart wrapper component designed to standardise page layouts. It automatically manages titles, search, pagination, custom filters, primary actions (Add buttons/modals), empty states, delete operations, and seamlessly toggles between `list` and `table` child components (or slots). View mode (table/list) is automatically persisted using `usePersistentState`.
It also supports built-in **Export** and **Import** capabilities (via `ExportData` and `ImportData` sub-components) accessible through a contextual dropdown menu when configured.
Alternatively, you can provide layouts via the `#table`, `#list`, and `#grid` slots instead of component props, which also support the view toggling and receive all necessary props exactly like the child components do.

---

### Props

| Prop                   | Type                             | Default                                                                  | Description                                                                                                                                                                                       |
| :--------------------- | :------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                 | `string`                         | `''`                                                                     | Optional identifier used to persist the view state (list vs table). Combined with `title` to form a unique storage key.                                                                           |
| `title`                | `string`                         | `''`                                                                     | Page title displayed at the top of the screen header.                                                                                                                                             |
| `titleI18n`            | `string`                         | —                                                                        | i18n key for the page title. Takes priority over `title` when set.                                                                                                                                |
| `description`          | `string`                         | `''`                                                                     | Subtitle/description text rendered below the title.                                                                                                                                               |
| `descriptionI18n`      | `string`                         | —                                                                        | i18n key for the description. Takes priority over `description` when set.                                                                                                                         |
| `info`                 | `string`                         | —                                                                        | Tooltip text shown when hovering the information (i) icon next to the title.                                                                                                                      |
| `infoI18n`             | `string`                         | —                                                                        | i18n key for the info tooltip. Takes priority over `info` when set.                                                                                                                               |
| `data`                 | `any[]`                          | `[]`                                                                     | Array of data passed down to the active table/list child component.                                                                                                                               |
| `loading`              | `boolean`                        | `false`                                                                  | Loading state passed down to child components.                                                                                                                                                    |
| `pageInfo`             | `PageInfo`                       | —                                                                        | Pagination metadata object. See `PageInfo` type below.                                                                                                                                            |
| `refetch`              | `Function`                       | —                                                                        | Callback triggered on search input, pagination change, filter apply, sort change, or refresh click. Receives the standard payload. See payload shape below.                                       |
| `list`                 | `Component`                      | —                                                                        | Vue component to render for the "List / Grid" view mode.                                                                                                                                          |
| `table`                | `Component`                      | —                                                                        | Vue component to render for the "Table" view mode.                                                                                                                                                |
| `canSearch`            | `boolean`                        | `true`                                                                   | Show or hide the search input field.                                                                                                                                                              |
| `canAdd`               | `boolean`                        | `true`                                                                   | Show or hide the primary Add action button.                                                                                                                                                       |
| `showRefresh`          | `boolean`                        | `false`                                                                  | Show a refresh icon button next to the filter button.                                                                                                                                             |
| `filterSchema`         | `IForm[]`                        | `[]`                                                                     | Form field schema for the dynamic filter UI. An empty array hides the filter button.                                                                                                              |
| `filterType`           | `'modal' \| 'dropdown'`          | `'modal'`                                                                | Determines whether the filter panel appears in a modal dialog or an inline dropdown.                                                                                                              |
| `pagination`           | `boolean`                        | `true`                                                                   | Enable or disable the bottom pagination bar.                                                                                                                                                      |
| `paginationProps`      | `ScreenPaginationProps`          | `{ alignment: 'between', navType: 'icon', showItemsPerPage: true, ... }` | Additional props forwarded directly to the internal `Pagination` component.                                                                                                                       |
| `customHeader`         | `boolean`                        | `false`                                                                  | When `true`, hides the built-in header and renders the `#custom-header` slot instead.                                                                                                             |
| `addBtn`               | `AddBtnConfig`                   | —                                                                        | Configuration object for the Add button behaviour (label, modal, router link, external href, custom click). See `AddBtnConfig` below.                                                             |
| `addComponent`         | `Component`                      | —                                                                        | Replaces the default Add button with a fully custom component. Rendered in both the header and the empty state.                                                                                   |
| `emptyTitle`           | `string`                         | `'No records found'`                                                     | Title text shown when `data` is empty and not loading.                                                                                                                                            |
| `emptyTitleI18n`       | `string`                         | —                                                                        | i18n key for the empty state title.                                                                                                                                                               |
| `emptyDescription`     | `string`                         | _(library default)_                                                      | Description text shown in the empty state.                                                                                                                                                        |
| `emptyDescriptionI18n` | `string`                         | —                                                                        | i18n key for the empty state description.                                                                                                                                                         |
| `emptyIcon`            | `string`                         | `'lucide:inbox'`                                                         | Iconify icon ID displayed in the empty state illustration.                                                                                                                                        |
| `exportSchema`         | `ExportField[] \| any[]`         | `[]`                                                                     | Field definitions for the export feature. When non-empty and `exportProps` is not `false`, an Export option appears in the "More Options" dropdown.                                               |
| `importSchema`         | `ImportField[] \| any[]`         | `[]`                                                                     | Field definitions for the import feature. When non-empty and `importProps` is not `false`, an Import option appears in the "More Options" dropdown.                                               |
| `exportProps`          | `Record<string, any> \| boolean` | `false`                                                                  | Set to `true` or an object of props to enable export. Set to `false` to disable export even if `exportSchema` is provided.                                                                        |
| `importProps`          | `Record<string, any> \| boolean` | `false`                                                                  | Set to `true` or an object of props to enable import. Set to `false` to disable import even if `importSchema` is provided.                                                                        |
| `exportMode`           | `'frontend' \| 'backend'`        | `'frontend'` _(or from global config)_                                   | Controls whether export is handled client-side (`'frontend'`) or delegated to a backend API (`'backend'`).                                                                                        |
| `exportType`           | `string`                         | —                                                                        | A string identifier passed to `vliteConfig.services.exportApi` when `exportMode` is `'backend'`.                                                                                                  |
| `importType`           | `string`                         | —                                                                        | A string identifier passed to `vliteConfig.services.importApi` for generic server-side batch processing.                                                                                          |
| `containerClass`       | `string`                         | —                                                                        | Additional CSS classes applied to the main content area wrapper `div`.                                                                                                                            |
| `headerClass`          | `string`                         | —                                                                        | Additional CSS classes applied to the header row `div`.                                                                                                                                           |
| `viewProps`            | `Record<string, any>`            | `{}`                                                                     | Props object forwarded to the `list` / `table` child components (and `#list` / `#table` / `#grid` slots). Solves the case where the parent screen cannot directly pass props to those components. |
| `canSelectRows`        | `boolean`                        | `true`                                                                   | Permission flag (styled like `canAdd` / `canSearch`) to enable/disable row selection. When `false`, checkboxes, bulk-delete button and `forceSelectable` context are disabled.                    |

---

### `refetch` Payload Shape

The `refetch` function is called with a single standardised payload every time the user interacts with search, pagination, filters, sort, or the refresh button.

```ts
{
  pagination: {
    page: number
    limit: number
  } // current page and items-per-page
  search: string // current search query string
  sort: {
    field: string
    order: 'asc' | 'desc' | ''
  } // active sort (from DataTable)
  filter: Record<string, any> // active filter values keyed by field name
}
```

> **Sort is automatic.** When the child component is a `DataTable` with `sortable`, column sort clicks are intercepted by `Screen` via Vue's `provide/inject` context and automatically merged into the payload — no extra wiring needed in your child component or page.

---

### `PageInfo` Type

```ts
interface PageInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage?: number
}
```

---

### `AddBtnConfig` Type

Passed to the `addBtn` prop to configure the primary action button.

```ts
export interface AddBtnConfig {
  label?: string // Button label text
  labelI18n?: string // i18n key for button label (takes priority over label)
  icon?: string // Iconify icon ID (default: 'fluent:add-16-filled')
  variant?: ButtonVariant // Button style variant (default: 'primary')
  to?: string | Record<string, any> // Vue Router route object or path string
  href?: string // External URL for an <a> tag link
  target?: string // Link target (_blank, _self, etc.)
  onClick?: () => void // Custom click handler (overrides @add emit)
  modal?: Component // Vue component to open inside a Modal dialog
  modalProps?: Record<string, any> // Props forwarded to the Modal wrapper
  buttonProps?: Record<string, any> // Extra props forwarded to the Button element
}
```

**Priority order for the Add button action:**

1. `addBtn.modal` — Opens the given component in a modal.
2. `addBtn.to` — Navigates via Vue Router.
3. `addBtn.href` — Navigates via native `<a>` link.
4. `addBtn.onClick` — Executes the custom handler.
5. _(fallback)_ — Emits the `@add` event.

---

### `ScreenPaginationProps` Type

All props from the `Pagination` component are supported **except** `currentPage` and `totalPages`, which are controlled by `Screen` internally.

```ts
export interface ScreenPaginationProps extends Omit<
  PaginationProps,
  'currentPage' | 'totalPages'
> {}
```

---

### Events

| Event     | Payload        | Description                                                                                                               |
| :-------- | :------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `@add`    | _(none)_       | Emitted when the Add button is clicked and no `addBtn.modal`, `addBtn.to`, `addBtn.href`, or `addBtn.onClick` is defined. |
| `@delete` | `items: any[]` | Emitted after the user confirms deletion in the `ConfirmationModal`. Payload is the array of items selected for deletion. |

---

### Slots

| Slot            | Props Available                                               | Description                                                                                                     |
| :-------------- | :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| `title`         | —                                                             | Replaces the rendered `<h1>` title element entirely.                                                            |
| `description`   | —                                                             | Replaces the rendered `<p>` description element entirely.                                                       |
| `before-search` | —                                                             | Injects content just before the search input, refresh, and filter buttons in the header row.                    |
| `actions`       | —                                                             | Replaces the entire Add button / action area (overrides `addBtn`, `addComponent`, `canAdd`).                    |
| `after-add`     | —                                                             | Injects content immediately after the Add button (e.g., for secondary action buttons).                          |
| `custom-header` | —                                                             | Replaces the **entire** built-in header block. Requires `customHeader: true` prop to activate.                  |
| `sub-header`    | —                                                             | Injects content **between** the header and the table/grid/list. Ideal for tabs, stats bars, alerts, or banners. |
| `empty`         | —                                                             | Replaces the default empty state UI when `data` is empty and not loading.                                       |
| `table`         | `{ data, loading, selectedRows, delete, updateSelectedRows }` | Renders the Table view when active. Used in place of the `table` component prop.                                |
| `list`          | `{ data, loading, selectedRows, delete, updateSelectedRows }` | Renders the List view when active. Used in place of the `list` component prop.                                  |
| `grid`          | `{ data, loading, selectedRows, delete, updateSelectedRows }` | Renders the Grid view when active. Triggers the 'list' view mode internally.                                    |

---

### Injected Provides (for Child Components)

`Screen` uses Vue's `provide/inject` mechanism to communicate with deeply nested components:
| Key | Type | Description |
| :---------------------- | :----------------------- | :------------------------------------------------------------------ |
| `screen-selected-rows` | `Ref<any[]>` | Reactive array of currently selected rows (for bulk delete). |
| `screen-request-delete` | `(items: any[]) => void` | Function to trigger the delete confirmation modal programmatically. |
| `SCREEN_CONTEXT_KEY` | `ScreenContext` | Internal context consumed by `DataTable` to auto-wire sort, search disable, and selectable. |

---

### Screen → DataTable automatic wiring

When `DataTable` is a child of `Screen` (passed via `:table` prop or `#table` slot), Screen provides a `ScreenContext` object that `DataTable` injects automatically. This context does three things with zero extra code in your child component:
| Behaviour | What happens |
| :--- | :--- |
| **Search disabled** | `DataTable` hides its own search toolbar — `Screen` owns the search input. |
| **Selectable forced** | `DataTable` enables row checkboxes **only if `canSelectRows` is `true`** for `Screen`'s bulk-delete feature. |
| **Sort forwarded** | Every `@change` from `DataTable` (sort click, page change) is forwarded to `Screen`'s `refetch` via `ScreenContext.onTableChange`. |
The `refetch` payload always uses the standardised shape `{ pagination, search, sort, filter }` regardless of which interaction triggered it.

---

### Child Component Interface (List / Table)

When you pass a component to the `list` or `table` props, `Screen` automatically binds the following props to it. Your child component **must** accept these props:
| Injected Prop | Type | Description |
| :------------- | :----------------------- | :----------------------------------------------------------------------- |
| `data` | `any[]` | The data array from the `Screen` component. |
| `loading` | `boolean` | The loading state from the `Screen` component. |
| `refetch` | `Function` | The refetch callback from the `Screen` component. |
| `selectedRows` | `any[]` _(v-model)_ | Two-way bound array of selected rows for bulk delete support. |
| `delete` | `(items: any[]) => void` | Function to trigger the delete confirmation modal from inside the child. |
| `@delete` | `items: any[]` _(event)_ | Alternative event to trigger delete from the child component. |
**Note:** All props defined in the new `viewProps` object on `Screen` are also forwarded to your child component (via `v-bind`).
**Example — Table Child Component (`UserTable.vue`):**

```vue
<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  refetch: { type: Function, default: () => {} },
  selectedRows: { type: Array, default: () => [] },
  delete: { type: Function, default: null },
})
const emit = defineEmits(['update:selectedRows'])
</script>
<template>
  <DataTable :rows="data" :loading="loading" />
</template>
```

> `sortable` on `DataTable` is sufficient — sort state flows to Screen's `refetch` automatically.

---

### Internal Behaviour Details

**Search Debounce:** The search input is debounced by **300ms** before triggering `refetch`.
**Sort integration:** When the child `DataTable` emits `@change` (e.g. a column header click), `Screen` receives the sort state via `ScreenContext.onTableChange`, merges it into `activeSort`, and calls `triggerChange()`. The sort is included in every subsequent `refetch` call until cleared.
**View Persistence:** The active view mode (`'table'` or `'list'`) is persisted to local storage using the key `view-mode-{name || title || 'default-screen'}`.
**View Toggle:** The list/table toggle buttons are only rendered when **both** `list` and `table` props are provided.
**Delete Flow:** The delete confirmation modal (`ConfirmationModal`) is shown before emitting `@delete`. The modal can be triggered either by selecting rows (bulk delete via the trash button in the header) or by calling the injected `screen-request-delete` function from a child component.
**Export/Import Dropdown:** The "More Options" (`lucide:more-vertical`) dropdown is rendered only when at least one of `exportSchema`/`importSchema` is provided and their corresponding `exportProps`/`importProps` is not `false`.

---

### Usage Examples

#### 1. Basic Setup with Sortable Table

```vue
<script setup>
import { computed } from 'vue'
import { Screen } from 'vlite3'
import { useGetUsersQuery, useDeleteUsersMutation } from '@/graphql'
import UserTable from './UserTable.vue'
const { result, loading, refetch } = useGetUsersQuery({ pagination: { page: 1, limit: 10 } })
const items = computed(() => result.value?.getUsers?.items || [])
const pageInfo = computed(() => result.value?.getUsers?.pageInfo)
// payload: { pagination, search, sort, filter }
const handleRefetch = (p: any) => refetch(p)
const handleDelete = (items) => {
  deleteUsers({ ids: items.map(i => i.id) })
}
</script>
<template>
  <Screen
    name="users-view"
    title="Users"
    :data="items"
    :loading="loading"
    :page-info="pageInfo"
    :table="UserTable"
    :refetch="handleRefetch"
    @delete="handleDelete" />
</template>
```

> `UserTable.vue` only needs `sortable` on its `DataTable` — Screen handles the rest automatically.

---

#### 2. Toggle Between Table and List View

When both `table` and `list` props are provided, a view toggle switch automatically appears and the user's choice is persisted.

```vue
<template>
  <Screen
    name="products-directory"
    title="Products"
    :data="products"
    :table="ProductTable"
    :list="ProductGrid"
    :refetch="handleRefetch"
    :add-btn="{ label: 'New Product', icon: 'lucide:plus' }" />
</template>
```

---

#### 3. Advanced Filtering with Refresh Button

```vue
<template>
  <Screen
    name="orders-screen"
    title="Orders"
    :data="orders"
    :list="OrderList"
    :refetch="handleRefetch"
    show-refresh
    filter-type="dropdown"
    :filter-schema="[
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
    ]"
    :add-btn="{
      label: 'Create Order',
      modal: AddOrderModal,
      modalProps: { title: 'Create New Order', maxWidth: 'max-w-xl' },
    }" />
</template>
```

---

#### 4. With Pagination

```vue
<template>
  <Screen
    name="invoices-screen"
    title="Invoices"
    :data="invoices"
    :loading="isLoading"
    :page-info="pageInfo"
    :table="InvoiceTable"
    :refetch="fetchInvoices"
    :pagination-props="{
      alignment: 'end',
      navType: 'full',
      showItemsPerPage: true,
      itemsPerPageOptions: [10, 25, 50],
    }" />
</template>
```

---

#### 5. Sub-Header Slot

```vue
<template>
  <Screen title="Orders" :data="orders" :table="OrderTable" :refetch="handleRefetch">
    <template #sub-header>
      <div class="flex gap-2 border-b border-border pb-3">
        <button
          v-for="tab in ['All', 'Pending', 'Completed', 'Cancelled']"
          :key="tab"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="
            activeTab === tab
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
    </template>
  </Screen>
</template>
```

---

#### 6. Export and Import Integration

```vue
<template>
  <Screen
    name="users-screen"
    title="Users"
    :data="users"
    :table="UserTable"
    :refetch="fetchUsers"
    :export-schema="[
      { field: 'id', title: 'ID' },
      { field: 'name', title: 'Name' },
      { field: 'email', title: 'Email' },
    ]"
    :import-schema="[
      { field: 'name', title: 'Name', required: true },
      { field: 'email', title: 'Email', required: true },
    ]"
    export-props
    import-props
    export-type="user"
    import-type="user"
    @delete="handleDelete" />
</template>
```

---

#### 7. Backend Export Mode

```vue
<template>
  <Screen
    name="reports-screen"
    title="Reports"
    :data="reports"
    :table="ReportTable"
    :refetch="fetchReports"
    export-mode="backend"
    export-type="report"
    export-props
    :export-schema="[
      { field: 'id', title: 'ID' },
      { field: 'title', title: 'Title' },
    ]" />
</template>
```

Your global vlite config must define:

```ts
// vlite.config.ts
{
  services: {
    exportApi: async (
      type: string,
      payload: { format: string; search: string; filter: object }
    ) => {
      const blob = await myApi.export(type, payload)
      saveAs(blob, `${type}-export.${payload.format}`)
    }
  }
}
```

---

#### 8. Custom Empty State

```vue
<template>
  <Screen title="Invoices" :data="[]" :can-add="false">
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

---

#### 9. Using Slots Instead of Props

```vue
<template>
  <Screen title="Clients" :data="clients" :refetch="fetchClients">
    <template #table="{ data, loading, selectedRows, delete: requestDelete, updateSelectedRows }">
      <DataTable :rows="data" :loading="loading">
        <template #actions="{ row }">
          <Button variant="ghost" icon="lucide:trash-2" @click="requestDelete([row])" />
        </template>
      </DataTable>
    </template>
    <template #grid="{ data }">
      <div class="grid grid-cols-2 gap-4">
        <Card v-for="client in data" :key="client.id">{{ client.name }}</Card>
      </div>
    </template>
  </Screen>
</template>
```

> When using the `#table` slot directly, `DataTable`'s sort state is still forwarded to Screen's `refetch` automatically via the injected context.
