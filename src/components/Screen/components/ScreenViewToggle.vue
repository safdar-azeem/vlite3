<script setup lang="ts">
/**
 * ScreenViewToggle
 * ----------------
 * Renders a compact segmented control that switches between available views.
 *
 * Supports two modes:
 * 1. **Dynamic (preferred)** — pass `views` (ScreenView[]) for any number of views
 *    (table, list, kanban, calendar, etc.). Each view entry defines key, icon, label.
 * 2. **Legacy** — omit `views` and pass `modelValue` typed as 'table' | 'list',
 *    which renders the original two-button toggle (backward-compatible).
 */
import { computed } from 'vue'
import Icon from '../../Icon.vue'
import { $t } from '@/utils/i18n'
import type { ScreenView } from '../types'

const props = defineProps<{
  modelValue: string
  /** Dynamic views array. When provided, renders one button per entry. */
  views?: ScreenView[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

// ── Legacy fallback buttons when no dynamic views are passed ─────────────────
const txtListView = computed(() => {
  const r = $t('vlite.screen.listView')
  return r !== 'vlite.screen.listView' ? r : 'List View'
})
const txtTableView = computed(() => {
  const r = $t('vlite.screen.tableView')
  return r !== 'vlite.screen.tableView' ? r : 'Table View'
})

/** Legacy two-button definitions used when `views` prop is absent */
const legacyViews = computed(() => [
  { key: 'table', icon: 'lucide:list',        label: txtTableView.value },
  { key: 'list',  icon: 'lucide:layout-grid', label: txtListView.value  },
])

/** Resolved list of view buttons to render */
const resolvedViews = computed(() =>
  props.views && props.views.length > 0 ? props.views : legacyViews.value
)
</script>

<template>
  <div class="flex items-center p-1 rounded-md bg-body border border-border shrink-0">
    <button
      v-for="view in resolvedViews"
      :key="view.key"
      @click="emit('update:modelValue', view.key)"
      class="p-1.5 rounded"
      :class="[
        modelValue === view.key
          ? 'bg-secondary/85 dark:bg-secondary shadow-sm text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      :title="view.label">
      <Icon :icon="view.icon || 'lucide:layout-grid'" class="w-4 h-4" />
    </button>
  </div>
</template>
