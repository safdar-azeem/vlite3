<script setup lang="ts">
/**
 * CommandPaletteItem
 *
 * Renders a single row in the command palette list.
 * Accepts isActive as a prop so v-memo on the parent can correctly
 * bail out: only the previously-active and newly-active rows re-patch.
 */
import Icon from '@/components/Icon.vue'
import type { CommandPaletteItem } from './types'
import { getEffectiveLabel, getEffectiveDesc } from './useCommandPaletteItems'

const props = defineProps<{
  item: CommandPaletteItem
  isActive: boolean
  isPointerLocked: boolean
  index: number
}>()

const emit = defineEmits<{
  (e: 'execute', item: CommandPaletteItem): void
  (e: 'mouseenter', index: number): void
}>()
</script>

<template>
  <button
    :id="`cp-item-${item.id}`"
    type="button"
    role="option"
    :aria-selected="isActive"
    :aria-disabled="item.disabled || undefined"
    :data-active="isActive"
    class="command-palette-item w-full flex items-center gap-3 px-3! py-2.5 mx-1 rounded-lg text-sm text-left cursor-pointer select-none focus-visible:outline-none cp-item-transition"
    :class="[
      isActive
        ? 'bg-gray-200/80 text-foreground'
        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
      item.disabled ? 'opacity-40 cursor-not-allowed' : '',
      isPointerLocked ? 'pointer-events-none' : '',
    ]"
    style="width: calc(100% - 8px)"
    @click="emit('execute', item)"
    @mouseenter="emit('mouseenter', index)">

    <!-- Icon badge -->
    <span
      class="shrink-0 flex items-center justify-center w-7 h-7 rounded-md"
      :class="isActive ? 'bg-gray-300/80 text-gray-900' : 'bg-muted/80 text-muted-foreground'">
      <Icon :icon="item.icon ?? 'lucide:arrow-right'" class="w-3.5 h-3.5" />
    </span>

    <!-- Label + description -->
    <span class="flex-1 min-w-0">
      <span class="block font-medium truncate text-inherit leading-tight">
        {{ getEffectiveLabel(item) }}
      </span>
      <span
        v-if="item.description || item.descriptionI18n"
        class="block text-xs text-muted-foreground/70 truncate mt-0.5">
        {{ getEffectiveDesc(item) }}
      </span>
    </span>

    <!-- External link indicator -->
    <Icon
      v-if="item.href"
      icon="lucide:external-link"
      class="shrink-0 w-3 h-3 text-muted-foreground/50" />

    <!-- Enter hint shown only on active row -->
    <kbd
      v-if="isActive"
      class="shrink-0 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-border/60 bg-background/80 text-muted-foreground ml-1">
      &#8629;
    </kbd>
  </button>
</template>

<style scoped>
.cp-item-transition {
  transition: background-color 80ms ease, color 80ms ease;
}
</style>
