<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './BasicDemo.vue?raw'

const file = ref<FilePickerValue | null>(null)
</script>

<!-- @demo-snippet Basic Dropzone -->
<template>
  <DemoSection title="Basic Dropzone" :code="sourceCode">
    <div class="w-full max-w-lg">
      <FilePicker v-model="file" allow-rename />
    </div>
  </DemoSection>
</template>
