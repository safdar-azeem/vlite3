# Input

**Import:** `import { Input } from 'vlite3'`

### Props

| Prop              | Type                                                   | Default   | Description                              |
| :---------------- | :----------------------------------------------------- | :-------- | :--------------------------------------- |
| `modelValue`      | `string \| number`                                     | `''`      | Binding (`v-model`)                      |
| `type`            | `InputType`                                            | `text`    | Native input type (text, password, etc.) |
| `label`           | `string`                                               | —         | Label text                               |
| `placeholder`     | `string`                                               | —         | Input placeholder                        |
| `disabled`        | `boolean`                                              | `false`   | Disable input                            |
| `error`           | `string`                                               | —         | Error message / state                    |
| `variant`         | `'solid' \| 'outline' \| 'outline-b' \| 'transparent'` | `outline` | Visual style                             |
| `size`            | `'sm' \| 'md' \| 'lg'`                                 | `md`      | Dimensions                               |
| `rounded`         | `InputRounded`                                         | `md`      | Border radius                            |
| `icon`            | `string`                                               | —         | Leading icon (Iconify ID)                |
| `iconRight`       | `string`                                               | —         | Trailing icon (Iconify ID)               |
| `loading`         | `boolean`                                              | `false`   | Show spinner                             |
| `showClearButton` | `boolean`                                              | `true`    | Show clear 'x' when value exists         |
| `addonLeft`       | `string`                                               | —         | Text addon on the left                   |
| `addonRight`      | `string`                                               | —         | Text addon on the right                  |
| `labelPosition`   | `'top' \| 'left' \| 'right'`                           | `top`     | Label placement                          |

### Events

- `@update:modelValue`: Emitted on input
- `@change`: Emitted on blur/change
- `@focus`
- `@blur`
- `@click:icon`: Click on left icon
- `@click:icon-right`: Click on right icon

### Usage

```vue
<Input v-model="username" label="Username" placeholder="Enter username" icon="lucide:user" />

<Input v-model="password" label="Password" type="password" variant="filled" />

<Input v-model="price" label="Price" addon-left="$" addon-right=".00" type="number" />
```
