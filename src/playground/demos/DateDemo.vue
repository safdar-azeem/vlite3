<script setup lang="ts">
import { ref } from 'vue'
import { Date as FormattedDate } from '@/components/Date'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import { updateConfig, useVLiteConfig } from '@/core'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DateDemo.vue?raw'

const today = new Date()
const config = useVLiteConfig()

const setGlobalFormat = (format: string) => {
  updateConfig({
    components: {
      date: {
        format: format
      }
    }
  })
}
</script>

<template>
  <div class="space-y-10 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold mb-1">Date</h2>
      <p class="text-gray-500 text-sm">
        A utility component to consistently format dates powered by <code>dayjs</code>. It inherits its format from the global configuration, but can be overridden seamlessly via props.
      </p>
    </div>

    <DemoSection title="Basic Usage (Default Global Config)" :code="sourceCode">
      <div class="flex items-center gap-8 text-xl font-medium">
        <FormattedDate :value="today" />
      </div>
    </DemoSection>

    <DemoSection title="Custom Format Overrides (Local Props)" :code="sourceCode">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-base font-medium">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">MM/DD/YYYY</span>
          <FormattedDate :value="today" format="MM/DD/YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">DD/MM/YYYY</span>
          <FormattedDate :value="today" format="DD/MM/YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">DD-MM-YYYY</span>
          <FormattedDate :value="today" format="DD-MM-YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">MM-DD-YYYY</span>
          <FormattedDate :value="today" format="MM-DD-YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">YYYY-MMM-DD</span>
          <FormattedDate :value="today" format="YYYY-MMM-DD" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">MM-DD-YY</span>
          <FormattedDate :value="today" format="MM-DD-YY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">DD.MM.YYYY</span>
          <FormattedDate :value="today" format="DD.MM.YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">DD MM YYYY</span>
          <FormattedDate :value="today" format="DD MM YYYY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground">Full Date & Time</span>
          <FormattedDate :value="today" format="MMMM D, YYYY h:mm A" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Dynamic Global Configuration" :code="sourceCode">
      <div class="space-y-6">
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium">Current Global Format: <strong class="text-primary">{{ config?.components?.date?.format || 'MM/DD/YYYY' }}</strong></span>
          <p class="text-sm text-muted-foreground">Change the application-wide format. DataTables and Lists using type <code>date</code> will automatically adapt.</p>
        </div>

        <div class="flex gap-3 flex-wrap">
          <Button variant="outline" @click="setGlobalFormat('MM/DD/YYYY')">US: MM/DD/YYYY</Button>
          <Button variant="outline" @click="setGlobalFormat('DD/MM/YYYY')">EU: DD/MM/YYYY</Button>
          <Button variant="outline" @click="setGlobalFormat('YYYY-MM-DD')">ISO: YYYY-MM-DD</Button>
          <Button variant="outline" @click="setGlobalFormat('MMMM D, YYYY')">Word: MMMM D, YYYY</Button>
        </div>

        <div class="p-6 border border-border rounded-xl bg-card shadow-sm flex items-center gap-8 text-2xl font-semibold text-foreground">
          <FormattedDate :value="today" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
