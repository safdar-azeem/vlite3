import { STATUS_MAP } from '../StatusChip/status-map'

/**
 * Resolves a dot-notation path from a nested object.
 * e.g. getObjectValue('location.city', data) => 'New York'
 */
export function getObjectValue(path: string, obj: Record<string, any>): any {
  if (!path || !obj) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

const VARIANT_COLOR_MAP: Record<string, string> = {
  success: 'text-success-dark font-medium',
  info: 'text-info-dark font-medium',
  warning: 'text-warning-dark font-medium',
  danger: 'text-danger-dark font-medium',
  secondary: 'text-muted-foreground',
  teal: 'text-teal-subtle-fg font-medium',
  indigo: 'text-indigo-subtle-fg font-medium',
  cyan: 'text-cyan-subtle-fg font-medium',
  purple: 'text-purple-subtle-fg font-medium',
  orange: 'text-orange-subtle-fg font-medium',
  pink: 'text-pink-subtle-fg font-medium',
}

const EXTRA_STATUS_COLORS: Record<string, string> = {
  high: 'text-danger-dark font-medium',
  medium: 'text-warning-dark font-medium',
  low: 'text-muted-foreground',
  yes: 'text-success-dark font-medium',
  no: 'text-danger-dark font-medium',
  true: 'text-success-dark font-medium',
  false: 'text-danger-dark font-medium',
}

export function getStatusColorClass(value: any): string {
  if (value === null || value === undefined) return ''
  const normalized = String(value)
    .toLowerCase()
    .replace(/[-_\s]/g, '')

  if (EXTRA_STATUS_COLORS[normalized]) {
    return EXTRA_STATUS_COLORS[normalized]
  }

  const mappedVariant = STATUS_MAP[normalized]?.variant
  if (mappedVariant && typeof mappedVariant === 'string' && VARIANT_COLOR_MAP[mappedVariant]) {
    return VARIANT_COLOR_MAP[mappedVariant]
  }

  return ''
}

export function formatNumber(value: any): string {
  const num = Number(value)
  if (isNaN(num)) return String(value ?? '--')
  return new Intl.NumberFormat('en-US').format(num)
}
