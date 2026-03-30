import { getStatusColorClass } from '@/utils/status'

/**
 * Resolves a dot-notation path from a nested object.
 * e.g. getObjectValue('location.city', data) => 'New York'
 */
export function getObjectValue(path: string, obj: Record<string, any>): any {
  if (!path || !obj) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

export { getStatusColorClass }

export function formatNumber(value: any): string {
  const num = Number(value)
  if (isNaN(num)) return String(value ?? '--')
  return new Intl.NumberFormat('en-US').format(num)
}
