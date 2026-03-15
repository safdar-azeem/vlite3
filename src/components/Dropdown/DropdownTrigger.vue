<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ButtonProps } from '@/types'

interface Props {
  selectedLabel?: string
  placeholder?: string
  isOpen?: boolean
  disabled?: boolean
  className?: string
  direction?: 'ltr' | 'rtl'
  triggerProps?: ButtonProps
}

const props = withDefaults(defineProps<Props>(), {
  selectedLabel: '',
  placeholder: 'Select an option',
  disabled: false,
  direction: 'ltr',
})
</script>

<template>
  <Button
    :text="selectedLabel || placeholder"
    iconRight="iconamoon:arrow-down-2"
    variant="outline"
    :disabled="disabled"
    :dir="direction"
    v-bind="triggerProps"
    class="w-full justify-between! font-normal px-2.5!"
    :class="className" />
</template>
