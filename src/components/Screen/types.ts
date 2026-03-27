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

/**
 * A named view definition for dynamic multi-view support.
 * Pass an array of these via the `views` prop to render any number of views
 * (table, list, kanban, calendar, etc.) with automatic toggle buttons.
 *
 * @example
 * :views="[
 * { key: 'table',    component: UserTable,    icon: 'lucide:list',         label: 'Table' },
 * { key: 'list',     component: UserList,     icon: 'lucide:layout-grid',  label: 'Grid' },
 * { key: 'kanban',   component: UserKanban,   icon: 'lucide:kanban',       label: 'Kanban' },
 * { key: 'calendar', component: UserCalendar, icon: 'lucide:calendar',     label: 'Calendar' },
 * ]"
 */
export interface ScreenView {
  /** Unique key used to identify and persist this view */
  key: string
  /** The Vue component to render for this view */
  component: Component | any
  /** Icon string (e.g. lucide icon name) shown in the view toggle button */
  icon?: string
  /** Tooltip / aria-label for the toggle button */
  label?: string
  /** i18n key for the label */
  labelI18n?: string
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
  /**
   * Legacy: single list component (list/grid view).
   * Prefer `views` prop for multi-view support.
   */
  list?: Component | any
  /**
   * Legacy: single table component.
   * Prefer `views` prop for multi-view support.
   */
  table?: Component | any
  /**
   * Dynamic multi-view definitions. When provided, replaces the legacy
   * `table` / `list` props and renders a toggle button for each view.
   * Supports any number of views: table, list, kanban, calendar, etc.
   *
   * The first entry becomes the default active view (unless persisted state exists).
   *
   * @example
   * :views="[
   * { key: 'table',    component: UserTable,    icon: 'lucide:list',        label: 'Table' },
   * { key: 'kanban',   component: UserKanban,   icon: 'lucide:kanban',      label: 'Kanban' },
   * { key: 'calendar', component: UserCalendar, icon: 'lucide:calendar',    label: 'Calendar' },
   * ]"
   */
  views?: ScreenView[]
  customHeader?: boolean
  canSearch?: boolean
  canAdd?: boolean
  pagination?: boolean
  filterSchema?: IForm[]
  filterType?: 'modal' | 'dropdown'
  showRefresh?: boolean
  containerClass?: string
  headerClass?: string
  titleClass?: string
  descriptionClass?: string
  viewProps?: Record<string, any>
  hideSelectable?: boolean
  hideDeleteBtn?: boolean
  /**
   * Quick-filter tabs rendered below the header (above the content).
   * Inspired by modern dashboards (Shopify, Linear, Vercel).
   */
  quickFilters?: ScreenQuickFilter[]
  /**
   * Optional array of view keys (e.g., ['table', 'list']) where quick filters should be visible.
   * If omitted, quick filters are shown on all views.
   */
  quickFilterViews?: string[]
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
