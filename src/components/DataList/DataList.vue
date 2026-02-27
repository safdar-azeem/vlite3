<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pagination } from '../Pagination'
import { Empty } from '../Empty'
import type { DataListProps } from './types'

const props = withDefaults(defineProps<DataListProps>(), {
  data: () => [],
  loading: false,
  className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
  itemProps: () => ({}),
  emptyTitle: 'No data found',
  emptyDescription: 'We could not find any items to display here.',
  emptyIcon: 'lucide:inbox',
  showPagination: true,
  paginationProps: () => ({
    alignment: 'end',
    navType: 'icon',
    showItemsPerPage: false,
    itemsPerPageOptions: [10, 25, 50, 100],
    showPageInfo: false,
  }),
})

const emit = defineEmits<{
  (e: 'change', payload: { page: number; limit: number }): void
}>()

const internalLimit = ref(props.pageInfo?.itemsPerPage || props.paginationProps?.itemsPerPage || 10)

watch(
  () => props.pageInfo?.itemsPerPage,
  (newVal) => {
    if (newVal !== undefined) internalLimit.value = newVal
  }
)

watch(
  () => props.paginationProps?.itemsPerPage,
  (newVal) => {
    if (newVal !== undefined) internalLimit.value = newVal
  }
)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const triggerChange = (page: number, limit: number) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('change', { page, limit })
  }, 10)
}

const handlePageChange = (page: number) => {
  triggerChange(page, internalLimit.value)
}

const handleItemsPerPageChange = (limit: number) => {
  internalLimit.value = limit
  triggerChange(props.pageInfo?.currentPage || 1, limit)
}

const currentPage = computed(() => props.pageInfo?.currentPage || 1)
const totalPages = computed(() => props.pageInfo?.totalPages || 1)
</script>

<template>
  <div class="flex flex-col w-full">
    <div v-if="loading" :class="className">
      <template v-for="i in 8" :key="'skeleton-' + i">
        <slot name="skeleton" :index="i">
          <slot name="skelton" :index="i">
            <component v-if="skeleton || skelton" :is="skeleton || skelton" />
            <div v-else class="h-48 rounded-lg bg-gray-200 animate-pulse w-full"></div>
          </slot>
        </slot>
      </template>
    </div>

    <template v-else-if="!data || data.length === 0">
      <slot name="empty">
        <Empty
          :title="emptyTitle"
          :description="emptyDescription"
          :icon="emptyIcon"
        />
      </slot>
    </template>

    <div v-else :class="className">
      <template v-for="(itemData, index) in data" :key="index">
        <slot name="item" :item="itemData" :data="data" :index="index">
          <component
            v-if="item"
            :is="item"
            :item="itemData"
            :data="data"
            :index="index"
            v-bind="itemProps" />
        </slot>
      </template>
    </div>

    <div v-if="showPagination && pageInfo && totalPages > 1" class="mt-8 w-full">
      <Pagination
        :current-page="pageInfo?.currentPage"
        :total-pages="pageInfo?.totalPages"
        :total-items="pageInfo?.totalItems"
        navType="icon"
        v-bind="paginationProps"
        @change="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange" />
    </div>
  </div>
</template>
