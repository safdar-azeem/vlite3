<script setup lang="ts">
import { computed } from 'vue'
import Button from '../Button.vue'
import Modal from '../Modal.vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'
import { downloadFile } from '@/utils/functions'
import { FilePreview } from '../FilePreview'
import type { AttachmentsListProps, AttachmentItem } from './types'

const props = defineProps<AttachmentsListProps>()

// Normalize attachments to always be an array
const normalizedAttachments = computed<AttachmentItem[]>(() => {
  if (!props.attachments) return []
  return Array.isArray(props.attachments) ? props.attachments : [props.attachments]
})

const formatSize = (bytes?: number) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleDownload = async (file: AttachmentItem) => {
  if (file.fileUrl) {
    // Utilize internal vlite3 util which performs secure blob/fetch programmatic download
    await downloadFile(file.fileUrl, file.fileName || 'attachment')
  }
}
</script>

<template>
  <div class="w-full">
    <div v-if="normalizedAttachments.length > 0" class="flex flex-col gap-2">
      <div
        v-for="(file, index) in normalizedAttachments"
        :key="index"
        class="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
        <div class="flex items-center gap-3 overflow-hidden">
          <div
            class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Icon icon="lucide:file-text" class="w-5 h-5" />
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-medium text-foreground truncate" :title="file.fileName">
              {{ file.fileName || 'Unnamed File' }}
            </span>
            <span class="text-xs text-muted-foreground">
              {{ formatSize(file.fileSize) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <Modal
            :title="file.fileName || $t('common.words.preview', 'Preview')"
            max-width="max-w-3xl"
            :body="FilePreview"
            :bodyProps="{ url: file.fileUrl, name: file.fileName }">
            <template #trigger>
              <Button variant="ghost" size="sm" icon="lucide:eye" />
            </template>
          </Modal>
          <Button
            variant="ghost"
            size="sm"
            icon="lucide:download"
            @click="handleDownload(file)" />
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-sm text-muted-foreground italic bg-muted/10 p-4 rounded-lg border border-dashed border-border text-center">
      {{ $t('common.words.noAttachments', 'No attachments found.') }}
    </div>
  </div>
</template>
