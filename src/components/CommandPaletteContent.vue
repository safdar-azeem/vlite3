<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import { $t } from '@/utils/i18n'
import type { CommandPaletteItem, CommandPaletteGroup } from './NavbarCommandPalette.vue'

const props = defineProps<{
  close: () => void
  items: CommandPaletteItem[]
  menuItems: SidebarMenuItemSchema[]
  placeholder: string
  placeholderI18n?: string
  maxResultsPerGroup: number
  onOpenDynamicModal: (body: any, props: any) => void
}>()

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
const txtNoResultsDesc = computed(() =>
  t('vlite.commandPalette.noResultsDesc', 'Try a different term or browse with arrow keys')
)
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

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const router = useRouter()

// ---------------------------------------------------------------------------
// Flatten Trees into CommandPaletteItems
// ---------------------------------------------------------------------------

function checkShow(show?: boolean | (() => boolean)): boolean {
  if (typeof show === 'function') {
    return show()
  }
  if (show !== undefined) {
    return show
  }
  return true
}

function flattenCommandItems(
  items: CommandPaletteItem[],
  parentLabel?: string,
  depth = 0
): CommandPaletteItem[] {
  const results: CommandPaletteItem[] = []
  for (const item of items) {
    if (!checkShow(item.show)) continue

    const group = depth === 0 ? item.label : (parentLabel ?? 'Navigation')
    if (item.to || item.href || item.action || item.modalBody) {
      results.push({
        ...item,
        id: item.id ?? item.to ?? item.label ?? Math.random().toString(),
        group: item.group ?? group,
      })
    }
    if (item.children?.length) {
      results.push(...flattenCommandItems(item.children, group, depth + 1))
    }
  }
  return results
}

function flattenSidebarItems(
  items: SidebarMenuItemSchema[],
  parentLabel?: string,
  depth = 0
): CommandPaletteItem[] {
  const results: CommandPaletteItem[] = []
  for (const item of items) {
    if (!checkShow((item as any).show)) continue

    const group = depth === 0 ? item.label : (parentLabel ?? 'Navigation')
    if (item.to || item.href || item.action || (item as any).modalBody) {
      results.push({
        id:
          item.id ??
          (typeof item.to === 'string' ? item.to : '') ??
          item.label ??
          Math.random().toString(),
        label: item.label,
        labelI18n: item.labelI18n,
        icon: item.icon,
        group: (item as any).group ?? group,
        to: typeof item.to === 'string' ? item.to : (item.to as any)?.path,
        href: item.href,
        action: item.action ? () => item.action!(item) : undefined,
        disabled: item.disabled,
        modalBody: (item as any).modalBody,
        modalProps: (item as any).modalProps,
      })
    }
    if (item.children?.length) {
      results.push(...flattenSidebarItems(item.children, group, depth + 1))
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Merged item list (static items + flattened menu items)
// ---------------------------------------------------------------------------

const allItems = computed<CommandPaletteItem[]>(() => {
  const fromMenu = flattenSidebarItems(props.menuItems || [])
  const fromStatic = flattenCommandItems(props.items || [])
  const seen = new Set<string>()
  const merged: CommandPaletteItem[] = []
  for (const item of [...fromStatic, ...fromMenu]) {
    if (item.id && !seen.has(item.id)) {
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
// Keyboard navigation inside the palette
// ---------------------------------------------------------------------------

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    props.close()
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
// Helpers
// ---------------------------------------------------------------------------

const getItemIndex = (groupIdx: number, itemIdx: number): number => {
  let count = 0
  for (let g = 0; g < groupIdx; g++) {
    count += filteredGroups.value[g].items.length
  }
  return count + itemIdx
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<template>
  <div class="command-palette-content flex flex-col w-full h-full max-h-[70vh]">
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
          class="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 select-none"
          :aria-label="`Group: ${group.label}`">
          {{ group.label }}
        </div>

        <div role="group" :aria-label="group.label" class="px-2">
          <button
            v-for="(item, ii) in group.items"
            :key="item.id"
            :id="`cp-item-${item.id}`"
            type="button"
            role="option"
            :aria-selected="getItemIndex(gi, ii) === activeIndex"
            :aria-disabled="item.disabled || undefined"
            :data-active="getItemIndex(gi, ii) === activeIndex"
            class="command-palette-item w-full flex items-center gap-3 px-3! py-2.5 mx-1 rounded-lg text-sm transition-colors duration-100 text-left cursor-pointer select-none focus-visible:outline-none"
            :class="[
              getItemIndex(gi, ii) === activeIndex
                ? 'bg-gray-200 text-foreground'
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
                  ? 'bg-gray-300 text-primary'
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
</style>
