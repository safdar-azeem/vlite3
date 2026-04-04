<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '../Icon.vue'
import Input from '../Input.vue'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: string[]
  placeholder?: string
  placeholderI18n?: string
  disabled?: boolean
  maxTags?: number
  variant?: 'outline' | 'solid' | 'transparent' | 'outline-b' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  error?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Add tag...',
  disabled: false,
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}>()

const inputValue = ref('')
const inputRef = ref<any>(null)

const displayPlaceholder = computed(() => {
  if (props.maxTags && props.modelValue.length >= props.maxTags) return 'Max tags reached'
  return props.placeholderI18n ? $t(props.placeholderI18n) : props.placeholder
})

const focusInput = () => {
  if (inputRef.value) {
    const el = inputRef.value.$el || inputRef.value
    const input = el instanceof HTMLElement ? el.querySelector('input') : null
    if (input) input.focus()
  }
}

const addTag = () => {
  if (props.disabled) return
  const val = inputValue.value.trim()
  if (!val) return
  if (props.maxTags && props.modelValue.length >= props.maxTags) {
    inputValue.value = ''
    return
  }

  if (!props.modelValue.includes(val)) {
    const newTags = [...props.modelValue, val]
    emit('update:modelValue', newTags)
    emit('change', newTags)
  }
  inputValue.value = ''
  focusInput()
}

const removeTag = (index: number) => {
  if (props.disabled) return
  const newTags = [...props.modelValue]
  newTags.splice(index, 1)
  emit('update:modelValue', newTags)
  emit('change', newTags)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  if (props.disabled) return
  const paste = e.clipboardData?.getData('text')
  if (paste && paste.includes(',')) {
    e.preventDefault()
    const tags = paste
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    let newTags = [...props.modelValue]
    for (const t of tags) {
      if (props.maxTags && newTags.length >= props.maxTags) break
      if (!newTags.includes(t)) {
        newTags.push(t)
      }
    }
    emit('update:modelValue', newTags)
    emit('change', newTags)
    inputValue.value = ''
  }
}
</script>

<template>
  <div class="w-full flex flex-col" :class="props.class">
    <Input
      ref="inputRef"
      v-model="inputValue"
      :placeholder="displayPlaceholder"
      :disabled="disabled || (maxTags ? modelValue.length >= maxTags : false)"
      :variant="variant"
      :size="size"
      :rounded="rounded"
      :error="error"
      :show-clear-button="false"
      icon-right="lucide:plus"
      @click:icon-right="addTag"
      @keydown="handleKeydown"
      @paste="handlePaste" />

    <div v-if="modelValue.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
      <span
        v-for="(tag, index) in modelValue"
        :key="tag + index"
        class="inline-flex items-center justify-center gap-1 bg-accent text-accent-foreground border border-border whitespace-nowrap px-2 py-0.5"
        :class="[
          size === 'sm'
            ? 'text-[10px] rounded-sm'
            : size === 'lg'
              ? 'text-sm rounded-md px-2.5 py-1'
              : 'text-xs rounded',
        ]">
        {{ tag }}
        <button
          type="button"
          class="hover:text-foreground focus:outline-none disabled:opacity-50 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
          :disabled="disabled"
          @click.stop="removeTag(index)">
          <Icon icon="lucide:x" class="w-3 h-3" />
        </button>
      </span>
    </div>
  </div>
</template>
