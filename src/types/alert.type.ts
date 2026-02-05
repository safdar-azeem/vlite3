export type AlertVariant = 'primary' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  title: string
  description?: string
  icon?: string
  variant?: AlertVariant
  closable?: boolean
  role?: 'alert' | 'status' | 'none'
  class?: string
}
