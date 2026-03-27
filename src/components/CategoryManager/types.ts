import type { IForm } from '@/components/Form'
import type { Ref, ComputedRef } from 'vue'

export interface CategoryItem {
  id: string | number
  title: string
  icon?: string
  description?: string
  children?: CategoryItem[]
  [key: string]: any
}

export interface CategoryManagerProps {
  /** The nested array of category items */
  modelValue?: CategoryItem[]
  /** Optional custom form schema for add/edit operations */
  formSchema?: IForm[]
  /** Disable drag-and-drop and mutation actions */
  readonly?: boolean
  /** Title for the empty state */
  emptyTitle?: string
  /** Description for the empty state */
  emptyDescription?: string
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
}
