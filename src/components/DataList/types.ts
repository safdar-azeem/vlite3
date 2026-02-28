import { PageInfo, PaginationProps } from '../Pagination'

export type DataListMetaInfo = Omit<PaginationProps, 'currentPage' | 'totalPages'>

export interface DataListProps {
  data?: any[]
  loading?: boolean
  pageInfo?: PageInfo
  className?: string
  item?: any
  skeleton?: any
  skelton?: any
  itemProps?: Record<string, any>
  emptyTitle?: string
  emptyTitleI18n?: string
  emptyDescription?: string
  emptyDescriptionI18n?: string
  emptyIcon?: string
  showPagination?: boolean
  paginationProps?: DataListMetaInfo
  delete?: (items: any[]) => void
}

