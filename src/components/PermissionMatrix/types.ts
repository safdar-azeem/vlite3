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
