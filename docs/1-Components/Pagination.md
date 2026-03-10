# Pagination

**Import:** `import { Pagination } from 'vlite3'`

### Props

| Prop                  | Type                                        | Default       | Description                                        |
| :-------------------- | :------------------------------------------ | :------------ | :------------------------------------------------- |
| `currentPage`         | `number`                                    | `1`           | Binding (`v-model:currentPage`)                    |
| `totalPages`          | `number`                                    | required      | Total pages                                        |
| `totalItems`          | `number`                                    | `1`           | Number of sibling pages to show                    |
| `disabled`            | `boolean`                                   | `false`       | Disable navigation                                 |
| `showEdges`           | `boolean`                                   | `false`       | Show first/last buttons                            |
| `showPageInfo`        | `boolean`                                   | `false`       | Show "Page X of Y"                                 |
| `showItemsPerPage`    | `boolean`                                   | `false`       | Show limit selector                                |
| `itemsPerPage`        | `number`                                    | `10`          | Binding (`v-model:itemsPerPage`)                   |
| `itemsPerPageOptions` | `number[]`                                  | `[10, 25...]` | Limit options                                      |
| `navType`             | `'text' \| 'icon'`                          | `text`        | Navigation style                                   |
| `alignment`           | `'start' \| 'center' \| 'end' \| 'between'` | —             | Flex alignment                                     |
| `activeVariant`       | `PaginationVariant`                         | `'outline'`   | Visual style for the active/current page button    |
| `rounded`             | `PaginationRounded`                         | `'md'`        | Border-radius preset applied to all page buttons   |

### Types
```ts
type PaginationVariant = 'outline' | 'solid' | 'ghost'
type PaginationRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'
```

### Active Variant

| Value     | Description                                                              |
| :-------- | :----------------------------------------------------------------------- |
| `outline` | Bordered button with ring highlight (legacy default)                     |
| `solid`   | Filled primary-color background with white text — most visually distinct |
| `ghost`   | Subtle accent background with semi-bold text                             |

### Rounded Preset

| Value  | Tailwind class   |
| :----- | :--------------- |
| `none` | `rounded-none`   |
| `sm`   | `rounded-sm`     |
| `md`   | `rounded-md`     |
| `lg`   | `rounded-lg`     |
| `full` | `rounded-full`   |

### Events

- `@update:currentPage`: Emitted to update page (v-model)
- `@change`: Emitted on page change
- `@update:itemsPerPage`: Emitted to update limit (v-model)
- `@change:itemsPerPage`: Emitted when items per page changes

### Usage
```vue
<!-- Solid active indicator, pill-shaped buttons -->
<Pagination
  v-model:currentPage="page"
  :total-pages="20"
  active-variant="solid"
  rounded="full" />

<!-- Full-featured with items-per-page selector -->
<Pagination
  v-model:currentPage="page"
  v-model:itemsPerPage="limit"
  :total-pages="10"
  show-page-info
  show-items-per-page
  active-variant="solid"
  alignment="between" />
```

