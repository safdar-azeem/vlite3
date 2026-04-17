<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './MultiSelectDemo.vue?raw'

const files = ref<FilePickerValue[] | null>(null)
</script>

<!-- @demo-snippet Multi-Select & Max Files -->
<template>
  <DemoSection title="Multi-Select & Max Files" :code="sourceCode">
    <div class="w-full max-w-lg">
      <!-- max 3 files, no size limit -->
      <FilePicker v-model="files" multi-select :max-files="3" />
      <p v-if="files?.length" class="mt-2 text-xs text-muted-foreground">
        {{ files.length }} / 3 files selected
      </p>
    </div>
  </DemoSection>
</template>
