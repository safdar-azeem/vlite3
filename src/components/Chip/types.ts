export type ChipVariant =
  | 'solid'
  | 'outline'
  | 'subtle'
  | 'ghost'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type ChipSize = 'small' | 'medium' | 'large'

export interface ChipProps {
  text?: string
  icon?: string
  variant?: ChipVariant
  size?: ChipSize
  disabled?: boolean
  clickable?: boolean
  deletable?: boolean
  class?: string
}
