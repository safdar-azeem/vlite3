<script setup lang="ts">
import { computed } from 'vue'
import PermissionTopBar from './PermissionTopBar.vue'
import PermissionEditorList from './PermissionEditorList.vue'
import PermissionEditorMatrix from './PermissionEditorMatrix.vue'
import { usePermissionSearch } from './usePermissionSearch'
import { usePermissionState } from './usePermissionState'
import { getAllMatrixKeys } from './utils'
import type {
  PermissionGroup,
  PermissionToggleMode,
  PermissionMatrixSize,
  PermissionEditorLayout,
  PermissionMatrixGroup,
} from './types'

export interface PermissionEditorProps {
  groups?: PermissionGroup[]
  modelValue: string[]
  toggleMode?: PermissionToggleMode
  searchable?: boolean
  collapsible?: boolean
  readonly?: boolean
  size?: PermissionMatrixSize
  class?: string
  defaultExpanded?: string[]
  layout?: PermissionEditorLayout
  matrixGroups?: PermissionMatrixGroup[]
  stickyHeader?: boolean
}

const props = withDefaults(defineProps<PermissionEditorProps>(), {
  toggleMode: 'checkbox',
  searchable: true,
  collapsible: true,
  readonly: false,
  size: 'md',
  class: '',
  defaultExpanded: () => [],
  layout: 'list',
  groups: () => [],
  matrixGroups: () => [],
  stickyHeader: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isMatrix = computed(() => props.layout === 'matrix')

// ── Group options for the filter dropdown ──────────────────────────────────
const groupOptions = computed(() =>
  (isMatrix.value ? props.matrixGroups : props.groups).map((g) => ({
    label: g.label,
    value: g.key,
    icon: g.icon,
  }))
)

// ── Search + collapse composable ──────────────────────────────────────────
const {
  searchQuery,
  selectedGroupKeys,
  collapsedGroups,
  filteredGroups,
  filteredMatrixGroups,
  toggleGroupCollapse,
} = usePermissionSearch(
  () => isMatrix.value,
  () => props.groups,
  () => props.matrixGroups,
  () => props.defaultExpanded
)

// ── Permission state composable (Set-based) ───────────────────────────────
const {
  selectAllList,
  deselectAllList,
  selectAllMatrix,
  deselectAllMatrix,
} = usePermissionState(() => props.modelValue)

// ── Stats ─────────────────────────────────────────────────────────────────
const totalPerms = computed(() => {
  if (isMatrix.value) {
    // Count unique enabled keys across all matrix groups
    return getAllMatrixKeys(props.matrixGroups).length
  }
  return props.groups.reduce((sum, g) => sum + g.permissions.length, 0)
})

// ── Bulk actions — single emit each ──────────────────────────────────────
function selectAll() {
  if (props.readonly) return
  if (isMatrix.value) {
    emit('update:modelValue', selectAllMatrix(props.matrixGroups, props.modelValue))
  } else {
    emit('update:modelValue', selectAllList(props.groups))
  }
}

function deselectAll() {
  if (props.readonly) return
  if (isMatrix.value) {
    emit('update:modelValue', deselectAllMatrix(props.matrixGroups, props.modelValue))
  } else {
    emit('update:modelValue', deselectAllList())
  }
}

function handleToggleCollapse(groupKey: string) {
  toggleGroupCollapse(groupKey, props.collapsible)
}
</script>

<template>
  <div :class="['permission-editor', props.class]">
    <PermissionTopBar
      v-model:searchQuery="searchQuery"
      v-model:selectedGroupKeys="selectedGroupKeys"
      :searchable="searchable"
      :size="size"
      :readonly="readonly"
      :total-perms="totalPerms"
      :selected-count="modelValue.length"
      :group-options="groupOptions"
      @select-all="selectAll"
      @clear-all="deselectAll" />

    <PermissionEditorMatrix
      v-if="isMatrix"
      :matrix-groups="filteredMatrixGroups"
      :model-value="modelValue"
      :collapsed-groups="collapsedGroups"
      :toggle-mode="toggleMode"
      :readonly="readonly"
      :size="size"
      :collapsible="collapsible"
      :sticky-header="stickyHeader"
      @update:model-value="$emit('update:modelValue', $event)"
      @toggle-collapse="handleToggleCollapse" />

    <PermissionEditorList
      v-else
      :groups="filteredGroups"
      :model-value="modelValue"
      :collapsed-groups="collapsedGroups"
      :toggle-mode="toggleMode"
      :readonly="readonly"
      :size="size"
      :collapsible="collapsible"
      @update:model-value="$emit('update:modelValue', $event)"
      @toggle-collapse="handleToggleCollapse" />
  </div>
</template>
