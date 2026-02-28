<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IForm, IFormFieldChangePayload } from './types'
import type { InputVariant, InputSize, InputRounded } from '@/types'
import FormField from './FormField.vue'
import Button from '@/components/Button.vue'
import Label from '../Label.vue'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: Record<string, any>[]
  schema: IForm[]
  headers?: string[]
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  disabled?: boolean
  minRows?: number
  maxRows?: number
  addButtonText?: string
  textI18n?: string
  label?: string
  labelI18n?: string
  showRowNumbers?: boolean
  /** All form values for context */
  values?: Record<string, any>
  isUpdate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  headers: () => [],
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
  minRows: 0,
  addButtonText: 'Add Row',
  showRowNumbers: false,
  isUpdate: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>[]): void
  (e: 'change', value: Record<string, any>[]): void
}>()

const displayLabel = computed(() => props.labelI18n ? $t(props.labelI18n) : props.label)

// Internal rows state with unique ID for transitions
const rows = ref<(Record<string, any> & { _id: string })[]>([])
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

const handleFieldChange = (
  rowIndex: number,
  fieldName: string,
  payload: IFormFieldChangePayload
) => {
  const newRows = [...rows.value]
  newRows[rowIndex] = {
    ...newRows[rowIndex],
    [fieldName]: payload.value,
  }
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
  return props.schema.map((field) => field.label || field.name)
})
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

      <TransitionGroup name="list" tag="div" class="divide-y divide-border">
        <div
          v-for="(row, rowIndex) in rows"
          :key="row._id"
          class="flex group bg-white transition-colors">
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
              :field="{ ...field, label: undefined }"
              :value="getFieldValue(rowIndex, field.name)"
              :values="values || {}"
              :variant="'transparent'"
              size="sm"
              rounded="none"
              :disabled="disabled"
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
      </TransitionGroup>

      <div
        v-if="rows.length === 0"
        class="flex flex-col items-center justify-center py-6 text-center bg-muted/5">
        <p class="text-sm font-medium text-foreground">No items added</p>
        <p class="text-xs text-muted-foreground mt-1">Add a new item to get started</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
