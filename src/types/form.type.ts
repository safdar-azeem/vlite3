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

export type InputVariant = 'solid' | 'outline' | 'outline-b' | 'transparent'
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
  loading?: boolean
  error?: string
  icon?: string
  iconRight?: string
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
