# Charts

Beautiful, highly customizable, zero-dependency SVG chart components for Vlite3. All charts are driven by CSS variables for seamless dark/light mode support, include entry animations, interactive tooltips, and resize responsively via `ResizeObserver`.

---

## Overview

| Component | Description |
|---|---|
| `LineChart` | Area/line chart — single or multi-series with smooth bezier or straight lines |
| `BarChart` | Vertical or horizontal bar chart — single or multi-series grouped bars |
| `PieChart` | Pie or donut chart with animated arc draw and optional center content |
| `CircleChart` | Single-value progress ring (gauge) with gradient stroke |
| `TimelineChart` | Gantt-style horizontal timeline with task bars per person across periods |
| `SegmentBarChart` | Single stacked horizontal bar showing proportional segments |
| `StatCardChart` | Grid of metric cards with percentages, proportional indicators, and trends |
| `WaffleChart` | Grid of rounded cells colored to represent proportional data |

All components:

- **Zero dependencies** — pure SVG, no chart library required
- **Dark mode ready** — colors resolve from CSS custom properties
- **Animated** — smooth entry animations via `requestAnimationFrame` with ease-out cubic
- **Responsive** — adapts to container width via `ResizeObserver`
- **Accessible** — SVGs have `role="img"` and `aria-label`
- **Focused Interactions** — hover effects highlight targets without dimming surrounding elements
- **Fully typed** — TypeScript interfaces exported from each component

---

## Installation & Import

```vue
<script setup lang="ts">
import LineChart       from '@/components/Chart/LineChart.vue'
import BarChart        from '@/components/Chart/BarChart.vue'
import PieChart        from '@/components/Chart/PieChart.vue'
import CircleChart     from '@/components/Chart/CircleChart.vue'
import TimelineChart   from '@/components/Chart/TimelineChart.vue'
import SegmentBarChart from '@/components/Chart/SegmentBarChart.vue'
import StatCardChart   from '@/components/Chart/StatCardChart.vue'
import WaffleChart     from '@/components/Chart/WaffleChart.vue'
</script>
```

You can also import types:

```ts
import type { ChartDataPoint, ChartDataset } from '@/components/Chart/types'
```

---

## Shared Types

### `ChartDataPoint`

The basic data unit used for single-series charts.

```ts
interface ChartDataPoint {
  label: string   // X-axis label or legend text
  value: number   // Numeric value
  color?: string  // Optional per-point color override (CSS color string)
  [key: string]: any  // Additional metadata (unused by components)
}
```

### `ChartDataset`

Used for multi-series charts (line + bar).

```ts
interface ChartDataset {
  label: string   // Series name (shown in legend and tooltip)
  data: number[]  // Array of values — must align with the `labels` prop
  color?: string  // Optional series color override
}
```

### `ChartColor` (semantic tokens)

Several components accept a `color` prop that takes either a semantic token or any valid CSS color:

```ts
type ChartColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'teal'
  | 'orange'
  | 'pink'
  | 'cyan'
  | string  // any CSS color, e.g. '#f97316' or 'hsl(220 90% 60%)'
```

### `StrokeLineCap`

```ts
type StrokeLineCap = 'round' | 'square' | 'butt'
```

---

## Color Palette

Charts automatically use CSS variable-based colors that adapt to light and dark mode:

| Variable | Light Mode | Dark Mode |
|---|---|---|
| `--color-chart-1` | `#6366f1` (indigo) | `#818cf8` |
| `--color-chart-2` | `#22c55e` (emerald) | `#34d399` |
| `--color-chart-3` | `#f59e0b` (amber) | `#fbbf24` |
| `--color-chart-4` | `#ef4444` (red) | `#fb7185` |
| `--color-chart-5` | `#3b82f6` (blue) | `#60a5fa` |
| `--color-chart-6` | `#ec4899` (pink) | `#f472b6` |

Override them globally in your CSS:

```css
:root {
  --color-chart-1: hsl(260 80% 60%);
  --color-chart-2: hsl(160 70% 45%);
}
```

Or pass a custom palette to any chart via the `colors` prop:

```vue
<LineChart :colors="['#f97316', '#8b5cf6', '#06b6d4']" :data="data" />
```

---

## LineChart

A responsive area/line chart supporting single and multi-series data, smooth bezier curves, gradient fill, animated draw-on entry, hover tooltip with crosshair, and full axis customization.

### Basic Usage

```vue
<LineChart :data="data" />
```

### Props

#### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | — | Single-series data array |
| `datasets` | `ChartDataset[]` | — | Multi-series datasets — **overrides `data`** when provided |
| `labels` | `string[]` | — | X-axis labels when using `datasets` |

> **Note:** Use either `data` (single series) or `datasets` + `labels` (multi-series). Never both.

#### Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `number` | `300` | Chart height in pixels. Width is always 100% of the container. |
| `yMin` | `number` | — | Override the Y-axis minimum value |
| `yMax` | `number` | — | Override the Y-axis maximum value |
| `xLabel` | `string` | — | Text label displayed below the X axis |
| `yLabel` | `string` | — | Text label displayed to the left of the Y axis (rotated 90°) |

#### Line Style

| Prop | Type | Default | Description |
|---|---|---|---|
| `smooth` | `boolean` | `true` | Use smooth bezier curves. Set to `false` for straight angular lines. |
| `fill` | `boolean` | `true` | Fill the area under the line with a gradient. |
| `showDots` | `boolean` | `true` | Render circular dots at each data point. Dots scale up on hover. |
| `lineWidth` | `number` | `2.5` | Stroke width of the chart line in pixels. |
| `colors` | `string[]` | CSS palette | Override the color palette. First color used for single-series. |

#### Axis & Grid Visibility

| Prop | Type | Default | Description |
|---|---|---|---|
| `showGrid` | `boolean` | `true` | Horizontal gridlines across the chart area. |
| `showXAxis` | `boolean` | `true` | Bottom border line (X axis). |
| `showYAxis` | `boolean` | `true` | Left border line (Y axis). |
| `showXLabels` | `boolean` | `true` | X-axis tick labels below the chart. Hiding them also collapses their reserved space. |
| `showYLabels` | `boolean` | `true` | Y-axis tick labels to the left. Hiding them also collapses their reserved space. |
| `gridOpacity` | `number` | `0.07` | Opacity of the horizontal gridlines (0–1). |
| `axisOpacity` | `number` | `0.1` | Opacity of the axis border lines (0–1). |

#### Interaction & Behaviour

| Prop | Type | Default | Description |
|---|---|---|---|
| `showTooltip` | `boolean` | `true` | Crosshair and floating tooltip on hover. |
| `showLegend` | `boolean` | `true` | Legend row above the chart (only shown when `datasets` is used). |
| `animate` | `boolean` | `true` | Animate the line drawing from left to right on mount. Also re-runs when data changes. |
| `formatValue` | `(v: number) => string` | built-in | Custom formatter for Y-axis ticks and tooltip values. |

### Examples

```vue
<!-- Minimal single series -->
<LineChart :data="[
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
  { label: 'Mar', value: 7100 },
]" />

<!-- Full configuration — single series -->
<LineChart
  :data="revenueData"
  :height="320"
  :smooth="true"
  :fill="true"
  :show-dots="true"
  :line-width="3"
  y-label="Revenue ($)"
  :format-value="(v) => '$' + v.toLocaleString()"
  :y-min="0"
  :animate="true"
  :show-tooltip="true" />

<!-- Multi-series with custom colors -->
<LineChart
  :datasets="[
    { label: 'Revenue',  data: [4200, 5800, 7100, 9400], color: '#6366f1' },
    { label: 'Expenses', data: [3100, 3400, 4200, 5100], color: '#ef4444' },
    { label: 'Profit',   data: [1100, 2400, 2900, 4300], color: '#22c55e' },
  ]"
  :labels="['Jan', 'Feb', 'Mar', 'Jun']"
  :fill="false"
  :show-dots="true"
  :format-value="(v) => '$' + v.toLocaleString()" />

<!-- Minimal sparkline — no axes, no labels, no fill -->
<LineChart
  :data="sparkData"
  :height="80"
  :smooth="true"
  :fill="false"
  :show-dots="false"
  :show-grid="false"
  :show-x-axis="false"
  :show-y-axis="false"
  :show-x-labels="false"
  :show-y-labels="false"
  :show-tooltip="false"
  :show-legend="false"
  :animate="false" />

<!-- Stripped axes for an embedded/widget look -->
<LineChart
  :data="data"
  :show-y-labels="false"
  :show-x-axis="false"
  :show-y-axis="false"
  :grid-opacity="0.04"
  :line-width="2" />

<!-- Dialing in subtle chrome -->
<LineChart
  :data="data"
  :grid-opacity="0.15"
  :axis-opacity="0.25"
  :line-width="1.5" />
```

---

## BarChart

A vertical or horizontal bar chart supporting single and multi-series grouped data, per-bar color overrides, value labels, animated grow-in, focused hover states, and full axis customization.

### Basic Usage

```vue
<BarChart :data="data" />
```

### Props

#### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | — | Single-series data. Each item can include a `color` override. |
| `datasets` | `ChartDataset[]` | — | Multi-series grouped data — **overrides `data`** when provided. |
| `labels` | `string[]` | — | X-axis group labels when using `datasets`. |

#### Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `number` | `300` | Chart height in pixels. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Bar direction. Horizontal is great for ranked/comparative data. |

#### Bar Style

| Prop | Type | Default | Description |
|---|---|---|---|
| `barRadius` | `number` | `6` | Corner radius applied to the leading edge of each bar (top for vertical, right for horizontal). |
| `colors` | `string[]` | CSS palette | Override the color palette for multi-series or default single-series colors. |

#### Axis & Grid Visibility

| Prop | Type | Default | Description |
|---|---|---|---|
| `showGrid` | `boolean` | `true` | Gridlines perpendicular to the value axis. |
| `showXAxis` | `boolean` | `true` | Bottom border line (vertical) or bottom line (horizontal). |
| `showYAxis` | `boolean` | `true` | Left border line. |
| `showXLabels` | `boolean` | `true` | Category labels below bars (vertical) or value ticks at top (horizontal). Hiding collapses their reserved space. |
| `showYLabels` | `boolean` | `true` | Value tick labels left of bars (vertical) or bar names left of bars (horizontal). Hiding collapses their reserved space. |
| `gridOpacity` | `number` | `0.07` | Opacity of gridlines (0–1). |
| `axisOpacity` | `number` | `0.1` | Opacity of axis border lines (0–1). |

#### Interaction & Behaviour

| Prop | Type | Default | Description |
|---|---|---|---|
| `showValues` | `boolean` | `false` | Render value labels directly on/above each bar. |
| `showTooltip` | `boolean` | `true` | Floating tooltip on hover. |
| `showLegend` | `boolean` | `true` | Legend (only visible when `datasets` is used). |
| `animate` | `boolean` | `true` | Grow-in animation from the baseline on mount. Re-runs when data changes. |
| `formatValue` | `(v: number) => string` | built-in | Custom formatter for bar value labels and tooltip. |

### Examples

```vue
<!-- Vertical bars with per-bar colors and value labels -->
<BarChart
  :data="[
    { label: 'Jan', value: 4200, color: 'var(--color-chart-1)' },
    { label: 'Feb', value: 5800, color: 'var(--color-chart-5)' },
    { label: 'Mar', value: 5200, color: 'var(--color-chart-2)' },
    { label: 'Apr', value: 7100, color: 'var(--color-chart-3)' },
    { label: 'May', value: 6800, color: 'var(--color-chart-4)' },
    { label: 'Jun', value: 9400, color: 'var(--color-chart-6)' },
  ]"
  :height="280"
  :bar-radius="8"
  show-values />

<!-- Multi-series grouped bars -->
<BarChart
  :datasets="[
    { label: 'Product A', data: [4200, 6100, 7800, 9200] },
    { label: 'Product B', data: [3100, 4800, 5200, 7100] },
    { label: 'Product C', data: [1800, 2400, 3100, 4300] },
  ]"
  :labels="['Q1', 'Q2', 'Q3', 'Q4']"
  :height="280"
  :bar-radius="6"
  :format-value="(v) => '$' + v.toLocaleString()" />

<!-- Horizontal orientation — great for rankings -->
<BarChart
  :data="[
    { label: 'Next.js', value: 81 },
    { label: 'React',   value: 78 },
    { label: 'Vue',     value: 65 },
    { label: 'Angular', value: 52 },
    { label: 'Svelte',  value: 43 },
  ]"
  orientation="horizontal"
  :height="280"
  :bar-radius="6"
  show-values
  :format-value="(v) => v + '%'" />

<!-- Minimal embedded look — no axes, no chrome -->
<BarChart
  :data="data"
  :show-x-axis="false"
  :show-y-axis="false"
  :show-x-labels="false"
  :show-y-labels="false"
  :show-grid="false"
  show-values />

<!-- Custom grid & axis opacity -->
<BarChart
  :data="data"
  :grid-opacity="0.12"
  :axis-opacity="0.2"
  :bar-radius="4" />
```

---

## PieChart

A pie or donut chart with animated arc draw, explode-on-hover effect, optional center content, and an interactive legend.

### Basic Usage

```vue
<PieChart :data="data" />
```

### Props

#### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | **required** | Array of `{ label, value, color? }`. Colors are auto-assigned from the palette if not set per-item. |

#### Shape & Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `donut` | `boolean` | `false` | Render as a donut (ring) instead of a filled pie. |
| `innerRadius` | `number` | `60` | Inner cutout as a **percentage of the outer radius** (only applies when `donut` is `true`). Range: 0–100. |
| `size` | `number` | `280` | SVG diameter in pixels. |
| `startAngle` | `number` | `-90` | Starting angle in degrees. `-90` puts the first slice at the top (12 o'clock). |

#### Labels & Legend

| Prop | Type | Default | Description |
|---|---|---|---|
| `labelMode` | `'percent' \| 'value' \| 'label' \| 'outside' \| 'none'` | `'percent'` | What to display on each slice. `'outside'` draws labels and spider lines outside the chart. Use `'none'` to suppress. |
| `showLegend` | `boolean` | `true` | Show the item legend. |
| `legendPosition` | `'right' \| 'bottom'` | `'right'` | Where the legend sits relative to the chart. |

#### Donut Center Content

| Prop | Type | Default | Description |
|---|---|---|---|
| `centerValue` | `string` | — | Primary text in the donut center (e.g. `'$94k'`). Only rendered when `donut` is `true`. |
| `centerLabel` | `string` | — | Secondary/subtitle text below `centerValue` in the donut center. |

> Use the `#center` slot for fully custom center content (see Slots below).

#### Colors & Behaviour

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | CSS palette | Custom color palette. Overrides per-item `color` only when the item has none. |
| `animate` | `boolean` | `true` | Rotate-in animation on mount. Re-runs when `data` changes. |
| `showTooltip` | `boolean` | `true` | Floating tooltip on slice hover (shows label, value, and percentage). |

### Slots

| Slot | Slot Props | Description |
|---|---|---|
| `#center` | `{ total: number, data: ChartDataPoint[] }` | Fully custom SVG content rendered inside the donut hole. Must contain valid SVG elements. |

### Examples

```vue
<!-- Standard pie with percentage labels -->
<PieChart
  :data="[
    { label: 'Desktop', value: 42 },
    { label: 'Mobile',  value: 38 },
    { label: 'Tablet',  value: 13 },
    { label: 'Other',   value: 7  },
  ]"
  label-mode="percent" />

<!-- Donut with center props -->
<PieChart
  :data="revenueBreakdown"
  :donut="true"
  :inner-radius="62"
  :size="300"
  center-value="$94k"
  center-label="Total Revenue"
  label-mode="percent"
  legend-position="bottom" />

<!-- Donut with fully custom center slot -->
<PieChart :data="data" :donut="true" :inner-radius="55" label-mode="none">
  <template #center="{ total }">
    <text x="140" y="128" text-anchor="middle" font-size="26" font-weight="800" class="fill-foreground">
      {{ total.toLocaleString() }}
    </text>
    <text x="140" y="152" text-anchor="middle" font-size="12" class="fill-muted-foreground">
      Total Users
    </text>
  </template>
</PieChart>

<!-- Legend at bottom, no slice labels -->
<PieChart
  :data="trafficSources"
  :size="220"
  label-mode="none"
  legend-position="bottom" />

<!-- Custom colors, label mode = value -->
<PieChart
  :data="data"
  :colors="['#6366f1', '#f59e0b', '#22c55e', '#ef4444']"
  label-mode="value" />

<!-- No animation, no tooltip -->
<PieChart
  :data="data"
  :animate="false"
  :show-tooltip="false" />
```

---

## CircleChart

A single-value animated progress ring (gauge), supporting semantic color tokens, custom hex colors, gradient strokes, and fully custom center content via a slot.

### Basic Usage

```vue
<CircleChart :value="75" />
```

### Props

#### Value

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | **required** | Current value. If `max` is `100`, this is treated as a direct percentage. |
| `max` | `number` | `100` | Maximum value. The ring fills to `value / max`. |

#### Size & Shape

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `160` | SVG diameter in pixels. |
| `strokeWidth` | `number` | `12` | Ring stroke width in pixels. Larger values mean a thicker ring. |
| `lineCap` | `'round' \| 'square' \| 'butt'` | `'round'` | Shape of the stroke ends. `'round'` for smooth finish, `'butt'` for flat/modern. |

#### Color & Style

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `ChartColor \| string` | `'primary'` | Semantic color token or any CSS color string (`'#f97316'`, `'hsl(...)'`). |
| `gradient` | `boolean` | `true` | Apply a two-stop gradient on the arc stroke. |
| `trackColor` | `string` | `var(--color-muted)` | Background ring color. Accepts any CSS color. |

#### Labels & Display

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Primary label rendered below the ring. |
| `sublabel` | `string` | — | Smaller secondary label below `label`. |
| `showValue` | `boolean` | `true` | Show the calculated percentage string in the center of the ring. |
| `formatValue` | `(v: number, pct: number) => string` | built-in | Custom center display text. Receives both the raw value and the percentage (0–100). |

#### Behaviour

| Prop | Type | Default | Description |
|---|---|---|---|
| `animate` | `boolean` | `true` | Animate the arc fill from 0 to the target value on mount. Also re-animates when `value` changes. |

### Slots

| Slot | Slot Props | Description |
|---|---|---|
| `#center` | `{ value: number, percentage: number, displayValue: string }` | Fully custom HTML content rendered inside the ring. Replaces the default value display. |

### Examples

```vue
<!-- Basic with semantic color -->
<CircleChart :value="84" color="success" label="Uptime" sublabel="This month" />

<!-- Custom max (not a percentage) -->
<CircleChart
  :value="2480"
  :max="5000"
  color="info"
  label="Tasks Done"
  sublabel="of 5,000 total"
  :format-value="(v) => v.toLocaleString()" />

<!-- All semantic colors -->
<CircleChart :value="78" color="primary" label="Performance" :size="140" />
<CircleChart :value="92" color="success" label="Uptime"      :size="140" />
<CircleChart :value="64" color="warning" label="Disk Usage"  :size="140" />
<CircleChart :value="38" color="danger"  label="Error Rate"  :size="140" />
<CircleChart :value="85" color="info"    label="API Health"  :size="140" />

<!-- Custom hex color -->
<CircleChart :value="72" color="#8b5cf6" label="Adoption" sublabel="Beta users" />

<!-- No gradient, flat stroke -->
<CircleChart :value="55" :size="100" :stroke-width="8" color="primary" :gradient="false" />

<!-- Butt / flat line cap -->
<CircleChart :value="90" :size="180" :stroke-width="18" color="info" line-cap="butt" label="Coverage" />

<!-- Custom track color -->
<CircleChart :value="60" color="warning" track-color="rgba(245,158,11,0.1)" />

<!-- Fully custom center slot -->
<CircleChart :value="68" color="#f97316" :show-value="false" label="Goals Met">
  <template #center="{ percentage }">
    <div class="text-center">
      <div class="text-2xl font-black" style="color: #f97316">
        {{ Math.round(percentage) }}%
      </div>
      <div class="text-xs text-muted-foreground">Goals Met</div>
    </div>
  </template>
</CircleChart>

<!-- No animation (e.g. server-side snapshot) -->
<CircleChart :value="75" :animate="false" />
```

---

## TimelineChart

A Gantt-style horizontal timeline chart showing task bars per person across configurable time periods. Each person occupies their own row, with focused hover states, rounded colored bars spanning from a start to end position.

### Basic Usage

```vue
<TimelineChart
  :tasks="[
    { person: 'Caleb', task: 'UI Design',   start: 0.5, end: 4.5, color: '#10b981' },
    { person: 'Shaw',  task: 'UX Design',   start: 2.5, end: 5.8, color: '#f43f5e' },
    { person: 'Jane',  task: 'Music',       start: 1.8, end: 5.5, color: '#f59e0b' },
  ]"
  :periods="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tasks` | `TimelineTask[]` | **required** | Array of task objects — `{ person, task, start, end, color? }` |
| `periods` | `string[]` | **required** | X-axis period labels (e.g. month names) |
| `height` | `number` | `300` | Chart height in pixels |
| `barRadius` | `number` | `20` | Corner radius per task bar |
| `showGrid` | `boolean` | `true` | Show dashed vertical grid lines |
| `showTooltip` | `boolean` | `true` | Floating tooltip on bar hover |
| `showLabels` | `boolean` | `true` | Show task name labels inside bars |
| `animate` | `boolean` | `true` | Grow-in animation from zero width |
| `colors` | `string[]` | CSS palette | Palette for tasks without explicit `color` |

### TimelineTask Interface

```ts
interface TimelineTask {
  person: string   // Row label (Y-axis)
  task: string     // Text inside bar
  start: number    // Start position (0-based index)
  end: number      // End position
  color?: string   // Optional CSS color
}
```

---

## SegmentBarChart

A single stacked horizontal bar showing proportional segments. Each segment represents a category with color, label, and percentage value.

### Basic Usage

```vue
<SegmentBarChart
  :data="[
    { label: 'On the way',  value: 33.3, color: '#525252' },
    { label: 'Unloading',   value: 23.5, color: '#737373' },
    { label: 'Loading',     value: 23.1, color: '#a3a3a3' },
    { label: 'Waiting',     value: 20.1, color: '#d4d4d4' },
  ]" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `ChartDataPoint[]` | **required** | Segment data — `{ label, value, color? }` |
| `barHeight` | `number` | `48` | Height of the stacked bar in px |
| `barRadius` | `number` | `8` | Corner radius for the outer bar |
| `showLabels` | `boolean` | `true` | Show category labels with indicator dots above the bar |
| `showValues` | `boolean` | `true` | Show percentage values inside each segment |
| `showTooltip` | `boolean` | `true` | Floating tooltip on segment hover |
| `animate` | `boolean` | `true` | Width expansion entry animation |
| `colors` | `string[]` | CSS palette | Color palette for segments without explicit `color` |
| `formatValue` | `(v: number, pct: number) => string` | built-in | Custom formatter for segment display |

---

## StatCardChart

A responsive grid of metric cards showing a label, large percentage value, proportional size indicator, and a trend arrow. Designed for device or category breakdowns.

### Basic Usage

```vue
<StatCardChart
  :data="[
    { label: 'Desktop', percentage: 17, value: 23.8,   trend: 'up',   color: '#a3a3a3' },
    { label: 'Tablet',  percentage: 65, value: 13.604, trend: 'down', color: '#525252' },
    { label: 'Mobile',  percentage: 18, value: 47.146, trend: 'up',   color: '#737373' },
  ]" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `StatCardItem[]` | **required** | Array of card items |
| `animate` | `boolean` | `true` | Staggered fade-in / slide-up entry animation |
| `colors` | `string[]` | CSS palette | Color palette for items without explicit `color` |

### StatCardItem Interface

```ts
interface StatCardItem {
  label: string          // Card label (e.g. "Desktop")
  percentage: number     // Large percentage value (e.g. 17)
  value: number          // Bottom metric value (e.g. 23.8)
  trend: 'up' | 'down'  // Trend arrow direction
  color?: string         // Optional CSS color for the indicator
}
```

---

## WaffleChart

A grid of rounded cells colored proportionally to represent data. Supports single-value (progress) and multi-segment modes with staggered fill animation.

### Basic Usage

```vue
<!-- Single value -->
<WaffleChart :value="60" :max="100" :cell-count="30" color="primary" />

<!-- Multi-segment -->
<WaffleChart
  :data="[
    { label: 'Completed',   value: 12, color: '#e5e5e5' },
    { label: 'In Progress', value: 4,  color: '#d4d4d4' },
    { label: 'Remaining',   value: 14, color: '#525252' },
  ]"
  :cell-count="30" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current value (single-segment mode) |
| `max` | `number` | `100` | Maximum value (single-segment mode) |
| `data` | `ChartDataPoint[]` | — | Multi-segment data — each item fills proportionally |
| `cellCount` | `number` | `30` | Total number of cells in the grid |
| `columns` | `number` | auto | Number of cells per row (defaults to `cellCount` for a single row) |
| `cellRadius` | `number` | `6` | Corner radius per cell |
| `cellGap` | `number` | `4` | Gap between cells in px |
| `color` | `ChartColor` | `'primary'` | Color for filled cells (single-segment mode) |
| `colors` | `string[]` | CSS palette | Color palette for multi-segment mode |
| `trackColor` | `string` | `var(--color-muted)` | Background color for unfilled cells |
| `animate` | `boolean` | `true` | Staggered fill animation on mount |
| `showTooltip` | `boolean` | `true` | Floating tooltip on cell hover |

---

## Advanced Patterns

### Sparkline (no chrome)

A minimal, chromeless line that works well as a KPI trend indicator inside a card.

```vue
<LineChart
  :data="weeklyData"
  :height="60"
  :smooth="true"
  :fill="true"
  :show-dots="false"
  :show-grid="false"
  :show-x-axis="false"
  :show-y-axis="false"
  :show-x-labels="false"
  :show-y-labels="false"
  :show-tooltip="false"
  :show-legend="false"
  :animate="false"
  :colors="['var(--color-success)']" />
```

### Embedded widget — stripped axes

Charts inside compact cards often look better without axis chrome. Padding collapses automatically when labels are hidden.

```vue
<LineChart
  :data="data"
  :height="120"
  :show-x-labels="false"
  :show-y-labels="false"
  :show-x-axis="false"
  :show-y-axis="false"
  :grid-opacity="0.05"
  :line-width="2" />
```

### Custom value formatter (currency)

```vue
<LineChart
  :data="revenueData"
  :format-value="(v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(v)" />
```

### Reactive data updates

All charts re-animate when their `data` or `datasets` prop changes — just update your reactive ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
const data = ref([
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
])
function refresh() {
  data.value = data.value.map(d => ({ ...d, value: Math.random() * 10000 }))
}
</script>

<template>
  <button @click="refresh">Refresh</button>
  <LineChart :data="data" />
</template>
```

### Multi-series line chart

```vue
<script setup lang="ts">
const labels   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const datasets = [
  { label: 'Revenue',  data: [4200, 5800, 5200, 7100, 6800, 9400, 8200] },
  { label: 'Expenses', data: [3100, 3400, 2900, 4200, 3800, 5100, 4600] },
  { label: 'Profit',   data: [1100, 2400, 2300, 2900, 3000, 4300, 3600] },
]
</script>

<template>
  <LineChart
    :datasets="datasets"
    :labels="labels"
    :height="280"
    :fill="false"
    :format-value="(v) => '$' + v.toLocaleString()" />
</template>
```

### Donut KPI row

A common dashboard pattern — small donut rings side-by-side inside cards.

```vue
<div class="grid grid-cols-4 gap-4">
  <div v-for="kpi in kpis" :key="kpi.label" class="bg-card border rounded-xl p-4 flex items-center gap-3">
    <CircleChart
      :value="kpi.value"
      :size="56"
      :stroke-width="5"
      :color="kpi.color"
      :show-value="true"
      :animate="true" />
    <div>
      <p class="text-xs text-muted-foreground">{{ kpi.label }}</p>
      <p class="font-bold">{{ kpi.display }}</p>
    </div>
  </div>
</div>
```

---

## How Animations Work

All chart animations use `requestAnimationFrame` with an **ease-out cubic** easing function:

```
eased = 1 - (1 - t)³
```

- **LineChart** — clips a `<clipPath>` rect from left to right over 900ms
- **BarChart** — grows bars from the baseline via a `progress` multiplier on bar height over 800ms
- **PieChart** — sweeps the arc angle from 0 to the full value over 1000ms
- **CircleChart** — interpolates the `stroke-dashoffset` from 0 to the target over 1000ms

Setting `:animate="false"` skips to the final state immediately — useful for server-side rendering, reduced-motion preferences, or snapshot tests.

---

## Padding & Layout System

LineChart and BarChart compute internal padding dynamically based on what is rendered:

| Side | When increased | When collapsed |
|---|---|---|
| `left` | Y tick labels visible → measured text width + 12px (min 24px) | Y labels hidden → 8px |
| `bottom` | X tick labels visible → 24px | X labels hidden → 6px |
| `left` (horizontal bar) | Bar name labels visible → measured text width | Bar names hidden → 8px |
| `top` (horizontal bar) | Value ticks visible → 16px | Value ticks hidden → 4px |

There is also an additional `+20px` added to `left` when a `yLabel` (Y axis title) is provided.

This means **hiding labels is completely lossless** — the chart drawing area expands to use the freed space with no manual padding adjustments needed.

---

## CSS Variables Reference

You can override any of these in your global stylesheet or a scoped `:root` block:

```css
:root {
  /* Chart series colors */
  --color-chart-1: #6366f1;
  --color-chart-2: #22c55e;
  --color-chart-3: #f59e0b;
  --color-chart-4: #ef4444;
  --color-chart-5: #3b82f6;
  --color-chart-6: #ec4899;

  /* Semantic UI colors used by charts */
  --color-primary:    hsl(239 84% 67%);
  --color-success:    hsl(142 71% 45%);
  --color-warning:    hsl(38  92% 50%);
  --color-danger:     hsl(0   84% 60%);
  --color-info:       hsl(199 89% 48%);

  /* Surface colors */
  --color-background: #ffffff;
  --color-muted:      #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-foreground: #09090b;
  --color-border:     #e4e4e7;
}
```

---

## TypeScript — Full Interface Reference

```ts
// ─── Shared ────────────────────────────────────

interface ChartDataPoint {
  label: string
  value: number
  color?: string
  [key: string]: any
}

interface ChartDataset {
  label: string
  data: number[]
  color?: string
}

type ChartColor =
  | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  | 'purple'  | 'teal'    | 'orange'  | 'pink'   | 'cyan'
  | string

type PieLabelMode   = 'percent' | 'value' | 'label' | 'none'
type LegendPosition = 'right' | 'bottom'
type StrokeLineCap  = 'round' | 'square' | 'butt'

// ─── LineChart ─────────────────────────────────

interface LineChartProps {
  data?:         ChartDataPoint[]
  datasets?:     ChartDataset[]
  labels?:       string[]
  height?:       number             // default: 300
  smooth?:       boolean            // default: true
  fill?:         boolean            // default: true
  showDots?:     boolean            // default: true
  showGrid?:     boolean            // default: true
  showLegend?:   boolean            // default: true
  showTooltip?:  boolean            // default: true
  colors?:       string[]           // default: CSS palette
  animate?:      boolean            // default: true
  xLabel?:       string
  yLabel?:       string
  formatValue?:  (v: number) => string
  yMin?:         number
  yMax?:         number
  showXAxis?:    boolean            // default: true
  showYAxis?:    boolean            // default: true
  showXLabels?:  boolean            // default: true
  showYLabels?:  boolean            // default: true
  gridOpacity?:  number             // default: 0.07
  axisOpacity?:  number             // default: 0.1
  lineWidth?:    number             // default: 2.5
}

// ─── BarChart ──────────────────────────────────

interface BarChartProps {
  data?:         ChartDataPoint[]
  datasets?:     ChartDataset[]
  labels?:       string[]
  height?:       number             // default: 300
  orientation?:  'vertical' | 'horizontal'  // default: 'vertical'
  barRadius?:    number             // default: 6
  showGrid?:     boolean            // default: true
  showLegend?:   boolean            // default: true
  showTooltip?:  boolean            // default: true
  showValues?:   boolean            // default: false
  colors?:       string[]           // default: CSS palette
  animate?:      boolean            // default: true
  formatValue?:  (v: number) => string
  showXAxis?:    boolean            // default: true
  showYAxis?:    boolean            // default: true
  showXLabels?:  boolean            // default: true
  showYLabels?:  boolean            // default: true
  gridOpacity?:  number             // default: 0.07
  axisOpacity?:  number             // default: 0.1
}

// ─── PieChart ──────────────────────────────────

interface PieChartProps {
  data:            ChartDataPoint[] // required
  donut?:          boolean          // default: false
  innerRadius?:    number           // default: 60  (% of outer radius)
  size?:           number           // default: 280
  startAngle?:     number           // default: -90
  showLegend?:     boolean          // default: true
  legendPosition?: LegendPosition   // default: 'right'
  labelMode?:      PieLabelMode     // default: 'percent'
  colors?:         string[]         // default: CSS palette
  animate?:        boolean          // default: true
  showTooltip?:    boolean          // default: true
  centerLabel?:    string
  centerValue?:    string
}

// ─── CircleChart ───────────────────────────────

interface CircleChartProps {
  value:         number             // required
  max?:          number             // default: 100
  size?:         number             // default: 160
  strokeWidth?:  number             // default: 12
  color?:        ChartColor         // default: 'primary'
  gradient?:     boolean            // default: true
  label?:        string
  sublabel?:     string
  showValue?:    boolean            // default: true
  formatValue?:  (v: number, pct: number) => string
  animate?:      boolean            // default: true
  trackColor?:   string             // default: var(--color-muted)
  lineCap?:      StrokeLineCap      // default: 'round'
}

// ─── TimelineChart ─────────────────────────────

interface TimelineTask {
  person:  string
  task:    string
  start:   number
  end:     number
  color?:  string
}

interface TimelineChartProps {
  tasks:        TimelineTask[]    // required
  periods:      string[]          // required
  height?:      number            // default: 300
  barRadius?:   number            // default: 20
  showGrid?:    boolean           // default: true
  showTooltip?: boolean           // default: true
  showLabels?:  boolean           // default: true
  animate?:     boolean           // default: true
  colors?:      string[]          // default: CSS palette
}

// ─── SegmentBarChart ───────────────────────────

interface SegmentBarChartProps {
  data:          ChartDataPoint[] // required
  barHeight?:    number           // default: 48
  barRadius?:    number           // default: 8
  showLabels?:   boolean          // default: true
  showValues?:   boolean          // default: true
  showTooltip?:  boolean          // default: true
  animate?:      boolean          // default: true
  colors?:       string[]         // default: CSS palette
  formatValue?:  (v: number, pct: number) => string
}

// ─── StatCardChart ─────────────────────────────

interface StatCardItem {
  label:       string
  percentage:  number
  value:       number
  trend:       'up' | 'down'
  color?:      string
}

interface StatCardChartProps {
  data:     StatCardItem[]        // required
  animate?: boolean               // default: true
  colors?:  string[]              // default: CSS palette
}

// ─── WaffleChart ───────────────────────────────

interface WaffleChartProps {
  value?:       number
  max?:         number            // default: 100
  data?:        ChartDataPoint[]
  cellCount?:   number            // default: 30
  columns?:     number            // default: cellCount (single row)
  cellRadius?:  number            // default: 6
  cellGap?:     number            // default: 4
  color?:       ChartColor        // default: 'primary'
  colors?:      string[]          // default: CSS palette
  trackColor?:  string            // default: var(--color-muted)
  animate?:     boolean           // default: true
  showTooltip?: boolean           // default: true
}
```
