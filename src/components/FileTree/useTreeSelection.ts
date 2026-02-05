import { computed, type Ref } from 'vue'
import type { FileNode } from './types'

interface UseTreeSelectionProps {
  data: Ref<FileNode[]>
  selectedKeys: Ref<Set<string>>
  selectionMode: Ref<'single' | 'multiple' | 'none'>
  emit: (event: 'update:modelValue' | 'select', ...args: any[]) => void
}

export function useTreeSelection({
  data,
  selectedKeys,
  selectionMode,
  emit,
}: UseTreeSelectionProps) {
  // Helper to find parent of a node (needed for verifying indeterminate state upwards)
  // Since we don't have back-pointers, we might need a map or traverse.
  // For performance on large trees, a flat map of ID -> ParentID is useful.
  // But let's start with traversal if needed, or assume we handle it via events propagating up/down?
  // Actually, standard approach:
  // 1. Flatten map for quick lookups?
  // 2. Or recursive "check all" down, and "verify all" up.

  // Let's implement a recursive toggle.

  const toggleSelection = (node: FileNode, selected: boolean) => {
    if (node.disabled) return

    const newSelected = new Set(selectedKeys.value)

    if (selectionMode.value === 'single') {
      newSelected.clear()
      if (selected) {
        newSelected.add(node.id)
      }
    } else if (selectionMode.value === 'multiple') {
      // Recursive selection
      const traverse = (n: FileNode, val: boolean) => {
        if (n.disabled) return
        if (val) newSelected.add(n.id)
        else newSelected.delete(n.id)

        if (n.children) {
          n.children.forEach((c) => traverse(c, val))
        }
      }
      traverse(node, selected)

      // We also need to re-verify parents (if a child is unchecked, parent must be unchecked)
      // This is tricky without parent pointers.
      // OPTION: We assume the parent component (FileTree) re-calculates or we use a helper to re-evaluate the whole tree state based on leaves?
      // "Selecting a folder should recursively select all nested files".
      // "Unselecting a child -> Parent unselected" is standard but not explicitly requested, but implies consistency.
      // Let's implement robust consistency in the main component or here if we have access to full tree.
      // We have `data` ref. We can rebuild consistency.
    }

    emit('update:modelValue', Array.from(newSelected))
    emit('select', node, selected)
  }

  return {
    toggleSelection,
  }
}
