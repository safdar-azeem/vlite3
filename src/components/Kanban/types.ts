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
  [key: string]: any
}

export interface KanbanChangeEvent {
  type: 'add' | 'remove' | 'update'
  event: any
  columnId: string | number
}

export interface KanbanProps {
  columns: KanbanColumn[]
  group?: string
  itemKey?: string
  loadData?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>
  data?: Record<string | number, any[]>
  boardClass?: string
  ghostClass?: string
  class?: string
}
