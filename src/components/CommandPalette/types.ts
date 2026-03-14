export interface CommandPaletteItem {
  id?: string
  label: string
  labelI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  group?: string
  to?: string
  href?: string
  action?: () => void
  keywords?: string[]
  disabled?: boolean
  modalBody?: any
  modalProps?: Record<string, any>
  show?: boolean | (() => boolean)
  children?: CommandPaletteItem[]
}

export interface CommandPaletteGroup {
  key: string
  label: string
  items: CommandPaletteItem[]
}

/** A pre-indexed row used by the flat render list — index is baked in at compute time */
export interface FlatRow {
  item: CommandPaletteItem
  /** Absolute 0-based position across all groups — used directly in v-memo */
  index: number
  /** Whether a divider should be rendered after this row's group */
  isLastInGroup: boolean
}

export interface FlatGrouped {
  key: string
  label: string
  rows: FlatRow[]
}

export interface FlatList {
  groups: FlatGrouped[]
  total: number
}
