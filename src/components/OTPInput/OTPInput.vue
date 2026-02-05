<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'

interface Props {
  length?: number
  modelValue?: string
  disabled?: boolean
  error?: boolean
  autofocus?: boolean
  type?: 'text' | 'number'
  placeholder?: string
  variant?: 'solid' | 'outline' | 'ghost'
  attached?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  disabled: false,
  error: false,
  autofocus: false,
  type: 'number',
  placeholder: '',
  variant: 'outline',
  attached: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
  (e: 'change', value: string): void
}>()

const inputs = ref<(HTMLInputElement | null)[]>([])
const digits = ref<string[]>(new Array(props.length).fill(''))

// Sync from modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    const val = newVal || ''
    const chars = val.split('').slice(0, props.length)
    const currentJoined = digits.value.join('')
    if (currentJoined !== val) {
      const newDigits = new Array(props.length).fill('')
      chars.forEach((c, i) => (newDigits[i] = c))
      digits.value = newDigits
    }
  },
  { immediate: true }
)

const updateModel = () => {
  const val = digits.value.join('')
  emit('update:modelValue', val)
  emit('change', val)
  if (val.length === props.length) {
    emit('complete', val)
  }
}

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  let val = target.value

  if (props.type === 'number') {
    val = val.replace(/\D/g, '')
  }

  if (val.length === 1) {
    digits.value[index] = val
    updateModel()
    if (index < props.length - 1) {
      inputs.value[index + 1]?.focus()
    }
    return
  }

  if (!val) {
    digits.value[index] = ''
    updateModel()
    return
  }

  if (val.length > 1) {
    const chars = val.split('').slice(0, props.length - index)
    chars.forEach((c, i) => {
      if (index + i < props.length) {
        digits.value[index + i] = c
      }
    })
    updateModel()
    const nextFocus = Math.min(index + chars.length, props.length - 1)
    inputs.value[nextFocus]?.focus()
  }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const key = event.key

  if (key === 'Backspace') {
    if (!digits.value[index]) {
      event.preventDefault()
      if (index > 0) {
        digits.value[index - 1] = ''
        inputs.value[index - 1]?.focus()
        updateModel()
      }
    }
    return
  }

  if (key === 'ArrowLeft') {
    event.preventDefault()
    if (index > 0) {
      inputs.value[index - 1]?.focus()
    }
  }

  if (key === 'ArrowRight') {
    event.preventDefault()
    if (index < props.length - 1) {
      inputs.value[index + 1]?.focus()
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text/plain')
  if (!pastedData) return

  let paste = pastedData.trim()
  if (props.type === 'number') {
    paste = paste.replace(/\D/g, '')
  }

  const chars = paste.split('').slice(0, props.length)
  const newDigits = [...digits.value]
  chars.forEach((char, i) => {
    newDigits[i] = char
  })
  digits.value = newDigits

  updateModel()

  const nextIndex = Math.min(chars.length, props.length - 1)
  inputs.value[nextIndex]?.focus()
}

const setInputRef = (el: any, index: number) => {
  if (el) inputs.value[index] = el
}

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      inputs.value[0]?.focus()
    })
  }
})

// Styling Computed Props
const containerClasses = computed(() => {
  return ['flex items-center', props.attached ? '-space-x-px' : 'gap-2'].join(' ')
})

const inputClasses = (index: number) => {
  const base =
    'text-center font-medium transition-all focus:outline-none focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground'

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  }

  const variants = {
    solid:
      'bg-muted border border-transparent focus:border-primary focus:ring-2 focus:ring-primary',
    outline: 'border border-input focus:border-primary focus:ring-2 focus:ring-primary',
    ghost:
      'bg-transparent border border-transparent hover:bg-accent focus:focus:border-primary focus:ring-2 focus:ring-primary',
  }

  // Error state override
  const errorClass = props.error ? 'border-destructive focus:ring-destructive text-destructive' : ''

  let rounding = 'rounded-md'
  if (props.attached) {
    if (index === 0) rounding = 'rounded-l-md rounded-r-none'
    else if (index === props.length - 1) rounding = 'rounded-r-md rounded-l-none'
    else rounding = 'rounded-none'
  }

  return [base, sizes[props.size], variants[props.variant], errorClass, rounding].join(' ')
}
</script>

<template>
  <div :class="containerClasses">
    <input
      v-for="(digit, index) in props.length"
      :key="index"
      :ref="(el) => setInputRef(el, index)"
      :value="digits[index]"
      :type="type === 'number' ? 'tel' : 'text'"
      inputmode="numeric"
      :maxlength="1"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="inputClasses(index)"
      @input="(e) => handleInput(e, index)"
      @keydown="(e) => handleKeyDown(e, index)"
      @paste="handlePaste"
      @focus="$emit('update:modelValue', digits.join(''))" />
  </div>
</template>
