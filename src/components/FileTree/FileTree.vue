<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FileNode, FileTreeProps, FileTreeEvents } from './types'
import FileTreeNode from './FileTreeNode.vue'

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
const nodeMap = ref(new Map<string, FileNode>())
const parentMap = ref(new Map<string, string>())

// --- Map Builder ---
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

// --- Helpers ---
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

// --- Selection State ---
const selectedKeys = computed(() => new Set(props.modelValue))

// --- Indeterminate State ---
const indeterminateKeys = computed(() => {
  const indeterminate = new Set<string>()
  if (props.selectionMode !== 'multiple') return indeterminate

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

// --- Handlers ---
const handleToggleExpand = async (node: FileNode) => {
  if (node.disabled) return

  const isExpanded = expandedKeys.value.has(node.id)

  if (isExpanded) {
    // Collapse
    expandedKeys.value.delete(node.id)
    const originalNode = nodeMap.value.get(node.id) || node
    const descendants = getDescendants(originalNode)
    descendants.forEach((id) => expandedKeys.value.delete(id))
    emit('expand', node, false)
  } else {
    // Expand
    expandedKeys.value.add(node.id)
    emit('expand', node, true)

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

  const originalNode = nodeMap.value.get(node.id) || node
  let newSelected = new Set(selectedKeys.value)
  const isCurrentlySelected = newSelected.has(node.id)

  if (props.selectionMode === 'single') {
    newSelected.clear()
    if (!isCurrentlySelected) {
      newSelected.add(node.id)
    }
  } else if (props.selectionMode === 'multiple') {
    const descendants = getDescendants(originalNode)
    const targetState = !isCurrentlySelected

    const updateSet = (id: string, add: boolean) => {
      if (add) newSelected.add(id)
      else newSelected.delete(id)
    }

    updateSet(node.id, targetState)
    descendants.forEach((id) => updateSet(id, targetState))

    // Bubble up to update ancestors
    let curr = originalNode
    while (true) {
      const parentId = parentMap.value.get(curr.id)
      if (!parentId) break

      const parent = nodeMap.value.get(parentId)
      if (!parent) break

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

// --- Search Filtering ---
const filteredData = computed(() => {
  // Pass through if no query, OR if nodes already have matches attached (externally handled).
  // If `searchQuery` is provided, we filter.
  // Note: content search matches are usually provided in `data` by parent.
  // If `node.searchMatch` exists, we include it regardless of label match.
  
  if (!props.searchQuery) return props.data

  const query = props.searchQuery.toLowerCase()

  const filterNode = (node: FileNode): FileNode | null => {
    // Match by Name
    const nameMatch = node.label.toLowerCase().includes(query)
    
    // Match by Content (pre-populated)
    const contentMatch = !!node.searchMatch

    let filteredChildren: FileNode[] = []

    if (node.children) {
      filteredChildren = node.children.map(filterNode).filter((n) => n !== null) as FileNode[]
    }

    if (nameMatch || contentMatch || filteredChildren.length > 0) {
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
  () => [props.searchQuery, props.data],
  ([newQuery]) => {
    if (newQuery) {
      const query = (newQuery as string).toLowerCase()
      const toExpand = new Set<string>()

      const visit = (node: FileNode): boolean => {
        let childMatch = false
        if (node.children) {
          for (const child of node.children) {
            if (visit(child)) childMatch = true
          }
        }

        const selfMatch = node.label.toLowerCase().includes(query) || !!node.searchMatch

        if (childMatch) {
          toExpand.add(node.id)
        }

        return selfMatch || childMatch
      }

      props.data.forEach(visit)
      toExpand.forEach((id) => expandedKeys.value.add(id))
    }
  },
  { deep: true }
)
</script>

<template>
  <div :class="['w-full h-full overflow-y-auto', props.class]">
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
        @click-node="(n) => emit('node-click', n)"
      />
    </template>
    <div v-else class="text-sm text-muted-foreground p-4 text-center">No results found.</div>
  </div>
</template>
