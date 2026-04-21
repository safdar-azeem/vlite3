<script setup lang="ts">
import { provide, computed } from 'vue'
import type { RadioSize, RadioColor } from '@/types'

interface Props {
  modelValue?: any
  name?: string
  disabled?: boolean
  direction?: 'row' | 'column'
  size?: RadioSize
  color?: RadioColor
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  disabled: false,
  direction: 'column',
  size: 'md',
  color: 'primary',
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const updateValue = (val: any) => {
  emit('update:modelValue', val)
}

const groupName = computed(() => {
  return props.name || `radio-group-${Math.random().toString(36).substring(2, 9)}`
})

provide('radioGroup', {
  modelValue: computed(() => props.modelValue),
  updateValue,
  name: groupName.value,
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
  color: computed(() => props.color),
})

const directionClass = computed(() => {
  return props.direction === 'row' ? 'flex-row space-x-4' : 'flex-col space-y-2'
})
</script>

<template>
  <div :class="['flex', directionClass, props.class]" role="radiogroup">
    <slot></slot>
  </div>
</template>
