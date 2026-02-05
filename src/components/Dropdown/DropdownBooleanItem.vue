<script setup lang="ts">
import Switch from '../Switch.vue'
import Icon from '../Icon.vue'
import type { IDropdownOption } from '@/types'

interface Props {
  option: IDropdownOption
  value: boolean
  focused?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', value: boolean, option: IDropdownOption): void
}>()

const handleToggle = (newValue: boolean) => {
  emit('change', newValue, props.option)
}
</script>

<template>
  <div
    data-dropdown-item
    class="relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
    :class="[
      focused ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground',
    ]"
    @click.stop="handleToggle(!value)">
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <Icon v-if="option.icon" :icon="option.icon" class="h-4 w-4 shrink-0 opacity-70" />
      <span class="truncate font-medium">{{ option.label }}</span>
    </div>
    <Switch
      :model-value="value"
      class="ml-3 shrink-0 scale-75 origin-right"
      @update:model-value="handleToggle" />
  </div>
</template>
