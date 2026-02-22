<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Icon from '../Icon.vue'
import CheckBox from '../CheckBox.vue'
import Button from '../Button.vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { Pagination } from '../Pagination'
import DataTableHeader from './DataTableHeader.vue'
import DataTableRow from './DataTableRow.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import type {
  SortConfig,
  DataTableProps,
  SelectionState,
  RowClickPayload,
  TableState,
} from './types'

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const getRowId = (row: any, keyField: string): any => {
  return getNestedValue(row, keyField)
}

const props = withDefaults(defineProps<DataTableProps>(), {
  rows: () => [],
  selectedRows: () => [],
  search: '',
  showSearch: true,
  searchPlaceholder: 'Search...',
  headers: () => [],
  keyField: '_id',
  loading: false,
  selectable: false,
  emptyTitle: 'No data available',
  emptyDescription: 'No results found. Try adjusting your filters or search terms.',
  emptyIcon: 'lucide:inbox',
  showPagination: true,
  itemsPerPage: 10,
  itemsPerPageOptions: () => [10, 25, 50, 100],
  showItemsPerPage: true,
  striped: false,
  hoverable: true,
  bordered: true,
  compact: false,
  sortable: false,
  variant: 'default',
})

const emit = defineEmits<{
  (e: 'change', state: TableState): void
  (e: 'select', state: SelectionState): void
  (e: 'rowClick', payload: RowClickPayload): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:selectedRows', value: any[]): void
  (e: 'delete', rows: any[]): void
}>()

const sortConfig = ref<SortConfig>({ field: '', order: '' })
const internalItemsPerPage = ref(props.itemsPerPage)
const currentPage = ref(props.pageInfo?.currentPage || 1)
const internalSearch = ref(props.search || '')
const showDeleteConfirmation = ref(false)

const loadingCause = ref<'initial' | 'page' | 'search' | 'sort' | 'limit' | 'idle'>('initial')

const shouldShowSkeleton = computed(() => {
  return props.loading && (loadingCause.value === 'initial' || loadingCause.value === 'page')
})

watch(
  () => props.loading,
  (newVal, oldVal) => {
    if (!newVal && oldVal) {
      loadingCause.value = 'idle'
    }
  }
)

watch(
  () => props.search,
  (newVal) => {
    if (newVal !== undefined && newVal !== internalSearch.value) {
      internalSearch.value = newVal
    }
  }
)

// Debounce search emit
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(internalSearch, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadingCause.value = 'search'
    emitChange()
  }, 300)
})

watch(
  () => props.itemsPerPage,
  (newVal) => {
    internalItemsPerPage.value = newVal
  }
)

watch(
  () => props.pageInfo?.currentPage,
  (newVal) => {
    if (newVal) currentPage.value = newVal
  }
)

const getRowIdForTemplate = (row: any) => getRowId(row, props.keyField)

// Initialize selectedIds from props.selectedRows
const selectedIds = ref<Set<any>>(new Set())

watch(
  () => props.selectedRows,
  (newVal) => {
    const newIds = new Set((newVal || []).map((row) => getRowId(row, props.keyField)))
    // Only update if different to avoid infinite loops if parent mutates array reference
    if (
      newIds.size !== selectedIds.value.size ||
      [...newIds].some((id) => !selectedIds.value.has(id))
    ) {
      selectedIds.value = newIds
    }
  },
  { immediate: true, deep: true }
)

const isAllSelected = computed(() => {
  if (props.rows.length === 0) return false
  return props.rows.every((row) => selectedIds.value.has(getRowId(row, props.keyField)))
})

const isIndeterminate = computed(() => {
  return selectedIds.value.size > 0 && !isAllSelected.value
})

const selectedRowsComputed = computed(() => {
  const allAvailable = [...(props.selectedRows || []), ...props.rows]
  const map = new Map()
  allAvailable.forEach((r) => map.set(getRowId(r, props.keyField), r))

  return Array.from(selectedIds.value)
    .map((id) => map.get(id))
    .filter(Boolean)
})

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    props.rows.forEach((row) => selectedIds.value.add(getRowId(row, props.keyField)))
  } else {
    if (selectedIds.value.size > 0) {
      // Remove currently visible rows
      props.rows.forEach((row) => selectedIds.value.delete(getRowId(row, props.keyField)))
    }
  }
  emitSelection()
}

const toggleRowSelection = (id: any) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  emitSelection()
}

const emitSelection = () => {
  const currentSelected = props.selectedRows || []
  const seenIds = new Set<any>()
  const newSelected: any[] = []

  // Add rows that are currently selected and visible
  props.rows.forEach((row) => {
    const id = getRowId(row, props.keyField)
    if (selectedIds.value.has(id)) {
      newSelected.push(row)
      seenIds.add(id)
    }
  })

  // Add rows that were previously selected but not currently visible (preserve them)
  currentSelected.forEach((row) => {
    const id = getRowId(row, props.keyField)
    if (!seenIds.has(id) && selectedIds.value.has(id)) {
      newSelected.push(row)
      seenIds.add(id)
    }
  })

  const emitState: SelectionState = {
    selected: newSelected,
    all: isAllSelected.value,
    indeterminate: isIndeterminate.value,
  }

  emit('select', emitState)
  emit('update:selectedRows', newSelected)
}

const handleSort = (field: string) => {
  if (sortConfig.value.field === field) {
    if (sortConfig.value.order === 'asc') {
      sortConfig.value.order = 'desc'
    } else if (sortConfig.value.order === 'desc') {
      sortConfig.value.order = ''
      sortConfig.value.field = ''
    } else {
      sortConfig.value.order = 'asc'
    }
  } else {
    sortConfig.value.field = field
    sortConfig.value.order = 'asc'
  }
  currentPage.value = 1
  loadingCause.value = 'sort'
  emitChange()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadingCause.value = 'page'
  emitChange()
}

const handleItemsPerPageChange = (value: number) => {
  internalItemsPerPage.value = value
  currentPage.value = 1
  loadingCause.value = 'limit'
  emit('update:itemsPerPage', value)
  emitChange()
}

const handleRowClick = (payload: RowClickPayload) => {
  emit('rowClick', payload)
}

const onDeleteConfirm = () => {
  const rows = selectedRowsComputed.value
  emit('delete', rows)
  showDeleteConfirmation.value = false
}

const emitChange = () => {
  emit('change', {
    pagination: {
      page: currentPage.value,
      limit: internalItemsPerPage.value,
    },
    sorting: { ...sortConfig.value },
    search: internalSearch.value,
  })
}

const containerClass = computed(() => {
  const isRaised = props.variant === 'raised'
  return [
    'w-full flex flex-col',
    isRaised ? 'bg-background shadow-sm p-2 rounded-lg' : 'bg-background rounded',
    'overflow-hidden',
    props.bordered ? 'border border-border/60' : '',
    props.class,
  ].join(' ')
})

const tableClass = computed(() => {
  return ['w-full caption-bottom text-sm', props.tableClass].join(' ')
})

const getColumnWidth = (header: any) => {
  if (header.width) {
    return header.width
  }
  return 'auto'
}

watch(
  () => props.rows,
  () => {
    const validIds = new Set(props.rows.map((row) => getRowId(row, props.keyField)))
    selectedIds.value = new Set([...selectedIds.value].filter((id) => validIds.has(id)))
  }
)

onMounted(() => {
  emitChange()
})
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar
      v-model="internalSearch"
      :show-search="showSearch"
      :placeholder="searchPlaceholder">
      <template #left v-if="$slots?.['toolbar-left']">
        <slot name="toolbar-left" />
      </template>
      <template #right v-if="$slots?.['toolbar-right'] || selectedIds.size > 0">
        <Button
          v-if="selectedIds.size > 0"
          rounded="full"
          variant="ghost"
          icon="lucide:trash-2"
          class="text-destructive! bg-destructive/10 hover:bg-destructive/15"
          @click="showDeleteConfirmation = true">
        </Button>
        <slot name="toolbar-right" />
      </template>
    </DataTableToolbar>

    <div :class="containerClass">
      <div class="overflow-x-auto w-full">
        <table :class="tableClass" class="data-table">
          <thead
            :class="[
              '[&_tr]:border-b [&_tr]:border-border/70! bg-muted',
              variant === 'raised'
                ? '[&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg'
                : '',
            ]">
            <tr class="hover:bg-transparent">
              <th
                v-if="selectable"
                scope="col"
                class="w-[48px] px-0 text-center font-medium text-muted-foreground"
                style="width: 48px">
                <div class="flex items-center justify-center">
                  <CheckBox
                    :model-value="isAllSelected"
                    :indeterminate="isIndeterminate"
                    size="xs"
                    @update:model-value="toggleSelectAll" />
                </div>
              </th>

              <DataTableHeader
                v-for="header in headers"
                :key="header.field"
                :header="header"
                :sort-config="sortConfig"
                :compact="compact"
                :table-sortable="sortable"
                @sort="handleSort"
                class="last:pr-5!"
                :style="{
                  width: getColumnWidth(header),
                }" />
            </tr>
          </thead>

          <tbody class="[&_tr:last-child]:border-0">
            <template v-if="shouldShowSkeleton">
              <tr
                v-for="i in Math.min(internalItemsPerPage, 15)"
                :key="'skeleton-' + i"
                class="border-b border-border/50 bg-background transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td
                  v-if="selectable"
                  class="w-[48px] px-0 py-4 align-middle text-center"
                  style="width: 48px">
                  <div class="flex items-center justify-center">
                    <div class="h-4 w-4 rounded-[4px] bg-muted/50 animate-pulse" />
                  </div>
                </td>
                <td
                  v-for="header in headers"
                  :key="header.field"
                  class="p-5! align-middle last:pr-6!"
                  :class="[header.hideOnMobile ? 'hidden md:table-cell' : '']">
                  <div
                    class="rounded-md bg-muted/50 animate-pulse h-4 w-full"
                    :style="{
                      width: `${50 + Math.random() * 40}%`,
                    }" />
                </td>
              </tr>
            </template>

            <template v-else-if="rows.length > 0">
              <DataTableRow
                v-for="(row, index) in rows"
                :key="getRowIdForTemplate(row)"
                :row="row"
                :headers="headers"
                :index="index"
                :key-field="keyField"
                :selectable="selectable"
                :is-selected="selectedIds.has(getRowIdForTemplate(row))"
                :hoverable="hoverable"
                :striped="striped"
                :compact="compact"
                @select="toggleRowSelection"
                @row-click="handleRowClick"
                class="[&_td:last-child]:pr-3.5!">
                <template
                  v-for="header in headers"
                  :key="'slot-' + header.field"
                  #[header.field]="slotProps">
                  <slot :name="header.field" v-bind="slotProps" />
                </template>
              </DataTableRow>
            </template>

            <tr v-else>
              <td
                :colspan="selectable ? headers.length + 1 : headers.length"
                class="h-96 text-center align-middle hover:bg-transparent">
                <div
                  class="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Icon :icon="emptyIcon" class="h-6 w-6 text-muted-foreground/80" />
                  </div>
                  <h3 class="mt-1 text-base font-semibold text-foreground">
                    {{ emptyTitle }}
                  </h3>
                  <p class="text-sm max-w-sm mx-auto">
                    <slot name="empty-description">
                      {{ emptyDescription }}
                    </slot>
                  </p>
                  <div class="mt-4" v-if="$slots['empty-action']">
                    <slot name="empty-action" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showPagination && pageInfo && pageInfo.totalPages > 1">
      <Pagination
        :current-page="currentPage"
        :total-pages="pageInfo.totalPages"
        :show-page-info="false"
        :show-items-per-page="showItemsPerPage"
        :items-per-page="internalItemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        nav-type="icon"
        :alignment="props.paginationPosition"
        @change="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange" />
    </div>

    <ConfirmationModal
      v-model:show="showDeleteConfirmation"
      title="Confirm Deletion"
      description="Are you sure you want to delete the selected items?"
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      @confirm="onDeleteConfirm"
      @cancel="showDeleteConfirmation = false" />
  </div>
</template>
