export type BreadcrumbVariant = 'default' | 'contained' | 'pills' | 'arrow'

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'dot' | 'arrow'

export type BreadcrumbSize = 'sm' | 'md' | 'lg'

export interface BreadcrumbItemSchema {
  label: string
  to?: string
  href?: string
  icon?: string
  disabled?: boolean
  active?: boolean
}

export interface BreadcrumbProps {
  items?: BreadcrumbItemSchema[]
  variant?: BreadcrumbVariant
  separator?: BreadcrumbSeparator
  size?: BreadcrumbSize
  maxItems?: number
  class?: string
}
