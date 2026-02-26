# Tooltip

**Import:** `import { Tooltip } from 'vlite3'`

### Props

| Prop        | Type                                     | Default | Description     |
| :---------- | :--------------------------------------- | :------ | :-------------- |
| `content`   | `string`                                 | —       | Tooltip text    |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `top`   | Position        |
| `disabled`  | `boolean`                                | `false` | Disable tooltip |

### Slots

- `default`: Trigger element
- `content`: Custom HTML content (overrides `content` prop)

### Usage

```vue
<Tooltip content="Edit item">
  <Button icon="lucide:edit" />
</Tooltip>
```
