# NumberInput

**Import:** `import { NumberInput } from 'vlite3'`

### Props

| Prop          | Type                 | Default     | Description             |
| :------------ | :------------------- | :---------- | :---------------------- |
| `modelValue`  | `number`             | `undefined` | Binding (`v-model`)     |
| `min`         | `number`             | —           | Minimum value           |
| `max`         | `number`             | —           | Maximum value           |
| `step`        | `number`             | `1`         | Increment step          |
| `layout`      | `NumberInputLayout`  | `split`     | Visual structure        |
| `variant`     | `NumberInputVariant` | `outline`   | Background/border style |
| `size`        | `NumberInputSize`    | `md`        | Dimensions              |
| `rounded`     | `NumberInputRounded` | `md`        | Border radius           |
| `placeholder` | `string`             | —           | Input placeholder       |
| `name`        | `string`             | —           | Input name attribute    |
| `id`          | `string`             | —           | Input ID attribute      |
| `disabled`    | `boolean`            | `false`     | Disable interaction     |
| `readonly`    | `boolean`            | `false`     | Read-only state         |

### Types

```ts
type NumberInputLayout = 'split' | 'stacked'
type NumberInputVariant = 'solid' | 'outline' | 'transparent'
type NumberInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type NumberInputRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

### Usage

```vue
<NumberInput v-model="quantity" :min="1" :max="10" />
<NumberInput v-model="price" layout="stacked" variant="transparent" />
```
