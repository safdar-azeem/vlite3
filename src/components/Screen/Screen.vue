<script setup lang="ts">
import { ref, watch, computed, provide, useSlots, markRaw } from 'vue'
import Input from '../Input.vue'
import Button from '../Button.vue'
import Icon from '../Icon.vue'
import Tooltip from '../Tooltip.vue'
import Modal from '../Modal.vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { Pagination } from '../Pagination'
import { Empty } from '../Empty'
import ScreenFilter from './ScreenFilter.vue'
import Dropdown from '../Dropdown/Dropdown.vue'
import ExportData from '../ExportData/ExportData.vue'
import ImportData from '../ImportData/ImportData.vue'
import type { ScreenProps } from './types'
import { usePersistentState } from '../../utils/usePersistentState'
import { useVLiteConfig } from '../../core/config'
import { $t } from '@/utils/i18n'
import { SCREEN_CONTEXT_KEY } from '../DataTable/types'
import type { ScreenContext, TableState } from '../DataTable/types'
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

// ── markRaw wrappers to prevent proxying static components ───────────────────
const rawAddComponent = computed(() =>
  props.addComponent ? markRaw(props.addComponent as any) : undefined
)
const rawAddModal = computed(() =>
  props.addBtn?.modal ? markRaw(props.addBtn.modal as any) : undefined
)

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
  props.refetch({
    pagination: { page: internalPage.value, limit: internalLimit.value },
    search: searchQuery.value,
    sort: { ...activeSort.value },
    filter: { ...activeFilters.value },
  })
}
const hasData = computed(() => props.data && props.data.length > 0)
// ── display helpers ───────────────────────────────────────────────────────────
const displayTitle = computed(() => (props.titleI18n ? $t(props.titleI18n) : props.title))
const displayDescription = computed(() =>
  props.descriptionI18n ? $t(props.descriptionI18n) : props.description
)
const txtDeleteSelected = computed(() => {
  const r = $t('vlite.screen.deleteSelected')
  return r !== 'vlite.screen.deleteSelected' ? r : 'Delete Selected'
})
const txtListView = computed(() => {
  const r = $t('vlite.screen.listView')
  return r !== 'vlite.screen.listView' ? r : 'List View'
})
const txtTableView = computed(() => {
  const r = $t('vlite.screen.tableView')
  return r !== 'vlite.screen.tableView' ? r : 'Table View'
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
const getAddBtnLabel = computed(() => {
  if (props.addBtn?.labelI18n) return $t(props.addBtn.labelI18n)
  if (props.addBtn?.label) return props.addBtn.label
  const res = $t('vlite.screen.addNew')
  return res !== 'vlite.screen.addNew' ? res : 'Add New'
})
const hasExportOrImport = computed(
  () =>
    (props.exportSchema && props.exportSchema.length > 0 && props.exportProps !== false) ||
    (props.importSchema && props.importSchema.length > 0 && props.importProps !== false)
)
const txtExportData = computed(() => {
  const r = $t('vlite.screen.exportData')
  return r !== 'vlite.screen.exportData' ? r : 'Export Data'
})
const txtImportData = computed(() => {
  const r = $t('vlite.screen.importData')
  return r !== 'vlite.screen.importData' ? r : 'Import Data'
})
const dropdownOptions = computed(() => {
  const opts = []
  if (props.exportProps !== false)
    opts.push({ value: 'export', label: txtExportData.value, icon: 'lucide:download' })
  if (props.importProps !== false)
    opts.push({ value: 'import', label: txtImportData.value, icon: 'lucide:upload' })
  return opts
})
const exportDataRef = ref<any>(null)
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
      <div class="flex flex-col shrink-0">
        <slot name="title">
          <div v-if="displayTitle" class="flex items-center! gap-2">
            <h1 class="text-fs-7.5 font-bold text-foreground">{{ displayTitle }}</h1>
            <Tooltip
              v-if="info || infoI18n"
              :content="info"
              :content-i18n="infoI18n"
              placement="right">
              <Icon
                icon="lucide:info"
                class="w-[18px] h-[18px] mt-3! text-muted-foreground hover:text-foreground cursor-pointer transition-colors outline-none" />
            </Tooltip>
          </div>
        </slot>
        <slot name="description">
          <p v-if="displayDescription" class="text-sm text-gray-700 mt-1 md:max-w-[450px]">
            {{ displayDescription }}
          </p>
        </slot>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full justify-end">
        <div
          class="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none justify-start sm:justify-end">
          <Button
            v-if="selectedRows.length > 0 && !hideSelectable"
            variant="outline"
            class="hover:bg-destructive/10 shrink-0 h-9! w-9!"
            icon="lucide:trash-2"
            :title="txtDeleteSelected"
            @click="requestDelete(selectedRows)" />
          <div
            v-if="(table || $slots.table) && (list || $slots.list || $slots.grid)"
            class="flex items-center p-1 rounded-md border border-border shrink-0">
            <button
              @click="activeView = 'table'"
              class="p-1.5 rounded"
              :class="[
                activeView === 'table'
                  ? 'bg-secondary/85 dark:bg-secondary shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              :title="txtTableView">
              <Icon icon="lucide:list" class="w-4 h-4" />
            </button>

            <button
              @click="activeView = 'list'"
              class="p-1.5 rounded"
              :class="[
                activeView === 'list'
                  ? 'bg-secondary/85 dark:bg-secondary shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              :title="txtListView">
              <Icon icon="lucide:layout-grid" class="w-4 h-4" />
            </button>
          </div>
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
            <component v-if="rawAddComponent" :is="rawAddComponent" />
            <template v-else-if="canAdd">
              <template v-if="addBtn">
                <Modal
                  v-if="addBtn.modal"
                  :body="rawAddModal"
                  v-bind="addBtn.modalProps"
                  :refetch="refetch"
                  :data="data"
                  triggerClass="w-full"
                  :loading="loading">
                  <template #trigger>
                    <Button
                      class="w-full"
                      :icon="addBtn.icon || 'fluent:add-16-filled'"
                      :variant="addBtn.variant || 'primary'"
                      v-bind="addBtn.buttonProps">
                      {{ getAddBtnLabel }}
                    </Button>
                  </template>
                </Modal>
                <router-link
                  v-else-if="addBtn.to"
                  :to="addBtn.to"
                  class="inline-flex w-full sm:w-auto">
                  <Button
                    class="w-full"
                    :icon="addBtn.icon || 'fluent:add-16-filled'"
                    :variant="addBtn.variant || 'primary'"
                    v-bind="addBtn.buttonProps">
                    {{ getAddBtnLabel }}
                  </Button>
                </router-link>
                <a
                  v-else-if="addBtn.href"
                  :href="addBtn.href"
                  :target="addBtn.target"
                  class="inline-flex w-full sm:w-auto">
                  <Button
                    class="w-full"
                    :icon="addBtn.icon || 'fluent:add-16-filled'"
                    :variant="addBtn.variant || 'primary'"
                    v-bind="addBtn.buttonProps">
                    {{ getAddBtnLabel }}
                  </Button>
                </a>
                <Button
                  v-else
                  class="w-full sm:w-auto"
                  :icon="addBtn.icon || 'fluent:add-16-filled'"
                  :variant="addBtn.variant || 'primary'"
                  v-bind="addBtn.buttonProps"
                  @click="addBtn.onClick ? addBtn.onClick() : $emit('add')">
                  {{ getAddBtnLabel }}
                </Button>
              </template>
            </template>
          </slot>
          <Dropdown
            v-if="hasExportOrImport"
            closeOnSelect
            position="bottom-end"
            :options="dropdownOptions"
            @on-select="handleDropdownSelect">
            <template #trigger>
              <Button
                variant="outline"
                icon="lucide:more-vertical"
                class="px-2!"
                :title="
                  $t('vlite.screen.moreOptions') !== 'vlite.screen.moreOptions'
                    ? $t('vlite.screen.moreOptions')
                    : 'More Options'
                " />
            </template>
          </Dropdown>
          <slot name="after-add" />
        </div>
      </div>
    </div>
    <slot name="custom-header" v-else />
    <slot name="sub-header" />
    <div class="flex-1 w-full relative" :class="containerClass">
      <template v-if="!hasData && !loading">
        <slot name="empty">
          <Empty
            :title="emptyTitle"
            :titleI18n="emptyTitleI18n"
            :description="emptyDescription"
            :descriptionI18n="emptyDescriptionI18n"
            :icon="emptyIcon">
            <template #action>
              <!-- Action slot is only rendered when the user is NOT in a filtered state -->
              <template v-if="!isFiltered">
                <component v-if="rawAddComponent" :is="rawAddComponent" />
                <template v-else-if="canAdd">
                  <template v-if="addBtn">
                    <Modal v-if="addBtn.modal" :body="rawAddModal" v-bind="addBtn.modalProps">
                      <template #trigger>
                        <Button
                          :icon="addBtn.icon || 'fluent:add-16-filled'"
                          variant="secondary"
                          rounded="full"
                          class="px-6!"
                          v-bind="addBtn.buttonProps">
                          {{ getAddBtnLabel }}
                        </Button>
                      </template>
                    </Modal>
                    <router-link v-else-if="addBtn.to" :to="addBtn.to" class="inline-flex">
                      <Button
                        :icon="addBtn.icon || 'fluent:add-16-filled'"
                        variant="secondary"
                        v-bind="addBtn.buttonProps">
                        {{ getAddBtnLabel }}
                      </Button>
                    </router-link>

                    <a
                      v-else-if="addBtn.href"
                      :href="addBtn.href"
                      :target="addBtn.target"
                      class="inline-flex">
                      <Button
                        :icon="addBtn.icon || 'lucide:plus'"
                        variant="secondary"
                        v-bind="addBtn.buttonProps">
                        {{ getAddBtnLabel }}
                      </Button>
                    </a>
                  </template>
                </template>
              </template>
            </template>
          </Empty>
        </slot>
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
    <Modal
      v-if="showExportDataModal"
      v-model:show="showExportDataModal"
      :title="txtExportData"
      max-width="sm:max-w-[400px]">
      <template #default="{ close }">
        <ExportData
          ref="exportDataRef"
          :data="data || []"
          :fields="resolveExportFields"
          :mode="effectiveExportMode"
          :on-export="handleBackendExport"
          v-bind="typeof exportProps === 'object' ? exportProps : {}"
          :title="txtExportData"
          class="hidden!" />
        <div class="px-1 py-1 text-sm">
          <h6 class="font-medium mb-3 text-muted-foreground">
            {{
              $t('vlite.exportData.selectFormat') !== 'vlite.exportData.selectFormat'
                ? $t('vlite.exportData.selectFormat')
                : 'Select Export Format'
            }}
          </h6>
          <div class="space-y-3">
            <Button
              v-for="format in exportDataRef?.availableFormats || [
                { value: 'excel', label: 'Excel (.xlsx)', icon: 'lucide:file-spreadsheet' },
                { value: 'csv', label: 'CSV (.csv)', icon: 'lucide:file-text' },
                { value: 'json', label: 'JSON (.json)', icon: 'lucide:file-json' },
              ]"
              :key="format.value"
              variant="outline"
              class="w-full flex items-center justify-start gap-3 h-12"
              @click="exportDataRef?.exportData(format.value, close)">
              <Icon :icon="format.icon" class="text-muted-foreground h-5 w-5" />
              <span>{{ format.label }}</span>
            </Button>
          </div>
        </div>
      </template>
    </Modal>
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
