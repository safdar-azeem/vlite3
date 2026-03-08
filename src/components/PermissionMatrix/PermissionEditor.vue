<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Input from '../Input.vue'
import Tooltip from '../Tooltip.vue'
import { Dropdown } from '../Dropdown'
import type {
  PermissionGroup,
  PermissionDef,
  PermissionToggleMode,
  PermissionMatrixSize,
  PermissionEditorLayout,
  PermissionMatrixGroup,
  PermissionMatrixRow,
} from './types'

export interface PermissionEditorProps {
  /** Permission groups with nested permissions (used in list layout) */
  groups?: PermissionGroup[]
  /** v-model: array of selected permission keys */
  modelValue: string[]
  /** Toggle display mode (default: 'checkbox') */
  toggleMode?: PermissionToggleMode
  /** Show search input (default: true) */
  searchable?: boolean
  /** Allow collapsing groups (default: true) */
  collapsible?: boolean
  /** Read-only mode (default: false) */
  readonly?: boolean
  /** Size variant (default: 'md') */
  size?: PermissionMatrixSize
  /** Extra CSS classes */
  class?: string
  /** Group keys to show expanded by default. Others will start collapsed.
   *  If not provided or empty, all groups start expanded. */
  defaultExpanded?: string[]
  /** Layout mode (default: 'list') */
  layout?: PermissionEditorLayout
  /** Matrix groups — used when layout is 'matrix' */
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

// ── Search ──
const searchQuery = ref('')

// ── Group filter (dropdown) ──
const selectedGroupKeys = ref<string[]>([])

const groupDropdownOptions = computed(() =>
  props.groups.map((g) => ({
    label: g.label,
    value: g.key,
    icon: g.icon,
  }))
)

function toggleGroupFilter(groupKey: string) {
  const current = selectedGroupKeys.value
  if (current.includes(groupKey)) {
    selectedGroupKeys.value = current.filter((k) => k !== groupKey)
  } else {
    selectedGroupKeys.value = [...current, groupKey]
  }
}

function clearGroupFilter() {
  selectedGroupKeys.value = []
}

// ── Collapsed groups ──
const collapsedGroups = ref<Set<string>>(new Set())
const baseCollapsedGroups = ref<Set<string>>(new Set())

// Initialize collapsed state from defaultExpanded prop
function computeBaseCollapsed(): Set<string> {
  if (props.defaultExpanded && props.defaultExpanded.length > 0) {
    const allGroupKeys = props.groups.map((g) => g.key)
    return new Set(allGroupKeys.filter((k) => !props.defaultExpanded.includes(k)))
  }
  return new Set()
}

onMounted(() => {
  const base = computeBaseCollapsed()
  baseCollapsedGroups.value = base
  collapsedGroups.value = new Set(base)
})

// Auto-expand matched groups on search, restore on clear
watch(searchQuery, (query) => {
  if (query.trim()) {
    // Expand all groups that have matching permissions
    const q = query.toLowerCase()
    const matchedKeys = new Set<string>()
    for (const group of props.groups) {
      const hasMatch =
        group.label.toLowerCase().includes(q) ||
        group.permissions.some(
          (p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
        )
      if (hasMatch) matchedKeys.add(group.key)
    }
    // Only collapse groups that DON'T match
    const allGroupKeys = props.groups.map((g) => g.key)
    collapsedGroups.value = new Set(allGroupKeys.filter((k) => !matchedKeys.has(k)))
  } else {
    // Restore base collapsed state
    collapsedGroups.value = new Set(baseCollapsedGroups.value)
  }
})

function toggleGroupCollapse(groupKey: string) {
  if (!props.collapsible) return
  const next = new Set(collapsedGroups.value)
  if (next.has(groupKey)) {
    next.delete(groupKey)
  } else {
    next.add(groupKey)
  }
  collapsedGroups.value = next
  // Update base state so manual toggles persist after search clears
  if (!searchQuery.value.trim()) {
    baseCollapsedGroups.value = new Set(next)
  }
}

// ── Filtered groups (search + group dropdown) ──
const filteredGroups = computed<PermissionGroup[]>(() => {
  let result = props.groups

  // Filter by selected group dropdown
  if (selectedGroupKeys.value.length > 0) {
    result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
  }

  // Filter by search query
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

// ── Permission helpers ──
function hasPerm(permKey: string): boolean {
  return props.modelValue.includes(permKey)
}

function togglePerm(permKey: string) {
  if (props.readonly) return
  const next = hasPerm(permKey)
    ? props.modelValue.filter((k) => k !== permKey)
    : [...props.modelValue, permKey]
  emit('update:modelValue', next)
}

// ── Group bulk toggle ──
type GroupState = 'all' | 'none' | 'indeterminate'

function getGroupState(group: PermissionGroup): GroupState {
  const perms = group.permissions
  const granted = perms.filter((p) => hasPerm(p.key))
  if (granted.length === 0) return 'none'
  if (granted.length === perms.length) return 'all'
  return 'indeterminate'
}

function toggleGroup(group: PermissionGroup) {
  if (props.readonly) return
  const state = getGroupState(group)
  const permKeys = group.permissions.map((p) => p.key)

  let next: string[]
  if (state === 'all') {
    next = props.modelValue.filter((k) => !permKeys.includes(k))
  } else {
    const toAdd = permKeys.filter((k) => !props.modelValue.includes(k))
    next = [...props.modelValue, ...toAdd]
  }
  emit('update:modelValue', next)
}

// ── Select / deselect all ──
function selectAll() {
  if (props.readonly) return
  const allKeys = props.groups.flatMap((g) => g.permissions.map((p) => p.key))
  emit('update:modelValue', allKeys)
}

function deselectAll() {
  if (props.readonly) return
  emit('update:modelValue', [])
}

// ── Stats ──
const totalPerms = computed(() => {
  if (props.layout === 'matrix') return totalMatrixPerms.value
  return props.groups.reduce((sum, g) => sum + g.permissions.length, 0)
})

const textSize = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))
const cellPadding = computed(() => (props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'))

// ═══════════════════════════════════════════════════════════════════════════
// MATRIX LAYOUT LOGIC
// ═══════════════════════════════════════════════════════════════════════════

const isMatrix = computed(() => props.layout === 'matrix')

/** Resolve permission key for a matrix cell */
function getMatrixPermKey(groupKey: string, row: PermissionMatrixRow, actionKey: string): string {
  if (row.singleKey) return `${groupKey}-${row.key}`
  return `${groupKey}-${row.key}-${actionKey}`
}

/** Check if a row supports a given action */
function isActionEnabled(row: PermissionMatrixRow, actionKey: string): boolean {
  return row.actions.includes(actionKey)
}

/** Check if a matrix cell is granted */
function hasMatrixPerm(groupKey: string, row: PermissionMatrixRow, actionKey: string): boolean {
  if (!isActionEnabled(row, actionKey)) return false
  return props.modelValue.includes(getMatrixPermKey(groupKey, row, actionKey))
}

/** Toggle a single matrix cell */
function toggleMatrixPerm(groupKey: string, row: PermissionMatrixRow, actionKey: string) {
  if (props.readonly) return
  if (!isActionEnabled(row, actionKey)) return
  const key = getMatrixPermKey(groupKey, row, actionKey)
  const next = props.modelValue.includes(key)
    ? props.modelValue.filter((k) => k !== key)
    : [...props.modelValue, key]
  emit('update:modelValue', next)
}

/** Get all enabled permission keys for a matrix row */
function getMatrixRowPermKeys(
  groupKey: string,
  row: PermissionMatrixRow,
  actions: { key: string }[]
): string[] {
  return actions
    .filter((a) => isActionEnabled(row, a.key))
    .map((a) => getMatrixPermKey(groupKey, row, a.key))
}

/** Row-level state */
function getMatrixRowState(
  groupKey: string,
  row: PermissionMatrixRow,
  actions: { key: string }[]
): GroupState {
  const keys = getMatrixRowPermKeys(groupKey, row, actions)
  if (keys.length === 0) return 'none'
  const granted = keys.filter((k) => props.modelValue.includes(k))
  if (granted.length === 0) return 'none'
  if (granted.length === keys.length) return 'all'
  return 'indeterminate'
}

/** Toggle all enabled actions in a row */
function toggleMatrixRow(groupKey: string, row: PermissionMatrixRow, actions: { key: string }[]) {
  if (props.readonly) return
  const keys = getMatrixRowPermKeys(groupKey, row, actions)
  const state = getMatrixRowState(groupKey, row, actions)
  let next: string[]
  if (state === 'all') {
    next = props.modelValue.filter((k) => !keys.includes(k))
  } else {
    const toAdd = keys.filter((k) => !props.modelValue.includes(k))
    next = [...props.modelValue, ...toAdd]
  }
  emit('update:modelValue', next)
}

/** Group-level state for matrix groups */
function getMatrixGroupState(group: PermissionMatrixGroup): GroupState {
  const allKeys = group.rows.flatMap((r) => getMatrixRowPermKeys(group.key, r, group.actions))
  if (allKeys.length === 0) return 'none'
  const granted = allKeys.filter((k) => props.modelValue.includes(k))
  if (granted.length === 0) return 'none'
  if (granted.length === allKeys.length) return 'all'
  return 'indeterminate'
}

/** Toggle all in a matrix group */
function toggleMatrixGroup(group: PermissionMatrixGroup) {
  if (props.readonly) return
  const allKeys = group.rows.flatMap((r) => getMatrixRowPermKeys(group.key, r, group.actions))
  const state = getMatrixGroupState(group)
  let next: string[]
  if (state === 'all') {
    next = props.modelValue.filter((k) => !allKeys.includes(k))
  } else {
    const toAdd = allKeys.filter((k) => !props.modelValue.includes(k))
    next = [...props.modelValue, ...toAdd]
  }
  emit('update:modelValue', next)
}

/** Total enabled permissions across all matrix groups */
const totalMatrixPerms = computed(() =>
  props.matrixGroups.reduce(
    (sum, g) =>
      sum + g.rows.reduce((rs, r) => rs + r.actions.filter((a) => isActionEnabled(r, a)).length, 0),
    0
  )
)

/** Select all matrix permissions */
function selectAllMatrix() {
  if (props.readonly) return
  const allKeys = props.matrixGroups.flatMap((g) =>
    g.rows.flatMap((r) => getMatrixRowPermKeys(g.key, r, g.actions))
  )
  // Merge with any existing non-matrix permissions
  const existing = props.modelValue.filter((k) => !allKeys.includes(k))
  emit('update:modelValue', [...existing, ...allKeys])
}

/** Deselect all matrix permissions */
function deselectAllMatrix() {
  if (props.readonly) return
  const allKeys = new Set(
    props.matrixGroups.flatMap((g) =>
      g.rows.flatMap((r) => getMatrixRowPermKeys(g.key, r, g.actions))
    )
  )
  emit(
    'update:modelValue',
    props.modelValue.filter((k) => !allKeys.has(k))
  )
}

/** Filtered matrix groups based on search and group dropdown */
const filteredMatrixGroups = computed<PermissionMatrixGroup[]>(() => {
  let result = props.matrixGroups

  // Filter by group dropdown
  if (selectedGroupKeys.value.length > 0) {
    result = result.filter((g) => selectedGroupKeys.value.includes(g.key))
  }

  // Filter by search
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

/** Matrix group dropdown options */
const matrixGroupDropdownOptions = computed(() =>
  props.matrixGroups.map((g) => ({
    label: g.label,
    value: g.key,
    icon: g.icon,
  }))
)

/** Unified action columns across all matrix groups (preserves order, deduplicates by key) */
const unifiedMatrixActions = computed(() => {
  const seen = new Set<string>()
  const actions: { key: string; label: string }[] = []
  for (const group of props.matrixGroups) {
    for (const action of group.actions) {
      if (!seen.has(action.key)) {
        seen.add(action.key)
        actions.push(action)
      }
    }
  }
  return actions
})

/** Check if a group defines a particular action column */
function groupHasAction(group: PermissionMatrixGroup, actionKey: string): boolean {
  return group.actions.some((a) => a.key === actionKey)
}
</script>

<template>
  <div :class="['permission-editor', props.class]">
    <!-- Top bar: search + group filter + stats -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
      <div class="flex items-center gap-2 flex-1 w-full sm:max-w-lg">
        <div v-if="searchable" class="flex-1">
          <Input
            v-model="searchQuery"
            placeholder="Search permissions..."
            icon="lucide:search"
            :size="size"
            show-clear-button />
        </div>

        <!-- Group filter dropdown -->
        <Dropdown
          :options="isMatrix ? matrixGroupDropdownOptions : groupDropdownOptions"
          :close-on-select="false"
          :selectable="false"
          position="bottom-end">
          <template #trigger>
            <button
              type="button"
              :class="[
                'inline-flex items-center gap-1.5 border rounded-md cursor-pointer transition-colors',
                size === 'sm' ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm',
                selectedGroupKeys.length > 0
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent',
              ]">
              <Icon icon="lucide:filter" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Modules</span>
              <span
                v-if="selectedGroupKeys.length > 0"
                class="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] px-1">
                {{ selectedGroupKeys.length }}
              </span>
            </button>
          </template>

          <template #item="{ option }">
            <div
              class="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-md"
              @click.stop="toggleGroupFilter(option.value)">
              <CheckBox
                :model-value="selectedGroupKeys.includes(option.value)"
                size="xs"
                @update:model-value="toggleGroupFilter(option.value)" />
              <Icon
                v-if="option.icon"
                :icon="option.icon"
                class="w-3.5 h-3.5 text-muted-foreground" />
              <span class="text-sm">{{ option.label }}</span>
            </div>
          </template>

          <template #footer>
            <div v-if="selectedGroupKeys.length > 0" class="border-t px-3 py-1.5">
              <button
                type="button"
                class="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                @click="clearGroupFilter">
                Clear filters
              </button>
            </div>
          </template>
        </Dropdown>
      </div>

      <div class="flex items-center gap-3 ml-auto">
        <span :class="[textSize, 'text-muted-foreground whitespace-nowrap']">
          {{ modelValue.length }} / {{ totalPerms }} selected
        </span>
        <button
          v-if="!readonly"
          type="button"
          :class="[textSize, 'text-primary hover:underline whitespace-nowrap cursor-pointer']"
          @click="isMatrix ? selectAllMatrix() : selectAll()">
          Select All
        </button>
        <button
          v-if="!readonly && modelValue.length > 0"
          type="button"
          :class="[
            textSize,
            'text-muted-foreground hover:text-foreground hover:underline whitespace-nowrap cursor-pointer',
          ]"
          @click="isMatrix ? deselectAllMatrix() : deselectAll()">
          Clear
        </button>
      </div>
    </div>

    <!-- ═══ MATRIX LAYOUT ═══ -->
    <template v-if="isMatrix">
      <!-- Empty state -->
      <div v-if="filteredMatrixGroups.length === 0" class="text-center py-12 text-muted-foreground">
        <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p :class="textSize">No permissions match your filters.</p>
      </div>

      <!-- Single matrix table -->
      <div v-else class="permission-matrix-wrapper border rounded-lg overflow-auto">
        <table class="w-full border-collapse">
          <!-- ── Sticky header (one shared row) ── -->
          <thead class="sticky top-0 z-10">
            <tr class="bg-muted">
              <!-- Entity label column -->
              <th
                :class="[
                  size === 'sm' ? 'px-3 py-2' : 'px-4 py-2.5',
                  textSize,
                  'text-left font-semibold text-foreground min-w-[200px] bg-muted border-b',
                ]">
                Permission
              </th>
              <!-- Action columns -->
              <th
                v-for="action in unifiedMatrixActions"
                :key="action.key"
                :class="[
                  size === 'sm' ? 'px-2 py-2' : 'px-3 py-2.5',
                  textSize,
                  'text-center font-semibold text-foreground border-l border-b bg-muted min-w-[100px]',
                ]">
                {{ action.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(group, gi) in filteredMatrixGroups" :key="group.key">
              <!-- ── Group header row (spans all columns) ── -->
              <tr
                class="bg-secondary/50 cursor-pointer select-none"
                @click="toggleGroupCollapse(group.key)">
                <td
                  :colspan="unifiedMatrixActions.length + 1"
                  :class="[size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2', 'border-t']">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon
                        v-if="collapsible"
                        icon="lucide:chevron-right"
                        class="w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground"
                        :class="{ 'rotate-90': !collapsedGroups.has(group.key) }" />
                      <Icon
                        v-if="group.icon"
                        :icon="group.icon"
                        class="w-4 h-4 text-muted-foreground" />
                      <span :class="[textSize, 'font-semibold text-foreground']">
                        {{ group.label }}
                      </span>
                    </div>
                    <!-- Group bulk toggle -->
                    <div class="flex items-center" @click.stop>
                      <CheckBox
                        v-if="toggleMode === 'checkbox'"
                        :model-value="getMatrixGroupState(group) === 'all'"
                        :indeterminate="getMatrixGroupState(group) === 'indeterminate'"
                        :disabled="readonly"
                        :size="size === 'sm' ? 'xs' : 'sm'"
                        @update:model-value="toggleMatrixGroup(group)" />
                      <Switch
                        v-else
                        :model-value="getMatrixGroupState(group) === 'all'"
                        :disabled="readonly"
                        @update:model-value="toggleMatrixGroup(group)" />
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ── Entity rows (shown when not collapsed) ── -->
              <template v-if="!collapsedGroups.has(group.key)">
                <tr
                  v-for="row in group.rows"
                  :key="group.key + '-' + row.key"
                  class="hover:bg-accent/40 transition-colors duration-100">
                  <!-- Entity label -->
                  <td :class="[size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2', 'border-t']">
                    <div class="flex items-center gap-2 pl-6">
                      <span :class="[textSize, 'text-foreground']">
                        {{ row.label }}
                      </span>
                      <Tooltip v-if="row.description" :content="row.description" placement="top">
                        <Icon
                          icon="lucide:info"
                          class="w-3 h-3 text-muted-foreground cursor-auto shrink-0" />
                      </Tooltip>
                    </div>
                  </td>

                  <!-- Action cells -->
                  <td
                    v-for="action in unifiedMatrixActions"
                    :key="action.key"
                    :class="[
                      size === 'sm' ? 'px-2 py-1.5' : 'px-3 py-2',
                      'text-center border-t border-l',
                      !groupHasAction(group, action.key) || !isActionEnabled(row, action.key)
                        ? 'bg-muted/30'
                        : '',
                    ]">
                    <!-- Disabled / not applicable cell -->
                    <div
                      v-if="!groupHasAction(group, action.key) || !isActionEnabled(row, action.key)"
                      class="flex items-center justify-center">
                      <span class="text-xs text-muted-foreground/40 select-none">—</span>
                    </div>
                    <!-- Enabled cell -->
                    <div v-else class="flex items-center justify-center">
                      <CheckBox
                        v-if="toggleMode === 'checkbox'"
                        :model-value="hasMatrixPerm(group.key, row, action.key)"
                        :disabled="readonly"
                        :size="size === 'sm' ? 'xs' : 'sm'"
                        @update:model-value="toggleMatrixPerm(group.key, row, action.key)" />
                      <Switch
                        v-else
                        :model-value="hasMatrixPerm(group.key, row, action.key)"
                        :disabled="readonly"
                        @update:model-value="toggleMatrixPerm(group.key, row, action.key)" />
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ═══ LIST LAYOUT (existing) ═══ -->
    <template v-else>
      <!-- Empty state -->
      <div v-if="filteredGroups.length === 0" class="text-center py-12 text-muted-foreground">
        <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p :class="textSize">No permissions match your filters.</p>
      </div>

      <!-- Permission groups -->
      <div v-else class="space-y-0 border rounded-lg overflow-hidden">
        <template v-for="(group, gi) in filteredGroups" :key="group.key">
          <!-- Group header -->
          <div
            :class="[
              cellPadding,
              'flex items-center justify-between bg-muted cursor-pointer select-none',
              gi > 0 ? 'border-t' : '',
            ]"
            @click="toggleGroupCollapse(group.key)">
            <div class="flex items-center gap-2">
              <Icon
                v-if="collapsible"
                icon="lucide:chevron-right"
                class="w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground"
                :class="{ 'rotate-90': !collapsedGroups.has(group.key) }" />
              <Icon v-if="group.icon" :icon="group.icon" class="w-4 h-4 text-muted-foreground" />
              <span :class="[textSize, 'font-semibold text-foreground']">{{ group.label }}</span>
              <span :class="[size === 'sm' ? 'text-[10px]' : 'text-xs', 'text-muted-foreground']">
                ({{ group.permissions.filter((p) => hasPerm(p.key)).length }}/{{
                  group.permissions.length
                }})
              </span>
            </div>

            <!-- Group bulk toggle -->
            <div class="flex items-center" @click.stop>
              <CheckBox
                v-if="toggleMode === 'checkbox'"
                :model-value="getGroupState(group) === 'all'"
                :indeterminate="getGroupState(group) === 'indeterminate'"
                :disabled="readonly"
                :size="size === 'sm' ? 'xs' : 'sm'"
                @update:model-value="toggleGroup(group)" />
              <Switch
                v-else
                :model-value="getGroupState(group) === 'all'"
                :disabled="readonly"
                @update:model-value="toggleGroup(group)" />
            </div>
          </div>

          <!-- Permissions list (expanded) -->
          <div v-if="!collapsedGroups.has(group.key)">
            <div
              v-for="(perm, pi) in group.permissions"
              :key="perm.key"
              :class="[
                cellPadding,
                'flex items-center justify-between border-t hover:bg-accent/40 transition-colors duration-100',
              ]">
              <div class="flex items-center gap-2 pl-6">
                <span :class="[textSize, 'text-foreground']">{{ perm.label }}</span>
                <Tooltip v-if="perm.description" :content="perm.description" placement="top">
                  <Icon
                    icon="lucide:info"
                    class="w-3 h-3 text-muted-foreground cursor-auto shrink-0" />
                </Tooltip>
              </div>

              <div class="flex items-center">
                <CheckBox
                  v-if="toggleMode === 'checkbox'"
                  :model-value="hasPerm(perm.key)"
                  :disabled="readonly"
                  :size="size === 'sm' ? 'xs' : 'sm'"
                  @update:model-value="togglePerm(perm.key)" />
                <Switch
                  v-else
                  :model-value="hasPerm(perm.key)"
                  :disabled="readonly"
                  @update:model-value="togglePerm(perm.key)" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
