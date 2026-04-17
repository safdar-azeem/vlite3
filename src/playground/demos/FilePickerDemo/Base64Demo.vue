<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './Base64Demo.vue?raw'

const file = ref<FilePickerValue | null>(null)
</script>

<!-- @demo-snippet Base64 Return Format -->
<template>
  <DemoSection title="Base64 Return Format" :code="sourceCode">
    <div class="w-full max-w-lg space-y-4">
      <FilePicker v-model="file" :file-types="['image/*']" return-format="base64" />

      <!-- Image preview from base64 output -->
      <div v-if="file?.base64" class="rounded-lg border border-border overflow-hidden">
        <p class="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border bg-muted/30">
          Preview (from base64)
        </p>
        <div class="p-3">
          <img :src="file.base64" class="h-28 w-auto rounded object-cover" :alt="file.fileName" />
        </div>
      </div>
    </div>
  </DemoSection>
</template>
