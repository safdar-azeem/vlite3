export type ListVariant =
  | 'default'
  | 'striped'
  | 'card'
  | 'minimal'
  | 'compact'
  | 'bordered-rows'
  | 'stacked'
export type ListColumns = 1 | 2 | 3

export type ListFieldType =
  | 'text'
  | 'date'
  | 'dateTime'
  | 'time'
  | 'price'
  | 'image'
  | 'badge'
  | 'boolean'
  | 'number'
  | 'html'

/**
 * Controls how the stacked variant renders borders between grid cells.
 *
 * - `'none'`    — No borders between cells (default, stock look).
 * - `'divider'` — Left border on every non-first cell of each row + extra left padding.
 */
export type StackedBorderStyle = 'none' | 'divider'

export interface ListField {
  /** Unique key to resolve value from data (dot-notation supported, e.g. 'location.city') */
  key: string
  /** Display label */
  title?: string
  /** i18n key for the label */
  titleI18n?: string
  /** Iconify icon shown beside label */
  icon?: string
  /** Force item to span full-width row */
  lineByLine?: boolean
  /**
   * Layout mode for the field when it is in block/full-width mode.
   * - `'block'`  — Label on top, value below (default for lineByLine: true or long text).
   * - `'inline'` — Label and value on the same line (standard horizontal row).
   */
  lineByLineLayout?: 'block' | 'inline'
  /** Only render when value is truthy */
  whenTrue?: boolean
  /** Conditional render: receives resolved value and full data, returns boolean */
  when?: (value: any, data: any) => boolean
  /** Custom formatter — receives (value, data), returns a string or HTML string */
  format?: (value: any, data: any) => string
  /** Mask value and show eye-toggle button */
  isSensitive?: boolean
  /** Apply semantic status color to the value */
  addStatusColor?: boolean
  /** A built-in type for automatic rendering */
  type?: ListFieldType
  /** Static class or dynamic class function for the value cell */
  class?: string | ((value: any, data: any) => string)
  /** Render a Vue component instead of a value; receives { data, value } props */
  component?: any
  /** Fallback text when value is empty/null */
  emptyText?: string
}

export interface ListProps {
  /** Array of field definitions (schema) */
  fields: ListField[]
  /** The data record to display */
  data: Record<string, any>
  /** Optional section title */
  title?: string
  /** i18n key for the title */
  titleI18n?: string
  /** Iconify icon shown beside the section title */
  titleIcon?: string
  /** Number of columns for field layout */
  columns?: ListColumns
  /** Visual variant */
  variant?: ListVariant
  /** Extra class on root element */
  class?: string
  /** Show label colon */
  showColon?: boolean
  /** Loading skeleton state */
  loading?: boolean
  /** Number of skeleton rows while loading */
  skeletonRows?: number
  /**
   * Controls border style between cells in the stacked variant.
   * - `'none'`    — No dividers between cells. Default (stock look).
   * - `'divider'` — Left border on non-first cells per row + increased left padding.
   */
  stackedBorderStyle?: StackedBorderStyle
}
