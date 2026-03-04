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
  floating?: boolean
  class?: string
  height?: string
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
  /**
   * When true (Layout Mode only), renders a bars toggle button before the logo
   * in the #header slot area on large screens. Allows users to show/hide the
   * sidebar. Preference is persisted in localStorage.
   * Mobile breakpoint behavior is completely unaffected.
   */
  sidebarToggle?: boolean
}
