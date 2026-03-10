<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import Button from '@/components/Button.vue'
import type { PaginationProps } from '.'
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
  activeVariant: 'solid',
  rounded: 'full',
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
    const leftItemCount = 3 + 2 * props.totalItems
    const leftRange = range(1, leftItemCount)
    return [...leftRange, 'DOTS', lastPageIndex]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * props.totalItems
    const rightRange = range(props.totalPages - rightItemCount + 1, props.totalPages)
    return [firstPageIndex, 'DOTS', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex]
  }

  return []
})

const range = (start: number, end: number) => {
  const length = end - start + 1
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

/**
 * Maps the `rounded` prop to a Tailwind border-radius class applied to each page button.
 */
const roundedClass = computed(() => {
  switch (props.rounded) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'lg':
      return 'rounded-lg'
    case 'full':
      return 'rounded-full'
    case 'md':
    default:
      return 'rounded-md'
  }
})

/**
 * Returns the Button `variant` and additional classes for an active/current page button
 * based on the `activeVariant` prop.
 *
 * - `outline`: bordered + ring (legacy default)
 * - `solid`:   filled background using primary color, white text, no ring
 * - `ghost`:   ghost with a subtle highlighted background
 */
const getActivePageClasses = computed(() => {
  switch (props.activeVariant) {
    case 'solid':
      return {
        variant: 'primary' as const,
        extraClass: 'pointer-events-none z-10',
      }
    case 'ghost':
      return {
        variant: 'ghost' as const,
        extraClass: 'bg-accent text-accent-foreground pointer-events-none z-10 font-semibold',
      }
    case 'outline':
    default:
      return {
        variant: 'outline' as const,
        extraClass:
          'bg-white text-primary border-primary ring-1 ring-primary pointer-events-none z-10',
      }
  }
})

const txtShow = computed(() => {
  const r = $t('vlite.pagination.show')
  return r !== 'vlite.pagination.show' ? r : 'Show'
})
const txtPerPage = computed(() => {
  const r = $t('vlite.pagination.perPage')
  return r !== 'vlite.pagination.perPage' ? r : 'per page'
})
const txtPage = computed(() => {
  const r = $t('vlite.pagination.page')
  return r !== 'vlite.pagination.page' ? r : 'Page'
})
const txtOf = computed(() => {
  const r = $t('vlite.pagination.of')
  return r !== 'vlite.pagination.of' ? r : 'of'
})
const txtPrev = computed(() => {
  const r = $t('vlite.pagination.previous')
  return r !== 'vlite.pagination.previous' ? r : 'Previous'
})
const txtNext = computed(() => {
  const r = $t('vlite.pagination.next')
  return r !== 'vlite.pagination.next' ? r : 'Next'
})
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
        {{ txtPage }} <span class="font-medium text-foreground">{{ currentPage }}</span>
        {{ txtOf }}
        <span class="font-medium text-foreground">{{ totalPages }}</span>
      </span>
    </div>

    <nav class="flex items-center justify-center gap-1 order-1 md:order-2" aria-label="Pagination">
      <Button
        v-if="showEdges"
        variant="ghost"
        size="sm"
        icon="lucide:chevrons-left"
        :class="roundedClass"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(1)" />

      <Button
        v-if="navType === 'icon'"
        variant="ghost"
        size="sm"
        icon="lucide:chevron-left"
        :class="roundedClass"
        :disabled="disabled || currentPage === 1"
        @click="handlePageChange(currentPage - 1)" />

      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :class="roundedClass"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)">
          {{ txtPrev }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-left"
          class="flex sm:hidden"
          :class="roundedClass"
          :disabled="disabled || currentPage === 1"
          @click="handlePageChange(currentPage - 1)" />
      </template>

      <template v-for="(page, index) in paginationRange" :key="index">
        <div v-if="page === 'DOTS'" class="px-2 text-muted-foreground select-none">...</div>

        <!-- Active / current page button -->
        <Button
          v-else-if="page === currentPage"
          size="sm"
          :variant="getActivePageClasses.variant"
          :class="[getActivePageClasses.extraClass, roundedClass]"
          :disabled="disabled">
          {{ page }}
        </Button>

        <!-- Inactive page button -->
        <Button
          v-else
          size="sm"
          variant="ghost"
          :class="['text-gray-600 hover:bg-gray-100', roundedClass]"
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
        :class="roundedClass"
        :disabled="disabled || currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)" />

      <template v-else>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          :class="roundedClass"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)">
          {{ txtNext }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="lucide:chevron-right"
          class="flex sm:hidden"
          :class="roundedClass"
          :disabled="disabled || currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)" />
      </template>

      <Button
        v-if="showEdges"
        variant="ghost"
        size="sm"
        icon="lucide:chevrons-right"
        :class="roundedClass"
        :disabled="disabled || currentPage === totalPages"
        @click="handlePageChange(totalPages)" />
    </nav>
  </div>
</template>
