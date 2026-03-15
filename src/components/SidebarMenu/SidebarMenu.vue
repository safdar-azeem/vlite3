<script setup lang="ts">
import { provide, ref, watch, reactive, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import type { SidebarMenuProps, SidebarMenuItemSchema, SidebarMenuContext } from './types'
import SidebarMenuItem from './SidebarMenuItem.vue'

// Inject Navbar context if it exists
const navbarCtx = inject<any>('navbar-context', null)

const props = withDefaults(defineProps<SidebarMenuProps>(), {
  items: () => [],
  allowMultiple: true,
  indentSize: 12,
  variant: 'default',
  defaultExpanded: () => [],
  compact: false,
  showCompactLabels: false,
  renderMode: 'tree',
  iconSize: '16px',
  compactIconSize: '21px',
  labelClass: 'text-sm',
  compactLabelClass: 'text-[11.5px] mt-1',
  itemPadding: 'py-2 px-2',
  compactItemPadding: 'py-2 px-1',
  nestedMenuWidth: '220px',
  nestedMenuMaxHeight: '300px',
  menuOffset: () => [0, 10],
  orientation: 'vertical',
  mobileBreakpoint: 'none',
  showTooltip: true,
  forceTreeView: false,
})

const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)

// Internal State
const expandedItems = ref<string[]>([...props.defaultExpanded])
const activeItem = ref<string | null>(null)

// Handle Responsiveness
const isDesktop = computed(() => {
  if (!props.mobileBreakpoint || props.mobileBreakpoint === 'none') return true
  return breakpoints.greaterOrEqual(props.mobileBreakpoint as any).value
})

const currentOrientation = computed(() => {
  // If we are on mobile (below the breakpoint), we force a vertical layout
  // because horizontal menus typically do not fit well on small screens.
  if (!isDesktop.value) {
    return 'vertical'
  }
  return props.orientation || 'vertical'
})

// When forceTreeView is true, renderNestedTabs behavior is suppressed regardless of navbar context
const effectiveRenderNestedTabs = computed(() => {
  if (props.forceTreeView) return false
  return !!navbarCtx?.renderNestedTabs?.value
})

// Centralized helper to resolve item ID reliably in proper fallback order
const getItemId = (item: SidebarMenuItemSchema): string => {
  return item.id || (typeof item.to === 'string' ? item.to : null) || item.label
}

// Path-based active check only — does NOT read activeItem ref (avoids reactive coupling)
const isPathMatch = (item: SidebarMenuItemSchema, path: string): boolean => {
  if (!item.to) return false
  const itemPath = typeof item.to === 'string' ? item.to : (item.to as any).path
  if (!itemPath) return false
  if (path === itemPath) return true
  if (itemPath !== '/' && itemPath.length > 1 && path.startsWith(itemPath)) {
    const next = path[itemPath.length]
    return !next || next === '/' || next === '?'
  }
  return false
}

/**
 * Single-pass DFS over the item tree.
 * Returns the resolved active item ID (or null) and mutates expandedItems as needed.
 * Does NOT touch activeItem ref — caller applies the result.
 */
const resolveActiveFromPath = (
  items: SidebarMenuItemSchema[],
  path: string,
  parents: string[] = []
): string | null => {
  for (const item of items) {
    const id = getItemId(item)

    if (item.children?.length) {
      const childResult = resolveActiveFromPath(item.children, path, [...parents, id])
      if (childResult !== null) {
        // Expand this parent if not already expanded
        if (!expandedItems.value.includes(id)) expandedItems.value.push(id)
        return childResult
      }
    }

    if (isPathMatch(item, path)) {
      // Expand ancestor chain
      parents.forEach((pId) => {
        if (!expandedItems.value.includes(pId)) expandedItems.value.push(pId)
      })
      return id
    }
  }
  return null
}

/**
 * Derives nested-tab payload from the current path without touching activeItem ref.
 * Returns null when the current route does not belong to any top-level group with children
 * (signals caller to clear tabs).
 */
const deriveNestedTabs = (
  path: string,
  resolvedActiveId: string | null
): { tabs: any[]; activeTab: string | number } | null => {
  for (const item of props.items) {
    if (!item.children?.length) continue

    // Does this top-level item own the current path?
    const owns =
      isPathMatch(item, path) ||
      item.children.some(
        (child) =>
          isPathMatch(child, path) || child.children?.some((grand) => isPathMatch(grand, path))
      )

    if (!owns) continue

    const tabs = item.children.map((child) => ({
      label: child.label,
      labelI18n: child.labelI18n,
      value: getItemId(child),
      icon: child.icon,
      disabled: child.disabled,
      to: child.to,
      href: child.href,
    }))

    // Resolve which child tab is active
    let activeTab: string | number = tabs[0]?.value ?? ''
    if (resolvedActiveId) {
      const direct = tabs.find((t) => t.value === resolvedActiveId)
      if (direct) {
        activeTab = direct.value
      } else {
        // Check if active id belongs to a grandchild — highlight its parent tab
        const owningChild = item.children.find((child) =>
          child.children?.some((grand) => getItemId(grand) === resolvedActiveId)
        )
        if (owningChild) activeTab = getItemId(owningChild)
      }
    }

    return { tabs, activeTab }
  }

  return null
}

/**
 * Master sync — called on route change and items change.
 * Runs resolve + nestedTabs update in one pass, then writes refs once.
 */
const syncAll = (path: string) => {
  const resolvedId = resolveActiveFromPath(props.items, path)
  activeItem.value = resolvedId

  // Only update nested tabs if renderNestedTabs is active AND forceTreeView is not set
  if (!effectiveRenderNestedTabs.value) return

  const result = deriveNestedTabs(path, resolvedId)
  if (result) {
    navbarCtx.setNestedTabs(result.tabs, result.activeTab)
  } else {
    navbarCtx.setNestedTabs([], '')
  }
}

// Route change — single watcher, single pass
watch(
  () => route?.path,
  (path) => {
    if (path) syncAll(path)
  },
  { immediate: true }
)

// Items change (e.g. async menu load)
watch(
  () => props.items,
  () => {
    if (route?.path) syncAll(route.path)
  },
  { deep: true }
)

// NOTE: No activeItem watcher — activeItem is set inside syncAll, not separately.
// This eliminates the double updateNestedTabs call that existed before.

const toggleExpand = (id: string) => {
  const isExpanded = expandedItems.value.includes(id)
  if (isExpanded) {
    expandedItems.value = expandedItems.value.filter((item) => item !== id)
  } else {
    if (!props.allowMultiple) {
      expandedItems.value = [id]
    } else {
      expandedItems.value.push(id)
    }
  }
}

const setActive = (id: string | null) => {
  activeItem.value = id
  // When an item is clicked directly (not via route), re-derive tabs if needed
  if (effectiveRenderNestedTabs.value && route?.path) {
    const result = deriveNestedTabs(route.path, id)
    if (result) {
      navbarCtx.setNestedTabs(result.tabs, result.activeTab)
    } else {
      navbarCtx.setNestedTabs([], '')
    }
  }
}

const context = reactive({
  activeItem,
  expandedItems,
  toggleExpand,
  setActive,
  indentSize: computed(() => props.indentSize),
  variant: computed(() => props.variant),
  renderMode: computed(() => props.renderMode || 'tree'),
  // Expose the effective value so SidebarMenuItem respects forceTreeView
  renderNestedTabs: effectiveRenderNestedTabs,
  compact: computed(() => props.compact),
  showCompactLabels: computed(() => props.showCompactLabels),
  iconSize: computed(() => props.iconSize),
  compactIconSize: computed(() => props.compactIconSize),
  labelClass: computed(() => props.labelClass),
  compactLabelClass: computed(() => props.compactLabelClass),
  itemPadding: computed(() => props.itemPadding),
  compactItemPadding: computed(() => props.compactItemPadding),
  nestedMenuWidth: computed(() => props.nestedMenuWidth),
  nestedMenuMaxHeight: computed(() => props.nestedMenuMaxHeight),
  currentOrientation,
  showTooltip: computed(() => props.showTooltip),
}) as unknown as SidebarMenuContext

provide('sidebar-menu-ctx', context)
</script>

<template>
  <nav
    class="flex w-full transition-all duration-300"
    :class="[
      currentOrientation === 'horizontal' ? 'flex-row flex-wrap gap-2 items-center' : 'flex-col',
      currentOrientation === 'vertical' && !props.compact ? 'space-y-1' : '',
    ]"
    role="tree"
    aria-label="Sidebar Menu">
    <SidebarMenuItem
      v-for="item in items"
      :key="item.id || item.label"
      :item="item"
      :itemClass="itemClass"
      :menuOffset="menuOffset" />
  </nav>
</template>
