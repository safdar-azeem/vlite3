<script setup lang="ts">
import { ref } from 'vue'
import DateRangePicker, { type DateRange } from '@/components/DateRangePicker.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DateRangePickerDemo.vue?raw'

const basicRange = ref<DateRange>({ start: null, end: null })
const prefilledRange = ref<DateRange>({
  start: new Date(new Date().setDate(new Date().getDate() - 7)),
  end: new Date()
})
const withoutQuickRanges = ref<DateRange>({ start: null, end: null })
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">DateRangePicker</h2>
      <p class="text-gray-500">
        A unified component for selecting a start and end date, housed inside a clean dropdown with quick range presets.
      </p>
    </div>

    <DemoSection title="Basic Range Selection" :code="sourceCode">
      <div class="space-y-4">
        <DateRangePicker v-model="basicRange" />
        <div class="bg-muted p-3 rounded-md text-xs font-mono text-muted-foreground max-w-2xl">
          Output:
          <pre class="mt-1">{{ JSON.stringify(basicRange, null, 2) }}</pre>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Prefilled with Default Values" :code="sourceCode">
      <div class="space-y-4">
        <DateRangePicker v-model="prefilledRange" />
      </div>
    </DemoSection>

    <DemoSection title="Without Quick Ranges" :code="sourceCode">
      <div class="space-y-4">
        <DateRangePicker v-model="withoutQuickRanges" :show-quick-ranges="false" />
      </div>
    </DemoSection>
  </div>
</template>
