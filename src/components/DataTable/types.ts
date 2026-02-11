export interface PaginationConfig {
  page: number
  limit: number
}

export interface SortConfig {
  field: string
  order: 'asc' | 'desc' | ''
}

export interface TableState {
  pagination: PaginationConfig
  sorting: SortConfig
  search: string
}

export interface FilterConfig {
  search: string
  sorting: SortConfig
  [key: string]: any
}

export interface TableFilter {
  pagination: PaginationConfig
  filter: FilterConfig
}

export interface TableHeader {
  field: string
  title: string
  width?: string
  minWidth?: string
  sortable?: boolean
  hideOnMobile?: boolean
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row?: any) => string
  class?: string | ((value: any, row?: any) => string)
  capitalize?: boolean
  addStatusColor?: boolean
  type?: 'text' | 'price' | 'date' | 'number'
}

export interface PageInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage?: number
}

export interface DataTableProps {
  rows: any[]
  selectedRows?: any[]
  // Toolbar Props
  search?: string
  showSearch?: boolean
  searchPlaceholder?: string
  headers: TableHeader[]
  keyField?: string
  loading?: boolean
  selectable?: boolean
  emptyMessage?: string
  emptyIcon?: string
  showPagination?: boolean
  pageInfo?: PageInfo
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  tableClass?: string
  class?: string
  sortable?: boolean
}

export interface SelectionState {
  selected: any[]
  all: boolean
  indeterminate: boolean
}

export interface RowClickPayload {
  row: any
  index: number
}
