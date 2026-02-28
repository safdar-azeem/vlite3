<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import Button from '@/components/Button.vue'
import { PaginationProps } from '.'
import { $t } from '@/utils/i18n'

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  totalItems: 1,
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

  emit('update:currentPage', 1)
  emit('change', 1)
}

const paginationRange = computed(() => {
  const totalPageNumbers = props.totalItems * 2 + 5

  if (totalPageNumbers >= props.totalPages) {
    return range(1, props.totalPages)
  }

  const leftSiblingIndex = Math.max(props.currentPage - props.totalItems, 1)
  const rightSiblingIndex = Math.min(props.currentPage + props.totalItems, props.totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < props.totalPages - 2

  const firstPageIndex = 1
  const lastPageIndex = props.totalPages

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * props.totalItems
    let leftRange = range(1, leftItemCount)
    return [...leftRange, 'DOTS', lastPageIndex]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * props.totalItems
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

const alignmentClass = computed(() => {
  if (props.alignment) {
    switch (props.alignment) {
      case 'start':
        return 'justify-start'
      case 'end':
        return 'justify-end'
      case 'between':
        return 'justify-between!'
      case 'center':
      default:
        return 'justify-center'
    }
  }

  return props.showPageInfo || props.showItemsPerPage ? 'justify-between' : 'justify-center'
})

const txtShow = computed(() => { const r = $t('vlite.pagination.show'); return r !== 'vlite.pagination.show' ? r : 'Show' })
const txtPerPage = computed(() => { const r = $t('vlite.pagination.perPage'); return r !== 'vlite.pagination.perPage' ? r : 'per page' })
const txtPage = computed(() => { const r = $t('vlite.pagination.page'); return r !== 'vlite.pagination.page' ? r : 'Page' })
const txtOf = computed(() => { const r = $t('vlite.pagination.of'); return r !== 'vlite.pagination.of' ? r : 'of' })
const txtPrev = computed(() => { const r = $t('vlite.pagination.previous'); return r !== 'vlite.pagination.previous' ? r : 'Previous' })
const txtNext = computed(() => { const r = $t('vlite.pagination.next'); return r !== 'vlite.pagination.next' ? r : 'Next' })
</script>

<template>
  <div class="flex flex-col md:flex-row items-center gap-4 w-full" :class="[alignmentClass]">
    <div
      v-if="showPageInfo || showItemsPerPage"
      class="flex flex-wrap items-center justify-center md:justify-start gap-4 order-2 md:order-1">
      <div v-if="showItemsPerPage" class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="whitespace-nowrap">{{ txtShow }}</span>
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
        <span class="whitespace-nowrap">{{ txtPerPage }}</span>
      </div>

      <div v-if="showItemsPerPage && showPageInfo" class="hidden md:block w-px h-4 bg-border"></div>

      <span v-if="showPageInfo" class="text-sm text-muted-foreground whitespace-nowrap">
        {{ txtPage }} <span class="font-medium text-foreground">{{ currentPage }}</span> {{ txtOf }}
        <span class="font-medium text-foreground">{{ totalPages }}</span>
      </span>
    </div>

    <nav class="flex items-center justify-center gap-1 order-1 md:order-2" aria-label="Pagination">
      <Button
        v-if="showEdges"
        variant="ghost"
        size="sm"
        icon="lucide:chevrons-left"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(1)" />

      <Button
        v-if="navType === 'icon'"
        variant="ghost"
        size="sm"
        icon="lucide:chevron-left"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(currentPage - 1)" />

      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)">
          {{ txtPrev }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-left"
          class="flex sm:hidden"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)" />
      </template>

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

      <Button
        v-if="navType === 'icon'"
        variant="ghost"
        size="sm"
        icon="lucide:chevron-right"
        :disabled="disabled || currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)" />

      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)">
          {{ txtNext }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-right"
          class="flex sm:hidden"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)" />
      </template>

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

