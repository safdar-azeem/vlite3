# CheckBox

**Import:** `import { CheckBox } from 'vlite3'`

### Props

| Prop            | Type              | Default | Description                            |
| --------------- | ----------------- | ------- | -------------------------------------- |
| `checked`       | `boolean`         | `false` | Binding (`v-model:checked`)            |
| `label`         | `string`          | —       | Side label text                        |
| `indeterminate` | `boolean`         | `false` | Mixed state visually                   |
| `disabled`      | `boolean`         | `false` | Disable input                          |
| `size`          | `CheckboxSize`    | `md`    | Dimensions                             |
| `rounded`       | `CheckboxRounded` | —       | Corner radius (defaults to size style) |

### Types

```ts
type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CheckboxRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

### Usage

```vue
<CheckBox v-model:checked="isAgreed" label="I accept terms" />
```
