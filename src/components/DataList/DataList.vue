<script setup lang="ts">
import { computed } from 'vue'
import { Pagination } from '../Pagination'
import Icon from '../Icon.vue'
import type { DataListProps } from './types'
import { PaginationProps } from '../Pagination'

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
  (e: 'page-change', page: number): void
  (e: 'update:itemsPerPage', limit: number): void
}>()

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleItemsPerPageChange = (limit: number) => {
  emit('update:itemsPerPage', limit)
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

    <div
      v-else-if="!data || data.length === 0"
      class="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
      <slot name="empty">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
          <Icon :icon="emptyIcon" class="h-6 w-6 text-gray-500" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900">{{ emptyTitle }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ emptyDescription }}</p>
      </slot>
    </div>

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
