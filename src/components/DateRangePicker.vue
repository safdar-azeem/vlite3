<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dropdown } from './Dropdown'
import Button from './Button.vue'
import Icon from './Icon.vue'
import type { ButtonSize, ButtonVariant, IDropdownOption } from '@/types'
import { $t } from '@/utils/i18n'
import VDatePicker from 'v-datepicker-lite'
import 'v-datepicker-lite/style.css'

export interface DateRange {
  startDate: any
  endDate: any
}

const props = withDefaults(
  defineProps<{
    modelValue?: DateRange | null
    placeholderStart?: string
    placeholderEnd?: string
    minDate?: string
    maxDate?: string
    disabled?: boolean
    readonly?: boolean
    size?: ButtonSize
    variant?: ButtonVariant
    showQuickRanges?: boolean
    triggerClass?: string
  }>(),
  {
    showQuickRanges: true,
    placeholderStart: 'Start Date',
    placeholderEnd: 'End Date',
  }
)

const emit = defineEmits(['update:modelValue', 'change'])

const isDropdownOpen = ref(false)
const pickerKey = ref(0) // Used to force-sync the opaque VDatePicker components

// Ensure date pickers re-sync and reflect the correct date whenever the dropdown opens
watch(isDropdownOpen, (isOpen) => {
  if (isOpen) {
    pickerKey.value++
  }
})

const range = computed({
  get: () => {
    const val = props.modelValue
    if (!val) return { startDate: null, endDate: null }
    // Add graceful fallback parsing for old data structures if they sneak in
    return {
      startDate: val.startDate !== undefined ? val.startDate : (val as any).start,
      endDate: val.endDate !== undefined ? val.endDate : (val as any).end,
    }
  },
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const updateStartDate = (val: any) => {
  range.value = { ...range.value, startDate: val }
}

const updateEndDate = (val: any) => {
  range.value = { ...range.value, endDate: val }
}

const startMaxDate = computed(() => {
  if (range.value.endDate) {
    const d = new Date(range.value.endDate)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return props.maxDate
})

const endMinDate = computed(() => {
  if (range.value.startDate) {
    const d = new Date(range.value.startDate)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return props.minDate
})

const formatDate = (date: any) => {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

const quickRanges = computed<IDropdownOption[]>(() => [
  {
    label:
      $t('vlite.dateRangePicker.today') !== 'vlite.dateRangePicker.today'
        ? $t('vlite.dateRangePicker.today')
        : 'Today',
    value: 'today',
    icon: 'lucide:calendar',
  },
  {
    label:
      $t('vlite.dateRangePicker.yesterday') !== 'vlite.dateRangePicker.yesterday'
        ? $t('vlite.dateRangePicker.yesterday')
        : 'Yesterday',
    value: 'yesterday',
    icon: 'lucide:calendar-minus',
  },
  {
    label:
      $t('vlite.dateRangePicker.last7Days') !== 'vlite.dateRangePicker.last7Days'
        ? $t('vlite.dateRangePicker.last7Days')
        : 'Last 7 Days',
    value: 'last_7_days',
    icon: 'lucide:calendar-days',
  },
  {
    label:
      $t('vlite.dateRangePicker.last30Days') !== 'vlite.dateRangePicker.last30Days'
        ? $t('vlite.dateRangePicker.last30Days')
        : 'Last 30 Days',
    value: 'last_30_days',
    icon: 'lucide:calendar-days',
  },
  {
    label:
      $t('vlite.dateRangePicker.thisMonth') !== 'vlite.dateRangePicker.thisMonth'
        ? $t('vlite.dateRangePicker.thisMonth')
        : 'This Month',
    value: 'this_month',
    icon: 'lucide:calendar-range',
  },
  {
    label:
      $t('vlite.dateRangePicker.lastMonth') !== 'vlite.dateRangePicker.lastMonth'
        ? $t('vlite.dateRangePicker.lastMonth')
        : 'Last Month',
    value: 'last_month',
    icon: 'lucide:calendar-range',
  },
  {
    label:
      $t('vlite.dateRangePicker.last6Months') !== 'vlite.dateRangePicker.last6Months'
        ? $t('vlite.dateRangePicker.last6Months')
        : 'Last 6 Months',
    value: 'last_6_months',
    icon: 'lucide:history',
  },
  {
    label:
      $t('vlite.dateRangePicker.thisYear') !== 'vlite.dateRangePicker.thisYear'
        ? $t('vlite.dateRangePicker.thisYear')
        : 'This Year',
    value: 'this_year',
    icon: 'lucide:calendar-check',
  },
  {
    label:
      $t('vlite.dateRangePicker.lastYear') !== 'vlite.dateRangePicker.lastYear'
        ? $t('vlite.dateRangePicker.lastYear')
        : 'Last Year',
    value: 'last_year',
    icon: 'lucide:history',
  },
])

const handleQuickRangeSelect = (option: IDropdownOption) => {
  const today = new Date()
  let startDate = new Date()
  let endDate = new Date()

  today.setHours(0, 0, 0, 0)
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  switch (option.value) {
    case 'today':
      startDate = new Date(today)
      endDate = new Date(today)
      break
    case 'yesterday':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 1)
      endDate = new Date(startDate)
      break
    case 'last_7_days':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 6)
      endDate = new Date(today)
      break
    case 'last_30_days':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 29)
      endDate = new Date(today)
      break
    case 'this_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today)
      break
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'last_6_months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1)
      endDate = new Date(today)
      break
    case 'this_year':
      startDate = new Date(today.getFullYear(), 0, 1)
      endDate = new Date(today)
      break
    case 'last_year':
      startDate = new Date(today.getFullYear() - 1, 0, 1)
      endDate = new Date(today.getFullYear() - 1, 11, 31)
      break
  }

  range.value = { startDate, endDate }
  pickerKey.value++ // Force pickers to refresh natively to reflect exact quick range selection
  isDropdownOpen.value = false
}
</script>

<template>
  <Dropdown
    v-model:isOpen="isDropdownOpen"
    position="bottom-start"
    :disabled="disabled || readonly"
    class="w-full sm:w-auto inline-block"
    maxHeight="none">
    <template #trigger="{ isOpen }">
      <Button
        icon="lucide:calendar"
        :variant="variant || 'outline'"
        :size="size || 'md'"
        :disabled="disabled"
        class="w-full justify-between text-left font-normal"
        :class="[triggerClass, { 'ring-1 ring-ring ring-offset-[1]': isOpen }]">
        <div class="flex items-center justify-start gap-2 w-full">
          <span :class="{ 'text-muted-foreground': !range.startDate }">
            {{ range.startDate ? formatDate(range.startDate) : placeholderStart }}
          </span>
          —
          <span :class="{ 'text-muted-foreground': !range.endDate }">
            {{ range.endDate ? formatDate(range.endDate) : placeholderEnd }}
          </span>
        </div>
      </Button>
    </template>

    <template #menu>
      <div class="flex flex-col sm:flex-row bg-background rounded-md">
        <div
          v-if="showQuickRanges"
          class="flex flex-col gap-1 sm:pr-3 py-2 sm:border-r border-border max-h-[280px]">
          <div
            class="text-xs pl-2 pb-2 font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Ranges
          </div>
          <Button
            v-for="rangeOption in quickRanges"
            :key="rangeOption.value"
            :text="rangeOption.label"
            :icon="rangeOption.icon"
            variant="ghost"
            size="sm"
            class="justify-start w-full font-normal"
            @click="handleQuickRangeSelect(rangeOption)" />
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 py-2 p-3">
          <div class="border border-border rounded-md overflow-hidden bg-background">
            <VDatePicker
              :key="'start-' + pickerKey"
              :value="range.startDate"
              @change="updateStartDate"
              mode="date"
              :max-date="startMaxDate"
              :min-date="minDate"
              :disabled="disabled"
              class="min-w-[270px]"
              :readonly="readonly" />
          </div>

          <div class="flex items-center justify-center shrink-0">
            <Icon
              icon="lucide:arrow-right"
              class="w-5 h-5 text-muted-foreground hidden sm:block opacity-50" />
            <Icon
              icon="lucide:arrow-down"
              class="w-5 h-5 text-muted-foreground sm:hidden opacity-50" />
          </div>

          <div class="border border-border rounded-md overflow-hidden bg-background">
            <VDatePicker
              :key="'end-' + pickerKey"
              :value="range.endDate"
              @change="updateEndDate"
              mode="date"
              :min-date="endMinDate"
              :max-date="maxDate"
              class="min-w-[270px]"
              :disabled="disabled"
              :readonly="readonly" />
          </div>
        </div>
      </div>
    </template>
  </Dropdown>
</template>
