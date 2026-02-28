export interface TimelineStep {
  id: string | number
  title: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  status?: 'completed' | 'current' | 'upcoming'
}

export type TimelineDirection = 'horizontal' | 'vertical'

export type TimelineTextPosition = 'bottom' | 'right'

