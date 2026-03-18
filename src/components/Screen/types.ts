import type { Component } from 'vue'
import type { PageInfo, PaginationProps } from '../Pagination'
import { ButtonVariant } from '@/types'
import { IForm } from '../Form'
import type { ExportField } from '../ExportData/types'
import type { ImportField } from '../ImportData/types'
import { TabesVariant } from '../Tabes'

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

/**
 * A single quick-filter tab option.
 * `value` is what gets emitted in the refetch payload.
 * Use `value: ''` (or `value: 'all'`) for the "All" tab — it resets the quick filter.
 */
export interface ScreenQuickFilter {
  label: string
  labelI18n?: string
  value: string | number
  icon?: string
  /** Optional badge/count displayed next to the label */
  count?: number
}

export interface ScreenProps {
  name?: string
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  info?: string
  infoI18n?: string
  pageInfo?: PageInfo
  data?: any[]
  loading?: boolean
  /**
   * Called on every search, filter, pagination, sort, or quick-filter change.
   * Standard payload shape: { pagination, search, sort, filter }
   */
  refetch?: (payload: {
    pagination: { page: number; limit: number }
    search: string
    sort: Record<string, any>
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
  /** Generic properties for Export and Import capabilities */
  exportSchema?: ExportField[] | any[]
  importSchema?: ImportField[] | any[]
  exportProps?: Record<string, any> | boolean
  importProps?: Record<string, any> | boolean
  exportMode?: 'frontend' | 'backend'
  importType?: string
  exportType?: string
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
  viewProps?: Record<string, any>
  hideSelectable?: boolean
  /**
   * Quick-filter tabs rendered below the header (above the content).
   * Inspired by modern dashboards (Shopify, Linear, Vercel).
   * Example:
   * [
   * { label: 'All',       value: '' },
   * { label: 'Active',    value: 'active' },
   * { label: 'Draft',     value: 'draft' },
   * { label: 'Archived',  value: 'archived' },
   * ]
   */
  quickFilters?: ScreenQuickFilter[]
  /**
   * The key used to inject the active quick filter into the refetch filter payload.
   * Defaults to 'status'.
   */
  quickFilterKey?: string
  /**
   * Default selected quick-filter value. Defaults to the first tab's value.
   */
  defaultQuickFilter?: string | number
  quickFilterVariant?: TabesVariant
}
