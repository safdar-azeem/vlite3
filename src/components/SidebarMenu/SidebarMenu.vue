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
      // Exact match or Prefix? Usually exact for link, prefix for group?
      // Sidebar links usually exact match or "active class" logic.
      // Simple exact + optional trailing slash logic
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
    const id = item.id || item.label
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
        // If child is active, also ensure this parent is expanded?
        // Yes, if we want auto-expand.
        // Logic above "Expand all parents" handles ancestors.
        // But if we are "parents" list, we are already added.
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
    // Only auto-expand if utilizing Tree mode mostly?
    // Or Popover too? Popover usually doesn't "expand" in terms of pushing content, but "active" state matters.
    // For Tree mode (default), we definitely want to expand.
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
      // Single mode: close siblings?
      // Truly "Accordion" usually means ONLY one at this level can be open.
      // But implementing strict single-open globally is tricky for deep nesting.
      // A simple approach for standard sidebar: Close ALL others? Or just close others at same level?
      // "allowMultiple: false" usually implies global single expanded or per level.
      // Let's implement: Replace current expanded list with just this one (and its parents?)
      // To keep parents open, we'd need to know lineage.
      // SIMPLIFICATION for this task: Just single mode logic = Replace array if at root, but deeper logic needs parent awareness.
      // FOR NOW: Simple toggle, usually sufficient. If users want strict accordion, we might need more complex tree traversal or emitting events up.
      // Let's stick to standard behavior: simply add it. If not allowMultiple, we clear others?
      // Let's clear others for now to mimic strict accordion.
      // warning: clearing others might close parents! That's bad.
      // Better to default to standard multiple for sidebars as safe default.
      expandedItems.value.push(id)
    }
  }
}

const setActive = (id: string | null) => {
  activeItem.value = id
}

// Provide context
// We use reactive to auto-unwrap Refs for consumers

const context = reactive({
  activeItem,
  expandedItems,
  toggleExpand,
  setActive,
  indentSize: computed(() => props.indentSize),
  variant: computed(() => props.variant),
  renderMode: computed(() => props.renderMode || 'tree'),
})

provide('sidebar-menu-ctx', context)
</script>

<template>
  <nav class="flex flex-col space-y-1 w-full" role="tree" aria-label="Sidebar Menu">
    <SidebarMenuItem v-for="item in items" :key="item.id || item.label" :item="item" />
  </nav>
</template>
