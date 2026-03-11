<script setup lang="ts">
import { computed } from 'vue'
import Input from '../Input.vue'
import Icon from '../Icon.vue'
import CheckBox from '../CheckBox.vue'
import { Dropdown } from '../Dropdown'
import type { PermissionMatrixSize } from './types'

interface GroupOption {
  label: string
  value: string
  icon?: string
}

const props = defineProps<{
  searchQuery: string
  selectedGroupKeys: string[]
  searchable: boolean
  size: PermissionMatrixSize
  readonly: boolean
  totalPerms: number
  selectedCount: number
  groupOptions: GroupOption[]
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedGroupKeys', val: string[]): void
  (e: 'selectAll'): void
  (e: 'clearAll'): void
}>()

const textSize = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))

function toggleGroupFilter(groupKey: string) {
  const current = props.selectedGroupKeys
  const next = current.includes(groupKey)
    ? current.filter((k) => k !== groupKey)
    : [...current, groupKey]
  emit('update:selectedGroupKeys', next)
}

function clearGroupFilter() {
  emit('update:selectedGroupKeys', [])
}

function updateSearch(value: string | number) {
  emit('update:searchQuery', String(value))
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
    <div class="flex items-center gap-2 flex-1 w-full sm:max-w-lg">
      <div v-if="searchable" class="flex-1">
        <Input
          :model-value="searchQuery"
          @update:model-value="updateSearch"
          placeholder="Search permissions..."
          icon="lucide:search"
          :size="size"
          show-clear-button />
      </div>

      <Dropdown
        :options="groupOptions"
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
            class="flex items-center gap-2 w-full cursor-pointer hover:bg-accent rounded-md"
            @click.stop="toggleGroupFilter(option.value)">
            <CheckBox
              :model-value="selectedGroupKeys.includes(option.value)"
              size="xs"
              @update:model-value="toggleGroupFilter(option.value)" />
            <Icon
              v-if="option?.icon"
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
        {{ selectedCount }} / {{ totalPerms }} selected
      </span>
      <button
        v-if="!readonly"
        type="button"
        :class="[textSize, 'text-primary hover:underline whitespace-nowrap cursor-pointer']"
        @click="$emit('selectAll')">
        Select All
      </button>
      <button
        v-if="!readonly && selectedCount > 0"
        type="button"
        :class="[
          textSize,
          'text-muted-foreground hover:text-foreground hover:underline whitespace-nowrap cursor-pointer',
        ]"
        @click="$emit('clearAll')">
        Clear
      </button>
    </div>
  </div>
</template>
