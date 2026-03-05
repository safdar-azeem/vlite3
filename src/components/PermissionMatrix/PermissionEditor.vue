<script setup lang="ts">
import { ref, computed } from 'vue'
import CheckBox from '../CheckBox.vue'
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import Input from '../Input.vue'
import type {
  PermissionGroup,
  PermissionDef,
  PermissionToggleMode,
  PermissionMatrixSize,
} from './types'

export interface PermissionEditorProps {
  /** Permission groups with nested permissions */
  groups: PermissionGroup[]
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
}

const props = withDefaults(defineProps<PermissionEditorProps>(), {
  toggleMode: 'checkbox',
  searchable: true,
  collapsible: true,
  readonly: false,
  size: 'md',
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
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

// ── Filtered groups ──
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
const totalPerms = computed(() => props.groups.reduce((sum, g) => sum + g.permissions.length, 0))

const textSize = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))
const cellPadding = computed(() => (props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'))
</script>

<template>
  <div :class="['permission-editor', props.class]">
    <!-- Top bar: search + stats -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
      <div v-if="searchable" class="flex-1 w-full sm:max-w-sm">
        <Input
          v-model="searchQuery"
          placeholder="Search permissions..."
          icon="lucide:search"
          :size="size"
          show-clear-button />
      </div>
      <div class="flex items-center gap-3 ml-auto">
        <span :class="[textSize, 'text-muted-foreground whitespace-nowrap']">
          {{ modelValue.length }} / {{ totalPerms }} selected
        </span>
        <button
          v-if="!readonly"
          type="button"
          :class="[textSize, 'text-primary hover:underline whitespace-nowrap cursor-pointer']"
          @click="selectAll">
          Select All
        </button>
        <button
          v-if="!readonly && modelValue.length > 0"
          type="button"
          :class="[
            textSize,
            'text-muted-foreground hover:text-foreground hover:underline whitespace-nowrap cursor-pointer',
          ]"
          @click="deselectAll">
          Clear
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredGroups.length === 0" class="text-center py-12 text-muted-foreground">
      <Icon icon="lucide:search-x" class="w-8 h-8 mx-auto mb-3 opacity-50" />
      <p :class="textSize">No permissions match your search.</p>
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
              <Icon
                v-if="perm.description"
                icon="lucide:info"
                class="w-3 h-3 text-muted-foreground cursor-help shrink-0"
                :title="perm.description" />
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
  </div>
</template>
