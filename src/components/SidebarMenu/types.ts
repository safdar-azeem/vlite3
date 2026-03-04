export interface SidebarMenuItemSchema {
  id?: string
  label: string
  labelI18n?: string
  icon?: string
  to?: string | { path: string; [key: string]: any }
  href?: string
  children?: SidebarMenuItemSchema[]
  badge?: string | number
  badgeClass?: string
  disabled?: boolean
  renderMode?: 'tree' | 'popover'
  action?: (item: SidebarMenuItemSchema) => void
  class?: string
}

export interface SidebarMenuProps {
  items?: SidebarMenuItemSchema[]
  allowMultiple?: boolean
  indentSize?: number
  variant?: 'default' | 'ghost'
  defaultExpanded?: string[]
  compact?: boolean
  showCompactLabels?: boolean
  renderMode?: 'tree' | 'popover'
  iconSize?: string
  compactIconSize?: string
  labelClass?: string
  compactLabelClass?: string
  itemPadding?: string
  compactItemPadding?: string
  nestedMenuWidth?: string
  nestedMenuMaxHeight?: string
  itemClass?: string
  menuOffset?: [number, number]
  orientation?: 'vertical' | 'horizontal'
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  showTooltip?: boolean
}

export interface SidebarMenuContext {
  activeItem: string | null
  expandedItems: string[]
  toggleExpand: (id: string) => void
  setActive: (id: string | null) => void
  indentSize: number
  variant: 'default' | 'ghost'
  renderMode: 'tree' | 'popover'
  renderNestedTabs: boolean
  compact: boolean
  showCompactLabels: boolean
  iconSize: string
  compactIconSize: string
  labelClass: string
  compactLabelClass: string
  itemPadding: string
  compactItemPadding: string
  nestedMenuWidth: string
  nestedMenuMaxHeight: string
  currentOrientation: 'vertical' | 'horizontal'
  showTooltip: boolean
}
