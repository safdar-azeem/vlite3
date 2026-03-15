<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { $t } from '@/utils/i18n'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import type { CommandPaletteItem } from './types'
import { useCommandPaletteItems } from './useCommandPaletteItems'
import { useCommandPaletteNav } from './useCommandPaletteNav'
import CommandPaletteItemVue from './CommandPaletteItem.vue'

const props = defineProps<{
  close: () => void
  items: CommandPaletteItem[]
  menuItems: SidebarMenuItemSchema[]
  placeholder: string
  placeholderI18n?: string
  maxResultsPerGroup: number
  onOpenDynamicModal: (body: any, modalProps: any) => void
}>()

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

const t = (key: string, fallback: string) => {
  const res = $t(key)
  return res !== key ? res : fallback
}

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) {
    const res = $t(props.placeholderI18n)
    if (res !== props.placeholderI18n) return res
  }
  return props.placeholder
})

const txtNoResults = computed(() => t('vlite.commandPalette.noResults', 'No results for'))
const txtNoResultsDesc = computed(() =>
  t('vlite.commandPalette.noResultsDesc', 'Try a different term or browse with arrow keys')
)
const txtNavigate = computed(() => t('vlite.commandPalette.navigate', 'Navigate'))
const txtOpen = computed(() => t('vlite.commandPalette.open', 'Open'))
const txtClose = computed(() => t('vlite.commandPalette.close', 'Close'))
const txtResult = computed(() => t('vlite.commandPalette.result', 'result'))
const txtResults = computed(() => t('vlite.commandPalette.results', 'results'))

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const router = useRouter()

// ---------------------------------------------------------------------------
// Items composable — flatten, merge, filter, build flat render list
// ---------------------------------------------------------------------------

const { flatList } = useCommandPaletteItems({
  items: () => props.items,
  menuItems: () => props.menuItems,
  query: () => query.value,
  maxResultsPerGroup: () => props.maxResultsPerGroup,
})

const totalCount = computed(() => flatList.value.total)

// ---------------------------------------------------------------------------
// Execute item
// ---------------------------------------------------------------------------

const executeItem = (item: CommandPaletteItem) => {
  if (item.disabled) return
  props.close()
  if (item.modalBody) {
    props.onOpenDynamicModal(item.modalBody, item.modalProps)
    return
  }
  if (item.action) {
    item.action()
    return
  }
  if (item.to) {
    router.push(item.to).catch(() => {})
    return
  }
  if (item.href) {
    window.open(item.href, '_blank', 'noopener,noreferrer')
  }
}

// ---------------------------------------------------------------------------
// Navigation composable — keyboard + pointer-lock + rAF hover
// ---------------------------------------------------------------------------

const { activeIndex, isPointerLocked, handleKeydown, handleItemMouseenter } = useCommandPaletteNav({
  flatList,
  listRef,
  onExecute: executeItem,
  onClose: props.close,
})

// Reset active index when query changes
watch(query, () => {
  activeIndex.value = 0
})

// ---------------------------------------------------------------------------
// Auto-focus input on mount
// ---------------------------------------------------------------------------

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
})
</script>

<template>
  <div class="command-palette-content flex flex-col w-full h-full max-h-[70vh]">
    <!-- Search input row -->
    <div class="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 shrink-0">
      <Icon icon="lucide:search" class="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        :placeholder="displayPlaceholder"
        class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none min-w-0"
        aria-autocomplete="list"
        aria-controls="cp-listbox"
        @keydown="handleKeydown" />
      <button
        type="button"
        class="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Close"
        tabindex="-1"
        @click="close">
        <Icon icon="lucide:x" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!--
      GPU-promoted scroll container.
      transform: translateZ(0) moves it to its own compositor layer so scroll
      painting is decoupled from main-thread JS. touch-action: pan-y enables
      passive touch listeners, eliminating touch-scroll jank.
    -->
    <div
      id="cp-listbox"
      ref="listRef"
      role="listbox"
      class="flex-1 overflow-y-auto py-2 scrollbar-thin cp-scroll-container"
      :aria-label="`${totalCount} ${totalCount === 1 ? txtResult : txtResults}`">
      <!-- Empty state -->
      <div
        v-if="totalCount === 0"
        class="flex flex-col items-center justify-center py-14 px-6 text-center select-none"
        aria-live="polite">
        <Icon icon="lucide:search-x" class="w-9 h-9 text-muted-foreground/40 mb-3" />
        <p class="text-sm font-medium text-muted-foreground">
          {{ txtNoResults }}
          <span class="text-foreground font-semibold">"{{ query }}"</span>
        </p>
        <p class="text-xs text-muted-foreground/60 mt-1">{{ txtNoResultsDesc }}</p>
      </div>

      <!--
        Render from flatList — each row carries its absolute index as a plain number.
        v-memo receives [isActive (bool), item.id (string)] — both primitives.
        Vue only re-patches the 2 rows that changed (old active + new active).
        All other rows are bailed out in O(1) per row.
      -->
      <template v-for="group in flatList.groups" :key="group.key">
        <div
          class="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 select-none"
          :aria-label="`Group: ${group.label}`">
          {{ group.label }}
        </div>

        <div role="group" :aria-label="group.label" class="px-1.5">
          <CommandPaletteItemVue
            v-for="row in group.rows"
            :key="row.item.id"
            v-memo="[row.index === activeIndex, row.item.id]"
            :item="row.item"
            :index="row.index"
            :is-active="row.index === activeIndex"
            :is-pointer-locked="isPointerLocked"
            @execute="executeItem"
            @mouseenter="handleItemMouseenter" />
        </div>

        <!-- Divider between groups (not after the last group) -->
        <div
          v-if="group.rows.length && group.rows[group.rows.length - 1].isLastInGroup"
          class="my-1.5 mx-3 h-px bg-border/40"
          aria-hidden="true" />
      </template>
    </div>

    <!-- Footer keyboard hints -->
    <div
      class="px-4 py-2.5 border-t border-border/40 flex items-center gap-4 shrink-0 bg-muted/30"
      aria-hidden="true">
      <span class="flex items-center gap-1 text-[11px] text-muted-foreground/60">
        <kbd class="px-1 rounded border border-border/60 bg-background text-[10px]"
          >&#8593;&#8595;</kbd
        >
        {{ txtNavigate }}
      </span>
      <span class="flex items-center gap-1 text-[11px] text-muted-foreground/60">
        <kbd class="px-1 rounded border border-border/60 bg-background text-[10px]">&#8629;</kbd>
        {{ txtOpen }}
      </span>
      <span class="flex items-center gap-1 text-[11px] text-muted-foreground/60">
        <kbd class="px-1 rounded border border-border/60 bg-background text-[10px]">Esc</kbd>
        {{ txtClose }}
      </span>
      <span class="ml-auto text-[11px] text-muted-foreground/50">
        {{ totalCount }} {{ totalCount === 1 ? txtResult : txtResults }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.command-palette-content ::-webkit-scrollbar {
  width: 4px;
}
.command-palette-content ::-webkit-scrollbar-track {
  background: transparent;
}
.command-palette-content ::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}

/*
  GPU-promote to its own compositor layer.
  Scroll painting is fully decoupled from main-thread layout and JS execution.
*/
.cp-scroll-container {
  transform: translateZ(0);
  will-change: transform;
  touch-action: pan-y;
  backface-visibility: hidden;
}
</style>
