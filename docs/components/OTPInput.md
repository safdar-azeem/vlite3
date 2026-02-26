# OTPInput

**Import:** `import { OTPInput } from 'vlite3'`

### Props

| Prop         | Type                              | Default   | Description                         |
| :----------- | :-------------------------------- | :-------- | :---------------------------------- |
| `modelValue` | `string`                          | `''`      | Binding (`v-model`) - Joined string |
| `length`     | `number`                          | `6`       | Number of inputs                    |
| `type`       | `'text' \| 'number'`              | `number`  | Input mask                          |
| `variant`    | `'solid' \| 'outline' \| 'ghost'` | `outline` | Visual style                        |
| `size`       | `'sm' \| 'md' \| 'lg'`            | `md`      | Dimensions                          |
| `attached`   | `boolean`                         | `false`   | Group inputs visually               |
| `error`      | `boolean`                         | `false`   | Error state                         |
| `disabled`   | `boolean`                         | `false`   | Disable all inputs                  |
| `autofocus`  | `boolean`                         | `false`   | Focus first input on mount          |

### Events

- `@update:modelValue`: Emitted on change
- `@complete`: Emitted when all fields are filled

### Usage

```vue
<OTPInput v-model="otp" :length="4" variant="solid" @complete="verifyOtp" />
```
