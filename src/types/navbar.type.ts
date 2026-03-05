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
  value?: string | number
  icon?: string
  iconRight?: string
  disabled?: boolean
  to?: any // Changed from `to?: string | any` for wider array element matching
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
  /**
   * When true (Layout Mode only), renders a bars toggle button before the logo
   * in the #header slot area on large screens. Allows users to show/hide the
   * sidebar. Preference is persisted in localStorage.
   * Mobile breakpoint behavior is completely unaffected.
   */
  sidebarToggle?: boolean

  /**
   * When true, automatically renders a Breadcrumb inside the #main slot area
   * based on the current route path. Works in Layout Mode.
   */
  breadcrumb?: boolean
  /** Where to render the breadcrumb: 'header' renders as a slim bar inside the header, 'main' renders above the main content (default: 'header') */
  breadcrumbPosition?: 'header' | 'main'
  /** Breadcrumb visual variant (default: 'default') */
  breadcrumbVariant?: import('@/components/Breadcrumb/types').BreadcrumbVariant
  /** Breadcrumb separator style (default: 'chevron') */
  breadcrumbSeparator?: import('@/components/Breadcrumb/types').BreadcrumbSeparator
  /** Breadcrumb size (default: 'sm') */
  breadcrumbSize?: import('@/components/Breadcrumb/types').BreadcrumbSize
  /** Override auto-generated labels by path, e.g. { '/settings': 'Preferences' } */
  breadcrumbLabels?: Record<string, string>
  /** Home icon (default: 'lucide:home') */
  breadcrumbHomeIcon?: string
  /** Extra CSS classes for the breadcrumb wrapper */
  breadcrumbClass?: string
}
