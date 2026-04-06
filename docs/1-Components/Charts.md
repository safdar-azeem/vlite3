# Charts

Beautiful, highly customizable, zero-dependency SVG chart components for Vlite3. All charts are driven by CSS variables for seamless dark/light mode support, include entry animations, interactive tooltips, and resize responsively via `ResizeObserver`.

## Chart Types

- **LineChart** — Area/line chart with single or multi-series data
- **BarChart** — Vertical or horizontal bar chart with single or multi-series
- **PieChart** — Pie or donut chart with animated arc draw
- **CircleChart** — Single-value progress ring (gauge)

---

## LineChart

```vue
<LineChart :data="data" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | — | Single-series data `{ label, value }[]` |
| `datasets` | `ChartDataset[]` | — | Multi-series (overrides `data`) |
| `labels` | `string[]` | — | X-axis labels when using `datasets` |
| `height` | `number` | `300` | Chart height in px |
| `smooth` | `boolean` | `true` | Smooth bezier vs straight lines |
| `fill` | `boolean` | `true` | Fill area under line with gradient |
| `showDots` | `boolean` | `true` | Show data point dots |
| `showGrid` | `boolean` | `true` | Background gridlines |
| `showLegend` | `boolean` | `true` | Legend (multi-series only) |
| `showTooltip` | `boolean` | `true` | Hover crosshair + tooltip |
| `colors` | `string[]` | theme palette | Custom color palette |
| `animate` | `boolean` | `true` | Animated stroke draw-on entry |
| `xLabel` | `string` | — | X-axis label |
| `yLabel` | `string` | — | Y-axis label |
| `formatValue` | `(v: number) => string` | — | Custom value formatter |
| `yMin` | `number` | — | Y-axis minimum override |
| `yMax` | `number` | — | Y-axis maximum override |

### Examples

```vue
<!-- Single series, smooth fill -->
<LineChart
  :data="[
    { label: 'Jan', value: 4200 },
    { label: 'Feb', value: 5800 },
    { label: 'Mar', value: 7100 },
  ]"
  :height="280"
  y-label="Revenue ($)"
  :format-value="(v) => '$' + v.toLocaleString()" />

<!-- Multi-series -->
<LineChart
  :datasets="[
    { label: 'Revenue', data: [4200, 5800, 7100] },
    { label: 'Expenses', data: [3100, 3400, 4200] },
  ]"
  :labels="['Jan', 'Feb', 'Mar']"
  :fill="false" />
```

---

## BarChart

```vue
<BarChart :data="data" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | — | Single-series data |
| `datasets` | `ChartDataset[]` | — | Multi-series grouped |
| `labels` | `string[]` | — | X labels for multi-series |
| `height` | `number` | `300` | Chart height |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Bar direction |
| `barRadius` | `number` | `6` | Top-corner radius |
| `showGrid` | `boolean` | `true` | Gridlines |
| `showLegend` | `boolean` | `true` | Legend (multi-series) |
| `showTooltip` | `boolean` | `true` | Hover tooltip |
| `showValues` | `boolean` | `false` | Value labels on each bar |
| `colors` | `string[]` | theme palette | Color palette |
| `animate` | `boolean` | `true` | Grow-in animation |
| `formatValue` | `(v: number) => string` | — | Value formatter |

### Examples

```vue
<!-- Vertical with per-bar colors -->
<BarChart
  :data="[
    { label: 'Jan', value: 4200, color: '#6366f1' },
    { label: 'Feb', value: 5800, color: '#22c55e' },
  ]"
  show-values />

<!-- Horizontal orientation -->
<BarChart
  :data="[
    { label: 'React', value: 78 },
    { label: 'Vue', value: 65 },
  ]"
  orientation="horizontal"
  :format-value="(v) => v + '%'" />
```

---

## PieChart

```vue
<PieChart :data="data" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | required | `{ label, value, color? }[]` |
| `donut` | `boolean` | `false` | Donut (ring) style |
| `innerRadius` | `number` | `60` | Inner cutout as % of radius (donut) |
| `size` | `number` | `280` | Chart diameter px |
| `startAngle` | `number` | `-90` | Start angle in degrees |
| `showLegend` | `boolean` | `true` | Show legend |
| `legendPosition` | `'right' \| 'bottom'` | `'right'` | Legend placement |
| `labelMode` | `'percent' \| 'value' \| 'label' \| 'none'` | `'percent'` | Slice label content |
| `colors` | `string[]` | theme palette | Color overrides |
| `animate` | `boolean` | `true` | Rotate-in animation |
| `showTooltip` | `boolean` | `true` | Hover tooltip |
| `centerLabel` | `string` | — | Center label text (donut mode) |
| `centerValue` | `string` | — | Center value text (donut mode) |

### Slots

| Slot | Props | Description |
|---|---|---|
| `#center` | `{ total, data }` | Custom donut center content (SVG) |

### Examples

```vue
<!-- Standard pie chart -->
<PieChart
  :data="[
    { label: 'Desktop', value: 42 },
    { label: 'Mobile', value: 38 },
    { label: 'Tablet', value: 20 },
  ]"
  label-mode="percent" />

<!-- Donut with center label -->
<PieChart
  :data="revenueData"
  :donut="true"
  :inner-radius="60"
  center-value="$94k"
  center-label="Total Revenue"
  legend-position="bottom" />
```

---

## CircleChart

```vue
<CircleChart :value="75" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | required | Current value |
| `max` | `number` | `100` | Maximum value |
| `size` | `number` | `160` | Diameter in px |
| `strokeWidth` | `number` | `12` | Ring stroke width |
| `color` | `string` | `'primary'` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| hex` |
| `gradient` | `boolean` | `true` | Gradient arc stroke |
| `label` | `string` | — | Label text below ring |
| `sublabel` | `string` | — | Smaller sub-label |
| `showValue` | `boolean` | `true` | Percentage in center |
| `formatValue` | `(v, pct) => string` | — | Custom value display |
| `animate` | `boolean` | `true` | Animated fill |
| `trackColor` | `string` | — | Background ring color |
| `lineCap` | `'round' \| 'square' \| 'butt'` | `'round'` | Stroke cap style |

### Slots

| Slot | Props | Description |
|---|---|---|
| `#center` | `{ value, percentage, displayValue }` | Custom center content |

### Examples

```vue
<!-- Basic progress with semantic color -->
<CircleChart :value="84" color="success" label="Uptime" sublabel="This month" />

<!-- Custom value format -->
<CircleChart
  :value="2480"
  :max="5000"
  color="info"
  label="Tasks Done"
  :format-value="(v) => v.toLocaleString()" />

<!-- Custom center slot -->
<CircleChart :value="68" color="#f97316" :show-value="false">
  <template #center="{ percentage }">
    <div class="text-center">
      <div class="text-2xl font-black">{{ Math.round(percentage) }}%</div>
      <div class="text-xs text-muted-foreground">Goals Met</div>
    </div>
  </template>
</CircleChart>
```

---

## ChartDataPoint Type

```ts
interface ChartDataPoint {
  label: string
  value: number
  color?: string   // optional per-point color override
}
```

## ChartDataset Type

```ts
interface ChartDataset {
  label: string
  data: number[]
  color?: string
}
```

## Color Palette

Charts automatically use CSS variable-based colors:

| Variable | Light | Dark |
|---|---|---|
| `--color-chart-1` | `#6366f1` (indigo) | `#818cf8` |
| `--color-chart-2` | `#22c55e` (emerald) | `#34d399` |
| `--color-chart-3` | `#f59e0b` (amber) | `#fbbf24` |
| `--color-chart-4` | `#ef4444` (red) | `#fb7185` |
| `--color-chart-5` | `#3b82f6` (blue) | `#60a5fa` |
| `--color-chart-6` | `#ec4899` (pink) | `#f472b6` |

You can override them globally in your CSS or pass a custom `colors` array prop to any chart.
