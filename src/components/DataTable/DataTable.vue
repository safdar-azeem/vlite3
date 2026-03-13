<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import Icon from '../Icon.vue'
import CheckBox from '../CheckBox.vue'
import Button from '../Button.vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { Pagination } from '../Pagination'
import { Empty } from '../Empty'
import DataTableHeader from './DataTableHeader.vue'
import DataTableRow from './DataTableRow.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import { $t } from '@/utils/i18n'
import type {
  SortConfig,
  DataTableProps,
  SelectionState,
  RowClickPayload,
  TableState,
  ScreenContext,
} from './types'
import { SCREEN_CONTEXT_KEY } from './types'

// ── helpers ──────────────────────────────────────────────────────────────────

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const getRowId = (row: any, keyField: string): any => {
  return getNestedValue(row, keyField)
}

/**
 * Resolve the effective keyField for a row set.
 * Priority: explicit prop value (unless it is the sentinel 'auto')
 *           → first of ['id', '_id'] found on the first row
 *           → fallback '_id'
 */
const resolveKeyField = (rows: any[], propKeyField: string | undefined): string => {
  const DEFAULT_KEYS = ['id', '_id'] as const
  if (propKeyField && propKeyField !== 'auto') return propKeyField
  if (rows && rows.length > 0) {
    for (const key of DEFAULT_KEYS) {
      if (key in rows[0]) return key
    }
  }
  return '_id'
}

// ── props / emits ─────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<DataTableProps>(), {
  rows: () => [],
  selectedRows: () => [],
  search: '',
  showSearch: true,
  headers: () => [],
  // 'auto' is the internal sentinel; actual field is resolved at runtime
  keyField: 'auto',
  loading: false,
  selectable: false,
  emptyIcon: 'lucide:inbox',
  showPagination: true,
  paginationProps: () => ({
    alignment: 'between',
    navType: 'icon',
    showItemsPerPage: true,
    itemsPerPageOptions: [10, 25, 50, 100],
    showPageInfo: false,
  }),
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

// ── Screen context injection ──────────────────────────────────────────────────

/**
 * Screen provides a context object so that DataTable auto-configures itself
 * when rendered as a child of Screen:
 *   - disableSearch  → hides the built-in search toolbar (Screen has its own)
 *   - forceSelectable → enables row selection for bulk-delete support
 */
const screenContext = inject<ScreenContext | null>(SCREEN_CONTEXT_KEY, null)

// Effective showSearch: prop wins if explicitly set to false; otherwise context can disable it
const effectiveShowSearch = computed(() => {
  if (screenContext?.disableSearch) return false
  return props.showSearch
})

// Effective selectable: explicit true prop or Screen context forcing it
const effectiveSelectable = computed(() => {
  if (props.selectable) return true
  if (screenContext?.forceSelectable) return true
  return false
})

// Resolved keyField supporting dual 'id'/'_id' auto-detection
const effectiveKeyField = computed(() => resolveKeyField(props.rows, props.keyField))

// ── state ─────────────────────────────────────────────────────────────────────

const sortConfig = ref<SortConfig>({ field: '', order: '' })
const internalItemsPerPage = ref(
  props.pageInfo?.itemsPerPage || props.paginationProps?.itemsPerPage || 10
)
const currentPage = ref(props.pageInfo?.currentPage || 1)
const internalSearch = ref(props.search || '')
const showDeleteConfirmation = ref(false)

const loadingCause = ref<'initial' | 'page' | 'search' | 'sort' | 'limit' | 'idle'>('initial')

const shouldShowSkeleton = computed(() => props.loading)

watch(
  () => props.loading,
  (newVal, oldVal) => {
    if (!newVal && oldVal) loadingCause.value = 'idle'
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

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(internalSearch, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadingCause.value = 'search'
    emitChange()
  }, 300)
})

watch(
  () => props.pageInfo?.itemsPerPage,
  (newVal) => {
    if (newVal !== undefined) internalItemsPerPage.value = newVal
  }
)

watch(
  () => props.paginationProps?.itemsPerPage,
  (newVal) => {
    if (newVal !== undefined) internalItemsPerPage.value = newVal
  }
)

watch(
  () => props.pageInfo?.currentPage,
  (newVal) => {
    if (newVal) currentPage.value = newVal
  }
)

// ── selection ─────────────────────────────────────────────────────────────────

const selectedIds = ref<Set<any>>(new Set())

watch(
  () => props.selectedRows,
  (newVal) => {
    const newIds = new Set(
      (newVal || []).map((row) => getRowId(row, effectiveKeyField.value))
    )
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
  return props.rows.every((row) =>
    selectedIds.value.has(getRowId(row, effectiveKeyField.value))
  )
})

const isIndeterminate = computed(
  () => selectedIds.value.size > 0 && !isAllSelected.value
)

const selectedRowsComputed = computed(() => {
  const allAvailable = [...(props.selectedRows || []), ...props.rows]
  const map = new Map()
  allAvailable.forEach((r) => map.set(getRowId(r, effectiveKeyField.value), r))
  return Array.from(selectedIds.value)
    .map((id) => map.get(id))
    .filter(Boolean)
})

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    props.rows.forEach((row) =>
      selectedIds.value.add(getRowId(row, effectiveKeyField.value))
    )
  } else {
    if (selectedIds.value.size > 0) {
      props.rows.forEach((row) =>
        selectedIds.value.delete(getRowId(row, effectiveKeyField.value))
      )
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

  props.rows.forEach((row) => {
    const id = getRowId(row, effectiveKeyField.value)
    if (selectedIds.value.has(id)) {
      newSelected.push(row)
      seenIds.add(id)
    }
  })

  currentSelected.forEach((row) => {
    const id = getRowId(row, effectiveKeyField.value)
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

// ── sorting / pagination ──────────────────────────────────────────────────────

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

let emitDebounceTimer: ReturnType<typeof setTimeout> | null = null
const emitChange = () => {
  if (emitDebounceTimer) clearTimeout(emitDebounceTimer)
  emitDebounceTimer = setTimeout(() => {
    emit('change', {
      pagination: {
        page: currentPage.value,
        limit: internalItemsPerPage.value,
      },
      sort: { ...sortConfig.value },
      search: internalSearch.value,
      filter: {},
    })
  }, 10)
}

// ── cleanup stale selections when rows change ─────────────────────────────────

watch(
  () => props.rows,
  () => {
    const validIds = new Set(
      props.rows.map((row) => getRowId(row, effectiveKeyField.value))
    )
    selectedIds.value = new Set([...selectedIds.value].filter((id) => validIds.has(id)))
  }
)

// ── styling ───────────────────────────────────────────────────────────────────

const containerClass = computed(() => {
  const isRaised = props.variant === 'raised'
  return [
    'w-full flex flex-col',
    isRaised ? 'bg-background shadow-sm p-2 rounded-lg' : 'bg-background rounded',
    'overflow-hidden',
    props.bordered ? 'border border-border' : '',
    props.class,
  ].join(' ')
})

const tableClass = computed(() =>
  ['w-full caption-bottom -text-fs-1', props.tableClass].join(' ')
)

const getColumnWidth = (header: any) => header.width || 'auto'

// ── i18n helpers ──────────────────────────────────────────────────────────────

const txtEmptyTitle = computed(() =>
  props.emptyTitleI18n ? $t(props.emptyTitleI18n) : props.emptyTitle
)
const txtEmptyDesc = computed(() =>
  props.emptyDescriptionI18n ? $t(props.emptyDescriptionI18n) : props.emptyDescription
)
const txtDeleteConfirmTitle = computed(() => {
  const r = $t('vlite.dataTable.confirmDeleteTitle')
  return r !== 'vlite.dataTable.confirmDeleteTitle' ? r : 'Confirm Deletion'
})
const txtDeleteConfirmDesc = computed(() => {
  const r = $t('vlite.dataTable.confirmDeleteDesc')
  return r !== 'vlite.dataTable.confirmDeleteDesc'
    ? r
    : 'Are you sure you want to delete the selected items?'
})
const txtDeleteBtn = computed(() => {
  const r = $t('vlite.dataTable.deleteBtn')
  return r !== 'vlite.dataTable.deleteBtn' ? r : 'Delete'
})
const txtCancelBtn = computed(() => {
  const r = $t('vlite.dataTable.cancelBtn')
  return r !== 'vlite.dataTable.cancelBtn' ? r : 'Cancel'
})
</script>

<template>
  <div class="space-y-6.5">
    <!-- Toolbar is hidden when Screen context disables search AND no custom toolbar slots are used -->
    <DataTableToolbar
      v-if="effectiveShowSearch || $slots?.['toolbar-left'] || $slots?.['toolbar-right']"
      v-model="internalSearch"
      :show-search="effectiveShowSearch"
      :placeholder="searchPlaceholder"
      :placeholderI18n="searchPlaceholderI18n"
      :class="toolbarClass"
      :search-class="toolbarSearchClass">
      <template #left v-if="$slots?.['toolbar-left']">
        <slot name="toolbar-left" />
      </template>
      <template #delete v-if="selectedIds.size > 0">
        <Button
          v-if="selectedIds.size > 0"
          rounded="full"
          variant="outline"
          size="lg"
          icon="lucide:trash-2"
          @click="showDeleteConfirmation = true" />
      </template>
      <template #right v-if="$slots?.['toolbar-right']">
        <slot name="toolbar-right" />
      </template>
    </DataTableToolbar>

    <div :class="containerClass">
      <div class="overflow-x-auto w-full">
        <table :class="tableClass" class="data-table">
          <thead
            :class="[
              '[&_tr]:border-b [&_tr]:border-border bg-muted',
              variant === 'raised'
                ? '[&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg'
                : '',
            ]">
            <tr class="hover:bg-transparent">
              <th
                v-if="effectiveSelectable"
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
                :style="{ width: getColumnWidth(header) }" />
            </tr>
          </thead>

          <tbody class="[&_tr:last-child]:border-0">
            <template v-if="shouldShowSkeleton">
              <tr
                v-for="i in Math.min(internalItemsPerPage, 15)"
                :key="'skeleton-' + i"
                class="border-b border-border/70 bg-background transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td
                  v-if="effectiveSelectable"
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
                    :style="{ width: `${50 + Math.random() * 40}%` }" />
                </td>
              </tr>
            </template>

            <template v-else-if="rows.length > 0">
              <DataTableRow
                v-for="(row, index) in rows"
                :key="getRowId(row, effectiveKeyField)"
                :row="row"
                :headers="headers"
                :index="index"
                :key-field="effectiveKeyField"
                :selectable="effectiveSelectable"
                :is-selected="selectedIds.has(getRowId(row, effectiveKeyField))"
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
                :colspan="effectiveSelectable ? headers.length + 1 : headers.length"
                class="align-middle hover:bg-transparent">
                <slot name="empty">
                  <Empty
                    :title="txtEmptyTitle"
                    :description="txtEmptyDesc"
                    :icon="emptyIcon"
                    class="border-none! bg-transparent! py-16!">
                    <template #action v-if="$slots['empty-action']">
                      <slot name="empty-action" />
                    </template>
                  </Empty>
                </slot>
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
        :total-items="pageInfo.totalItems"
        v-bind="paginationProps"
        @change="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange" />
    </div>

    <ConfirmationModal
      v-model:show="showDeleteConfirmation"
      :title="txtDeleteConfirmTitle"
      :description="txtDeleteConfirmDesc"
      :confirm-text="txtDeleteBtn"
      :cancel-text="txtCancelBtn"
      variant="danger"
      @confirm="onDeleteConfirm"
      @cancel="showDeleteConfirmation = false" />
  </div>
</template>
