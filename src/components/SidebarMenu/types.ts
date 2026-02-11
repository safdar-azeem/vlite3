export interface SidebarMenuItemSchema {
  id?: string
  label: string
  icon?: string
  to?: string | Record<string, any>
  href?: string
  children?: SidebarMenuItemSchema[]
  badge?: string | number
  badgeClass?: string
  disabled?: boolean
  class?: string
  action?: (item: SidebarMenuItemSchema) => void
  renderMode?: 'tree' | 'popover'
}

export interface SidebarMenuProps {
  items: SidebarMenuItemSchema[]
  allowMultiple?: boolean
  indentSize?: number
  variant?: 'default' | 'ghost'
  defaultExpanded?: string[]
  compact?: boolean
  renderMode?: 'tree' | 'popover'
  showCompactLabels?: boolean
}

export interface SidebarMenuContext {
  activeItem: string | null
  expandedItems: string[]
  toggleExpand: (id: string) => void
  setActive: (id: string | null) => void
  indentSize: number
  variant: 'default' | 'ghost'
  renderMode: 'tree' | 'popover'
  compact: boolean
  showCompactLabels: boolean
}
