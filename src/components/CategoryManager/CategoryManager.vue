<script setup lang="ts">
import { ref, watch, computed, provide } from 'vue'
import CategoryNode from './CategoryNode.vue'
import Modal from '@/components/Modal.vue'
import { Form, type IForm } from '@/components/Form'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import IconPicker from '@/components/IconPicker.vue'
import type { CategoryItem, RawCategoryItem, CategoryManagerProps, CategoryManagerContext, InlineState } from './types'
import { getUniqueId } from '@/utils'
import { $t } from '@/utils/i18n'

const props = withDefaults(defineProps<CategoryManagerProps>(), {
  modelValue: () => [],
  rawData: undefined,
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
  (e: 'onReorder', val: { id: string | number; parentId: string | number | null; position: number }): void
}>()

// Use a deeply reactive ref so inline changes trigger reactivity cleanly
const internalData = ref<CategoryItem[]>([])
const expandedIds = ref<Set<string | number>>(new Set())

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

// Recursively populates parentId, position, and ensures children array exists
const ensureMeta = (list: CategoryItem[], parentId: string | number | null = null) => {
  list.forEach((item, index) => {
    item.parentId = parentId
    item.position = index
    if (!item.children) item.children = []
    ensureMeta(item.children, item.id)
  })
}

// Helper to auto-build tree from a flat API array
const buildTreeFromRaw = (items: RawCategoryItem[]): CategoryItem[] => {
  const itemMap = new Map<string | number, CategoryItem>()
  const rootItems: CategoryItem[] = []

  // First pass: initialize all items and normalize name to title
  items.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      id: item.id,
      title: item.name || item.title || 'Untitled',
      icon: item.icon,
      parentId: item.parentId || null,
      position: item.position ?? 0,
      children: [],
    })
  })

  // Second pass: attach to parents
  items.forEach((item) => {
    const currentItem = itemMap.get(item.id)
    if (!currentItem) return

    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId)!.children!.push(currentItem)
    } else {
      rootItems.push(currentItem)
    }
  })

  // Third pass: sort by original explicit positions
  const sortRecursive = (nodes: CategoryItem[]) => {
    nodes.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    nodes.forEach((node) => {
      if (node.children) sortRecursive(node.children)
    })
  }
  sortRecursive(rootItems)

  return rootItems
}

watch(
  () => props.rawData,
  (newRaw) => {
    if (newRaw && newRaw.length > 0) {
      const newTree = buildTreeFromRaw(newRaw)
      ensureMeta(newTree)
      const newString = JSON.stringify(newTree)
      const oldString = JSON.stringify(internalData.value)
      if (newString !== oldString) {
        const cloned = clone(newTree)
        internalData.value = cloned
        emit('update:modelValue', cloned)
      }
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.modelValue,
  (newVal) => {
    // Stringify check prevents re-cloning if the parent just emitted what we already have.
    const newString = JSON.stringify(newVal)
    const oldString = JSON.stringify(internalData.value)
    if (newString !== oldString && newVal.length > 0) {
      const cloned = clone(newVal)
      ensureMeta(cloned)
      internalData.value = cloned
    }
  },
  { immediate: true, deep: true }
)

const emitUpdate = () => {
  ensureMeta(internalData.value)
  const cloned = clone(internalData.value)
  emit('update:modelValue', cloned)
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
  let newItem: CategoryItem | null = null

  if (mode === 'add-root') {
    newItem = { id: getUniqueId(), title, icon, children: [] }
    currentData.push(newItem)
  } else if (mode === 'add-child') {
    newItem = { id: getUniqueId(), title, icon, children: [] }
    const addRecursive = (list: CategoryItem[]) => {
      for (const i of list) {
        if (i.id === targetId) {
          if (!i.children) i.children = []
          i.children.push(newItem!)
          return true
        }
        if (i.children && addRecursive(i.children)) return true
      }
      return false
    }
    addRecursive(currentData)
  }

  if (newItem) {
    ensureMeta(currentData) // Populates parentId and position
    emit('onAdd', clone(newItem))
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

const displayModalTitle = computed(() => {
  if (modalMode.value === 'add') {
    if (props.modalTitleAddI18n) return $t(props.modalTitleAddI18n)
    if (props.modalTitleAdd) return props.modalTitleAdd
    return $t('vlite.categoryManager.modalTitleAdd') !== 'vlite.categoryManager.modalTitleAdd' ? $t('vlite.categoryManager.modalTitleAdd') : 'Add Category'
  }
  if (modalMode.value === 'add-child') {
    if (props.modalTitleAddChildI18n) return $t(props.modalTitleAddChildI18n)
    if (props.modalTitleAddChild) return props.modalTitleAddChild
    return $t('vlite.categoryManager.modalTitleAddChild') !== 'vlite.categoryManager.modalTitleAddChild' ? $t('vlite.categoryManager.modalTitleAddChild') : 'Add Sub-category'
  }
  if (props.modalTitleEditI18n) return $t(props.modalTitleEditI18n)
  if (props.modalTitleEdit) return props.modalTitleEdit
  return $t('vlite.categoryManager.modalTitleEdit') !== 'vlite.categoryManager.modalTitleEdit' ? $t('vlite.categoryManager.modalTitleEdit') : 'Edit Category'
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
  let emittedItem: CategoryItem | null = null
  let eventName: 'onAdd' | 'onEdit' | null = null

  if (modalMode.value === 'add') {
    const newItem: CategoryItem = { id: getUniqueId(), children: [], ...values }
    currentData.push(newItem)
    emittedItem = newItem
    eventName = 'onAdd'
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
    emittedItem = newItem
    eventName = 'onAdd'
  } else if (modalMode.value === 'edit' && activeItem.value) {
    const id = activeItem.value.id
    const updateRecursive = (list: CategoryItem[]) => {
      const index = list.findIndex((i) => i.id === id)
      if (index > -1) {
        list[index] = { ...list[index], ...values }
        emittedItem = list[index]
        return true
      }
      for (const i of list) {
        if (i.children && updateRecursive(i.children)) return true
      }
      return false
    }
    updateRecursive(currentData)
    eventName = 'onEdit'
  }

  ensureMeta(currentData) // Populates parentId and position
  
  if (emittedItem) {
    if (eventName === 'onAdd') {
      emit('onAdd', clone(emittedItem))
    } else if (eventName === 'onEdit') {
      emit('onEdit', clone(emittedItem))
    }
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
  ensureMeta(currentData) // Re-calculate tree positions post-deletion
  internalData.value = currentData
  
  // Emit the clone of the deleted item (still retains its original parentId and position)
  emit('onDelete', clone(item))
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
  emitUpdate()
}

const handleTreeChange = () => {
  emitUpdate()
}

const handleDragEnd = (movedId: string | number) => {
  // Lock in new positions
  ensureMeta(internalData.value)
  const cloned = clone(internalData.value)
  emit('update:modelValue', cloned)

  // Find the exact node that was moved to emit minimal payload
  let movedItem: CategoryItem | null = null
  const findItem = (list: CategoryItem[]) => {
    for (const item of list) {
      if (String(item.id) === String(movedId)) {
        movedItem = item
        return true
      }
      if (item.children && findItem(item.children)) return true
    }
    return false
  }
  findItem(cloned)

  if (movedItem) {
    emit('onReorder', {
      id: movedItem.id,
      parentId: movedItem.parentId ?? null,
      position: movedItem.position ?? 0,
    })
  }
}

// -------------------------------------------------------------
// I18n Computeds
// -------------------------------------------------------------
const displayEmptyTitle = computed(() => {
  if (props.emptyTitleI18n) {
    const res = $t(props.emptyTitleI18n)
    if (res !== props.emptyTitleI18n) return res
  }
  if (props.emptyTitle !== 'No Categories Found') return props.emptyTitle
  const globalRes = $t('vlite.categoryManager.emptyTitle')
  return globalRes !== 'vlite.categoryManager.emptyTitle' ? globalRes : props.emptyTitle
})

const displayEmptyDescription = computed(() => {
  if (props.emptyDescriptionI18n) {
    const res = $t(props.emptyDescriptionI18n)
    if (res !== props.emptyDescriptionI18n) return res
  }
  if (props.emptyDescription !== 'Get started by creating your first category.') return props.emptyDescription
  const globalRes = $t('vlite.categoryManager.emptyDescription')
  return globalRes !== 'vlite.categoryManager.emptyDescription' ? globalRes : props.emptyDescription
})

const displayHeaderTitle = computed(() => {
  if (props.headerTitleI18n) {
    const res = $t(props.headerTitleI18n)
    if (res !== props.headerTitleI18n) return res
  }
  if (props.headerTitle) return props.headerTitle
  const globalRes = $t('vlite.categoryManager.headerTitle')
  return globalRes !== 'vlite.categoryManager.headerTitle' ? globalRes : 'Categories'
})

const displayHeaderDescription = computed(() => {
  if (props.headerDescriptionI18n) {
    const res = $t(props.headerDescriptionI18n)
    if (res !== props.headerDescriptionI18n) return res
  }
  if (props.headerDescription) return props.headerDescription
  const globalRes = $t('vlite.categoryManager.headerDescription')
  return globalRes !== 'vlite.categoryManager.headerDescription' ? globalRes : 'Manage your hierarchical structure.'
})

const displayAddCategoryText = computed(() => {
  if (props.addCategoryTextI18n) {
    const res = $t(props.addCategoryTextI18n)
    if (res !== props.addCategoryTextI18n) return res
  }
  if (props.addCategoryText) return props.addCategoryText
  const globalRes = $t('vlite.categoryManager.addCategory')
  return globalRes !== 'vlite.categoryManager.addCategory' ? globalRes : 'Add Category'
})

const displayCreateCategoryText = computed(() => {
  if (props.createCategoryTextI18n) {
    const res = $t(props.createCategoryTextI18n)
    if (res !== props.createCategoryTextI18n) return res
  }
  if (props.createCategoryText) return props.createCategoryText
  const globalRes = $t('vlite.categoryManager.createCategory')
  return globalRes !== 'vlite.categoryManager.createCategory' ? globalRes : 'Create Category'
})

const displayNewRootPlaceholder = computed(() => {
  if (props.newRootPlaceholderI18n) {
    const res = $t(props.newRootPlaceholderI18n)
    if (res !== props.newRootPlaceholderI18n) return res
  }
  if (props.newRootPlaceholder) return props.newRootPlaceholder
  const globalRes = $t('vlite.categoryManager.newRootPlaceholder')
  return globalRes !== 'vlite.categoryManager.newRootPlaceholder' ? globalRes : 'New root category...'
})

const displayModalSaveText = computed(() => {
  if (props.modalSaveTextI18n) {
    const res = $t(props.modalSaveTextI18n)
    if (res !== props.modalSaveTextI18n) return res
  }
  if (props.modalSaveText) return props.modalSaveText
  const globalRes = $t('vlite.categoryManager.modalSaveText')
  return globalRes !== 'vlite.categoryManager.modalSaveText' ? globalRes : 'Save Details'
})

const displayNewSubcategoryPlaceholder = computed(() => {
  if (props.newSubcategoryPlaceholderI18n) {
    const res = $t(props.newSubcategoryPlaceholderI18n)
    if (res !== props.newSubcategoryPlaceholderI18n) return res
  }
  if (props.newSubcategoryPlaceholder) return props.newSubcategoryPlaceholder
  const globalRes = $t('vlite.categoryManager.newSubcategoryPlaceholder')
  return globalRes !== 'vlite.categoryManager.newSubcategoryPlaceholder' ? globalRes : 'New subcategory title...'
})

const displayCategoryTitlePlaceholder = computed(() => {
  if (props.categoryTitlePlaceholderI18n) {
    const res = $t(props.categoryTitlePlaceholderI18n)
    if (res !== props.categoryTitlePlaceholderI18n) return res
  }
  if (props.categoryTitlePlaceholder) return props.categoryTitlePlaceholder
  const globalRes = $t('vlite.categoryManager.categoryTitlePlaceholder')
  return globalRes !== 'vlite.categoryManager.categoryTitlePlaceholder' ? globalRes : 'Category title...'
})

const displayQuickAddTooltip = computed(() => {
  if (props.quickAddTooltipI18n) return $t(props.quickAddTooltipI18n)
  if (props.quickAddTooltip) return props.quickAddTooltip
  return $t('vlite.categoryManager.quickAddTooltip') !== 'vlite.categoryManager.quickAddTooltip' ? $t('vlite.categoryManager.quickAddTooltip') : 'Quick Add Subcategory'
})

const displayAdvancedDetailsTooltip = computed(() => {
  if (props.advancedDetailsTooltipI18n) return $t(props.advancedDetailsTooltipI18n)
  if (props.advancedDetailsTooltip) return props.advancedDetailsTooltip
  return $t('vlite.categoryManager.advancedDetailsTooltip') !== 'vlite.categoryManager.advancedDetailsTooltip' ? $t('vlite.categoryManager.advancedDetailsTooltip') : 'Advanced Details'
})

const displayDeleteTooltip = computed(() => {
  if (props.deleteTooltipI18n) return $t(props.deleteTooltipI18n)
  if (props.deleteTooltip) return props.deleteTooltip
  return $t('vlite.categoryManager.deleteTooltip') !== 'vlite.categoryManager.deleteTooltip' ? $t('vlite.categoryManager.deleteTooltip') : 'Delete'
})

const displaySaveTooltip = computed(() => {
  if (props.saveTooltipI18n) return $t(props.saveTooltipI18n)
  if (props.saveTooltip) return props.saveTooltip
  return $t('vlite.categoryManager.saveTooltip') !== 'vlite.categoryManager.saveTooltip' ? $t('vlite.categoryManager.saveTooltip') : 'Save'
})

const displayCancelTooltip = computed(() => {
  if (props.cancelTooltipI18n) return $t(props.cancelTooltipI18n)
  if (props.cancelTooltip) return props.cancelTooltip
  return $t('vlite.categoryManager.cancelTooltip') !== 'vlite.categoryManager.cancelTooltip' ? $t('vlite.categoryManager.cancelTooltip') : 'Cancel'
})

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
  newSubcategoryPlaceholderText: displayNewSubcategoryPlaceholder,
  categoryTitlePlaceholderText: displayCategoryTitlePlaceholder,
  quickAddTooltipText: displayQuickAddTooltip,
  advancedDetailsTooltipText: displayAdvancedDetailsTooltip,
  deleteTooltipText: displayDeleteTooltip,
  saveTooltipText: displaySaveTooltip,
  cancelTooltipText: displayCancelTooltip,
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
          <h3 class="text-lg font-bold text-foreground">{{ displayHeaderTitle }}</h3>
          <p class="text-sm text-muted-foreground mt-0.5">{{ displayHeaderDescription }}</p>
        </div>
        <Button
          v-if="!readonly"
          variant="primary"
          icon="lucide:plus"
          size="sm"
          @click="startInline('add-root')">
          {{ displayAddCategoryText }}
        </Button>
      </slot>
    </div>

    <div
      v-if="internalData.length === 0 && inlineState.mode !== 'add-root'"
      class="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border rounded-xl bg-background">
      <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon icon="lucide:folder-tree" class="w-6 h-6 text-muted-foreground" />
      </div>
      <h4 class="text-base font-medium text-foreground">{{ displayEmptyTitle }}</h4>
      <p class="text-sm text-muted-foreground mt-1 max-w-sm">{{ displayEmptyDescription }}</p>
      <Button
        v-if="!readonly"
        variant="outline"
        size="sm"
        class="mt-5"
        icon="lucide:plus"
        @click="startInline('add-root')">
        {{ displayCreateCategoryText }}
      </Button>
    </div>

    <div v-else class="w-full tree-wrapper scrollable-container" style="will-change: transform; contain: layout style;">
      <CategoryNode
        :modelValue="internalData"
        @update:modelValue="handleRootUpdate"
        @change="handleTreeChange"
        @dragEnd="handleDragEnd" />

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
          :placeholder="displayNewRootPlaceholder"
          @keyup.enter="saveInline"
          @keyup.esc="cancelInline" />
        <Button
          variant="primary"
          size="xs"
          icon="lucide:check"
          class="shrink-0 h-7 w-7 px-0"
          :title="displaySaveTooltip"
          @click="saveInline" />
        <Button
          variant="ghost"
          size="xs"
          icon="lucide:x"
          class="shrink-0 h-7 w-7 px-0"
          :title="displayCancelTooltip"
          @click="cancelInline" />
      </div>
    </div>

    <Modal v-model:show="isModalOpen" :title="displayModalTitle" max-width="max-w-md">
      <div class="modal-body" style="will-change: transform; contain: layout style;">
        <Form
          :schema="activeSchema"
          :values="formValues"
          :isUpdate="modalMode === 'edit'"
          :submitText="displayModalSaveText"
          @onSubmit="handleFormSubmit" />
      </div>
    </Modal>
  </div>
</template>
