import type { Component } from 'vue'
import type { PageInfo, PaginationProps } from '../Pagination'
import { ButtonVariant } from '@/types'
import { IForm } from '../Form'

export interface ScreenPaginationProps extends Omit<
  PaginationProps,
  'currentPage' | 'totalPages'
> {}

export interface AddBtnConfig {
  label?: string
  labelI18n?: string
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
  name?: string
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  pageInfo?: PageInfo
  data?: any[]
  loading?: boolean
  refetch?: (payload: {
    pageinfo: { page: number; limit: number }
    pagination: { page: number; limit: number }
    search: string
    filter: Record<string, any>
  }) => void
  paginationProps?: ScreenPaginationProps
  emptyTitle?: string
  emptyTitleI18n?: string
  emptyDescription?: string
  emptyDescriptionI18n?: string
  emptyIcon?: string
  addComponent?: Component | any
  addBtn?: AddBtnConfig
  list?: Component | any
  table?: Component | any
  customHeader?: boolean
  canSearch?: boolean
  canAdd?: boolean
  pagination?: boolean
  filterSchema?: IForm[]
  filterType?: 'modal' | 'dropdown'
  showRefresh?: boolean
  containerClass?: string
  headerClass?: string
}

