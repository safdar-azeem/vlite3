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
  /**
   * When true, no items can be dragged INTO or OUT OF this column.
   * The column acts as a locked/read-only board.
   */
  disabled?: boolean
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
  /**
   * Predicate called for every item. When it returns true, that specific
   * item is locked in place and cannot be dragged to another column.
   * The item still renders normally; only its drag handle is suppressed.
   *
   * Example: :is-item-disabled="(item) => item.locked === true"
   */
  isItemDisabled?: (item: any) => boolean
}
