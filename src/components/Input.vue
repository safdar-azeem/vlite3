<script setup lang="ts">
import { computed, nextTick, ref, onMounted, useSlots } from 'vue'
import Icon from './Icon.vue'
import Label from './Label.vue'
import Textarea from './Textarea.vue'
import type { InputProps, InputRounded, InputSize, InputVariant } from '@/types'

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  loading: false,
  showClearButton: true,
  autofocus: false,
  class: '',
  inputClass: '',
  rows: 3,
  lazy: false,
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  labelPosition: 'top',
  addonLeftClass: '',
  addonRightClass: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', value: string | number): void
  (e: 'click:icon', event: MouseEvent): void
  (e: 'click:icon-right', event: MouseEvent): void
}>()

const slots = useSlots()
const inputRef = ref<HTMLInputElement | null>(null)
const isPasswordVisible = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text'
  }
  return props.type
})

const hasValue = computed(() => {
  return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined
})

const hasAddonLeft = computed(() => !!props.addonLeft || !!slots['addon-left'])
const hasAddonRight = computed(() => !!props.addonRight || !!slots['addon-right'])

const wrapperClass = computed(() => {
  return [
    'relative w-full',
    props.class,
    props.labelPosition === 'left' ? 'flex items-center gap-4' : '',
    props.labelPosition === 'right' ? 'flex flex-row-reverse items-center gap-4' : 'space-y-2',
  ].join(' ')
})

const inputWrapperClass = computed(() => {
  // items-stretch ensures addons match the height of the input container
  return ['relative flex w-full items-stretch', props.labelPosition !== 'top' ? 'flex-1' : ''].join(
    ' '
  )
})

const inputBaseClass = computed(() => {
  // Base styles - removed 'flex' as it's not valid on input
  const base =
    'block w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-visible:outline-none'

  // Variant styles
  const variantStyles: Record<InputVariant, string> = {
    solid: 'bg-muted border-transparent focus-visible:border-primary',
    outline: 'border border-input focus-visible:border-primary',
    'outline-b': 'border-b border-input bg-transparent rounded-none focus-visible:border-primary',
    transparent: 'border-none bg-transparent shadow-none',
  }

  // Size styles
  const sizeStyles: Record<InputSize, string> = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base',
  }

  // Rounded styles
  const roundedStyles: Record<InputRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  // Logic for rounded corners when addons are present
  let roundedClass = roundedStyles[props.rounded]
  if (hasAddonLeft.value) {
    roundedClass = roundedClass.replace('rounded-', 'rounded-r-').replace('rounded-l-', '')
    // Fix for full rounded or simple rounded
    if (props.rounded === 'md') roundedClass = 'rounded-r-md rounded-l-none'
    if (props.rounded === 'sm') roundedClass = 'rounded-r-sm rounded-l-none'
    if (props.rounded === 'lg') roundedClass = 'rounded-r-lg rounded-l-none'
    if (props.rounded === 'full') roundedClass = 'rounded-r-full rounded-l-none'
    // Handle specific cases if needed, but simple override works for standard Tailwind classes
  }
  if (hasAddonRight.value) {
    // If we already modified it for left, we need to modify for right as well, effectively making it square?
    // Or just remove right rounding.
    let rClass = roundedStyles[props.rounded]
    if (hasAddonLeft.value) {
      // Both addons -> no rounded corners on sides
      roundedClass = 'rounded-none'
    } else {
      // Only right addon
      if (props.rounded === 'md') roundedClass = 'rounded-l-md rounded-r-none'
      if (props.rounded === 'sm') roundedClass = 'rounded-l-sm rounded-r-none'
      if (props.rounded === 'lg') roundedClass = 'rounded-l-lg rounded-r-none'
      if (props.rounded === 'full') roundedClass = 'rounded-l-full rounded-r-none'
    }
  }

  // Special case for 'outline-b' variants which usually shouldn't have rounded corners or borders on sides
  if (props.variant === 'outline-b') {
    roundedClass = 'rounded-none'
  }

  const isMinimal = props.variant === 'outline-b' || props.variant === 'transparent'

  return [
    base,
    variantStyles[props.variant],
    sizeStyles[props.size],
    roundedClass,
    props.error ? 'border-destructive focus-visible:ring-destructive' : '',
    // Left Padding
    props.icon ? 'pl-9' : isMinimal && !hasAddonLeft.value ? 'pl-0' : '',
    // Right Padding
    (props.showClearButton && hasValue.value) ||
    props.type === 'password' ||
    props.loading ||
    props.iconRight
      ? 'pr-9'
      : isMinimal && !hasAddonRight.value
        ? 'pr-0'
        : '',
    props.inputClass,
  ].join(' ')
})

// Text size mapping - moved out for reuse or keep inside
const sizeText: Record<InputSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const leftAddonClass = computed(() => {
  // Matches input rounding on left
  const map: Record<string, string> = {
    sm: 'rounded-l-sm',
    md: 'rounded-l-md',
    lg: 'rounded-l-lg',
    full: 'rounded-l-full',
    none: 'rounded-none',
    xl: 'rounded-l-xl',
    '2xl': 'rounded-l-2xl',
  }

  // Check if slot overrides default content
  const isCustom = !!slots['addon-left']

  return [
    'flex items-center justify-center whitespace-nowrap',
    isCustom
      ? 'border-none'
      : 'bg-muted border border-input border-r-0! px-3 text-muted-foreground',
    isCustom ? '' : sizeText[props.size],
    map[props.rounded] || 'rounded-l-md',
    props.addonLeftClass,
  ].join(' ')
})

const rightAddonClass = computed(() => {
  // Matches input rounding on right
  const map: Record<string, string> = {
    sm: 'rounded-r-sm',
    md: 'rounded-r-md',
    lg: 'rounded-r-lg',
    full: 'rounded-r-full',
    none: 'rounded-none',
    xl: 'rounded-r-xl',
    '2xl': 'rounded-r-2xl',
  }

  const isCustom = !!slots['addon-right']

  return [
    'flex items-center justify-center whitespace-nowrap',
    isCustom
      ? 'border-none'
      : 'bg-muted border border-input border-l-0! px-3 text-muted-foreground',
    isCustom ? '' : sizeText[props.size],
    map[props.rounded] || 'rounded-r-md',
    props.addonRightClass,
  ].join(' ')
})

const handleInput = (event: Event) => {
  if (props.lazy) return
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.lazy) {
    emit('update:modelValue', target.value)
  }
  emit('change', target.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const clearInput = () => {
  emit('update:modelValue', '')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const isFocused = ref(false)
const isHovered = ref(false)

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<template>
  <div :class="wrapperClass">
    <Label
      v-if="label"
      :for="label"
      :class="['mb-1.5', labelPosition !== 'top' ? 'mb-0' : ''].join(' ')">
      {{ label }}
    </Label>

    <div :class="inputWrapperClass">
      <!-- Left Addon -->
      <div v-if="hasAddonLeft" :class="leftAddonClass">
        <slot name="addon-left">{{ addonLeft }}</slot>
      </div>

      <div class="relative w-full" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <Textarea
          v-if="type === 'textarea'"
          :model-value="String(modelValue)"
          :placeholder="placeholder"
          :disabled="disabled"
          :rows="rows"
          :class="inputBaseClass"
          @update:model-value="emit('update:modelValue', $event)"
          @blur="handleBlur"
          @focus="handleFocus" />

        <input
          v-else
          ref="inputRef"
          :type="computedType"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :min="min"
          :max="max"
          :class="inputBaseClass"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus" />

        <!-- Left Icon -->
        <div
          v-if="icon"
          tabindex="-1"
          class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground"
          @click="emit('click:icon', $event)">
          <Icon :icon="icon" class="h-4 w-4" />
        </div>

        <!-- Right Actions/Icons -->
        <div
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
          <!-- Loading -->
          <Icon
            v-if="loading"
            icon="lucide:loader-2"
            class="h-4 w-4 animate-spin text-muted-foreground" />

          <!-- Icon Right (only if not loading) -->
          <div
            v-else-if="iconRight"
            tabindex="-1"
            class="flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground"
            @click="emit('click:icon-right', $event)">
            <Icon :icon="iconRight" class="h-4 w-4" />
          </div>

          <!-- Password Toggle -->
          <button
            v-if="type === 'password' && !disabled"
            type="button"
            tabindex="-1"
            class="flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none"
            @click="togglePasswordVisibility">
            <Icon :icon="isPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4" />
          </button>

          <!-- Clear Button -->
          <button
            v-if="
              showClearButton &&
              hasValue &&
              !disabled &&
              !loading &&
              type !== 'textarea' &&
              type !== 'password' &&
              (isFocused || isHovered)
            "
            type="button"
            tabindex="-1"
            class="flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none transition-opacity duration-200"
            @click="clearInput">
            <Icon icon="lucide:x-circle" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Right Addon -->
      <div v-if="hasAddonRight" :class="rightAddonClass">
        <slot name="addon-right">{{ addonRight }}</slot>
      </div>
    </div>
  </div>
</template>
