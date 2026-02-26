# Textarea

**Import:** `import { Textarea } from 'vlite3'`

### Props

| Prop          | Type      | Default | Description          |
| :------------ | :-------- | :------ | :------------------- |
| `modelValue`  | `string`  | `''`    | Binding (`v-model`)  |
| `rows`        | `number`  | `3`     | Default visible rows |
| `placeholder` | `string`  | —       | Placeholder text     |
| `disabled`    | `boolean` | `false` | Disable input        |

### Events

- `@update:modelValue`
- `@focus`
- `@blur`

### Usage

```vue
<Textarea v-model="message" placeholder="Leave a comment..." :rows="5" />
```
