import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import type { IForm, IFormContext, IFormSubmitPayload } from '../types'
import {
  getNestedValue,
  setNestedValue,
  initializeFormValues,
  evaluateConditional,
  filterNullCustomFields,
  collectFileFields,
  deepClone,
} from '../utils/form.utils'
import { useFileUpload } from './useFileUpload'

export interface UseFormOptions {
  schema: IForm[] | IForm[][]
  values?: Record<string, any>
  isUpdate?: boolean
  folderId?: string
  onSubmit?: (payload: IFormSubmitPayload) => void | Promise<void>
}

export interface UseFormReturn {
  /** Current form values */
  formValues: Ref<Record<string, any>>
  /** Validation errors by field name */
  errors: Ref<Record<string, string>>
  /** Whether form is currently submitting */
  isSubmitting: Ref<boolean>
  /** Whether form has been modified */
  isDirty: Ref<boolean>
  /** Handle field value change */
  handleFieldChange: (name: string, value: any, data?: any) => void
  /** Validate a single field */
  validateField: (field: IForm) => string
  /** Validate all fields */
  validateAll: () => boolean
  /** Check if field is visible */
  isFieldVisible: (field: IForm) => boolean
  /** Check if field is disabled */
  isFieldDisabled: (field: IForm) => boolean
  /** Check if field is readonly */
  isFieldReadonly: (field: IForm) => boolean
  /** Get field value (supports nested paths) */
  getFieldValue: (name: string) => any
  /** Get field error */
  getFieldError: (name: string) => string
  /** Set field error manually */
  setFieldError: (name: string, error: string) => void
  /** Clear all errors */
  clearErrors: () => void
  /** Reset form to initial values */
  resetForm: () => void
  /** Handle form submission */
  handleSubmit: () => Promise<void>
  /** Flattened schema for iteration */
  flatSchema: ComputedRef<IForm[]>
}

/**
 * Main form composable for managing form state, validation, and submission
 */
export function useForm(options: UseFormOptions): UseFormReturn {
  const { schema, values: initialValues, isUpdate = false, folderId, onSubmit } = options
  const { handleUploadFile } = useFileUpload()

  // Initialize form values
  const formValues = ref<Record<string, any>>(initializeFormValues(schema, initialValues))
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)
  const initialSnapshot = ref<Record<string, any>>(deepClone(formValues.value))

  // Flatten schema for easy iteration
  const flatSchema = computed<IForm[]>(() => {
    if (!schema) return []
    return Array.isArray(schema[0]) ? (schema as IForm[][]).flat() : (schema as IForm[])
  })

  // Watch for external value changes
  watch(
    () => initialValues,
    (newValues) => {
      if (newValues) {
        formValues.value = initializeFormValues(schema, newValues)
        initialSnapshot.value = deepClone(formValues.value)
        isDirty.value = false
      }
    },
    { deep: true }
  )

  // Get form context for conditional evaluations
  const getContext = (): IFormContext => ({
    values: formValues.value,
    isUpdate,
  })

  /**
   * Get a field value by name (supports dot notation)
   */
  const getFieldValue = (name: string): any => {
    return getNestedValue(formValues.value, name)
  }

  /**
   * Get field error
   */
  const getFieldError = (name: string): string => {
    return errors.value[name] || ''
  }

  /**
   * Set field error manually
   */
  const setFieldError = (name: string, error: string): void => {
    if (error) {
      errors.value[name] = error
    } else {
      delete errors.value[name]
    }
  }

  /**
   * Clear all errors
   */
  const clearErrors = (): void => {
    errors.value = {}
  }

  /**
   * Check if field should be visible
   */
  const isFieldVisible = (field: IForm): boolean => {
    if (!field.when) return true
    return evaluateConditional(field.when, getContext())
  }

  /**
   * Check if field is disabled
   */
  const isFieldDisabled = (field: IForm): boolean => {
    return evaluateConditional(field.disabled, getContext())
  }

  /**
   * Check if field is readonly
   */
  const isFieldReadonly = (field: IForm): boolean => {
    return evaluateConditional(field.readonly, getContext())
  }

  /**
   * Validate a single field
   */
  const validateField = (field: IForm): string => {
    const value = getFieldValue(field.name)
    let error = ''

    // Required validation
    if (field.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        error = `${field.label || field.name} is required`
      }
    }

    // Custom validation (only if required passed or not required)
    if (!error && field.validation) {
      error = field.validation({
        value,
        values: formValues.value,
        isUpdate,
      })
    }

    // Update error state
    if (error) {
      errors.value[field.name] = error
    } else {
      delete errors.value[field.name]
    }

    return error
  }

  /**
   * Validate all visible fields
   */
  const validateAll = (): boolean => {
    clearErrors()
    let isValid = true

    for (const field of flatSchema.value) {
      // Skip invisible fields
      if (!isFieldVisible(field)) continue
      // Skip disabled fields
      if (isFieldDisabled(field)) continue

      const error = validateField(field)
      if (error) {
        isValid = false
      }
    }

    return isValid
  }

  /**
   * Handle field value change with updateValues cascade
   */
  const handleFieldChange = (name: string, value: any, data?: any): void => {
    // Set the new value
    formValues.value = setNestedValue(formValues.value, name, value)
    isDirty.value = true

    // Clear error for this field
    delete errors.value[name]

    // Find the field in schema
    const field = flatSchema.value.find((f) => f.name === name)

    // Execute updateValues if defined
    if (field?.updateValues) {
      const updatedValues = field.updateValues({
        values: formValues.value,
        data,
        isUpdate,
        updateError: setFieldError,
      })

      if (updatedValues && typeof updatedValues === 'object') {
        formValues.value = { ...formValues.value, ...updatedValues }
      }
    }
  }

  /**
   * Process file uploads before submission
   * Handles both single files and arrays of files (parallel upload)
   */
  const processFileUploads = async (): Promise<Record<string, any>> => {
    const values = deepClone(formValues.value)
    const fileFields = collectFileFields(schema, values)

    // Create a list of promises for each field that needs updating
    // This allows all uploads across all fields to happen in parallel
    const fieldUpdatePromises = fileFields.map(async (fileField) => {
      const { name, value } = fileField

      // CASE 1: Array of files (Multiple)
      if (Array.isArray(value)) {
        // Map the array to a list of promises to upload individual items in parallel
        const itemPromises = value.map(async (item) => {
          // Determine if this specific item needs uploading
          // It needs upload if it's a File object OR a FilePickerValue containing a File
          const needsUpload =
            item instanceof File || (item && typeof item === 'object' && item.file instanceof File)

          if (needsUpload) {
            // Upload and return the new URL
            const url = await handleUploadFile(item, folderId)
            // If upload fails (returns null), we return null (or could keep original if needed, but here assuming fail)
            return url || null
          }

          // If it's already a string (URL) or doesn't match upload criteria, return as is
          return item
        })

        // Wait for all items in this array to finish
        const newArray = await Promise.all(itemPromises)
        
        // Return the update instruction
        return { name, value: newArray }
      }

      // CASE 2: Single Value
      else {
        const needsUpload =
          value instanceof File || (value && typeof value === 'object' && value.file instanceof File)

        if (needsUpload) {
          const url = await handleUploadFile(value, folderId)
          if (url) {
            return { name, value: url }
          }
        }
        
        // No update needed for this field
        return null
      }
    })

    // Wait for ALL field updates to complete
    const updates = await Promise.all(fieldUpdatePromises)

    // Apply the updates to the values object
    updates.forEach((update) => {
      if (update) {
        Object.assign(values, setNestedValue(values, update.name, update.value))
      }
    })

    return values
  }

  /**
   * Clean up customFields values (remove null entries)
   */
  const cleanCustomFieldsValues = (values: Record<string, any>): Record<string, any> => {
    const cleaned = { ...values }

    for (const field of flatSchema.value) {
      if (field.type === 'customFields' && field.props?.schema) {
        const fieldValue = getNestedValue(cleaned, field.name)
        if (Array.isArray(fieldValue)) {
          const filteredValue = filterNullCustomFields(fieldValue, field.props.schema as IForm[])
          Object.assign(cleaned, setNestedValue(cleaned, field.name, filteredValue))
        }
      }
    }

    return cleaned
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (): Promise<void> => {
    // Validate all fields
    const isValid = validateAll()
    if (!isValid) return

    isSubmitting.value = true

    try {
      // Process file uploads
      let processedValues = await processFileUploads()

      // Clean up customFields
      processedValues = cleanCustomFieldsValues(processedValues)

      // Call onSubmit callback
      if (onSubmit) {
        await onSubmit({
          values: processedValues,
          isUpdate,
        })
      }

      // Reset dirty state after successful submit
      isDirty.value = false
      initialSnapshot.value = deepClone(processedValues)
    } catch (error) {
      console.error('[useForm] Submit error:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Reset form to initial values
   */
  const resetForm = (): void => {
    formValues.value = deepClone(initialSnapshot.value)
    clearErrors()
    isDirty.value = false
  }

  return {
    formValues,
    errors,
    isSubmitting,
    isDirty,
    handleFieldChange,
    validateField,
    validateAll,
    isFieldVisible,
    isFieldDisabled,
    isFieldReadonly,
    getFieldValue,
    getFieldError,
    setFieldError,
    clearErrors,
    resetForm,
    handleSubmit,
    flatSchema,
  }
}

