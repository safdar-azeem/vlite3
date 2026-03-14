import { computed } from 'vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import { $t } from '@/utils/i18n'
import type { CommandPaletteItem, CommandPaletteGroup, FlatList } from './types'

// ---------------------------------------------------------------------------
// i18n label helpers
// ---------------------------------------------------------------------------

export function getEffectiveLabel(item: CommandPaletteItem): string {
  if (item.labelI18n) {
    const res = $t(item.labelI18n)
    if (res !== item.labelI18n) return res
  }
  return item.label
}

export function getEffectiveDesc(item: CommandPaletteItem): string {
  if (item.descriptionI18n) {
    const res = $t(item.descriptionI18n)
    if (res !== item.descriptionI18n) return res
  }
  return item.description ?? ''
}

// ---------------------------------------------------------------------------
// Show guard
// ---------------------------------------------------------------------------

function checkShow(show?: boolean | (() => boolean)): boolean {
  if (typeof show === 'function') return show()
  if (show !== undefined) return show
  return true
}

// ---------------------------------------------------------------------------
// Tree flatteners
// ---------------------------------------------------------------------------

export function flattenCommandItems(
  items: CommandPaletteItem[],
  parentLabel?: string,
  depth = 0
): CommandPaletteItem[] {
  const results: CommandPaletteItem[] = []
  for (const item of items) {
    if (!checkShow(item.show)) continue
    const group = depth === 0 ? item.label : (parentLabel ?? 'Navigation')
    if (item.to || item.href || item.action || item.modalBody) {
      results.push({
        ...item,
        id: item.id ?? item.to ?? item.label ?? Math.random().toString(),
        group: item.group ?? group,
      })
    }
    if (item.children?.length) {
      results.push(...flattenCommandItems(item.children, group, depth + 1))
    }
  }
  return results
}

export function flattenSidebarItems(
  items: SidebarMenuItemSchema[],
  parentLabel?: string,
  depth = 0
): CommandPaletteItem[] {
  const results: CommandPaletteItem[] = []
  for (const item of items) {
    if (!checkShow((item as any).show)) continue
    const group = depth === 0 ? item.label : (parentLabel ?? 'Navigation')
    if (item.to || item.href || item.action || (item as any).modalBody) {
      results.push({
        id:
          item.id ??
          (typeof item.to === 'string' ? item.to : '') ??
          item.label ??
          Math.random().toString(),
        label: item.label,
        labelI18n: item.labelI18n,
        icon: item.icon,
        group: (item as any).group ?? group,
        to: typeof item.to === 'string' ? item.to : (item.to as any)?.path,
        href: item.href,
        action: item.action ? () => item.action!(item) : undefined,
        disabled: item.disabled,
        modalBody: (item as any).modalBody,
        modalProps: (item as any).modalProps,
      })
    }
    if (item.children?.length) {
      results.push(...flattenSidebarItems(item.children, group, depth + 1))
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Scoring / search
// ---------------------------------------------------------------------------

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function score(item: CommandPaletteItem, q: string): number {
  const label = normalize(getEffectiveLabel(item))
  const desc = normalize(getEffectiveDesc(item))
  const kw = (item.keywords ?? []).map(normalize).join(' ')
  const nq = normalize(q)
  if (label === nq) return 100
  if (label.startsWith(nq)) return 80
  if (label.includes(nq)) return 60
  if (desc.includes(nq) || kw.includes(nq)) return 40
  return 0
}

// ---------------------------------------------------------------------------
// Main composable
// ---------------------------------------------------------------------------

export function useCommandPaletteItems(options: {
  items: () => CommandPaletteItem[]
  menuItems: () => SidebarMenuItemSchema[]
  query: () => string
  maxResultsPerGroup: () => number
}) {
  /** Merged, deduplicated item list */
  const allItems = computed<CommandPaletteItem[]>(() => {
    const fromMenu = flattenSidebarItems(options.menuItems())
    const fromStatic = flattenCommandItems(options.items())
    const seen = new Set<string>()
    const merged: CommandPaletteItem[] = []
    for (const item of [...fromStatic, ...fromMenu]) {
      if (item.id && !seen.has(item.id)) {
        seen.add(item.id)
        merged.push(item)
      }
    }
    return merged
  })

  /** Filtered + grouped results */
  const filteredGroups = computed<CommandPaletteGroup[]>(() => {
    const q = options.query().trim()
    let items = allItems.value.filter((i) => !i.disabled)

    if (q) {
      items = items
        .map((item) => ({ item, s: score(item, q) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .map(({ item }) => item)
    }

    const groupMap = new Map<string, CommandPaletteItem[]>()
    for (const item of items) {
      const g = item.group ?? 'Actions'
      if (!groupMap.has(g)) groupMap.set(g, [])
      groupMap.get(g)!.push(item)
    }

    const groups: CommandPaletteGroup[] = []
    for (const [key, groupItems] of groupMap) {
      groups.push({ key, label: key, items: groupItems.slice(0, options.maxResultsPerGroup()) })
    }
    return groups
  })

  /**
   * Pre-indexed flat render list.
   * Each row carries its absolute index as a plain number so v-memo
   * can reference [row.index === activeIndex, row.item.id] — two primitives —
   * instead of calling a function inside the memo expression.
   */
  const flatList = computed<FlatList>(() => {
    let idx = 0
    const groups = filteredGroups.value.map((group, gi) => {
      const rows = group.items.map((item, ii) => ({
        item,
        index: idx++,
        isLastInGroup: ii === group.items.length - 1 && gi < filteredGroups.value.length - 1,
      }))
      return { key: group.key, label: group.label, rows }
    })
    return { groups, total: idx }
  })

  return { filteredGroups, flatList }
}
