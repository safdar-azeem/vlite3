import type { Component } from 'vue'

export type AccordionVariant = 'default' | 'solid' | 'outline' | 'separated' | 'ghost'
export type AccordionSize = 'sm' | 'md' | 'lg'
export type IconVariant = 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'

export interface AccordionItemSchema {
  id: string
  title: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  content?: string
  icon?: string
  disabled?: boolean
  bodyComponent?: Component | any
  [key: string]: any
}

export interface AccordionProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  items?: AccordionItemSchema[]
  allowMultiple?: boolean
  variant?: AccordionVariant
  size?: AccordionSize
  attached?: boolean
  disabled?: boolean
  showIndex?: boolean
  openIcon?: string
  closeIcon?: string
  iconVariant?: IconVariant
  activeIconVariant?: IconVariant
  class?: string
  triggerClass?: string
  contentClass?: string
  itemClass?: string
}

