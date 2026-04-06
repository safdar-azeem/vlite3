<script setup lang="ts">
import { ref, shallowRef, computed, watch, onMounted, onUnmounted, type ComponentPublicInstance } from 'vue'
import './rich-text-typography.css'
import RichTextToolbar from './RichTextToolbar.vue'
import RichTextLinkPopover from './RichTextLinkPopover.vue'

import { useRichTextImageUpload } from './composables/useRichTextImageUpload'
import { useRichTextLinks } from './composables/useRichTextLinks'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  minHeight?: string
  maxHeight?: string
  label?: string
  error?: string
  id?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start typing…',
  disabled: false,
  readonly: false,
  minHeight: '180px',
  maxHeight: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
  'image-removed': [url: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const rootRef = ref<HTMLDivElement | null>(null)
const linkPopoverCompRef = ref<ComponentPublicInstance | null>(null)

const isFocused = ref(false)
const isEmpty = ref(true)

const toolbarState = shallowRef({
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

const activeBlock = ref<string>('')

let savedRange: Range | null = null
let rafId: number | null = null
let isUnmounted = false

function saveSelection(): void {
  if (isUnmounted) return
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    try { savedRange = sel.getRangeAt(0).cloneRange() } catch { savedRange = null }
  }
}

function restoreSelection(): void {
  if (!savedRange || isUnmounted) return
  try {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(savedRange)
  } catch { savedRange = null }
}

watch(
  () => props.modelValue,
  (val) => {
    const el = editorRef.value
    if (!el) return
    const next = val ?? ''
    if (el.innerHTML !== next) {
      el.innerHTML = next
      updateEmpty()
      updateKnownImages()
    }
  },
)

let knownImages = new Set<string>()

function updateKnownImages(): void {
  const el = editorRef.value
  if (!el) return
  const currentImages = new Set(
    Array.from(el.querySelectorAll('img'))
      .map(img => img.getAttribute('src') || '')
      .filter(src => src && !src.startsWith('blob:'))
  )
  for (const oldSrc of knownImages) {
    if (!currentImages.has(oldSrc)) emit('image-removed', oldSrc)
  }
  knownImages = currentImages
}

// Composables setup
const editorCallbacks = {
  saveSelection,
  restoreSelection,
  onInput
}

// Ensure editorRef.value updates are correctly forwarded if needed natively
const editorRefAdapter = computed(() => editorRef.value)

const {
  imageInputRef,
  isUploadingImage,
  triggerImageUpload,
  onImageFileChange,
  onPaste,
  onDrop
} = useRichTextImageUpload(editorRef, editorCallbacks)

const linkHandlers = useRichTextLinks({
  editorRef: editorRef,
  rootRef: rootRef,
  linkPopoverElRef: linkPopoverCompRef,
  callbacks: editorCallbacks
})

onMounted(() => {
  const el = editorRef.value
  if (el && props.modelValue) el.innerHTML = props.modelValue
  updateEmpty()
  updateKnownImages()
  document.addEventListener('selectionchange', onSelectionChange)
  document.addEventListener('mousedown', onDocMouseDown, true)
  document.addEventListener('keydown', onDocKeyDown, true)
})

onUnmounted(() => {
  isUnmounted = true
  savedRange = null
  if (rafId !== null) cancelAnimationFrame(rafId)
  document.removeEventListener('selectionchange', onSelectionChange)
  document.removeEventListener('mousedown', onDocMouseDown, true)
  document.removeEventListener('keydown', onDocKeyDown, true)
})

function updateEmpty(): void {
  const el = editorRef.value
  if (!el) return
  const text = (el.textContent ?? '').trim()
  isEmpty.value = text === '' && !el.querySelector('img')
}

function onInput(): void {
  updateEmpty()
  emit('update:modelValue', editorRef.value?.innerHTML ?? '')
  updateKnownImages()
  scheduleRefresh()
}

function exec(command: string, value?: string): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  try { document.execCommand(command, false, value ?? undefined) } catch { }
  scheduleRefresh()
  onInput()
}

function setBlock(tag: string): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  try { document.execCommand('formatBlock', false, tag) } catch { }
  scheduleRefresh()
  onInput()
}

function clearFormat(): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  try {
    document.execCommand('removeFormat', false, undefined)
    document.execCommand('formatBlock', false, 'div')
  } catch { }
  scheduleRefresh()
  onInput()
}

function insertCode(): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
  const range = sel.getRangeAt(0)
  try {
    const code = document.createElement('code')
    range.surroundContents(code)
    sel.removeAllRanges()
  } catch {
    const frag = range.extractContents()
    const code = document.createElement('code')
    code.appendChild(frag)
    range.insertNode(code)
    sel.removeAllRanges()
  }
  scheduleRefresh()
  onInput()
}

function scheduleRefresh(): void {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    rafId = null
    doRefresh()
  })
}

function qcState(cmd: string): boolean {
  try { return document.queryCommandState(cmd) } catch { return false }
}

function doRefresh(): void {
  if (isUnmounted) return
  toolbarState.value = {
    bold: qcState('bold'),
    italic: qcState('italic'),
    underline: qcState('underline'),
    strikeThrough: qcState('strikeThrough'),
    insertOrderedList: qcState('insertOrderedList'),
    insertUnorderedList: qcState('insertUnorderedList'),
    justifyLeft: qcState('justifyLeft'),
    justifyCenter: qcState('justifyCenter'),
    justifyRight: qcState('justifyRight'),
  }
  try {
    activeBlock.value = document.queryCommandValue('formatBlock').toLowerCase()
  } catch { activeBlock.value = '' }
  linkHandlers.checkLinkAtCursor()
}

function onSelectionChange(): void {
  const el = editorRef.value
  if (!el) return
  const active = document.activeElement
  if (active !== el && !el.contains(active)) return
  saveSelection()
  scheduleRefresh()
}

function onEditorKeydown(e: KeyboardEvent): void {
  const ctrl = e.ctrlKey || e.metaKey
  if (!ctrl) return
  switch (e.key.toLowerCase()) {
    case 'b': e.preventDefault(); exec('bold'); break
    case 'i': e.preventDefault(); exec('italic'); break
    case 'u': e.preventDefault(); exec('underline'); break
    case 'k': e.preventDefault(); linkHandlers.openLinkPopover(); break
  }
}

function onDocMouseDown(e: MouseEvent): void {
  if (!linkHandlers.linkPopover.value.visible) return
  const popEl = linkPopoverCompRef.value?.$el
  if (popEl && popEl.contains(e.target as Node)) return
  if (editorRef.value?.contains(e.target as Node)) return
  linkHandlers.closeLinkPopover()
}

function onDocKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && linkHandlers.linkPopover.value.visible) {
    linkHandlers.closeLinkPopover()
  }
}

const editorStyle = computed(() => ({
  minHeight: props.minHeight,
  ...(props.maxHeight ? { maxHeight: props.maxHeight, overflowY: 'auto' as const } : {}),
}))

const popoverStyle = computed(() => ({
  transform: `translate(${linkHandlers.linkPopover.value.x}px, ${linkHandlers.linkPopover.value.y}px)`
}))

const editorId = computed(() => props.id ?? `rte-${Math.random().toString(36).slice(2, 7)}`)
</script>

<template>
  <div
    ref="rootRef"
    class="rte-root"
    :class="[
      error && 'rte-error',
      disabled && 'rte-disabled',
      readonly && 'rte-readonly',
      isFocused && 'rte-focused',
    ]"
    role="group"
    :aria-labelledby="label ? `${editorId}-label` : undefined"
    :aria-describedby="error ? `${editorId}-error` : undefined">

    <label v-if="label" :id="`${editorId}-label`" :for="editorId" class="rte-label">
      {{ label }}
    </label>

    <div class="rte-wrapper">
      <RichTextToolbar
        :toolbarState="toolbarState"
        :activeBlock="activeBlock"
        :disabled="disabled"
        :readonly="readonly"
        :isUploadingImage="isUploadingImage"
        :label="label"
        @command="exec"
        @setBlock="setBlock"
        @insertCode="insertCode"
        @triggerImageUpload="triggerImageUpload(!disabled && !readonly ? false : true)"
        @openLinkPopover="linkHandlers.openLinkPopover"
        @clearFormat="clearFormat" />

      <div class="rte-body-wrap">
        <div
          :id="editorId"
          ref="editorRef"
          class="rte-editor"
          :style="editorStyle"
          :contenteditable="(!disabled && !readonly) ? 'true' : 'false'"
          role="textbox"
          aria-multiline="true"
          :aria-label="label ?? placeholder"
          :aria-readonly="readonly || undefined"
          :aria-disabled="disabled || undefined"
          :aria-invalid="!!error || undefined"
          spellcheck="true"
          @input.passive="onInput"
          @focus="(e) => { isFocused = true; saveSelection(); scheduleRefresh(); emit('focus', e) }"
          @blur="(e) => { isFocused = false; emit('blur', e) }"
          @keydown="onEditorKeydown"
          @keyup.passive="saveSelection"
          @mouseup.passive="saveSelection"
          @paste="onPaste"
          @drop="onDrop" />

        <input
          ref="imageInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          class="rte-hidden-input"
          style="display: none"
          aria-hidden="true"
          tabindex="-1"
          @change="onImageFileChange" />

        <div
          v-if="isEmpty && !disabled"
          class="rte-placeholder"
          aria-hidden="true"
          @click="editorRef?.focus()">
          {{ placeholder }}
        </div>

        <RichTextLinkPopover
          ref="linkPopoverCompRef"
          :visible="linkHandlers.linkPopover.value.visible"
          :isEditing="linkHandlers.linkPopover.value.isEditing"
          :url="linkHandlers.linkPopover.value.url"
          :popoverStyle="popoverStyle"
          @update:url="linkHandlers.updateUrl"
          @apply="linkHandlers.applyLink"
          @unlink="linkHandlers.unlinkCurrent"
          @openTab="linkHandlers.openLinkInTab"
          @close="linkHandlers.closeLinkPopover"
        />
      </div>
    </div>
    <p v-if="error" :id="`${editorId}-error`" class="rte-error-msg" aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<style>
/* ONLY container and structural styles stay in the core file. 
   Typography is in rich-text-typography.css
   Toolbar and Link Popover styles are successfully migrated to their respective components. */

.rte-root {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.rte-label {
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--color-foreground);
  margin-bottom: 2px;
}

.rte-wrapper {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  position: relative;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
}

.rte-root.rte-focused .rte-wrapper {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary) 12%, transparent);
}

.rte-root.rte-disabled .rte-wrapper {
  background: var(--color-muted);
  opacity: 0.6;
}

.rte-root.rte-error .rte-wrapper {
  border-color: var(--color-destructive);
}
.rte-root.rte-error.rte-focused .rte-wrapper {
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-destructive) 15%, transparent);
}

.rte-body-wrap {
  position: relative;
  overflow: visible;
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
  border-radius: 0 0 var(--radius) var(--radius);
  word-break: break-word;
  overflow-wrap: break-word;
  will-change: transform;
  contain: layout style;
}

.rte-editor[contenteditable='true'] {
  caret-color: var(--color-primary);
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

.rte-error-msg {
  font-size: 0.78rem;
  color: var(--color-destructive);
  margin: 0;
  line-height: 1.4;
}
</style>
