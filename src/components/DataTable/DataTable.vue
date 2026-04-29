<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import CheckBox from '../CheckBox.vue'
import Button from '../Button.vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { Pagination } from '../Pagination'
import { Empty } from '../Empty'
import DataTableHeader from './DataTableHeader.vue'
import DataTableRow from './DataTableRow.vue'
import { $t } from '@/utils/i18n'
import type {
  SortConfig,
  DataTableProps,
  SelectionState,
  RowClickPayload,
  TableState,
  ScreenContext,
  TableHeader,
} from './types'
import { SCREEN_CONTEXT_KEY } from './types'

// ── helpers ───────────────────────────────────────────────────────────────────

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const getRowId = (row: any, keyField: string): any => getNestedValue(row, keyField)

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

const resolveSortKey = (header: TableHeader): string => header.sortKey || header.field

// ── props / emits ─────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<DataTableProps>(), {
  rows: () => [],
  selectedRows: () => [],
  headers: () => [],
  keyField: 'auto',
  loading: false,
  hideSelectable: false,
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
  cellBordered: false,
  compact: false,
  sortable: false,
  variant: 'default',
  headerVariant: 'default',
  size: 'md',
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

const screenContext = inject<ScreenContext | null>(SCREEN_CONTEXT_KEY, null)

const effectiveSelectable = computed(() => {
  // If hideSelectable is explicitly set to true on DataTable, always respect it —
  // even when inside a Screen context. This allows per-table override.
  if (props.hideSelectable) return false
  if (screenContext) {
    return screenContext.forceSelectable
  }
  return true
})

const effectiveKeyField = computed(() => resolveKeyField(props.rows, props.keyField))

// ── internal state ────────────────────────────────────────────────────────────

const sortConfig = ref<SortConfig>({ field: '', order: '' })
const internalItemsPerPage = ref(
  props.pageInfo?.itemsPerPage || props.paginationProps?.itemsPerPage || 10
)
const currentPage = ref(props.pageInfo?.currentPage || 1)
const showDeleteConfirmation = ref(false)

const shouldShowSkeleton = computed(() => props.loading)

watch(
  () => props.pageInfo?.itemsPerPage,
  (v) => {
    if (v !== undefined) internalItemsPerPage.value = v
  }
)
watch(
  () => props.paginationProps?.itemsPerPage,
  (v) => {
    if (v !== undefined) internalItemsPerPage.value = v
  }
)
watch(
  () => props.pageInfo?.currentPage,
  (v) => {
    if (v) currentPage.value = v
  }
)

// ── selection ─────────────────────────────────────────────────────────────────

const selectedIds = ref<Set<any>>(new Set())

watch(
  () => props.selectedRows,
  (newVal) => {
    const newIds = new Set((newVal || []).map((row) => getRowId(row, effectiveKeyField.value)))
    if (
      newIds.size !== selectedIds.value.size ||
      [...newIds].some((id) => !selectedIds.value.has(id))
    ) {
      selectedIds.value = newIds
    }
  },
  { immediate: true, deep: true }
)

const isAllSelected = computed(
  () =>
    props.rows.length > 0 &&
    props.rows.every((row) => selectedIds.value.has(getRowId(row, effectiveKeyField.value)))
)

const isIndeterminate = computed(() => selectedIds.value.size > 0 && !isAllSelected.value)

const selectedRowsComputed = computed(() => {
  const allAvailable = [...(props.selectedRows || []), ...props.rows]
  const map = new Map()
  allAvailable.forEach((r) => map.set(getRowId(r, effectiveKeyField.value), r))
  return Array.from(selectedIds.value)
    .map((id) => map.get(id))
    .filter(Boolean)
})

const toggleSelectAll = (checked: boolean) => {
  const newSet = new Set(selectedIds.value)
  if (checked) {
    props.rows.forEach((row) => newSet.add(getRowId(row, effectiveKeyField.value)))
  } else {
    props.rows.forEach((row) => newSet.delete(getRowId(row, effectiveKeyField.value)))
  }
  selectedIds.value = newSet
  emitSelection()
}

const toggleRowSelection = (id: any) => {
  const newSet = new Set(selectedIds.value)
  if (newSet.has(id)) newSet.delete(id)
  else newSet.add(id)
  selectedIds.value = newSet
  emitSelection()
}

const emitSelection = () => {
  const seen = new Set<any>()
  const newSelected: any[] = []

  props.rows.forEach((row) => {
    const id = getRowId(row, effectiveKeyField.value)
    if (selectedIds.value.has(id)) {
      newSelected.push(row)
      seen.add(id)
    }
  })
  ;(props.selectedRows || []).forEach((row) => {
    const id = getRowId(row, effectiveKeyField.value)
    if (!seen.has(id) && selectedIds.value.has(id)) {
      newSelected.push(row)
      seen.add(id)
    }
  })

  emit('select', {
    selected: newSelected,
    all: isAllSelected.value,
    indeterminate: isIndeterminate.value,
  })
  emit('update:selectedRows', newSelected)
}

// ── sorting ───────────────────────────────────────────────────────────────────

const handleSort = (field: string) => {
  const header = props.headers.find((h) => h.field === field)
  const key = header ? resolveSortKey(header) : field

  if (sortConfig.value.field === key) {
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.field = key
    sortConfig.value.order = 'asc'
  }
  currentPage.value = 1
  emitChange()
}

// ── pagination ────────────────────────────────────────────────────────────────

const handlePageChange = (page: number) => {
  currentPage.value = page
  emitChange()
}

const handleItemsPerPageChange = (value: number) => {
  internalItemsPerPage.value = value
  currentPage.value = 1
  emit('update:itemsPerPage', value)
  emitChange()
}

const handleRowClick = (payload: RowClickPayload) => emit('rowClick', payload)

const onDeleteConfirm = () => {
  emit('delete', selectedRowsComputed.value)
  showDeleteConfirmation.value = false
}

// ── emitChange: forward to both @change and Screen context ────────────────────

let emitDebounceTimer: ReturnType<typeof setTimeout> | null = null
const emitChange = () => {
  if (emitDebounceTimer) clearTimeout(emitDebounceTimer)
  emitDebounceTimer = setTimeout(() => {
    const state: TableState = {
      pagination: { page: currentPage.value, limit: internalItemsPerPage.value },
      sort: { ...sortConfig.value },
      filter: {},
    }
    emit('change', state)
    screenContext?.onTableChange?.(state)
  }, 10)
}

// ── cleanup stale selections on row set change ────────────────────────────────

watch(
  () => props.rows,
  () => {
    const validIds = new Set(props.rows.map((row) => getRowId(row, effectiveKeyField.value)))
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

const tableClass = computed(() => {
  const cellBorders = props.cellBordered
    ? '[&>thead>tr>th:not(:last-child)]:border-r [&>thead>tr>th]:border-border ' +
      '[&>tbody>tr>td:not(:last-child)]:border-r [&>tbody>tr>td]:border-border ' +
      '[&>tbody>tr>th:not(:last-child)]:border-r [&>tbody>tr>th]:border-border'
    : ''
  return ['w-full caption-bottom -text-fs-1', cellBorders, props.tableClass].join(' ')
})

const getColumnStyle = (header: TableHeader) => {
  const style: Record<string, string> = {}
  if (header.width && !/(?:^|\s|:)w-/.test(header.width)) {
    style.width = header.width
  }
  if (header.minWidth && !/(?:^|\s|:)min-w-/.test(header.minWidth)) {
    style.minWidth = header.minWidth
  }
  return style
}

const getColumnClass = (header: TableHeader) => {
  const classes: string[] = []
  if (header.width && /(?:^|\s|:)w-/.test(header.width)) {
    classes.push(header.width)
  }
  if (header.minWidth && /(?:^|\s|:)min-w-/.test(header.minWidth)) {
    classes.push(header.minWidth)
  }
  return classes.join(' ')
}

// ── i18n ──────────────────────────────────────────────────────────────────────

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
    <div :class="containerClass">
      <div class="overflow-x-auto w-full">
        <table :class="tableClass" class="data-table">
          <thead
            :class="[
              '[&_tr]:border-b [&_tr]:border-border',
              headerVariant === 'minimal' ? 'bg-transparent' : 'bg-accent',
              variant === 'raised'
                ? '[&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg'
                : '',
            ]">
            <tr class="hover:bg-transparent">
              <th
                v-if="effectiveSelectable"
                scope="col"
                class="w-[40px] px-0 text-center font-medium text-muted-foreground"
                style="width: 40px">
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
                :size="size"
                :table-sortable="sortable"
                :cell-bordered="cellBordered"
                @sort="handleSort"
                :class="[cellBordered ? '' : 'last:pr-5!', getColumnClass(header)]"
                :style="getColumnStyle(header)" />
            </tr>
          </thead>

          <tbody class="[&_tr:last-child]:border-0">
            <template v-if="shouldShowSkeleton">
              <tr
                v-for="i in Math.min(internalItemsPerPage, 15)"
                :key="'skeleton-' + i"
                v-memo="[]"
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
                  class="align-middle"
                  :class="[
                    header.hideOnMobile ? 'hidden md:table-cell' : '',
                    cellBordered ? 'px-5! py-3!' : 'p-5! last:pr-6!',
                  ]">
                  <div
                    class="rounded-md bg-muted/50 animate-pulse h-4"
                    :style="{ width: `${50 + Math.random() * 40}%` }" />
                </td>
              </tr>
            </template>

            <template v-else-if="rows.length > 0">
              <DataTableRow
                v-for="(row, index) in rows"
                :key="getRowId(row, effectiveKeyField)"
                v-memo="[
                  row,
                  selectedIds.has(getRowId(row, effectiveKeyField)),
                  effectiveSelectable,
                  compact,
                  size,
                  striped,
                  hoverable,
                  cellBordered,
                ]"
                :row="row"
                :headers="headers"
                :index="index"
                :key-field="effectiveKeyField"
                :selectable="effectiveSelectable"
                :is-selected="selectedIds.has(getRowId(row, effectiveKeyField))"
                :hoverable="hoverable"
                :striped="striped"
                :compact="compact"
                :size="size"
                :cell-bordered="cellBordered"
                @select="toggleRowSelection"
                @row-click="handleRowClick"
                :class="cellBordered ? '' : '[&_td:last-child]:pr-3.5!'">
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
                    variant="variant12"
                    class="bg-transparent! py-8!">
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
