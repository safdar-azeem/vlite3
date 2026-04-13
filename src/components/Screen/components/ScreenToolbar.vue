<script setup lang="ts">
import Button from '../../Button.vue'
import Input from '../../Input.vue'
import ScreenViewToggle from './ScreenViewToggle.vue'
import ScreenFilter from '../ScreenFilter.vue'
import ScreenAddAction from './ScreenAddAction.vue'
import ScreenOptionsDropdown from './ScreenOptionsDropdown.vue'

defineProps<{
  selectedRows: any[]
  hideSelectable?: boolean
  hideDeleteBtn?: boolean
  txtDeleteSelected: string
  hasMultipleViews: boolean
  activeView: string
  resolvedViews: any[]
  showRefresh?: boolean
  loading?: boolean
  txtRefresh: string
  filterSchema?: any[]
  filterType?: string
  activeFilters: any
  canSearch?: boolean
  searchQuery: string
  txtSearch: string
  canAdd?: boolean
  addComponent?: any
  addBtn?: any
  data?: any[]
  refetch?: any
  hasExportOrImport?: boolean
  exportProps?: any
  importProps?: any
  screenState: any
}>()

defineEmits<{
  (e: 'update:activeView', val: string): void
  (e: 'update:activeFilters', val: any): void
  (e: 'update:searchQuery', val: string): void
  (e: 'delete', items: any[]): void
  (e: 'refresh'): void
  (e: 'add'): void
  (e: 'select-dropdown', opt: any): void
}>()
</script>

<template>
  <div>
    <div class="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none justify-start sm:justify-end">
      <Button
        v-if="selectedRows.length > 0 && !hideSelectable && !hideDeleteBtn"
        variant="outline"
        class="hover:bg-destructive/10 shrink-0 h-9! w-9!"
        icon="lucide:trash-2"
        :title="txtDeleteSelected"
        @click="$emit('delete', selectedRows)" />

      <ScreenViewToggle
        v-if="hasMultipleViews"
        :model-value="activeView"
        @update:model-value="$emit('update:activeView', $event)"
        :views="resolvedViews" />

      <slot name="before-search" v-bind="screenState" />

      <Button
        v-if="showRefresh"
        variant="outline"
        icon="lucide:refresh-cw"
        size="lg"
        class="shrink-0 h-9! w-9!"
        :title="txtRefresh"
        :disabled="loading"
        @click="$emit('refresh')" />

      <ScreenFilter
        v-if="filterSchema && filterSchema.length > 0"
        :schema="filterSchema"
        :type="filterType as any"
        :model-value="activeFilters"
        @update:model-value="$emit('update:activeFilters', $event)"
        @change="$emit('refresh')" />

      <div v-if="canSearch" class="w-full md:w-60! max-sm:order-last">
        <Input
          lazy
          :model-value="searchQuery"
          @update:model-value="$emit('update:searchQuery', $event)"
          icon="lucide:search"
          :placeholder="txtSearch"
          variant="outline"
          class="bg-background w-full"
          :show-clear-button="true" />
      </div>
    </div>

    <div class="flex items-center gap-3 max-sm:w-full sm:w-auto max-sm:order-last">
      <slot name="actions" v-bind="screenState">
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
        @select="$emit('select-dropdown', $event)" />

      <slot name="after-add" v-bind="screenState" />
    </div>
  </div>
</template>
