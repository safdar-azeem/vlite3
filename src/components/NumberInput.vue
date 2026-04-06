<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
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
    lg: { h: 'h-10', text: 'text-sm', px: 'px-4', icon: 'w-5 h-5' },
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
    'flex-1 w-full bg-transparent focus:outline-none appearance-none',
    props.variant === 'split' ? 'text-center' : 'text-left pl-3 pr-2',
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

// Long press / repeat handling
let timer: ReturnType<typeof setTimeout> | null = null
let interval: ReturnType<typeof setInterval> | null = null

const stopContinuous = () => {
  if (timer) clearTimeout(timer)
  if (interval) clearInterval(interval)
  timer = null
  interval = null
}

const increment = () => {
  if (
    props.disabled ||
    props.readonly ||
    (props.max !== undefined && Number(localValue.value) >= props.max)
  ) {
    stopContinuous()
    return
  }
  const current = Number(localValue.value) || 0
  updateValue(current + props.step)
}

const decrement = () => {
  if (
    props.disabled ||
    props.readonly ||
    (props.min !== undefined && Number(localValue.value) <= props.min)
  ) {
    stopContinuous()
    return
  }
  const current = Number(localValue.value) || 0
  updateValue(current - props.step)
}

const startContinuous = (action: 'inc' | 'dec', e: PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return // Ignore right-clicks

  stopContinuous()

  // Execute immediately on press
  if (action === 'inc') increment()
  else decrement()

  // Delay before starting continuous triggers
  timer = setTimeout(() => {
    interval = setInterval(() => {
      if (action === 'inc') increment()
      else decrement()
    }, 50) // Speed of auto-increment
  }, 400) // 400ms delay
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

onBeforeUnmount(() => {
  stopContinuous()
})
</script>

<template>
  <div :class="[wrapperClasses, 'overflow-hidden']">
    <button
      tabindex="-1"
      v-if="variant === 'split' && !disabled && !readonly"
      type="button"
      :class="[
        buttonClasses,
        mode === 'outline' ? 'border-r border-input' : '',
        variant === 'split' && mode !== 'solid' ? roundedLeftStyles : '',
      ]"
      :disabled="disabled || (min !== undefined && Number(localValue) <= min)"
      @pointerdown="startContinuous('dec', $event)"
      @pointerup="stopContinuous"
      @pointerleave="stopContinuous"
      @pointercancel="stopContinuous"
      @contextmenu.prevent
      :data-testid="$attrs['data-testid'] ? `${$attrs['data-testid']}-dec` : (name ? `number-${name}-dec` : (id ? `number-${id}-dec` : 'number-input-dec'))">
      <Icon icon="lucide:minus" :class="sizeStyles.icon" />
    </button>

    <input
      ref="inputRef"
      type="number"
      :value="localValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
      @keydown.up.prevent="increment"
      @keydown.down.prevent="decrement"
      @wheel.prevent
      @invalid.prevent
      :data-testid="$attrs['data-testid'] || (name ? `number-${name}` : (id ? `number-${id}` : 'number-input'))" />

    <button
      tabindex="-1"
      v-if="variant === 'split' && !disabled && !readonly"
      type="button"
      :class="[
        buttonClasses,
        mode === 'outline' ? 'border-l border-input' : '',
        variant === 'split' && mode !== 'solid' ? roundedRightStyles : '',
      ]"
      :disabled="disabled || (max !== undefined && Number(localValue) >= max)"
      @pointerdown="startContinuous('inc', $event)"
      @pointerup="stopContinuous"
      @pointerleave="stopContinuous"
      @pointercancel="stopContinuous"
      @contextmenu.prevent
      :data-testid="$attrs['data-testid'] ? `${$attrs['data-testid']}-inc` : (name ? `number-${name}-inc` : (id ? `number-${id}-inc` : 'number-input-inc'))">
      <Icon icon="lucide:plus" :class="sizeStyles.icon" />
    </button>

    <div v-if="variant === 'stacked' && !disabled && !readonly" class="flex flex-col justify-center h-full py-[3px] pr-[3px]">
      <div class="flex flex-col h-full w-6 scale-80">
        <button
          tabindex="-1"
          type="button"
          class="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-muted-foreground hover:text-foreground rounded-t-[3px] border-b border-gray-300 transition-colors disabled:cursor-not-allowed"
          :disabled="disabled || (max !== undefined && Number(localValue) >= max)"
          @pointerdown="startContinuous('inc', $event)"
          @pointerup="stopContinuous"
          @pointerleave="stopContinuous"
          @pointercancel="stopContinuous"
          @contextmenu.prevent
          :data-testid="$attrs['data-testid'] ? `${$attrs['data-testid']}-inc` : (name ? `number-${name}-inc` : (id ? `number-${id}-inc` : 'number-input-inc'))">
          <Icon
            class="text-gray-700/85!"
            icon="mynaui:chevron-up-solid"
            :class="size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'" />
        </button>
        <button
          tabindex="-1"
          type="button"
          class="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-muted-foreground hover:text-foreground rounded-b-[3px] transition-colors disabled:cursor-not-allowed"
          :disabled="disabled || (min !== undefined && Number(localValue) <= min)"
          @pointerdown="startContinuous('dec', $event)"
          @pointerup="stopContinuous"
          @pointerleave="stopContinuous"
          @pointercancel="stopContinuous"
          @contextmenu.prevent
          :data-testid="$attrs['data-testid'] ? `${$attrs['data-testid']}-dec` : (name ? `number-${name}-dec` : (id ? `number-${id}-dec` : 'number-input-dec'))">
          <Icon
            class="text-gray-700/85!"
            icon="mynaui:chevron-down-solid"
            :class="size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'" />
        </button>
      </div>
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
