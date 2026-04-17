<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './CustomTriggerDemo.vue?raw'

const file = ref<FilePickerValue | null>(null)
</script>

<!-- @demo-snippet Custom Trigger Slot -->
<template>
  <DemoSection title="Custom Trigger Slot" :code="sourceCode">
    <FilePicker v-model="file">
      <template #trigger="{ trigger, files, isLoading }">
        <div class="flex items-center gap-3">
          <Button :loading="isLoading" icon="lucide:upload" @click="trigger">
            {{ files?.length ? 'Replace File' : 'Upload File' }}
          </Button>

          <div v-if="files?.length" class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon icon="lucide:check-circle" class="h-4 w-4 text-success shrink-0" />
            <span class="truncate max-w-[200px]">{{ files[0].fileName }}</span>
          </div>
          <span v-else class="text-sm italic text-muted-foreground">No file selected</span>
        </div>
      </template>
    </FilePicker>
  </DemoSection>
</template>
