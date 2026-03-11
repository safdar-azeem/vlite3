import type { PermissionMatrixRow, PermissionMatrixGroup } from './types'

/** Resolve permission key for a matrix cell */
export function getMatrixPermKey(groupKey: string, row: PermissionMatrixRow, actionKey: string): string {
  if (row.singleKey) return `${groupKey}-${row.key}`
  return `${groupKey}-${row.key}-${actionKey}`
}

/** Check if a row supports a given action */
export function isActionEnabled(row: PermissionMatrixRow, actionKey: string): boolean {
  return row.actions.includes(actionKey)
}

/** Get all enabled permission keys for a matrix row */
export function getMatrixRowPermKeys(
  groupKey: string,
  row: PermissionMatrixRow,
  actions: { key: string }[]
): string[] {
  return actions
    .filter((a) => isActionEnabled(row, a.key))
    .map((a) => getMatrixPermKey(groupKey, row, a.key))
}

/** Get all permission keys from all matrix groups */
export function getAllMatrixKeys(matrixGroups: PermissionMatrixGroup[]): string[] {
  return matrixGroups.flatMap((g) =>
    g.rows.flatMap((r) => getMatrixRowPermKeys(g.key, r, g.actions))
  )
}
