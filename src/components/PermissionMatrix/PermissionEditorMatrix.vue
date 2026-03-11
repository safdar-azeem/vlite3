<script setup lang="ts">
import { computed } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Tooltip from '../Tooltip.vue'
import { getMatrixPermKey, isActionEnabled, getMatrixRowPermKeys } from './utils'
import type { PermissionMatrixGroup, PermissionMatrixRow, PermissionToggleMode, PermissionMatrixSize } from './types'

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

const textSize = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))

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
  return props.modelValue.includes(getMatrixPermKey(groupKey, row, actionKey))
}

function toggleMatrixPerm(groupKey: string, row: PermissionMatrixRow, actionKey: string) {
  if (props.readonly || !isActionEnabled(row, actionKey)) return
  const key = getMatrixPermKey(groupKey, row, actionKey)
  const next = props.modelValue.includes(key)
    ? props.modelValue.filter((k) => k !== key)
    : [...props.modelValue, key]
  emit('update:modelValue', next)
}

type GroupState = 'all' | 'none' | 'indeterminate'

function getMatrixGroupState(group: PermissionMatrixGroup): GroupState {
  const allKeys = group.rows.flatMap((r) => getMatrixRowPermKeys(group.key, r, group.actions))
  if (allKeys.length === 0) return 'none'
  const granted = allKeys.filter((k) => props.modelValue.includes(k))
  if (granted.length === 0) return 'none'
  if (granted.length === allKeys.length) return 'all'
  return 'indeterminate'
}

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
</script>

<template>
  <div v-if="matrixGroups.length === 0" class="text-center py-12 text-muted-foreground">
    <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
    <p :class="textSize">No permissions match your filters.</p>
  </div>

  <div v-else class="permission-matrix-wrapper border rounded-lg overflow-auto">
    <table class="w-full border-collapse">
      <thead class="sticky top-0 z-10">
        <tr class="bg-muted">
          <th
            :class="[
              size === 'sm' ? 'px-3 py-2' : 'px-4 py-2.5',
              textSize,
              'text-left font-semibold text-foreground min-w-[200px] bg-muted border-b',
            ]">
            Permission
          </th>
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
        <template v-for="group in matrixGroups" :key="group.key">
          <tr
            class="bg-secondary/50 cursor-pointer select-none"
            @click="$emit('toggleCollapse', group.key)">
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

          <template v-if="!collapsedGroups.has(group.key)">
            <tr
              v-for="row in group.rows"
              :key="group.key + '-' + row.key"
              class="hover:bg-accent/40 transition-colors duration-100">
              <td :class="[size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2', 'border-t']">
                <div class="flex items-center gap-2 pl-6">
                  <span :class="[textSize, 'text-foreground']">{{ row.label }}</span>
                  <Tooltip v-if="row.description" :content="row.description" placement="top">
                    <Icon
                      icon="lucide:info"
                      class="w-3 h-3 text-muted-foreground cursor-auto shrink-0" />
                  </Tooltip>
                </div>
              </td>

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
                <div
                  v-if="!groupHasAction(group, action.key) || !isActionEnabled(row, action.key)"
                  class="flex items-center justify-center">
                  <span class="text-xs text-muted-foreground/40 select-none">—</span>
                </div>
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
