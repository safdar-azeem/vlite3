export interface WorkbookSheet {
  id: string
  title: string
  icon?: string
  content?: string
  closable?: boolean
  disabled?: boolean
  [key: string]: any
}

export type SheetPosition = 'top' | 'bottom' | 'left' | 'right'
export type AddButtonPosition = 'attached' | 'fixed-right'

export interface WorkbookProps {
  modelValue?: string
  sheets?: WorkbookSheet[]
  editable?: boolean
  addable?: boolean
  draggable?: boolean
  addButtonPosition?: AddButtonPosition

  // Limits
  maxSheets?: number

  // Style
  variant?: 'chrome' | 'folder' | 'simple' | 'card'
  class?: string
  itemClass?: string
  activeItemClass?: string
  inactiveItemClass?: string

  // Delete Confirmation
  confirmDelete?: boolean
  confirmDeleteTexts?: {
    title?: string
    description?: string
    confirm?: string
    cancel?: string
  }

  // Configuration
  allowIconChange?: boolean
}

export interface SheetEvent {
  id: string
  sheet: WorkbookSheet
  originalEvent?: Event
}
