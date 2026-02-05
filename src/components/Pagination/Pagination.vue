<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import Button from '@/components/Button.vue'

interface Props {
  currentPage?: number
  totalPages: number
  siblingCount?: number
  disabled?: boolean
  showEdges?: boolean

  // New Feature Props
  showPageInfo?: boolean // "Page 1 of 10"
  showItemsPerPage?: boolean // "Show 10"
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  navType?: 'text' | 'icon' // Default 'text' (responsive) vs 'icon' (always arrows)
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  siblingCount: 1,
  disabled: false,
  showEdges: false,
  showPageInfo: false,
  showItemsPerPage: false,
  itemsPerPage: 10,
  itemsPerPageOptions: () => [10, 25, 50, 100],
  navType: 'text',
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'change', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'change:itemsPerPage', value: number): void
}>()

const handlePageChange = (page: number) => {
  if (props.disabled) return
  if (page < 1 || page > props.totalPages) return
  if (page === props.currentPage) return

  emit('update:currentPage', page)
  emit('change', page)
}

const handleItemsPerPageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = parseInt(target.value)
  emit('update:itemsPerPage', value)
  emit('change:itemsPerPage', value)

  // Reset to page 1 is usually good practice when changing limit, but let parent decide
  emit('update:currentPage', 1)
  emit('change', 1)
}

// Logic to generate the range of page numbers
const paginationRange = computed(() => {
  const totalPageNumbers = props.siblingCount * 2 + 5

  if (totalPageNumbers >= props.totalPages) {
    return range(1, props.totalPages)
  }

  const leftSiblingIndex = Math.max(props.currentPage - props.siblingCount, 1)
  const rightSiblingIndex = Math.min(props.currentPage + props.siblingCount, props.totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < props.totalPages - 2

  const firstPageIndex = 1
  const lastPageIndex = props.totalPages

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * props.siblingCount
    let leftRange = range(1, leftItemCount)
    return [...leftRange, 'DOTS', lastPageIndex]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * props.siblingCount
    let rightRange = range(props.totalPages - rightItemCount + 1, props.totalPages)
    return [firstPageIndex, 'DOTS', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex]
  }

  return []
})

const range = (start: number, end: number) => {
  let length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}
</script>

<template>
  <div
    class="flex flex-col md:flex-row items-center gap-4 w-full"
    :class="[showPageInfo || showItemsPerPage ? 'justify-between' : 'justify-center']">
    <!-- Left Group: Page Info & Items Per Page -->
    <div
      v-if="showPageInfo || showItemsPerPage"
      class="flex flex-wrap items-center justify-center md:justify-start gap-4 order-2 md:order-1">
      <!-- Items Per Page -->
      <div v-if="showItemsPerPage" class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="whitespace-nowrap">Show</span>
        <div class="relative">
          <select
            :value="itemsPerPage"
            class="appearance-none bg-background border border-border hover:border-accent text-foreground py-1 pl-2 pr-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="disabled"
            @change="handleItemsPerPageChange">
            <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <Icon
            icon="lucide:chevron-down"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <span class="whitespace-nowrap">per page</span>
      </div>

      <!-- Separator if both present (optional, or just gap) -->
      <div v-if="showItemsPerPage && showPageInfo" class="hidden md:block w-px h-4 bg-border"></div>

      <!-- Page Info -->
      <span v-if="showPageInfo" class="text-sm text-muted-foreground whitespace-nowrap">
        Page <span class="font-medium text-foreground">{{ currentPage }}</span> of
        <span class="font-medium text-foreground">{{ totalPages }}</span>
      </span>
    </div>

    <!-- Navigation (Right or Center) -->
    <nav class="flex items-center justify-center gap-1 order-1 md:order-2" aria-label="Pagination">
      <!-- First -->
      <Button
        v-if="showEdges"
        variant="ghost"
        size="sm"
        icon="lucide:chevrons-left"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(1)" />

      <!-- Previous -->
      <!-- Icon Only Mode -->
      <Button
        v-if="navType === 'icon'"
        variant="ghost"
        size="sm"
        icon="lucide:chevron-left"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(currentPage - 1)" />

      <!-- Text Mode (Responsive) -->
      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)">
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-left"
          class="flex sm:hidden"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)" />
      </template>

      <!-- Numbers -->
      <template v-for="(page, index) in paginationRange" :key="index">
        <div v-if="page === 'DOTS'" class="px-2 text-gray-400 select-none">...</div>
        <Button
          v-else
          size="sm"
          :variant="page === currentPage ? 'outline' : 'ghost'"
          :class="{
            'bg-white text-primary border-primary ring-1 ring-primary pointer-events-none z-10':
              page === currentPage,
            'text-gray-600 hover:bg-gray-100': page !== currentPage,
          }"
          :disabled="disabled"
          @click="handlePageChange(page as number)">
          {{ page }}
        </Button>
      </template>

      <!-- Next -->
      <!-- Icon Only Mode -->
      <Button
        v-if="navType === 'icon'"
        variant="ghost"
        size="sm"
        icon="lucide:chevron-right"
        :disabled="disabled || currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)" />

      <!-- Text Mode (Responsive) -->
      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)">
          Next
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-right"
          class="flex sm:hidden"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)" />
      </template>

      <!-- Last -->
      <Button
        v-if="showEdges"
        variant="ghost"
        size="sm"
        icon="lucide:chevrons-right"
        :disabled="disabled || currentPage === totalPages"
        @click="handlePageChange(totalPages)" />
    </nav>
  </div>
</template>
