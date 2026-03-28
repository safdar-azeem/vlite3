export interface KanbanPageInfo {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface KanbanLoadDataResult<T = any> {
  items: T[]
  pageInfo: KanbanPageInfo
}

export interface KanbanColumn {
  id: string | number
  title: string
  titleI18n?: string
  [key: string]: any
}

/**
 * KanbanChangeEvent represents the low-level DnD events
 */
export interface KanbanChangeEvent {
  type: 'add' | 'remove' | 'update'
  event: any
  columnId: any
}

/**
 * KanbanMoveEvent represents a consolidated high-level move
 * standard for production API updates.
 */
export interface KanbanMoveEvent {
  itemId: any
  item: any
  fromColumnId: any
  toColumnId: any
  oldIndex: number
  newIndex: number
}

export interface KanbanProps {
  columns: KanbanColumn[]
  group?: string
  itemKey?: string
  loadData?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>
  data?: Record<string | number, any[]>
  rawData?: any[] // Support for flat array data source
  groupKey?: string // Key to group rawData by (e.g., 'status', 'stage')
  positionKey?: string // Key to determine item index (e.g., 'position')
  boardClass?: string
  headerClass?: string
  bodyClass?: string
  draggableClass?: string
  ghostClass?: string
  class?: string
}
