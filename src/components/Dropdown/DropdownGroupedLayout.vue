<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import type { IDropdownOptions, IDropdownOption } from '@/types'
import DropdownItem from './DropdownItem.vue'
import { $t } from '@/utils/i18n'

interface Props {
  options: IDropdownOptions
  selected?: any
  selectable?: boolean
  columns?: number | string
  itemsClass?: string
  headerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  selectable: true,
  columns: 3,
})

const emit = defineEmits<{
  (e: 'select', option: IDropdownOption): void
  (e: 'mouseenter', payload: any): void
}>()

// Calculate Grid Columns
const gridStyle = computed(() => {
  const cols = props.columns
  if (typeof cols === 'number') {
    return { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
  }
  return { gridTemplateColumns: cols } // Allow custom string like '200px 1fr'
})

// Check selection helper (reusing logic visual)
const isSelected = (option: IDropdownOption) => {
  // Similar logic to parent, but we rely on simple check here for UI
  // The parent DropdownMenu logic handles the 'selected' prop complexity usually.
  // If selected is complex object, simple equality might fail, but let's assume parent passes relevant checker or we check values.
  // Actually the parent `DropdownMenu` passes `selected` which is the value.
  if (!props.selected) return false

  // Array check
  if (Array.isArray(props.selected)) return props.selected.includes(option.value)

  // Object/Primitive check
  if (typeof props.selected === 'object' && props.selected !== null) {
    if (option.key && option.key in props.selected)
      return props.selected[option.key] === option.value
  }

  return props.selected === option.value
}

const getGroupLabel = (group: IDropdownOption) => group.labelI18n ? $t(group.labelI18n) : group.label

</script>

<template>
  <div class="grid gap-6 p-4" :style="gridStyle">
    <div
      v-for="(group, gIndex) in options"
      :key="group.key || group.value || gIndex"
      class="flex flex-col space-y-2 min-w-[150px]">
      <div class="flex items-center gap-2 px-2 py-1 mb-1" :class="headerClass">
        <span class="font-semibold text-sm text-foreground">
          {{ getGroupLabel(group) }}
        </span>
        <Icon v-if="group.icon" :icon="group.icon" class="w-4 h-4 text-muted-foreground" />
      </div>

      <div class="flex flex-col space-y-1">
        <template v-if="group.children && group.children.length">
          <template
            v-for="(child, cIndex) in group.children"
            :key="child.key || child.value || cIndex">
            <DropdownItem
              :option="child"
              :selected="isSelected(child)"
              :selectable="selectable"
              class="w-full"
              @click="$emit('select', child)" />

            <template v-if="child.children && child.children.length">
              <div class="flex flex-col space-y-1 ml-3 pl-3 border-l border-border mt-0.5 mb-1.5">
                <DropdownItem
                  v-for="(grandChild, gcIndex) in child.children"
                  :key="grandChild.key || grandChild.value || gcIndex"
                  :option="grandChild"
                  :selected="isSelected(grandChild)"
                  :selectable="selectable"
                  class="w-full text-xs"
                  @click="$emit('select', grandChild)" />
              </div>
            </template>
          </template>
        </template>

        <div v-else class="px-2 text-xs text-muted-foreground italic">No items</div>
      </div>
    </div>
  </div>
</template>
