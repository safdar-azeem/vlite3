# Advanced Components

This section covers complex data visualization and business-logic components.

---

# Heatmap

**Import:** `import { Heatmap } from 'vlite3'`

### Description
An interactive heatmap suitable for visualizing activity, time-series data, or density across a grid. Supports both calendar-style (sequential) and coordinate-based (grid) layouts.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `HeatmapDataPoint[]` | required | Array of data points |
| `layout` | `'grid' \| 'sequential'` | `'grid'` | Layout mode |
| `interactive` | `boolean` | `true` | Enable hover and click effects |
| `showLegend` | `boolean` | `true` | Show gradient legend at bottom |
| `showLabels` | `boolean` | `false` | Show values inside cells |
| `responsive` | `boolean` | `true` | Auto-calculate cell size to fit container |
| `minValue` | `number` | calculated | Min value for color normalization |
| `maxValue` | `number` | calculated | Max value for color normalization |
| `color-config` | `HeatmapColorConfig` | `{ scheme: 'github' }` | Color scheme configuration |
| `grid-config` | `object` | `{ rows: 7, gap: 3 }` | Config for grid layout |
| `tooltip-config` | `object` | `{ enabled: true }` | Tooltip settings |

### Data Format (`HeatmapDataPoint`)

```typescript
interface HeatmapDataPoint {
  x: number         // Column index (or linear index for sequential)
  y: number         // Row index
  value: number     // Value for intensity
  date?: string     // Optional ISO date string
  tooltip?: string  // Custom tooltip text
  [key: string]: any // Any other data to pass through
}
```

### Events

- `@cell-click` (cell: `HeatmapCell`, event: `MouseEvent`): Emitted when a cell is clicked.
- `@cell-hover` (cell: `HeatmapCell | null`, event: `MouseEvent`): Emitted on mouse enter/leave.

### Usage

#### Basic Activity Grid
```vue
<script setup>
const data = [
  { x: 0, y: 0, value: 5 },
  { x: 0, y: 1, value: 10 },
  // ...
]
</script>

<template>
  <Heatmap 
    :data="data" 
    :color-config="{ scheme: 'green' }"
    @cell-click="(cell) => console.log(cell)"
  />
</template>
```

#### Sequential Timeline (Github Style)
```vue
<Heatmap
  :data="data"
  layout="sequential"
  :sequential-config="{ itemsPerRow: 7, gap: 2 }"
  :tooltip-config="{ 
    formatter: (cell) => `${cell.value} commits on ${cell.date}` 
  }"
/>
```

---

# PricingPlan

**Import:** `import { PricingPlan } from 'vlite3'`

### Description
A responsive pricing table component supporting highlighting, features lists, and different visual variants.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `PricingPlanItemSchema[]` | `[]` | Array of plan definitions |
| `modelValue` | `string \| number` | `null` | Selected plan ID (v-model) |
| `variant` | `'outline' \| 'solid'` | `'outline'` | Visual style variant |
| `columns` | `number` | `3` | Number of columns (responsive by default) |
| `gap` | `number` | `6` | Gap between cards (tailwind scale) |

### Item Schema (`PricingPlanItemSchema`)

```typescript
interface PricingPlanItemSchema {
  id: string | number
  title: string
  price: string
  period?: string
  description?: string
  features: Array<string | { text: string; included: boolean }>
  buttonText?: string
  popular?: boolean      // Adds "Popular" badge
  recommended?: boolean  // Adds styling emphasis
  variant?: 'outline' | 'solid' // Override per item
}
```

### Events
- `@update:modelValue`: Emitted when a plan is selected (via button click).
- `@change`: Emitted when selection changes.

### Usage

```vue
<script setup>
import { ref } from 'vue'

const selected = ref('pro')
const plans = [
  {
    id: 'basic',
    title: 'Basic',
    price: '/bin/zsh',
    features: ['1 Project', 'Basic Support']
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '',
    popular: true,
    features: ['Unlimited Projects', 'Priority Support']
  }
]
</script>

<template>
  <PricingPlan 
    v-model="selected" 
    :items="plans" 
    variant="outline" 
  />
</template>
```
