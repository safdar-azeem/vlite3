<script setup lang="ts">
import DatePicker from '@/components/DatePicker.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DatePickerDemo.vue?raw'

const today = new Date()

const dateValue = ref<string | null>(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
)
const weekValue = ref<{ startDate: string; endDate: string } | null>(null)
const monthValue = ref<string | null>(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
)
const time12hValue = ref<string>('22:05')
const time24hValue = ref<string>('22:05')
const dateTimeValue = ref<Date | null>(today)
const interval15mValue = ref<Date | null>(today)
const interval30mValue = ref<string>('10:30')
const restrictedValue = ref<string | null>(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
)

const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const disabledDates = [
  {
    start: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0],
    end: new Date(today.getFullYear(), today.getMonth(), 20).toISOString().split('T')[0],
  },
  { start: new Date(today.getFullYear(), today.getMonth(), 25).toISOString().split('T')[0] },
]

// Accepts string "YYYY-MM-DD" or Date — always formats safely without timezone drift
const fmtDate = (val: string | Date | null | undefined): string => {
  if (!val) return 'null'
  if (typeof val === 'string') {
    const [y, m, d] = val.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString()
  }
  return val.toLocaleDateString()
}

const formatWeekValue = (val: { startDate: string; endDate: string } | null) => {
  if (!val) return 'null'
  return `{ startDate: ${fmtDate(val.startDate)}, endDate: ${fmtDate(val.endDate)} }`
}
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">DatePicker</h2>
      <p class="text-gray-500">
        A comprehensive component for selecting dates, times, and date ranges.
      </p>
    </div>

    <DemoSection title="DatePicker Variants & Modes" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Date Mode</h3>
          <DatePicker v-model="dateValue" mode="date" placeholder="Select date" />
          <p class="text-xs text-gray-500">Value: {{ fmtDate(dateValue) }}</p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Week Mode</h3>
          <DatePicker v-model="weekValue" mode="week" placeholder="Select week" />
          <p class="text-xs text-gray-500">Value: {{ formatWeekValue(weekValue) }}</p>
          <p class="text-xs text-blue-500">
            Returns both the first and last date of the selected week.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Month Mode</h3>
          <DatePicker v-model="monthValue" mode="month" placeholder="Select month" />
          <p class="text-xs text-gray-500">Value: {{ fmtDate(monthValue) }}</p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">DateTime Mode</h3>
          <DatePicker v-model="dateTimeValue" mode="dateTime" placeholder="Select date & time" />
          <p class="text-xs text-gray-500">
            Value: {{ dateTimeValue ? dateTimeValue.toLocaleString() : 'null' }}
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Time Mode (12h Format)</h3>
          <DatePicker
            v-model="time12hValue"
            mode="time"
            time-format="12h"
            placeholder="Select time" />
          <p class="text-xs text-gray-500">Value: {{ time12hValue }}</p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Time Mode (24h Format)</h3>
          <DatePicker
            v-model="time24hValue"
            mode="time"
            time-format="24h"
            placeholder="Select time" />
          <p class="text-xs text-gray-500">Value: {{ time24hValue }}</p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Time Interval (15 mins)</h3>
          <DatePicker
            v-model="interval15mValue"
            mode="dateTime"
            :minute-interval="15"
            placeholder="15 min intervals" />
          <p class="text-xs text-gray-500">
            Value: {{ interval15mValue ? interval15mValue.toLocaleString() : 'null' }}
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Time Interval (30 mins)</h3>
          <DatePicker
            v-model="interval30mValue"
            mode="time"
            :minute-interval="30"
            placeholder="30 min intervals" />
          <p class="text-xs text-gray-500">Value: {{ interval30mValue }}</p>
        </div>

        <div class="space-y-2 md:col-span-2">
          <h3 class="text-sm font-semibold text-gray-900">With Restrictions</h3>
          <div class="md:w-1/2 pr-4">
            <DatePicker
              v-model="restrictedValue"
              mode="date"
              :min-date="minDate"
              :disabled-dates="disabledDates"
              placeholder="Restricted dates" />
          </div>
          <p class="text-xs text-gray-500 mt-2 leading-relaxed">
            Min date is set to <strong>Today</strong>.<br />
            Disabled dates: <strong>15th to 20th</strong> and <strong>25th</strong> of the current
            month.
          </p>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
