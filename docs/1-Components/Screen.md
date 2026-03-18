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
| `descriptionI18n`      | `string`                         | —                                                                        | i18n key for the description.                                                                                                                                                                     |
| `info`                 | `string`                         | —                                                                        | Tooltip info text shown next to the title via an info icon.                                                                                                                                       |
| `infoI18n`             | `string`                         | —                                                                        | i18n key for the info tooltip.                                                                                                                                                                    |
| `data`                 | `any[]`                          | `[]`                                                                     | The data array passed down to the active view component/slot.                                                                                                                                     |
| `loading`              | `boolean`                        | `false`                                                                  | Propagated to child views and disables Refresh button while active.                                                                                                                               |
| `refetch`              | `Function`                       | —                                                                        | Called on every search, filter, pagination, sort, or quick-filter change. Receives `{ pagination, search, sort, filter, quickFilter }`.                                                           |
| `pageInfo`             | `PageInfo`                       | —                                                                        | Pagination metadata (`currentPage`, `totalPages`, `totalItems`, `itemsPerPage`).                                                                                                                  |
| `paginationProps`      | `ScreenPaginationProps`          | `{ alignment: 'between', navType: 'icon', showItemsPerPage: true, ... }` | Props forwarded to the `Pagination` component.                                                                                                                                                    |
| `canSearch`            | `boolean`                        | `true`                                                                   | Show/hide the search input.                                                                                                                                                                       |
| `canAdd`               | `boolean`                        | `true`                                                                   | Show/hide the Add button.                                                                                                                                                                         |
| `pagination`           | `boolean`                        | `true`                                                                   | Show/hide the pagination bar.                                                                                                                                                                     |
| `filterSchema`         | `IForm[]`                        | `[]`                                                                     | Form schema for the advanced filter modal/dropdown.                                                                                                                                               |
| `filterType`           | `'modal' \| 'dropdown'`          | `'modal'`                                                                | Style of the advanced filter trigger.                                                                                                                                                             |
| `showRefresh`          | `boolean`                        | `false`                                                                  | Show a manual Refresh button in the toolbar.                                                                                                                                                      |
| `quickFilters`         | `ScreenQuickFilter[]`            | `[]`                                                                     | Array of tab options rendered as a **line-variant tab bar** between the header and content. Selecting a tab resets to page 1 and passes the selected value as `quickFilter` in the refetch payload. |
| `defaultQuickFilter`   | `string \| number`               | first tab's value                                                        | Initial quick-filter value. Defaults to the first entry in `quickFilters` when not set.                                                                                                           |
| `list`                 | `Component`                      | —                                                                        | Component rendered in list/grid view.                                                                                                                                                             |
| `table`                | `Component`                      | —                                                                        | Component rendered in table view.                                                                                                                                                                 |
| `addBtn`               | `AddBtnConfig`                   | —                                                                        | Configuration for the Add button (label, icon, variant, modal, router link, etc.).                                                                                                                |
| `addComponent`         | `Component`                      | —                                                                        | Fully custom component to replace the default Add button area.                                                                                                                                    |
| `exportSchema`         | `ExportField[]`                  | `[]`                                                                     | Fields definition for the Export feature.                                                                                                                                                         |
| `importSchema`         | `ImportField[]`                  | `[]`                                                                     | Fields definition for the Import feature.                                                                                                                                                         |
| `exportProps`          | `Record<string,any> \| boolean`  | `false`                                                                  | Extra props forwarded to `ExportData`. Set to `true` to enable with defaults.                                                                                                                     |
| `importProps`          | `Record<string,any> \| boolean`  | `false`                                                                  | Extra props forwarded to `ImportData`. Set to `true` to enable with defaults.                                                                                                                     |
| `exportMode`           | `'frontend' \| 'backend'`        | `'frontend'`                                                             | Export processing mode.                                                                                                                                                                           |
| `exportType`           | `string`                         | —                                                                        | Identifier passed to `vliteConfig.services.exportApi` for backend exports.                                                                                                                        |
| `importType`           | `string`                         | —                                                                        | Identifier passed to `vliteConfig.services.importApi` for backend imports.                                                                                                                        |
| `customHeader`         | `boolean`                        | `false`                                                                  | When `true`, hides the auto-generated header — use the `#custom-header` slot instead.                                                                                                            |
| `emptyTitle`           | `string`                         | —                                                                        | Title shown in the empty state.                                                                                                                                                                   |
| `emptyTitleI18n`       | `string`                         | —                                                                        | i18n key for the empty state title.                                                                                                                                                               |
| `emptyDescription`     | `string`                         | —                                                                        | Description shown in the empty state.                                                                                                                                                             |
| `emptyDescriptionI18n` | `string`                         | —                                                                        | i18n key for the empty state description.                                                                                                                                                         |
| `emptyIcon`            | `string`                         | `'lucide:inbox'`                                                         | Icon shown in the empty state.                                                                                                                                                                    |
| `containerClass`       | `string`                         | —                                                                        | Extra CSS class applied to the content wrapper `<div>`.                                                                                                                                           |
| `headerClass`          | `string`                         | —                                                                        | Extra CSS class applied to the header row `<div>`.                                                                                                                                                |
| `viewProps`            | `Record<string,any>`             | `{}`                                                                     | Additional props forwarded to the active view component.                                                                                                                                          |
| `hideSelectable`       | `boolean`                        | `false`                                                                  | Hides the row-selection checkbox and bulk-delete button.                                                                                                                                          |

---

### Quick Filters

Quick filters provide a **tab bar** UI pattern common in modern dashboards (Shopify, Linear, Vercel). They appear between the header toolbar and the content area, using a clean `line` variant.

#### `ScreenQuickFilter` type
```ts
export interface ScreenQuickFilter {
  label: string
  labelI18n?: string
  value: string | number
  icon?: string
  /** Optional badge/count shown next to the label, e.g. "Active (12)" */
  count?: number
}
```

#### Refetch payload

When a quick-filter tab is selected, `refetch` is called with an augmented payload:
```ts
refetch({
  pagination: { page: 1, limit: 10 },
  search: '...',
  sort: { field: '', order: '' },
  filter: { ... },
  quickFilter: 'active', // ← the selected tab value; '' means "All"
})
```

#### Examples

**Products screen**
```vue
<Screen
  title="Products"
  :quick-filters="[
    { label: 'All',      value: '' },
    { label: 'Active',   value: 'active' },
    { label: 'Draft',    value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ]"
  :refetch="fetchProducts" />
```

**Orders screen**
```vue
<Screen
  title="Orders"
  :quick-filters="[
    { label: 'All',        value: '' },
    { label: 'Completed',  value: 'completed',  count="124" },
    { label: 'Processing', value: 'processing', count="8" },
    { label: 'Pending',    value: 'pending',    count="3" },
    { label: 'Cancelled',  value: 'cancelled' },
  ]"
  :refetch="fetchOrders" />
```

---

### Slots

| Slot            | Description                                                                                                             |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `title`         | Replaces the `<h1>` title element.                                                                                      |
| `description`   | Replaces the description paragraph.                                                                                     |
| `before-search` | Injected before the search input in the toolbar.                                                                        |
| `actions`       | Replaces the entire Add button area (use to provide fully custom action buttons).                                       |
| `after-add`     | Appended after the Add button / ScreenOptionsDropdown.                                                                  |
| `custom-header` | Full replacement header (only rendered when `customHeader: true`).                                                      |
| `sub-header`    | Rendered after the main header row and after the quick-filter tabs, before the content.                                 |
| `empty`         | Custom empty state (replaces `ScreenEmptyState`).                                                                       |
| `table`         | Slot-based table view. Receives `{ data, loading, selectedRows, delete, updateSelectedRows }`.                          |
| `list`          | Slot-based list view. Same scoped props as `#table`.                                                                    |
| `grid`          | Slot-based grid view (treated as list mode). Same scoped props.                                                         |

---

### Events

| Event    | Payload   | Description                            |
| :------- | :-------- | :------------------------------------- |
| `add`    | —         | Emitted when the default Add is clicked (no `addBtn` configured). |
| `delete` | `any[]`   | Emitted after the user confirms bulk/row deletion.                |

---

### Usage

#### Basic with quick filters
```vue
<Screen
  name="orders"
  title="Orders"
  :data="orders"
  :loading="loading"
  :page-info="pageInfo"
  :table="OrderTable"
  :quick-filters="[
    { label: 'All',        value: '' },
    { label: 'Completed',  value: 'completed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending',    value: 'pending' },
    { label: 'Cancelled',  value: 'cancelled' },
  ]"
  :refetch="fetchOrders" />
```

#### Reading `quickFilter` in your refetch handler
```ts
const fetchOrders = (payload) => {
  const { pagination, search, filter, quickFilter } = payload
  // quickFilter === '' → show all
  // quickFilter === 'pending' → filter by pending status
  api.getOrders({
    page: pagination.page,
    limit: pagination.limit,
    search,
    status: quickFilter || undefined,
    ...filter,
  })
}
```
