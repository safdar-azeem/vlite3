<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './FileTypesDemo.vue?raw'

const imageFile = ref<FilePickerValue | null>(null)
const docFile = ref<FilePickerValue | null>(null)

const handleError = (err: string) => alert(err)
</script>

<!-- @demo-snippet File Type Restrictions -->
<template>
  <DemoSection title="File Type Restrictions" :code="sourceCode">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Images only</p>
        <FilePicker
          v-model="imageFile"
          :file-types="['image/*']"
          @error="handleError"
        />
      </div>
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">PDF &amp; Word only</p>
        <FilePicker
          v-model="docFile"
          :file-types="['.pdf', '.doc', '.docx']"
          @error="handleError"
        />
      </div>
    </div>
  </DemoSection>
</template>
