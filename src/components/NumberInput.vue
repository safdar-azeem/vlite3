<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from './Icon.vue'

export interface NumberInputProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  variant?: 'split' | 'stacked'
  mode?: 'solid' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  placeholder?: string
  name?: string
  id?: string
  readonly?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: undefined,
  step: 1,
  variant: 'split',
  mode: 'outline',
  size: 'md',
  disabled: false,
  readonly: false,
  rounded: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const localValue = ref<number | string>(props.modelValue ?? '')

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      localValue.value = newVal
    }
  }
)

const inputRef = ref<HTMLInputElement | null>(null)

// Size configurations
const sizeStyles = computed(() => {
  const sizes = {
    xs: { h: 'h-7', text: 'text-xs', px: 'px-2', icon: 'w-3 h-3' },
    sm: { h: 'h-8', text: 'text-xs', px: 'px-2', icon: 'w-3.5 h-3.5' },
    md: { h: 'h-9', text: 'text-sm', px: 'px-3', icon: 'w-4 h-4' },
    lg: { h: 'h-10', text: 'text-base', px: 'px-4', icon: 'w-5 h-5' },
    xl: { h: 'h-12', text: 'text-lg', px: 'px-5', icon: 'w-6 h-6' },
  }
  return sizes[props.size] || sizes.md
})

// Rounded styles
const roundedStyles = computed(() => {
  const map = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }
  // @ts-ignore
  return map[props.rounded] || 'rounded-md'
})

const roundedLeftStyles = computed(() => {
  const map = {
    none: 'rounded-l-none',
    sm: 'rounded-l-sm',
    md: 'rounded-l-md',
    lg: 'rounded-l-lg',
    xl: 'rounded-l-xl',
    '2xl': 'rounded-l-2xl',
    full: 'rounded-l-full',
  }
  // @ts-ignore
  return map[props.rounded] || 'rounded-l-md'
})

const roundedRightStyles = computed(() => {
  const map = {
    none: 'rounded-r-none',
    sm: 'rounded-r-sm',
    md: 'rounded-r-md',
    lg: 'rounded-r-lg',
    xl: 'rounded-r-xl',
    '2xl': 'rounded-r-2xl',
    full: 'rounded-r-full',
  }
  // @ts-ignore
  return map[props.rounded] || 'rounded-r-md'
})

// wrapper classes
const wrapperClasses = computed(() => {
  return [
    'flex items-center w-full relative transition-all duration-200',
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',
    props.mode === 'solid' ? 'bg-muted' : '',
    props.mode === 'outline' ? 'border border-input bg-background' : '',
    props.mode === 'ghost' ? 'bg-transparent' : '',
    sizeStyles.value.h,
    roundedStyles.value,
  ]
})

// Input classes
const inputClasses = computed(() => {
  return [
    'flex-1 w-full bg-transparent text-center focus:outline-none appearance-none',
    'placeholder:text-muted-foreground/50',
    sizeStyles.value.text,
    props.disabled ? 'cursor-not-allowed' : '',
  ]
})

// Button classes
const buttonClasses = computed(() => {
  const base =
    'flex items-center justify-center transition-colors active:scale-95 shrink-0 select-none'
  const hover = !props.disabled ? 'hover:text-primary hover:bg-muted/50' : ''
  const size = props.size === 'xs' || props.size === 'sm' ? 'w-6' : 'w-8'

  if (props.variant === 'split') {
    if (props.mode === 'solid') {
      return [
        base,
        !props.disabled ? 'hover:text-primary hover:bg-background/80' : '',
        'bg-background shadow-sm rounded-full mx-1 my-0.5 aspect-square self-center h-[calc(100%-12px)] w-auto max-w-[calc(100%-12px)] flex items-center justify-center',
      ]
    }
    // Outline/Ghost Split
    // Apply rounded-l to left button and rounded-r to right button manually for robustness
    // But this function doesn't know if it's left or right button?
    // Wait, the current buttonClasses is blindly applied to BOTH.
    // I need to split buttonClasses or apply overrides in template.
    // I'll keep common classes here and apply rounding in template.
    return [base, hover, 'h-full', 'px-2']
  } else {
    // Stacked
    return [base, hover, 'h-1/2 w-8 border-l border-input/50']
  }
})

const updateValue = (val: number) => {
  if (props.disabled || props.readonly) return

  let newValue = val
  if (props.min !== undefined && newValue < props.min) newValue = props.min
  if (props.max !== undefined && newValue > props.max) newValue = props.max

  localValue.value = newValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const increment = () => {
  const current = Number(localValue.value) || 0
  updateValue(current + props.step)
}

const decrement = () => {
  const current = Number(localValue.value) || 0
  updateValue(current - props.step)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const val = parseFloat(target.value)

  if (isNaN(val)) {
    localValue.value = target.value // Allow typing intermediate chars
    return
  }

  updateValue(val)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  // Enforce validation on blur
  const val = parseFloat(String(localValue.value))
  if (isNaN(val)) {
    // Reset to min or 0 if invalid
    updateValue(props.min || 0)
  } else {
    updateValue(val)
  }
}

// Long press / repeat handling could be added here
</script>

<template>
  <div :class="[wrapperClasses, 'overflow-hidden']">
    <!-- Split Variant: Minus on Left -->
    <button
      v-if="variant === 'split'"
      type="button"
      :class="[
        buttonClasses,
        mode === 'outline' ? 'border-r border-input' : '',
        variant === 'split' && mode !== 'solid' ? roundedLeftStyles : '',
      ]"
      :disabled="disabled || (min !== undefined && Number(localValue) <= min)"
      @click="decrement">
      <Icon icon="lucide:minus" :class="sizeStyles.icon" />
    </button>

    <input
      ref="inputRef"
      type="number"
      :value="localValue"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
      @keydown.up.prevent="increment"
      @keydown.down.prevent="decrement" />

    <!-- Split Variant: Plus on Right -->
    <button
      v-if="variant === 'split'"
      type="button"
      :class="[
        buttonClasses,
        mode === 'outline' ? 'border-l border-input' : '',
        variant === 'split' && mode !== 'solid' ? roundedRightStyles : '',
      ]"
      :disabled="disabled || (max !== undefined && Number(localValue) >= max)"
      @click="increment">
      <Icon icon="lucide:plus" :class="sizeStyles.icon" />
    </button>

    <!-- Stacked Variant: Both on Right -->
    <div v-if="variant === 'stacked'" class="flex flex-col h-full border-l border-input">
      <button
        type="button"
        class="flex-1 flex items-center justify-center hover:bg-muted/50 w-8 border-b border-input/50"
        :disabled="disabled || (max !== undefined && Number(localValue) >= max)"
        @click="increment">
        <Icon
          icon="lucide:chevron-up"
          :class="size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'" />
      </button>
      <button
        type="button"
        class="flex-1 flex items-center justify-center hover:bg-muted/50 w-8"
        :disabled="disabled || (min !== undefined && Number(localValue) <= min)"
        @click="decrement">
        <Icon
          icon="lucide:chevron-down"
          :class="size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Remove spinner from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
```
