import type { IForm, IFormAddon, IFormContext, IFormDisabled, IFormWhen, IFormFieldType } from '../types'

/**
 * Helper: check if an addon definition is an object config (not a plain string)
 */
export function isAddonObject(addon: string | IFormAddon | undefined): addon is IFormAddon {
  return !!addon && typeof addon === 'object'
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
 * Resolves the dynamic field type evaluator (if present) to return the actual field type component or string
 */
export function resolveFieldType(
  field: IForm,
  context: IFormContext
): IFormFieldType | undefined {
  if (typeof field.type === 'function' && !isComponent(field.type)) {
    try {
      return (field.type as Function)(context)
    } catch (e) {
      console.error(`[vlite3/Form] Error evaluating dynamic type for field "${field.name}":`, e)
      return 'text' // Fallback to prevent crash
    }
  }
  return field.type as IFormFieldType | undefined
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
 * Updated to support Async format handlers cleanly without race conditions.
 */
export async function initializeFormValues(
  schema: IForm[] | IForm[][],
  initialValues?: Record<string, any>,
  globalValuesContext?: Record<string, any>,
  isUpdateContext?: boolean
): Promise<Record<string, any>> {
  let values: Record<string, any> = initialValues ? deepClone(initialValues) : {}
  const globalValues = globalValuesContext || values

  // Flatten schema if grouped
  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])

  for (const field of flatSchema) {
    if (!field.name) continue

    const context = { values, globalValues, isUpdate: isUpdateContext }

    // Evaluate 'when' condition during initialization to prevent hidden fields from seeding defaults
    if (field.when) {
      const isVisible = evaluateConditional(field.when, context)
      if (!isVisible) continue
    }

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
        existingValue = await field.format(existingValue, initialValues || {})
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
    
    // Support nested CustomFields formatting recursively
    if (resolveFieldType(field, context) === 'customFields' && field.props?.schema) {
      const nestedSchema = field.props.schema as IForm[]
      let nestedValues = getNestedValue(values, field.name)
      if (Array.isArray(nestedValues) && nestedValues.length > 0) {
        const initializedArray = await Promise.all(
          nestedValues.map((item) => initializeFormValues(nestedSchema, item, globalValues, isUpdateContext))
        )
        Object.assign(values, setNestedValue(values, field.name, initializedArray))
      }
    }
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
 * Returns true if a string value is a base64 data URI that needs uploading.
 * Blob object URLs (blob:...) are local references and should NOT be uploaded
 * via the service — they are preview-only and will be replaced by a re-upload
 * from the original File object if needed.
 */
function isBase64DataUri(val: any): boolean {
  return typeof val === 'string' && val.startsWith('data:image/')
}

/**
 * Collect file fields from schema that need upload processing.
 *
 * Extended to handle `thumbnailSelector` fields:
 *   - The field value is { images: string[], thumbnail: string | null }
 *   - Each image URL that is a base64 data URI is collected for upload
 *   - After upload the images array and thumbnail are updated with resolved URLs
 */
export function collectFileFields(
  schema: IForm[] | IForm[][],
  values: Record<string, any>,
  globalValuesContext?: Record<string, any>,
  isUpdateContext?: boolean
): Array<{ name: string; value: any; type: string; field: IForm }> {
  const fileFields: Array<{ name: string; value: any; type: string; field: IForm }> = []
  const globalValues = globalValuesContext || values

  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])

  for (const field of flatSchema) {
    if (!field.name) continue

    const context = { values, globalValues, isUpdate: isUpdateContext }

    // Do not collect files from hidden fields
    if (field.when) {
      const isVisible = evaluateConditional(field.when, context)
      if (!isVisible) continue
    }

    const fieldType = resolveFieldType(field, context)
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

    /**
     * ThumbnailSelector: collect the whole { images, thumbnail } object.
     * processFileUploads in useForm.ts handles uploading individual base64 images
     * within the object and reconstructing the { images, thumbnail } with resolved URLs.
     */
    if (fieldType === 'thumbnailSelector') {
      const value = getNestedValue(values, field.name)
      if (value && typeof value === 'object') {
        const hasBase64Images = Array.isArray(value.images) &&
          value.images.some((img: any) => isBase64DataUri(img))
        if (hasBase64Images) {
          fileFields.push({
            name: field.name,
            value,
            type: 'thumbnailSelector',
            field,
          })
        }
      }
    }

    // Check customFields for nested file fields
    if (fieldType === 'customFields' && field.props?.schema) {
      const customFieldsValue = getNestedValue(values, field.name)
      if (Array.isArray(customFieldsValue)) {
        const nestedSchema = field.props.schema as IForm[]
        const nestedFileFields = nestedSchema.filter((f) => {
          // Fast preliminary check before evaluating type per row
          return !isComponent(f.type) 
        })

        if (nestedFileFields.length > 0) {
          customFieldsValue.forEach((item, index) => {
            nestedFileFields.forEach((fileField) => {
              const rowContext = { values: item || {}, globalValues, isUpdate: isUpdateContext }
              
              if (fileField.when) {
                const isVisible = evaluateConditional(fileField.when, rowContext)
                if (!isVisible) return
              }

              const nestedFieldType = resolveFieldType(fileField, rowContext)
              if (nestedFieldType === 'file' || nestedFieldType === 'avatarUpload' || nestedFieldType === 'fileUploader') {
                const value = item?.[fileField.name]
                if (value) {
                  fileFields.push({
                    name: `${field.name}.${index}.${fileField.name}`,
                    value,
                    type: nestedFieldType as string,
                    field: fileField,
                  })
                }
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
 * Resolve the canonical empty value for a given field type so that explicitly
 * clearing a field during an update sends the correct signal to the backend
 * (Prisma / Postgres) instead of omitting the key from the payload.
 *
 * Rules:
 * - multiSelect       → []    (empty array, required by array columns)
 * - thumbnailSelector → { images: [], thumbnail: null }
 * - select            → null  (foreign key / enum column)
 * - switch/check      → false
 * - number            → null
 * - everything else (text, email, …) → null
 */
function resolveEmptyValue(field: IForm, context: IFormContext): any {
  const type = resolveFieldType(field, context) as string | undefined

  if (type === 'multiSelect') return []
  if (type === 'thumbnailSelector') return { images: [], thumbnail: null }
  if (type === 'switch' || type === 'check') return false
  return null
}

/**
 * Returns true when a value is considered "empty" for submission purposes:
 * undefined, null, empty string, or an empty array.
 */
function isEmptyValue(val: any): boolean {
  if (val === undefined || val === null || val === '') return true
  if (Array.isArray(val) && val.length === 0) return true
  return false
}

/**
 * Recursively strips the given field keys from an object and all nested objects/arrays.
 */
function stripFields(obj: any, fields: string[]): void {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach((item) => stripFields(item, fields))
  } else {
    for (const key of fields) {
      delete obj[key]
    }
    for (const key in obj) {
      stripFields(obj[key], fields)
    }
  }
}

/**
 * Cleans the submit payload by extracting only schema fields,
 * stripping emitFields (e.g. GraphQL __typename) from the payload recursively,
 * and removing ignoreFields. Also processes mapped output and transformation functions.
 *
 * emitFields: fields to STRIP from the payload (e.g. ['__typename']).
 * Default is ['__typename'] — this removes GraphQL metadata from all nested objects.
 *
 * KEY BEHAVIOUR (fix for Prisma / Postgres sync on updates):
 * A field is included in the payload only when:
 * 1. It has a non-empty value — always included (create & update).
 * 2. It is empty AND the field key already existed in the original `values`
 * object — meaning the user explicitly cleared a pre-existing value during
 * an update. In this case the canonical empty value (`[]` for multiSelect,
 * `null` for everything else) is sent so the backend overwrites the old data.
 *
 * Fields that were never filled in (key absent from `values`) are silently
 * omitted to keep create payloads lean.
 */
export async function cleanSubmitValues(
  values: Record<string, any>,
  schema: IForm[] | IForm[][],
  emitFields?: string[],
  ignoreFields?: string[],
  globalValuesContext?: Record<string, any>,
  isUpdateContext?: boolean
): Promise<Record<string, any>> {
  // Start with a clone of all values to preserve fields injected via updateValues
  const result: Record<string, any> = deepClone(values)
  const globalValues = globalValuesContext || values

  const flatSchema = Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])
  
  // PRE-CALCULATE VISIBILITY TO SUPPORT SAME-NAME FIELDS
  // This ensures that if multiple schema entries share the same name (mutually exclusive fields),
  // a hidden entry doesn't accidentally delete the value provided by a visible one.
  const visibleFields = new Set<string>()
  for (const field of flatSchema) {
    if (!field.name) continue
    const context = { values, globalValues, isUpdate: isUpdateContext }
    if (!field.when || evaluateConditional(field.when, context)) {
      visibleFields.add(field.name)
    }
  }

  // emitFields are fields to STRIP from the final payload (e.g. __typename from GraphQL responses)
  const fieldsToStrip = emitFields || []
  const fieldsToIgnore = ignoreFields || []

  for (const field of flatSchema) {
    if (!field.name) continue

    const context = { values, globalValues, isUpdate: isUpdateContext }

    // Strip hidden fields from the final payload
    if (field.when) {
      const isVisible = evaluateConditional(field.when, context)
      if (!isVisible) {
        // Only delete from result if NO OTHER entry for this name is visible in the entire schema.
        // This allows same-named fields to function correctly when mutually exclusive.
        if (!visibleFields.has(field.name)) {
          delete result[field.name]
        }
        continue
      }
    }

    let val = getNestedValue(values, field.name)

    // Determine whether the field key was present in the submitted values at all.
    // We check the top-level key (first segment of a dot-notation path) so that
    // nested paths like "pricing.amount" are treated as present when "pricing" exists.
    const topLevelKey = field.name.split('.')[0]
    const fieldKeyExistsInValues = Object.prototype.hasOwnProperty.call(values, topLevelKey)

    const fieldType = resolveFieldType(field, context)

    if (isEmptyValue(val)) {
      // Only carry the explicit empty value forward when the key was already
      // present — i.e. the user cleared a value that existed before (update).
      // If the key was never in the values object, skip it entirely (create).
      if (!fieldKeyExistsInValues) {
        // Only delete if no other instance of this field is visible and providing a value.
        if (!visibleFields.has(field.name)) {
          delete result[field.name]
        }
        continue
      }
      val = resolveEmptyValue(field, context)
    }

    val = deepClone(val) // Prevent mutation of original form values

    if (fieldType === 'customFields' && field.props?.schema && Array.isArray(val)) {
      const nestedSchema = field.props.schema as IForm[]
      // Re-map cleanly with Promise.all for independent rows
      val = await Promise.all(val.map((item: any) => cleanSubmitValues(item, nestedSchema, emitFields, ignoreFields, globalValues, isUpdateContext)))
    }

    // Apply transform for submit payload - Now supports async explicitly
    if (field.transform) {
      val = await field.transform(val, values)
    }

    const targetName = field.mapTo || field.name
    
    // If we are mapping to a different key, handle the relocation
    if (targetName !== field.name) {
      delete result[field.name]
      Object.assign(result, setNestedValue(result, targetName, val))
    } else {
      // Standard passthrough overwrite to ensure correctly processed nested arrays persist
      Object.assign(result, setNestedValue(result, field.name, val))
    }
  }

  // Strip emitFields (e.g. __typename) recursively from the entire result tree
  if (fieldsToStrip.length > 0) {
    stripFields(result, fieldsToStrip)
  }

  // Strip ignoreFields recursively
  if (fieldsToIgnore.length > 0) {
    stripFields(result, fieldsToIgnore)
  }

  return result
}
