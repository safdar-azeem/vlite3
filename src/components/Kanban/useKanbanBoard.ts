import { ref, reactive } from 'vue'
import type { KanbanPageInfo, KanbanLoadDataResult } from './types'

export function useKanbanBoard(
  columnId: string | number,
  loadDataFn?: (columnId: string | number, page: number) => Promise<KanbanLoadDataResult>,
  initialData?: any[]
) {
  // Use a standard ref instead of a computed to prevent DOM re-render conflicts with Sortable.js
  const items = ref<any[]>(initialData ? [...initialData] : [])

  const isLoading = ref(false)
  const pageInfo = reactive<KanbanPageInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: initialData ? initialData.length : 0
  })

  const loadInitial = async () => {
    if (!loadDataFn) return
    isLoading.value = true
    try {
      const res = await loadDataFn(columnId, 1)
      items.value = res.items
      pageInfo.currentPage = res.pageInfo.currentPage
      pageInfo.totalPages = res.pageInfo.totalPages
      pageInfo.totalItems = res.pageInfo.totalItems
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = async () => {
    if (!loadDataFn || isLoading.value) return
    if (pageInfo.currentPage >= pageInfo.totalPages) return

    isLoading.value = true
    try {
      const res = await loadDataFn(columnId, pageInfo.currentPage + 1)
      items.value = [...items.value, ...res.items]
      pageInfo.currentPage = res.pageInfo.currentPage
      pageInfo.totalPages = res.pageInfo.totalPages
      pageInfo.totalItems = res.pageInfo.totalItems
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    pageInfo,
    loadInitial,
    loadMore
  }
}
