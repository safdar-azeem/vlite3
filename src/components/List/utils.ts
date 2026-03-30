/**
 * Resolves a dot-notation path from a nested object.
 * e.g. getObjectValue('location.city', data) => 'New York'
 */
export function getObjectValue(path: string, obj: Record<string, any>): any {
  if (!path || !obj) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

const STATUS_COLOR_MAP: Record<string, string> = {
  active: 'text-success-dark font-medium',
  inactive: 'text-muted-foreground',
  pending: 'text-warning-dark font-medium',
  completed: 'text-success-dark font-medium',
  cancelled: 'text-danger-dark font-medium',
  failed: 'text-danger-dark font-medium',
  success: 'text-success-dark font-medium',
  error: 'text-danger-dark font-medium',
  warning: 'text-warning-dark font-medium',
  info: 'text-info-dark font-medium',
  high: 'text-danger-dark font-medium',
  medium: 'text-warning-dark font-medium',
  low: 'text-muted-foreground',
  yes: 'text-success-dark font-medium',
  no: 'text-danger-dark font-medium',
  true: 'text-success-dark font-medium',
  false: 'text-danger-dark font-medium',
  enabled: 'text-success-dark font-medium',
  disabled: 'text-muted-foreground',
}

export function getStatusColorClass(value: any): string {
  if (value === null || value === undefined) return ''
  const normalized = String(value)
    .toLowerCase()
    .replace(/[-_\s]/g, '')
  return STATUS_COLOR_MAP[normalized] || ''
}

export function formatNumber(value: any): string {
  const num = Number(value)
  if (isNaN(num)) return String(value ?? '--')
  return new Intl.NumberFormat('en-US').format(num)
}
