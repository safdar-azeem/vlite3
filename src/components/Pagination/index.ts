export { default as Pagination } from './Pagination.vue'

export interface PageInfo {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}

export type PaginationVariant = 'outline' | 'solid' | 'ghost'
export type PaginationRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'

export interface PaginationProps {
  currentPage?: number
  totalPages: number
  totalItems?: number
  disabled?: boolean
  showEdges?: boolean
  showPageInfo?: boolean // "Page 1 of 10"
  showItemsPerPage?: boolean
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  navType?: 'text' | 'icon'
  alignment?: 'start' | 'center' | 'end' | 'between'
  /** Visual style for the active page button. @default 'outline' */
  activeVariant?: PaginationVariant
  /** Border radius for page buttons. @default 'md' */
  rounded?: PaginationRounded
}
