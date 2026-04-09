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
