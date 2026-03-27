<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef, markRaw } from 'vue'
import Icon from './Icon.vue'
import Modal from './Modal.vue'
import { CommandPaletteContent } from './CommandPalette'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import { $t } from '@/utils/i18n'

// ---------------------------------------------------------------------------
// Re-export types so consumers can import from NavbarCommandPalette directly
// ---------------------------------------------------------------------------

export type { CommandPaletteItem, CommandPaletteGroup } from './CommandPalette'

// Backwards-compat alias
export type CommandPlateSchema = import('./CommandPalette').CommandPaletteItem

interface Props {
  /** Items directly supplied to the palette (static list or pre-mapped) */
  items?: import('./CommandPalette').CommandPaletteItem[]
  /**
   * Raw SidebarMenuItemSchema tree — the palette auto-flattens and groups these.
   */
  menuItems?: SidebarMenuItemSchema[]
  /** Keyboard shortcut that opens the palette (default: Meta+K / Ctrl+K) */
  shortcutKey?: string
  /** Placeholder text for the search input */
  placeholder?: string
  /** i18n translation key for placeholder */
  placeholderI18n?: string
  /** Maximum number of results shown per group */
  maxResultsPerGroup?: number
  /** When false, nothing renders and no shortcut listener is registered */
  enabled?: boolean
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  menuItems: () => [],
  shortcutKey: 'k',
  placeholder: 'Search commands, pages, and actions...',
  maxResultsPerGroup: 10,
  enabled: true,
})

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const isOpen = ref(false)
const isDynamicModalOpen = ref(false)
const activeModalBody = shallowRef<any>(null)
const activeModalProps = ref<Record<string, any>>({})

const open = () => {
  isOpen.value = true
}
const close = () => {
  isOpen.value = false
}

const handleOpenDynamicModal = (body: any, modalProps: any) => {
  close()
  // PERFORMANCE: markRaw strictly enforces that nested components 
  // do not trigger recursive reactivity trees.
  activeModalBody.value = body ? markRaw(body) : null
  activeModalProps.value = modalProps || {}
  isDynamicModalOpen.value = true
}

// ---------------------------------------------------------------------------
// Global keyboard shortcut
// ---------------------------------------------------------------------------

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (!props.enabled) return
  if ((e.metaKey || e.ctrlKey) && e.key === props.shortcutKey) {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => {
  if (props.enabled) window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  // PERFORMANCE: memory leak prevention
  window.removeEventListener('keydown', handleGlobalKeydown)
})

watch(
  () => props.enabled,
  (val) => {
    if (val) {
      window.addEventListener('keydown', handleGlobalKeydown)
    } else {
      window.removeEventListener('keydown', handleGlobalKeydown)
      if (isOpen.value) close()
    }
  }
)

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) {
    const res = $t(props.placeholderI18n)
    if (res !== props.placeholderI18n) return res
  }
  return props.placeholder
})

const isMac = computed(() =>
  typeof navigator !== 'undefined' ? /mac/i.test(navigator.platform) : true
)
</script>

<template>
  <template v-if="enabled">
    <button
      type="button"
      class="command-palette-trigger inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground bg-muted/60 hover:bg-muted border border-border/60 focus-visible:outline-none justify-between focus-visible:ring-2 focus-visible:ring-primary/50 select-none cursor-pointer shrink-0"
      :aria-label="`Open command palette`"
      :class="triggerClass"
      @click="open">
      <Icon icon="lucide:search" class="w-3.5 h-3.5 shrink-0" />
      <span class="block truncate -text-fs-1.5">{{ displayPlaceholder.split(',')[0] }}...</span>
      <kbd
        class="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border border-border/80 bg-background text-muted-foreground ml-1">
        <span>{{ isMac ? '&#8984;' : 'Ctrl' }}</span>
        <span>{{ shortcutKey.toUpperCase() }}</span>
      </kbd>
    </button>

    <Modal
      v-model:show="isOpen"
      maxWidth="max-w-xl"
      bodyClass="p-0! flex flex-col h-full"
      :body="CommandPaletteContent"
      :bodyProps="{
        items,
        menuItems,
        placeholder,
        placeholderI18n,
        maxResultsPerGroup,
        onOpenDynamicModal: handleOpenDynamicModal,
      }" />

    <Modal
      v-bind="activeModalProps"
      v-model:show="isDynamicModalOpen"
      :body="activeModalBody"
      :bodyProps="activeModalProps" />
  </template>
</template>
