export interface HeatmapDataPoint {
  x: number
  y: number
  value: number
  [key: string]: any
}

export interface HeatmapCell {
  x: number
  y: number
  value: number
  normalizedValue: number
  displayValue?: string | number
  tooltip?: string
  [key: string]: any
}

export type HeatmapColorScheme =
  | 'github'
  | 'green'
  | 'blue'
  | 'red'
  | 'purple'
  | 'orange'
  | 'grayscale'
  | 'custom'

export interface HeatmapColorConfig {
  scheme?: HeatmapColorScheme
  colors?: string[]
  minColor?: string
  maxColor?: string
  emptyColor?: string
}

export type HeatmapLayout = 'grid' | 'sequential' | 'custom'

export interface HeatmapGridConfig {
  rows?: number
  cols?: number
  cellSize?: number
  gap?: number
}

export interface HeatmapSequentialConfig {
  itemsPerRow?: number
  cellSize?: number
  gap?: number
  startDate?: Date
  endDate?: Date
}

export interface HeatmapTooltipConfig {
  enabled?: boolean
  formatter?: (cell: HeatmapCell, dataPoint: HeatmapDataPoint) => string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
}

export interface HeatmapProps {
  data: HeatmapDataPoint[]
  layout?: HeatmapLayout
  colorConfig?: HeatmapColorConfig
  minValue?: number
  maxValue?: number
  gridConfig?: HeatmapGridConfig
  sequentialConfig?: HeatmapSequentialConfig
  tooltipConfig?: HeatmapTooltipConfig
  showLegend?: boolean
  showLabels?: boolean
  interactive?: boolean

  responsive?: boolean
  minCellSize?: number
  maxCellSize?: number
  class?: string
  cellClass?: string
  emptyCellClass?: string
}

export interface HeatmapLegendItem {
  value: number
  color: string
  label?: string
}
