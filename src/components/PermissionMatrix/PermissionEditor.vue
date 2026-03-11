<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PermissionTopBar from './PermissionTopBar.vue'
import PermissionEditorList from './PermissionEditorList.vue'
import PermissionEditorMatrix from './PermissionEditorMatrix.vue'
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
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isMatrix = computed(() => props.layout === 'matrix')

// ── Search & Filters ──
const searchQuery = ref('')
const selectedGroupKeys = ref<string[]>([])

const activeGroups = computed(() => (isMatrix.value ? props.matrixGroups : props.groups))

const groupOptions = computed(() =>
  activeGroups.value.map((g) => ({
    label: g.label,
    value: g.key,
    icon: g.icon,
  }))
)

// ── Collapsed State ──
const collapsedGroups = ref<Set<string>>(new Set())
const baseCollapsedGroups = ref<Set<string>>(new Set())

function computeBaseCollapsed(): Set<string> {
  if (props.defaultExpanded && props.defaultExpanded.length > 0) {
    const allKeys = activeGroups.value.map((g) => g.key)
    return new Set(allKeys.filter((k) => !props.defaultExpanded.includes(k)))
  }
  return new Set()
}

onMounted(() => {
  const base = computeBaseCollapsed()
  baseCollapsedGroups.value = base
  collapsedGroups.value = new Set(base)
})

watch(searchQuery, (query) => {
  if (query.trim()) {
    const q = query.toLowerCase()
    const matchedKeys = new Set<string>()

    if (isMatrix.value) {
      for (const group of props.matrixGroups) {
        const hasMatch =
          group.label.toLowerCase().includes(q) ||
          group.rows.some(
            (r) => r.label.toLowerCase().includes(q) || r.key.toLowerCase().includes(q)
          )
        if (hasMatch) matchedKeys.add(group.key)
      }
    } else {
      for (const group of props.groups) {
        const hasMatch =
          group.label.toLowerCase().includes(q) ||
          group.permissions.some(
            (p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
          )
        if (hasMatch) matchedKeys.add(group.key)
      }
    }
    const allKeys = activeGroups.value.map((g) => g.key)
    collapsedGroups.value = new Set(allKeys.filter((k) => !matchedKeys.has(k)))
  } else {
    collapsedGroups.value = new Set(baseCollapsedGroups.value)
  }
})

function toggleGroupCollapse(groupKey: string) {
  if (!props.collapsible) return
  const next = new Set(collapsedGroups.value)
  if (next.has(groupKey)) next.delete(groupKey)
  else next.add(groupKey)

  collapsedGroups.value = next
  if (!searchQuery.value.trim()) {
    baseCollapsedGroups.value = new Set(next)
  }
}

// ── Filtered Data ──
const filteredGroups = computed<PermissionGroup[]>(() => {
  let result = props.groups
  if (selectedGroupKeys.value.length > 0) {
    result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result
      .map((group) => {
        const filteredPerms = group.permissions.filter(
          (p) =>
            p.label.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
        )
        if (filteredPerms.length === 0) return null
        return { ...group, permissions: filteredPerms }
      })
      .filter(Boolean) as PermissionGroup[]
  }
  return result
})

const filteredMatrixGroups = computed<PermissionMatrixGroup[]>(() => {
  let result = props.matrixGroups
  if (selectedGroupKeys.value.length > 0) {
    result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result
      .map((group) => {
        const filteredRows = group.rows.filter(
          (r) =>
            r.label.toLowerCase().includes(q) ||
            r.key.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
        )
        if (filteredRows.length === 0) return null
        return { ...group, rows: filteredRows }
      })
      .filter(Boolean) as PermissionMatrixGroup[]
  }
  return result
})

// ── Stats & Actions ──
const totalPerms = computed(() => {
  if (isMatrix.value) {
    return props.matrixGroups.reduce(
      (sum, g) =>
        sum +
        g.rows.reduce(
          (rs, r) => rs + r.actions.filter((a: any) => r.actions.includes(a?.key)).length,
          0
        ),
      0
    )
  }
  return props.groups.reduce((sum, g) => sum + g.permissions.length, 0)
})

function selectAll() {
  if (props.readonly) return
  if (isMatrix.value) {
    const allKeys = getAllMatrixKeys(props.matrixGroups)
    const existing = props.modelValue.filter((k) => !allKeys.includes(k))
    emit('update:modelValue', [...existing, ...allKeys])
  } else {
    const allKeys = props.groups.flatMap((g) => g.permissions.map((p) => p.key))
    emit('update:modelValue', allKeys)
  }
}

function deselectAll() {
  if (props.readonly) return
  if (isMatrix.value) {
    const allKeys = new Set(getAllMatrixKeys(props.matrixGroups))
    emit(
      'update:modelValue',
      props.modelValue.filter((k) => !allKeys.has(k))
    )
  } else {
    emit('update:modelValue', [])
  }
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
      @update:model-value="$emit('update:modelValue', $event)"
      @toggle-collapse="toggleGroupCollapse" />

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
      @toggle-collapse="toggleGroupCollapse" />
  </div>
</template>
