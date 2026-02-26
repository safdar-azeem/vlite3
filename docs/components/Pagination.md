# Pagination

**Import:** `import { Pagination } from 'vlite3'`

### Props

| Prop                  | Type                                        | Default       | Description                      |
| :-------------------- | :------------------------------------------ | :------------ | :------------------------------- |
| `currentPage`         | `number`                                    | `1`           | Binding (`v-model:currentPage`)  |
| `totalPages`          | `number`                                    | required      | Total pages                      |
| `siblingCount`        | `number`                                    | `1`           | Number of siblings               |
| `disabled`            | `boolean`                                   | `false`       | Disable navigation               |
| `showEdges`           | `boolean`                                   | `false`       | Show first/last buttons          |
| `showPageInfo`        | `boolean`                                   | `false`       | Show "Page X of Y"               |
| `showItemsPerPage`    | `boolean`                                   | `false`       | Show limit selector              |
| `itemsPerPage`        | `number`                                    | `10`          | Binding (`v-model:itemsPerPage`) |
| `itemsPerPageOptions` | `number[]`                                  | `[10, 25...]` | Limit options                    |
| `navType`             | `'text' \| 'icon'`                          | `text`        | Navigation style                 |
| `alignment`           | `'start' \| 'center' \| 'end' \| 'between'` | —             | Flex alignment                   |

### Usage

```vue
<Pagination
  v-model:currentPage="page"
  v-model:itemsPerPage="limit"
  :total-pages="10"
  show-page-info
  show-items-per-page
  alignment="between" />
```
