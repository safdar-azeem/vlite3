export type CustomFieldsDisplayVariant = 'grid' | 'list' | 'card' | 'inline'

export interface CustomFieldItem {
  key?: string
  value?: any
  [key: string]: any
}

export interface CustomFieldsDisplayProps {
  title?: string
  titleI18n?: string
  icon?: string
  fields?: CustomFieldItem[]
  variant?: CustomFieldsDisplayVariant
  columns?: 1 | 2 | 3 | 4
  emptyText?: string
  keyProp?: string
  valueProp?: string
  class?: string
}
