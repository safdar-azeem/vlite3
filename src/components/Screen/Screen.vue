<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Input from '../Input.vue'
import Button from '../Button.vue'
import Icon from '../Icon.vue'
import { Pagination } from '../Pagination'
import type { ScreenProps } from './types'

const props = withDefaults(defineProps<ScreenProps>(), {
  title: '',
  description: '',
  data: () => [],
  loading: false,
  customHeader: false,
  canSearch: true,
  canAdd: true,
  pagination: true,
  emptyTitle: 'No records found',
  emptyDescription: 'We could not find any records matching your criteria.',
  emptyIcon: 'lucide:inbox',
  paginationProps: () => ({
    alignment: 'end',
    navType: 'icon',
    showItemsPerPage: false,
    itemsPerPageOptions: [10, 25, 50, 100],
  }),
})

const emit = defineEmits<{
  (e: 'add'): void
  (
    e: 'change',
    payload: { pagination: { page: number; limit: number }; filter: { search: string } }
  ): void
}>()

const activeView = ref<'table' | 'list'>(props.table ? 'table' : 'list')
const searchQuery = ref('')
const internalPage = ref(props.pageInfo?.currentPage || 1)
const internalLimit = ref(props.pageInfo?.itemsPerPage || props.paginationProps?.itemsPerPage || 10)

// Sync page info
watch(
  () => props.pageInfo?.currentPage,
  (newVal) => {
    if (newVal) internalPage.value = newVal
  }
)

watch(
  () => props.pageInfo?.itemsPerPage,
  (newVal) => {
    if (newVal) internalLimit.value = newVal
  }
)

// Debounced Search
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    internalPage.value = 1
    triggerChange()
  }, 300)
})

const handlePageChange = (page: number) => {
  internalPage.value = page
  triggerChange()
}

const handleItemsPerPageChange = (limit: number) => {
  internalLimit.value = limit
  internalPage.value = 1
  triggerChange()
}

const triggerChange = () => {
  const payload = {
    pagination: {
      page: internalPage.value,
      limit: internalLimit.value,
    },
    filter: {
      search: searchQuery.value,
    },
  }
  emit('change', payload)
  if (props.refetch) {
    props.refetch(payload)
  }
}

const activeComponent = computed(() => {
  return activeView.value === 'table' && props.table ? props.table : props.list
})

const hasData = computed(() => props.data && props.data.length > 0)
</script>

<template>
  <div class="flex flex-col w-full space-y-8">
    <div
      v-if="!customHeader"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex flex-col">
        <slot name="title">
          <h1 v-if="title" class="text-2xl font-bold text-foreground">{{ title }}</h1>
        </slot>
        <slot name="description">
          <p v-if="description" class="text-sm text-gray-700 mt-1.5">{{ description }}</p>
        </slot>
      </div>

      <div class="flex items-center gap-3">
        <div v-if="table && list" class="flex items-center p-1 rounded-md border border-border">
          <button
            @click="activeView = 'list'"
            class="p-1.5 rounded transition-colors"
            :class="[
              activeView === 'list'
                ? 'bg-secondary/70 shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            title="List View">
            <Icon icon="lucide:layout-grid" class="w-4 h-4" />
          </button>
          <button
            @click="activeView = 'table'"
            class="p-1.5 rounded transition-colors"
            :class="[
              activeView === 'table'
                ? 'bg-secondary/70 shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            title="Table View">
            <Icon icon="lucide:list" class="w-4 h-4" />
          </button>
        </div>
        <div v-if="canSearch" class="w-full sm:w-64!">
          <Input
            v-model="searchQuery"
            icon="lucide:search"
            placeholder="Search..."
            variant="outline"
            class="bg-background w-full"
            :show-clear-button="true" />
        </div>
        <slot name="actions">
          <component v-if="addComponent" :is="addComponent" />
          <Button v-else-if="canAdd" icon="lucide:plus" variant="primary" @click="$emit('add')">
            Add
          </Button>
        </slot>
      </div>
    </div>

    <slot name="custom-header" v-else />

    <div class="flex-1 w-full relative min-h-[300px]">
      <template v-if="!hasData && !loading">
        <slot name="empty">
          <div
            class="flex flex-col items-center justify-center py-16 px-4 text-center bg-card border border-border rounded-lg shadow-sm">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Icon :icon="emptyIcon" class="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold text-foreground">{{ emptyTitle }}</h3>
            <p class="mt-2 text-sm text-muted-foreground max-w-sm">{{ emptyDescription }}</p>
            <div class="mt-6">
              <component v-if="addComponent" :is="addComponent" />
              <Button v-else-if="canAdd" icon="lucide:plus" variant="outline" @click="$emit('add')">
                Add New
              </Button>
            </div>
          </div>
        </slot>
      </template>

      <template v-else>
        <component
          :is="activeComponent"
          v-if="activeComponent"
          :data="data"
          :loading="loading"
          :refetch="refetch" />
        <div
          v-else
          class="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
          Please provide a `:list` or `:table` component.
        </div>
      </template>
    </div>

    <div v-if="pagination && pageInfo && pageInfo.totalPages > 1" class="pt-2">
      <Pagination
        :current-page="pageInfo.currentPage"
        :total-pages="pageInfo.totalPages"
        :total-items="pageInfo.totalItems"
        v-bind="paginationProps"
        @change="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange" />
    </div>
  </div>
</template>
