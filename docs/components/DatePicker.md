# DatePicker

**Import:** `import { DatePicker } from 'vlite3'`

### Props

| Prop             | Type                   | Default           | Description               |
| :--------------- | :--------------------- | :---------------- | :------------------------ |
| `modelValue`     | `any`                  | —                 | Binding (`v-model`)       |
| `mode`           | `'date' \| 'dateTime'` | `date`            | Selection mode            |
| `minDate`        | `string`               | —                 | Minimum allowed date      |
| `placeholder`    | `string`               | —                 | Input placeholder         |
| `icon`           | `string`               | `lucide:calendar` | Trigger icon              |
| `size`           | `ButtonSize`           | `md`              | Trigger button size       |
| `variant`        | `ButtonVariant`        | `outline`         | Trigger button style      |
| `teleport`       | `boolean`              | `true`            | Teleport dropdown to body |
| `minuteInterval` | `number`               | `5`               | Minute step for time      |

### Usage

```vue
<DatePicker v-model="date" mode="dateTime" :min-date="new Date().toISOString()" variant="ghost" />
```
