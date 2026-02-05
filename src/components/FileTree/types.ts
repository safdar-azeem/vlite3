export interface FileNode {
  id: string
  label: string
  isFolder?: boolean
  children?: FileNode[]
  disabled?: boolean
  icon?: string
  data?: any
  isLoaded?: boolean
}

export type FileTreeSelectionMode = 'single' | 'multiple' | 'none'

export interface FileTreeProps {
  data: FileNode[]
  modelValue?: string[]
  selectionMode?: FileTreeSelectionMode
  showCheckboxes?: boolean
  defaultExpandedKeys?: string[]
  loadData?: (node: FileNode) => Promise<FileNode[]>
  searchQuery?: string
  highlightSearch?: boolean
  class?: string
}

export interface FileTreeEvents {
  (e: 'update:modelValue', value: string[]): void
  (e: 'select', node: FileNode, selected: boolean): void
  (e: 'expand', node: FileNode, expanded: boolean): void
  (e: 'node-click', node: FileNode): void
}
