export { default as Pagination } from './Pagination.vue'

export interface PageInfo {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}

export interface PaginationProps {
  currentPage?: number
  totalPages: number
  totalItems?: number
  disabled?: boolean
  showEdges?: boolean
  // New Feature Props
  showPageInfo?: boolean // "Page 1 of 10"
  showItemsPerPage?: boolean // "Show 10"
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  navType?: 'text' | 'icon' // Default 'text' (responsive) vs 'icon' (always arrows)
  alignment?: 'start' | 'center' | 'end' | 'between'
}
