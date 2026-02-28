<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  label?: string
  labelI18n?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

const displayLabel = computed(() => props.labelI18n ? $t(props.labelI18n) : props.label)
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="displayLabel || 'Toggle'"
      :disabled="disabled"
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :class="[modelValue ? 'bg-primary' : 'bg-input', props.class]"
      @click="toggle">
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'" />
    </button>
    <label
      v-if="displayLabel"
      :class="disabled ? 'opacity-50' : ''"
      class="text-sm font-medium text-foreground cursor-pointer"
      @click="toggle">
      {{ displayLabel }}
    </label>
  </div>
</template>

