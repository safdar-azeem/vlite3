import { computed } from 'vue'
import { getMatrixRowPermKeys, getAllMatrixKeys } from './utils'
import type { PermissionGroup, PermissionMatrixGroup } from './types'

export type GroupToggleState = 'all' | 'none' | 'indeterminate'

/**
 * Provides a cached Set<string> for O(1) permission lookups
 * and helpers for group-level toggle state calculation.
 *
 * The permSet is a computed that rebuilds only when modelValue changes —
 * every consumer (hasPerm, getGroupState, etc.) benefits from the same cache.
 */
export function usePermissionState(getModelValue: () => string[]) {
  // ── O(1) lookup set — recomputed only when modelValue reference changes ────
  const permSet = computed<Set<string>>(() => new Set(getModelValue()))

  /** Check whether a single key is granted */
  function hasPerm(key: string): boolean {
    return permSet.value.has(key)
  }

  /** Toggle a single permission, returns the new array */
  function togglePerm(key: string): string[] {
    if (permSet.value.has(key)) {
      return getModelValue().filter((k) => k !== key)
    }
    return [...getModelValue(), key]
  }

  // ── List layout: group state ───────────────────────────────────────────────
  function getGroupState(group: PermissionGroup): GroupToggleState {
    const set = permSet.value
    let count = 0
    for (const p of group.permissions) {
      if (set.has(p.key)) count++
    }
    if (count === 0) return 'none'
    if (count === group.permissions.length) return 'all'
    return 'indeterminate'
  }

  /** Toggle all permissions in a list group, returns the new array */
  function toggleGroup(group: PermissionGroup): string[] {
    const state = getGroupState(group)
    const set = permSet.value
    if (state === 'all') {
      const keySet = new Set(group.permissions.map((p) => p.key))
      return getModelValue().filter((k) => !keySet.has(k))
    }
    const toAdd = group.permissions.filter((p) => !set.has(p.key)).map((p) => p.key)
    return [...getModelValue(), ...toAdd]
  }

  // ── Matrix layout: group state ─────────────────────────────────────────────
  function getMatrixGroupState(group: PermissionMatrixGroup): GroupToggleState {
    const set = permSet.value
    let total = 0
    let count = 0
    for (const row of group.rows) {
      const keys = getMatrixRowPermKeys(group.key, row, group.actions)
      total += keys.length
      for (const k of keys) {
        if (set.has(k)) count++
      }
    }
    if (total === 0 || count === 0) return 'none'
    if (count === total) return 'all'
    return 'indeterminate'
  }

  /** Toggle all permissions in a matrix group, returns the new array */
  function toggleMatrixGroup(group: PermissionMatrixGroup): string[] {
    const state = getMatrixGroupState(group)
    const allKeys = group.rows.flatMap((r) => getMatrixRowPermKeys(group.key, r, group.actions))
    if (state === 'all') {
      const keySet = new Set(allKeys)
      return getModelValue().filter((k) => !keySet.has(k))
    }
    const set = permSet.value
    const toAdd = allKeys.filter((k) => !set.has(k))
    return [...getModelValue(), ...toAdd]
  }

  // ── Bulk operations ────────────────────────────────────────────────────────
  /** Select all list permissions — one emit */
  function selectAllList(groups: PermissionGroup[]): string[] {
    return groups.flatMap((g) => g.permissions.map((p) => p.key))
  }

  /** Deselect all list permissions — one emit */
  function deselectAllList(): string[] {
    return []
  }

  /** Select all matrix permissions — one emit, preserves non-matrix keys */
  function selectAllMatrix(matrixGroups: PermissionMatrixGroup[], current: string[]): string[] {
    const allKeys = getAllMatrixKeys(matrixGroups)
    const allSet = new Set(allKeys)
    const existing = current.filter((k) => !allSet.has(k))
    return [...existing, ...allKeys]
  }

  /** Deselect all matrix permissions — one emit, preserves non-matrix keys */
  function deselectAllMatrix(matrixGroups: PermissionMatrixGroup[], current: string[]): string[] {
    const allSet = new Set(getAllMatrixKeys(matrixGroups))
    return current.filter((k) => !allSet.has(k))
  }

  return {
    permSet,
    hasPerm,
    togglePerm,
    getGroupState,
    toggleGroup,
    getMatrixGroupState,
    toggleMatrixGroup,
    selectAllList,
    deselectAllList,
    selectAllMatrix,
    deselectAllMatrix,
  }
}
