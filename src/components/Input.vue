<script setup lang="ts">
import { computed, nextTick, ref, onMounted, useSlots } from 'vue'
import Icon from './Icon.vue'
import Label from './Label.vue'
import Textarea from './Textarea.vue'
import type { InputProps, InputRounded, InputSize, InputVariant } from '@/types'
import { $t } from '@/utils/i18n'

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

const displayLabel = computed(() => props.labelI18n ? $t(props.labelI18n) : props.label)
const displayPlaceholder = computed(() => props.placeholderI18n ? $t(props.placeholderI18n) : props.placeholder)

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
  return ['relative flex w-full items-stretch', props.labelPosition !== 'top' ? 'flex-1' : ''].join(
    ' '
  )
})

const inputBaseClass = computed(() => {
  const base =
    'block w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none relative focus:z-10'

  const variantStyles: Record<InputVariant, string> = {
    solid: 'bg-muted border-transparent focus-visible:border-primary',
    outline: 'border border-input focus-visible:border-primary',
    'outline-b': 'border-b border-input bg-transparent rounded-none focus-visible:border-primary',
    transparent: 'border-none bg-transparent shadow-none',
  }

  const sizeStyles: Record<InputSize, string> = {
    sm: 'h-7.5 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base',
  }

  const roundedStyles: Record<InputRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  let roundedClass = roundedStyles[props.rounded]

  if (hasAddonLeft.value) {
    if (props.rounded === 'md') roundedClass = 'rounded-r-md rounded-l-none'
    else if (props.rounded === 'sm') roundedClass = 'rounded-r-sm rounded-l-none'
    else if (props.rounded === 'lg') roundedClass = 'rounded-r-lg rounded-l-none'
    else if (props.rounded === 'full') roundedClass = 'rounded-r-full rounded-l-none'
    else if (props.rounded !== 'none')
      roundedClass = roundedClass.replace('rounded-', 'rounded-r-').replace('rounded-l-', '')
  }

  if (hasAddonRight.value) {
    if (hasAddonLeft.value) {
      roundedClass = 'rounded-none'
    } else {
      if (props.rounded === 'md') roundedClass = 'rounded-l-md rounded-r-none'
      else if (props.rounded === 'sm') roundedClass = 'rounded-l-sm rounded-r-none'
      else if (props.rounded === 'lg') roundedClass = 'rounded-l-lg rounded-r-none'
      else if (props.rounded === 'full') roundedClass = 'rounded-l-full rounded-r-none'
      else if (props.rounded !== 'none')
        roundedClass = roundedClass.replace('rounded-', 'rounded-l-').replace('rounded-r-', '')
    }
  }

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
    props.icon ? 'pl-9' : isMinimal && !hasAddonLeft.value ? 'pl-0' : '',
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

const sizeText: Record<InputSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const getAutoAddonClasses = (side: 'left' | 'right') => {
  const isLeft = side === 'left'
  return [
    '[&_button]:w-full [&_a]:w-full! [&_.v-btn]:w-full! [&_.tooltip-trigger]:w-full',
    isLeft
      ? '[&_button]:rounded-r-none [&_a]:rounded-r-none [&_.v-btn]:rounded-r-none'
      : '[&_button]:rounded-l-none [&_a]:rounded-l-none [&_.v-btn]:rounded-l-none',
    '[&_button]:relative [&_button]:focus:z-20',
    isLeft ? '-mr-px' : '-ml-px',
    'z-10', 
  ].join(' ')
}

const leftAddonClass = computed(() => {
  const isCustom = !!slots['addon-left']
  const map: Record<string, string> = {
    sm: 'rounded-l-sm',
    md: 'rounded-l-md',
    lg: 'rounded-l-lg',
    full: 'rounded-l-full',
    none: 'rounded-none',
    xl: 'rounded-l-xl',
    '2xl': 'rounded-l-2xl',
  }

  return [
    'flex items-center justify-center whitespace-nowrap',
    isCustom
      ? `border-none ${getAutoAddonClasses('left')}`
      : `bg-muted border border-input border-r-0! px-3 text-muted-foreground ${map[props.rounded] || 'rounded-l-md'}`,
    isCustom ? '' : sizeText[props.size],
    props.addonLeftClass,
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ')
})

const rightAddonClass = computed(() => {
  const isCustom = !!slots['addon-right']
  const map: Record<string, string> = {
    sm: 'rounded-r-sm',
    md: 'rounded-r-md',
    lg: 'rounded-r-lg',
    full: 'rounded-r-full',
    none: 'rounded-none',
    xl: 'rounded-r-xl',
    '2xl': 'rounded-r-2xl',
  }

  return [
    'flex items-center justify-center whitespace-nowrap',
    isCustom
      ? `border-none ${getAutoAddonClasses('right')}`
      : `bg-muted border border-input border-l-0! px-3 text-muted-foreground ${map[props.rounded] || 'rounded-r-md'}`,
    isCustom ? '' : sizeText[props.size],
    props.addonRightClass,
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
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
      v-if="displayLabel"
      :for="displayLabel"
      :class="['mb-1.5', labelPosition !== 'top' ? 'mb-0' : ''].join(' ')">
      {{ displayLabel }}
    </Label>

    <div :class="inputWrapperClass">
      <div v-if="hasAddonLeft" :class="leftAddonClass">
        <slot name="addon-left">{{ addonLeft }}</slot>
      </div>

      <div class="relative w-full" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <Textarea
          v-if="type === 'textarea'"
          :model-value="String(modelValue)"
          :placeholder="displayPlaceholder"
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
          :placeholder="displayPlaceholder"
          :disabled="disabled"
          :min="min"
          :max="max"
          :class="inputBaseClass"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus" />

        <div
          v-if="icon"
          tabindex="-1"
          :class="[
            'absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground z-20 pointer-events-none',
            disabled ? 'opacity-50' : '',
          ]">
          <Icon :icon="icon" class="h-4 w-4" />
        </div>

        <div
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 z-20">
          <Icon
            v-if="loading"
            icon="lucide:loader-2"
            class="h-4 w-4 animate-spin text-muted-foreground" />

          <div
            v-else-if="iconRight"
            tabindex="-1"
            :class="[
              'flex items-center justify-center text-muted-foreground',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-foreground',
            ]"
            @click="!disabled && emit('click:icon-right', $event)">
            <Icon :icon="iconRight" class="h-4 w-4" />
          </div>

          <button
            v-if="type === 'password' && !disabled"
            type="button"
            tabindex="-1"
            class="flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none"
            @click="togglePasswordVisibility">
            <Icon :icon="isPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4" />
          </button>

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

      <div v-if="hasAddonRight" :class="rightAddonClass">
        <slot name="addon-right">{{ addonRight }}</slot>
      </div>
    </div>
  </div>
</template>

