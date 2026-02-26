<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataList } from '@/components/DataList'
import DemoSection from '../DemoSection.vue'
import { useGetUsers } from '../composables/useGetUsers'
import sourceCode from './DataListDemo.vue?raw'

import UserCard from './DataListCards/UserCard.vue'
import UserSkeleton from './DataListCards/UserSkeleton.vue'

const { result, loading, refetch } = useGetUsers()

// Pagination state
const itemsPerPage = ref(8)
const currentPage = ref(1)

const fetchData = () => {
  refetch({
    pagination: {
      page: currentPage.value,
      limit: itemsPerPage.value,
    },
    filter: {
      search: '',
      sorting: { field: '', order: '' },
    },
  })
}

onMounted(() => {
  fetchData()
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleLimitChange = (limit: number) => {
  itemsPerPage.value = limit
  currentPage.value = 1
  fetchData()
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">DataList</h2>
      <p class="text-gray-500">
        A flexible grid and list component with built-in pagination, empty states, and loading
        skeletons. Supports both slot-based and prop-based component rendering.
      </p>
    </div>

    <DemoSection title="Slot-based Rendering" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-6">
        Render items and skeletons seamlessly using Vue templates. Ideal for quick layouts without
        creating separate components.
      </p>

      <div class="bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-300">
        <DataList
          :data="result?.users"
          :loading="loading"
          :page-info="result?.pageInfo"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          @page-change="handlePageChange"
          @update:items-per-page="handleLimitChange">
          <template #skeleton>
            <div
              class="bg-card border border-border rounded-xl p-4 shadow-sm animate-pulse h-[116px] flex flex-col justify-between">
              <div class="h-4 bg-muted rounded w-2/3"></div>
              <div class="h-3 bg-muted rounded w-1/2"></div>
              <div class="h-8 bg-muted rounded mt-4 w-full"></div>
            </div>
          </template>

          <template #item="{ item }">
            <div
              class="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors flex flex-col justify-between h-full">
              <div>
                <h3 class="font-medium text-foreground truncate">{{ item.name }}</h3>
                <p class="text-sm text-muted-foreground truncate">{{ item.email }}</p>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <span
                  class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-medium">
                  {{ item.role }}
                </span>
              </div>
            </div>
          </template>
        </DataList>
      </div>
    </DemoSection>

    <DemoSection title="Component Prop-based Rendering" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-6">
        Pass entire Vue components to `:item` and `:skeleton` props for cleaner templates and highly
        reusable code architecture.
      </p>

      <div class="bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-300">
        <DataList
          :data="result?.users"
          :loading="loading"
          :page-info="result?.pageInfo"
          :item="UserCard"
          :skeleton="UserSkeleton"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          pagination-position="end"
          show-items-per-page
          @page-change="handlePageChange"
          @update:items-per-page="handleLimitChange" />
      </div>
    </DemoSection>
  </div>
</template>
