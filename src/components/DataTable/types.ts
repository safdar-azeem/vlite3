import { PageInfo, PaginationProps } from '../Pagination'
export type DataTablePaginationProps = Omit<PaginationProps, 'currentPage' | 'totalPages'>

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
  titleI18n?: string
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

export interface DataTableProps {
  rows: any[]
  selectedRows?: any[]
  search?: string
  showSearch?: boolean
  searchPlaceholder?: string
  searchPlaceholderI18n?: string
  toolbarClass?: string
  toolbarSearchClass?: string
  headers: TableHeader[]
  keyField?: string
  loading?: boolean
  selectable?: boolean
  emptyTitle?: string
  emptyTitleI18n?: string
  emptyDescription?: string
  emptyDescriptionI18n?: string
  emptyIcon?: string
  showPagination?: boolean
  paginationProps?: DataTablePaginationProps
  pageInfo?: PageInfo
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  tableClass?: string
  class?: string
  sortable?: boolean
  variant?: 'default' | 'raised'
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

