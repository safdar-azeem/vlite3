<script setup lang="ts">
import Button from '@/components/Button.vue'

interface Props {
  selectedLabel?: string
  placeholder?: string
  isOpen?: boolean
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedLabel: '',
  placeholder: 'Select an option',
  disabled: false,
})
</script>

<template>
  <Button
    :text="selectedLabel || placeholder"
    iconRight="iconamoon:arrow-down-2"
    variant="outline"
    :disabled="disabled"
    class="w-full justify-between! font-normal"
    :class="className" />
</template>
