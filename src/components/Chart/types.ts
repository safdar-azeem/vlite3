// ─────────────────────────────────────────────
// Shared Chart Types
// ─────────────────────────────────────────────

export type ChartColor =
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
  | string

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  [key: string]: any
}

export interface ChartDataset {
  label: string
  data: number[]
  color?: string
}

// ─────────────────────────────────────────────
// LineChart
// ─────────────────────────────────────────────

export interface LineChartProps {
  /** Single-series data points */
  data?: ChartDataPoint[]
  /** Multi-series datasets (overrides data) */
  datasets?: ChartDataset[]
  /** X-axis labels when using datasets */
  labels?: string[]
  /** Chart height in px */
  height?: number
  /** Smooth bezier vs straight lines */
  smooth?: boolean
  /** Fill area under line */
  fill?: boolean
  /** Show data point dots */
  showDots?: boolean
  /** Show background gridlines */
  showGrid?: boolean
  /** Show legend (multi-series) */
  showLegend?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Custom color palette */
  colors?: string[]
  /** Entry animation */
  animate?: boolean
  /** X-axis label */
  xLabel?: string
  /** Y-axis label */
  yLabel?: string
  /** Custom value formatter */
  formatValue?: (v: number) => string
  /** Y-axis min override */
  yMin?: number
  /** Y-axis max override */
  yMax?: number
}

// ─────────────────────────────────────────────
// BarChart
// ─────────────────────────────────────────────

export interface BarChartProps {
  /** Single-series data points */
  data?: ChartDataPoint[]
  /** Multi-series datasets (overrides data) */
  datasets?: ChartDataset[]
  /** X-axis labels when using datasets */
  labels?: string[]
  /** Chart height in px */
  height?: number
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Top-corner radius per bar */
  barRadius?: number
  /** Show background gridlines */
  showGrid?: boolean
  /** Show legend (multi-series) */
  showLegend?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Show value label on each bar */
  showValues?: boolean
  /** Custom color palette */
  colors?: string[]
  /** Entry animation */
  animate?: boolean
  /** Custom value formatter */
  formatValue?: (v: number) => string
}

// ─────────────────────────────────────────────
// PieChart
// ─────────────────────────────────────────────

export type PieLabelMode = 'percent' | 'value' | 'label' | 'none' | 'outside'
export type LegendPosition = 'right' | 'bottom'

export interface PieChartProps {
  /** Chart data */
  data: ChartDataPoint[]
  /** Render as donut (ring) */
  donut?: boolean
  /** Inner cutout as % of radius (donut mode) */
  innerRadius?: number
  /** Chart diameter in px */
  size?: number
  /** Start angle in degrees */
  startAngle?: number
  /** Show legend */
  showLegend?: boolean
  /** Legend position */
  legendPosition?: LegendPosition
  /** What to show on each slice */
  labelMode?: PieLabelMode
  /** Custom color palette */
  colors?: string[]
  /** Entry animation */
  animate?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Center text label (donut mode) */
  centerLabel?: string
  /** Center value text (donut mode) */
  centerValue?: string
}

// ─────────────────────────────────────────────
// CircleChart
// ─────────────────────────────────────────────

export type StrokeLineCap = 'round' | 'square' | 'butt'

export interface CircleChartProps {
  /** Current value */
  value: number
  /** Maximum value */
  max?: number
  /** Diameter in px */
  size?: number
  /** Ring stroke width */
  strokeWidth?: number
  /** Color theme or hex */
  color?: ChartColor
  /** Gradient stroke */
  gradient?: boolean
  /** Label below the value */
  label?: string
  /** Smaller sub-label */
  sublabel?: string
  /** Show percentage in center */
  showValue?: boolean
  /** Custom value display function */
  formatValue?: (v: number, pct: number) => string
  /** Entry animation */
  animate?: boolean
  /** Background track color (CSS color or empty) */
  trackColor?: string
  /** Stroke cap style */
  lineCap?: StrokeLineCap
}

// ─────────────────────────────────────────────
// GaugeChart
// ─────────────────────────────────────────────

/** Visual rendering mode for GaugeChart */
export type GaugeVariant = 'arc' | 'ticks' | 'slim' | 'ball'

/** A colored zone segment on the gauge arc */
export interface GaugeZone {
  /** Start of zone (absolute value, not percent) */
  from: number
  /** End of zone (absolute value, not percent) */
  to: number
  /** CSS color for this zone */
  color: string
}

export interface GaugeChartProps {
  // ── Core data ──────────────────────────────────
  /** Current value */
  value: number
  /** Minimum value on the scale */
  min?: number
  /** Maximum value on the scale */
  max?: number

  // ── Visual variant ────────────────────────────
  /** arc: thick gradient arc. ticks: segmented dash ring. slim: thin minimal arc. */
  variant?: GaugeVariant

  // ── Dimensions ───────────────────────────────
  /** SVG bounding diameter in px */
  size?: number
  /** Stroke width for the arc (arc & slim variants) */
  strokeWidth?: number
  /** Opening gap at the bottom of the gauge, in degrees (default 60) */
  gapAngle?: number

  // ── Colors ───────────────────────────────────
  /** Semantic color name ('primary', 'success', etc.) or any CSS color */
  color?: ChartColor
  /** Background track color */
  trackColor?: string
  /** Apply a gradient to the progress arc */
  gradient?: boolean

  // ── Ticks variant ────────────────────────────
  /** Total number of tick marks (ticks variant) */
  tickCount?: number
  /** Gap between tick marks in degrees (ticks variant) */
  tickGap?: number
  /** Thickness of each individual tick mark in px */
  tickWidth?: number

  // ── Ball variant ─────────────────────────────
  /** Radius of the glowing orb at the arc tip. Defaults to strokeWidth * 0.65 */
  ballRadius?: number

  // ── Labels ───────────────────────────────────
  /** Show the current value in the center */
  showValue?: boolean
  /** Custom formatter — receives (value, pct) */
  formatValue?: (v: number, pct: number) => string
  /** Primary label below the value */
  label?: string
  /** Secondary sublabel */
  sublabel?: string

  // ── Needle ───────────────────────────────────
  /** Show a pointer needle (arc and slim variants) */
  showNeedle?: boolean
  /** CSS color for the needle */
  needleColor?: string

  // ── Zones ────────────────────────────────────
  /** Color zones rendered as arc segments beneath the progress arc */
  zones?: GaugeZone[]

  // ── Line cap ─────────────────────────────────
  /** Cap style for the progress arc */
  lineCap?: StrokeLineCap

  // ── Animation ────────────────────────────────
  /** Play an entry animation on mount and value change */
  animate?: boolean
}

// ─────────────────────────────────────────────
// SpeedometerChart
// ─────────────────────────────────────────────

/** Visual rendering mode for SpeedometerChart */
export type SpeedometerVariant = 'classic' | 'modern' | 'sport' | 'minimal'

export interface SpeedometerChartProps {
  // ── Core data ──────────────────────────────────
  /** Current speed / value */
  value: number
  /** Minimum value on the scale */
  min?: number
  /** Maximum value on the scale (default 240) */
  max?: number

  // ── Visual variant ────────────────────────────
  /**
   * classic — Traditional car speedometer with full tick marks and numbers
   * modern — Sleek speedometer with glowing accents
   * sport  — Racing-style with red-zone, aggressive ticks
   * minimal — Clean minimal speedometer with fewer markings
   */
  variant?: SpeedometerVariant

  // ── Dimensions ───────────────────────────────
  /** SVG bounding diameter in px */
  size?: number
  /** Opening gap at the bottom, in degrees (default 60) */
  gapAngle?: number

  // ── Colors ───────────────────────────────────
  /** Semantic color name ('primary', 'success', etc.) or any CSS color */
  color?: ChartColor
  /** Needle color — defaults to 'danger' for sport, color for others */
  needleColor?: string

  // ── Scale ────────────────────────────────────
  /** Step between major tick labels (e.g. 20 → 0, 20, 40, 60, ...) */
  majorStep?: number
  /** Number of minor ticks between major ticks */
  minorTicks?: number
  /** Unit label (e.g. 'km/h', 'mph', 'RPM') */
  unit?: string

  // ── Labels ───────────────────────────────────
  /** Show the current value in the center */
  showValue?: boolean
  /** Custom value formatter */
  formatValue?: (v: number) => string
  /** Primary label below the chart */
  label?: string

  // ── Red Zone ─────────────────────────────────
  /** Start of the danger zone (absolute value). Rendered in red. */
  redZoneStart?: number

  // ── Animation ────────────────────────────────
  /** Animate needle sweep on mount and value change */
  animate?: boolean
}

// ─────────────────────────────────────────────
// TimelineChart
// ─────────────────────────────────────────────

/** A single task bar on the timeline */
export interface TimelineTask {
  /** Person / row label shown on the Y axis */
  person: string
  /** Task name displayed inside the bar */
  task: string
  /** Start position (0-based index on the time axis) */
  start: number
  /** End position (0-based index on the time axis) */
  end: number
  /** CSS color for this bar */
  color?: string
}

export interface TimelineChartProps {
  /** Array of task objects */
  tasks: TimelineTask[]
  /** X-axis period labels (e.g. month names) */
  periods: string[]
  /** Chart height in px */
  height?: number
  /** Corner radius per bar */
  barRadius?: number
  /** Show dashed vertical grid lines */
  showGrid?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Show task labels inside bars */
  showLabels?: boolean
  /** Entry animation */
  animate?: boolean
  /** Custom color palette (cycles for tasks without explicit color) */
  colors?: string[]
}

// ─────────────────────────────────────────────
// SegmentBarChart
// ─────────────────────────────────────────────

export interface SegmentBarChartProps {
  /** Segment data — each item is { label, value, color? } */
  data: ChartDataPoint[]
  /** Bar height in px */
  barHeight?: number
  /** Corner radius */
  barRadius?: number
  /** Show category labels above the bar */
  showLabels?: boolean
  /** Show percentage values inside segments */
  showValues?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Entry animation */
  animate?: boolean
  /** Custom color palette */
  colors?: string[]
  /** Custom value formatter */
  formatValue?: (v: number, pct: number) => string
}

// ─────────────────────────────────────────────
// StatCardChart
// ─────────────────────────────────────────────

/** A single metric card item */
export interface StatCardItem {
  /** Card label (e.g. "Desktop") */
  label: string
  /** Display percentage (e.g. 17) */
  percentage: number
  /** Bottom value (e.g. 23.8) */
  value: number
  /** Trend direction */
  trend: 'up' | 'down'
  /** Optional CSS color */
  color?: string
}

export interface StatCardChartProps {
  /** Array of stat card items */
  data: StatCardItem[]
  /** Entry animation */
  animate?: boolean
  /** Custom color palette */
  colors?: string[]
}

// ─────────────────────────────────────────────
// WaffleChart
// ─────────────────────────────────────────────

export interface WaffleChartProps {
  /** Single-segment: current value */
  value?: number
  /** Single-segment: maximum value */
  max?: number
  /** Multi-segment data — each item fills proportionally */
  data?: ChartDataPoint[]
  /** Total number of cells in the grid */
  cellCount?: number
  /** Number of cells per row (for multi-row layouts) */
  columns?: number
  /** Cell corner radius */
  cellRadius?: number
  /** Gap between cells in px */
  cellGap?: number
  /** Color for single-segment filled cells */
  color?: ChartColor
  /** Custom color palette for multi-segment */
  colors?: string[]
  /** Background track color for unfilled cells */
  trackColor?: string
  /** Entry animation */
  animate?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
}

// ─────────────────────────────────────────────
// GanttChart
// ─────────────────────────────────────────────

/** View granularity for the Gantt time axis */
export type GanttViewMode = 'day' | 'week' | 'month'

/** A single task (or milestone) on the Gantt chart */
export interface GanttTask {
  /** Unique identifier for this task */
  id: string
  /** Display name shown in the row label */
  name: string
  /** Start date (Date object or ISO string) */
  start: Date | string
  /** End date (Date object or ISO string) */
  end: Date | string
  /** Percentage complete (0–100). Renders a filled overlay inside the bar */
  progress?: number
  /** CSS color for this task bar. Falls back to palette rotation */
  color?: string
  /** Group label — tasks sharing the same group are visually grouped */
  group?: string
  /** IDs of tasks this task depends on. Renders dependency arrows */
  dependencies?: string[]
  /** If true, renders as a diamond milestone marker instead of a bar */
  milestone?: boolean
}

export interface GanttChartProps {
  // ── Core data ──────────────────────────────────
  /** Array of task objects */
  tasks: GanttTask[]

  // ── View mode ─────────────────────────────────
  /** Time axis granularity */
  viewMode?: GanttViewMode

  // ── Dimensions ───────────────────────────────
  /** Total chart height in px (auto-expands if more rows) */
  height?: number
  /** Height of each task row in px */
  rowHeight?: number
  /** Corner radius per task bar */
  barRadius?: number
  /** Task bar height within the row (should be ≤ rowHeight) */
  barHeight?: number
  /** Width of the left task-name sidebar in px */
  sidebarWidth?: number

  // ── Visual toggles ───────────────────────────
  /** Show dashed vertical grid lines */
  showGrid?: boolean
  /** Enable hover tooltip */
  showTooltip?: boolean
  /** Show task name labels inside bars when wide enough */
  showLabels?: boolean
  /** Show progress fill inside task bars */
  showProgress?: boolean
  /** Render dependency arrows between tasks */
  showDependencies?: boolean
  /** Show a vertical "today" marker line */
  showTodayLine?: boolean
  /** Show the top date axis header */
  showHeader?: boolean

  // ── Animation ────────────────────────────────
  /** Play an entry animation on mount */
  animate?: boolean

  // ── Colors ───────────────────────────────────
  /** Custom color palette (cycles for tasks without explicit color) */
  colors?: string[]
  /** Color for the "today" marker line */
  todayColor?: string

  // ── Formatting ───────────────────────────────
  /** Locale string for date formatting (e.g. 'en-US') */
  locale?: string

  // ── Interactivity ────────────────────────────
  /** Allow drag-and-drop to move/resize tasks */
  draggable?: boolean
  /** When moving a task, also shift all dependent tasks recursively */
  cascadeDependencies?: boolean
}
