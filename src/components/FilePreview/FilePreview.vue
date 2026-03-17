<script setup lang="ts">
import { VFileViewer } from 'v-file-preview'
import 'v-file-preview/dist/style.css'
import type { FilePreviewProps } from './types'

const props = defineProps<FilePreviewProps>()
</script>

<template>
  <div class="flex flex-col h-[70vh] w-full min-h-[400px]">
    <div
      class="flex-1 relative bg-muted/10 rounded-lg border border-border overflow-hidden flex items-center justify-center">
      <div class="w-full h-full overflow-auto">
        <VFileViewer :url="url" :name="name" />
      </div>
    </div>
  </div>
</template>
