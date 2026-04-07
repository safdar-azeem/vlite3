<script setup lang="ts">
import { ref } from 'vue'
import { $t } from '@/utils/i18n'
import CommentItem from './CommentItem.vue'
import type { CommentNode, CommentActionPayload } from './types'

export interface CommentThreadProps {
  comments: CommentNode[]
  /** ID of currently logged-in user — controls edit/delete visibility */
  currentUserId?: string | number | null
  threaded?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowReply?: boolean
  /** Admin override — show delete on all comments */
  allowDeleteAll?: boolean
  /** Admin override — show edit on all comments */
  allowEditAll?: boolean
  confirmDelete?: boolean
  class?: string
}

const props = withDefaults(defineProps<CommentThreadProps>(), {
  currentUserId: null,
  threaded: true,
  allowDelete: true,
  allowEdit: true,
  allowReply: true,
  allowDeleteAll: false,
  allowEditAll: false,
  confirmDelete: true,
  class: '',
})

const emit = defineEmits<{
  (e: 'reply', payload: CommentActionPayload): void
  (e: 'edit', payload: CommentActionPayload): void
  (e: 'delete', id: string | number): void
  // Optional internal tracking if someone clicks "Cancel Reply" or "Cancel Edit"
  (e: 'reply-cancel'): void
  (e: 'edit-cancel'): void
}>()

const activeReplyId = ref<string | number | null>(null)
const activeEditId = ref<string | number | null>(null)

const handleReply = (payload: CommentActionPayload) => {
  if (activeReplyId.value === payload.commentId) {
    activeReplyId.value = null
    emit('reply-cancel')
    return
  }
  activeReplyId.value = payload.commentId
  if (activeEditId.value !== null) {
    activeEditId.value = null
  }
  emit('reply', payload)
}

const handleEdit = (payload: CommentActionPayload) => {
  if (activeEditId.value === payload.commentId) {
    activeEditId.value = null
    emit('edit-cancel')
    return
  }
  activeEditId.value = payload.commentId
  if (activeReplyId.value !== null) {
    activeReplyId.value = null
  }
  emit('edit', payload)
}

const clearActiveReply = () => {
  activeReplyId.value = null
}

const clearActiveEdit = () => {
  activeEditId.value = null
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
    
    <!-- Top Input / Root Slot -->
    <div class="mb-8" v-if="$slots['root-input']">
      <slot name="root-input" />
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
        :currentUserId="currentUserId"
        :threaded="threaded"
        :allowDelete="allowDelete"
        :allowEdit="allowEdit"
        :allowReply="allowReply"
        :allowDeleteAll="allowDeleteAll"
        :allowEditAll="allowEditAll"
        :confirmDelete="confirmDelete"
        :activeReplyId="activeReplyId"
        :activeEditId="activeEditId"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="(id) => emit('delete', id)"
      >
        <!-- Proxy the slot into the recursive item tree -->
        <template #inline-reply="{ comment }">
          <slot name="inline-reply" :comment="comment" :close="clearActiveReply" />
        </template>
        <template #inline-edit="{ comment }">
          <slot name="inline-edit" :comment="comment" :close="clearActiveEdit" />
        </template>
      </CommentItem>
    </div>

    <!-- Bottom Input Slot (Optional) -->
    <div class="mt-4" v-if="$slots['footer-input']">
      <slot name="footer-input" />
    </div>
  </div>
</template>
