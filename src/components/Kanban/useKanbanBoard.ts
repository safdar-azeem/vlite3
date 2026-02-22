import { ref, reactive } from 'vue'
import type { KanbanPageInfo, KanbanLoadDataResult } from './types'

export function useKanbanBoard(
  columnId: string | number,
  loadDataFn?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>,
  initialData?: any[]
) {
  const items = ref<any[]>(initialData ? [...initialData] : [])

  const isInitialLoading = ref(false)
  const isLoadingMore = ref(false)
  
  const pageInfo = reactive<KanbanPageInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: initialData ? initialData.length : 0
  })

  const loadInitial = async () => {
    if (!loadDataFn) return
    isInitialLoading.value = true
    try {
      const res = await loadDataFn(columnId, 1)
      items.value = res.items
      pageInfo.currentPage = res.pageInfo.currentPage
      pageInfo.totalPages = res.pageInfo.totalPages
      pageInfo.totalItems = res.pageInfo.totalItems
    } catch (e) {
      console.error(e)
    } finally {
      isInitialLoading.value = false
    }
  }

  const loadMore = async () => {
    if (!loadDataFn || isInitialLoading.value || isLoadingMore.value) return
    if (pageInfo.currentPage >= pageInfo.totalPages) return

    isLoadingMore.value = true
    try {
      const res = await loadDataFn(columnId, pageInfo.currentPage + 1)
      items.value = [...items.value, ...res.items]
      pageInfo.currentPage = res.pageInfo.currentPage
      pageInfo.totalPages = res.pageInfo.totalPages
      pageInfo.totalItems = res.pageInfo.totalItems
    } catch (e) {
      console.error(e)
    } finally {
      isLoadingMore.value = false
    }
  }

  return {
    items,
    isInitialLoading,
    isLoadingMore,
    pageInfo,
    loadInitial,
    loadMore
  }
}
