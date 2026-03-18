<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../../Icon.vue'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  modelValue: 'table' | 'list'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: 'table' | 'list'): void
}>()

const txtListView = computed(() => {
  const r = $t('vlite.screen.listView')
  return r !== 'vlite.screen.listView' ? r : 'List View'
})
const txtTableView = computed(() => {
  const r = $t('vlite.screen.tableView')
  return r !== 'vlite.screen.tableView' ? r : 'Table View'
})
</script>

<template>
  <div class="flex items-center p-1 rounded-md border border-border shrink-0">
    <button
      @click="emit('update:modelValue', 'table')"
      class="p-1.5 rounded"
      :class="[
        modelValue === 'table'
          ? 'bg-secondary/85 dark:bg-secondary shadow-sm text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      :title="txtTableView">
      <Icon icon="lucide:list" class="w-4 h-4" />
    </button>

    <button
      @click="emit('update:modelValue', 'list')"
      class="p-1.5 rounded"
      :class="[
        modelValue === 'list'
          ? 'bg-secondary/85 dark:bg-secondary shadow-sm text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      :title="txtListView">
      <Icon icon="lucide:layout-grid" class="w-4 h-4" />
    </button>
  </div>
</template>
