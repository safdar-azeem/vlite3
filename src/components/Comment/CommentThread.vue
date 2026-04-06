<script setup lang="ts">
import { ref } from 'vue'
import { $t } from '@/utils/i18n'
import CommentItem from './CommentItem.vue'
import type { CommentNode, CommentActionPayload } from './types'

export interface CommentThreadProps {
  comments: CommentNode[]
  threaded?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowReply?: boolean
  confirmDelete?: boolean
  class?: string
}

const props = withDefaults(defineProps<CommentThreadProps>(), {
  threaded: true,
  allowDelete: true,
  allowEdit: true,
  allowReply: true,
  confirmDelete: true,
  class: '',
})

const emit = defineEmits<{
  (e: 'reply', payload: CommentActionPayload): void
  (e: 'edit', payload: CommentActionPayload): void
  (e: 'delete', id: string | number): void
  // Optional internal tracking if someone clicks "Cancel Reply"
  (e: 'reply-cancel'): void
}>()

const activeReplyId = ref<string | number | null>(null)

const handleReply = (payload: CommentActionPayload) => {
  // Toggle off if clicking the same reply button twice
  if (activeReplyId.value === payload.commentId) {
    activeReplyId.value = null
    emit('reply-cancel')
    return
  }
  activeReplyId.value = payload.commentId
  emit('reply', payload)
}

const clearActiveReply = () => {
  activeReplyId.value = null
}

defineExpose({
  clearActiveReply,
  activeReplyId
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
        :threaded="threaded"
        :allowDelete="allowDelete"
        :allowEdit="allowEdit"
        :allowReply="allowReply"
        :confirmDelete="confirmDelete"
        :activeReplyId="activeReplyId"
        @reply="handleReply"
        @edit="(p) => emit('edit', p)"
        @delete="(id) => emit('delete', id)"
      >
        <!-- Proxy the slot into the recursive item tree -->
        <template #inline-reply="{ comment }">
          <slot name="inline-reply" :comment="comment" :close="clearActiveReply" />
        </template>
      </CommentItem>
    </div>

    <!-- Bottom Input Slot (Optional) -->
    <div class="mt-4" v-if="$slots['footer-input']">
      <slot name="footer-input" />
    </div>
  </div>
</template>
