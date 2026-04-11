export type NavbarVariant = 'header' | 'sidebar'
export type NavbarPosition = 'fixed' | 'sticky' | 'relative' | 'absolute'
export type NavbarCenterPosition = 'center' | 'left' | 'right'
export type NavbarLayoutMode = 'classic' | 'sidebar-first' | 'dashboard' | 'dock'

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
  value?: string | number
  icon?: string
  iconRight?: string
  disabled?: boolean
  to?: any
  href?: string
  exact?: boolean
}

export interface NavbarProps {
  variant?: NavbarVariant
  position?: NavbarPosition
  centerPosition?: NavbarCenterPosition
  glass?: boolean
  border?: boolean
  floating?: boolean
  class?: string
  height?: string
  compact?: boolean
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  contentClass?: string
  menuClass?: string
  rightClass?: string
  mobileTriggerClass?: string
  mobileMenuVariant?: 'sidepanel' | 'dropdown'
}
