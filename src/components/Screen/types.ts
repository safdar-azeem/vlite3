import type { Component } from 'vue'
import type { PageInfo, PaginationProps } from '../Pagination'
import { ButtonVariant } from '@/types'

export interface ScreenPaginationProps extends Omit<
  PaginationProps,
  'currentPage' | 'totalPages'
> {}

export interface AddBtnConfig {
  label?: string
  icon?: string
  variant?: ButtonVariant
  to?: string | Record<string, any>
  href?: string
  target?: string
  onClick?: () => void
  modal?: Component | any
  modalProps?: Record<string, any>
  buttonProps?: Record<string, any>
}

export interface ScreenProps {
  title?: string
  description?: string
  pageInfo?: PageInfo
  data?: any[]
  loading?: boolean
  refetch?: (payload: {
    pagination: { page: number; limit: number }
    filter: { search: string }
  }) => void
  paginationProps?: ScreenPaginationProps
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  addComponent?: Component | any
  addBtn?: AddBtnConfig
  list?: Component | any
  table?: Component | any
  customHeader?: boolean
  canSearch?: boolean
  canAdd?: boolean
  pagination?: boolean
}
