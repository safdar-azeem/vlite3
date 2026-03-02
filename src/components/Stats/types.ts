export type StatsVariant = 'solid' | 'outline' | 'shadow' | 'transparent'
export type StatsLayout = 'icon-left' | 'icon-right' | 'icon-top'

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
  titleSize?: string
  valueSize?: string
  iconSize?: string
  class?: string
}
