<script setup lang="ts">
import { ref, computed } from 'vue'
import { $t } from '@/utils/i18n'
import CommentItem from './CommentItem.vue'
import CommentEditor from './CommentEditor.vue'
import type { CommentNode, CommentActionPayload, CommentAuthor, CommentSubmitPayload } from './types'

export interface CommentThreadProps {
  comments: CommentNode[]
  /** Object of currently logged-in user — controls edit/delete visibility and shows avatar in input */
  currentUser?: CommentAuthor | null
  threaded?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowReply?: boolean
  /** Admin override — show delete on all comments */
  allowDeleteAll?: boolean
  /** Admin override — show edit on all comments */
  allowEditAll?: boolean
  confirmDelete?: boolean
  /** Where to display the root input. Set to 'hidden' to disable. */
  inputPosition?: 'top' | 'bottom' | 'hidden'
  folderId?: string
  maxFileSize?: number
  allowFileUpload?: boolean
  class?: string
  emptyText?: string
  emptyTextI18n?: string
  placeholder?: string
  placeholderI18n?: string
  replyPlaceholder?: string
  replyPlaceholderI18n?: string
  editPlaceholder?: string
  editPlaceholderI18n?: string
  replyText?: string
  replyTextI18n?: string
  editedText?: string
  editedTextI18n?: string
  editingText?: string
  editingTextI18n?: string
  cancelText?: string
  cancelTextI18n?: string
  cancelEditText?: string
  cancelEditTextI18n?: string
}

const props = withDefaults(defineProps<CommentThreadProps>(), {
  currentUser: null,
  threaded: true,
  allowDelete: true,
  allowEdit: true,
  allowReply: true,
  allowDeleteAll: false,
  allowEditAll: false,
  confirmDelete: true,
  inputPosition: 'top',
  allowFileUpload: true,
  class: '',
})

const emit = defineEmits<{
  (e: 'add', payload: CommentSubmitPayload): void
  (e: 'edit', updatedComment: CommentNode): void
  (e: 'delete', id: string | number): void
}>()

const activeReplyId = ref<string | number | null>(null)
const activeEditId = ref<string | number | null>(null)

const displayEmptyText = computed(() => {
  if (props.emptyTextI18n) {
    const res = $t(props.emptyTextI18n)
    if (res !== props.emptyTextI18n) return res
  }
  if (props.emptyText) return props.emptyText
  const globalRes = $t('vlite.comment.empty')
  return globalRes !== 'vlite.comment.empty' ? globalRes : 'No comments yet. Start the conversation!'
})

const handleReplyOpen = (payload: CommentActionPayload) => {
  if (activeReplyId.value === payload.commentId) {
    activeReplyId.value = null
    return
  }
  activeReplyId.value = payload.commentId
  activeEditId.value = null
}

const handleEditOpen = (payload: CommentActionPayload) => {
  if (activeEditId.value === payload.commentId) {
    activeEditId.value = null
    return
  }
  activeEditId.value = payload.commentId
  activeReplyId.value = null
}

const clearActiveReply = () => {
  activeReplyId.value = null
}

const clearActiveEdit = () => {
  activeEditId.value = null
}

const handleRootSubmit = (text: string, attachments?: any[]) => {
  emit('add', { text, attachments })
}

const handleReplySubmit = (text: string, attachments: any[] | undefined, parentId: string | number) => {
  emit('add', { text, attachments, parentId })
  clearActiveReply()
}

const handleEditSubmit = (text: string, attachments: any[] | undefined, comment: CommentNode) => {
  emit('edit', { ...comment, text, isEdited: true })
  clearActiveEdit()
}

defineExpose({
  clearActiveReply,
  clearActiveEdit,
  activeReplyId,
  activeEditId
})
</script>

<template>
  <div class="vl-comment-thread flex flex-col w-full" :class="props.class">
    
    <!-- Top Input -->
    <div class="mb-8" v-if="inputPosition === 'top'">
      <CommentEditor 
        variant="root"
        :current-user="currentUser"
        :folder-id="folderId"
        :max-file-size="maxFileSize"
        :allow-file-upload="allowFileUpload"
        :placeholder="placeholder"
        :placeholder-i18n="placeholderI18n"
        :editing-text="editingText"
        :editing-text-i18n="editingTextI18n"
        :cancel-edit-text="cancelEditText"
        :cancel-edit-text-i18n="cancelEditTextI18n"
        :cancel-text="cancelText"
        :cancel-text-i18n="cancelTextI18n"
        @submit="handleRootSubmit"
      />
    </div>

    <div v-if="comments.length === 0" class="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-border rounded-xl border-dashed">
      <p class="text-sm text-muted-foreground">{{ displayEmptyText }}</p>
    </div>

    <!-- The actual Thread mapping -->
    <div v-else class="flex flex-col w-full">
      <CommentItem 
        v-for="comment in comments" 
        :key="comment.id"
        :comment="comment"
        :current-user="currentUser"
        :threaded="threaded"
        :allow-delete="allowDelete"
        :allow-edit="allowEdit"
        :allow-reply="allowReply"
        :allow-delete-all="allowDeleteAll"
        :allow-edit-all="allowEditAll"
        :confirm-delete="confirmDelete"
        :active-reply-id="activeReplyId"
        :active-edit-id="activeEditId"
        :folder-id="folderId"
        :max-file-size="maxFileSize"
        :allow-file-upload="allowFileUpload"
        :reply-placeholder="replyPlaceholder"
        :reply-placeholder-i18n="replyPlaceholderI18n"
        :edit-placeholder="editPlaceholder"
        :edit-placeholder-i18n="editPlaceholderI18n"
        :reply-text="replyText"
        :reply-text-i18n="replyTextI18n"
        :edited-text="editedText"
        :edited-text-i18n="editedTextI18n"
        :editing-text="editingText"
        :editing-text-i18n="editingTextI18n"
        :cancel-text="cancelText"
        :cancel-text-i18n="cancelTextI18n"
        :cancel-edit-text="cancelEditText"
        :cancel-edit-text-i18n="cancelEditTextI18n"
        @reply="handleReplyOpen"
        @edit="handleEditOpen"
        @delete="(id) => emit('delete', id)"
        @submit-reply="handleReplySubmit"
        @submit-edit="handleEditSubmit"
        @cancel-reply="clearActiveReply"
        @cancel-edit="clearActiveEdit"
      />
    </div>

    <!-- Bottom Input -->
    <div class="mt-4" v-if="inputPosition === 'bottom'">
      <CommentEditor 
        variant="root"
        :current-user="currentUser"
        :folder-id="folderId"
        :max-file-size="maxFileSize"
        :allow-file-upload="allowFileUpload"
        :placeholder="placeholder"
        :placeholder-i18n="placeholderI18n"
        :editing-text="editingText"
        :editing-text-i18n="editingTextI18n"
        :cancel-edit-text="cancelEditText"
        :cancel-edit-text-i18n="cancelEditTextI18n"
        :cancel-text="cancelText"
        :cancel-text-i18n="cancelTextI18n"
        @submit="handleRootSubmit"
      />
    </div>
  </div>
</template>
