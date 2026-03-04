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

export interface NavbarTabItem {
  label: string
  labelI18n?: string
  value: string | number
  icon?: string
  disabled?: boolean
  to?: string | any
  href?: string
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
  compact?: boolean
  renderNestedTabs?: boolean
  logo?: string
  logoAlt?: string
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  logoClass?: string
  contentClass?: string
  menuClass?: string
  rightClass?: string
  mobileTriggerClass?: string
  mobileMenuVariant?: 'sidepanel' | 'dropdown'
}
