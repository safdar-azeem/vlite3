<script setup lang="ts">
import { ref, watch, computed, toRaw } from 'vue'
import type { FileNode, FileTreeProps, FileTreeEvents } from './types'
import FileTreeNode from './FileTreeNode.vue'
// Removed unused uuid import

const props = withDefaults(defineProps<FileTreeProps>(), {
  modelValue: () => [],
  data: () => [],
  selectionMode: 'single',
  showCheckboxes: false,
  defaultExpandedKeys: () => [],
  highlightSearch: true,
})

const emit = defineEmits<FileTreeEvents>()

// State
const expandedKeys = ref(new Set<string>(props.defaultExpandedKeys))
const loadingKeys = ref(new Set<string>())
// We maintain local indeterminate logic manually or derive it.
// Deriving Indeterminate State:
// We need a map of Parent -> Children.
// If 'multiple' mode and checkboxes:
// Indeterminate = Some but not all children selected.
// This requires traversing the entire tree or having a flat map.
// To support "Efficient performance", we should flatten the tree map once on data change.

// Helper: Flatten Tree & Map Parents
const nodeMap = ref(new Map<string, FileNode>())
const parentMap = ref(new Map<string, string>())

const buildMaps = (nodes: FileNode[], parentId?: string) => {
  for (const node of nodes) {
    nodeMap.value.set(node.id, node)
    if (parentId) parentMap.value.set(node.id, parentId)
    if (node.children) {
      buildMaps(node.children, node.id)
    }
  }
}

watch(
  () => props.data,
  (newData) => {
    nodeMap.value.clear()
    parentMap.value.clear()
    buildMaps(newData)
  },
  { immediate: true, deep: true }
)

// Helper: Get All Descendants IDs
const getDescendants = (node: FileNode): string[] => {
  let ids: string[] = []
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id)
      ids = ids.concat(getDescendants(child))
    }
  }
  return ids
}

// Selection State
const selectedKeys = computed(() => new Set(props.modelValue))

// Indeterminate State Calculation
const indeterminateKeys = computed(() => {
  const indeterminate = new Set<string>()
  if (props.selectionMode !== 'multiple') return indeterminate

  // Bottom-up traversal or check every folder?
  // Check every folder in nodeMap?
  // Optimized: We can assume if we are strictly managing state, we might know.
  // But let's verify.

  // We iterate all nodes where isFolder is true
  nodeMap.value.forEach((node) => {
    if ((node.isFolder || (node.children && node.children.length)) && node.children) {
      const allChildrenCount = node.children.length
      if (allChildrenCount === 0) return

      let selectedCount = 0
      let indeterminateCount = 0

      // Shallow check of direct children is enough IF we propagate correctly?
      // No, usually 'indeterminate' implies ANY descendant is selected but not all.
      // Standard definition:
      // Checked: All descendants checked.
      // Indeterminate: Some descendants checked (or some indeterminate).
      // Unchecked: No descendants checked.

      // Let's rely on a recursive helper that might be heavy?
      // For large trees, this computed might be slow.
      // Better: Update indeterminate set during selection mutation.
      // BUT `modelValue` is a prop we don't own. We strictly react to it.
      // So we MUST compute it from `modelValue`.

      // Optimization:
      // Recursive check logic is unavoidable if we only have the list of selected IDs.
    }
  })

  // Re-approach: Traverse bottom-up?
  // Since we have parentMap, we can just look at leaves? No.

  // Let's do a standard recursive check from Root.
  const traverse = (node: FileNode): { status: 'checked' | 'unchecked' | 'indeterminate' } => {
    if (!node.children || node.children.length === 0) {
      return selectedKeys.value.has(node.id) ? { status: 'checked' } : { status: 'unchecked' }
    }

    let hasChecked = false
    let hasUnchecked = false
    let hasIndeterminate = false

    for (const child of node.children) {
      const res = traverse(child)
      if (res.status === 'checked') hasChecked = true
      if (res.status === 'unchecked') hasUnchecked = true
      if (res.status === 'indeterminate') hasIndeterminate = true
    }

    if (hasIndeterminate || (hasChecked && hasUnchecked)) {
      indeterminate.add(node.id)
      return { status: 'indeterminate' }
    }

    if (hasChecked) return { status: 'checked' }
    return { status: 'unchecked' }
  }

  props.data.forEach(traverse)

  return indeterminate
})

// Handlers
const handleToggleExpand = async (node: FileNode) => {
  if (node.disabled) return

  const isExpanded = expandedKeys.value.has(node.id)

  if (isExpanded) {
    // Collapse: Recursive close
    expandedKeys.value.delete(node.id)

    // Find all descendants and remove them from expandedKeys
    // We use the original node from map to get full hierarchy
    const originalNode = nodeMap.value.get(node.id) || node
    const descendants = getDescendants(originalNode)
    descendants.forEach((id) => expandedKeys.value.delete(id))

    emit('expand', node, false)
  } else {
    // Expand
    expandedKeys.value.add(node.id)
    emit('expand', node, true)

    // Async Load
    if (props.loadData && !node.isLoaded && (!node.children || node.children.length === 0)) {
      loadingKeys.value.add(node.id)
      try {
        await props.loadData(node)
      } finally {
        loadingKeys.value.delete(node.id)
      }
    }
  }
}

const handleToggleSelect = (node: FileNode) => {
  if (node.disabled) return

  // Use original node from map to ensure we have all children, not just filtered ones
  const originalNode = nodeMap.value.get(node.id) || node

  let newSelected = new Set(selectedKeys.value)
  const isCurrentlySelected = newSelected.has(node.id)

  if (props.selectionMode === 'single') {
    newSelected.clear()
    if (!isCurrentlySelected) {
      newSelected.add(node.id)
    }
  } else if (props.selectionMode === 'multiple') {
    // Recursive Logic using original structure
    const descendants = getDescendants(originalNode)
    const targetState = !isCurrentlySelected // Toggle

    const updateSet = (id: string, add: boolean) => {
      if (add) newSelected.add(id)
      else newSelected.delete(id)
    }

    // 1. Update Node and All Descendants
    updateSet(node.id, targetState)
    descendants.forEach((id) => updateSet(id, targetState))

    // 2. Update Ancestors (Bubble Up)
    let curr = originalNode
    while (true) {
      const parentId = parentMap.value.get(curr.id)
      if (!parentId) break

      const parent = nodeMap.value.get(parentId)
      if (!parent) break

      // Check all children of parent
      if (!parent.children) break

      const allSiblingsSelected = parent.children.every((child) => newSelected.has(child.id))

      if (allSiblingsSelected) {
        newSelected.add(parent.id)
      } else {
        newSelected.delete(parent.id)
      }

      curr = parent
    }
  }

  emit('update:modelValue', Array.from(newSelected))
  emit('select', originalNode, !isCurrentlySelected)
}

// Search Filtering
// We don't mutate `data` prop. We filter visibly?
// If we use v-show on nodes, we need to pass `searchQuery` down.
// BUT `FileTreeNode` handles visibility?
// Better: We compute a filtered tree or set of "Visible IDs".
// And we Auto-Expand.

const filteredData = computed(() => {
  // If no search, return match
  // Actually, passing data as-is and letting nodes decide highlight is one thing,
  // but filtering (hiding non-matches) implies structure change.
  // "The tree should automatically expand folders that contain matching results"

  if (!props.searchQuery) return props.data

  // Return same structure?
  // We usually want to show the path to the match.
  // We can just rely on `v-show` if we pass a "isVisible" prop?
  // Or we create a filtered clone? Clone is safer for render loops.

  // Let's do a filter+clone.
  const query = props.searchQuery.toLowerCase()

  const filterNode = (node: FileNode): FileNode | null => {
    const match = node.label.toLowerCase().includes(query)
    let filteredChildren: FileNode[] = []

    if (node.children) {
      filteredChildren = node.children.map(filterNode).filter((n) => n !== null) as FileNode[]
    }

    if (match || filteredChildren.length > 0) {
      // Return clone properties + filtered children
      return {
        ...node,
        children: filteredChildren,
      }
    }

    return null
  }

  return props.data.map(filterNode).filter((n) => n !== null) as FileNode[]
})

// Auto Expand on Search
watch(
  () => props.searchQuery,
  (newVal) => {
    if (newVal) {
      const query = newVal.toLowerCase()
      const toExpand = new Set<string>()

      const visit = (node: FileNode): boolean => {
        let childMatch = false
        if (node.children) {
          for (const child of node.children) {
            if (visit(child)) childMatch = true
          }
        }

        const selfMatch = node.label.toLowerCase().includes(query)

        if (childMatch) {
          toExpand.add(node.id)
        }

        return selfMatch || childMatch
      }

      props.data.forEach(visit)

      // Merge with existing expanded
      toExpand.forEach((id) => expandedKeys.value.add(id))
    }
  }
)
</script>

<template>
  <div :class="['w-full h-full overflow-y-auto', props.class]">
    <!-- Debug Info (Temporary) -->
    <!-- <div class="text-xs text-red-500 border-b p-1">
      Data Len: {{ data.length }} | Filtered: {{ filteredData.length }} | Search: "{{ searchQuery }}"
    </div> -->

    <template v-if="filteredData.length > 0">
      <FileTreeNode
        v-for="node in filteredData"
        :key="node.id"
        :node="node"
        :selection-mode="selectionMode"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        :indeterminate-keys="indeterminateKeys"
        :loading-keys="loadingKeys"
        :show-checkboxes="showCheckboxes"
        :highlight-search="highlightSearch"
        :search-query="searchQuery"
        @toggle-expand="handleToggleExpand"
        @toggle-select="handleToggleSelect"
        @click-node="(n) => emit('node-click', n)" />
    </template>
    <div v-else class="text-sm text-muted-foreground p-4 text-center">No results found.</div>
  </div>
</template>
