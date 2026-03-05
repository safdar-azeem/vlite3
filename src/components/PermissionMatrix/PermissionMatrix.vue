<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Input from '../Input.vue'
import type {
  PermissionMatrixProps,
  PermissionMap,
  PermissionGroup,
  PermissionDef,
  RoleDef,
  PermissionMatrixSize,
} from './types'

const props = withDefaults(defineProps<PermissionMatrixProps>(), {
  toggleMode: 'checkbox',
  searchable: true,
  collapsible: true,
  readonly: false,
  size: 'md',
  stickyHeader: true,
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: PermissionMap): void
}>()

// ── Search ──
const searchQuery = ref('')

// ── Collapsed groups ──
const collapsedGroups = ref<Set<string>>(new Set())

function toggleGroupCollapse(groupKey: string) {
  if (!props.collapsible) return
  const next = new Set(collapsedGroups.value)
  if (next.has(groupKey)) {
    next.delete(groupKey)
  } else {
    next.add(groupKey)
  }
  collapsedGroups.value = next
}

// ── Filtered groups based on search ──
const filteredGroups = computed<PermissionGroup[]>(() => {
  if (!searchQuery.value.trim()) return props.groups

  const q = searchQuery.value.toLowerCase()
  return props.groups
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
})

// ── Permission helpers ──
function hasPerm(roleKey: string, permKey: string): boolean {
  return props.modelValue[roleKey]?.includes(permKey) ?? false
}

function togglePerm(roleKey: string, permKey: string) {
  if (props.readonly) return
  const role = props.roles.find((r) => r.key === roleKey)
  if (role?.locked) return

  const current = props.modelValue[roleKey] || []
  const next = current.includes(permKey)
    ? current.filter((k) => k !== permKey)
    : [...current, permKey]

  emit('update:modelValue', {
    ...props.modelValue,
    [roleKey]: next,
  })
}

// ── Group-level bulk toggle ──
type GroupState = 'all' | 'none' | 'indeterminate'

function getGroupState(roleKey: string, group: PermissionGroup): GroupState {
  const perms = group.permissions
  const granted = perms.filter((p) => hasPerm(roleKey, p.key))
  if (granted.length === 0) return 'none'
  if (granted.length === perms.length) return 'all'
  return 'indeterminate'
}

function toggleGroup(roleKey: string, group: PermissionGroup) {
  if (props.readonly) return
  const role = props.roles.find((r) => r.key === roleKey)
  if (role?.locked) return

  const state = getGroupState(roleKey, group)
  const permKeys = group.permissions.map((p) => p.key)
  const current = props.modelValue[roleKey] || []

  let next: string[]
  if (state === 'all') {
    // Uncheck all in this group
    next = current.filter((k) => !permKeys.includes(k))
  } else {
    // Check all in this group
    const toAdd = permKeys.filter((k) => !current.includes(k))
    next = [...current, ...toAdd]
  }

  emit('update:modelValue', {
    ...props.modelValue,
    [roleKey]: next,
  })
}

// ── Size classes ──
const cellPadding = computed(() => {
  return props.size === 'sm' ? 'px-2 py-1' : 'px-3 py-2'
})

const textSize = computed(() => {
  return props.size === 'sm' ? 'text-xs' : 'text-sm'
})

// ── Stats ──
function getRolePermCount(roleKey: string): number {
  return props.modelValue[roleKey]?.length || 0
}

function getTotalPerms(): number {
  return props.groups.reduce((sum, g) => sum + g.permissions.length, 0)
}
</script>

<template>
  <div :class="['permission-matrix', props.class]">
    <!-- Search -->
    <div v-if="searchable" class="mb-4">
      <Input
        v-model="searchQuery"
        placeholder="Search permissions..."
        icon="lucide:search"
        :size="size"
        show-clear-button />
    </div>

    <!-- Empty state -->
    <div v-if="filteredGroups.length === 0" class="text-center py-12 text-muted-foreground">
      <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
      <p :class="textSize">No permissions match your search.</p>
    </div>

    <!-- Matrix table -->
    <div v-else class="permission-matrix-wrapper border rounded-lg overflow-auto">
      <table class="w-full border-collapse">
        <!-- Sticky header (roles) -->
        <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
          <tr class="bg-muted">
            <!-- Permission label column -->
            <th
              :class="[
                cellPadding,
                textSize,
                'text-left font-semibold text-foreground min-w-[220px] sm:min-w-[260px] bg-muted border-b',
              ]">
              Permission
            </th>

            <!-- Role columns -->
            <th
              v-for="role in roles"
              :key="role.key"
              :class="[cellPadding, 'text-center border-b border-l bg-muted min-w-[100px]']">
              <div class="flex flex-col items-center gap-0.5">
                <span :class="[textSize, 'font-semibold text-foreground whitespace-nowrap']">
                  {{ role.label }}
                </span>
                <span
                  :class="[
                    props.size === 'sm' ? 'text-[10px]' : 'text-xs',
                    'text-muted-foreground',
                  ]">
                  {{ getRolePermCount(role.key) }}/{{ getTotalPerms() }}
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="group in filteredGroups" :key="group.key">
            <!-- Group header row -->
            <tr class="bg-secondary/60">
              <td
                :class="[cellPadding, 'border-b cursor-pointer select-none']"
                @click="toggleGroupCollapse(group.key)">
                <div class="flex items-center gap-2">
                  <Icon
                    v-if="collapsible"
                    icon="lucide:chevron-right"
                    class="w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground"
                    :class="{ 'rotate-90': !collapsedGroups.has(group.key) }" />
                  <Icon
                    v-if="group.icon"
                    :icon="group.icon"
                    class="w-3.5 h-3.5 text-muted-foreground" />
                  <span :class="[textSize, 'font-semibold text-foreground']">
                    {{ group.label }}
                  </span>
                  <span
                    :class="[
                      props.size === 'sm' ? 'text-[10px]' : 'text-xs',
                      'text-muted-foreground ml-1',
                    ]">
                    ({{ group.permissions.length }})
                  </span>
                </div>
              </td>

              <!-- Group bulk toggle per role -->
              <td
                v-for="role in roles"
                :key="role.key"
                :class="[cellPadding, 'text-center border-b border-l']"
                @click="toggleGroup(role.key, group)">
                <div class="flex items-center justify-center">
                  <CheckBox
                    v-if="toggleMode === 'checkbox'"
                    :model-value="getGroupState(role.key, group) === 'all'"
                    :indeterminate="getGroupState(role.key, group) === 'indeterminate'"
                    :disabled="readonly || role.locked"
                    :size="size === 'sm' ? 'xs' : 'sm'"
                    @update:model-value="toggleGroup(role.key, group)" />
                  <Switch
                    v-else
                    :model-value="getGroupState(role.key, group) === 'all'"
                    :disabled="readonly || role.locked"
                    @update:model-value="toggleGroup(role.key, group)" />
                </div>
              </td>
            </tr>

            <!-- Permission rows (shown when not collapsed) -->
            <template v-if="!collapsedGroups.has(group.key)">
              <tr
                v-for="perm in group.permissions"
                :key="perm.key"
                class="hover:bg-accent/40 transition-colors duration-100">
                <td :class="[cellPadding, 'border-b']">
                  <div class="flex items-center gap-2 pl-6">
                    <span :class="[textSize, 'text-foreground']">{{ perm.label }}</span>
                    <Icon
                      v-if="perm.description"
                      icon="lucide:info"
                      class="w-3 h-3 text-muted-foreground cursor-help shrink-0"
                      :title="perm.description" />
                  </div>
                </td>

                <td
                  v-for="role in roles"
                  :key="role.key"
                  :class="[cellPadding, 'text-center border-b border-l']">
                  <div class="flex items-center justify-center">
                    <CheckBox
                      v-if="toggleMode === 'checkbox'"
                      :model-value="hasPerm(role.key, perm.key)"
                      :disabled="readonly || role.locked"
                      :size="size === 'sm' ? 'xs' : 'sm'"
                      @update:model-value="togglePerm(role.key, perm.key)" />
                    <Switch
                      v-else
                      :model-value="hasPerm(role.key, perm.key)"
                      :disabled="readonly || role.locked"
                      @update:model-value="togglePerm(role.key, perm.key)" />
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.permission-matrix-wrapper {
  max-height: 70vh;
}

.permission-matrix-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.permission-matrix-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.permission-matrix-wrapper::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 3px;
}

.permission-matrix-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}
</style>
