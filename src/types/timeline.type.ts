export type TimelineProgressStatus = 'completed' | 'current' | 'upcoming'
export type TimelineDirection = 'horizontal' | 'vertical'
export type TimelineTextPosition = 'bottom' | 'right'
export type TimelineLineStyle = 'solid' | 'dashed'
export type TimelineIndicatorType = 'icon' | 'number' | 'dot'

export interface TimelineStep {
  id: string | number
  title?: string
  titleI18n?: string
  subtitle?: string
  subtitleI18n?: string
  description?: string
  descriptionI18n?: string
  date?: string
  icon?: string
  status?: string // Used for business logic badges (e.g. 'Pending', 'Approved')
  progressStatus?: TimelineProgressStatus // Explicit override for progress visual
  component?: any // Dynamic component to render in the content slot
  componentProps?: Record<string, any>
  [key: string]: any // allow custom arbitrary data payload
}
