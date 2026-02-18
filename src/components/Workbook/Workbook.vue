<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'
import type { WorkbookSheet, WorkbookProps, AddButtonPosition } from './types'
import SheetItem from './Sheet.vue'
import WorkbookAddButton from './WorkbookAddButton.vue'

// Props
const props = withDefaults(defineProps<WorkbookProps>(), {
  editable: true,
  addable: true,
  draggable: true,
  addButtonPosition: 'fixed-right' as AddButtonPosition,
  variant: 'chrome',
  modelValue: '',
  sheets: () => [],
  maxSheets: 50,
  confirmDelete: false,
  allowIconChange: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void
  (e: 'update:sheets', sheets: WorkbookSheet[]): void
  (e: 'change', id: string): void
  (e: 'add'): void
  (e: 'delete', id: string): void
  (e: 'duplicate', id: string): void
  (e: 'edit-start', id: string): void
  (e: 'edit-end', id: string): void
}>()

// State
const scrollContainer = ref<HTMLElement | null>(null)
const editingTabId = ref<string | null>(null)

// Drag and Drop
const [parent, sheetsList] = useDragAndDrop(props.sheets, {
  plugins: [animations()],
  draggable: (el) => {
    // Only allow dragging if enabled and not currently editing
    // We check props.draggable and ensure we aren't in edit mode
    return props.draggable && !editingTabId.value
  },
  onSort: (state) => {
    // Sync order changes back to parent
    // Cast state.values to WorkbookSheet[] if needed, typically it infers correctly
    emit('update:sheets', state.values as WorkbookSheet[])
  },
})

// Watch for external updates to sheets prop
watch(
  () => props.sheets,
  (newSheets) => {
    if (JSON.stringify(newSheets) !== JSON.stringify(sheetsList.value)) {
      sheetsList.value = [...newSheets]
    }
  },
  { deep: true }
)

const handleSelect = (id: string) => {
  emit('update:modelValue', id)
  emit('change', id)
}

// Add New
const handleAdd = () => {
  if (props.sheets.length >= props.maxSheets) return
  emit('add')
}

// Edit Flow
const handleUpdateTitle = (id: string, newTitle: string) => {
  const idx = props.sheets.findIndex((t) => t.id === id)
  if (idx !== -1) {
    const newSheets = [...props.sheets]
    newSheets[idx] = { ...newSheets[idx], title: newTitle }
    emit('update:sheets', newSheets)
  }
}

const handleUpdateIcon = (id: string, newIcon: string) => {
  const idx = props.sheets.findIndex((t) => t.id === id)
  if (idx !== -1) {
    const newSheets = [...props.sheets]
    newSheets[idx] = { ...newSheets[idx], icon: newIcon }
    emit('update:sheets', newSheets)
  }
}

const handleEditStart = (id: string) => {
  editingTabId.value = id
  emit('edit-start', id)
}

const handleEditEnd = (id: string) => {
  editingTabId.value = null
  emit('edit-end', id)
}

// Duplicate logic
const handleDuplicate = (id: string) => {
  emit('duplicate', id)
}

// Delete logic
const handleDelete = (id: string) => {
  // If confirmation was needed, it's already handled by Sheet -> Dropdown before emitting 'delete'
  const idx = props.sheets.findIndex((t) => t.id === id)
  if (idx === -1) return

  // 1. Emit update:sheets (Auto-delete)
  const newSheets = [...props.sheets]
  newSheets.splice(idx, 1)
  emit('update:sheets', newSheets)

  // 2. Emit delete event (Legacy / Notification)
  emit('delete', id)

  // 3. Handle Active State
  if (props.modelValue === id) {
    let newActiveId = ''
    if (newSheets.length > 0) {
      // Prefer same index (next item moves in), else last item
      const newIdx = Math.min(idx, newSheets.length - 1)
      newActiveId = newSheets[newIdx].id
    }
    emit('update:modelValue', newActiveId)
    emit('change', newActiveId)
  }
}

// Watchers for "Auto Edit newly added sheet"
watch(
  () => props.sheets.length,
  (newLen, oldLen) => {
    // Only trigger auto-edit if exactly one sheet was added, and we already had sheets.
    // This prevents triggering edit mode on initial data hydration or page refresh.
    if (oldLen !== undefined && oldLen > 0 && newLen === oldLen + 1 && props.addable) {
      nextTick(() => {
        const lastSheet = props.sheets[props.sheets.length - 1]
        if (lastSheet.id === props.modelValue) {
          editingTabId.value = lastSheet.id
        }
      })
    }
  }
)

// Scroll behavior (horizontal wheel)
const onWheel = (e: WheelEvent) => {
  if (scrollContainer.value) {
    if (e.deltaY !== 0) {
      scrollContainer.value.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }
}

// Use props.tabs for length check to rely on "upstream" truth rather than internal drag state
const canDeleteSheet = computed(() => props.sheets.length > 1)
</script>

<template>
  <div class="flex flex-col w-full font-sans">
    <div class="flex items-end w-full border-b px-1 gap-2">
      <div v-if="$slots['left-addons']" class="flex items-center mb-1 mr-2">
        <slot name="left-addons" />
      </div>

      <div
        ref="scrollContainer"
        class="flex-1 flex items-end overflow-x-auto scrollbar-none overscroll-contain"
        style="scrollbar-width: none; -ms-overflow-style: none"
        @wheel="onWheel">
        <div ref="parent" class="flex items-end">
          <SheetItem
            v-for="sheet in sheetsList"
            :key="sheet.id"
            :sheet="sheet"
            :is-active="modelValue === sheet.id"
            :is-editing="editingTabId === sheet.id"
            :can-delete="canDeleteSheet"
            :confirm-delete="confirmDelete"
            :confirm-delete-texts="confirmDeleteTexts"
            :allow-icon-change="allowIconChange"
            @select="handleSelect"
            @update:title="handleUpdateTitle"
            @update:icon="handleUpdateIcon"
            @edit-start="handleEditStart"
            @edit-end="handleEditEnd"
            @duplicate="handleDuplicate"
            @delete="handleDelete" />
        </div>

        <div v-if="addable && addButtonPosition === 'attached'" class="shrink-0 mb-1">
          <WorkbookAddButton @click="handleAdd" />
        </div>

        <div class="w-1 shrink-0"></div>
      </div>

      <div class="flex items-center mb-0.5 z-20 sticky right-0 ml-auto box-decoration-clone">
        <div v-if="addable && addButtonPosition === 'fixed-right'">
          <WorkbookAddButton @click="handleAdd" />
        </div>

        <div v-if="$slots['right-addons']">
          <slot name="right-addons" />
        </div>
      </div>
    </div>

    <div class="flex-1 relative bg-white w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Removed TransitionGroup styles as FormKit/drag-and-drop handles animations */
</style>
