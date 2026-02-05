export interface TimelineStep {
  id: string | number
  title: string
  description?: string
  icon?: string
  status?: 'completed' | 'current' | 'upcoming'
}

export type TimelineDirection = 'horizontal' | 'vertical'

export type TimelineTextPosition = 'bottom' | 'right'
