<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/utils/i18n'

type SwitchVariant = 'basic' | 'card'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  label?: string
  labelI18n?: string
  description?: string
  descriptionI18n?: string
  variant?: SwitchVariant
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  variant: 'basic',
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

const displayLabel = computed(() => (props.labelI18n ? $t(props.labelI18n) : props.label))
const displayDescription = computed(() =>
  props.descriptionI18n ? $t(props.descriptionI18n) : props.description
)
</script>

<template>
  <!-- Card variant: bordered box, label left, switch right, optional description below label -->
  <div
    v-if="variant === 'card'"
    class="flex items-start justify-between gap-4 w-full rounded-md border border-border bg-background px-4 py-3 cursor-pointer"
    :class="disabled ? 'opacity-50 pointer-events-none' : ''"
    @click="toggle">
    <div class="flex flex-col gap-0.5 min-w-0">
      <span
        v-if="displayLabel"
        class="text-sm font-medium text-foreground leading-snug select-none">
        {{ displayLabel }}
      </span>
      <span
        v-if="displayDescription"
        class="text-xs text-muted-foreground leading-snug select-none">
        {{ displayDescription }}
      </span>
    </div>
    <button
      :id="id"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="displayLabel || 'Toggle'"
      :disabled="disabled"
      class="relative mt-0.5 inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :class="modelValue ? 'bg-primary' : 'bg-input'"
      @click.stop="toggle">
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5 rtl:translate-x-0' : 'translate-x-0 rtl:-translate-x-5'" />
    </button>
  </div>

  <!-- Basic variant: compact inline toggle + label -->
  <div v-else class="inline-flex items-center gap-2" :class="props.class">
    <button
      :id="id"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="displayLabel || 'Toggle'"
      :disabled="disabled"
      class="relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :class="modelValue ? 'bg-primary' : 'bg-input'"
      @click="toggle">
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5 rtl:translate-x-0' : 'translate-x-0 rtl:-translate-x-5'" />
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
