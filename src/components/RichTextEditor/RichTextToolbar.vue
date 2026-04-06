<script setup lang="ts">
import Icon from '../Icon.vue'

interface Props {
  toolbarState: Record<string, boolean>
  activeBlock: string
  disabled?: boolean
  readonly?: boolean
  isUploadingImage: boolean
  label?: string
}

defineProps<Props>()

const emit = defineEmits<{
  command: [cmd: string, val?: string]
  setBlock: [tag: string]
  insertCode: []
  triggerImageUpload: []
  openLinkPopover: []
  clearFormat: []
}>()
</script>

<template>
  <!-- mousedown.prevent on the wrapper keeps editor focus when clicking buttons -->
  <div
    class="rte-toolbar"
    role="toolbar"
    :aria-label="label ? `${label} formatting toolbar` : 'Rich text editor toolbar'"
    :aria-disabled="disabled || readonly || undefined"
    @mousedown.prevent>

    <!-- History -->
    <button
      type="button"
      class="rte-btn"
      title="Undo (Ctrl+Z)"
      aria-label="Undo"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'undo')">
      <Icon icon="lucide:undo-2" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Redo (Ctrl+Y)"
      aria-label="Redo"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'redo')">
      <Icon icon="lucide:redo-2" class="rte-icon" aria-hidden="true" />
    </button>

    <!-- Static separator — v-once since it never changes -->
    <div v-once class="rte-sep" aria-hidden="true" />

    <!-- Block format -->
    <button
      type="button"
      class="rte-btn rte-btn--text"
      title="Heading 1"
      aria-label="Heading 1"
      :aria-pressed="activeBlock === 'h1'"
      :class="{ 'rte-btn--active': activeBlock === 'h1' }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('setBlock', 'h1')">H1</button>
    <button
      type="button"
      class="rte-btn rte-btn--text"
      title="Heading 2"
      aria-label="Heading 2"
      :aria-pressed="activeBlock === 'h2'"
      :class="{ 'rte-btn--active': activeBlock === 'h2' }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('setBlock', 'h2')">H2</button>
    <button
      type="button"
      class="rte-btn rte-btn--text"
      title="Paragraph"
      aria-label="Paragraph"
      :aria-pressed="activeBlock === 'p' || activeBlock === 'div'"
      :class="{ 'rte-btn--active': activeBlock === 'p' || activeBlock === 'div' }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('setBlock', 'p')">P</button>

    <div v-once class="rte-sep" aria-hidden="true" />

    <!-- Inline formatting -->
    <button
      type="button"
      class="rte-btn"
      title="Bold (Ctrl+B)"
      aria-label="Bold"
      :aria-pressed="toolbarState.bold"
      :class="{ 'rte-btn--active': toolbarState.bold }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'bold')">
      <Icon icon="lucide:bold" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Italic (Ctrl+I)"
      aria-label="Italic"
      :aria-pressed="toolbarState.italic"
      :class="{ 'rte-btn--active': toolbarState.italic }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'italic')">
      <Icon icon="lucide:italic" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Underline (Ctrl+U)"
      aria-label="Underline"
      :aria-pressed="toolbarState.underline"
      :class="{ 'rte-btn--active': toolbarState.underline }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'underline')">
      <Icon icon="lucide:underline" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Strikethrough"
      aria-label="Strikethrough"
      :aria-pressed="toolbarState.strikeThrough"
      :class="{ 'rte-btn--active': toolbarState.strikeThrough }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'strikeThrough')">
      <Icon icon="lucide:strikethrough" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Inline Code"
      aria-label="Inline Code"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('insertCode')">
      <Icon icon="lucide:code" class="rte-icon" aria-hidden="true" />
    </button>

    <div v-once class="rte-sep" aria-hidden="true" />

    <!-- Lists -->
    <button
      type="button"
      class="rte-btn"
      title="Bullet List"
      aria-label="Bullet list"
      :aria-pressed="toolbarState.insertUnorderedList"
      :class="{ 'rte-btn--active': toolbarState.insertUnorderedList }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'insertUnorderedList')">
      <Icon icon="lucide:list" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Numbered List"
      aria-label="Numbered list"
      :aria-pressed="toolbarState.insertOrderedList"
      :class="{ 'rte-btn--active': toolbarState.insertOrderedList }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'insertOrderedList')">
      <Icon icon="lucide:list-ordered" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Blockquote"
      aria-label="Blockquote"
      :aria-pressed="activeBlock === 'blockquote'"
      :class="{ 'rte-btn--active': activeBlock === 'blockquote' }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('setBlock', 'blockquote')">
      <Icon icon="lucide:quote" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Horizontal Rule"
      aria-label="Insert horizontal rule"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'insertHorizontalRule')">
      <Icon icon="lucide:minus" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Insert Image"
      aria-label="Insert image"
      :disabled="disabled || readonly || isUploadingImage"
      @mousedown.prevent="emit('triggerImageUpload')">
      <Icon v-if="isUploadingImage" icon="lucide:loader-2" class="rte-icon animate-spin" aria-hidden="true" />
      <Icon v-else icon="lucide:image" class="rte-icon" aria-hidden="true" />
    </button>

    <div v-once class="rte-sep" aria-hidden="true" />

    <!-- Alignment -->
    <button
      type="button"
      class="rte-btn"
      title="Align Left"
      aria-label="Align left"
      :aria-pressed="toolbarState.justifyLeft"
      :class="{ 'rte-btn--active': toolbarState.justifyLeft }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'justifyLeft')">
      <Icon icon="lucide:align-left" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Align Center"
      aria-label="Align center"
      :aria-pressed="toolbarState.justifyCenter"
      :class="{ 'rte-btn--active': toolbarState.justifyCenter }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'justifyCenter')">
      <Icon icon="lucide:align-center" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Align Right"
      aria-label="Align right"
      :aria-pressed="toolbarState.justifyRight"
      :class="{ 'rte-btn--active': toolbarState.justifyRight }"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('command', 'justifyRight')">
      <Icon icon="lucide:align-right" class="rte-icon" aria-hidden="true" />
    </button>

    <div v-once class="rte-sep" aria-hidden="true" />

    <!-- Link & Clear -->
    <button
      type="button"
      class="rte-btn"
      title="Insert / Edit Link (Ctrl+K)"
      aria-label="Insert or edit link"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('openLinkPopover')">
      <Icon icon="lucide:link" class="rte-icon" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rte-btn"
      title="Clear Formatting"
      aria-label="Clear formatting"
      :disabled="disabled || readonly"
      @mousedown.prevent="emit('clearFormat')">
      <Icon icon="lucide:remove-formatting" class="rte-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<style>
.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  padding: 6px 8px;
  gap: 2px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: calc(var(--radius) - 1px) calc(var(--radius) - 1px) 0 0;
  align-items: center;
}

.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-muted-foreground);
  cursor: pointer;
  transition: all 0.1s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.rte-btn:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-foreground);
}

.rte-btn--active {
  background: var(--color-accent);
  color: var(--color-foreground);
}

.rte-btn--text {
  font-size: 0.75rem;
  font-weight: 700;
  width: auto;
  min-width: 28px;
  padding: 0 6px;
}

.rte-icon {
  width: 1.1rem;
  height: 1.1rem;
  stroke-width: 2.5;
}

.rte-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

.rte-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.rte-sep {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  margin: 0 3px;
  flex-shrink: 0;
}
</style>
