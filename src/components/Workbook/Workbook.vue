<script setup lang="ts">
import { ref, watch, nextTick, computed, shallowRef } from 'vue'
import { useScroll } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
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
  itemClass: '',
  activeItemClass: '',
  inactiveItemClass: '',
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
const { arrivedState } = useScroll(scrollContainer)

// Drag and Drop State using shallowRef for massive arrays performance boost
const sheetsList = shallowRef<WorkbookSheet[]>([...props.sheets])

// Watch for external updates to sheets prop
watch(
  () => props.sheets,
  (newSheets) => {
    let needsUpdate = false

    // Check if structure (length) changed
    if (newSheets.length !== sheetsList.value.length) {
      needsUpdate = true
    } else {
      // Fast O(n) check for object reference or ID changes without deep proxy traversal overhead
      for (let i = 0; i < newSheets.length; i++) {
        if (newSheets[i] !== sheetsList.value[i] || newSheets[i].id !== sheetsList.value[i].id) {
          needsUpdate = true
          break
        }
      }
    }

    if (needsUpdate) {
      sheetsList.value = [...newSheets]
    }
  },
  { deep: true } // Must be true so parent mutating the array via .push() correctly triggers the watcher
)

const handleSheetsUpdate = (newItems: WorkbookSheet[]) => {
  sheetsList.value = newItems
  emit('update:sheets', newItems)
}

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
    <div class="flex items-end w-full border-b px-1">
      <div v-if="$slots['left-addons']" class="flex items-center">
        <slot name="left-addons" />
      </div>

      <div
        ref="scrollContainer"
        class="flex-1 flex items-end overflow-x-auto scrollbar-none overscroll-contain sheet-container"
        style="scrollbar-width: none; -ms-overflow-style: none"
        @wheel="onWheel">
        <VueDraggable
          :model-value="sheetsList"
          @update:model-value="handleSheetsUpdate"
          :disabled="!props.draggable || !!editingTabId"
          :animation="150"
          class="flex items-end min-w-max">
          <SheetItem
            v-for="sheet in sheetsList"
            :key="sheet.id"
            v-memo="[
              sheet.id,
              sheet.title,
              sheet.icon,
              modelValue === sheet.id,
              editingTabId === sheet.id,
              canDeleteSheet,
              confirmDelete,
              allowIconChange,
            ]"
            :sheet="sheet"
            :is-active="modelValue === sheet.id"
            :is-editing="editingTabId === sheet.id"
            :can-delete="canDeleteSheet"
            :confirm-delete="confirmDelete"
            :confirm-delete-texts="confirmDeleteTexts"
            :allow-icon-change="allowIconChange"
            :item-class="itemClass"
            :active-item-class="activeItemClass"
            :inactive-item-class="inactiveItemClass"
            @select="handleSelect"
            @update:title="handleUpdateTitle"
            @update:icon="handleUpdateIcon"
            @edit-start="handleEditStart"
            @edit-end="handleEditEnd"
            @duplicate="handleDuplicate"
            @delete="handleDelete" />
        </VueDraggable>

        <div
          v-if="addable && addButtonPosition === 'attached'"
          class="shrink-0 sticky right-0 z-10 bg-body flex items-center justify-center h-full"
          :class="{
            'shadow-[-10px_0_12px_-4px_#fff] dark:shadow-[-10px_0_12px_-4px_#000]': !arrivedState.right
          }">
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
.sheet-container {
  will-change: transform;
  contain: layout style;
}
</style>
