import type { IForm, IFormAddon, IFormContext, IFormDisabled, IFormWhen } from '../types'

/**
 * Helper: check if an addon definition is an object config (not a plain string)
 */
export function isAddonObject(addon: string | IFormAddon | undefined): addon is IFormAddon {
  return !!addon && typeof addon === 'object'
}

/**
 * Get a nested value from an object using dot notation path
 * @example getNestedValue({ pricing: { amount: 100 } }, 'pricing.amount') => 100
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!path || !obj) return undefined

  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) return undefined
    result = result[key]
  }

  return result
}

/**
 * Set a nested value in an object using dot notation path (immutable)
 * @example setNestedValue({ pricing: { amount: 100 } }, 'pricing.discount', 10)
 * => { pricing: { amount: 100, discount: 10 } }
 */
export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> {
  if (!path) return obj

  const keys = path.split('.')
  const result = { ...obj }

  let current = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (Array.isArray(current[key])) {
      current[key] = [...current[key]]
    } else {
      current[key] = current[key] ? { ...current[key] } : {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
  return result
}

/**
 * Seed a single addon's default value into the values object (if not already set)
 */
function seedAddonValue(
  values: Record<string, any>,
  addon: string | IFormAddon | undefined
): Record<string, any> {
  if (!isAddonObject(addon)) return values
  if (!addon.name) return values

  const existing = getNestedValue(values, addon.name)
  if (existing === undefined && addon.value !== undefined) {
    return setNestedValue(values, addon.name, addon.value)
  }
  return values
}

/**
 * Initialize form values from schema and optional initial values
 */
export function initializeFormValues(
  schema: IForm[] | IForm[][],
  initialValues?: Record<string, any>
): Record<string, any> {
  let values: Record<string, any> = initialValues ? deepClone(initialValues) : {}

  // Flatten schema if grouped
  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])

  for (const field of flatSchema) {
    if (!field.name) continue

    const sourceName = field.mapFrom || field.name
    let existingValue = initialValues ? getNestedValue(initialValues, sourceName) : undefined

    // Apply smart formatting if value exists
    if (existingValue !== undefined && existingValue !== null) {
      const extractionKey = field.valueKey || field.key
      if (extractionKey) {
        if (Array.isArray(existingValue)) {
          existingValue = existingValue.map((item: any) =>
            item && typeof item === 'object' ? getNestedValue(item, extractionKey) : item
          )
        } else if (typeof existingValue === 'object') {
          existingValue = getNestedValue(existingValue, extractionKey)
        }
      }

      if (field.format) {
        existingValue = field.format(existingValue, initialValues || {})
      }
    }

    // Seed value
    if (existingValue === undefined) {
      // If we didn't find anything from source, try fallback to field.name if mapFrom was used
      // This helps if they passed a partially constructed object
      if (field.mapFrom && initialValues) {
        const fallbackValue = getNestedValue(initialValues, field.name)
        if (fallbackValue !== undefined) {
          existingValue = fallbackValue
        }
      }

      if (existingValue === undefined) {
        const defaultValue = typeof field.value === 'function' ? field.value() : field.value
        if (defaultValue !== undefined) {
          Object.assign(values, setNestedValue(values, field.name, defaultValue))
        }
      } else {
        Object.assign(values, setNestedValue(values, field.name, existingValue))
      }
    } else {
      Object.assign(values, setNestedValue(values, field.name, existingValue))
    }

    // Seed addon default values
    values = seedAddonValue(values, field.addonLeft)
    values = seedAddonValue(values, field.addonRight)
  }

  return values
}

/**
 * Evaluate a conditional (disabled/readonly/when) function or boolean
 */
export function evaluateConditional(
  condition: IFormDisabled | IFormWhen | undefined,
  context: IFormContext
): boolean {
  if (condition === undefined) return false
  if (typeof condition === 'boolean') return condition
  if (typeof condition === 'function') return condition(context)
  return false
}

/**
 * Filter out null/empty entries from customFields array value
 */
export function filterNullCustomFields(
  value: Record<string, any>[] | undefined,
  schema: IForm[]
): Record<string, any>[] {
  if (!Array.isArray(value)) return []

  return value.filter((item) => {
    if (!item) return false

    // Check if all schema field values are null/undefined/empty
    const allEmpty = schema.every((field) => {
      const fieldValue = item[field.name]
      return fieldValue === null || fieldValue === undefined || fieldValue === ''
    })

    return !allEmpty
  })
}

/**
 * Collect file fields from schema that need upload processing
 */
export function collectFileFields(
  schema: IForm[] | IForm[][],
  values: Record<string, any>
): Array<{ name: string; value: any; type: string; field: IForm }> {
  const fileFields: Array<{ name: string; value: any; type: string; field: IForm }> = []

  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])

  for (const field of flatSchema) {
    if (!field.name) continue

    const fieldType = field.type
    if (fieldType === 'file' || fieldType === 'avatarUpload' || fieldType === 'fileUploader') {
      const value = getNestedValue(values, field.name)
      if (value) {
        fileFields.push({
          name: field.name,
          value,
          type: fieldType as string,
          field,
        })
      }
    }

    // Check customFields for nested file fields
    if (fieldType === 'customFields' && field.props?.schema) {
      const customFieldsValue = getNestedValue(values, field.name)
      if (Array.isArray(customFieldsValue)) {
        const nestedSchema = field.props.schema as IForm[]
        const nestedFileFields = nestedSchema.filter(
          (f) => f.type === 'file' || f.type === 'avatarUpload' || f.type === 'fileUploader'
        )

        if (nestedFileFields.length > 0) {
          customFieldsValue.forEach((item, index) => {
            nestedFileFields.forEach((fileField) => {
              const value = item?.[fileField.name]
              if (value) {
                fileFields.push({
                  name: `${field.name}.${index}.${fileField.name}`,
                  value,
                  type: fileField.type as string,
                  field: fileField,
                })
              }
            })
          })
        }
      }
    }
  }

  return fileFields
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof File) return obj // Files should not be cloned
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as T

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ;(cloned as any)[key] = deepClone((obj as any)[key])
    }
  }
  return cloned
}

/**
 * Get field key for errors/tracking (handles dot notation)
 */
export function getFieldKey(name: string): string {
  return name.replace(/\./g, '_')
}

/**
 * Check if a value is a Vue component
 */
export function isComponent(value: any): boolean {
  if (!value) return false
  // Vue components are objects with render function or template
  return (
    typeof value === 'object' &&
    (typeof value.render === 'function' ||
      typeof value.setup === 'function' ||
      value.__name !== undefined ||
      value.name !== undefined)
  )
}

/**
 * Cleans the submit payload by extracting only schema fields,
 * injecting specified emitFields, and removing ignoreFields recursively.
 * Also processes mapped output and transformation functions.
 */
export function cleanSubmitValues(
  values: Record<string, any>,
  schema: IForm[] | IForm[][],
  emitFields?: string[],
  ignoreFields?: string[]
): Record<string, any> {
  const isPassthrough = emitFields === undefined && ignoreFields === undefined
  const result: Record<string, any> = isPassthrough ? deepClone(values) : {}

  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])
  const fieldsToEmit = emitFields || []
  const fieldsToIgnore = ignoreFields || []

  for (const field of flatSchema) {
    if (!field.name) continue

    let val = getNestedValue(values, field.name)
    if (val === undefined) continue

    if (field.type === 'customFields' && field.props?.schema && Array.isArray(val)) {
      const nestedSchema = field.props.schema as IForm[]
      val = val.map((item: any) =>
        cleanSubmitValues(item, nestedSchema, emitFields, ignoreFields)
      )
    }

    let needsUpdate = false

    // Apply transform for submit payload
    if (field.transform) {
      val = field.transform(val, values)
      needsUpdate = true
    }

    const targetName = field.mapTo || field.name
    if (targetName !== field.name) {
      needsUpdate = true
      // Cleanup original passthrough key if dynamically relocated top-level
      if (isPassthrough && !field.name.includes('.')) {
        delete result[field.name]
      }
    }

    if (!isPassthrough || needsUpdate) {
      Object.assign(result, setNestedValue(result, targetName, val))
    } else {
      // Standard passthrough overwrite to ensure correctly processed nested arrays persist
      Object.assign(result, setNestedValue(result, field.name, val))
    }
  }

  if (fieldsToEmit.length > 0) {
    const injectEmits = (source: any, target: any) => {
      if (!source || typeof source !== 'object') return
      if (!target || typeof target !== 'object') return

      if (Array.isArray(source) && Array.isArray(target)) {
        source.forEach((sItem, i) => {
          if (target[i]) injectEmits(sItem, target[i])
        })
      } else {
        for (const key of fieldsToEmit) {
          if (source[key] !== undefined && target[key] === undefined) {
            target[key] = deepClone(source[key])
          }
        }
        for (const key in target) {
          if (typeof target[key] === 'object' && typeof source[key] === 'object') {
            injectEmits(source[key], target[key])
          }
        }
      }
    }

    for (const key of fieldsToEmit) {
      if (values[key] !== undefined && result[key] === undefined) {
        result[key] = deepClone(values[key])
      }
    }

    injectEmits(values, result)
  }

  if (fieldsToIgnore.length > 0) {
    const removeIgnores = (obj: any) => {
      if (!obj || typeof obj !== 'object') return
      if (Array.isArray(obj)) {
        obj.forEach(removeIgnores)
      } else {
        for (const key of fieldsToIgnore) {
          delete obj[key]
        }
        for (const key in obj) {
          removeIgnores(obj[key])
        }
      }
    }
    removeIgnores(result)
  }

  return result
}

