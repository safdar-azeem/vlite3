export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SpinnerColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'current'
  | 'white'

export type SpinnerVariant = 'border' | 'dots' | 'bars' | 'ping'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  variant?: SpinnerVariant
  class?: string
}
