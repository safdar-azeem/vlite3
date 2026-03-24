<script setup lang="ts">
import { computed, markRaw, type Component } from 'vue'
import type { IForm, IFormAddon, IFormFieldChangePayload } from './types'
import type { InputVariant, InputSize, InputRounded } from '@/types'
import { isComponent, resolveFieldType } from './utils/form.utils'
import { isAddonObject } from './utils/form.utils'
import NumberInput from '@/components/NumberInput.vue'
import Button from '@/components/Button.vue'
import { $t } from '@/utils/i18n'

import Input from '@/components/Input.vue'
import Switch from '@/components/Switch.vue'
import CheckBox from '@/components/CheckBox.vue'
import Textarea from '@/components/Textarea.vue'
import FilePicker from '@/components/FilePicker/FilePicker.vue'
import AvatarUploader from '@/components/AvatarUploader/AvatarUploader.vue'
import Dropdown from '@/components/Dropdown/Dropdown.vue'

import MultiSelect from '@/components/MultiSelect/MultiSelect.vue'
import DatePicker from '@/components/DatePicker.vue'
import DateRangePicker from '@/components/DateRangePicker.vue'
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'
import IconPicker from '@/components/IconPicker.vue'
import CustomFieldsComponent from './CustomFields.vue'

interface Props {
  field: IForm
  value: any
  values: Record<string, any>
  errors?: Record<string, string>
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  disabled?: boolean
  readonly?: boolean
  error?: string
  isUpdate?: boolean
  label?: string
  /** Whether the floating label is currently in the 'active' (raised) position */
  floatingActive?: boolean
  /** Whether the specific field is currently loading/processing */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
  readonly: false,
  error: '',
  isUpdate: false,
  floatingActive: true,
  loading: false,
})

const emit = defineEmits<{
  (e: 'change', payload: IFormFieldChangePayload): void
  (e: 'addonChange', name: string, payload: IFormFieldChangePayload): void
  (e: 'addonAction', action: string): void
}>()

// Handle value change
const handleChange = (value: any, data?: any) => {
  emit('change', { value, data })
}

// Handle input events (for v-model style components)
const handleInput = (value: any) => {
  emit('change', { value })
}

// Dynamically resolve type using context
const resolvedType = computed(() => {
  return resolveFieldType(props.field, {
    values: props.values,
    globalValues: props.values,
    isUpdate: props.isUpdate
  })
})

/**
 * True when the field is type='number' AND isSensitiveField=true.
 * In this case we render Input.vue (which already has the eye-toggle)
 * with type='password', but coerce the emitted value to Number.
 */
const isSensitiveNumber = computed(
  () => resolvedType.value === 'number' && props.field.isSensitiveField === true
)

// Get the component to render based on field type
const fieldComponent = computed(() => {
  const type = resolvedType.value

  // Custom component passed directly
  if (isComponent(type)) {
    return markRaw(type as Component)
  }

  // Map type to component
  switch (type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'search':
    case 'textarea':
      return Input

    case 'number':
      // Sensitive number fields reuse Input.vue (has eye-toggle built in)
      return isSensitiveNumber.value ? Input : NumberInput

    case 'switch':
      return Switch

    case 'check':
      return CheckBox

    case 'select':
      return Dropdown

    case 'multiSelect':
      return MultiSelect

    case 'date':
    case 'time':
      return DatePicker

    case 'dateRangePicker':
      return DateRangePicker

    case 'file':
    case 'fileUploader':
      return FilePicker

    case 'avatarUpload':
      return AvatarUploader

    case 'color':
      return ColorPicker

    case 'iconPicker':
      return IconPicker

    case 'customFields':
      return CustomFieldsComponent

    default:
      return Input
  }
})

// Build props for the component
const fieldProps = computed(() => {
  const type = resolvedType.value
  
  // Destructure disabled and readonly to prevent the raw schema function from 
  // overriding the evaluated boolean props passed by the parent (FormFields.vue)
  const { disabled: _schemaDisabled, readonly: _schemaReadonly, ...restField } = props.field

  const baseProps: Record<string, any> = {
    ...restField,
    disabled: props.disabled || _schemaDisabled === true,
    readonly: props.readonly || _schemaReadonly === true,
    ...(props.field.props || {}),
    label: '',
    labelI18n: '',
  }

  const resolvedPlaceholder = props.field.placeholderI18n
    ? $t(props.field.placeholderI18n)
    : props.field.placeholder

  // When floating variant is active and the label hasn't lifted yet,
  // suppress placeholder to prevent text overlap with the label
  const shouldSuppressPlaceholder =
    props.variant === 'floating' && props.label && !props.floatingActive
  const safePlaceholder = shouldSuppressPlaceholder ? '' : resolvedPlaceholder

  // Input-based components
  if (
    type === 'text' ||
    type === 'email' ||
    type === 'password' ||
    type === 'tel' ||
    type === 'url' ||
    type === 'search' ||
    type === 'textarea' ||
    !type
  ) {
    return {
      ...baseProps,
      modelValue: props.value ?? '',
      type: type || 'text',
      placeholder: safePlaceholder,
      label: props.label,
      icon: props.field.icon,
      iconRight: props.field.iconRight,
      // Only pass addon strings; object addons are rendered via slots
      addonLeft: typeof props.field.addonLeft === 'string' ? props.field.addonLeft : undefined,
      addonRight: typeof props.field.addonRight === 'string' ? props.field.addonRight : undefined,
      variant: props.variant,
      size: props.size,
      rounded: props.rounded,
      error: props.error,
      min: props.field.min,
      max: props.field.max,
      rows: type === 'textarea' ? props.field.props?.rows || 3 : undefined,
      class: `${props.field.className || ''}`,
    }
  }

  // Sensitive number: render via Input.vue as type='password' so the eye-toggle
  // is present. The value is kept as a string in the input; we coerce to Number on emit.
  if (type === 'number' && isSensitiveNumber.value) {
    return {
      ...baseProps,
      // Convert numeric value to string so Input.vue (string-based) displays it correctly
      modelValue: props.value !== undefined && props.value !== null ? String(props.value) : '',
      // 'password' activates the eye-toggle inside Input.vue
      type: 'password',
      placeholder: safePlaceholder,
      label: props.label,
      variant: props.variant,
      size: props.size,
      rounded: props.rounded,
      error: props.error,
      // Disable the browser's built-in clear button so only the eye icon shows
      showClearButton: false,
      class: props.field.className ?? '',
    }
  }

  // Standard NumberInput
  if (type === 'number') {
    return {
      ...baseProps,
      modelValue: props.value ?? undefined,
      min: props.field.min,
      max: props.field.max,
      step: props.field.props?.step ?? 1,
      variant: props.field.props?.variant ?? 'stacked',
      mode: props.field.props?.mode ?? (props.variant === 'transparent' ? 'ghost' : 'outline'),
      size: props.size,
      rounded: props.rounded,
      placeholder: safePlaceholder,
      class: props.field.className,
    }
  }

  // Switch
  if (type === 'switch') {
    return {
      ...baseProps,
      modelValue: !!props.value,
      size: 'sm',
      label: '', // Label handled externally
    }
  }

  // Checkbox
  if (type === 'check') {
    return {
      ...baseProps,
      modelValue: !!props.value,
      label: '', // Label handled externally
    }
  }

  // Dropdown (Select)
  if (type === 'select') {
    return {
      ...baseProps,
      modelValue: props.value,
      options: props.field.options || [],
      placeholder: safePlaceholder,
      selectable: true,
      closeOnSelect: true,
      triggerProps: {
        variant: props.variant === 'floating' ? 'outline-floating' : props.variant || 'outline',
        size: props.size,
        ...(shouldSuppressPlaceholder ? { text: '\u200B' } : {}),
      },
    }
  }

  // MultiSelect
  if (type === 'multiSelect') {
    return {
      ...baseProps,
      modelValue: Array.isArray(props.value) ? props.value : [],
      options: props.field.options || [],
      placeholder: resolvedPlaceholder,
      variant: props.variant,
      size: props.size,
      rounded: props.rounded,
    }
  }

  // DatePicker / TimePicker
  if (type === 'date' || type === 'time') {
    return {
      ...baseProps,
      modelValue: props.value,
      mode: type === 'time' ? 'time' : 'date',
      placeholder: safePlaceholder,
      btnProps: {
        variant: props.variant === 'floating' ? 'outline-floating' : props.variant || 'outline',
        size: props.size,
        class: 'px-3!',
        ...(shouldSuppressPlaceholder ? { text: '\u200B' } : {}),
      },
    }
  }

  // DateRangePicker
  if (type === 'dateRangePicker') {
    return {
      ...baseProps,
      modelValue: props.value,
      variant: props.variant === 'floating' ? 'outline-floating' : props.variant || 'outline',
      size: props.size,
    }
  }

  // FilePicker
  if (type === 'fileUploader' || type === 'file') {
    return {
      ...baseProps,
      modelValue: props.value,
      multiSelect: props.field.props?.multiple || false,
      maxFiles: props.field.maxFiles || props.field.props?.maxFiles,
      fileTypes: props.field.props?.accept ? props.field.props.accept.split(',') : [],
      returnFormat: 'base64',
      variant: type === 'file' ? 'input' : 'dropzone',
      placeholder: safePlaceholder,
      size: props.size,
      rounded: props.rounded,
      maxSize: props.field.maxFileSize ? props.field.maxFileSize * 1024 * 1024 : undefined,
      loading: props.loading,
      allowRename: props.field.props?.allowRename ?? true,
    }
  }

  // AvatarUploader
  if (type === 'avatarUpload') {
    return {
      size: '2xl',
      ...baseProps,
      modelValue: props.value,
      editable: !props.readonly,
      maxSize: props.field.maxFileSize ? props.field.maxFileSize * 1024 * 1024 : undefined,
      loading: props.loading,
    }
  }

  // ColorPicker
  if (type === 'color') {
    return {
      ...baseProps,
      modelValue: props.value || '#000000',
    }
  }

  // IconPicker
  if (type === 'iconPicker') {
    return {
      ...baseProps,
      value: props.value || 'lucide:smile',
    }
  }

  // CustomFields
  if (type === 'customFields') {
    return {
      ...baseProps,
      name: props.field.name,
      label: props?.field?.label,
      labelI18n: props?.field?.labelI18n,
      modelValue: Array.isArray(props.value) ? props.value : [],
      schema: props.field.props?.schema || [],
      headers: props.field.props?.headers || [],
      draggable: props.field.props?.draggable || false,
      values: props.values,
      errors: props.errors,
      variant: props.variant,
      size: props.size,
      rounded: props.rounded,
      isUpdate: props.isUpdate,
    }
  }

  // Custom component
  if (isComponent(type)) {
    return {
      ...baseProps,
      value: props.value,
      values: props.values,
    }
  }

  return baseProps
})

// Build event handlers
const fieldEvents = computed(() => {
  const type = resolvedType.value

  // v-model components (emit 'update:modelValue')
  if (
    type === 'text' ||
    type === 'email' ||
    type === 'password' ||
    type === 'tel' ||
    type === 'url' ||
    type === 'search' ||
    type === 'textarea' ||
    type === 'switch' ||
    type === 'check' ||
    !type
  ) {
    return {
      'update:modelValue': handleInput,
    }
  }

  // Sensitive number: Input.vue emits a string; coerce to Number before passing up
  if (type === 'number' && isSensitiveNumber.value) {
    return {
      'update:modelValue': (val: string) => {
        // Coerce to Number; emit undefined when empty so form state stays clean
        const parsed = val === '' ? undefined : Number(val)
        emit('change', { value: isNaN(parsed as number) ? undefined : parsed })
      },
    }
  }

  // Standard NumberInput — v-model
  if (type === 'number') {
    return {
      'update:modelValue': handleInput,
    }
  }

  // Dropdown emits onSelect
  if (type === 'select') {
    return {
      onSelect: (payload: { value: any; data?: any }) => {
        handleChange(payload.value, payload.data)
      },
    }
  }

  // MultiSelect emits change
  if (type === 'multiSelect') {
    return {
      change: (value: any) => handleChange(value),
    }
  }

  // DatePicker / DateRangePicker emits onChange
  if (type === 'date' || type === 'time' || type === 'dateRangePicker') {
    return {
      change: (value: any) => handleChange(value),
    }
  }

  // FilePicker emits change and update:modelValue
  if (type === 'fileUploader' || type === 'file') {
    return {
      change: (value: any) => {
        handleChange(value)
      },
      'update:modelValue': (value: any) => {
        handleChange(value)
      },
    }
  }

  // AvatarUploader emits change and update:modelValue
  if (type === 'avatarUpload') {
    return {
      change: (value: any) => {
        handleChange(value)
      },
      'update:modelValue': (value: any) => {
        // We accept update:modelValue, but note that AvatarUploader emits base64 string on upload
        // and Null on remove. The 'change' event emits the full object on upload and Null on remove.
        // Since 'change' fires AFTER 'update:modelValue' in AvatarUploader, the Object will properly
        // overwrite the string in the form model during upload.
        // During remove, both are null, so it's safe.
        handleChange(value)
      },
    }
  }

  // ColorPicker emits change
  if (type === 'color') {
    return {
      change: (value: string) => handleChange(value),
    }
  }

  // IconPicker emits onSelect
  if (type === 'iconPicker') {
    return {
      onSelect: (value: string) => handleChange(value),
    }
  }

  // CustomFields emits change
  if (type === 'customFields') {
    return {
      change: (value: any) => handleChange(value),
    }
  }

  // Custom component emits onChange
  if (isComponent(type)) {
    return {
      onChange: (payload: { value: any; data?: any }) => {
        handleChange(payload.value, payload.data)
      },
    }
  }

  return {}
})

// Whether this field has object-type addons that need slot rendering
const hasObjectAddons = computed(() => {
  return isAddonObject(props.field.addonLeft) || isAddonObject(props.field.addonRight)
})

// Check if the field is an input-type field (where addons make sense)
const isInputType = computed(() => {
  const type = resolvedType.value
  return (
    type === 'text' ||
    type === 'email' ||
    type === 'password' ||
    type === 'tel' ||
    type === 'url' ||
    type === 'search' ||
    !type
  )
})

// Whether to render via the addon-aware Input path
const useAddonSlots = computed(() => hasObjectAddons.value && isInputType.value)

// Handle addon select change
const handleAddonSelect = (addon: IFormAddon, payload: { value: any; data?: any }) => {
  emit('addonChange', addon.name as string, { value: payload.value })
}

// Handle addon button click
const handleAddonAction = (addon: IFormAddon) => {
  if (addon.action) {
    emit('addonAction', addon.action)
  }
}
</script>

<template>
  <Input
    v-if="useAddonSlots"
    v-bind="{
      ...fieldProps,
      ...(field?.props || {}),
    }"
    v-on="fieldEvents">
    <template v-if="isAddonObject(field.addonLeft)" #addon-left>
      <Dropdown
        v-if="field.addonLeft.type === 'select'"
        :modelValue="field.addonLeft.name ? values[field.addonLeft.name] : undefined"
        :options="field.addonLeft.options || []"
        v-bind="field.addonLeft.props || {}"
        @onSelect="(payload: any) => handleAddonSelect(field.addonLeft as IFormAddon, payload)">
        <template #trigger="{ selectedLabel }">
          <Button variant="outline">
            {{ selectedLabel }}
          </Button>
        </template>
      </Dropdown>
      <Button
        v-else-if="field.addonLeft.type === 'button'"
        variant="outline"
        v-bind="field.addonLeft.props || {}"
        @click="handleAddonAction(field.addonLeft as IFormAddon)">
        {{ field.addonLeft.text }}
      </Button>
    </template>

    <template v-if="isAddonObject(field.addonRight)" #addon-right>
      <Dropdown
        v-if="field.addonRight.type === 'select'"
        :modelValue="field.addonRight.name ? values[field.addonRight.name] : undefined"
        :options="field.addonRight.options || []"
        v-bind="field.addonRight.props || {}"
        @onSelect="(payload: any) => handleAddonSelect(field.addonRight as IFormAddon, payload)">
        <template #trigger="{ selectedLabel }">
          <Button variant="outline">
            {{ selectedLabel }}
          </Button>
        </template>
      </Dropdown>
      <Button
        v-else-if="field.addonRight.type === 'button'"
        variant="outline"
        v-bind="field.addonRight.props || {}"
        @click="handleAddonAction(field.addonRight as IFormAddon)">
        {{ field.addonRight.text }}
      </Button>
    </template>
  </Input>

  <component
    v-else
    :is="fieldComponent"
    :class="['switch', 'check'].includes(resolvedType as string) ? '' : 'w-full'"
    v-bind="{
      ...fieldProps,
      ...(field?.props || {}),
    }"
    v-on="fieldEvents" />
</template>
