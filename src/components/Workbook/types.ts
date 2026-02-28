export interface WorkbookSheet {
  id: string
  title: string
  titleI18n?: string
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

  maxSheets?: number

  variant?: 'chrome' | 'folder' | 'simple' | 'card'
  class?: string
  itemClass?: string
  activeItemClass?: string
  inactiveItemClass?: string

  confirmDelete?: boolean
  confirmDeleteTexts?: {
    title?: string
    description?: string
    confirm?: string
    cancel?: string
  }

  allowIconChange?: boolean
}

export interface SheetEvent {
  id: string
  sheet: WorkbookSheet
  originalEvent?: Event
}

