<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { IForm, IFormFieldChangePayload } from './types'
import type { InputVariant, InputSize, InputRounded } from '@/types'
import FormField from './FormField.vue'
import Button from '@/components/Button.vue'
import Label from '../Label.vue'
import Icon from '@/components/Icon.vue'
import { $t } from '@/utils/i18n'
import { evaluateConditional, setNestedValue, resolveFieldType } from './utils/form.utils'

interface Props {
  name?: string
  modelValue?: Record<string, any>[]
  schema: IForm[]
  headers?: string[]
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  disabled?: boolean
  draggable?: boolean
  minRows?: number
  maxRows?: number
  addButtonText?: string
  textI18n?: string
  label?: string
  labelI18n?: string
  showRowNumbers?: boolean
  /** All form values for context */
  values?: Record<string, any>
  /** Form Validation errors passed down */
  errors?: Record<string, string>
  isUpdate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  headers: () => [],
  errors: () => ({}),
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
  draggable: false,
  minRows: 0,
  addButtonText: 'Add Row',
  showRowNumbers: false,
  isUpdate: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>[]): void
  (e: 'change', value: Record<string, any>[]): void
}>()

const displayLabel = computed(() => (props.labelI18n ? $t(props.labelI18n) : props.label))

// Global i18n Fallbacks for Custom Fields
const displayEmptyTitle = computed(() => {
  const res = $t('vlite.customFields.emptyTitle')
  return res !== 'vlite.customFields.emptyTitle' ? res : 'No items added'
})

const displayEmptyDescription = computed(() => {
  const res = $t('vlite.customFields.emptyDescription')
  return res !== 'vlite.customFields.emptyDescription' ? res : 'Add a new item to get started'
})

// PERFORMANCE: Use shallowRef for arrays of items to prevent deep reactivity performance hits 
// during array transformations and immutability operations.
const rows = shallowRef<(Record<string, any> & { _id: string })[]>([])
const generateId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Sync with modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (Array.isArray(newValue)) {
      // Merge existing rows to preserve _id if possible
      rows.value = newValue.map((row, index) => {
        const existing = rows.value[index]
        return {
          ...row,
          _id: existing?._id || generateId(),
        }
      })
    } else {
      rows.value = []
    }
  },
  { immediate: true, deep: true }
)

const createEmptyRow = (): Record<string, any> & { _id: string } => {
  const row: Record<string, any> = {}
  for (const field of props.schema) {
    const defaultValue = typeof field.value === 'function' ? field.value() : field.value
    row[field.name] = defaultValue ?? null
  }
  return { ...row, _id: generateId() }
}

const addRow = () => {
  if (props.disabled) return
  if (props.maxRows && rows.value.length >= props.maxRows) return
  const newRows = [...rows.value, createEmptyRow()]
  rows.value = newRows
  emitChange(newRows)
}

const removeRow = (index: number) => {
  if (props.disabled) return
  if (rows.value.length <= props.minRows) return
  const newRows = [...rows.value]
  newRows.splice(index, 1)
  rows.value = newRows
  emitChange(newRows)
}

const handleFieldChange = async (
  rowIndex: number,
  fieldName: string,
  payload: IFormFieldChangePayload
) => {
  const newRows = [...rows.value]
  newRows[rowIndex] = {
    ...newRows[rowIndex],
    [fieldName]: payload.value,
  }

  // Handle updateValues for the specific nested field seamlessly
  const field = props.schema.find((f) => f.name === fieldName)
  if (field && field.updateValues) {
    try {
      const rowValues = newRows[rowIndex]
      
      // Global Values: Re-construct global state with the patched array before execution
      let simulatedGlobalValues = { ...(props.values || {}) }
      if (props.name) {
        simulatedGlobalValues = setNestedValue(simulatedGlobalValues, props.name, newRows)
      }

      const updatedValues = await field.updateValues({
        value: payload.value,
        values: rowValues, // strictly local row scope
        globalValues: simulatedGlobalValues, // strictly global root scope
        data: payload.data,
        isUpdate: props.isUpdate,
      })
      
      if (updatedValues && typeof updatedValues === 'object') {
        newRows[rowIndex] = { ...newRows[rowIndex], ...updatedValues }
      }
    } catch (e) {
      console.error(`[CustomFields] Error in updateValues for ${fieldName}:`, e)
    }
  }

  rows.value = newRows
  emitChange(newRows)
}

const handleDragUpdate = (newRows: (Record<string, any> & { _id: string })[]) => {
  rows.value = newRows
  emitChange(newRows)
}

const emitChange = (value: (Record<string, any> & { _id: string })[]) => {
  const cleanValue = value.map(({ _id, ...rest }) => rest)
  emit('update:modelValue', cleanValue)
  emit('change', cleanValue)
}

const getFieldValue = (rowIndex: number, fieldName: string): any => {
  return rows.value[rowIndex]?.[fieldName]
}

const canAddRow = computed(() => {
  if (props.disabled) return false
  if (props.maxRows && rows.value.length >= props.maxRows) return false
  return true
})

const canRemoveRow = computed(() => {
  if (props.disabled) return false
  return rows.value.length > props.minRows
})

const columnHeaders = computed(() => {
  if (props.headers && props.headers.length > 0) return props.headers
  return props.schema.map((field) => {
    return field.labelI18n ? $t(field.labelI18n) : field.label || field.name
  })
})

const getRowContext = (rowIndex: number) => {
  let contextValues = { ...(props.values || {}) }
  if (props.name) {
    contextValues = setNestedValue(contextValues, props.name, rows.value)
  }
  return {
    values: rows.value[rowIndex] || {},
    globalValues: contextValues,
    isUpdate: props.isUpdate
  }
}

const getResolvedType = (field: IForm, rowIndex: number) => {
  return resolveFieldType(field, getRowContext(rowIndex))
}

const isFieldDisabled = (rowIndex: number, field: IForm): boolean => {
  if (props.disabled) return true
  return evaluateConditional(field.disabled, getRowContext(rowIndex))
}

const isFieldReadonly = (rowIndex: number, field: IForm): boolean => {
  return evaluateConditional(field.readonly, getRowContext(rowIndex))
}

const isFieldVisible = (rowIndex: number, field: IForm): boolean => {
  if (!field.when) return true
  return evaluateConditional(field.when, getRowContext(rowIndex))
}

const getRowErrorsHash = (rowIndex: number) => {
  if (!props.errors || !props.name) return ''
  const prefix = `${props.name}.${rowIndex}.`
  return Object.keys(props.errors)
    .filter((k) => k.startsWith(prefix))
    .map((k) => props.errors![k])
    .join(',')
}
</script>

<template>
  <div class="custom-fields-wrapper">
    <div class="flex justify-between items-center mb-2">
      <Label v-if="displayLabel" class="text-sm font-medium text-foreground">
        {{ displayLabel }}
      </Label>
      <Button
        type="button"
        variant="outline"
        size="xs"
        rounded="full"
        icon="lucide:plus"
        :disabled="!canAddRow"
        @click="addRow" />
    </div>

    <div class="custom-fields-table border border-border rounded overflow-hidden bg-background">
      <div
        v-if="columnHeaders.length > 0"
        class="flex border-b border-border bg-muted/50 text-gray-800 text-xs font-semibold uppercase tracking-wider">
        <div v-if="draggable" class="w-10 flex-none p-3 border-r border-border"></div>
        <div v-if="showRowNumbers" class="w-10 flex-none p-3 text-center border-r border-border">
          #
        </div>
        <div
          v-for="(header, idx) in columnHeaders"
          :key="idx"
          class="flex-1 p-3 min-w-0 truncate"
          :class="{ 'border-l border-border': idx > 0 }">
          {{ header }}
        </div>
        <div v-if="canRemoveRow" class="w-10 flex-none p-3"></div>
      </div>

      <VueDraggable
        :model-value="rows"
        @update:model-value="handleDragUpdate"
        :disabled="!draggable || disabled"
        :animation="150"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="divide-y divide-border"
      >
        <div
          v-for="(row, rowIndex) in rows"
          :key="row._id"
          v-memo="[row, disabled, isUpdate, showRowNumbers, canRemoveRow, draggable, rowIndex, getRowErrorsHash(rowIndex)]"
          class="flex group bg-white transition-colors">
          
          <div
            v-if="draggable"
            class="w-10 flex-none flex items-center justify-center border-r border-border bg-muted/5 drag-handle transition-colors"
            :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing hover:bg-muted/10 text-muted-foreground hover:text-foreground'">
            <Icon icon="lucide:grip-vertical" class="w-4 h-4" />
          </div>

          <div
            v-if="showRowNumbers"
            class="w-10 flex-none flex items-center justify-center text-xs text-muted-foreground border-r border-border bg-muted/20">
            {{ rowIndex + 1 }}
          </div>

          <div
            v-for="(field, fIdx) in schema"
            :key="field.name"
            class="flex-1 min-w-0 relative"
            :class="{ 'border-l border-border': fIdx > 0 }">
            <FormField
              v-if="isFieldVisible(rowIndex, field)"
              :field="{
                ...field,
                props: {
                  ...(getResolvedType(field, rowIndex) === 'multiSelect' ? { showControls: false, wrap: false } : {}),
                  ...(field.props || {})
                },
                label: undefined
              }"
              :value="getFieldValue(rowIndex, field.name)"
              :values="rows[rowIndex] || {}"
              :errors="errors"
              :error="name && errors ? errors[`${name}.${rowIndex}.${field.name}`] : ''"
              :variant="'transparent'"
              size="sm"
              rounded="none"
              :disabled="isFieldDisabled(rowIndex, field)"
              :readonly="isFieldReadonly(rowIndex, field)"
              :isUpdate="isUpdate"
              class="w-full h-full min-h-[40px]"
              @change="(payload) => handleFieldChange(rowIndex, field.name, payload)" />
          </div>

          <div
            v-if="canRemoveRow"
            class="w-10 flex-none flex items-center justify-center border-l border-border bg-muted/20">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              icon="lucide:trash-2"
              :disabled="disabled"
              @click="removeRow(rowIndex)" />
          </div>
        </div>
      </VueDraggable>

      <div
        v-if="rows.length === 0"
        class="flex flex-col items-center justify-center py-6 text-center bg-muted/5">
        <p class="text-sm font-medium text-foreground">{{ displayEmptyTitle }}</p>
        <p class="text-xs text-muted-foreground mt-1">{{ displayEmptyDescription }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PERFORMANCE: Promote heavy interactive containers to separate GPU layers */
.custom-fields-table {
  will-change: transform;
  contain: layout style;
}

/* Remove default margins/padding from inputs inside the table to make them flush */
.custom-fields-table :deep(.form-field-item) {
  margin-bottom: 0 !important;
  height: 100%;
}

.custom-fields-table :deep(input),
.custom-fields-table :deep(textarea) {
  padding-left: 1em;
  padding-right: 0.5em;
}

.custom-fields-table :deep(input),
.custom-fields-table :deep(textarea),
.custom-fields-table :deep(select),
.custom-fields-table :deep(.input-wrapper),
.custom-fields-table :deep(.tooltip-trigger button) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  height: 100% !important;
  min-height: 40px;
}

.custom-fields-table :deep(.tooltip-trigger button) {
  justify-content: space-between !important;
}

/* Focus state indication via inset shadow or background */
.custom-fields-table :deep(input):focus,
.custom-fields-table :deep(textarea):focus,
.custom-fields-table :deep(select):focus,
.custom-fields-table :deep(.input-wrapper):focus-within {
  background-color: hsla(var(--primary) / 0.03) !important;
  box-shadow: inset 0 0 0 2px hsla(var(--primary) / 0.1) !important;
}

/* Fix dropdown and other components ensuring they fill cell */
.custom-fields-table :deep(.w-full) {
  width: 100%;
  height: 100%;
}

/* Transitions - ONLY for adding. Removing is instant. */
.list-enter-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
