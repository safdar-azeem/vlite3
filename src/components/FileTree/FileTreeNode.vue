<script setup lang="ts">
import { computed } from 'vue'
import type { FileNode, FileTreeSelectionMode } from './types'
import Icon from '../Icon.vue'
import CheckBox from '../CheckBox.vue'
import { $t } from '@/utils/i18n'

defineOptions({
  name: 'FileTreeNode',
})

interface Props {
  node: FileNode
  depth?: number
  selectionMode?: FileTreeSelectionMode
  selectedKeys: Set<string>
  indeterminateKeys: Set<string>
  expandedKeys: Set<string>
  loadingKeys: Set<string>
  showCheckboxes?: boolean
  highlightSearch?: boolean
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  selectionMode: 'single',
  showCheckboxes: false,
  highlightSearch: false,
})

const emit = defineEmits<{
  (e: 'toggle-expand', node: FileNode): void
  (e: 'toggle-select', node: FileNode): void
  (e: 'click-node', node: FileNode): void
}>()

// Computed
const isSelected = computed(() => props.selectedKeys.has(props.node.id))
const isIndeterminate = computed(() => props.indeterminateKeys.has(props.node.id))
const isExpanded = computed(() => props.expandedKeys.has(props.node.id))
const isLoading = computed(() => props.loadingKeys.has(props.node.id))

const isFolder = computed(
  () => props.node.isFolder || (props.node.children && props.node.children.length > 0)
)

const paddingLeft = computed(() => {
  return props.depth * 20 + 'px' // 20px per level
})

const displayLabel = computed(() => props.node.labelI18n ? $t(props.node.labelI18n) : props.node.label)

// Truncation Helper
const truncatedLabel = computed(() => {
  const label = displayLabel.value
  const maxLength = 35 // Max chars before truncation logic kicks in

  if (label.length <= maxLength) return label

  // Attempt to preserve extension
  const lastDotIndex = label.lastIndexOf('.')

  if (lastDotIndex === -1 || label.length - lastDotIndex > 10) {
    return label.substring(0, maxLength) + '...'
  }

  const ext = label.substring(lastDotIndex)
  const name = label.substring(0, lastDotIndex)

  const available = Math.max(0, maxLength - ext.length - 3)

  return name.substring(0, available) + '...' + ext
})

// Highlight Search (Label)
const labelParts = computed(() => {
  const displayText = truncatedLabel.value

  if (!props.highlightSearch || !props.searchQuery) {
    return [{ text: displayText, highlight: false }]
  }
  const query = props.searchQuery.toLowerCase()
  const index = displayText.toLowerCase().indexOf(query)

  if (index === -1) return [{ text: displayText, highlight: false }]

  return [
    { text: displayText.slice(0, index), highlight: false },
    {
      text: displayText.slice(index, index + query.length),
      highlight: true,
    },
    { text: displayText.slice(index + query.length), highlight: false },
  ]
})

// Highlight Search Match (Content)
const contentMatchParts = computed(() => {
  const match = props.node.searchMatch
  if (!match) return []

  const text = match.line_content
  const start = match.match_start
  const len = match.match_length

  // Safety check
  if (start < 0 || start >= text.length) return [{ text, highlight: false }]

  return [
    { text: text.substring(0, start), highlight: false },
    { text: text.substring(start, start + len), highlight: true },
    { text: text.substring(start + len), highlight: false },
  ]
})

// Handlers
const handleExpand = (e?: MouseEvent) => {
  if (e) e.stopPropagation()
  emit('toggle-expand', props.node)
}

const handleSelect = () => {
  emit('toggle-select', props.node)
}

const handleClick = (e: MouseEvent) => {
  e.stopPropagation()

  if (isFolder.value) {
    handleExpand()
  } else {
    if (props.selectionMode !== 'none') {
      emit('toggle-select', props.node)
    }
  }

  emit('click-node', props.node)
}
</script>

<template>
  <div class="flex flex-col select-none">
    <div
      class="group flex flex-col rounded-md transition-colors cursor-pointer"
      :class="{
        'bg-accent/50 text-accent-foreground': isSelected && selectionMode === 'single' && !showCheckboxes,
        'hover:bg-accent/50': !isSelected || selectionMode !== 'single',
        'opacity-50 pointer-events-none': node.disabled,
      }"
      @click="handleClick"
      :title="displayLabel"
    >
      <div class="flex items-center py-1 pr-2 min-h-[32px]" :style="{ paddingLeft }">
        <button
          v-if="isFolder"
          type="button"
          class="p-1 mr-1 rounded-sm hover:bg-muted text-muted-foreground transition-transform duration-200 focus:outline-none"
          :class="{ 'rotate-90': isExpanded }"
          @click.stop="handleExpand"
        >
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
        <div v-else class="w-6 mr-1" />

        <div
          v-if="showCheckboxes && selectionMode !== 'none'"
          class="mr-2 flex items-center justify-center bg-transparent"
          @click.stop
        >
          <CheckBox
            :checked="isSelected"
            :indeterminate="isIndeterminate"
            :disabled="node.disabled"
            @update:checked="handleSelect"
            rounded="sm"
            size="sm"
          />
        </div>

        <div class="mr-2 text-muted-foreground shrink-0">
          <Icon v-if="isLoading" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else-if="node.icon" :icon="node.icon" class="w-4 h-4" />
          <Icon
            v-else-if="isFolder"
            :icon="isExpanded ? 'lucide:folder-open' : 'lucide:folder'"
            class="w-4 h-4"
          />
          <Icon v-else icon="lucide:file" class="w-4 h-4" />
        </div>

        <div class="flex-1 truncate text-sm font-medium">
          <template v-for="(part, i) in labelParts" :key="i">
            <span
              :class="{
                'bg-yellow-100 text-yellow-900 rounded-sm px-0.5': part.highlight,
              }"
              >{{ part.text }}</span
            >
          </template>
        </div>
      </div>

      <div
        v-if="node.searchMatch"
        class="flex items-center text-[11px] text-gray-500 font-mono pr-2 pb-1.5 truncate"
        :style="{ paddingLeft: (depth * 20 + 28) + 'px' }"
      >
        <span class="mr-2 text-gray-400 select-none shrink-0"
          >L{{ node.searchMatch.line_number }}</span
        >
        <div class="truncate">
          <template v-for="(part, i) in contentMatchParts" :key="i">
            <span
              :class="{
                'bg-yellow-500/20 text-gray-900 px-0.5 rounded-[1px] font-medium border border-yellow-600/30': part.highlight,
              }"
              >{{ part.text }}</span
            >
          </template>
        </div>
      </div>
    </div>

    <div v-if="isExpanded && isFolder && !isLoading" class="relative flex flex-col">
      <div
        class="absolute top-1 bottom-1 border-l border-border"
        :style="{ left: depth * 20 + 10 + 'px' }"
      ></div>

      <template v-if="node.children && node.children.length > 0">
        <FileTreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :depth="depth + 1"
          :selection-mode="selectionMode"
          :selected-keys="selectedKeys"
          :expanded-keys="expandedKeys"
          :indeterminate-keys="indeterminateKeys"
          :loading-keys="loadingKeys"
          :show-checkboxes="showCheckboxes"
          :highlight-search="highlightSearch"
          :search-query="searchQuery"
          @toggle-expand="(n) => $emit('toggle-expand', n)"
          @toggle-select="(n) => $emit('toggle-select', n)"
          @click-node="(n) => $emit('click-node', n)"
        />
      </template>
      
      <div
        v-else-if="isExpanded && isFolder && (!node.children || node.children.length === 0)"
        class="py-0.5 text-xs text-muted-foreground italic"
        :style="{ paddingLeft: (depth + 1) * 20 + 26 + 'px' }"
      ></div>
    </div>
  </div>
</template>

