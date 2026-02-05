export interface AccordionItemSchema {
  id: string
  title: string
  description?: string
  content?: string // HTML or text
  bodyComponent?: any // Component to render in body
  disabled?: boolean
  icon?: string
  // Allow any arbitrary data for slots
  [key: string]: any
}

export type AccordionVariant = 'default' | 'solid' | 'outline' | 'ghost' | 'separated' // Items have gaps between them

export interface AccordionProps {
  items?: AccordionItemSchema[]
  modelValue?: string | string[]
  allowMultiple?: boolean
  defaultValue?: string | string[]
  disabled?: boolean
  variant?: AccordionVariant

  // Layout
  attached?: boolean

  // Icon Customization
  openIcon?: string
  closeIcon?: string
  iconPosition?: 'left' | 'right'
  iconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'
  activeIconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'

  // Numbering
  showIndex?: boolean

  // Classes for deep customization
  class?: string
  itemClass?: string
  triggerClass?: string
  contentClass?: string
}
