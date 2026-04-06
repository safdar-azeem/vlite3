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
  renderMode?: 'tree' | 'popover' | 'drilldown'
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
  renderMode?: 'tree' | 'popover' | 'drilldown'
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
  /**
   * When true, forces tree view rendering regardless of the navbar's renderNestedTabs context.
   * Useful for showing the full tree on small screens even when renderNestedTabs is active.
   */
  forceTreeView?: boolean
}

export interface SidebarMenuContext {
  activeItem: string | null
  expandedItems: string[]
  toggleExpand: (id: string) => void
  setActive: (id: string | null) => void
  indentSize: number
  variant: 'default' | 'ghost'
  renderMode: 'tree' | 'popover' | 'drilldown'
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
  drilldownStack: { items: SidebarMenuItemSchema[]; label: string; icon?: string }[]
  drillInto: (item: SidebarMenuItemSchema) => void
  drillBack: () => void
  drilldownItems: SidebarMenuItemSchema[]
  isDrilldown: boolean
}
