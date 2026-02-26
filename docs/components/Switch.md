# Switch

**Import:** `import { Switch } from 'vlite3'`

### Props

| Prop         | Type      | Default | Description         |
| ------------ | --------- | ------- | ------------------- |
| `modelValue` | `boolean` | `false` | Binding (`v-model`) |
| `label`      | `string`  | —       | Side label text     |
| `disabled`   | `boolean` | `false` | Disable toggle      |

### Usage

```vue
<Switch v-model="isEnabled" label="Airplane Mode" />
```
