<script setup lang="ts">
import { ref, watch, computed, provide } from 'vue'
import CategoryNode from './CategoryNode.vue'
import Modal from '@/components/Modal.vue'
import { Form, type IForm } from '@/components/Form'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import IconPicker from '@/components/IconPicker.vue'
import type { CategoryItem, CategoryManagerProps, CategoryManagerContext, InlineState } from './types'
import { getUniqueId } from '@/utils'

const props = withDefaults(defineProps<CategoryManagerProps>(), {
  modelValue: () => [],
  readonly: false,
  emptyTitle: 'No Categories Found',
  emptyDescription: 'Get started by creating your first category.',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: CategoryItem[]): void
  (e: 'onAdd', item: CategoryItem): void
  (e: 'onEdit', item: CategoryItem): void
  (e: 'onDelete', item: CategoryItem): void
  (e: 'onReorder', val: CategoryItem[]): void
}>()

// Use a deeply reactive ref so inline changes trigger reactivity cleanly
const internalData = ref<CategoryItem[]>([])
const expandedIds = ref<Set<string | number>>(new Set())

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

const ensureChildren = (list: CategoryItem[]) => {
  list.forEach((item) => {
    if (!item.children) item.children = []
    ensureChildren(item.children)
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    // Stringify check prevents re-cloning if the parent just emitted what we already have.
    const newString = JSON.stringify(newVal)
    const oldString = JSON.stringify(internalData.value)
    if (newString !== oldString) {
      const cloned = clone(newVal)
      ensureChildren(cloned)
      internalData.value = cloned
    }
  },
  { immediate: true, deep: true }
)

const emitUpdate = (isReorder = false) => {
  const cloned = clone(internalData.value)
  emit('update:modelValue', cloned)
  if (isReorder) {
    emit('onReorder', cloned)
  }
}

// -------------------------------------------------------------
// Accordion & Inline Add State
// -------------------------------------------------------------
const toggleExpand = (id: string | number) => {
  const newSet = new Set(expandedIds.value)
  if (newSet.has(id)) newSet.delete(id)
  else newSet.add(id)
  expandedIds.value = newSet
}

const inlineState = ref<InlineState>({
  mode: null,
  targetId: null,
  title: '',
  icon: 'lucide:folder',
})

const startInline = (
  mode: 'add-root' | 'add-child',
  parentId?: string | number | null
) => {
  inlineState.value = {
    mode,
    targetId: mode === 'add-child' ? (parentId || null) : null,
    title: '',
    icon: 'lucide:folder',
  }
  if (mode === 'add-child' && parentId) {
    expandedIds.value.add(parentId)
  }
}

const cancelInline = () => {
  inlineState.value = { mode: null, targetId: null, title: '', icon: 'lucide:folder' }
}

const saveInline = () => {
  const { mode, targetId, title, icon } = inlineState.value
  if (!title.trim()) return

  const currentData = [...internalData.value]

  if (mode === 'add-root') {
    const newItem: CategoryItem = { id: getUniqueId(), title, icon, children: [] }
    currentData.push(newItem)
    emit('onAdd', newItem)
  } else if (mode === 'add-child') {
    const newItem: CategoryItem = { id: getUniqueId(), title, icon, children: [] }
    const addRecursive = (list: CategoryItem[]) => {
      for (const i of list) {
        if (i.id === targetId) {
          if (!i.children) i.children = []
          i.children.push(newItem)
          return true
        }
        if (i.children && addRecursive(i.children)) return true
      }
      return false
    }
    addRecursive(currentData)
    emit('onAdd', newItem)
  }

  internalData.value = currentData
  emitUpdate()
  cancelInline()
}

// -------------------------------------------------------------
// Advanced Modal Form State
// -------------------------------------------------------------
const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit' | 'add-child'>('add')
const activeItem = ref<CategoryItem | null>(null)
const activeParentId = ref<string | number | null>(null)
const formValues = ref<Record<string, any>>({})

const defaultSchema: IForm[] = [
  { name: 'icon', label: 'Category Icon', type: 'iconPicker' },
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', props: { rows: 3 } },
]

const activeSchema = computed(() => props.formSchema || defaultSchema)

const modalTitle = computed(() => {
  if (modalMode.value === 'add') return 'Add Category'
  if (modalMode.value === 'add-child') return 'Add Sub-category'
  return 'Edit Category'
})

const openModalForm = (
  mode: 'add' | 'edit' | 'add-child',
  item?: CategoryItem | null,
  parentId?: string | number | null
) => {
  modalMode.value = mode
  activeItem.value = item || null
  activeParentId.value = parentId || null
  formValues.value = item ? clone(item) : {}
  isModalOpen.value = true
}

const handleFormSubmit = async (payload: any) => {
  const values = payload?.values || payload
  const currentData = [...internalData.value]

  if (modalMode.value === 'add') {
    const newItem: CategoryItem = { id: getUniqueId(), children: [], ...values }
    currentData.push(newItem)
    emit('onAdd', newItem)
  } else if (modalMode.value === 'add-child') {
    const newItem: CategoryItem = { id: getUniqueId(), children: [], ...values }
    const addRecursive = (list: CategoryItem[]) => {
      for (const i of list) {
        if (i.id === activeParentId.value) {
          if (!i.children) i.children = []
          i.children.push(newItem)
          expandedIds.value.add(i.id)
          return true
        }
        if (i.children && addRecursive(i.children)) return true
      }
      return false
    }
    addRecursive(currentData)
    emit('onAdd', newItem)
  } else if (modalMode.value === 'edit' && activeItem.value) {
    const id = activeItem.value.id
    const updateRecursive = (list: CategoryItem[]) => {
      const index = list.findIndex((i) => i.id === id)
      if (index > -1) {
        list[index] = { ...list[index], ...values }
        return true
      }
      for (const i of list) {
        if (i.children && updateRecursive(i.children)) return true
      }
      return false
    }
    updateRecursive(currentData)
    emit('onEdit', { ...activeItem.value, ...values })
  }

  internalData.value = currentData
  emitUpdate()
  
  if (payload && typeof payload.setSubmitting === 'function') {
    payload.setSubmitting(false)
  }
  isModalOpen.value = false
}

const handleDelete = (item: CategoryItem) => {
  const id = item.id
  const deleteRecursive = (list: CategoryItem[]) => {
    const index = list.findIndex((i) => i.id === id)
    if (index > -1) {
      list.splice(index, 1)
      return true
    }
    for (const i of list) {
      if (i.children && deleteRecursive(i.children)) return true
    }
    return false
  }
  
  const currentData = [...internalData.value]
  deleteRecursive(currentData)
  internalData.value = currentData
  emit('onDelete', item)
  emitUpdate()
}

// Emitted directly from inline editing inputs/iconpickers
const saveItem = (item: CategoryItem) => {
  emit('onEdit', clone(item))
  emitUpdate()
}

// -------------------------------------------------------------
// Root Drag and Drop Update
// -------------------------------------------------------------
const handleRootUpdate = (val: CategoryItem[]) => {
  internalData.value = [...val]
  emitUpdate(true)
}

const handleTreeChange = () => {
  emitUpdate(true)
}

provide<CategoryManagerContext>('categoryManager', {
  expandedIds,
  inlineState,
  toggleExpand,
  startInline,
  saveInline,
  cancelInline,
  saveItem,
  openModalForm,
  deleteItem: handleDelete,
  readonly: computed(() => props.readonly),
  size: computed(() => props.size),
})

// Focus directive to handle conditional rendering
const vFocus = {
  mounted: (el: HTMLElement) => {
    setTimeout(() => el.focus(), 10)
  }
}
</script>

<template>
  <div class="category-manager-container w-full bg-muted/10 rounded-xl border border-border p-4 lg:p-6">
    <div class="flex items-center justify-between mb-6">
      <slot name="header">
        <div>
          <h3 class="text-lg font-bold text-foreground">Categories</h3>
          <p class="text-sm text-muted-foreground mt-0.5">Manage your hierarchical structure.</p>
        </div>
        <Button
          v-if="!readonly"
          variant="primary"
          icon="lucide:plus"
          size="sm"
          @click="startInline('add-root')">
          Add Category
        </Button>
      </slot>
    </div>

    <div
      v-if="internalData.length === 0 && inlineState.mode !== 'add-root'"
      class="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border rounded-xl bg-background">
      <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon icon="lucide:folder-tree" class="w-6 h-6 text-muted-foreground" />
      </div>
      <h4 class="text-base font-medium text-foreground">{{ emptyTitle }}</h4>
      <p class="text-sm text-muted-foreground mt-1 max-w-sm">{{ emptyDescription }}</p>
      <Button
        v-if="!readonly"
        variant="outline"
        size="sm"
        class="mt-5"
        icon="lucide:plus"
        @click="startInline('add-root')">
        Create Category
      </Button>
    </div>

    <div v-else class="w-full tree-wrapper scrollable-container" style="will-change: transform; contain: layout style;">
      <CategoryNode
        :modelValue="internalData"
        @update:modelValue="handleRootUpdate"
        @change="handleTreeChange" />

      <div
        v-if="inlineState.mode === 'add-root'"
        class="flex items-center gap-1.5 py-1.5 px-2 bg-background border border-border shadow-sm rounded-lg w-full mt-2">
        <IconPicker
          v-model="inlineState.icon"
          :btn-props="{ variant: 'ghost', size: 'xs', class: 'h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-md' }"
          position="bottom-start" />
        <input
          v-focus
          v-model="inlineState.title"
          class="flex-1 bg-transparent border-0 outline-none focus:ring-0 px-1 py-1 text-sm transition-colors w-full shadow-none caret-primary text-foreground placeholder:text-muted-foreground"
          placeholder="New root category..."
          @keyup.enter="saveInline"
          @keyup.esc="cancelInline" />
        <Button
          variant="primary"
          size="xs"
          icon="lucide:check"
          class="shrink-0 h-7 w-7 px-0"
          title="Save"
          @click="saveInline" />
        <Button
          variant="ghost"
          size="xs"
          icon="lucide:x"
          class="shrink-0 h-7 w-7 px-0"
          title="Cancel"
          @click="cancelInline" />
      </div>
    </div>

    <Modal v-model:show="isModalOpen" :title="modalTitle" max-width="max-w-md">
      <div class="modal-body" style="will-change: transform; contain: layout style;">
        <Form
          :schema="activeSchema"
          :values="formValues"
          :isUpdate="modalMode === 'edit'"
          submitText="Save Details"
          @onSubmit="handleFormSubmit" />
      </div>
    </Modal>
  </div>
</template>
