export interface TabesOption {
  label: string
  labelI18n?: string
  value: string | number
  icon?: string
  disabled?: boolean
  to?: string | { path: string; [key: string]: any }
  href?: string
}

export type TabesSize = 'sm' | 'md' | 'lg'

export type TabesVariant =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'outline'
  | 'line'
