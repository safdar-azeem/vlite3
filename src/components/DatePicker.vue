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
    mode?: DatePickerMode
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
    mode: 'date',
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

// Returns { startDate: Date, endDate: Date } for week mode given any raw date value (Date, string, or already a range object)
const getWeekRange = (val: any): { startDate: Date; endDate: Date } | null => {
  try {
    // Already a { startDate, endDate } object — use directly (fallback to start/end for backward compat during parsing)
    if (val && typeof val === 'object') {
      const s = val.startDate || val.start
      const e = val.endDate || val.end
      if (s && e) {
        const start = new Date(s)
        const end = new Date(e)
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()))
          return { startDate: start, endDate: end }
      }
    }

    const d = new Date(val)
    if (isNaN(d.getTime())) return null
    const start = new Date(d)
    const end = new Date(d)
    end.setDate(start.getDate() + 6)
    return { startDate: start, endDate: end }
  } catch {
    return null
  }
}

const displayValue = computed(() => {
  if (!actualValue.value) return ''

  if (props.mode === 'time') return actualValue.value

  if (props.mode === 'week') {
    const range = getWeekRange(actualValue.value)
    if (!range) return ''
    const startStr = range.startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const endStr = range.endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${startStr} - ${endStr}`
  }

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
  if (props.placeholder !== undefined) return props.placeholder
  const res = $t('vlite.datePicker.placeholder')
  return res !== 'vlite.datePicker.placeholder' ? res : 'Select date'
})

// In week mode, emit both start and end dates as an object { startDate, endDate }
const handleDateChange = (val: any) => {
  if (props.mode === 'week') {
    const range = getWeekRange(val)
    if (range) {
      actualValue.value = { startDate: range.startDate, endDate: range.endDate }
      return
    }
  }
  actualValue.value = val
}

// For the inner DatePicker, pass only the start Date in week mode to avoid passing the object down
const innerPickerValue = computed(() => {
  if (props.mode === 'week' && actualValue.value && typeof actualValue.value === 'object') {
    return actualValue.value.startDate || actualValue.value.start || actualValue.value
  }
  return actualValue.value
})
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
          :text="displayValue?.replace('-', '—') || displayPlaceholder"
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
        :value="innerPickerValue"
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
