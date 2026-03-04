<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import { $t } from '@/utils/i18n'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandPaletteItem {
  id: string
  label: string
  labelI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  group?: string
  to?: string
  href?: string
  action?: () => void
  keywords?: string[]
  disabled?: boolean
}

export interface CommandPaletteGroup {
  key: string
  label: string
  items: CommandPaletteItem[]
}

interface Props {
  /** Items directly supplied to the palette (static list or pre-mapped) */
  items?: CommandPaletteItem[]
  /**
   * Raw SidebarMenuItemSchema tree — the palette auto-flattens and groups these.
   * Supports top-level links, nested children, and grouped items.
   */
  menuItems?: SidebarMenuItemSchema[]
  /** Keyboard shortcut that opens the palette (default: Meta+K / Ctrl+K) */
  shortcutKey?: string
  /** Placeholder text for the search input */
  placeholder?: string
  /** I18n translation key for placeholder */
  placeholderI18n?: string
  /** Maximum number of results shown per group */
  maxResultsPerGroup?: number
  /** Whether the palette is enabled at all — when false, nothing mounts or listens */
  enabled?: boolean
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
// I18n Helpers
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
const txtNoResultsDesc = computed(() => t('vlite.commandPalette.noResultsDesc', 'Try a different term or browse with arrow keys'))
const txtNavigate = computed(() => t('vlite.commandPalette.navigate', 'Navigate'))
const txtOpen = computed(() => t('vlite.commandPalette.open', 'Open'))
const txtClose = computed(() => t('vlite.commandPalette.close', 'Close'))
const txtResult = computed(() => t('vlite.commandPalette.result', 'result'))
const txtResults = computed(() => t('vlite.commandPalette.results', 'results'))

function getEffectiveLabel(item: CommandPaletteItem) {
  if (item.labelI18n) {
    const res = $t(item.labelI18n)
    if (res !== item.labelI18n) return res
  }
  return item.label
}

function getEffectiveDesc(item: CommandPaletteItem) {
  if (item.descriptionI18n) {
    const res = $t(item.descriptionI18n)
    if (res !== item.descriptionI18n) return res
  }
  return item.description ?? ''
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const router = useRouter()

// ---------------------------------------------------------------------------
// Flatten SidebarMenuItemSchema tree into CommandPaletteItems
// ---------------------------------------------------------------------------

function flattenMenuItems(
  items: SidebarMenuItemSchema[],
  parentLabel?: string,
  depth = 0
): CommandPaletteItem[] {
  const results: CommandPaletteItem[] = []
  for (const item of items) {
    const group = depth === 0 ? item.label : (parentLabel ?? 'Navigation')
    if (item.to || item.href || item.action) {
      results.push({
        id: item.id ?? (typeof item.to === 'string' ? item.to : '') ?? item.label,
        label: item.label,
        labelI18n: item.labelI18n,
        icon: item.icon,
        group,
        to: typeof item.to === 'string' ? item.to : (item.to as any)?.path,
        href: item.href,
        action: item.action,
        disabled: item.disabled,
      })
    }
    if (item.children?.length) {
      results.push(...flattenMenuItems(item.children, group, depth + 1))
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Merged item list (static items + flattened menu items)
// ---------------------------------------------------------------------------

const allItems = computed<CommandPaletteItem[]>(() => {
  const fromMenu = flattenMenuItems(props.menuItems)
  const seen = new Set<string>()
  const merged: CommandPaletteItem[] = []
  for (const item of [...props.items, ...fromMenu]) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      merged.push(item)
    }
  }
  return merged
})

// ---------------------------------------------------------------------------
// Search / filter
// ---------------------------------------------------------------------------

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function score(item: CommandPaletteItem, q: string): number {
  const label = normalize(getEffectiveLabel(item))
  const desc = normalize(getEffectiveDesc(item))
  const kw = (item.keywords ?? []).map(normalize).join(' ')
  const nq = normalize(q)

  if (label === nq) return 100
  if (label.startsWith(nq)) return 80
  if (label.includes(nq)) return 60
  if (desc.includes(nq) || kw.includes(nq)) return 40
  return 0
}

const filteredGroups = computed<CommandPaletteGroup[]>(() => {
  const q = query.value.trim()
  let items = allItems.value.filter((i) => !i.disabled)

  if (q) {
    items = items
      .map((item) => ({ item, s: score(item, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ item }) => item)
  }

  const groupMap = new Map<string, CommandPaletteItem[]>()
  for (const item of items) {
    const g = item.group ?? 'Actions'
    if (!groupMap.has(g)) groupMap.set(g, [])
    groupMap.get(g)!.push(item)
  }

  const groups: CommandPaletteGroup[] = []
  for (const [key, groupItems] of groupMap) {
    groups.push({
      key,
      label: key,
      items: groupItems.slice(0, props.maxResultsPerGroup),
    })
  }
  return groups
})

const flatItems = computed<CommandPaletteItem[]>(() => filteredGroups.value.flatMap((g) => g.items))

const totalCount = computed(() => flatItems.value.length)

// ---------------------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------------------

const open = () => {
  isOpen.value = true
  query.value = ''
  activeIndex.value = 0
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
}

// ---------------------------------------------------------------------------
// Keyboard shortcut listener — only when enabled
// ---------------------------------------------------------------------------

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (!props.enabled) return
  const isMeta = e.metaKey || e.ctrlKey
  if (isMeta && e.key === props.shortcutKey) {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => {
  if (props.enabled) {
    window.addEventListener('keydown', handleGlobalKeydown)
  }
})

onUnmounted(() => {
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
// Keyboard navigation inside the palette
// ---------------------------------------------------------------------------

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, totalCount.value - 1)
    scrollActiveIntoView()
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    scrollActiveIntoView()
    return
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    const item = flatItems.value[activeIndex.value]
    if (item) executeItem(item)
  }
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    const el = listRef.value?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  })
}

watch(query, () => {
  activeIndex.value = 0
})

// ---------------------------------------------------------------------------
// Execute selected item
// ---------------------------------------------------------------------------

const executeItem = (item: CommandPaletteItem) => {
  if (item.disabled) return
  close()
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
// Overlay click to close
// ---------------------------------------------------------------------------

const handleOverlayClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).hasAttribute('data-overlay')) close()
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getItemIndex = (groupIdx: number, itemIdx: number): number => {
  let count = 0
  for (let g = 0; g < groupIdx; g++) {
    count += filteredGroups.value[g].items.length
  }
  return count + itemIdx
}

const isMac = computed(() =>
  typeof navigator !== 'undefined' ? /mac/i.test(navigator.platform) : true
)
</script>

<template>
  <template v-if="enabled">
    <button
      type="button"
      class="command-palette-trigger hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground bg-muted/60 hover:bg-muted border border-border/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none cursor-pointer shrink-0"
      :aria-label="`Open command palette`"
      @click="open">
      <Icon icon="lucide:search" class="w-3.5 h-3.5 shrink-0" />
      <span class="hidden sm:block truncate max-w-[180px]">{{ displayPlaceholder.split(',')[0] }}...</span>
      <kbd
        class="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border border-border/80 bg-background text-muted-foreground ml-1">
        <span>{{ isMac ? '&#8984;' : 'Ctrl' }}</span>
        <span>{{ shortcutKey.toUpperCase() }}</span>
      </kbd>
    </button>

    <Transition name="cp-fade">
      <div
        v-if="isOpen"
        class="command-palette-overlay fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 pb-16"
        data-overlay
        role="dialog"
        aria-modal="true"
        :aria-label="`Command palette — ${totalCount} ${totalCount === 1 ? txtResult : txtResults}`"
        @click="handleOverlayClick"
        @keydown="handleKeydown">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          data-overlay
          aria-hidden="true" />

        <Transition name="cp-slide">
          <div
            v-if="isOpen"
            class="command-palette-panel relative w-full max-w-2xl bg-background border border-border/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            role="search">
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
                :aria-activedescendant="
                  flatItems[activeIndex] ? `cp-item-${flatItems[activeIndex].id}` : undefined
                "
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

            <div
              id="cp-listbox"
              ref="listRef"
              role="listbox"
              class="flex-1 overflow-y-auto py-2 scrollbar-thin"
              :aria-label="`${totalCount} ${totalCount === 1 ? txtResult : txtResults}`">
              <div
                v-if="totalCount === 0"
                class="flex flex-col items-center justify-center py-14 px-6 text-center select-none"
                aria-live="polite">
                <Icon icon="lucide:search-x" class="w-9 h-9 text-muted-foreground/40 mb-3" />
                <p class="text-sm font-medium text-muted-foreground">
                  {{ txtNoResults }}
                  <span class="text-foreground font-semibold">"{{ query }}"</span>
                </p>
                <p class="text-xs text-muted-foreground/60 mt-1">
                  {{ txtNoResultsDesc }}
                </p>
              </div>

              <template v-for="(group, gi) in filteredGroups" :key="group.key">
                <div
                  class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 select-none"
                  :aria-label="`Group: ${group.label}`">
                  {{ group.label }}
                </div>

                <div role="group" :aria-label="group.label">
                  <button
                    v-for="(item, ii) in group.items"
                    :key="item.id"
                    :id="`cp-item-${item.id}`"
                    type="button"
                    role="option"
                    :aria-selected="getItemIndex(gi, ii) === activeIndex"
                    :aria-disabled="item.disabled || undefined"
                    :data-active="getItemIndex(gi, ii) === activeIndex"
                    class="command-palette-item w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg text-sm transition-colors duration-100 text-left cursor-pointer select-none focus-visible:outline-none"
                    :class="[
                      getItemIndex(gi, ii) === activeIndex
                        ? 'bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                      item.disabled ? 'opacity-40 cursor-not-allowed' : '',
                    ]"
                    style="width: calc(100% - 8px)"
                    @click="executeItem(item)"
                    @mouseenter="activeIndex = getItemIndex(gi, ii)">
                    <span
                      class="shrink-0 flex items-center justify-center w-7 h-7 rounded-md"
                      :class="
                        getItemIndex(gi, ii) === activeIndex
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted/80 text-muted-foreground'
                      ">
                      <Icon :icon="item.icon ?? 'lucide:arrow-right'" class="w-3.5 h-3.5" />
                    </span>

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

                    <span
                      v-if="item.to"
                      class="shrink-0 text-[11px] font-mono text-muted-foreground/50 hidden sm:block truncate max-w-[120px]">
                      {{ item.to }}
                    </span>

                    <Icon
                      v-if="item.href"
                      icon="lucide:external-link"
                      class="shrink-0 w-3 h-3 text-muted-foreground/50" />

                    <kbd
                      v-if="getItemIndex(gi, ii) === activeIndex"
                      class="shrink-0 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-border/60 bg-background/80 text-muted-foreground ml-1">
                      &#8629;
                    </kbd>
                  </button>
                </div>

                <div
                  v-if="gi < filteredGroups.length - 1"
                  class="my-1.5 mx-3 h-px bg-border/40"
                  aria-hidden="true" />
              </template>
            </div>

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
                <kbd class="px-1 rounded border border-border/60 bg-background text-[10px]"
                  >&#8629;</kbd
                >
                {{ txtOpen }}
              </span>
              <span class="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <kbd class="px-1 rounded border border-border/60 bg-background text-[10px]"
                  >Esc</kbd
                >
                {{ txtClose }}
              </span>
              <span class="ml-auto text-[11px] text-muted-foreground/50">
                {{ totalCount }} {{ totalCount === 1 ? txtResult : txtResults }}
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.cp-fade-enter-active,
.cp-fade-leave-active {
  transition: opacity 0.15s ease;
}
.cp-fade-enter-from,
.cp-fade-leave-to {
  opacity: 0;
}

.cp-slide-enter-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.cp-slide-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.cp-slide-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(-6px);
}
.cp-slide-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}

.command-palette-panel ::-webkit-scrollbar {
  width: 4px;
}
.command-palette-panel ::-webkit-scrollbar-track {
  background: transparent;
}
.command-palette-panel ::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
</style>
