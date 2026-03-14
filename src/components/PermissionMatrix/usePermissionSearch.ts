import { ref, computed, watch, onMounted } from 'vue'
import type { PermissionGroup, PermissionMatrixGroup } from './types'

/**
 * Encapsulates search query, group-key filter, and collapsed-state management
 * for both list and matrix layouts.
 */
export function usePermissionSearch(
  isMatrix: () => boolean,
  getGroups: () => PermissionGroup[],
  getMatrixGroups: () => PermissionMatrixGroup[],
  defaultExpanded: () => string[]
) {
  const searchQuery = ref('')
  const selectedGroupKeys = ref<string[]>([])
  const collapsedGroups = ref<Set<string>>(new Set())
  const baseCollapsedGroups = ref<Set<string>>(new Set())

  // ── Compute which groups start collapsed based on defaultExpanded ──────────
  function computeBaseCollapsed(): Set<string> {
    const expanded = defaultExpanded()
    if (expanded.length > 0) {
      const allKeys = (isMatrix() ? getMatrixGroups() : getGroups()).map((g) => g.key)
      return new Set(allKeys.filter((k) => !expanded.includes(k)))
    }
    return new Set()
  }

  onMounted(() => {
    const base = computeBaseCollapsed()
    baseCollapsedGroups.value = base
    collapsedGroups.value = new Set(base)
  })

  // ── Auto-expand groups that match the search query ─────────────────────────
  watch(searchQuery, (query) => {
    if (!query.trim()) {
      collapsedGroups.value = new Set(baseCollapsedGroups.value)
      return
    }
    const q = query.toLowerCase()
    const matchedKeys = new Set<string>()

    if (isMatrix()) {
      for (const group of getMatrixGroups()) {
        if (
          group.label.toLowerCase().includes(q) ||
          group.rows.some(
            (r) => r.label.toLowerCase().includes(q) || r.key.toLowerCase().includes(q)
          )
        ) {
          matchedKeys.add(group.key)
        }
      }
    } else {
      for (const group of getGroups()) {
        if (
          group.label.toLowerCase().includes(q) ||
          group.permissions.some(
            (p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
          )
        ) {
          matchedKeys.add(group.key)
        }
      }
    }

    const allKeys = (isMatrix() ? getMatrixGroups() : getGroups()).map((g) => g.key)
    collapsedGroups.value = new Set(allKeys.filter((k) => !matchedKeys.has(k)))
  })

  // ── Toggle a single group open/closed ─────────────────────────────────────
  function toggleGroupCollapse(groupKey: string, collapsible: boolean) {
    if (!collapsible) return
    const next = new Set(collapsedGroups.value)
    if (next.has(groupKey)) next.delete(groupKey)
    else next.add(groupKey)
    collapsedGroups.value = next
    // Persist manual toggle into base state when not searching
    if (!searchQuery.value.trim()) {
      baseCollapsedGroups.value = new Set(next)
    }
  }

  // ── Filtered list groups ───────────────────────────────────────────────────
  const filteredGroups = computed<PermissionGroup[]>(() => {
    let result = getGroups()
    if (selectedGroupKeys.value.length > 0) {
      result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
    }
    if (!searchQuery.value.trim()) return result

    const q = searchQuery.value.toLowerCase()
    return result
      .map((group) => {
        const filteredPerms = group.permissions.filter(
          (p) =>
            p.label.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
        )
        if (filteredPerms.length === 0) return null
        return { ...group, permissions: filteredPerms }
      })
      .filter(Boolean) as PermissionGroup[]
  })

  // ── Filtered matrix groups ─────────────────────────────────────────────────
  const filteredMatrixGroups = computed<PermissionMatrixGroup[]>(() => {
    let result = getMatrixGroups()
    if (selectedGroupKeys.value.length > 0) {
      result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
    }
    if (!searchQuery.value.trim()) return result

    const q = searchQuery.value.toLowerCase()
    return result
      .map((group) => {
        const filteredRows = group.rows.filter(
          (r) =>
            r.label.toLowerCase().includes(q) ||
            r.key.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
        )
        if (filteredRows.length === 0) return null
        return { ...group, rows: filteredRows }
      })
      .filter(Boolean) as PermissionMatrixGroup[]
  })

  return {
    searchQuery,
    selectedGroupKeys,
    collapsedGroups,
    filteredGroups,
    filteredMatrixGroups,
    toggleGroupCollapse,
  }
}
