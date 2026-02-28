<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'
import type { TableHeader, SortConfig } from './types'

interface Props {
  header: TableHeader
  sortConfig?: SortConfig
  compact?: boolean
  tableSortable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  tableSortable: true,
})

const emit = defineEmits<{
  (e: 'sort', field: string): void
}>()

const isSorted = computed(() => {
  return props.sortConfig?.field === props.header.field && props.sortConfig?.order
})

const sortIcon = computed(() => {
  if (!props.sortConfig || props.sortConfig.field !== props.header.field) {
    return 'lucide:chevrons-up-down'
  }
  if (props.sortConfig.order === 'asc') {
    return 'lucide:arrow-up'
  }
  if (props.sortConfig.order === 'desc') {
    return 'lucide:arrow-down'
  }
  return 'lucide:chevrons-up-down'
})

const handleSort = () => {
  if (props.tableSortable && props.header.sortable !== false) {
    emit('sort', props.header.field)
  }
}

const alignClass = computed(() => {
  const alignMap = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }
  return alignMap[props.header.align || 'left']
})

const displayTitle = computed(() => props.header.titleI18n ? $t(props.header.titleI18n) : props.header.title)
</script>

<template>
  <th
    scope="col"
    class="h-10 px-3 text-left align-middle font-medium text-muted-foreground transition-colors [&:has([role=checkbox])]:pr-0 overflow-hidden"
    :class="[
      compact ? 'py-2' : 'py-3!',
      header.sortable !== false ? 'cursor-pointer hover:bg-muted/50' : '',
      header.hideOnMobile ? 'hidden md:table-cell' : '',
    ]"
    @click="handleSort">
    <div class="flex items-center gap-2 space-x-2" :class="alignClass">
      <span class="text-xs font-bold! uppercase tracking-wider text-gray-900 truncate">{{
        displayTitle
      }}</span>

      <span v-if="tableSortable && header.sortable !== false" class="w-4 h-4 shrink-0">
        <Icon
          :icon="sortIcon"
          class="w-3.5 h-3.5 transition-all text-muted-foreground mt-0.5"
          :class="[
            isSorted ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-100',
          ]" />
      </span>
    </div>
  </th>
</template>

