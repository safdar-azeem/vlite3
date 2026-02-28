export type IVariants =
  | 'danger'
  | 'primary'
  | 'default'
  | 'outline'
  | 'secondary'
  | 'transparent'
  | 'success'
  | 'warning'

export type ISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export type IDropdownOption = {
  label: string
  labelI18n?: string
  value?: any
  subtitle?: string
  subtitleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  emoji?: string
  disabled?: Boolean
  iconClass?: string
  iconStyle?: any
  length?: number
  values?: any
  data?: any
  // Schema support for nested menus
  children?: IDropdownOption[]
  key?: string // Property name for nested value objects
  position?: any // TooltTipPlacement
  offset?: [number, number]
  confirmation?:
    | boolean
    | {
        title?: string
        description?: string
        confirmText?: string
        cancelText?: string
        variant?: 'danger' | 'primary' | 'warning' | 'success' | 'info'
      }
}

export type IDropdownOptions = IDropdownOption[]
