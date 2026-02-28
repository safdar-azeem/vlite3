<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: string
  placeholder?: string
  placeholderI18n?: string
  disabled?: boolean
  rows?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  rows: 3,
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const classes = computed(() => {
  return [
    'flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 bg-background text-foreground',
    props.class,
  ].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const displayPlaceholder = computed(() => props.placeholderI18n ? $t(props.placeholderI18n) : props.placeholder)
</script>

<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :disabled="disabled"
    :placeholder="displayPlaceholder"
    :class="classes"
    @input="handleInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)" />
</template>

