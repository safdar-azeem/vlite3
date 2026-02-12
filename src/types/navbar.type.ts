export type NavbarVariant = 'header' | 'sidebar'
export type NavbarPosition = 'fixed' | 'sticky' | 'relative' | 'absolute'
export type NavbarCenterPosition = 'center' | 'left' | 'right'

export interface NavbarItemProps {
  to?: string
  href?: string
  label?: string
  icon?: string
  active?: boolean
  disabled?: boolean
  onClick?: (e: MouseEvent) => void
  class?: string
}

export interface NavbarProps {
  variant?: NavbarVariant
  position?: NavbarPosition
  centerPosition?: NavbarCenterPosition
  glass?: boolean
  border?: boolean
  floating?: boolean // For floating navbar effect
  class?: string
  height?: string // For header variant
  width?: string // For sidebar variant
  compact?: boolean
  logo?: string
  logoAlt?: string
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  logoClass?: string
  contentClass?: string
  rightClass?: string
  mobileTriggerClass?: string
}
