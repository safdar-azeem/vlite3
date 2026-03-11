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

const customStyles = computed(() => ({
  '--cell-py': props.size === 'sm' ? '0.5rem' : '0.625rem',
  '--cell-px': props.size === 'sm' ? '0.75rem' : '1rem',
}))

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
  const granted = group.permissions.filter((p) => hasPerm(p.key))
  if (granted.length === 0) return 'none'
  if (granted.length === group.permissions.length) return 'all'
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

  <div v-else class="permission-list-wrapper" :style="customStyles">
    <template v-for="group in groups" :key="group.key">
      <!-- Group header -->
      <div
        class="custom-list-header flex items-center justify-between cursor-pointer select-none"
        @click="$emit('toggleCollapse', group.key)">
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
          <span
            :class="[size === 'sm' ? 'text-[10px]' : 'text-xs']"
            style="color: var(--color-muted-foreground)">
            ({{ group.permissions.filter((p) => hasPerm(p.key)).length }}/{{ group.permissions.length }})
          </span>
        </div>

        <!-- Group bulk toggle — stop propagation so it doesn't trigger collapse -->
        <div class="flex items-center" @click.stop="toggleGroup(group)">
          <CheckBox
            v-if="toggleMode === 'checkbox'"
            :model-value="getGroupState(group) === 'all'"
            :indeterminate="getGroupState(group) === 'indeterminate'"
            :disabled="readonly"
            :size="size === 'sm' ? 'xs' : 'sm'"
            class="pointer-events-none" />
          <Switch
            v-else
            :model-value="getGroupState(group) === 'all'"
            :disabled="readonly"
            class="pointer-events-none" />
        </div>
      </div>

      <!-- Permission rows -->
      <div v-if="!collapsedGroups.has(group.key)" class="custom-list-group-content">
        <div
          v-for="perm in group.permissions"
          :key="perm.key"
          class="custom-list-item flex items-center justify-between transition-colors duration-100"
          :class="{ 'cursor-pointer': !readonly }"
          @click="togglePerm(perm.key)">
          <div class="flex items-center gap-2 pl-6">
            <span :class="[textSize]" style="color: var(--color-foreground)">{{ perm.label }}</span>
            <Tooltip v-if="perm.description" :content="perm.description" placement="top">
              <Icon
                icon="lucide:info"
                class="w-3 h-3 cursor-auto shrink-0"
                style="color: var(--color-muted-foreground)"
                @click.stop />
            </Tooltip>
          </div>

          <!-- Toggle is display-only; pointer-events-none prevents double-fire -->
          <div class="flex items-center pointer-events-none">
            <CheckBox
              v-if="toggleMode === 'checkbox'"
              :model-value="hasPerm(perm.key)"
              :disabled="readonly"
              :size="size === 'sm' ? 'xs' : 'sm'" />
            <Switch
              v-else
              :model-value="hasPerm(perm.key)"
              :disabled="readonly" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.permission-list-wrapper {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-background);
}

.custom-list-header {
  background-color: var(--color-muted);
  border-bottom: 1px solid var(--color-border);
  padding: var(--cell-py) var(--cell-px);
}

.custom-list-group-content .custom-list-item {
  border-bottom: 1px solid var(--color-border);
  padding: var(--cell-py) var(--cell-px);
  background-color: var(--color-background);
}

.custom-list-group-content .custom-list-item:hover {
  background-color: var(--color-accent);
}

.custom-list-group-content .custom-list-item:last-child {
  border-bottom: none;
}

.custom-list-group-content + .custom-list-header,
.custom-list-header + .custom-list-header {
  border-top: 1px solid var(--color-border);
}

.permission-list-wrapper > .custom-list-header:last-child {
  border-bottom: none;
}
</style>
