<script setup lang="ts">
import { computed } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Tooltip from '../Tooltip.vue'
import type { PermissionGroup, PermissionToggleMode, PermissionMatrixSize } from './types'

const props = defineProps<{
  groups: PermissionGroup[]
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
const cellPadding = computed(() => (props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'))

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
</script>

<template>
  <div v-if="groups.length === 0" class="text-center py-12 text-muted-foreground">
    <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
    <p :class="textSize">No permissions match your filters.</p>
  </div>

  <div v-else class="space-y-0 border rounded-lg overflow-hidden">
    <template v-for="(group, gi) in groups" :key="group.key">
      <div
        :class="[
          cellPadding,
          'flex items-center justify-between bg-muted cursor-pointer select-none',
          gi > 0 ? 'border-t' : '',
        ]"
        @click="$emit('toggleCollapse', group.key)">
        <div class="flex items-center gap-2">
          <Icon
            v-if="collapsible"
            icon="lucide:chevron-right"
            class="w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground"
            :class="{ 'rotate-90': !collapsedGroups.has(group.key) }" />
          <Icon v-if="group.icon" :icon="group.icon" class="w-4 h-4 text-muted-foreground" />
          <span :class="[textSize, 'font-semibold text-foreground']">{{ group.label }}</span>
          <span :class="[size === 'sm' ? 'text-[10px]' : 'text-xs', 'text-muted-foreground']">
            ({{ group.permissions.filter((p) => hasPerm(p.key)).length }}/{{ group.permissions.length }})
          </span>
        </div>

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

      <div v-if="!collapsedGroups.has(group.key)">
        <div
          v-for="perm in group.permissions"
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
