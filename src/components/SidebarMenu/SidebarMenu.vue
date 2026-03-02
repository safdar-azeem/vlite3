<script setup lang="ts">
import { provide, ref, watch, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarMenuProps, SidebarMenuItemSchema, SidebarMenuContext } from './types'
import SidebarMenuItem from './SidebarMenuItem.vue'

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
    // Check if this item is the active one
    if (isItemActive(item, path)) {
      activeItem.value = id
      // Expand all parents
      parents.forEach((pId) => {
        if (!expandedItems.value.includes(pId)) expandedItems.value.push(pId)
      })
      found = true
    }

    // Recurse
    if (item.children) {
      const childFound = syncWithRoute(item.children, path, [...parents, id])
      if (childFound) {
        found = true
      }
    }
  }
  return found
}

// Watch Route
watch(
  () => route?.path,
  (path) => {
    if (path) syncWithRoute(props.items, path)
  },
  { immediate: true }
)

// Also watch items change to re-sync
watch(
  () => props.items,
  () => {
    if (route?.path) syncWithRoute(props.items, route.path)
  },
  { deep: true }
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
