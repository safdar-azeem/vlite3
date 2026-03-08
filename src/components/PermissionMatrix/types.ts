/** A single permission definition */
export interface PermissionDef {
  /** Unique key, e.g. 'hrm_manage_payroll' */
  key: string
  /** Display label, e.g. 'Manage Payroll' */
  label: string
  /** Optional tooltip description */
  description?: string
}

/** Group of permissions under a module/category */
export interface PermissionGroup {
  /** Unique group key, e.g. 'hrm' */
  key: string
  /** Display label, e.g. 'HRM' */
  label: string
  /** Optional icon (Iconify format) */
  icon?: string
  /** Permissions in this group */
  permissions: PermissionDef[]
}

/** A role definition */
export interface RoleDef {
  /** Unique key, e.g. 'admin' */
  key: string
  /** Display label, e.g. 'Administrator' */
  label: string
  /** Optional color tint for the role column header */
  color?: string
  /** Optional description */
  description?: string
  /** If true, all toggles for this role are disabled (e.g. super-admin) */
  locked?: boolean
}

/** Map of role keys → array of granted permission keys */
export type PermissionMap = Record<string, string[]>

export type PermissionToggleMode = 'checkbox' | 'switch'
export type PermissionMatrixSize = 'sm' | 'md'

export interface PermissionMatrixProps {
  /** Role definitions (columns) */
  roles: RoleDef[]
  /** Permission groups with nested permissions (rows) */
  groups: PermissionGroup[]
  /** v-model: map of roleKey → permissionKey[] */
  modelValue: PermissionMap
  /** Toggle display mode (default: 'checkbox') */
  toggleMode?: PermissionToggleMode
  /** Show search input (default: true) */
  searchable?: boolean
  /** Allow collapsing groups (default: true) */
  collapsible?: boolean
  /** Read-only mode — all toggles disabled */
  readonly?: boolean
  /** Size variant (default: 'md') */
  size?: PermissionMatrixSize
  /** Sticky role header row (default: true) */
  stickyHeader?: boolean
  /** Extra CSS classes */
  class?: string
}

// ── Matrix layout types for PermissionEditor ──────────────────────────────

export type PermissionEditorLayout = 'list' | 'matrix'

/** A column (action) in the matrix layout */
export interface PermissionMatrixAction {
  /** Action identifier used in key construction, e.g. 'create' */
  key: string
  /** Display label, e.g. 'Create' */
  label: string
}

/** A row (entity) in the matrix layout */
export interface PermissionMatrixRow {
  /** Entity identifier, e.g. 'employee' */
  key: string
  /** Display label, e.g. 'Employee' */
  label: string
  /** Which action keys this row supports. Unlisted actions render as disabled cells. */
  actions: string[]
  /**
   * If true, the permission key is `{prefix}-{row.key}` instead of
   * `{prefix}-{row.key}-{action.key}`. Useful for single-purpose rows
   * like "Can Share" that map to one key regardless of which action column they occupy.
   */
  singleKey?: boolean
  /** Optional tooltip description */
  description?: string
}

/** A group of matrix rows sharing the same set of actions */
export interface PermissionMatrixGroup {
  /** Unique group key used as the permission prefix, e.g. 'hrm' */
  key: string
  /** Display label for the group header, e.g. 'HRM' */
  label: string
  /** Optional icon (Iconify format) */
  icon?: string
  /** Column definitions */
  actions: PermissionMatrixAction[]
  /** Entity rows */
  rows: PermissionMatrixRow[]
}
