<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ButtonProps } from '@/types'

interface Props {
  selectedLabel?: string
  selectedIcon?: string
  placeholder?: string
  isOpen?: boolean
  disabled?: boolean
  readonly?: boolean
  className?: string
  direction?: 'ltr' | 'rtl'
  triggerProps?: ButtonProps
}

const props = withDefaults(defineProps<Props>(), {
  selectedLabel: '',
  selectedIcon: '',
  placeholder: 'Select an option',
  disabled: false,
  readonly: false,
  direction: 'ltr',
})
</script>

<template>
  <Button
    :text="selectedLabel || placeholder"
    :iconRight="(disabled || readonly) ? undefined : 'iconamoon:arrow-down-2'"
    variant="outline"
    :disabled="disabled"
    :dir="direction"
    v-bind="triggerProps"
    :icon="selectedIcon || triggerProps?.icon"
    class="w-full justify-between! font-normal px-2.5!"
    :class="[className, readonly && !disabled ? 'pointer-events-none' : '']"
    icon-right-class="ml-auto!"
    :data-testid="$attrs['data-testid'] || 'dropdown-trigger'" />
</template>
