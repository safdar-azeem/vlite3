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
  sort: SortConfig
  filter: Record<string, any>
}

export interface FilterConfig {
  [key: string]: any
}

export interface TableFilter {
  pagination: PaginationConfig
  sort: SortConfig
  filter: FilterConfig
}

export interface TableHeader {
  field: string
  title: string
  titleI18n?: string
  /**
   * The key sent to the backend when sorting this column.
   * Defaults to `field` when not provided.
   * Use this when the display field differs from the database column name,
   * e.g. field: 'employee' (a custom slot) but sortKey: 'employeeName'.
   */
  sortKey?: string
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
  headers: TableHeader[]
  /**
   * Unique row identifier field.
   * 'auto' → picks first of ['id','_id'] found on first row, fallback '_id'.
   */
  keyField?: string
  loading?: boolean
  hideSelectable?: boolean
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
  headerVariant?: 'default' | 'minimal'
  size?: 'xs' | 'sm' | 'md' | 'lg'
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

/**
 * Shape provided by Screen to all deeply nested components via provide/inject.
 *
 * - disableSearch    → DataTable hides its own search toolbar (Screen owns search)
 * - forceSelectable  → DataTable enables row selection for bulk-delete
 * - onTableChange    → DataTable calls this whenever sort/pagination/search changes
 *                      so Screen can merge the state and call its own refetch.
 *                      Undefined when DataTable is used standalone (outside Screen).
 */
export interface ScreenContext {
  forceSelectable: boolean
  onTableChange?: (state: TableState) => void
}

export const SCREEN_CONTEXT_KEY = Symbol('screen-context')
