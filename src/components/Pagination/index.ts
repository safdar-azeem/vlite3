export { default as Pagination } from './Pagination.vue'

export type PaginationVariant = 'outline' | 'solid' | 'ghost'
export type PaginationRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'

export interface PaginationProps {
  currentPage?: number
  totalPages: number
  totalItems?: number
  disabled?: boolean
  showEdges?: boolean
  showPageInfo?: boolean
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
