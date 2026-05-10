# Tabes

**Import:** `import { Tabes } from 'vlite3'`

### Props

| Prop         | Type               | Default   | Description                                              |
| :----------- | :----------------- | :-------- | :------------------------------------------------------- |
| `modelValue` | `string \| number` | —         | Binding (`v-model`)                                      |
| `options`    | `TabesOption[]`    | required  | Array of tabs                                            |
| `size`       | `TabesSize`        | `md`      | Dimensions                                               |
| `variant`    | `TabesVariant`     | `surface` | Visual style                                             |
| `block`      | `boolean`          | `false`   | Full width                                               |
| `textClass`  | `string`           | —         | Custom class for text                                    |
| `wrap`       | `boolean`          | `false`   | Wrap tabs to multiple rows on small screens instead of scrolling |

### Types
```ts
export interface TabesOption {
  label: string
  labelI18n?: string
  value: string | number
  icon?: string
  disabled?: boolean
}

export type TabesSize = 'sm' | 'md' | 'lg'

export type TabesVariant =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'outline'
  | 'line'
```

### Events

- `@update:modelValue`: Emitted on tab selection (v-model binding)
- `@change`: Emitted when tab selection changes

### Usage
```vue
<Tabes
  v-model="currentTab"
  :options="[
    { label: 'Home', value: 'home' },
    { label: 'Profile', value: 'profile' },
  ]"
  variant="line"
  block />
```

#### Responsive wrap on small screens
```vue
<Tabes
  v-model="currentTab"
  :options="tabs"
  wrap />
```

> **Note:** By default, when `Tabes` exceed their container's width, they will enable smooth horizontal scrolling and display navigation buttons. Use `wrap` to wrap them to multiple rows instead. When `wrap` is enabled, the animated sliding marker is hidden.

