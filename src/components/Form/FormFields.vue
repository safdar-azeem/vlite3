<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import type { IForm, IFormFieldChangePayload } from './types'
import type { InputVariant, InputSize, InputRounded } from '@/types'
import { getNestedValue, isComponent } from './utils/form.utils'
import Label from '@/components/Label.vue'
import FormField from './FormField.vue'
import { $t } from '@/utils/i18n'

interface Props {
  schema: IForm[]
  values: Record<string, any>
  errors: Record<string, string>
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  className?: string
  isUpdate?: boolean
  showRequiredAsterisk?: boolean
  /** Function to check if field is visible */
  isFieldVisible?: (field: IForm) => boolean
  /** Function to check if field is disabled */
  isFieldDisabled?: (field: IForm) => boolean
  /** Function to check if field is readonly */
  isFieldReadonly?: (field: IForm) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  columns: 1,
  isUpdate: false,
  showRequiredAsterisk: true,
})

const emit = defineEmits<{
  (e: 'change', name: string, payload: IFormFieldChangePayload): void
  (e: 'addonAction', action: string): void
}>()

// Grid class for layout
const className = computed(() => {
  if (props.className) return props.className
})

// Get value for a field
const getFieldValue = (field: IForm): any => {
  return getNestedValue(props.values, field.name)
}

// Get error for a field
const getFieldError = (field: IForm): string => {
  return props.errors[field.name] || ''
}

// Check if field should be visible
const checkFieldVisible = (field: IForm): boolean => {
  if (props.isFieldVisible) {
    return props.isFieldVisible(field)
  }
  return true
}

// Check if field is disabled
const checkFieldDisabled = (field: IForm): boolean => {
  if (props.isFieldDisabled) {
    return props.isFieldDisabled(field)
  }
  return field.disabled === true
}

// Check if field is readonly
const checkFieldReadonly = (field: IForm): boolean => {
  if (props.isFieldReadonly) {
    return props.isFieldReadonly(field)
  }
  return field.readonly === true
}

// Get the translated or direct label for the field
const getFieldLabel = (field: IForm) => {
  if (field.labelI18n) return $t(field.labelI18n)
  return field.label
}

// Render label as component or string
const renderLabel = (label: string | Component | undefined): string | Component | undefined => {
  if (!label) return undefined
  if (isComponent(label)) return label as Component
  return label as string
}

// Handle field change
const handleFieldChange = (field: IForm, payload: IFormFieldChangePayload) => {
  emit('change', field.name, payload)
}

// Get item class for field (for grid column span)
const getItemClass = (field: IForm): string => {
  return field.itemClass || ''
}

// Handle addon value change (propagate as a regular field change)
const handleAddonChange = (addonName: string, payload: IFormFieldChangePayload) => {
  emit('change', addonName, payload)
}

// Handle addon action (e.g. button click)
const handleAddonAction = (action: string) => {
  emit('addonAction', action)
}

// Support for floating labels for non-input components
const focusedFields = ref<Record<string, boolean>>({})

const handleFocusIn = (fieldName: string) => {
  focusedFields.value[fieldName] = true
}

const handleFocusOut = (fieldName: string) => {
  focusedFields.value[fieldName] = false
}

const isFloatingActive = (field: IForm) => {
  const val = getFieldValue(field)
  const hasValue =
    val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)
  const hasNumericValue = typeof val === 'number' && !isNaN(val)

  // For native inputs (text, number, etc), float the label when focused
  if (delegatesFloatingLabel(field) || field.type === 'number') {
    return focusedFields.value[field.name] || hasValue || hasNumericValue
  }

  // For custom trigger-based components (DatePicker, Dropdown, FilePicker),
  // labels should ONLY float when there is an actual value, not on focus.
  return hasValue || hasNumericValue
}

const delegatesFloatingLabel = (field: IForm) => {
  const type = field.type || 'text'
  return ['text', 'email', 'password', 'tel', 'url', 'search', 'textarea'].includes(type as string)
}

const getFloatingLeftClass = (field: IForm) => {
  // Split number input: space for the left minus button
  if (field.type === 'number') {
    const numVariant = field.props?.variant ?? 'split'
    // Only split has a left-side button; stacked/ghost do not
    return numVariant === 'split' ? 'left-4' : 'left-3'
  }
  // DatePicker and ColorPicker have icons/previews hardcoded at left-3
  if (field.type === 'date' || field.type === 'time' || field.type === 'color') {
    return 'left-10'
  }
  return 'left-3'
}

const shouldHideExternalLabel = (field: IForm) => {
  if (props.variant !== 'floating') return false
  const type = field.type || 'text'
  const unfloatingTypes = [
    'switch',
    'check',
    'customFields',
    'avatarUpload',
    'fileUploader',
    'file',
  ]
  return !unfloatingTypes.includes(type as string)
}

const getSafeLabel = (field: IForm) => {
  const label = getFieldLabel(field)
  if (!label || isComponent(label)) return undefined
  return label as string
}
</script>

<template>
  <div :class="['grid', variant === 'floating' ? 'gap-5 mt-1' : 'gap-4', className]">
    <template v-for="field in schema" :key="field.name">
      <div v-if="checkFieldVisible(field)" :class="['form-field-item', getItemClass(field)]">
        <Label
          v-if="
            getFieldLabel(field) &&
            field.type !== 'switch' &&
            field.type !== 'check' &&
            field.type !== 'customFields' &&
            !shouldHideExternalLabel(field)
          "
          :for="field.name"
          class="mb-2 block text-sm font-medium">
          <component
            v-if="isComponent(getFieldLabel(field))"
            :is="renderLabel(getFieldLabel(field))" />
          <template v-else>
            {{ getFieldLabel(field) }}
            <span v-if="field.required && showRequiredAsterisk" class="text-destructive ml-0.5"
              >*</span
            >
          </template>
        </Label>

        <div
          class="relative"
          :class="['switch', 'check'].includes(field.type as string) ? 'w-auto' : 'w-full'"
          @focusin="handleFocusIn(field.name)"
          @focusout="handleFocusOut(field.name)">
          <label
            v-if="
              shouldHideExternalLabel(field) &&
              getSafeLabel(field) &&
              !delegatesFloatingLabel(field)
            "
            :for="field.name"
            :class="[
              'absolute transition-all duration-200 ease-in-out pointer-events-none z-20',
              isFloatingActive(field)
                ? `-top-2.5 left-3 text-xs bg-background px-1 text-black shadow-[0_4px_4px_-4px_bg-background]`
                : `top-1/2 -translate-y-1/2 text-sm text-muted-foreground/70 ${getFloatingLeftClass(field)}`,
            ]">
            <component
              v-if="isComponent(getFieldLabel(field))"
              :is="renderLabel(getFieldLabel(field))" />
            <template v-else>
              {{ getFieldLabel(field) }}
              <span v-if="field.required" class="text-destructive ml-0.5">*</span>
            </template>
          </label>

          <FormField
            :field="
              props.variant === 'floating'
                ? {
                    ...field,
                    placeholder: undefined,
                    placeholderI18n: undefined,
                    props: { ...(field.props || {}), id: field.name },
                  }
                : { ...field, props: { ...(field.props || {}), id: field.name } }
            "
            :value="getFieldValue(field)"
            :floatingActive="isFloatingActive(field)"
            :label="
              field.type === 'customFields'
                ? undefined
                : shouldHideExternalLabel(field)
                  ? getSafeLabel(field)
                  : undefined
            "
            :values="values"
            :variant="variant"
            :size="size"
            :rounded="rounded"
            :disabled="checkFieldDisabled(field)"
            :readonly="checkFieldReadonly(field)"
            :error="getFieldError(field)"
            :isUpdate="isUpdate"
            @change="(payload) => handleFieldChange(field, payload)"
            @addonChange="handleAddonChange"
            @addonAction="handleAddonAction" />
        </div>

        <Label
          v-if="getFieldLabel(field) && (field.type === 'switch' || field.type === 'check')"
          :for="field.name"
          class="ml-2 text-sm font-medium cursor-pointer">
          {{ getFieldLabel(field) }}
          <span v-if="field.required" class="text-destructive ml-0.5">*</span>
        </Label>

        <p v-if="getFieldError(field)" class="mt-1 text-sm text-destructive">
          {{ getFieldError(field) }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.form-field-item {
  display: flex;
  flex-direction: column;
}

/* Handle switch/checkbox inline layout */
.form-field-item:has([role='switch']),
.form-field-item:has([role='checkbox']) {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>
