import type { Component } from 'vue'
import type { PageInfo, PaginationProps } from '../Pagination'

export interface ScreenPaginationProps extends Omit<PaginationProps, 'currentPage' | 'totalPages'> {}

export interface ScreenProps {
  title?: string
  description?: string
  pageInfo?: PageInfo
  data?: any[]
  loading?: boolean
  refetch?: (payload: { pagination: { page: number; limit: number }; filter: { search: string } }) => void
  paginationProps?: ScreenPaginationProps
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  addComponent?: Component | any
  list?: Component | any
  table?: Component | any
  customHeader?: boolean
  canSearch?: boolean
  canAdd?: boolean
  pagination?: boolean
}
