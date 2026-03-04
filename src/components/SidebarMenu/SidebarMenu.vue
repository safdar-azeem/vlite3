<script setup lang="ts">
import { provide, ref, watch, reactive, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
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
  compactIconSize: '20px',
  labelClass: 'text-sm',
  compactLabelClass: 'text-[11.5px] mt-1',
  itemPadding: 'py-2 px-2',
  compactItemPadding: 'py-2 px-1',
  nestedMenuWidth: '220px',
  nestedMenuMaxHeight: '300px',
  menuOffset: () => [0, 10],
})

const route = useRoute()

// Internal State
const expandedItems = ref<string[]>([...props.defaultExpanded])
const activeItem = ref<string | null>(null)

// Helper: Check if item is active
const isItemActive = (item: SidebarMenuItemSchema, path: string): boolean => {
  // 1. Check ID equality with activeItem (manual set)
  if (activeItem.value === item.id) return true

  // 2. Check Route Path
  if (item.to) {
    const itemPath = typeof item.to === 'string' ? item.to : (item.to as any).path
    if (itemPath) {
      if (path === itemPath) return true
      if (path.startsWith(itemPath) && itemPath !== '/' && itemPath.length > 1) return true
    }
  }
  return false
}

// Logic to find active item and expand parents
const syncWithRoute = (
  items: SidebarMenuItemSchema[],
  path: string,
  parents: string[] = []
): boolean => {
  let found = false
  for (const item of items) {
    // Match logic in SidebarMenuItem: ID > to (if string) > label
    const id = item.id || (typeof item.to === 'string' ? item.to : null) || item.label

    // Recurse first to see if child matches
    let childFound = false
    if (item.children) {
      childFound = syncWithRoute(item.children, path, [...parents, id])
      if (childFound) {
        found = true
      }
    }

    // Check if this item is the active one directly or through a child (in nested layout tabs mode)
    const isDirectlyActive = isItemActive(item, path)
    const isParentActiveViaTabs =
      childFound && navbarCtx?.renderNestedTabs?.value && parents.length === 0

    if (isDirectlyActive || isParentActiveViaTabs) {
      activeItem.value = id

      // Expand all parents
      parents.forEach((pId) => {
        if (!expandedItems.value.includes(pId)) expandedItems.value.push(pId)
      })
      found = true
    }
  }
  return found
}

// Check nested tabs payload creation
const updateNestedTabs = (path: string) => {
  if (!navbarCtx?.renderNestedTabs?.value) return

  // Find the top-level active parent
  const topLevelActive = props.items.find((item) => {
    // Exact match top
    if (activeItem.value === (item.id || item.label || item.to)) return true

    // Parent match
    const childFound = item.children?.some((child) => {
      return (
        activeItem.value === (child.id || child.label || child.to) ||
        (child.children &&
          child.children.some(
            (grandChild) =>
              activeItem.value === (grandChild.id || grandChild.label || grandChild.to)
          ))
      )
    })
    return childFound || isItemActive(item, path)
  })

  if (topLevelActive && topLevelActive.children) {
    const tabsForNav = topLevelActive.children.map((child) => ({
      label: child.label,
      labelI18n: child.labelI18n,
      value: child.id || (typeof child.to === 'string' ? child.to : null) || child.label,
      icon: child.icon,
      disabled: child.disabled,
      to: child.to,
      href: child.href,
    }))

    // Attempt to figure out which child tab is currently active
    let activeChildTab = tabsForNav[0].value
    if (activeItem.value) {
      // Is active item one of the children directly?
      const directMatch = tabsForNav.find((t) => t.value === activeItem.value)
      if (directMatch) {
        activeChildTab = directMatch.value
      } else {
        // Is the active item deeply nested? Let's check which child owns it
        const owningChild = topLevelActive.children.find((child) => {
          return child.children?.some(
            (grandChild) =>
              (grandChild.id || grandChild.label || grandChild.to) === activeItem.value
          )
        })
        if (owningChild) {
          activeChildTab =
            owningChild.id ||
            (typeof owningChild.to === 'string' ? owningChild.to : null) ||
            owningChild.label
        }
      }
    }

    navbarCtx.setNestedTabs(tabsForNav, activeChildTab)
  } else {
    // Reset if it's not a top-parent tab
    const isChild = props.items.some((i) =>
      i.children?.some((c) => (c.id || c.label || c.to) === activeItem.value)
    )
    if (!isChild) {
      navbarCtx.setNestedTabs([], '')
    }
  }
}

// Watch Route
watch(
  () => route?.path,
  (path) => {
    if (path) {
      syncWithRoute(props.items, path)
      updateNestedTabs(path)
    }
  },
  { immediate: true }
)

// Also watch items change to re-sync
watch(
  () => props.items,
  () => {
    if (route?.path) {
      syncWithRoute(props.items, route.path)
      updateNestedTabs(route.path)
    }
  },
  { deep: true }
)

// Watch active item change to push nested tabs when clicked directly
watch(
  () => activeItem.value,
  () => {
    // If layout tabs active, push the new context
    if (navbarCtx?.renderNestedTabs?.value) {
      updateNestedTabs(route?.path || '')
    }
  }
)

const toggleExpand = (id: string) => {
  const isExpanded = expandedItems.value.includes(id)

  if (isExpanded) {
    expandedItems.value = expandedItems.value.filter((item) => item !== id)
  } else {
    if (props.allowMultiple) {
      expandedItems.value.push(id)
    } else {
      expandedItems.value.push(id)
    }
  }
}

const setActive = (id: string | null) => {
  activeItem.value = id
}

// Provide context with type assertion to bypass strict generic literal check
const context = reactive({
  activeItem,
  expandedItems,
  toggleExpand,
  setActive,
  indentSize: computed(() => props.indentSize),
  variant: computed(() => props.variant),
  renderMode: computed(() => props.renderMode || 'tree'),
  renderNestedTabs: computed(() => !!navbarCtx?.renderNestedTabs?.value),
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
}) as unknown as SidebarMenuContext

provide('sidebar-menu-ctx', context)
</script>

<template>
  <nav
    class="flex flex-col space-y-0 w-full"
    :class="props.compact ? '' : 'space-y-1'"
    role="tree"
    aria-label="Sidebar Menu">
    <SidebarMenuItem
      v-for="item in items"
      :key="item.id || item.label"
      :item="item"
      :menuOffset="menuOffset" />
  </nav>
</template>
