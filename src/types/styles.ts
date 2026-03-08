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
  // Per-item class customization
  class?: string         // Applied to the option row (DropdownItem / nested trigger div)
  triggerClass?: string  // Applied to the nested trigger wrapper div (only for items with children)
  // Schema support for nested menus
  children?: IDropdownOption[]
  key?: string // Property name for nested value objects
  position?: any // TooltTipPlacement — overrides nestedPosition for this specific item
  offset?: [number, number] // overrides nestedOffset for this specific item
  showChevron?: boolean // Control chevron visibility per child item (default: true when children exist)
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
