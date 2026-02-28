<script setup lang="ts">
import { computed, type Component } from 'vue'
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
</script>

<template>
  <div class="grid gap-4" :class="className">
    <template v-for="field in schema" :key="field.name">
      <div v-if="checkFieldVisible(field)" :class="['form-field-item', getItemClass(field)]">
        <Label
          v-if="
            getFieldLabel(field) &&
            field.type !== 'switch' &&
            field.type !== 'check' &&
            field.type !== 'customFields'
          "
          :for="field.name"
          class="mb-2 block text-sm font-medium">
          <component v-if="isComponent(getFieldLabel(field))" :is="renderLabel(getFieldLabel(field))" />
          <template v-else>
            {{ getFieldLabel(field) }}
            <span v-if="field.required" class="text-destructive ml-0.5">*</span>
          </template>
        </Label>

        <FormField
          :field="field"
          :value="getFieldValue(field)"
          :label="field.type === 'customFields' ? getFieldLabel(field) : undefined"
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
}
</style>
