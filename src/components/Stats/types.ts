export type StatsVariant = 'solid' | 'outline' | 'shadow' | 'transparent' | 'transparent-header'
export type StatsLayout =
  | 'icon-left'
  | 'icon-right'
  | 'icon-top'
  | 'title-top-icon-bottom-right'
  | 'centered-value-title'
  | 'floating-icon'
  | 'split-bar'
  | 'inline-label-value'

export type IconBoxShape = 'rounded' | 'full-rounded' | 'none'
export type IconBoxStyle = 'filled' | 'transparent'

export interface StatTrend {
  value: string | number
  isPositive?: boolean
  label?: string
}

export interface StatItemSchema {
  id: string | number
  title: string
  titleI18n?: string
  value: string | number
  isPrice?: boolean
  numberFormat?: 'standard' | 'compact'
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | string
  trend?: StatTrend
  [key: string]: any
}

export interface StatsProps {
  items: StatItemSchema[]
  variant?: StatsVariant
  layout?: StatsLayout
  columns?: number | string
  attached?: boolean
  loading?: boolean
  titleSize?: string
  valueSize?: string
  iconSize?: string
  iconBoxShape?: IconBoxShape
  iconBoxStyle?: IconBoxStyle
  class?: string
}
