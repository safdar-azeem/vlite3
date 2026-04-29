import type { IForm } from 'vlite3'
import type { DataFactoryOptions } from './types'
import { extractSchemaFields } from './extractSchemaFields'

/**
 * Generates a mock data object from a vlite3 schema definition.
 *
 * Uses the schema's `type`, `name`, and `options` metadata to produce
 * realistic test values that satisfy common database constraints
 * (unique emails, valid formats, etc.).
 *
 * @example
 * ```typescript
 * import { createDataFactory } from 'vlite3/test'
 * import { customerSchema } from '../schema/crm.schema'
 *
 * // Auto-generate all fields
 * const mockData = createDataFactory(customerSchema)
 *
 * // Override specific fields
 * const specificData = createDataFactory(customerSchema, {
 *   overrides: { status: 'ACTIVE', workspaceName: `ws-${Date.now()}` }
 * })
 * ```
 */
export function createDataFactory(
  schema: IForm[] | IForm[][],
  options?: DataFactoryOptions
): Record<string, any> {
  const uniqueId = options?.uniqueId || Math.random().toString(36).substring(2, 8)
  const overrides = options?.overrides || {}
  const evaluateConditions = options?.evaluateConditions ?? false
  const valuesContext = options?.valuesContext || {}

  const fields = extractSchemaFields(schema)
  const result: Record<string, any> = {}

  for (const field of fields) {
    // Skip fields with `when` conditions if evaluateConditions is true
    if (evaluateConditions && field.when) {
      try {
        if (!field.when({ values: valuesContext })) continue
      } catch {
        // If when evaluation fails, include the field anyway
      }
    }

    const name = field.name

    // Check if there's an override for this field
    if (name in overrides) {
      setNestedValue(result, name, overrides[name])
      continue
    }

    // Generate a value based on the field's schema type
    const value = generateValueForField(field, uniqueId)

    // Skip undefined values (e.g., file fields)
    if (value !== undefined) {
      setNestedValue(result, name, value)
    }
  }

  // Apply any remaining overrides that weren't in the schema
  for (const [key, value] of Object.entries(overrides)) {
    setNestedValue(result, key, value)
  }

  return result
}

/**
 * Generates a smart, type-aware test value for a schema field.
 *
 * Priority order:
 * 1. Field type (email, password, number, time, date, switch, select, etc.)
 * 2. Field name heuristics (contains 'email', 'username', etc.)
 * 3. Default: `Test String {uniqueId}`
 *
 * @internal
 */
function generateValueForField(field: IForm, uniqueId: string): any {
  const fieldType = resolveStaticType(field)
  const lowerName = field.name.toLowerCase()

  // ── File types → skip (cannot be auto-generated) ──
  if (isFileType(fieldType)) return undefined

  // ── Boolean types ──
  if (fieldType === 'switch' || fieldType === 'check') return true

  // ── Select types → pick first available option ──
  if (fieldType === 'select' || fieldType === 'choiceBox') {
    const firstValue = getFirstOptionValue(field)
    if (firstValue !== null) return firstValue
    // Fallback to text generation if no options
    return `Test String ${uniqueId}`
  }

  if (fieldType === 'multiSelect') {
    const firstValue = getFirstOptionValue(field)
    if (firstValue !== null) return [firstValue]
    return []
  }

  // ── Typed fields ──
  if (fieldType === 'email' || lowerName.includes('email')) {
    return `test_${uniqueId}@example.com`
  }

  if (fieldType === 'password' || lowerName.includes('password')) {
    return 'SecurePass123!'
  }

  if (fieldType === 'number') return 42

  if (fieldType === 'time' || lowerName.includes('time')) return '09:00'

  if (fieldType === 'date' || lowerName.includes('date')) return '2026-04-26'

  if (fieldType === 'tags') return [`tag_${uniqueId}`]

  if (fieldType === 'color') return '#4f46e5'

  if (fieldType === 'url' || lowerName.includes('website')) {
    return `https://test-${uniqueId}.example.com`
  }

  if (fieldType === 'tel' || lowerName === 'phone' || lowerName.includes('phonenumber') || lowerName.includes('mobilenumber')) {
    return `+1555${uniqueId.substring(0, 4).replace(/\D/g, '0000').substring(0, 4)}`
  }

  // ── Name-based heuristics ──
  if (field.name === 'workspaceName' || lowerName === 'workspacename') {
    return `ws-${uniqueId}`
  }

  if (field.name === 'username' || lowerName === 'name') {
    return `user_${uniqueId}`
  }

  // ── Textarea / text default ──
  return `Test String ${uniqueId}`
}

/**
 * Resolves the field type to a static string for value generation.
 * Dynamic type functions are not evaluated here — we only use static types.
 */
function resolveStaticType(field: IForm): string | undefined {
  if (!field.type) return undefined
  if (typeof field.type === 'string') return field.type
  // For function/component types, we cannot resolve without context
  return undefined
}

/**
 * Returns whether a field type represents a file upload.
 */
function isFileType(type: string | undefined): boolean {
  if (!type) return false
  return ['file', 'avatarUpload', 'fileUploader'].includes(type)
}

/**
 * Extracts the value of the first option from a select-like field.
 */
function getFirstOptionValue(field: IForm): any | null {
  if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
    return null
  }
  const option = field.options[0]
  return typeof option === 'object' ? option.value : option
}

/**
 * Sets a deeply nested value on an object using dot-notation path.
 * Creates intermediate objects as needed.
 *
 * @example
 * setNestedValue({}, 'location.city', 'NYC')
 * // → { location: { city: 'NYC' } }
 */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value
}
