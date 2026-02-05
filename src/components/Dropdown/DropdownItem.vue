<script setup lang="ts">
import Icon from '../Icon.vue'
import type { IDropdownOption } from '@/types'

interface Props {
  option: IDropdownOption
  selected?: boolean
  focused?: boolean
  selectable?: boolean
  index?: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', option: IDropdownOption): void
  (e: 'mouseenter', index: number): void
}>()
</script>

<template>
  <div
    data-dropdown-item
    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50"
    :class="[
      selectable && selected && !option.children ? 'bg-accent' : '',
      focused ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground',
      option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    :data-disabled="option.disabled ? true : undefined"
    @click="emit('click', option)"
    @mouseenter="$emit('mouseenter', index ?? -1)">
    <slot name="default" v-bind="{ option, index, selected }">
      <Icon v-if="option.icon" :icon="option.icon" class="mr-2 h-4 w-4 shrink-0 mt-0.5" />
      <div class="flex flex-col flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <span class="truncate font-medium">{{ option.label }}</span>
          <span
            v-if="option.subtitle"
            class="text-xs text-muted-foreground whitespace-nowrap opacity-90"
            >{{ option.subtitle }}</span
          >
        </div>
        <span
          v-if="option.description"
          class="text-[10px] text-muted-foreground truncate opacity-70"
          >{{ option.description }}</span
        >
      </div>
      <Icon
        v-if="selectable && selected"
        icon="lucide:check"
        class="ml-2 h-4 w-4 shrink-0 text-primary" />
    </slot>
  </div>
</template>
