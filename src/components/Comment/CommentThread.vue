<script setup lang="ts">
import { ref } from 'vue'
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
        @submit="handleRootSubmit"
      />
    </div>

    <div v-if="comments.length === 0" class="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-border rounded-xl border-dashed">
      <p class="text-sm text-muted-foreground">{{ $t('vlite.comment.noComments', 'No comments yet. Start the conversation!') }}</p>
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
        @submit="handleRootSubmit"
      />
    </div>
  </div>
</template>
