import { PageInfo, PaginationProps } from '../Pagination'

// create a new pageInfo type and Omit the currentPage and totalPages
export type DataListMetaInfo = Omit<PaginationProps, 'currentPage' | 'totalPages'>

export interface DataListProps {
  data?: any[]
  loading?: boolean
  pageInfo?: PageInfo
  className?: string
  item?: any
  skeleton?: any
  skelton?: any // Alias to support requested prop spelling
  itemProps?: Record<string, any>
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  showPagination?: boolean
  paginationProps?: DataListMetaInfo
  delete?: (items: any[]) => void // Injected delete function prop from Screen
}
