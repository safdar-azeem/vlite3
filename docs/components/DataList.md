# DataList

**Import:** `import { DataList } from 'vlite3'`

### Props

| Prop                  | Type                                        | Default                                                               | Description                                    |
| :-------------------- | :------------------------------------------ | :-------------------------------------------------------------------- | :--------------------------------------------- |
| `data`                | `any[]`                                     | `[]`                                                                  | Array of items to display                      |
| `loading`             | `boolean`                                   | `false`                                                               | Show loading skeleton                          |
| `pageInfo`            | `DataListPageInfo`                          | —                                                                     | Pagination information object                  |
| `className`           | `string`                                    | `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6` | CSS classes for the grid/list container        |
| `item`                | `Component`                                 | —                                                                     | Vue component to render each item              |
| `skeleton`            | `Component`                                 | —                                                                     | Vue component to render while loading          |
| `itemProps`           | `Record<string, any>`                       | `{}`                                                                  | Additional props to pass to the item component |
| `showPagination`      | `boolean`                                   | `true`                                                                | Show footer pagination                         |
| `paginationPosition`  | `'start' \| 'center' \| 'end' \| 'between'` | `between`                                                             | Alignment of the pagination                    |
| `itemsPerPageOptions` | `number[]`                                  | `[10, 25, 50, 100]`                                                   | Options for items per page dropdown            |
| `showItemsPerPage`    | `boolean`                                   | `false`                                                               | Show items per page selector                   |
| `emptyTitle`          | `string`                                    | `No data found`                                                       | Title displayed when data is empty             |
| `emptyDescription`    | `string`                                    | `We could not find any items to display here.`                        | Description displayed when data is empty       |
| `emptyIcon`           | `string`                                    | `lucide:inbox`                                                        | Icon displayed when data is empty              |

### Types

```ts
export interface DataListPageInfo {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}
```

### Slots

| Slot       | Description                                         |
| ---------- | --------------------------------------------------- |
| `item`     | Custom item layout (props: `{ item, data, index }`) |
| `skeleton` | Custom skeleton loader layout (props: `{ index }`)  |
| `empty`    | Custom empty state layout                           |

### Events

| Event                 | Payload         | Description                             |
| --------------------- | --------------- | --------------------------------------- |
| `page-change`         | `page: number`  | Fired when the pagination page changes  |
| `update:itemsPerPage` | `limit: number` | Fired when items per page limit changes |

### Usage

**Slot-based Rendering:**

```vue
<DataList :data="items" :loading="isLoading" :page-info="pageInfo">
  <template #skeleton="{ index }">
    <div class="h-48 bg-gray-200 animate-pulse rounded-lg w-full"></div>
  </template>

  <template #item="{ item }">
    <div class="p-4 border rounded-lg shadow-sm">
      <h3 class="font-bold">{{ item.title }}</h3>
      <p class="text-sm text-gray-500">{{ item.description }}</p>
    </div>
  </template>
</DataList>
```

**Component Prop-based Rendering:**

```vue
<script setup>
import ItemCard from './ItemCard.vue'
import ItemSkeleton from './ItemSkeleton.vue'

const handlePageChange = (page) => {
  console.log('Fetching page:', page)
}
</script>

<template>
  <DataList
    :data="items"
    :loading="isLoading"
    :page-info="pageInfo"
    :item="ItemCard"
    :skeleton="ItemSkeleton"
    :item-props="{ extraProp: true }"
    class-name="flex flex-col gap-4"
    @page-change="handlePageChange" />
</template>
```
