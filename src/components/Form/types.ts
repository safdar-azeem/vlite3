import type { Component } from 'vue'
import type { IDropdownOptions } from '@/types'
import type { InputVariant, InputSize, InputRounded } from '@/types'

/**
 * Addon configuration for input field addons (left/right)
 * Allows rendering dropdowns or buttons inside input addons from schema
 */
export interface IFormAddon {
  /** Key in form values this addon writes to (required for select, optional for button) */
  name?: string
  /** 'select' renders a Dropdown; 'button' renders a Button */
  type: 'select' | 'button'
  /** Default value (for select addons) */
  value?: any
  /** Dropdown options (required when type='select') */
  options?: IDropdownOptions
  /** Button label (required when type='button') */
  text?: string
  /** Emitted action name on button click */
  action?: string
  /** Extra props forwarded to the rendered component */
  props?: Record<string, any>
}

/**
 * Form field types - maps to corresponding UI components
 */
export type IFormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'file'
  | 'fileUploader'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'textarea'
  | 'time'
  | 'iconPicker'
  | 'color'
  | 'switch'
  | 'check'
  | 'customFields'
  | 'select'
  | 'multiSelect'
  | 'avatarUpload'
  | Component

/**
 * Context passed to conditional functions
 */
export interface IFormContext {
  values: Record<string, any>
  isUpdate?: boolean
}

/**
 * Disabled/Readonly can be boolean or function
 */
export type IFormDisabled = boolean | ((context: IFormContext) => boolean)

/**
 * Validation function signature
 */
export interface IFormValidationContext {
  value: any
  values: Record<string, any>
  isUpdate?: boolean
}

export type IFormValidation = (context: IFormValidationContext) => string

/**
 * UpdateValues function signature - allows computed/derived fields
 */
export interface IFormUpdateContext {
  values: Record<string, any>
  data?: any
  isUpdate?: boolean
  updateError?: (name: string, error: string) => void
}

export type IFormUpdateValues = (context: IFormUpdateContext) => Record<string, any>

/**
 * When condition - controls field visibility
 */
export type IFormWhen = (context: IFormContext) => boolean

/**
 * CustomFields schema props
 */
export interface IFormCustomFieldsProps {
  schema: IForm[]
  headers?: string[]
}

/**
 * Main form field interface
 */
export interface IForm {
  /** Field name - supports dot notation for nested paths (e.g., 'pricing.baseAmount') */
  name: string
  /** Read initial value from a different key in the incoming data (defaults to name) */
  mapFrom?: string
  /** Write submit value to a different key in the payload (defaults to name) */
  mapTo?: string
  /** Key to extract from object or array of objects. Useful for mapping arrays of objects to simple values. */
  valueKey?: string
  /** Alias for valueKey */
  key?: string
  /** Format raw value before passing to form state */
  format?: (value: any, rawValues: Record<string, any>) => any
  /** Transform form value before submitting */
  transform?: (value: any, formValues: Record<string, any>) => any
  /** Field label - can be string or Vue component */
  label?: string | Component
  /** I18n translation key for the label */
  labelI18n?: string
  /** Placeholder text */
  placeholder?: string
  /** I18n translation key for the placeholder */
  placeholderI18n?: string
  /** Field type - determines which component renders */
  type?: IFormFieldType
  /** Initial/default value - can be static or function */
  value?: any | (() => any)
  /** Additional props passed to field component */
  props?: Record<string, any>
  /** CSS class for the field item wrapper */
  itemClass?: string
  /** CSS class for the input element */
  className?: string
  /** Left icon (for inputs) */
  icon?: string
  /** Right icon (for inputs) */
  iconRight?: string
  /** Mark field as required */
  required?: boolean
  /** Disabled state - boolean or conditional function */
  disabled?: IFormDisabled
  /** Readonly state - boolean or conditional function */
  readonly?: IFormDisabled
  /** Left addon — plain text or an addon config object (select/button) */
  addonLeft?: string | IFormAddon
  /** Right addon — plain text or an addon config object (select/button) */
  addonRight?: string | IFormAddon
  /** Options for select/multiSelect/dropdown fields */
  options?: IDropdownOptions
  /** Validation function - returns error message or empty string */
  validation?: IFormValidation
  /** UpdateValues - called when field changes, returns new values object */
  updateValues?: IFormUpdateValues
  /** When condition - shows/hides field based on form state */
  when?: IFormWhen
  /** Mark as sensitive (e.g., for masking) */
  isSensitiveField?: boolean
  /** Min value for number inputs */
  min?: number
  /** Max value for number inputs */
  max?: number
  /** Maximum file size in MB for file/avatar uploads */
  maxFileSize?: number
  /** Maximum number of files allowed when multiple is true */
  maxFiles?: number
  /** Return file values as objects { fileName, fileUrl, fileType, fileSize } instead of string URLs */
  returnFileObject?: boolean
}

/**
 * Timeline step for multi-step forms
 */
export interface IFormStep {
  id: number | string
  title: string
  icon?: string
  description?: string
}

/**
 * Form component props
 */
export interface IFormProps {
  /** Schema - single array or grouped arrays */
  schema: IForm[] | IForm[][]
  /** Initial/bound values */
  values?: Record<string, any>
  /** Input variant applied to all fields */
  variant?: InputVariant
  /** Input size applied to all fields */
  size?: InputSize
  /** Input rounded applied to all fields */
  rounded?: InputRounded
  /** Loading state during submit */
  loading?: boolean
  /** Show/hide default footer with submit button */
  footer?: boolean
  /** Grid columns (number or tailwind class) */
  columns?: number | string
  /** Headings for grouped schemas */
  groupsHeadings?: string[]
  /** Descriptions for grouped schemas */
  groupHeadingsDescription?: string[]
  /** Timeline steps for multi-step form mode */
  tabs?: IFormStep[]
  /** Submit button text */
  submitText?: string
  /** Cancel button text */
  cancelText?: string
  /** Show cancel button */
  showCancel?: boolean
  /** Whether this is an update operation */
  isUpdate?: boolean
  /** Folder ID for file uploads */
  folderId?: string
  /** Custom class for form element */
  class?: string
  /** Custom class for the grid layout (overrides columns) */
  gridClass?: string
  /** Custom class for group containers */
  groupClass?: string
  /** Custom class for group/step headers */
  headerClass?: string
  /** Custom class for the footer area */
  footerClass?: string
  /** Fields to explicitly include in the submit payload (e.g., ['__typename', 'id']) */
  emitFields?: string[]
}

/**
 * Form submit payload
 */
export interface IFormSubmitPayload {
  values: Record<string, any>
  isUpdate?: boolean
}

/**
 * Field change payload
 */
export interface IFormFieldChangePayload {
  value: any
  data?: any
}
