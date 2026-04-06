<script setup lang="ts">
import { provide, ref, watch, reactive, computed, inject, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import type { SidebarMenuProps, SidebarMenuItemSchema, SidebarMenuContext } from './types'
import SidebarMenuItem from './SidebarMenuItem.vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'

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
  showTooltip: false,
  forceTreeView: false,
})

const route = useRoute()
const router = useRouter()
const breakpoints = useBreakpoints(breakpointsTailwind)

// Internal State
const expandedItems = ref<string[]>([...props.defaultExpanded])
const activeItem = ref<string | null>(null)

// Drilldown State
type DrilldownLevel = { items: SidebarMenuItemSchema[]; label: string; icon?: string }
const drilldownStack = ref<DrilldownLevel[]>([])
const drillDirection = ref<'forward' | 'backward'>('forward')

const isDrilldown = computed(() => drilldownStack.value.length > 0)
const drilldownItems = computed(() => {
  if (drilldownStack.value.length === 0) return props.items
  return drilldownStack.value[drilldownStack.value.length - 1].items
})
const drilldownCurrentLabel = computed(() => {
  if (drilldownStack.value.length === 0) return ''
  return drilldownStack.value[drilldownStack.value.length - 1].label
})
const drilldownCurrentIcon = computed(() => {
  if (drilldownStack.value.length === 0) return undefined
  return drilldownStack.value[drilldownStack.value.length - 1].icon
})

const drillInto = (item: SidebarMenuItemSchema) => {
  if (!item.children?.length) return
  drillDirection.value = 'forward'
  drilldownStack.value = [
    ...drilldownStack.value,
    { items: item.children, label: item.label, icon: item.icon },
  ]
}

const drillBack = () => {
  if (drilldownStack.value.length === 0) return
  drillDirection.value = 'backward'
  drilldownStack.value = drilldownStack.value.slice(0, -1)
}

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

// Auto-drill on route change when renderMode is drilldown
const findDrillPath = (
  items: SidebarMenuItemSchema[],
  path: string,
  trail: DrilldownLevel[] = []
): DrilldownLevel[] | null => {
  for (const item of items) {
    // Check if a root-level item itself matches (no drill needed)
    if (trail.length === 0 && isPathMatch(item, path)) return null

    if (item.children?.length) {
      const newTrail = [
        ...trail,
        { items: item.children, label: item.label, icon: item.icon } as DrilldownLevel,
      ]
      // Check if any direct child matches the path
      for (const child of item.children) {
        if (isPathMatch(child, path)) return newTrail
      }
      // Recurse deeper
      const deeper = findDrillPath(item.children, path, newTrail)
      if (deeper) return deeper
    }
  }
  return null
}

/**
 * Recursively check if any item (or its descendants) in the given list
 * matches the current path — so we know whether the path is "visible"
 * from the current drill level.
 */
const isPathVisibleInItems = (
  items: SidebarMenuItemSchema[],
  path: string
): boolean => {
  for (const item of items) {
    if (isPathMatch(item, path)) return true
    // Do NOT recurse into children here — we only care about direct items at this level
  }
  return false
}

// Sync drilldown stack when route changes (only when in drilldown mode)
// This handles: initial page load, browser back/forward, programmatic navigation
watch(
  () => route?.path,
  (path) => {
    if (!path) return
    const globalMode = props.renderMode || 'tree'
    if (globalMode !== 'drilldown') return

    // If the current drill level already shows this route, do nothing
    const currentItems = drilldownItems.value
    if (isPathVisibleInItems(currentItems, path)) return

    // Check if the path belongs to a root-level item (no drill needed)
    if (isPathVisibleInItems(props.items, path)) {
      // Reset to root
      if (drilldownStack.value.length > 0) {
        drillDirection.value = 'backward'
        drilldownStack.value = []
      }
      return
    }

    // Find the correct drill path from root
    const drillPath = findDrillPath(props.items, path)
    if (drillPath && drillPath.length > 0) {
      drillDirection.value = 'forward'
      drilldownStack.value = drillPath
    }
  }
)

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
  drilldownStack,
  drillInto,
  drillBack,
  drilldownItems,
  isDrilldown,
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
    <!-- Drilldown Mode -->
    <template v-if="(props.renderMode || 'tree') === 'drilldown' && currentOrientation === 'vertical'">
      <div class="w-full sidebar-drilldown-container relative overflow-hidden">
        <TransitionGroup
          :name="drillDirection === 'forward' ? 'drill-forward' : 'drill-backward'"
          tag="div"
          class="relative w-full">
          <div
            :key="drilldownStack.length"
            class="w-full">
            <!-- Back Button -->
            <button
              v-if="isDrilldown"
              type="button"
              class="flex items-center gap-2 w-full px-2 py-2.5 mb-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-md transition-all duration-150 group cursor-pointer"
              @click="drillBack">
              <Icon
                icon="lucide:chevron-left"
                class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <Icon
                v-if="drilldownCurrentIcon"
                :icon="drilldownCurrentIcon"
                class="w-4 h-4 shrink-0 opacity-70" />
              <span class="truncate font-semibold text-foreground">
                {{ drilldownCurrentLabel }}
              </span>
            </button>
            <div
              v-if="isDrilldown"
              class="h-px bg-border/60 mx-1 mb-1.5" />

            <!-- Items at current drill level -->
            <div :class="isDrilldown ? 'space-y-0.5' : 'space-y-1'">
              <SidebarMenuItem
                v-for="item in drilldownItems"
                :key="item.id || item.label"
                :item="item"
                :itemClass="itemClass"
                :menuOffset="menuOffset" />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </template>

    <!-- Default (tree / popover) Mode -->
    <template v-else>
      <SidebarMenuItem
        v-for="item in items"
        :key="item.id || item.label"
        :item="item"
        :itemClass="itemClass"
        :menuOffset="menuOffset" />
    </template>
  </nav>
</template>

<style>
/* Drilldown forward transition (drill INTO children) */
.drill-forward-enter-active,
.drill-forward-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.drill-forward-enter-from {
  opacity: 0;
  transform: translateX(40%);
}
.drill-forward-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.drill-forward-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.drill-forward-leave-to {
  opacity: 0;
  transform: translateX(-40%);
}
.drill-forward-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

/* Drilldown backward transition (drill BACK to parent) */
.drill-backward-enter-active,
.drill-backward-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.drill-backward-enter-from {
  opacity: 0;
  transform: translateX(-40%);
}
.drill-backward-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.drill-backward-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.drill-backward-leave-to {
  opacity: 0;
  transform: translateX(40%);
}
.drill-backward-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.sidebar-drilldown-container {
  min-height: 0;
}
</style>
