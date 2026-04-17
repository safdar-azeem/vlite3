<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './InputVariantDemo.vue?raw'

const single = ref<FilePickerValue | null>(null)
const multi = ref<FilePickerValue[] | null>(null)
</script>

<!-- @demo-snippet Input Variant -->
<template>
  <DemoSection title="Input Variant" :code="sourceCode">
    <div class="space-y-4 w-full max-w-lg">
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Single file</p>
        <FilePicker v-model="single" variant="input" placeholder="Choose a file…" />
      </div>
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Multi-select</p>
        <FilePicker
          v-model="multi"
          variant="input"
          multi-select
          placeholder="Choose one or more files…"
        />
      </div>
    </div>
  </DemoSection>
</template>
