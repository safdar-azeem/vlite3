<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '../Modal.vue'
import Icon from '../Icon.vue'
import Button from '../Button.vue'
import { $t } from '@/utils/i18n'
import { downloadFile } from '@/utils/functions'
import { FilePreview } from '../FilePreview'
import { getFileTypeIcon } from './fileTypeIcon'
import type { AttachmentsListProps, AttachmentItem } from './'

const props = withDefaults(defineProps<AttachmentsListProps>(), {
  canView: true,
  canDownload: true,
  variant: 'default',
  size: 'md',
  clickToPreview: false,
  showDownloadInList: true,
  rootClass: '',
  gridClass: '',
  cardClass: '',
  cardThumbnailClass: '',
  cardInfoClass: '',
  cardActionsClass: '',
  listClass: '',
  itemClass: '',
  itemIconBoxClass: '',
  itemNameClass: '',
  itemSizeClass: '',
  itemActionsClass: '',
  emptyClass: '',
})

// Tracks which file index has its preview modal open (for programmatic open via clickToPreview)
const activePreviewIndex = ref<number | null>(null)

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
  if (file.fileUrl && file.fileUrl !== '#') {
    await downloadFile(file.fileUrl, file.fileName || 'attachment')
  }
}

const isImage = (file: AttachmentItem) => {
  if (file.fileType && file.fileType.startsWith('image/')) return true
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(file.fileUrl || '')
}

// Opens the preview for a given index when clickToPreview is enabled
const openPreview = (index: number) => {
  if (props.clickToPreview && props.canView) {
    activePreviewIndex.value = index
  }
}

const closePreview = () => {
  activePreviewIndex.value = null
}

// Compute sizing classes for list/inline views
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        item: 'pl-2 pr-2.5 py-1.5 gap-1.5',
        iconBox: 'w-7 h-7 rounded',
        icon: 'w-3 h-3',
        text: 'text-[12px]',
        subtext: 'text-[9px]',
        actions: 'w-5 h-5 !min-w-[16px] !min-h-[16px]',
        actionIcon: 'w-3.5 h-3.5',
      }
    case 'lg':
      return {
        item: 'pl-3.5 pr-3 py-3 gap-3',
        iconBox: 'w-11 h-11 rounded-lg',
        icon: 'w-5 h-5',
        text: 'text-sm',
        subtext: '-text-fs-3.5',
        actions: 'w-7.5 h-8',
        actionIcon: 'w-4 h-4',
      }
    case 'md':
    default:
      return {
        item: 'px-2.5 py-2.5 gap-2',
        iconBox: 'w-9 h-9 rounded-md',
        icon: 'w-4 h-4',
        text: '-text-fs-2',
        subtext: 'text-[10px]',
        actions: 'w-7 h-7 !min-w-[20px] !min-h-[20px]',
        actionIcon: 'w-4 h-4',
      }
  }
})

// Whether the eye/view action button should be shown in list rows
const showViewAction = computed(() => props.canView && !props.clickToPreview)

// Whether the download action button should be shown in list rows
const showDownloadAction = computed(() => props.canDownload && props.showDownloadInList)

// Whether the actions column has any buttons to show at all
const hasListActions = computed(() => showViewAction.value || showDownloadAction.value)
</script>

<template>
  <!-- vl-attachments-list: root wrapper -->
  <div class="vl-attachments-list w-full" :class="rootClass">
    <template v-if="normalizedAttachments.length > 0">
      <!-- ────────────────────────────────────────────────── CARD VARIANT ── -->
      <!-- vl-attachments-list__grid: card grid container -->
      <div
        v-if="variant === 'card'"
        class="vl-attachments-list__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        :class="gridClass">
        <!-- vl-attachments-list__card: individual card item -->
        <div
          v-for="(file, index) in normalizedAttachments"
          :key="index"
          class="vl-attachments-list__card relative group rounded-xl border border-border bg-body overflow-hidden hover:shadow-md transition-all flex flex-col"
          :class="[{ 'cursor-pointer': clickToPreview && canView }, cardClass]"
          @click="openPreview(index)">
          <!-- vl-attachments-list__card-thumbnail: card preview/image area -->
          <div
            class="vl-attachments-list__card-thumbnail h-40 w-full bg-muted/30 flex items-center justify-center overflow-hidden relative border-b border-border"
            :class="cardThumbnailClass">
            <img
              v-if="isImage(file)"
              :src="file.thumbnailUrl || file.fileUrl"
              class="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <Icon
              v-else
              :icon="getFileTypeIcon(file.fileName, file.fileUrl, file.fileType)"
              class="w-12 h-12 text-muted-foreground/40 transition-transform group-hover:scale-110" />

            <!-- vl-attachments-list__card-actions: overlay actions (hidden when clickToPreview) -->
            <div
              v-if="!clickToPreview"
              class="vl-attachments-list__card-actions absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="cardActionsClass">
              <Modal
                v-if="canView"
                :title="file.fileName || $t('common.words.preview', 'Preview')"
                max-width="max-w-3xl"
                :body="FilePreview"
                :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }">
                <template #trigger>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon="lucide:eye"
                    class="h-7 w-7 px-0 rounded-md shadow-sm" />
                </template>
              </Modal>
              <Button
                v-if="canDownload"
                variant="secondary"
                size="xs"
                icon="lucide:download"
                class="h-7 w-7 px-0 rounded-md shadow-sm"
                @click.stop="handleDownload(file)" />
            </div>
          </div>

          <!-- vl-attachments-list__card-info: card footer with name/size -->
          <div
            class="vl-attachments-list__card-info p-3 flex flex-col min-w-0"
            :class="cardInfoClass">
            <!-- vl-attachments-list__item-name: file name text -->
            <span
              class="vl-attachments-list__item-name text-sm font-medium truncate"
              :title="file.fileName">
              {{ file.fileName || 'Unnamed File' }}
            </span>
            <!-- vl-attachments-list__item-size: file size text -->
            <span class="vl-attachments-list__item-size text-xs text-muted-foreground mt-0.5">
              {{ formatSize(file.fileSize) }}
            </span>
          </div>

          <!-- Programmatic preview modal for clickToPreview mode -->
          <Modal
            v-if="clickToPreview && canView"
            :show="activePreviewIndex === index"
            :title="file.fileName || $t('common.words.preview', 'Preview')"
            max-width="max-w-3xl"
            :body="FilePreview"
            :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }"
            @close="closePreview" />
        </div>
      </div>

      <!-- ───────────────────────────── DEFAULT / LIST / INLINE VARIANTS ── -->
      <!-- vl-attachments-list__list: vertical list container -->
      <div v-else class="vl-attachments-list__list flex flex-col gap-1.5" :class="listClass">
        <!-- vl-attachments-list__item: individual list row -->
        <div
          v-for="(file, index) in normalizedAttachments"
          :key="index"
          class="vl-attachments-list__item flex items-center justify-between transition-colors rounded-lg"
          :class="[
            variant === 'inline'
              ? 'bg-[#79797924] hover:bg-[#7979793f]'
              : 'border border-border bg-muted/20 hover:bg-muted/40',
            sizeClasses.item,
            clickToPreview && canView ? 'cursor-pointer select-none' : '',
            itemClass,
          ]"
          @click="openPreview(index)">
          <div class="flex items-center gap-3 overflow-hidden min-w-0">
            <!-- vl-attachments-list__item-icon-box: icon/thumbnail container -->
            <div
              class="vl-attachments-list__item-icon-box flex items-center justify-center shrink-0 overflow-hidden relative"
              :class="[
                sizeClasses.iconBox,
                variant === 'inline' ? 'bg-[#79797924] hover:bg-[#7979793f]' : 'bg-primary/10',
                itemIconBoxClass,
              ]">
              <img
                v-if="isImage(file)"
                :src="file.thumbnailUrl || file.fileUrl"
                class="w-full h-full object-cover" />
              <Icon
                v-else
                :icon="getFileTypeIcon(file.fileName, file.fileUrl, file.fileType)"
                :class="[sizeClasses.icon, variant === 'inline' ? 'opacity-75' : 'text-primary']" />
            </div>

            <div class="flex flex-col overflow-hidden leading-tight min-w-0">
              <!-- vl-attachments-list__item-name: file name text -->
              <span
                class="vl-attachments-list__item-name font-medium truncate"
                :class="[
                  sizeClasses.text,
                  variant === 'inline' ? '' : 'text-foreground',
                  itemNameClass,
                ]"
                :title="file.fileName">
                {{ file.fileName || 'Unnamed File' }}
              </span>
              <!-- vl-attachments-list__item-size: file size subtext -->
              <span
                class="vl-attachments-list__item-size mt-0.5"
                :class="[
                  sizeClasses.subtext,
                  variant === 'inline' ? 'opacity-50' : 'text-muted-foreground',
                  itemSizeClass,
                ]">
                {{ formatSize(file.fileSize) }}
              </span>
            </div>
          </div>

          <!-- vl-attachments-list__item-actions: action buttons container -->
          <!-- Only rendered when there is at least one visible action -->
          <div
            v-if="hasListActions"
            class="vl-attachments-list__item-actions flex items-center shrink-0 ml-2"
            :class="[size !== 'lg' ? 'gap-0.5' : 'gap-0', itemActionsClass]"
            @click.stop>
            <template v-if="variant === 'inline'">
              <Modal
                v-if="showViewAction"
                :title="file.fileName || $t('common.words.preview', 'Preview')"
                max-width="max-w-3xl"
                :body="FilePreview"
                :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }">
                <template #trigger>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded opacity-60 hover:opacity-100 bg-transparent! transition-all"
                    :class="sizeClasses.actions"
                    :aria-label="$t('common.words.preview', 'Preview')">
                    <Icon icon="lucide:eye" :class="sizeClasses.actionIcon" />
                  </button>
                </template>
              </Modal>
              <button
                v-if="showDownloadAction"
                type="button"
                class="inline-flex items-center justify-center rounded opacity-60 hover:opacity-100 bg-transparent! transition-all"
                :class="sizeClasses.actions"
                :aria-label="$t('common.words.download', 'Download')"
                @click="handleDownload(file)">
                <Icon icon="lucide:download" :class="sizeClasses.actionIcon" />
              </button>
            </template>

            <template v-else>
              <Modal
                v-if="showViewAction"
                :title="file.fileName || $t('common.words.preview', 'Preview')"
                max-width="max-w-3xl"
                :body="FilePreview"
                :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }">
                <template #trigger>
                  <Button
                    variant="ghost"
                    size="xs"
                    :class="[sizeClasses.actions, 'px-0']"
                    icon="lucide:eye" />
                </template>
              </Modal>
              <Button
                v-if="showDownloadAction"
                variant="ghost"
                size="xs"
                :class="[sizeClasses.actions, 'px-0']"
                icon="lucide:download"
                @click="handleDownload(file)" />
            </template>
          </div>
        </div>

        <!-- Programmatic preview modals for list/inline/default clickToPreview mode -->
        <template v-if="clickToPreview && canView">
          <Modal
            v-for="(file, index) in normalizedAttachments"
            :key="`preview-${index}`"
            :show="activePreviewIndex === index"
            :title="file.fileName || $t('common.words.preview', 'Preview')"
            max-width="max-w-3xl"
            :body="FilePreview"
            :bodyProps="{ url: file.fileUrl, name: file.fileName, canDownload }"
            @close="closePreview" />
        </template>
      </div>
    </template>

    <!-- vl-attachments-list__empty: empty state placeholder -->
    <div
      v-else
      class="vl-attachments-list__empty text-sm text-muted-foreground italic bg-muted/10 p-4 rounded-lg border border-dashed border-border text-center"
      :class="emptyClass">
      {{ $t('common.words.noAttachments', 'No attachments found.') }}
    </div>
  </div>
</template>
