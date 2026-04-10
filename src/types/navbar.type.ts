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
  sidebarToggle?: boolean
  breadcrumb?: boolean
  breadcrumbPosition?: 'header' | 'main'
  breadcrumbVariant?: import('@/components/Breadcrumb/types').BreadcrumbVariant
  breadcrumbSeparator?: import('@/components/Breadcrumb/types').BreadcrumbSeparator
  breadcrumbSize?: import('@/components/Breadcrumb/types').BreadcrumbSize
  breadcrumbLabels?: Record<string, string>
  breadcrumbHomeIcon?: string
  breadcrumbClass?: string
  /**
   * Controls the layout structure when both #header and #main slots are used.
   * - 'sidebar-first' (default): Sidebar spans full height on the left; header + main stack on the right.
   * - 'classic': Header spans full width on top; sidebar + main sit below it side by side.
   */
  layoutMode?: NavbarLayoutMode
}
