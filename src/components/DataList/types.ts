export interface DataListPageInfo {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}

export interface DataListProps {
  data?: any[]
  loading?: boolean
  pageInfo?: DataListPageInfo
  className?: string
  item?: any
  skeleton?: any
  skelton?: any // Alias to support requested prop spelling
  itemProps?: Record<string, any>
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  showPagination?: boolean
  paginationPosition?: 'start' | 'center' | 'end' | 'between'
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
}
