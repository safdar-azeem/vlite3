<script setup lang="ts">
import { computed } from 'vue'
import type { DatePickerMode } from 'v-datepicker-lite/types'
import Button from './Button.vue'
import type { ButtonSize, ButtonVariant } from '@/types'
import { Dropdown } from './Dropdown'
import DatePicker, { TimePicker } from 'v-datepicker-lite'
import 'v-datepicker-lite/style.css'
import { $t } from '@/utils/i18n'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    placeholderI18n?: string
    modelValue?: any
    value?: any
    mode: DatePickerMode
    minDate?: string
    maxDate?: string
    disabledDates?: { start: string; end?: string }[]
    icon?: string
    size?: ButtonSize
    variant?: ButtonVariant
    btnProps?: any
    teleport?: boolean
    minuteInterval?: number
    timeFormat?: '12h' | '24h'
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    minuteInterval: 5,
    teleport: true,
    timeFormat: '12h',
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

  if (props.mode === 'time') return actualValue.value

  try {
    const d = new Date(actualValue.value)
    if (isNaN(d.getTime())) return String(actualValue.value)

    const showTime = props.mode === 'dateTime' && hasTimePart(actualValue.value)

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(showTime
        ? { hour: '2-digit', minute: '2-digit', hour12: props.timeFormat === '12h' }
        : {}),
    })
  } catch (e) {
    return String(actualValue.value)
  }
})

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) return $t(props.placeholderI18n)
  if (props.placeholder) return props.placeholder
  const res = $t('vlite.datePicker.placeholder')
  return res !== 'vlite.datePicker.placeholder' ? res : 'Select date'
})

const handleDateChange = (val: any) => {
  actualValue.value = val
}
</script>

<template>
  <Dropdown
    position="bottom-start"
    class="w-full"
    v-if="mode !== 'time'"
    maxHeight="max-h-[500px]"
    :teleport="teleport"
    :disabled="disabled || readonly">
    <template #trigger>
      <slot :value="actualValue" :displayValue="displayValue">
        <Button
          :text="displayValue || displayPlaceholder"
          :variant="variant || 'outline'"
          :size="size || 'md'"
          :icon="icon || 'lucide:calendar'"
          :disabled="disabled"
          v-bind="btnProps"
          class="w-full justify-start text-left font-normal" />
      </slot>
    </template>

    <div class="overflow-hidden min-w-[300px]">
      <DatePicker
        :value="actualValue"
        :mode="mode"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        class="w-full"
        :minuteInterval="minuteInterval"
        time-format="12h"
        :disabled="disabled"
        :readonly="readonly"
        @change="handleDateChange" />
    </div>
  </Dropdown>
  <TimePicker
    v-else
    v-model:model-value="actualValue"
    :mode="mode"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    class="w-full"
    :minuteInterval="minuteInterval"
    time-format="12h"
    :disabled="disabled"
    :readonly="readonly"
    @update:modelValue="handleDateChange">
    <Button
      :text="displayValue || displayPlaceholder"
      :variant="variant || 'outline'"
      :size="size || 'md'"
      :icon="icon || (mode === 'time' ? 'lucide:clock' : 'lucide:calendar')"
      :disabled="disabled"
      v-bind="btnProps"
      class="w-full justify-start text-left font-normal" />
  </TimePicker>
</template>

