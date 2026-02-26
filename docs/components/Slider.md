# Slider

**Import:** `import { Slider } from 'vlite3'`

### Props

| Prop           | Type                           | Default | Description          |
| :------------- | :----------------------------- | :------ | :------------------- |
| `modelValue`   | `number`                       | `0`     | Value binding        |
| `min`          | `number`                       | `0`     | Minimum value        |
| `max`          | `number`                       | `100`   | Maximum value        |
| `step`         | `number`                       | `1`     | Step interval        |
| `label`        | `string`                       | —       | Label text           |
| `icon`         | `string`                       | —       | Icon next to label   |
| `showValue`    | `boolean`                      | `true`  | Show numerical value |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg'` | `md`    | Dimensions           |
| `centerOrigin` | `boolean`                      | —       | Force bipolar mode   |
| `disabled`     | `boolean`                      | `false` | Disable interaction  |

### Usage

```vue
<Slider label="Volume" v-model="volume" :max="100" />
<Slider label="Balance" v-model="balance" :min="-50" :max="50" icon="lucide:scale" />
```
