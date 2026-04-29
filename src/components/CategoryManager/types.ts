import type { IForm } from '@/components/Form'
import type { Ref, ComputedRef } from 'vue'

export interface CategoryItem {
  id: string | number
  title: string
  icon?: string
  description?: string
  children?: CategoryItem[]
  parentId?: string | number | null
  position?: number
  [key: string]: any
}

export interface RawCategoryItem {
  id: string | number
  name?: string
  title?: string
  icon?: string
  position?: number
  parentId?: string | number | null
  fullPath?: string
  [key: string]: any
}

export interface CategoryManagerProps {
  /** The nested array of category items */
  modelValue?: CategoryItem[]
  /** Optional flat list of items to be auto-converted to a nested tree */
  rawData?: RawCategoryItem[]
  /** Optional custom form schema for add/edit operations */
  formSchema?: IForm[]
  /** Disable drag-and-drop and mutation actions */
  readonly?: boolean
  /** Title for the empty state */
  emptyTitle?: string
  /** Description for the empty state */
  emptyDescription?: string
  /** Size modifier for the category nodes */
  size?: 'sm' | 'md' | 'lg'

  // I18n Props
  emptyTitleI18n?: string
  emptyDescriptionI18n?: string

  headerTitle?: string
  headerTitleI18n?: string
  headerDescription?: string
  headerDescriptionI18n?: string

  addCategoryText?: string
  addCategoryTextI18n?: string
  createCategoryText?: string
  createCategoryTextI18n?: string

  newRootPlaceholder?: string
  newRootPlaceholderI18n?: string
  newSubcategoryPlaceholder?: string
  newSubcategoryPlaceholderI18n?: string
  categoryTitlePlaceholder?: string
  categoryTitlePlaceholderI18n?: string

  modalTitleAdd?: string
  modalTitleAddI18n?: string
  modalTitleAddChild?: string
  modalTitleAddChildI18n?: string
  modalTitleEdit?: string
  modalTitleEditI18n?: string
  modalSaveText?: string
  modalSaveTextI18n?: string

  quickAddTooltip?: string
  quickAddTooltipI18n?: string
  advancedDetailsTooltip?: string
  advancedDetailsTooltipI18n?: string
  deleteTooltip?: string
  deleteTooltipI18n?: string
  saveTooltip?: string
  saveTooltipI18n?: string
  cancelTooltip?: string
  cancelTooltipI18n?: string
}

export interface InlineState {
  mode: 'add-root' | 'add-child' | null
  targetId: string | number | null
  title: string
  icon: string
}

export interface CategoryManagerContext {
  expandedIds: Ref<Set<string | number>>
  inlineState: Ref<InlineState>
  toggleExpand: (id: string | number) => void
  startInline: (
    mode: 'add-root' | 'add-child',
    parentId?: string | number | null
  ) => void
  saveInline: () => void
  cancelInline: () => void
  saveItem: (item: CategoryItem) => void
  openModalForm: (
    mode: 'add' | 'edit' | 'add-child',
    item?: CategoryItem | null,
    parentId?: string | number | null
  ) => void
  deleteItem: (item: CategoryItem) => void
  readonly: ComputedRef<boolean>
  size: ComputedRef<'sm' | 'md' | 'lg'>

  // Display texts for CategoryNode
  newSubcategoryPlaceholderText: ComputedRef<string>
  categoryTitlePlaceholderText: ComputedRef<string>
  quickAddTooltipText: ComputedRef<string>
  advancedDetailsTooltipText: ComputedRef<string>
  deleteTooltipText: ComputedRef<string>
  saveTooltipText: ComputedRef<string>
  cancelTooltipText: ComputedRef<string>
}
