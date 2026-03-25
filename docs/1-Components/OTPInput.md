# OTPInput

**Import:** `import { OTPInput } from 'vlite3'`

### Props

| Prop          | Type                              | Default   | Description                                        |
| :------------ | :-------------------------------- | :-------- | :------------------------------------------------- |
| `modelValue`  | `string`                          | `''`      | Binding (`v-model`) - Joined string                |
| `length`      | `number`                          | `6`       | Number of inputs                                   |
| `type`        | `'text' \| 'number'`              | `number`  | Input mask                                         |
| `placeholder` | `string`                          | `''`      | Input placeholder                                  |
| `variant`     | `'solid' \| 'outline' \| 'ghost'` | `outline` | Visual style                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`            | `md`      | Dimensions                                         |
| `attached`    | `boolean`                         | `false`   | Group inputs visually                              |
| `error`       | `boolean`                         | `false`   | Error state                                        |
| `disabled`    | `boolean`                         | `false`   | Disable all inputs                                 |
| `autofocus`   | `boolean`                         | `false`   | Focus first input on mount                         |
| `mask`        | `boolean`                         | `false`   | Hide input values like a password field            |
| `fluid`       | `boolean`                         | `false`   | Stretch inputs to fill parent container width equally |

### Events

- `@update:modelValue`: Emitted on change
- `@change`: Emitted when the joined string changes
- `@complete`: Emitted when all fields are filled

### Usage
```vue
<!-- Basic -->
<OTPInput v-model="otp" :length="4" variant="solid" @complete="verifyOtp" />

<!-- Masked (hidden digits like password) -->
<OTPInput v-model="otp" mask @complete="verifyOtp" />

<!-- Fluid (stretches to parent width) -->
<div class="w-full max-w-sm">
  <OTPInput v-model="otp" fluid />
</div>

<!-- Masked + Fluid -->
<div class="w-full max-w-sm">
  <OTPInput v-model="otp" mask fluid @complete="verifyOtp" />
</div>
```
