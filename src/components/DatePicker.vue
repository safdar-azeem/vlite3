<script setup lang="ts">
import { computed } from 'vue'
import type { DatePickerMode } from 'v-datepicker-lite/types'
import Button from './Button.vue'
import type { ButtonSize, ButtonVariant } from '@/types'
import { Dropdown } from './Dropdown'
import DatePickerLite from 'v-datepicker-lite'
import 'v-datepicker-lite/style.css'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    modelValue?: any
    value?: any
    mode: DatePickerMode
    minDate?: string
    icon?: string
    size?: ButtonSize
    variant?: ButtonVariant
    btnProps?: any
    teleport?: boolean
    minuteInterval?: number
  }>(),
  {
    minuteInterval: 5,
    teleport: true,
  }
)

const emit = defineEmits(['update:modelValue', 'change'])

const actualValue = computed({
  get: () => props.modelValue ?? props.value,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const hasTimePart = (val: any): boolean => {
  if (val instanceof Date) {
    return val.getHours() !== 0 || val.getMinutes() !== 0
  }

  if (typeof val === 'string') {
    return val.includes('T') || /\d{2}:\d{2}/.test(val)
  }

  return false
}

const displayValue = computed(() => {
  if (!actualValue.value) return ''

  try {
    const d = new Date(actualValue.value)
    if (isNaN(d.getTime())) return String(actualValue.value)

    const showTime = props.mode === 'dateTime' && hasTimePart(actualValue.value)

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(showTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    })
  } catch (e) {
    return String(actualValue.value)
  }
})

const handleDateChange = (val: any) => {
  actualValue.value = val
}
</script>

<template>
  <Dropdown position="bottom-start" class="w-full" :teleport="teleport">
    <template #trigger>
      <slot :value="actualValue" :displayValue="displayValue">
        <Button
          :text="displayValue || placeholder || 'Select date'"
          :variant="variant || 'outline'"
          :size="size || 'md'"
          :icon="icon || 'lucide:calendar'"
          v-bind="btnProps"
          class="w-full justify-start text-left font-normal" />
      </slot>
    </template>

    <div class="min-w-[300px] overflow-hidden">
      <DatePickerLite
        :value="actualValue"
        :mode="mode"
        :min-date="minDate"
        class="w-full"
        :minuteInterval="minuteInterval"
        timeFormat="12h"
        @change="handleDateChange" />
    </div>
  </Dropdown>
</template>

