export interface SidebarMenuItemSchema {
  /** Unique identifier. If not provided, will fallback to label or to-path */
  id?: string
  /** Display text */
  label: string
  /** Iconify icon string (e.g., 'lucide:home') */
  icon?: string
  /** Router link destination (string path or object) */
  to?: string | object
  /** External link URL */
  href?: string
  /** Function to call on click */
  action?: (item: SidebarMenuItemSchema) => void
  /** Recursive children */
  children?: SidebarMenuItemSchema[]
  /** Disabled state */
  disabled?: boolean
  /** Badge content (count, status, etc.) */
  badge?: string | number
  /** Badge variant/color class (optional) */
  badgeClass?: string
  /** Initially expanded state (for folders) */
  expanded?: boolean
  /** Rendering mode for children: 'tree' (inline) or 'popover' (dropdown) */
  renderMode?: 'tree' | 'popover'
  /** Custom class for this item */
  class?: string
  /** Data attributes or other props */
  [key: string]: any
}

export interface SidebarMenuProps {
  items: SidebarMenuItemSchema[]
  /** Whether multiple groups can be expanded at once. Default: true */
  allowMultiple?: boolean
  /** Initial expanded item IDs */
  defaultExpanded?: string[]
  /** Base indentation in pixels or styling units. Default: handled via padding utility. */
  indentSize?: number
  /** Style variant */
  variant?: 'default' | 'ghost'
  /** Default rendering mode for groups */
  renderMode?: 'tree' | 'popover'
}

export interface SidebarMenuContext {
  activeItem: string | null
  expandedItems: string[]
  toggleExpand: (id: string) => void
  setActive: (id: string | null) => void
  indentSize: number
  variant: 'default' | 'ghost'
  renderMode: 'tree' | 'popover'
}
