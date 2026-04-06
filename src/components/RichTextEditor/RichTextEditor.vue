<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import Button from '../Button.vue'
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
const isFocused = ref(false)
const isEmpty = ref(true)

// ── Sync modelValue → DOM (only when value differs to avoid cursor jumps) ──
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
})

function checkEmpty() {
  if (!editorRef.value) return
  const text = editorRef.value.innerText.trim()
  isEmpty.value = text === ''
}

function onInput() {
  checkEmpty()
  emit('update:modelValue', editorRef.value?.innerHTML ?? '')
}

// ── execCommand helpers ──
function exec(command: string, value: string = '') {
  if (props.disabled) return
  editorRef.value?.focus()
  document.execCommand(command, false, value || undefined)
  onInput()
}

function isActive(command: string): boolean {
  try {
    return document.queryCommandState(command)
  } catch {
    return false
  }
}

// Live reactive toolbar state
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

function refreshState() {
  for (const key of Object.keys(toolbarState.value) as Array<keyof typeof toolbarState.value>) {
    toolbarState.value[key] = isActive(key)
  }
}

function onSelectionChange() {
  if (document.activeElement === editorRef.value || editorRef.value?.contains(document.activeElement)) {
    refreshState()
  }
}

onMounted(() => {
  document.addEventListener('selectionchange', onSelectionChange)
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
})

// ── Link insertion ──
function insertLink() {
  if (props.disabled) return
  const url = window.prompt('Enter URL:', 'https://')
  if (url) exec('createLink', url)
}

// ── Heading via formatBlock ──
function setHeading(tag: string) {
  if (props.disabled) return
  editorRef.value?.focus()
  document.execCommand('formatBlock', false, tag)
  onInput()
}

function currentBlock(): string {
  try {
    return document.queryCommandValue('formatBlock').toLowerCase()
  } catch {
    return ''
  }
}

// ── Clear formatting ──
function clearFormat() {
  exec('removeFormat')
  exec('formatBlock', 'div')
}

// ── Inline code (wrap in <code>) ──
function insertCode() {
  if (props.disabled) return
  editorRef.value?.focus()
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const range = sel.getRangeAt(0)
    const code = document.createElement('code')
    code.className = 'rte-inline-code'
    range.surroundContents(code)
    sel.removeAllRanges()
    onInput()
  }
}

const editorStyle = computed(() => ({
  minHeight: props.minHeight,
}))
</script>

<template>
  <div
    class="rte-root"
    :class="[
      error ? 'rte-error' : '',
      disabled ? 'rte-disabled' : '',
      isFocused ? 'rte-focused' : '',
    ]">
    <!-- Label -->
    <label v-if="label" class="rte-label">{{ label }}</label>

    <div class="rte-wrapper">
      <!-- Toolbar -->
      <div class="rte-toolbar" :class="{ 'rte-toolbar--disabled': disabled }" @mousedown.prevent>
        <!-- History -->
        <button class="rte-btn" title="Undo" @click="exec('undo')" :disabled="disabled">
          <Icon icon="lucide:undo-2" class="w-3.5 h-3.5" />
        </button>
        <button class="rte-btn" title="Redo" @click="exec('redo')" :disabled="disabled">
          <Icon icon="lucide:redo-2" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Headings -->
        <button
          class="rte-btn rte-btn--text"
          title="Heading 1"
          :class="{ 'rte-btn--active': currentBlock() === 'h1' }"
          @click="setHeading('h1')"
          :disabled="disabled">
          H1
        </button>
        <button
          class="rte-btn rte-btn--text"
          title="Heading 2"
          :class="{ 'rte-btn--active': currentBlock() === 'h2' }"
          @click="setHeading('h2')"
          :disabled="disabled">
          H2
        </button>
        <button
          class="rte-btn rte-btn--text"
          title="Paragraph"
          :class="{ 'rte-btn--active': currentBlock() === 'p' || currentBlock() === 'div' }"
          @click="setHeading('p')"
          :disabled="disabled">
          P
        </button>

        <div class="rte-sep" />

        <!-- Inline formatting -->
        <button
          class="rte-btn"
          title="Bold"
          :class="{ 'rte-btn--active': toolbarState.bold }"
          @click="exec('bold')"
          :disabled="disabled">
          <Icon icon="lucide:bold" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Italic"
          :class="{ 'rte-btn--active': toolbarState.italic }"
          @click="exec('italic')"
          :disabled="disabled">
          <Icon icon="lucide:italic" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Underline"
          :class="{ 'rte-btn--active': toolbarState.underline }"
          @click="exec('underline')"
          :disabled="disabled">
          <Icon icon="lucide:underline" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Strikethrough"
          :class="{ 'rte-btn--active': toolbarState.strikeThrough }"
          @click="exec('strikeThrough')"
          :disabled="disabled">
          <Icon icon="lucide:strikethrough" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Inline Code"
          @click="insertCode"
          :disabled="disabled">
          <Icon icon="lucide:code" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Lists -->
        <button
          class="rte-btn"
          title="Unordered List"
          :class="{ 'rte-btn--active': toolbarState.insertUnorderedList }"
          @click="exec('insertUnorderedList')"
          :disabled="disabled">
          <Icon icon="lucide:list" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Ordered List"
          :class="{ 'rte-btn--active': toolbarState.insertOrderedList }"
          @click="exec('insertOrderedList')"
          :disabled="disabled">
          <Icon icon="lucide:list-ordered" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Blockquote"
          :class="{ 'rte-btn--active': currentBlock() === 'blockquote' }"
          @click="setHeading('blockquote')"
          :disabled="disabled">
          <Icon icon="lucide:quote" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Alignment -->
        <button
          class="rte-btn"
          title="Align Left"
          :class="{ 'rte-btn--active': toolbarState.justifyLeft }"
          @click="exec('justifyLeft')"
          :disabled="disabled">
          <Icon icon="lucide:align-left" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Align Center"
          :class="{ 'rte-btn--active': toolbarState.justifyCenter }"
          @click="exec('justifyCenter')"
          :disabled="disabled">
          <Icon icon="lucide:align-center" class="w-3.5 h-3.5" />
        </button>
        <button
          class="rte-btn"
          title="Align Right"
          :class="{ 'rte-btn--active': toolbarState.justifyRight }"
          @click="exec('justifyRight')"
          :disabled="disabled">
          <Icon icon="lucide:align-right" class="w-3.5 h-3.5" />
        </button>

        <div class="rte-sep" />

        <!-- Link & Clear -->
        <button class="rte-btn" title="Insert Link" @click="insertLink" :disabled="disabled">
          <Icon icon="lucide:link" class="w-3.5 h-3.5" />
        </button>
        <button class="rte-btn" title="Clear Formatting" @click="clearFormat" :disabled="disabled">
          <Icon icon="lucide:remove-formatting" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Editable area -->
      <div class="rte-body-wrap">
        <div
          ref="editorRef"
          class="rte-editor"
          :style="editorStyle"
          :contenteditable="!disabled"
          :data-placeholder="placeholder"
          @input="onInput"
          @focus="isFocused = true; refreshState()"
          @blur="isFocused = false"
          @keyup="refreshState"
          @mouseup="refreshState" />
        <!-- Placeholder overlay -->
        <div
          v-if="isEmpty && !disabled"
          class="rte-placeholder"
          @click="editorRef?.focus()">
          {{ placeholder }}
        </div>
      </div>
    </div>

    <!-- Error message -->
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
}

.rte-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-foreground);
  line-height: 1.4;
}

/* ── Wrapper (border / focus ring) ── */
.rte-wrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}

.rte-focused .rte-wrapper {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 15%, transparent);
}

.rte-error .rte-wrapper {
  border-color: var(--color-destructive);
}

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
}

.rte-toolbar--disabled {
  opacity: 0.5;
  pointer-events: none;
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
  font-size: 11px;
  font-weight: 600;
  transition: background 0.12s ease, color 0.12s ease;
  flex-shrink: 0;
}

.rte-btn--text {
  width: auto;
  padding: 0 6px;
  letter-spacing: 0.02em;
}

.rte-btn:hover {
  background: var(--color-accent);
  color: var(--color-foreground);
}

.rte-btn--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.rte-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.rte-sep {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Editor body ── */
.rte-body-wrap {
  position: relative;
}

.rte-editor {
  outline: none;
  padding: 14px 16px;
  color: var(--color-foreground);
  font-size: 0.9rem;
  line-height: 1.7;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.rte-editor:empty::before {
  /* Fallback placeholder via CSS (hidden when JS placeholder is used) */
  content: attr(data-placeholder);
  color: var(--color-muted-foreground);
  pointer-events: none;
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

/* ── Rich content styles ── */
.rte-editor :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.4em 0 0.2em;
  line-height: 1.3;
}

.rte-editor :deep(h2) {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.4em 0 0.2em;
  line-height: 1.35;
}

.rte-editor :deep(p) {
  margin: 0.25em 0;
}

.rte-editor :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  margin: 0.5em 0;
  padding: 0.3em 1em;
  color: var(--color-muted-foreground);
  font-style: italic;
  background: color-mix(in oklab, var(--color-primary) 6%, transparent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.rte-editor :deep(ul),
.rte-editor :deep(ol) {
  padding-left: 1.5em;
  margin: 0.25em 0;
}

.rte-editor :deep(li) {
  margin: 0.1em 0;
}

.rte-editor :deep(a) {
  color: var(--color-info);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.rte-editor :deep(code),
.rte-editor :deep(.rte-inline-code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  font-size: 0.85em;
  background: color-mix(in oklab, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  padding: 0.1em 0.35em;
  border-radius: 4px;
  border: 1px solid color-mix(in oklab, var(--color-primary) 20%, transparent);
}

.rte-editor :deep(strong) {
  font-weight: 700;
}

.rte-editor :deep(em) {
  font-style: italic;
}

.rte-editor :deep(u) {
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}

/* ── Error ── */
.rte-error-msg {
  font-size: 0.78rem;
  color: var(--color-destructive);
  margin: 0;
  line-height: 1.4;
}
</style>
