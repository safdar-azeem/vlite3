<script setup lang="ts">
import { ref, computed } from 'vue'
import { $t } from '@/utils/i18n'
import Avatar from '../Avatar.vue'
import Button from '../Button.vue'
import Badge from '../Badge.vue'
import { AttachmentsList } from '../AttachmentsList'
import type { CommentNode, CommentActionPayload } from './types'

export interface CommentItemProps {
  comment: CommentNode
  /** Enable nested visual threading */
  threaded?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowReply?: boolean
  /** Requires two clicks to delete (confirmation) */
  confirmDelete?: boolean
  /** Whether this comment is currently being replied to, so we can reveal a slot */
  activeReplyId?: string | number | null
}

const props = withDefaults(defineProps<CommentItemProps>(), {
  threaded: true,
  allowDelete: true,
  allowEdit: true,
  allowReply: true,
  confirmDelete: true,
  activeReplyId: null,
})

const emit = defineEmits<{
  (e: 'reply', payload: CommentActionPayload): void
  (e: 'edit', payload: CommentActionPayload): void
  (e: 'delete', id: string | number): void
}>()

// --- Formatted Time ---
const displayTime = computed(() => {
  if (!props.comment.timestamp) return ''
  const d = new Date(props.comment.timestamp)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
  }).format(d)
})

// --- i18n helpers with proper Chat-style fallback ---
// If $t returns back the exact key it was given, a translation is not registered.
// In that case, fall through to the hardcoded default text.
const txtEdited = computed(() => {
  const res = $t('vlite.comment.edited')
  return res !== 'vlite.comment.edited' ? res : 'edited'
})

const txtReply = computed(() => {
  const res = $t('vlite.comment.replyAction')
  return res !== 'vlite.comment.replyAction' ? res : 'Reply'
})

// --- Double Confirm Delete Logic ---
const pendingDelete = ref(false)
let confirmTimer: ReturnType<typeof setTimeout> | null = null

const handleDeleteClick = () => {
  if (!props.confirmDelete) {
    emit('delete', props.comment.id)
    return
  }

  if (pendingDelete.value) {
    pendingDelete.value = false
    if (confirmTimer) clearTimeout(confirmTimer)
    emit('delete', props.comment.id)
  } else {
    pendingDelete.value = true
    confirmTimer = setTimeout(() => {
      pendingDelete.value = false
    }, 4000)
  }
}

const cancelPendingDelete = () => {
  pendingDelete.value = false
  if (confirmTimer) {
    clearTimeout(confirmTimer)
    confirmTimer = null
  }
}
</script>

<template>
  <div class="vl-comment flex w-full relative">

    <!-- Left Avatar & Threading Line -->
    <div class="flex flex-col items-center mr-4 shrink-0">
      <Avatar
        :src="comment.author.avatar"
        :alt="comment.author.name"
        :fallback="comment.author.name?.charAt(0)"
        size="md"
        class="border-2 border-background/50 shadow-sm"
      />
      <!-- Connecting line for threaded replies -->
      <div
        v-if="threaded && comment.replies?.length"
        class="w-px h-full bg-border/60 my-1 rounded-full">
      </div>
    </div>

    <!-- Main Content Block -->
    <div class="flex flex-col flex-1 min-w-0 mb-6">

      <!-- Header Row — group/row scoped STRICTLY to this one row only -->
      <div class="group/row flex items-center gap-2 mb-1">
        <span class="text-sm font-semibold text-foreground tracking-tight">
          {{ comment.author.name }}
        </span>
        <Badge v-if="comment.author.role" variant="secondary" size="sm">
          {{ comment.author.role }}
        </Badge>
        <span
          v-if="displayTime"
          class="text-xs text-muted-foreground ml-1">
          {{ displayTime }}
        </span>
        <span
          v-if="comment.isEdited"
          class="text-xs text-muted-foreground/60 italic">
          ({{ txtEdited }})
        </span>

        <!-- Actions: only visible when hovering THIS header row -->
        <div class="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 focus-within:opacity-100 transition-opacity ml-auto pl-4">
          <Button
            v-if="allowReply"
            variant="ghost"
            size="xs"
            icon="lucide:reply"
            class="text-muted-foreground hover:text-foreground h-7 px-2"
            @click="emit('reply', { commentId: comment.id, comment })">
            {{ txtReply }}
          </Button>

          <Button
            v-if="allowEdit"
            variant="ghost"
            size="xs"
            icon="lucide:pencil"
            class="text-muted-foreground hover:text-foreground h-7 w-7 px-0"
            @click="emit('edit', { commentId: comment.id, comment })"
          />

          <div v-if="allowDelete" class="relative flex items-center">
            <Button
              variant="ghost"
              size="xs"
              :icon="pendingDelete ? 'lucide:check' : 'lucide:trash-2'"
              class="h-7 w-7 px-0 transition-colors"
              :class="pendingDelete ? 'text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive' : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
              @click="handleDeleteClick"
            />
            <button
              v-if="pendingDelete"
              class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              @click.stop="cancelPendingDelete">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-2 h-2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Text Body -->
      <div class="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed py-0.5 wrap-break-word max-w-[95%]">
        {{ comment.text }}
      </div>

      <!-- Attachments -->
      <div v-if="comment.attachments?.length" class="mt-3.5">
        <AttachmentsList
          :attachments="comment.attachments"
          variant="inline"
          size="sm"
          :clickToPreview="true"
        />
      </div>

      <!-- Inline Reply Injection Slot -->
      <div v-if="activeReplyId === comment.id" class="mt-4 pb-2">
        <slot name="inline-reply" :comment="comment" />
      </div>

      <!-- Recursive Thread Replies -->
      <div v-if="comment.replies?.length" class="mt-5 flex flex-col w-full">
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :threaded="threaded"
          :allowDelete="allowDelete"
          :allowEdit="allowEdit"
          :allowReply="allowReply"
          :confirmDelete="confirmDelete"
          :activeReplyId="activeReplyId"
          @reply="(p) => emit('reply', p)"
          @edit="(p) => emit('edit', p)"
          @delete="(id) => emit('delete', id)"
        >
          <template #inline-reply="slotProps">
            <slot name="inline-reply" v-bind="slotProps" />
          </template>
        </CommentItem>
      </div>

    </div>
  </div>
</template>
