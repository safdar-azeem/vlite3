export type AppShellVariant = 'header' | 'sidebar'
export type AppShellPosition = 'fixed' | 'sticky' | 'relative' | 'absolute'
export type AppShellCenterPosition = 'center' | 'left' | 'right'
export type AppShellLayoutMode = 'variant1' | 'variant2' | 'variant3' | 'variant4' | 'variant5'

export interface AppShellProps {
  variant?: AppShellVariant
  position?: AppShellPosition
  centerPosition?: AppShellCenterPosition
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
  layoutMode?: AppShellLayoutMode
}
