# ChoiceBox

**Import:** `import { ChoiceBox, type ChoiceBoxOption } from 'vlite3'`

### Props

| Prop          | Type                                               | Default | Description               |
| :------------ | :------------------------------------------------- | :------ | :------------------------ |
| `modelValue`  | `string \| number \| (string \| number)[] \| null` | —       | Selection binding         |
| `options`     | `ChoiceBoxOption[]`                                | —       | Data source               |
| `multiple`    | `boolean`                                          | `false` | Allow multiple selections |
| `title`       | `string`                                           | —       | Group title               |
| `description` | `string`                                           | —       | Group description         |
| `grid`        | `number`                                           | `1`     | Grid columns (1-4)        |
| `gap`         | `number`                                           | `4`     | Gap size (2, 3, 4, 6, 8)  |
| `disabled`    | `boolean`                                          | `false` | Disable all options       |

### Types

```ts
interface ChoiceBoxOption {
  id: string | number
  title: string
  description?: string
  icon?: string // Iconify ID
  disabled?: boolean
  badge?: string
}
```

### Usage

```vue
<ChoiceBox v-model="selectedPlan" :options="plans" title="Choose Plan" :grid="3" />
```
