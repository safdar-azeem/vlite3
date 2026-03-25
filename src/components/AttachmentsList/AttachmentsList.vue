<script setup lang="ts">
import { computed } from 'vue'
import Modal from '../Modal.vue'
import Icon from '../Icon.vue'
import Button from '../Button.vue'
import { $t } from '@/utils/i18n'
import { downloadFile } from '@/utils/functions'
import { FilePreview } from '../FilePreview'
import type { AttachmentsListProps, AttachmentItem } from './types'

const props = withDefaults(defineProps<AttachmentsListProps>(), {
  canView: true,
  canDownload: true,
  variant: 'default',
})

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
    await downloadFile(file.fileUrl, file.fileName || 'attachment')
  }
}
</script>

<template>
  <div class="w-full">
    <div v-if="normalizedAttachments.length > 0" class="flex flex-col gap-1.5">
      <div
        v-for="(file, index) in normalizedAttachments"
        :key="index"
        class="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg transition-colors"
        :class="
          variant === 'inline'
            ? 'bg-[#79797924] hover:bg-[#7979793f]'
            : 'border border-border bg-muted/20 hover:bg-muted/40'
        ">
        <!-- File icon + info -->
        <div class="flex items-center gap-2 overflow-hidden min-w-0">
          <div
            class="w-7 h-7 rounded flex items-center justify-center shrink-0"
            :class="variant === 'inline' ? 'bg-[#79797924] hover:bg-[#7979793f]' : 'bg-primary/10'">
            <!-- For inline: use currentColor so icon always contrasts the bubble -->
            <Icon
              icon="lucide:file-text"
              class="w-3.5 h-3.5"
              :class="variant === 'inline' ? 'opacity-75' : 'text-primary'" />
          </div>
          <div class="flex flex-col overflow-hidden leading-tight min-w-0">
            <span
              class="text-xs font-medium truncate"
              :class="variant === 'inline' ? '' : 'text-foreground'"
              :title="file.fileName">
              {{ file.fileName || 'Unnamed File' }}
            </span>
            <span
              class="text-[10px]"
              :class="variant === 'inline' ? 'opacity-50' : 'text-muted-foreground'">
              {{ formatSize(file.fileSize) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-0.5 shrink-0">
          <!-- INLINE variant: raw buttons that inherit currentColor from the bubble -->
          <template v-if="variant === 'inline'">
            <Modal
              v-if="canView"
              :title="file.fileName || $t('common.words.preview', 'Preview')"
              max-width="max-w-3xl"
              :body="FilePreview"
              :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }">
              <template #trigger>
                <button
                  type="button"
                  class="inline-flex items-center justify-center w-6 h-6 rounded opacity-60 hover:opacity-100 bg-transparent! transition-all"
                  :aria-label="$t('common.words.preview', 'Preview')">
                  <Icon icon="lucide:eye" class="w-3.5 h-3.5" />
                </button>
              </template>
            </Modal>
            <button
              v-if="canDownload"
              type="button"
              class="inline-flex items-center justify-center w-6 h-6 rounded opacity-60 hover:opacity-100 bg-transparent! transition-all"
              :aria-label="$t('common.words.download', 'Download')"
              @click="handleDownload(file)">
              <Icon icon="lucide:download" class="w-3.5 h-3.5" />
            </button>
          </template>

          <!-- DEFAULT variant: standard Button component -->
          <template v-else>
            <Modal
              v-if="canView"
              :title="file.fileName || $t('common.words.preview', 'Preview')"
              max-width="max-w-3xl"
              :body="FilePreview"
              :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }">
              <template #trigger>
                <Button variant="ghost" size="xs" icon="lucide:eye" class="h-6 w-6 px-0" />
              </template>
            </Modal>
            <Button
              v-if="canDownload"
              variant="ghost"
              size="xs"
              icon="lucide:download"
              class="h-6 w-6 px-0"
              @click="handleDownload(file)" />
          </template>
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
