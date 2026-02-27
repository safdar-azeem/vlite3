export type ButtonVariant =
  | 'primary'
  | 'primary-light'
  | 'secondary'
  | 'danger'
  | 'danger-light'
  | 'warning'
  | 'warning-light'
  | 'info'
  | 'info-light'
  | 'success'
  | 'success-light'
  | 'outline'
  | 'outline-primary'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-success'
  | 'ghost'
  | 'link'

export type ButtonSize = 'xs' | 'md' | 'sm' | 'lg' | 'xl'
export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  class?: any
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconRight?: string
  type?: 'button' | 'submit' | 'reset'
  text?: string
  rounded?: ButtonRounded
  textClass?: string
  iconClass?: string
  iconRightClass?: string
  asIcon?: boolean
}
