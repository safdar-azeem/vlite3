<script setup lang="ts">
import { ref, watch, computed, provide, useSlots, markRaw } from 'vue'
import Input from '../Input.vue'
import Button from '../Button.vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { Pagination } from '../Pagination'
import ScreenFilter from './ScreenFilter.vue'
import ImportData from '../ImportData/ImportData.vue'
import type { ScreenProps } from './types'
import { usePersistentState } from '../../utils/usePersistentState'
import { useVLiteConfig } from '../../core/config'
import { $t } from '@/utils/i18n'
import { SCREEN_CONTEXT_KEY } from '../DataTable/types'
import type { ScreenContext, TableState } from '../DataTable/types'

import ScreenHeaderTitle from './components/ScreenHeaderTitle.vue'
import ScreenViewToggle from './components/ScreenViewToggle.vue'
import ScreenOptionsDropdown from './components/ScreenOptionsDropdown.vue'
import ScreenAddAction from './components/ScreenAddAction.vue'
import ScreenEmptyState from './components/ScreenEmptyState.vue'
import ScreenExportModal from './components/ScreenExportModal.vue'
import ScreenQuickFilters from './components/ScreenQuickFilters.vue'

const props = withDefaults(defineProps<ScreenProps>(), {
  name: '',
  data: () => [],
  loading: false,
  customHeader: false,
  canSearch: true,
  canAdd: true,
  pagination: true,
  emptyIcon: 'lucide:inbox',
  filterSchema: () => [],
  filterType: 'modal',
  showRefresh: false,
  exportSchema: () => [],
  importSchema: () => [],
  exportProps: false,
  importProps: false,
  importType: '',
  paginationProps: () => ({
    alignment: 'between',
    navType: 'icon',
    showItemsPerPage: true,
    itemsPerPageOptions: [10, 20, 30, 50],
  }),
  viewProps: () => ({}),
  hideSelectable: false,
  hideDeleteBtn: false,
  quickFilters: () => [],
  quickFilterKey: 'status',
  quickFilterVariant: 'line',
})
const vliteConfig = useVLiteConfig()
const emit = defineEmits<{
  (e: 'add'): void
  (e: 'delete', items: any[]): void
}>()

// ── internal state ────────────────────────────────────────────────────────────
const slots = useSlots()
const activeViewKey = computed(() => props.name || props.title || 'default-screen')
const activeView = usePersistentState<'table' | 'list'>(
  `view-mode-${activeViewKey.value}`,
  props.table || slots.table ? 'table' : 'list'
)
const searchQuery = ref('')
const activeFilters = ref<Record<string, any>>({})
const activeSort = ref<{ field: string; order: string }>({ field: '', order: '' })
const internalPage = ref(props.pageInfo?.currentPage || 1)
const internalLimit = ref(props.pageInfo?.itemsPerPage || props.paginationProps?.itemsPerPage || 10)
const selectedRows = ref<any[]>([])
const itemsToDelete = ref<any[]>([])
const showDeleteConfirmation = ref(false)

// ── quick-filter state ────────────────────────────────────────────────────────
/** Initialise to defaultQuickFilter, or the first tab's value, or '' */
const activeQuickFilter = ref<string | number>(
  props.defaultQuickFilter !== undefined
    ? props.defaultQuickFilter
    : props.quickFilters && props.quickFilters.length > 0
      ? props.quickFilters[0].value
      : ''
)

const hasQuickFilters = computed(() => props.quickFilters && props.quickFilters.length > 0)

/** When quick-filter changes, reset to page 1 and trigger refetch */
const handleQuickFilterChange = (val: string | number) => {
  activeQuickFilter.value = val
  internalPage.value = 1
  triggerChange()
}

// ── markRaw wrappers to prevent proxying static components ───────────────────
const activeComponent = computed(() => {
  let comp: any
  if (activeView.value === 'table') comp = props.table || !!slots.table
  else comp = props.list || !!slots.list || !!slots.grid

  // Return the raw component if it's an object/component definition to avoid deep proxying
  return typeof comp === 'object' && comp !== null ? markRaw(comp) : comp
})

// ── Computed: true when the user has an active search or any filter applied ──
const isFiltered = computed(() => {
  if (searchQuery.value && searchQuery.value.trim() !== '') return true
  if (
    activeQuickFilter.value !== '' &&
    activeQuickFilter.value !== null &&
    activeQuickFilter.value !== undefined
  ) return true
  if (!activeFilters.value) return false
  return Object.keys(activeFilters.value).some(
    (k) =>
      activeFilters.value[k] !== '' &&
      activeFilters.value[k] !== null &&
      activeFilters.value[k] !== undefined
  )
})

// ── Screen context provided to all descendants ────────────────────────────────
const screenContext: ScreenContext = {
  disableSearch: true,
  forceSelectable: !props.hideSelectable,
  onTableChange: (state: TableState) => {
    activeSort.value = { field: state.sort.field, order: state.sort.order }
    triggerChange()
  },
}
provide(SCREEN_CONTEXT_KEY, screenContext)
provide('screen-selected-rows', selectedRows)
provide('screen-request-delete', (items: any[]) => requestDelete(items))

// ── delete helpers ────────────────────────────────────────────────────────────
const requestDelete = (items: any[]) => {
  itemsToDelete.value = items
  showDeleteConfirmation.value = true
}
const confirmDelete = () => {
  emit('delete', itemsToDelete.value)
  showDeleteConfirmation.value = false
  selectedRows.value = []
}
const handleComponentDelete = (items: any[]) => {
  emit('delete', items)
  selectedRows.value = []
}

// ── sync pageInfo changes back into internal state ────────────────────────────
watch(
  () => props.pageInfo?.currentPage,
  (v) => {
    if (v) internalPage.value = v
  }
)
watch(
  () => props.pageInfo?.itemsPerPage,
  (v) => {
    if (v) internalLimit.value = v
  }
)

// ── search debounce ───────────────────────────────────────────────────────────
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    internalPage.value = 1
    triggerChange()
  }, 300)
})

// ── pagination handlers ───────────────────────────────────────────────────────
const handlePageChange = (page: number) => {
  internalPage.value = page
  triggerChange()
}
const handleItemsPerPageChange = (limit: number) => {
  internalLimit.value = limit
  internalPage.value = 1
  triggerChange()
}

// ── unified refetch trigger ───────────────────────────────────────────────────
const triggerChange = () => {
  if (!props.refetch) return

  const combinedFilters = { ...activeFilters.value }

  if (
    activeQuickFilter.value !== '' &&
    activeQuickFilter.value !== null &&
    activeQuickFilter.value !== undefined
  ) {
    combinedFilters[props.quickFilterKey] = activeQuickFilter.value
  }

  props.refetch({
    pagination: { page: internalPage.value, limit: internalLimit.value },
    search: searchQuery.value,
    sort: { ...activeSort.value },
    filter: combinedFilters,
  })
}

const hasData = computed(() => props.data && props.data.length > 0)

// ── display helpers ───────────────────────────────────────────────────────────
const txtDeleteSelected = computed(() => {
  const r = $t('vlite.screen.deleteSelected')
  return r !== 'vlite.screen.deleteSelected' ? r : 'Delete Selected'
})
const txtRefresh = computed(() => {
  const r = $t('vlite.screen.refresh')
  return r !== 'vlite.screen.refresh' ? r : 'Refresh'
})
const txtSearch = computed(() => {
  const r = $t('vlite.screen.searchPlaceholder')
  return r !== 'vlite.screen.searchPlaceholder' ? r : 'Search...'
})
const txtConfirmDeleteTitle = computed(() => {
  const r = $t('vlite.screen.confirmDeleteTitle')
  return r !== 'vlite.screen.confirmDeleteTitle' ? r : 'Confirm Deletion'
})
const txtConfirmDeleteDesc = computed(() => {
  const r = $t('vlite.screen.confirmDeleteDesc', { count: itemsToDelete.value.length })
  return r !== 'vlite.screen.confirmDeleteDesc'
    ? r
    : `Are you sure you want to delete the selected ${itemsToDelete.value.length > 1 ? 'items' : 'item'}?`
})
const txtConfirmDeleteBtn = computed(() => {
  const r = $t('vlite.screen.confirmDeleteBtn')
  return r !== 'vlite.screen.confirmDeleteBtn' ? r : 'Delete'
})
const txtCancelBtn = computed(() => {
  const r = $t('vlite.screen.cancelBtn')
  return r !== 'vlite.screen.cancelBtn' ? r : 'Cancel'
})
const txtMissingView = computed(() => {
  const r = $t('vlite.screen.missingView')
  return r !== 'vlite.screen.missingView'
    ? r
    : 'Please provide a `:list` or `:table` component or slot.'
})

const hasExportOrImport = computed(
  () =>
    (props.exportSchema && props.exportSchema.length > 0 && props.exportProps !== false) ||
    (props.importSchema && props.importSchema.length > 0 && props.importProps !== false)
)

const txtImportData = computed(() => {
  const r = $t('vlite.screen.importData')
  return r !== 'vlite.screen.importData' ? r : 'Import Data'
})

const importDataRef = ref<any>(null)
const showExportDataModal = ref(false)
const showImportDataModal = ref(false)

const handleDropdownSelect = (opt: any) => {
  if (opt.value === 'export') showExportDataModal.value = true
  else if (opt.value === 'import') showImportDataModal.value = true
}

const resolveExportFields = computed(() =>
  (props.exportSchema || []).map((s) => ({
    field: s.name || s.field,
    title: s.label || s.title || s.name || s.field,
  }))
)

const resolveImportFields = computed(() =>
  (props.importSchema || []).map((s) => ({
    field: s.name || s.field,
    title: s.label || s.title || s.name || s.field,
    required: s.required || false,
  }))
)

const handleImportBatch = async (payload: any) => {
  if (vliteConfig?.services?.importApi && props.importType) {
    return await vliteConfig.services.importApi(props.importType, payload)
  }
  console.warn(
    'VLite Screen: No importApi configured or no importType provided for generic import.'
  )
  return {
    processed: payload.data.length,
    created: payload.data.length,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  }
}

const handleImportComplete = () => triggerChange()
const effectiveExportMode = computed(
  () => props.exportMode || vliteConfig?.exportData?.mode || 'frontend'
)

const handleBackendExport = async (format: string) => {
  if (vliteConfig?.services?.exportApi && props.exportType) {
    await vliteConfig.services.exportApi(props.exportType, {
      format,
      search: searchQuery.value,
      filter: activeFilters.value,
    })
  } else {
    console.warn(
      'VLite Screen: No exportApi configured or no exportType provided for generic backend export.'
    )
  }
}
</script>

<template>
  <div class="flex flex-col w-full space-y-8">
    <div
      v-if="!customHeader"
      :class="headerClass"
      class="flex flex-col md:flex-row sm:items-start md:items-center justify-between gap-4">
      <ScreenHeaderTitle
        :title="title"
        :title-i18n="titleI18n"
        :title-class="titleClass"
        :description="description"
        :description-i18n="descriptionI18n"
        :description-class="descriptionClass"
        :info="info"
        :info-i18n="infoI18n">
        <template #title v-if="$slots.title"><slot name="title" /></template>
        <template #description v-if="$slots.description"><slot name="description" /></template>
      </ScreenHeaderTitle>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full justify-end">
        <div
          class="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none justify-start sm:justify-end">
          <Button
            v-if="selectedRows.length > 0 && !hideSelectable && !hideDeleteBtn"
            variant="outline"
            class="hover:bg-destructive/10 shrink-0 h-9! w-9!"
            icon="lucide:trash-2"
            :title="txtDeleteSelected"
            @click="requestDelete(selectedRows)" />

          <ScreenViewToggle
            v-if="(table || $slots.table) && (list || $slots.list || $slots.grid)"
            v-model="activeView" />

          <slot name="before-search" />

          <Button
            v-if="showRefresh"
            variant="outline"
            icon="lucide:refresh-cw"
            size="lg"
            class="shrink-0 h-9! w-9!"
            :title="txtRefresh"
            :disabled="loading"
            @click="triggerChange" />

          <ScreenFilter
            v-if="filterSchema && filterSchema.length > 0"
            :schema="filterSchema"
            :type="filterType"
            v-model="activeFilters"
            @change="triggerChange" />

          <div v-if="canSearch" class="w-full md:w-60! max-sm:order-last">
            <Input
              lazy
              v-model="searchQuery"
              icon="lucide:search"
              :placeholder="txtSearch"
              variant="outline"
              class="bg-background w-full"
              :show-clear-button="true" />
          </div>
        </div>

        <div class="flex items-center gap-3 max-sm:w-full sm:w-auto max-sm:order-last">
          <slot name="actions">
            <ScreenAddAction
              :can-add="canAdd"
              :add-component="addComponent"
              :add-btn="addBtn"
              :loading="loading"
              :data="data"
              :refetch="refetch"
              @add="$emit('add')" />
          </slot>

          <ScreenOptionsDropdown
            v-if="hasExportOrImport"
            :export-props="exportProps"
            :import-props="importProps"
            @select="handleDropdownSelect" />

          <slot name="after-add" />
        </div>
      </div>
    </div>
    <slot name="custom-header" v-else />
    <slot name="sub-header" />
    <div
      v-if="hasQuickFilters"
      class="-mt-1"
      :class="quickFilterVariant == 'line' ? 'mb-1.5 sm:mb-1' : 'mb-2'">
      <ScreenQuickFilters
        v-model="activeQuickFilter"
        :options="quickFilters!"
        :variant="quickFilterVariant"
        @change="handleQuickFilterChange" />
    </div>

    <div class="flex-1 w-full relative" :class="containerClass">
      <template v-if="!hasData && !loading">
        <slot name="empty" v-if="$slots.empty" />
        <ScreenEmptyState
          v-else
          :empty-title="emptyTitle"
          :empty-title-i18n="emptyTitleI18n"
          :empty-description="emptyDescription"
          :empty-description-i18n="emptyDescriptionI18n"
          :empty-icon="emptyIcon"
          :is-filtered="isFiltered"
          :can-add="canAdd"
          :add-component="addComponent"
          :add-btn="addBtn" />
      </template>
      <template v-else>
        <slot
          v-if="activeView === 'table' && $slots.table"
          name="table"
          :data="data"
          :loading="loading"
          :selected-rows="selectedRows"
          :delete="requestDelete"
          :update-selected-rows="(val: any[]) => (selectedRows = val)" />
        <slot
          v-else-if="activeView === 'list' && $slots.list"
          name="list"
          :data="data"
          :loading="loading"
          :selected-rows="selectedRows"
          :delete="requestDelete"
          :update-selected-rows="(val: any[]) => (selectedRows = val)" />
        <slot
          v-else-if="activeView === 'list' && $slots.grid"
          name="grid"
          :data="data"
          :loading="loading"
          :selected-rows="selectedRows"
          :delete="requestDelete"
          :update-selected-rows="(val: any[]) => (selectedRows = val)" />
        <component
          :is="activeComponent"
          v-else-if="activeComponent"
          :data="data"
          :loading="loading"
          :refetch="refetch"
          v-model:selectedRows="selectedRows"
          :delete="requestDelete"
          @delete="handleComponentDelete"
          v-bind="viewProps" />
        <div
          v-else
          class="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
          {{ txtMissingView }}
        </div>
      </template>
    </div>

    <div v-if="pagination && pageInfo && pageInfo.totalPages > 1" class="-mt-2">
      <Pagination
        :current-page="pageInfo.currentPage"
        :total-pages="pageInfo.totalPages"
        :total-items="pageInfo.totalItems"
        v-bind="paginationProps"
        @change="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange" />
    </div>

    <ConfirmationModal
      v-model:show="showDeleteConfirmation"
      :title="txtConfirmDeleteTitle"
      :description="txtConfirmDeleteDesc"
      :confirm-text="txtConfirmDeleteBtn"
      :cancel-text="txtCancelBtn"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirmation = false" />

    <ScreenExportModal
      v-if="showExportDataModal"
      v-model:show="showExportDataModal"
      :data="data || []"
      :fields="resolveExportFields"
      :mode="effectiveExportMode"
      :export-props="exportProps"
      :on-export="handleBackendExport" />

    <div v-if="hasExportOrImport">
      <ImportData
        v-model:show="showImportDataModal"
        ref="importDataRef"
        :fields="resolveImportFields"
        :processBatch="handleImportBatch"
        @complete="handleImportComplete"
        v-bind="typeof importProps === 'object' ? importProps : {}"
        :title="txtImportData"
        class="hidden!" />
    </div>
  </div>
</template>
