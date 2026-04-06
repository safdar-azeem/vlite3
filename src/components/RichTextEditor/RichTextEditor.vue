<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import Icon from '../Icon.vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  minHeight?: string
  label?: string
  error?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start typing…',
  disabled: false,
  minHeight: '180px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const rootRef = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)
const isEmpty = ref(true)

// ──────────────────────────────────────────────────────────
// DOM ↔ v-model sync
// ──────────────────────────────────────────────────────────
watch(
  () => props.modelValue,
  (val) => {
    if (!editorRef.value) return
    if (editorRef.value.innerHTML !== val) {
      editorRef.value.innerHTML = val ?? ''
    }
    checkEmpty()
  }
)

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
  checkEmpty()
  document.addEventListener('selectionchange', onSelectionChange)
  document.addEventListener('mousedown', onOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
  document.removeEventListener('mousedown', onOutsideClick)
})

function checkEmpty() {
  if (!editorRef.value) return
  const t = editorRef.value.innerText.trim()
  isEmpty.value = t === '' && !editorRef.value.querySelector('img,br')
}

function onInput() {
  checkEmpty()
  emit('update:modelValue', editorRef.value?.innerHTML ?? '')
}

// ──────────────────────────────────────────────────────────
// execCommand helpers (keep focus in editor across toolbar clicks)
// ──────────────────────────────────────────────────────────

// Saved range so toolbar clicks (which blur the editor) can restore selection
let savedRange: Range | null = null

function saveSelection() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  if (!savedRange) return
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(savedRange)
}

function exec(command: string, value?: string) {
  if (props.disabled) return
  restoreSelection()
  editorRef.value?.focus()
  document.execCommand(command, false, value ?? undefined)
  refreshState()
  onInput()
}

// ──────────────────────────────────────────────────────────
// Toolbar active-state tracking
// ──────────────────────────────────────────────────────────
const toolbarState = ref({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertOrderedList: false,
  insertUnorderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
})

function isActive(command: string): boolean {
  try { return document.queryCommandState(command) } catch { return false }
}

function refreshState() {
  for (const k of Object.keys(toolbarState.value) as Array<keyof typeof toolbarState.value>) {
    toolbarState.value[k] = isActive(k)
  }
}

function currentBlock(): string {
  try { return document.queryCommandValue('formatBlock').toLowerCase() } catch { return '' }
}

function onSelectionChange() {
  const el = editorRef.value
  if (!el) return
  const active = document.activeElement
  if (active === el || el.contains(active)) {
    saveSelection()
    refreshState()
    checkLinkAtCursor()
  }
}

// ──────────────────────────────────────────────────────────
// Headings / blocks
// ──────────────────────────────────────────────────────────
function setHeading(tag: string) {
  if (props.disabled) return
  restoreSelection()
  editorRef.value?.focus()
  document.execCommand('formatBlock', false, tag)
  refreshState()
  onInput()
}

// ──────────────────────────────────────────────────────────
// Clear formatting
// ──────────────────────────────────────────────────────────
function clearFormat() {
  exec('removeFormat')
  exec('formatBlock', 'div')
}

// ──────────────────────────────────────────────────────────
// Inline code
// ──────────────────────────────────────────────────────────
function insertCode() {
  if (props.disabled) return
  restoreSelection()
  editorRef.value?.focus()
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const range = sel.getRangeAt(0)
    const code = document.createElement('code')
    range.surroundContents(code)
    sel.removeAllRanges()
    onInput()
  }
}

// ──────────────────────────────────────────────────────────
// LINK POPOVER — custom floating UI
// ──────────────────────────────────────────────────────────
const linkPopover = ref({
  visible: false,
  x: 0,
  y: 0,
  url: '',
  isOnLink: false,       // true = cursor is ON an existing link
})
const linkInputRef = ref<HTMLInputElement | null>(null)
let pendingLinkRange: Range | null = null   // selection to wrap when creating a link

/** Called on selectionchange — if cursor is inside <a>, show the edit popover */
function checkLinkAtCursor() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return

  const node = sel.anchorNode
  const anchor = node instanceof Element
    ? node.closest('a')
    : node?.parentElement?.closest('a')

  if (anchor && editorRef.value?.contains(anchor)) {
    const rect = anchor.getBoundingClientRect()
    const root = rootRef.value!.getBoundingClientRect()
    linkPopover.value = {
      visible: true,
      x: rect.left - root.left,
      y: rect.bottom - root.top + 6,
      url: anchor.getAttribute('href') ?? '',
      isOnLink: true,
    }
  } else {
    // Hide popover if user clicks away from a link while not actively editing one
    if (!linkPopover.value.visible || linkPopover.value.isOnLink) {
      linkPopover.value.visible = false
    }
  }
}

/** Toolbar link button clicked — save selection & show popover below the selection */
function openLinkPopover() {
  if (props.disabled) return
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return

  restoreSelection()
  const range = sel.getRangeAt(0)

  // If collapsing on an existing link, treat as edit
  const node = range.startContainer
  const anchor = node instanceof Element
    ? node.closest('a')
    : node?.parentElement?.closest('a')

  if (anchor && editorRef.value?.contains(anchor)) {
    const rect = anchor.getBoundingClientRect()
    const root = rootRef.value!.getBoundingClientRect()
    linkPopover.value = {
      visible: true,
      x: rect.left - root.left,
      y: rect.bottom - root.top + 6,
      url: anchor.getAttribute('href') ?? '',
      isOnLink: true,
    }
    pendingLinkRange = null
  } else {
    pendingLinkRange = range.cloneRange()
    const rect = range.getBoundingClientRect()
    const root = rootRef.value!.getBoundingClientRect()
    linkPopover.value = {
      visible: true,
      x: Math.max(0, rect.left - root.left),
      y: rect.bottom - root.top + 6,
      url: 'https://',
      isOnLink: false,
    }
  }

  nextTick(() => {
    linkInputRef.value?.focus()
    linkInputRef.value?.select()
  })
}

function applyLink() {
  const url = linkPopover.value.url.trim()
  if (!url || url === 'https://') {
    closeLinkPopover()
    return
  }

  if (linkPopover.value.isOnLink) {
    // Update href of the existing anchor at cursor
    const sel = window.getSelection()
    const node = sel?.anchorNode
    const anchor = node instanceof Element
      ? node.closest('a')
      : node?.parentElement?.closest('a')
    if (anchor) anchor.setAttribute('href', url)
    onInput()
  } else if (pendingLinkRange) {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(pendingLinkRange)
    editorRef.value?.focus()
    document.execCommand('createLink', false, url)
    // Make link open in new tab
    const newAnchor = editorRef.value?.querySelector(`a[href="${url}"]`) as HTMLAnchorElement | null
    if (newAnchor) newAnchor.target = '_blank'
    onInput()
  }

  closeLinkPopover()
}

function unlinkCurrent() {
  restoreSelection()
  editorRef.value?.focus()
  document.execCommand('unlink', false, undefined)
  onInput()
  closeLinkPopover()
}

function openLinkInTab() {
  const url = linkPopover.value.url
  if (url) window.open(url, '_blank', 'noopener')
}

function closeLinkPopover() {
  linkPopover.value.visible = false
  pendingLinkRange = null
}

function onLinkKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') { e.preventDefault(); applyLink() }
  if (e.key === 'Escape') closeLinkPopover()
}

function onOutsideClick(e: MouseEvent) {
  const popEl = document.querySelector('.rte-link-popover') as HTMLElement | null
  if (popEl && !popEl.contains(e.target as Node)) {
    // Only close if not clicking inside the editor (allow cursor moves)
    if (!editorRef.value?.contains(e.target as Node)) {
      closeLinkPopover()
    }
  }
}

// Clamp popover so it stays within the wrapper
const popoverStyle = computed(() => {
  const MAX_W = 320
  return {
    left: `${linkPopover.value.x}px`,
    top: `${linkPopover.value.y}px`,
    maxWidth: `${MAX_W}px`,
  }
})

const editorStyle = computed(() => ({ minHeight: props.minHeight }))
</script>

<template>
  <div
    ref="rootRef"
    class="rte-root"
    :class="[error && 'rte-error', disabled && 'rte-disabled', isFocused && 'rte-focused']">

    <!-- Label -->
    <label v-if="label" class="rte-label">{{ label }}</label>

    <div class="rte-wrapper">
      <!-- ── Toolbar ── -->
      <div
        class="rte-toolbar"
        :class="{ 'rte-toolbar--disabled': disabled }"
        @mousedown.prevent>

        <!-- History -->
        <button class="rte-btn" title="Undo" @mousedown.prevent="exec('undo')" :disabled="disabled">
          <Icon icon="lucide:undo-2" class="w-3.5 h-3.5" />
        </button>
        <button class="rte-btn" title="Redo" @mousedown.prevent="exec('redo')" :disabled="disabled">
          <Icon icon="lucide:redo-2" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Block format -->
        <button
          class="rte-btn rte-btn--text"
          title="Heading 1"
          :class="{ 'rte-btn--active': currentBlock() === 'h1' }"
          @mousedown.prevent="setHeading('h1')"
          :disabled="disabled">H1</button>
        <button
          class="rte-btn rte-btn--text"
          title="Heading 2"
          :class="{ 'rte-btn--active': currentBlock() === 'h2' }"
          @mousedown.prevent="setHeading('h2')"
          :disabled="disabled">H2</button>
        <button
          class="rte-btn rte-btn--text"
          title="Paragraph"
          :class="{ 'rte-btn--active': currentBlock() === 'p' || currentBlock() === 'div' }"
          @mousedown.prevent="setHeading('p')"
          :disabled="disabled">P</button>

        <div class="rte-sep" />

        <!-- Inline formatting -->
        <button
          class="rte-btn" title="Bold"
          :class="{ 'rte-btn--active': toolbarState.bold }"
          @mousedown.prevent="exec('bold')" :disabled="disabled">
          <Icon icon="lucide:bold" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Italic"
          :class="{ 'rte-btn--active': toolbarState.italic }"
          @mousedown.prevent="exec('italic')" :disabled="disabled">
          <Icon icon="lucide:italic" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Underline"
          :class="{ 'rte-btn--active': toolbarState.underline }"
          @mousedown.prevent="exec('underline')" :disabled="disabled">
          <Icon icon="lucide:underline" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Strikethrough"
          :class="{ 'rte-btn--active': toolbarState.strikeThrough }"
          @mousedown.prevent="exec('strikeThrough')" :disabled="disabled">
          <Icon icon="lucide:strikethrough" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Inline Code"
          @mousedown.prevent="insertCode" :disabled="disabled">
          <Icon icon="lucide:code" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Lists -->
        <button
          class="rte-btn" title="Bullet List"
          :class="{ 'rte-btn--active': toolbarState.insertUnorderedList }"
          @mousedown.prevent="exec('insertUnorderedList')" :disabled="disabled">
          <Icon icon="lucide:list" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Numbered List"
          :class="{ 'rte-btn--active': toolbarState.insertOrderedList }"
          @mousedown.prevent="exec('insertOrderedList')" :disabled="disabled">
          <Icon icon="lucide:list-ordered" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Blockquote"
          :class="{ 'rte-btn--active': currentBlock() === 'blockquote' }"
          @mousedown.prevent="setHeading('blockquote')" :disabled="disabled">
          <Icon icon="lucide:quote" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Alignment -->
        <button
          class="rte-btn" title="Align Left"
          :class="{ 'rte-btn--active': toolbarState.justifyLeft }"
          @mousedown.prevent="exec('justifyLeft')" :disabled="disabled">
          <Icon icon="lucide:align-left" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Align Center"
          :class="{ 'rte-btn--active': toolbarState.justifyCenter }"
          @mousedown.prevent="exec('justifyCenter')" :disabled="disabled">
          <Icon icon="lucide:align-center" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Align Right"
          :class="{ 'rte-btn--active': toolbarState.justifyRight }"
          @mousedown.prevent="exec('justifyRight')" :disabled="disabled">
          <Icon icon="lucide:align-right" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Link & Clear -->
        <button
          class="rte-btn" title="Link"
          @mousedown.prevent="openLinkPopover" :disabled="disabled">
          <Icon icon="lucide:link" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn" title="Clear Formatting"
          @mousedown.prevent="clearFormat" :disabled="disabled">
          <Icon icon="lucide:remove-formatting" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- ── Editable body ── -->
      <div class="rte-body-wrap">
        <div
          ref="editorRef"
          class="rte-editor"
          :style="editorStyle"
          :contenteditable="!disabled"
          @input="onInput"
          @focus="isFocused = true; saveSelection(); refreshState()"
          @blur="isFocused = false"
          @keyup="saveSelection(); refreshState()"
          @mouseup="saveSelection(); refreshState()" />

        <!-- Placeholder -->
        <div
          v-if="isEmpty && !disabled"
          class="rte-placeholder"
          @click="editorRef?.focus()">
          {{ placeholder }}
        </div>

        <!-- ── Link Popover ── -->
        <Transition name="rte-pop">
          <div
            v-if="linkPopover.visible"
            class="rte-link-popover"
            :style="popoverStyle"
            @mousedown.stop>
            <!-- URL input row -->
            <div class="rte-link-input-row">
              <Icon icon="lucide:link-2" class="rte-link-icon-left w-3.5 h-3.5" />
              <input
                ref="linkInputRef"
                v-model="linkPopover.url"
                class="rte-link-input"
                placeholder="https://example.com"
                type="url"
                spellcheck="false"
                @keydown="onLinkKeydown" />
            </div>

            <!-- Action buttons -->
            <div class="rte-link-actions">
              <button class="rte-link-btn rte-link-btn--apply" @click="applyLink" title="Apply link">
                <Icon icon="lucide:check" class="w-3 h-3" />
                <span>Apply</span>
              </button>
              <button class="rte-link-btn rte-link-btn--open" @click="openLinkInTab" title="Open link">
                <Icon icon="lucide:external-link" class="w-3 h-3" />
              </button>
              <div class="rte-link-sep" />
              <button class="rte-link-btn rte-link-btn--unlink" @click="unlinkCurrent" title="Remove link">
                <Icon icon="lucide:unlink-2" class="w-3 h-3" />
                <span>Unlink</span>
              </button>
              <button class="rte-link-btn rte-link-btn--close" @click="closeLinkPopover" title="Close">
                <Icon icon="lucide:x" class="w-3 h-3" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="rte-error-msg">{{ error }}</p>
  </div>
</template>

<style scoped>
/* ── Root ── */
.rte-root {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-family: inherit;
  position: relative;
}

.rte-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-foreground);
  line-height: 1.4;
}

/* ── Wrapper ── */
.rte-wrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: visible;
  position: relative;
}

.rte-focused .rte-wrapper {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 15%, transparent);
}
.rte-error .rte-wrapper { border-color: var(--color-destructive); }
.rte-error.rte-focused .rte-wrapper {
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-destructive) 15%, transparent);
}
.rte-disabled .rte-wrapper {
  opacity: 0.55;
  pointer-events: none;
  background: var(--color-muted);
}

/* ── Toolbar ── */
.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-muted-light, var(--color-muted));
  border-radius: var(--radius) var(--radius) 0 0;
}
.rte-toolbar--disabled { opacity: 0.5; pointer-events: none; }

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
  font-size: 11px;
  font-weight: 600;
  transition: background 0.12s ease, color 0.12s ease;
  flex-shrink: 0;
}
.rte-btn--text { width: auto; padding: 0 6px; letter-spacing: 0.02em; }
.rte-btn:hover { background: var(--color-accent); color: var(--color-foreground); }
.rte-btn--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.rte-btn:disabled { opacity: 0.4; cursor: default; }

.rte-sep {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Editor body ── */
.rte-body-wrap { position: relative; overflow: visible; }

.rte-editor {
  outline: none;
  padding: 14px 16px;
  color: var(--color-foreground);
  font-size: 0.9rem;
  line-height: 1.7;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  border-radius: 0 0 var(--radius) var(--radius);
}

.rte-placeholder {
  position: absolute;
  top: 14px;
  left: 16px;
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
  pointer-events: none;
  user-select: none;
  line-height: 1.7;
}

/* ── Rich-content styles (override Tailwind preflight) ── */
.rte-editor :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5em 0 0.25em;
  line-height: 1.3;
  display: block;
}
.rte-editor :deep(h2) {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5em 0 0.25em;
  line-height: 1.35;
  display: block;
}
.rte-editor :deep(p) { margin: 0.25em 0; display: block; }

.rte-editor :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  margin: 0.6em 0;
  padding: 0.35em 1em;
  color: var(--color-muted-foreground);
  font-style: italic;
  background: color-mix(in oklab, var(--color-primary) 6%, transparent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  display: block;
}

/* ── Lists — explicit resets because Tailwind preflight zeroes everything ── */
.rte-editor :deep(ul) {
  display: block;
  list-style-type: disc !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-editor :deep(ol) {
  display: block;
  list-style-type: decimal !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-editor :deep(li) {
  display: list-item !important;
  margin: 0.15em 0 !important;
  padding-left: 0.2em;
}
/* Nested lists */
.rte-editor :deep(ul ul),
.rte-editor :deep(ol ul) { list-style-type: circle !important; }
.rte-editor :deep(ul ul ul),
.rte-editor :deep(ol ol ul) { list-style-type: square !important; }
.rte-editor :deep(ol ol) { list-style-type: lower-alpha !important; }

/* ── Links ── */
.rte-editor :deep(a) {
  color: var(--color-info);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.rte-editor :deep(a:hover) {
  color: var(--color-info-dark, var(--color-info));
  text-decoration-thickness: 2px;
}

/* ── Code ── */
.rte-editor :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  font-size: 0.85em;
  background: color-mix(in oklab, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  padding: 0.1em 0.35em;
  border-radius: 4px;
  border: 1px solid color-mix(in oklab, var(--color-primary) 20%, transparent);
}

.rte-editor :deep(strong) { font-weight: 700; }
.rte-editor :deep(em) { font-style: italic; }
.rte-editor :deep(u) { text-decoration-thickness: 1.5px; text-underline-offset: 2px; }

/* ── Error ── */
.rte-error-msg {
  font-size: 0.78rem;
  color: var(--color-destructive);
  margin: 0;
  line-height: 1.4;
}

/* ══════════════════════════════════════════════════════════
   LINK POPOVER
   ══════════════════════════════════════════════════════════ */
.rte-link-popover {
  position: absolute;
  z-index: 50;
  min-width: 240px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 10px 30px -4px rgba(0, 0, 0, 0.12);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Input row */
.rte-link-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 8px;
  transition: border-color 0.15s ease;
}
.rte-link-input-row:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary) 12%, transparent);
}
.rte-link-icon-left { color: var(--color-muted-foreground); flex-shrink: 0; }

.rte-link-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8rem;
  color: var(--color-foreground);
  padding: 7px 0;
  min-width: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.rte-link-input::placeholder { color: var(--color-muted-foreground); font-family: inherit; }

/* Action buttons row */
.rte-link-actions {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rte-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-muted-foreground);
  transition: background 0.12s ease, color 0.12s ease;
  white-space: nowrap;
}
.rte-link-btn:hover { background: var(--color-accent); color: var(--color-foreground); }

.rte-link-btn--apply {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  flex: 1;
  justify-content: center;
}
.rte-link-btn--apply:hover {
  background: color-mix(in oklab, var(--color-primary) 88%, transparent);
  color: var(--color-primary-foreground);
}

.rte-link-btn--open {
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  padding: 0;
  justify-content: center;
}

.rte-link-btn--unlink { color: var(--color-destructive); }
.rte-link-btn--unlink:hover {
  background: color-mix(in oklab, var(--color-destructive) 10%, transparent);
  color: var(--color-destructive);
}

.rte-link-btn--close {
  margin-left: auto;
  width: 24px;
  height: 24px;
  padding: 0;
  justify-content: center;
}

.rte-link-sep {
  width: 1px;
  height: 16px;
  background: var(--color-border);
  margin: 0 2px;
  flex-shrink: 0;
}

/* ── Popover transition ── */
.rte-pop-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.rte-pop-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.rte-pop-enter-from { opacity: 0; transform: translateY(-4px); }
.rte-pop-leave-to  { opacity: 0; transform: translateY(-4px); }
</style>
