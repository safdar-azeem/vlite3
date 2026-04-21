export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'date'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'

export type InputVariant = 'solid' | 'outline' | 'outline-b' | 'transparent' | 'floating'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string
export type LabelPosition = 'top' | 'left' | 'right'

export interface InputProps {
  modelValue?: string | number
  type?: InputType
  label?: string
  labelI18n?: string
  placeholder?: string
  placeholderI18n?: string
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
  error?: string
  icon?: string
  iconClass?: string
  iconRight?: string
  iconRightClass?: string
  showClearButton?: boolean
  autofocus?: boolean
  class?: string
  inputClass?: string
  rows?: number
  lazy?: boolean
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  labelPosition?: LabelPosition
  addonLeft?: string | Record<string, any>
  addonRight?: string | Record<string, any>
  addonLeftClass?: string
  addonRightClass?: string
  min?: number
  max?: number
}

// Checkbox Types
export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type CheckboxRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface CheckboxProps {
  modelValue?: boolean
  checked?: boolean // Alias
  disabled?: boolean
  indeterminate?: boolean
  label?: string
  id?: string
  class?: string
  size?: CheckboxSize
  rounded?: CheckboxRounded
}

// Radio Types
export type RadioSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type RadioColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

export interface RadioProps {
  modelValue?: any
  value?: any
  disabled?: boolean
  label?: string
  labelI18n?: string
  id?: string
  class?: string
  size?: RadioSize
  color?: RadioColor
  name?: string
}

export interface RadioGroupProps {
  modelValue?: any
  name?: string
  disabled?: boolean
  direction?: 'row' | 'column'
  size?: RadioSize
  color?: RadioColor
  class?: string
}
