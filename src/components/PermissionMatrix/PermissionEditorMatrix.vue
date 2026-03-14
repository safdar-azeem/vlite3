<script setup lang="ts">
import { computed } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Tooltip from '../Tooltip.vue'
import { getMatrixPermKey, isActionEnabled, getMatrixRowPermKeys } from './utils'
import { usePermissionState } from './usePermissionState'
import type {
  PermissionMatrixGroup,
  PermissionMatrixRow,
  PermissionToggleMode,
  PermissionMatrixSize,
} from './types'

const props = defineProps<{
  matrixGroups: PermissionMatrixGroup[]
  modelValue: string[]
  collapsedGroups: Set<string>
  toggleMode: PermissionToggleMode
  readonly: boolean
  size: PermissionMatrixSize
  collapsible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
  (e: 'toggleCollapse', groupKey: string): void
}>()

// ── Set-based state — O(1) lookups ────────────────────────────────────────
const { hasPerm, getMatrixGroupState, toggleMatrixGroup } = usePermissionState(
  () => props.modelValue
)

const textSize = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))

const customStyles = computed(() => ({
  '--cell-py': props.size === 'sm' ? '0.5rem' : '0.625rem',
  '--cell-px': props.size === 'sm' ? '0.75rem' : '1rem',
}))

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

function groupHasAction(group: PermissionMatrixGroup, actionKey: string): boolean {
  return group.actions.some((a) => a.key === actionKey)
}

function hasMatrixPerm(groupKey: string, row: PermissionMatrixRow, actionKey: string): boolean {
  if (!isActionEnabled(row, actionKey)) return false
  return hasPerm(getMatrixPermKey(groupKey, row, actionKey))
}

function toggleMatrixPerm(groupKey: string, row: PermissionMatrixRow, actionKey: string) {
  if (props.readonly || !isActionEnabled(row, actionKey)) return
  const key = getMatrixPermKey(groupKey, row, actionKey)
  const next = hasPerm(key)
    ? props.modelValue.filter((k) => k !== key)
    : [...props.modelValue, key]
  emit('update:modelValue', next)
}

function handleToggleMatrixGroup(group: PermissionMatrixGroup) {
  if (props.readonly) return
  emit('update:modelValue', toggleMatrixGroup(group))
}
</script>

<template>
  <div v-if="matrixGroups.length === 0" class="text-center py-12 text-muted-foreground">
    <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
    <p :class="textSize">No permissions match your filters.</p>
  </div>

  <div v-else class="permission-matrix-wrapper" :style="customStyles">
    <table class="custom-table">
      <thead class="sticky top-0 z-10">
        <tr>
          <th :class="[textSize, 'custom-th']">Permission</th>
          <th
            v-for="action in unifiedMatrixActions"
            :key="action.key"
            :class="[textSize, 'custom-th text-center']">
            {{ action.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-for="group in matrixGroups" :key="group.key">
          <!-- Group header row -->
          <tr
            class="custom-group-row cursor-pointer select-none"
            @click="$emit('toggleCollapse', group.key)">
            <td :colspan="unifiedMatrixActions.length + 1" class="custom-td">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon
                    v-if="collapsible"
                    icon="lucide:chevron-right"
                    class="w-3.5 h-3.5 transition-transform duration-200"
                    style="color: var(--color-muted-foreground)"
                    :class="{ 'rotate-90': !collapsedGroups.has(group.key) }" />
                  <Icon
                    v-if="group.icon"
                    :icon="group.icon"
                    class="w-4 h-4"
                    style="color: var(--color-muted-foreground)" />
                  <span :class="[textSize, 'font-semibold']" style="color: var(--color-foreground)">
                    {{ group.label }}
                  </span>
                </div>
                <!-- Group bulk toggle — stop propagation so it doesn't collapse the group -->
                <div class="flex items-center" @click.stop="handleToggleMatrixGroup(group)">
                  <CheckBox
                    v-if="toggleMode === 'checkbox'"
                    :model-value="getMatrixGroupState(group) === 'all'"
                    :indeterminate="getMatrixGroupState(group) === 'indeterminate'"
                    :disabled="readonly"
                    :size="size === 'sm' ? 'xs' : 'sm'"
                    class="pointer-events-none" />
                  <Switch
                    v-else
                    :model-value="getMatrixGroupState(group) === 'all'"
                    :disabled="readonly"
                    class="pointer-events-none" />
                </div>
              </div>
            </td>
          </tr>

          <!-- Entity rows — v-memo prevents re-render unless this row's state changes -->
          <template v-if="!collapsedGroups.has(group.key)">
            <tr
              v-for="row in group.rows"
              :key="group.key + '-' + row.key"
              v-memo="[
                ...unifiedMatrixActions.map((a) => hasMatrixPerm(group.key, row, a.key)),
                readonly,
              ]"
              class="custom-entity-row">
              <td class="custom-td">
                <div class="flex items-center gap-2 pl-6">
                  <span :class="[textSize]" style="color: var(--color-foreground)">
                    {{ row.label }}
                  </span>
                  <Tooltip v-if="row.description" :content="row.description" placement="top">
                    <Icon
                      icon="lucide:info"
                      class="w-3 h-3 cursor-auto shrink-0"
                      style="color: var(--color-muted-foreground)" />
                  </Tooltip>
                </div>
              </td>

              <td
                v-for="action in unifiedMatrixActions"
                :key="action.key"
                :class="[
                  'custom-td text-center',
                  !groupHasAction(group, action.key) || !isActionEnabled(row, action.key)
                    ? 'custom-disabled-cell'
                    : !readonly ? 'custom-active-cell' : '',
                ]"
                @click="toggleMatrixPerm(group.key, row, action.key)">
                <!-- Disabled cell -->
                <div
                  v-if="!groupHasAction(group, action.key) || !isActionEnabled(row, action.key)"
                  class="flex items-center justify-center">
                  <span
                    class="text-xs select-none"
                    style="color: var(--color-muted-foreground); opacity: 0.4">
                    —
                  </span>
                </div>
                <!-- Active cell — toggle is display-only; pointer-events-none prevents double-fire -->
                <div v-else class="flex items-center justify-center pointer-events-none">
                  <CheckBox
                    v-if="toggleMode === 'checkbox'"
                    :model-value="hasMatrixPerm(group.key, row, action.key)"
                    :disabled="readonly"
                    :size="size === 'sm' ? 'xs' : 'sm'" />
                  <Switch
                    v-else
                    :model-value="hasMatrixPerm(group.key, row, action.key)"
                    :disabled="readonly" />
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.permission-matrix-wrapper {
  border: 1px solid var(--color-border);
  background-color: var(--color-gray-100);
  border-radius: 0.5rem;
  overflow: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-th {
  background-color: var(--color-gray-150);
  color: var(--color-foreground);
  border-bottom: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  padding: var(--cell-py) var(--cell-px);
  text-align: left;
  font-weight: 600;
  min-width: 200px;
}

.custom-th.text-center {
  text-align: center;
  min-width: 100px;
}

.custom-th:first-child {
  border-left: none;
}

.custom-td {
  border-bottom: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  padding: var(--cell-py) var(--cell-px);
}

.custom-td.text-center {
  text-align: center;
}

.custom-td:first-child {
  border-left: none;
}

.custom-group-row td {
  background-color: var(--color-gray-100);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.custom-entity-row {
  background-color: var(--color-background);
  transition: background-color 0.1s ease;
}

.custom-entity-row:hover {
  background-color: var(--color-gray-50);
}

.custom-entity-row:last-child td {
  border-bottom: none;
}

.custom-active-cell {
  cursor: pointer;
}

.custom-active-cell:hover {
  background-color: var(--color-accent);
}
</style>
