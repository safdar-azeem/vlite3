<script setup lang="ts">
import {
  ref,
  shallowRef,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
import Icon from '../Icon.vue'

// ─────────────────────────────────────────────────────────────────────────────
// Props & Emits
// ─────────────────────────────────────────────────────────────────────────────
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
}>()

// ─────────────────────────────────────────────────────────────────────────────
// Template refs
// ─────────────────────────────────────────────────────────────────────────────
const editorRef = ref<HTMLDivElement | null>(null)
const rootRef   = ref<HTMLDivElement | null>(null)
const linkPopoverElRef = ref<HTMLDivElement | null>(null)
const linkInputRef     = ref<HTMLInputElement | null>(null)

// ─────────────────────────────────────────────────────────────────────────────
// UI state — use shallowRef for flat objects (perf directive §3)
// ─────────────────────────────────────────────────────────────────────────────
const isFocused = ref(false)
const isEmpty   = ref(true)

// shallowRef: 9 booleans — Vue won't deep-proxy mutate each one
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

// Computed block tag — avoids calling queryCommandValue() 4× per render cycle
const activeBlock = ref<string>('')

// shallowRef for link popover state — never deeply mutated
const linkPopover = shallowRef({
  visible: false,
  x: 0,
  y: 0,
  url: '',
  isOnLink: false,
})

// ─────────────────────────────────────────────────────────────────────────────
// Selection persistence (plain let — intentionally not reactive)
// ─────────────────────────────────────────────────────────────────────────────
let savedRange: Range | null = null
let pendingLinkRange: Range | null = null
let rafId: number | null = null   // for debounced state refresh
let isUnmounted = false

function saveSelection(): void {
  if (isUnmounted) return
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    try {
      savedRange = sel.getRangeAt(0).cloneRange()
    } catch {
      savedRange = null
    }
  }
}

function restoreSelection(): void {
  if (!savedRange || isUnmounted) return
  try {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(savedRange)
  } catch {
    savedRange = null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// v-model ↔ DOM sync (read-only model → DOM push)
// ─────────────────────────────────────────────────────────────────────────────
watch(
  () => props.modelValue,
  (val) => {
    const el = editorRef.value
    if (!el) return
    // Only push when the source-of-truth actually differs (prevents cursor jumps)
    const next = val ?? ''
    if (el.innerHTML !== next) {
      el.innerHTML = next
      updateEmpty()
    }
  },
)

onMounted(() => {
  const el = editorRef.value
  if (el && props.modelValue) {
    el.innerHTML = props.modelValue
  }
  updateEmpty()

  // Use capture:false so normal bubbling events work
  document.addEventListener('selectionchange', onSelectionChange)
  document.addEventListener('mousedown', onDocMouseDown, true)
  document.addEventListener('keydown', onDocKeyDown, true)
})

onUnmounted(() => {
  isUnmounted = true
  savedRange = null
  pendingLinkRange = null
  if (rafId !== null) cancelAnimationFrame(rafId)
  document.removeEventListener('selectionchange', onSelectionChange)
  document.removeEventListener('mousedown', onDocMouseDown, true)
  document.removeEventListener('keydown', onDocKeyDown, true)
})

// ─────────────────────────────────────────────────────────────────────────────
// Empty check — textContent avoids forced layout vs innerText
// ─────────────────────────────────────────────────────────────────────────────
function updateEmpty(): void {
  const el = editorRef.value
  if (!el) return
  const text = (el.textContent ?? '').trim()
  isEmpty.value = text === '' && !el.querySelector('img')
}

function onInput(): void {
  updateEmpty()
  emit('update:modelValue', editorRef.value?.innerHTML ?? '')
}

// ─────────────────────────────────────────────────────────────────────────────
// execCommand wrapper
// ─────────────────────────────────────────────────────────────────────────────
function exec(command: string, value?: string): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  try {
    document.execCommand(command, false, value ?? undefined)
  } catch {
    // execCommand can throw on Firefox for certain commands
  }
  scheduleRefresh()
  onInput()
}

function setBlock(tag: string): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  try {
    document.execCommand('formatBlock', false, tag)
  } catch { /* */ }
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
  } catch { /* */ }
  scheduleRefresh()
  onInput()
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline code — safe surroundContents with fallback for cross-element ranges
// ─────────────────────────────────────────────────────────────────────────────
function insertCode(): void {
  if (props.disabled || props.readonly) return
  restoreSelection()
  editorRef.value?.focus()
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
  const range = sel.getRangeAt(0)
  try {
    // surroundContents throws HierarchyError if range straddles element boundaries
    const code = document.createElement('code')
    range.surroundContents(code)
    sel.removeAllRanges()
  } catch {
    // Fallback: extract the fragment, wrap it, re-insert
    const frag = range.extractContents()
    const code = document.createElement('code')
    code.appendChild(frag)
    range.insertNode(code)
    sel.removeAllRanges()
  }
  scheduleRefresh()
  onInput()
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar state refresh — rAF-debounced to batch rapid keyup/mouseup events
// ─────────────────────────────────────────────────────────────────────────────
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
  // Batch-assign shallowRef value once to trigger a single reactivity update
  toolbarState.value = {
    bold:                qcState('bold'),
    italic:              qcState('italic'),
    underline:           qcState('underline'),
    strikeThrough:       qcState('strikeThrough'),
    insertOrderedList:   qcState('insertOrderedList'),
    insertUnorderedList: qcState('insertUnorderedList'),
    justifyLeft:         qcState('justifyLeft'),
    justifyCenter:       qcState('justifyCenter'),
    justifyRight:        qcState('justifyRight'),
  }
  try {
    activeBlock.value = document.queryCommandValue('formatBlock').toLowerCase()
  } catch {
    activeBlock.value = ''
  }
  checkLinkAtCursor()
}

// ─────────────────────────────────────────────────────────────────────────────
// selectionchange — only act when focus is inside THIS editor
// ─────────────────────────────────────────────────────────────────────────────
function onSelectionChange(): void {
  const el = editorRef.value
  if (!el) return
  const active = document.activeElement
  // Guard: only respond when the editor (or nothing, e.g. inside contenteditable) is active
  if (active !== el && !el.contains(active)) return
  saveSelection()
  scheduleRefresh()
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard shortcuts inside the editor
// ─────────────────────────────────────────────────────────────────────────────
function onEditorKeydown(e: KeyboardEvent): void {
  const ctrl = e.ctrlKey || e.metaKey
  if (!ctrl) return
  switch (e.key.toLowerCase()) {
    case 'b': e.preventDefault(); exec('bold'); break
    case 'i': e.preventDefault(); exec('italic'); break
    case 'u': e.preventDefault(); exec('underline'); break
    case 'k': e.preventDefault(); openLinkPopover(); break
    case 'z': /* let browser handle undo/redo natively */; break
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LINK POPOVER
// ─────────────────────────────────────────────────────────────────────────────
/** Returns the <a> ancestor of the current selection, scoped inside editor */
function getAnchorAtSelection(sel?: Selection | null): HTMLAnchorElement | null {
  const s = sel ?? window.getSelection()
  if (!s || s.rangeCount === 0) return null
  const node = s.anchorNode
  const el = node instanceof Element ? node : node?.parentElement
  const a = el?.closest('a')
  return a && editorRef.value?.contains(a) ? (a as HTMLAnchorElement) : null
}

function resolvePopoverPos(rect: DOMRect): { x: number; y: number } {
  const root = rootRef.value
  if (!root) return { x: 0, y: 0 }
  const rootRect = root.getBoundingClientRect()
  const POPOVER_W = 300
  const POPOVER_H = 90 // approximate
  const rawX = rect.left - rootRect.left
  const rawY = rect.bottom - rootRect.top + 6

  // Clamp X so popover never overflows the right edge of the wrapper
  const maxX = rootRect.width - POPOVER_W - 4
  const x = Math.max(0, Math.min(rawX, maxX))

  // If not enough room below, flip above the selection
  const spaceBelow = window.innerHeight - rect.bottom
  const y = spaceBelow < POPOVER_H + 16
    ? rect.top - rootRect.top - POPOVER_H - 6
    : rawY

  return { x, y }
}

function checkLinkAtCursor(): void {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) {
    if (linkPopover.value.isOnLink) closeLinkPopover()
    return
  }
  const a = getAnchorAtSelection(sel)
  if (a) {
    const { x, y } = resolvePopoverPos(a.getBoundingClientRect())
    linkPopover.value = { visible: true, x, y, url: a.getAttribute('href') ?? '', isOnLink: true }
  } else {
    // Hide cursor-triggered popover only (not the toolbar-triggered one)
    if (linkPopover.value.visible && linkPopover.value.isOnLink) {
      linkPopover.value = { ...linkPopover.value, visible: false }
    }
  }
}

function openLinkPopover(): void {
  if (props.disabled || props.readonly) return
  // Use savedRange (preserved before toolbar blur) or current selection
  const sel = window.getSelection()

  // First try: are we on a link?
  const existingAnchor = getAnchorAtSelection(sel)
  if (existingAnchor) {
    const { x, y } = resolvePopoverPos(existingAnchor.getBoundingClientRect())
    linkPopover.value = {
      visible: true, x, y,
      url: existingAnchor.getAttribute('href') ?? '',
      isOnLink: true,
    }
    pendingLinkRange = null
  } else {
    // Use savedRange for position (selection may have been lost to toolbar click)
    const range = savedRange ?? sel?.getRangeAt(0)
    if (!range) return
    pendingLinkRange = range.cloneRange()
    const rRect = range.getBoundingClientRect()
    const { x, y } = resolvePopoverPos(rRect)
    linkPopover.value = { visible: true, x, y, url: 'https://', isOnLink: false }
  }

  nextTick(() => {
    linkInputRef.value?.focus()
    linkInputRef.value?.select()
  })
}

function applyLink(): void {
  const url = linkPopover.value.url.trim()
  // Allow bare domains (auto-prefix https) or existing protocols
  const finalUrl = url && !url.includes('://') ? `https://${url}` : url
  if (!finalUrl || finalUrl === 'https://') {
    closeLinkPopover()
    return
  }

  if (linkPopover.value.isOnLink) {
    // Update href on the anchor element directly — no DOM query with interpolated URL
    const a = getAnchorAtSelection()
    if (a) {
      a.href = finalUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    } else {
      // Fallback: re-run createLink on saved range
      if (savedRange) {
        restoreSelection()
        editorRef.value?.focus()
        document.execCommand('createLink', false, finalUrl)
      }
    }
    onInput()
  } else if (pendingLinkRange) {
    // Re-select the pending range and wrap it
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(pendingLinkRange)
    editorRef.value?.focus()
    document.execCommand('createLink', false, finalUrl)
    // Set target=_blank on all newly created anchors with this href
    // Use TreeWalker to safely find matching anchors without querySelector injection
    const walker = document.createTreeWalker(
      editorRef.value!,
      NodeFilter.SHOW_ELEMENT,
      { acceptNode: (n) => (n as Element).tagName === 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP },
    )
    let node: Node | null
    while ((node = walker.nextNode())) {
      const a = node as HTMLAnchorElement
      if (a.href === finalUrl || a.getAttribute('href') === finalUrl) {
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
      }
    }
    onInput()
  }

  closeLinkPopover()
}

function unlinkCurrent(): void {
  // Select the full anchor text before unlinking
  const a = getAnchorAtSelection()
  if (a) {
    const range = document.createRange()
    range.selectNodeContents(a)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  } else {
    restoreSelection()
  }
  editorRef.value?.focus()
  document.execCommand('unlink', false, undefined)
  onInput()
  closeLinkPopover()
}

function openLinkInTab(): void {
  const url = linkPopover.value.url.trim()
  if (!url) return
  const href = url.includes('://') ? url : `https://${url}`
  window.open(href, '_blank', 'noopener,noreferrer')
}

function closeLinkPopover(): void {
  if (!linkPopover.value.visible) return
  linkPopover.value = { ...linkPopover.value, visible: false }
  pendingLinkRange = null
}

function onLinkInputKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter')  { e.preventDefault(); applyLink() }
  if (e.key === 'Escape') { e.preventDefault(); closeLinkPopover() }
}

// Close popover on outside mousedown (capture phase, fires before focus change)
function onDocMouseDown(e: MouseEvent): void {
  if (!linkPopover.value.visible) return
  const popEl = linkPopoverElRef.value
  if (popEl && popEl.contains(e.target as Node)) return
  // Allow clicking inside the editor (repositions cursor, keeps editing)
  if (editorRef.value?.contains(e.target as Node)) return
  closeLinkPopover()
}

// Close popover on Escape from anywhere in the document
function onDocKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && linkPopover.value.visible) {
    closeLinkPopover()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Computed styles
// ─────────────────────────────────────────────────────────────────────────────
const editorStyle = computed(() => ({
  minHeight: props.minHeight,
  ...(props.maxHeight ? { maxHeight: props.maxHeight, overflowY: 'auto' as const } : {}),
}))

const popoverStyle = computed(() => ({
  transform: `translate(${linkPopover.value.x}px, ${linkPopover.value.y}px)`,
}))

// ─────────────────────────────────────────────────────────────────────────────
// Computed aria
// ─────────────────────────────────────────────────────────────────────────────
const editorId = computed(() => props.id ?? `rte-${Math.random().toString(36).slice(2, 7)}`)
</script>

<template>
  <div
    ref="rootRef"
    class="rte-root"
    :class="[
      error    && 'rte-error',
      disabled && 'rte-disabled',
      readonly && 'rte-readonly',
      isFocused && 'rte-focused',
    ]"
    role="group"
    :aria-labelledby="label ? `${editorId}-label` : undefined"
    :aria-describedby="error ? `${editorId}-error` : undefined">

    <!-- Label -->
    <label
      v-if="label"
      :id="`${editorId}-label`"
      :for="editorId"
      class="rte-label">
      {{ label }}
    </label>

    <div class="rte-wrapper">

      <!-- ── Toolbar ── -->
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
          @mousedown.prevent="exec('undo')">
          <Icon icon="lucide:undo-2" class="rte-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rte-btn"
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          :disabled="disabled || readonly"
          @mousedown.prevent="exec('redo')">
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
          @mousedown.prevent="setBlock('h1')">H1</button>
        <button
          type="button"
          class="rte-btn rte-btn--text"
          title="Heading 2"
          aria-label="Heading 2"
          :aria-pressed="activeBlock === 'h2'"
          :class="{ 'rte-btn--active': activeBlock === 'h2' }"
          :disabled="disabled || readonly"
          @mousedown.prevent="setBlock('h2')">H2</button>
        <button
          type="button"
          class="rte-btn rte-btn--text"
          title="Paragraph"
          aria-label="Paragraph"
          :aria-pressed="activeBlock === 'p' || activeBlock === 'div'"
          :class="{ 'rte-btn--active': activeBlock === 'p' || activeBlock === 'div' }"
          :disabled="disabled || readonly"
          @mousedown.prevent="setBlock('p')">P</button>

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
          @mousedown.prevent="exec('bold')">
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
          @mousedown.prevent="exec('italic')">
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
          @mousedown.prevent="exec('underline')">
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
          @mousedown.prevent="exec('strikeThrough')">
          <Icon icon="lucide:strikethrough" class="rte-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rte-btn"
          title="Inline Code"
          aria-label="Inline Code"
          :disabled="disabled || readonly"
          @mousedown.prevent="insertCode">
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
          @mousedown.prevent="exec('insertUnorderedList')">
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
          @mousedown.prevent="exec('insertOrderedList')">
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
          @mousedown.prevent="setBlock('blockquote')">
          <Icon icon="lucide:quote" class="rte-icon" aria-hidden="true" />
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
          @mousedown.prevent="exec('justifyLeft')">
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
          @mousedown.prevent="exec('justifyCenter')">
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
          @mousedown.prevent="exec('justifyRight')">
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
          @mousedown.prevent="openLinkPopover">
          <Icon icon="lucide:link" class="rte-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rte-btn"
          title="Clear Formatting"
          aria-label="Clear formatting"
          :disabled="disabled || readonly"
          @mousedown.prevent="clearFormat">
          <Icon icon="lucide:remove-formatting" class="rte-icon" aria-hidden="true" />
        </button>
      </div>

      <!-- ── Editable body ── -->
      <!-- contain: layout style isolates repaints (perf directive §1) -->
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
          @mouseup.passive="saveSelection" />

        <!-- Placeholder -->
        <div
          v-if="isEmpty && !disabled"
          class="rte-placeholder"
          aria-hidden="true"
          @click="editorRef?.focus()">
          {{ placeholder }}
        </div>

        <!-- ── Link Popover ── -->
        <Transition name="rte-pop">
          <div
            v-if="linkPopover.visible"
            ref="linkPopoverElRef"
            class="rte-link-popover"
            :style="popoverStyle"
            role="dialog"
            aria-label="Link editor"
            aria-modal="false"
            @mousedown.stop>

            <!-- URL input -->
            <div class="rte-link-input-row">
              <Icon icon="lucide:link-2" class="rte-link-icon-prefix" aria-hidden="true" />
              <input
                ref="linkInputRef"
                v-model="linkPopover.url"
                class="rte-link-input"
                placeholder="https://example.com"
                type="text"
                inputmode="url"
                autocomplete="url"
                autocorrect="off"
                autocapitalize="none"
                spellcheck="false"
                aria-label="URL"
                @keydown="onLinkInputKeydown" />
            </div>

            <!-- Actions -->
            <div class="rte-link-actions">
              <button
                type="button"
                class="rte-link-btn rte-link-btn--apply"
                aria-label="Apply link"
                @click="applyLink">
                <Icon icon="lucide:check" class="w-3 h-3" aria-hidden="true" />
                <span>Apply</span>
              </button>
              <button
                type="button"
                class="rte-link-btn rte-link-btn--open"
                title="Open in new tab"
                aria-label="Open link in new tab"
                @click="openLinkInTab">
                <Icon icon="lucide:external-link" class="w-3 h-3" aria-hidden="true" />
              </button>
              <div v-once class="rte-link-sep" aria-hidden="true" />
              <button
                type="button"
                class="rte-link-btn rte-link-btn--unlink"
                title="Remove link"
                aria-label="Remove link"
                @click="unlinkCurrent">
                <Icon icon="lucide:unlink-2" class="w-3 h-3" aria-hidden="true" />
                <span>Unlink</span>
              </button>
              <button
                type="button"
                class="rte-link-btn rte-link-btn--close"
                title="Close"
                aria-label="Close link editor"
                @click="closeLinkPopover">
                <Icon icon="lucide:x" class="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Error -->
    <p
      v-if="error"
      :id="`${editorId}-error`"
      class="rte-error-msg"
      role="alert"
      aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   Root
───────────────────────────────────────────────────────────────────────────── */
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
  display: block;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Wrapper
───────────────────────────────────────────────────────────────────────────── */
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
.rte-error .rte-wrapper {
  border-color: var(--color-destructive);
}
.rte-error.rte-focused .rte-wrapper {
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-destructive) 15%, transparent);
}
.rte-disabled .rte-wrapper,
.rte-readonly .rte-wrapper {
  opacity: 0.6;
  pointer-events: none;
}
.rte-disabled .rte-wrapper {
  background: var(--color-muted);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Toolbar
───────────────────────────────────────────────────────────────────────────── */
.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 5px 8px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-muted-light, var(--color-muted));
  border-radius: var(--radius) var(--radius) 0 0;
  /* Isolate toolbar repaints (perf directive §1) */
  contain: layout style;
}

.rte-toolbar[aria-disabled='true'] {
  opacity: 0.5;
  pointer-events: none;
}

.rte-icon {
  width: 0.875rem;   /* 14px */
  height: 0.875rem;
  flex-shrink: 0;
}

.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px; /* prevents shrink on small screens */
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-muted-foreground);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.12s ease, color 0.12s ease;
  flex-shrink: 0;
  touch-action: manipulation; /* removes 300ms tap delay on mobile */
  -webkit-tap-highlight-color: transparent;
}
.rte-btn--text {
  width: auto;
  padding: 0 6px;
  letter-spacing: 0.02em;
}
.rte-btn:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-foreground);
}
.rte-btn--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.rte-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}
/* Keyboard focus ring (not just mouse hover) */
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

/* ─────────────────────────────────────────────────────────────────────────────
   Editor body
   • contain: layout style  — bounds repaints inside the editor (perf §1)
   • will-change: transform — GPU layer (perf §1)
───────────────────────────────────────────────────────────────────────────── */
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
  /* GPU compositor layer for heavy typing updates */
  will-change: transform;
  /* Bounds style/layout recalc to this subtree (perf §1) */
  contain: layout style;
}

/* Smooth cursor caret */
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

/* ─────────────────────────────────────────────────────────────────────────────
   Rich-content typography
   (all !important because Tailwind preflight resets these globally)
───────────────────────────────────────────────────────────────────────────── */
.rte-editor :deep(h1) {
  display: block;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  margin: 0.5em 0 0.2em !important;
  line-height: 1.3;
}
.rte-editor :deep(h2) {
  display: block;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  margin: 0.45em 0 0.2em !important;
  line-height: 1.35;
}
.rte-editor :deep(p) {
  display: block;
  margin: 0.2em 0 !important;
}
.rte-editor :deep(div) {
  /* browser wraps bare text in <div> instead of <p> in contenteditable */
  margin: 0.1em 0;
}

.rte-editor :deep(blockquote) {
  display: block;
  border-left: 3px solid var(--color-primary);
  margin: 0.6em 0 !important;
  padding: 0.35em 1em !important;
  color: var(--color-muted-foreground);
  font-style: italic;
  background: color-mix(in oklab, var(--color-primary) 6%, transparent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* ── Lists ── */
.rte-editor :deep(ul) {
  display: block !important;
  list-style-type: disc !important;
  list-style-position: outside !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-editor :deep(ol) {
  display: block !important;
  list-style-type: decimal !important;
  list-style-position: outside !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-editor :deep(li) {
  display: list-item !important;
  margin: 0.15em 0 !important;
  padding-left: 0.15em;
}
/* Nested list styles */
.rte-editor :deep(ul ul),
.rte-editor :deep(ol ul)       { list-style-type: circle  !important; }
.rte-editor :deep(ul ul ul),
.rte-editor :deep(ol ol ul)    { list-style-type: square  !important; }
.rte-editor :deep(ol ol)       { list-style-type: lower-alpha !important; }
.rte-editor :deep(ol ol ol)    { list-style-type: lower-roman !important; }

/* ── Links ── */
.rte-editor :deep(a) {
  color: var(--color-info);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.12s ease;
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

/* ── Inline formatting ── */
.rte-editor :deep(strong) { font-weight: 700 !important; }
.rte-editor :deep(b)      { font-weight: 700 !important; }
.rte-editor :deep(em)     { font-style: italic !important; }
.rte-editor :deep(i)      { font-style: italic !important; }
.rte-editor :deep(u) {
  text-decoration: underline !important;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}
.rte-editor :deep(s),
.rte-editor :deep(strike) { text-decoration: line-through !important; }

/* ── Selection highlight ── */
.rte-editor ::selection {
  background: color-mix(in oklab, var(--color-primary) 22%, transparent);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Error message
───────────────────────────────────────────────────────────────────────────── */
.rte-error-msg {
  font-size: 0.78rem;
  color: var(--color-destructive);
  margin: 0;
  line-height: 1.4;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Link Popover
   Note: NO backdrop-filter (banned by perf directive §7)
───────────────────────────────────────────────────────────────────────────── */
.rte-link-popover {
  /* Use transform for positioning — avoids layout thrashing vs top/left */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 60;
  width: 300px;
  max-width: min(300px, calc(100vw - 24px));
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* GPU layer for smooth transition animation (perf §1) */
  will-change: transform, opacity;
}

/* URL input row */
.rte-link-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 8px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.rte-link-input-row:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary) 12%, transparent);
}
.rte-link-icon-prefix {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-muted-foreground);
  flex-shrink: 0;
}

.rte-link-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8rem;
  color: var(--color-foreground);
  padding: 7px 0;
  min-width: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
.rte-link-input::placeholder {
  color: var(--color-muted-foreground);
  font-family: inherit;
}

/* Action buttons */
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.rte-link-btn:hover { background: var(--color-accent); color: var(--color-foreground); }
.rte-link-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.rte-link-btn--apply {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  flex: 1;
  justify-content: center;
  min-height: 28px;
}
.rte-link-btn--apply:hover {
  background: color-mix(in oklab, var(--color-primary) 88%, var(--color-primary-foreground));
  color: var(--color-primary-foreground);
}

.rte-link-btn--open {
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  justify-content: center;
}

.rte-link-btn--unlink {
  color: var(--color-destructive);
}
.rte-link-btn--unlink:hover {
  background: color-mix(in oklab, var(--color-destructive) 10%, transparent);
  color: var(--color-destructive);
}

.rte-link-btn--close {
  margin-left: auto;
  width: 26px;
  height: 26px;
  min-width: 26px;
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

/* ─────────────────────────────────────────────────────────────────────────────
   Popover transition
   (transforms only — compositor animation, no layout)
───────────────────────────────────────────────────────────────────────────── */
.rte-pop-enter-active {
  transition: opacity 0.13s ease, transform 0.13s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}
.rte-pop-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
  transform-origin: top left;
}
.rte-pop-enter-from {
  opacity: 0;
  /* Popover is already positioned via translate() in popoverStyle.
     We add a small scale effect on TOP of the translation using a wrapper var trick:
     Since the element uses transform: translate(x,y) set inline, we can't simply
     override transform here. Instead we use scaleY to give depth. */
  transform: v-bind("popoverStyle.transform") scaleY(0.94);
}
.rte-pop-leave-to {
  opacity: 0;
  transform: v-bind("popoverStyle.transform") scaleY(0.94);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Responsive — mobile touch targets
───────────────────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .rte-toolbar {
    gap: 1px;
    padding: 4px 6px;
  }
  .rte-btn {
    width: 30px;   /* slightly larger for touch targets (min 44px² recommended,
                      but 30px in a toolbar is standard practice for editors) */
    height: 30px;
  }
  .rte-link-popover {
    width: calc(100vw - 20px);
    max-width: none;
  }
}
</style>
