# Chip

**Import:** `import { Chip } from 'vlite3'`

### Props

| Prop        | Type                             | Default  | Description                      |
| ----------- | -------------------------------- | -------- | -------------------------------- |
| `variant`   | `ChipVariant`                    | `subtle` | Visual style                     |
| `size`      | `'small' \| 'medium' \| 'large'` | `medium` | Dimensions                       |
| `text`      | `string`                         | —        | Label text                       |
| `textI18n`  | `string`                         | —        | I18n translation key for text    |
| `icon`      | `string`                         | —        | Leading icon                     |
| `clickable` | `boolean`                        | `false`  | Enable interaction styles/events |
| `deletable` | `boolean`                        | `false`  | Show delete button               |
| `disabled`  | `boolean`                        | `false`  | Disable interactions             |
| `class`     | `string`                         | —        | Custom CSS classes               |

### Events

- `@click` (requires `clickable`)
- `@delete` (requires `deletable`)

### Types

```ts
type ChipVariant =
  | 'solid'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
```

### Usage

```vue
<Chip text="Vue" variant="primary" clickable @click="select" />
<Chip text="Filter" deletable @delete="remove" />
```
