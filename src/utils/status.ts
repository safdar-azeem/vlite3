import { STATUS_MAP } from '@/components/StatusChip/status-map'

const VARIANT_COLOR_MAP: Record<string, string> = {
  success: 'text-success-subtle-fg font-medium',
  info: 'text-info-subtle-fg font-medium',
  warning: 'text-warning-subtle-fg font-medium',
  danger: 'text-danger-subtle-fg font-medium',
  secondary: 'text-muted-foreground',
  teal: 'text-teal-subtle-fg font-medium',
  indigo: 'text-indigo-subtle-fg font-medium',
  cyan: 'text-cyan-subtle-fg font-medium',
  purple: 'text-purple-subtle-fg font-medium',
  orange: 'text-orange-subtle-fg font-medium',
  pink: 'text-pink-subtle-fg font-medium',
}

const EXTRA_STATUS_COLORS: Record<string, string> = {
  high: 'text-danger-subtle-fg font-medium',
  medium: 'text-warning-subtle-fg font-medium',
  low: 'text-muted-foreground',
  yes: 'text-success-subtle-fg font-medium',
  no: 'text-danger-subtle-fg font-medium',
  true: 'text-success-subtle-fg font-medium',
  false: 'text-danger-subtle-fg font-medium',
}

/**
 * Returns a color class based on the status value.
 * Logic is shared across components like List and Invoice.
 */
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
