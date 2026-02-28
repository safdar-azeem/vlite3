export interface SearchMatch {
  path?: string // Optional context
  line_content: string
  line_number: number
  match_start: number
  match_length: number
}

export interface FileNode {
  id: string
  label: string
  labelI18n?: string
  isFolder?: boolean
  children?: FileNode[]
  icon?: string
  disabled?: boolean
  isLoaded?: boolean
  data?: any
  searchMatch?: SearchMatch
}

export type FileTreeSelectionMode = 'single' | 'multiple' | 'none'

export interface FileTreeProps {
  modelValue?: string[]
  data?: FileNode[]
  selectionMode?: FileTreeSelectionMode
  showCheckboxes?: boolean
  defaultExpandedKeys?: string[]
  loadData?: (node: FileNode) => Promise<FileNode[]>
  highlightSearch?: boolean
  searchQuery?: string
  class?: string
  emptyText?: string
  emptyTextI18n?: string
}

export interface FileTreeEvents {
  (e: 'update:modelValue', keys: string[]): void
  (e: 'select', node: FileNode, selected: boolean): void
  (e: 'expand', node: FileNode, expanded: boolean): void
  (e: 'node-click', node: FileNode): void
}

