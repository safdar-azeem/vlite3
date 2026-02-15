<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw, type Component } from 'vue'
import type { IForm, IFormAddon, IFormFieldChangePayload } from './types'
import type { InputVariant, InputSize, InputRounded } from '@/types'
import { isComponent } from './utils/form.utils'
import { isAddonObject } from './utils/form.utils'
import NumberInput from '@/components/NumberInput.vue'
import Button from '@/components/Button.vue'

import Input from '@/components/Input.vue'
import Switch from '@/components/Switch.vue'
import CheckBox from '@/components/CheckBox.vue'
import Textarea from '@/components/Textarea.vue'
import FilePicker from '@/components/FilePicker/FilePicker.vue'
import AvatarUploader from '@/components/AvatarUploader/AvatarUploader.vue'
import Dropdown from '@/components/Dropdown/Dropdown.vue'

const MultiSelect = defineAsyncComponent(() => import('@/components/MultiSelect/MultiSelect.vue'))
const DatePicker = defineAsyncComponent(() => import('@/components/DatePicker.vue'))
const ColorPicker = defineAsyncComponent(() => import('@/components/ColorPicker/ColorPicker.vue'))
const IconPicker = defineAsyncComponent(() => import('@/components/IconPicker.vue'))
const CustomFieldsComponent = defineAsyncComponent(() => import('./CustomFields.vue'))

interface Props {
  field: IForm
  value: any
  values: Record<string, any>
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  disabled?: boolean
  readonly?: boolean
  error?: string
  isUpdate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
  readonly: false,
  error: '',
  isUpdate: false,
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

// Get the component to render based on field type
const fieldComponent = computed(() => {
  const type = props.field.type

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
      return Input

    case 'number':
      return NumberInput

    case 'textarea':
      return Textarea

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
  const type = props.field.type
  const baseProps: Record<string, any> = {
    disabled: props.disabled || props.field.disabled === true,
    ...(props.field.props || {}),
  }

  // Input-based components
  if (
    type === 'text' ||
    type === 'email' ||
    type === 'password' ||
    type === 'tel' ||
    type === 'url' ||
    type === 'search' ||
    !type
  ) {
    return {
      ...baseProps,
      modelValue: props.value ?? '',
      type: type || 'text',
      placeholder: props.field.placeholder,
      icon: props.field.icon,
      iconRight: props.field.iconRight,
      // Only pass addon strings; object addons are rendered via slots
      addonLeft: typeof props.field.addonLeft === 'string' ? props.field.addonLeft : undefined,
      addonRight: typeof props.field.addonRight === 'string' ? props.field.addonRight : undefined,
      variant: props.variant,
      size: props.size,
      rounded: props.rounded,
      error: props.error,
      min: props.field.min, // kept for validation attributes if needed
      max: props.field.max,
      class: props.field.className,
    }
  }

  // NumberInput
  if (type === 'number') {
    return {
      ...baseProps,
      modelValue: props.value ?? undefined,
      min: props.field.min,
      max: props.field.max,
      step: props.field.props?.step ?? 1,
      variant: props.field.props?.variant ?? 'split',
      mode: props.field.props?.mode ?? 'outline',
      size: props.size,
      rounded: props.rounded,
      placeholder: props.field.placeholder,
      class: props.field.className,
    }
  }

  // Textarea
  if (type === 'textarea') {
    return {
      ...baseProps,
      modelValue: props.value ?? '',
      placeholder: props.field.placeholder,
      rows: props.field.props?.rows || 3,
      class: props.field.className,
    }
  }

  // Switch
  if (type === 'switch') {
    return {
      ...baseProps,
      modelValue: !!props.value,
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
      placeholder: props.field.placeholder,
      selectable: true,
      closeOnSelect: true,
    }
  }

  // MultiSelect
  if (type === 'multiSelect') {
    return {
      ...baseProps,
      modelValue: Array.isArray(props.value) ? props.value : [],
      options: props.field.options || [],
      placeholder: props.field.placeholder,
    }
  }

  // DatePicker / TimePicker
  if (type === 'date' || type === 'time') {
    return {
      ...baseProps,
      modelValue: props.value,
      mode: type === 'time' ? 'time' : 'date',
      placeholder: props.field.placeholder,
    }
  }

  // FilePicker
  if (type === 'fileUploader' || type === 'file') {
    return {
      ...baseProps,
      modelValue: props.value,
      multiSelect: props.field.props?.multiple || false,
      fileTypes: props.field.props?.accept ? props.field.props.accept.split(',') : [],
      returnFormat: 'base64',
      variant: type === 'file' ? 'input' : 'dropzone',
      placeholder: props.field.placeholder,
      size: props.size,
      rounded: props.rounded,
    }
  }

  // AvatarUploader
  if (type === 'avatarUpload') {
    return {
      ...baseProps,
      modelValue: props.value,
      editable: !props.readonly,
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
      modelValue: Array.isArray(props.value) ? props.value : [],
      schema: props.field.props?.schema || [],
      headers: props.field.props?.headers || [],
      values: props.values,
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
  const type = props.field.type

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
    type === 'number' ||
    !type
  ) {
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

  // DatePicker emits onChange
  if (type === 'date' || type === 'time') {
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
  const type = props.field.type
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
  emit('addonChange', addon.name, { value: payload.value })
}

// Handle addon button click
const handleAddonAction = (addon: IFormAddon) => {
  if (addon.action) {
    emit('addonAction', addon.action)
  }
}
</script>

<template>
  <!-- Input with object addon slots -->
  <Input
    v-if="useAddonSlots"
    v-bind="{
      ...fieldProps,
      ...(field?.props || {}),
    }"
    v-on="fieldEvents">
    <template v-if="isAddonObject(field.addonLeft)" #addon-left>
      <!-- Select addon -->
      <Dropdown
        v-if="field.addonLeft.type === 'select'"
        :modelValue="values[field.addonLeft.name]"
        :options="field.addonLeft.options || []"
        v-bind="field.addonLeft.props || {}"
        @onSelect="(payload: any) => handleAddonSelect(field.addonLeft as IFormAddon, payload)">
        <template #trigger="{ selectedLabel }">
          <Button variant="outline">
            {{ selectedLabel }}
          </Button>
        </template>
      </Dropdown>
      <!-- Button addon -->
      <Button
        v-else-if="field.addonLeft.type === 'button'"
        variant="outline"
        v-bind="field.addonLeft.props || {}"
        @click="handleAddonAction(field.addonLeft as IFormAddon)">
        {{ field.addonLeft.text }}
      </Button>
    </template>

    <template v-if="isAddonObject(field.addonRight)" #addon-right>
      <!-- Select addon -->
      <Dropdown
        v-if="field.addonRight.type === 'select'"
        :modelValue="values[field.addonRight.name]"
        :options="field.addonRight.options || []"
        v-bind="field.addonRight.props || {}"
        @onSelect="(payload: any) => handleAddonSelect(field.addonRight as IFormAddon, payload)">
        <template #trigger="{ selectedLabel }">
          <Button variant="outline">
            {{ selectedLabel }}
          </Button>
        </template>
      </Dropdown>
      <!-- Button addon -->
      <Button
        v-else-if="field.addonRight.type === 'button'"
        variant="outline"
        v-bind="field.addonRight.props || {}"
        @click="handleAddonAction(field.addonRight as IFormAddon)">
        {{ field.addonRight.text }}
      </Button>
    </template>
  </Input>

  <!-- Default: bare component rendering (no object addons) -->
  <component
    v-else
    :is="fieldComponent"
    v-bind="{
      ...fieldProps,
      ...(field?.props || {}),
    }"
    v-on="fieldEvents" />
</template>
