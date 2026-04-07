<script setup lang="ts">
import { ref, computed } from 'vue'
import { $t } from '@/utils/i18n'
import Avatar from '../Avatar.vue'
import Button from '../Button.vue'
import Badge from '../Badge.vue'
import { AttachmentsList } from '../AttachmentsList'
import type { CommentNode, CommentActionPayload, CommentAuthor } from './types'
import CommentEditor from './CommentEditor.vue'

export interface CommentItemProps {
  comment: CommentNode
  /** The ID of the currently logged-in user. Used to decide edit/delete visibility. */
  currentUser?: CommentAuthor | null
  /** Allow threaded visual line between nested replies */
  threaded?: boolean
  /** Globally allow delete. Only shows for author unless allowDeleteAll=true */
  allowDelete?: boolean
  /** Globally allow edit. Only shows for author unless allowEditAll=true */
  allowEdit?: boolean
  /** Globally allow reply (visible to all users) */
  allowReply?: boolean
  /** Admin override: show delete button on ALL comments regardless of author */
  allowDeleteAll?: boolean
  /** Admin override: show edit button on ALL comments regardless of author */
  allowEditAll?: boolean
  /** Requires two clicks to delete (confirmation safety) */
  confirmDelete?: boolean
  /** Controlled by parent CommentThread to reveal the reply slot */
  activeReplyId?: string | number | null
  /** Controlled by parent CommentThread to reveal the edit slot */
  activeEditId?: string | number | null
  /** Folder ID for uploads */
  folderId?: string
  /** Max file size */
  maxFileSize?: number
  /** Allow file uploads */
  allowFileUpload?: boolean
  replyPlaceholder?: string
  editPlaceholder?: string
  replyText?: string
  editedText?: string
  editingText?: string
  cancelText?: string
  cancelEditText?: string
}

const props = withDefaults(defineProps<CommentItemProps>(), {
  currentUser: null,
  threaded: true,
  allowDelete: true,
  allowEdit: true,
  allowReply: true,
  allowDeleteAll: false,
  allowEditAll: false,
  confirmDelete: true,
  activeReplyId: null,
  activeEditId: null,
  allowFileUpload: true,
})

const emit = defineEmits<{
  (e: 'reply', payload: CommentActionPayload): void
  (e: 'edit', payload: CommentActionPayload): void
  (e: 'delete', id: string | number): void
  (e: 'submit-reply', text: string, attachments: any[] | undefined, parentId: string | number): void
  (e: 'submit-edit', text: string, attachments: any[] | undefined, comment: CommentNode): void
  (e: 'cancel-reply'): void
  (e: 'cancel-edit'): void
}>()

// --- Permission guards ---
// Edge cases handled:
//   1. No currentUser passed → no auth check, show all actions (backward compat)
//   2. currentUser matches author → show edit + delete
//   3. currentUser does NOT match → hide edit + delete (unless admin override)
//   4. allowDeleteAll/allowEditAll → admin bypass, show regardless
//   5. allowEdit/allowDelete globally false → never show regardless of author
const isAuthor = computed(() => {
  if (props.currentUser === null || props.currentUser === undefined || props.currentUser.id === undefined) return true // no auth = show all
  return String(props.currentUser.id) === String(props.comment.author.id)
})

const canEdit = computed(() => props.allowEdit && (isAuthor.value || props.allowEditAll))

const canDelete = computed(() => props.allowDelete && (isAuthor.value || props.allowDeleteAll))

// Reply is always shown to everyone (you can always reply to any comment)
const canReply = computed(() => props.allowReply)

// --- Formatted Time ---
const displayTime = computed(() => {
  if (!props.comment.timestamp) return ''
  const d = new Date(props.comment.timestamp)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(d)
})

// --- i18n helpers — Chat-style fallback: if key echoes back, use default ---
const txtEdited = computed(() => {
  if (props.editedText) return props.editedText
  const res = $t('vlite.comment.edited')
  return res !== 'vlite.comment.edited' ? res : 'edited'
})

const txtReply = computed(() => {
  if (props.replyText) return props.replyText
  const res = $t('vlite.comment.replyAction')
  return res !== 'vlite.comment.replyAction' ? res : 'Reply'
})

// --- Double Confirm Delete Logic (same as ChatBubble) ---
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
        class="border-2 border-background/50 shadow-sm" />
      <div
        v-if="threaded && comment.replies?.length"
        class="w-px h-full bg-border/60 my-1 rounded-full"></div>
    </div>

    <!-- Main Content Block -->
    <div class="flex flex-col flex-1 min-w-0 mb-4">
      <!-- Header Row -->
      <div class="vl-comment-header flex items-center gap-2 mb-1">
        <span class="text-sm font-semibold text-foreground tracking-tight">
          {{ comment.author.name }}
        </span>
        <Badge v-if="comment.author.role" variant="secondary" size="sm">
          {{ comment.author.role }}
        </Badge>
        <span v-if="displayTime" class="text-xs text-muted-foreground ml-1">
          {{ displayTime }}
        </span>
        <span v-if="comment.isEdited" class="text-xs text-muted-foreground/60 italic">
          ({{ txtEdited }})
        </span>

        <!-- Action Buttons — visibility handled by scoped CSS below -->
        <div class="vl-comment-actions flex items-center gap-0.5 ml-auto pl-4">
          <Button
            v-if="canReply"
            variant="ghost"
            size="xs"
            icon="lucide:reply"
            class="text-muted-foreground hover:text-foreground h-7 px-2"
            @click="emit('reply', { commentId: comment.id, comment })">
            {{ txtReply }}
          </Button>

          <Button
            v-if="canEdit"
            variant="ghost"
            size="xs"
            icon="lucide:pencil"
            class="text-muted-foreground hover:text-foreground h-7 w-7 px-0"
            @click="emit('edit', { commentId: comment.id, comment })" />

          <div v-if="canDelete" class="relative flex items-center">
            <Button
              variant="ghost"
              size="xs"
              :icon="pendingDelete ? 'lucide:check' : 'lucide:trash-2'"
              class="h-7 w-7 px-0 transition-colors"
              :class="
                pendingDelete
                  ? 'text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              "
              @click="handleDeleteClick" />
            <button
              v-if="pendingDelete"
              class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              @click.stop="cancelPendingDelete">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-2 h-2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Text Body (hidden during edit) -->
      <div
        v-show="activeEditId !== comment.id"
        class="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed py-0.5 wrap-break-word max-w-[95%]">
        {{ comment.text }}
      </div>

      <!-- Inline Edit Area -->
      <div v-if="activeEditId === comment.id" class="mt-2 pb-2 mr-4">
        <CommentEditor
          variant="edit"
          :initial-text="comment.text"
          :current-user="currentUser"
          :folder-id="folderId"
          :max-file-size="maxFileSize"
          :allow-file-upload="allowFileUpload"
          :placeholder="editPlaceholder"
          :editing-text="editingText"
          :cancel-edit-text="cancelEditText"
          :cancel-text="cancelText"
          autofocus
          @submit="(text, atts) => emit('submit-edit', text, atts, comment)"
          @cancel="emit('cancel-edit')"
        />
      </div>

      <!-- Attachments -->
      <div v-if="comment.attachments?.length" class="mt-3.5">
        <AttachmentsList
          :attachments="comment.attachments"
          variant="inline"
          size="sm"
          :clickToPreview="true" />
      </div>

      <!-- Inline Reply Area -->
      <div v-if="activeReplyId === comment.id" class="mt-4 pb-2">
        <CommentEditor
          variant="reply"
          show-cancel
          :current-user="currentUser"
          :folder-id="folderId"
          :max-file-size="maxFileSize"
          :allow-file-upload="allowFileUpload"
          :placeholder="replyPlaceholder || 'Replying to discussion...'"
          :cancel-text="cancelText"
          autofocus
          @submit="(text, atts) => emit('submit-reply', text, atts, comment.id)"
          @cancel="emit('cancel-reply')"
        />
      </div>

      <!-- Recursive Replies -->
      <div v-if="comment.replies?.length" class="mt-5 flex flex-col w-full">
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
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
          :edit-placeholder="editPlaceholder"
          :reply-text="replyText"
          :edited-text="editedText"
          :editing-text="editingText"
          :cancel-text="cancelText"
          :cancel-edit-text="cancelEditText"
          @reply="(p) => emit('reply', p)"
          @edit="(p) => emit('edit', p)"
          @delete="(id) => emit('delete', id)"
          @submit-reply="(text, atts, pId) => emit('submit-reply', text, atts, pId)"
          @submit-edit="(text, atts, c) => emit('submit-edit', text, atts, c)"
          @cancel-reply="emit('cancel-reply')"
          @cancel-edit="emit('cancel-edit')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  Custom CSS hover strategy using :has() for clean nested isolation.

  Problem: CSS :hover bubbles up through ancestors.
  When hovering a nested child .vl-comment, all parent .vl-comment elements
  are also technically "hovered" — causing all ancestors' actions to show.

  Solution: Only show actions when THIS .vl-comment is hovered AND
  none of its descendant .vl-comment elements is also hovered.
  :not(:has(.vl-comment:hover)) = "I am hovered but no child comment is"
*/
.vl-comment-actions {
  opacity: 0;
  transition: opacity 150ms ease;
}

/* Show actions when THIS specific comment is the direct hover target */
.vl-comment:hover:not(:has(.vl-comment:hover)) > div > .vl-comment-header > .vl-comment-actions {
  opacity: 1;
}

/* Keep actions visible when the actions themselves are focused (keyboard a11y) */
.vl-comment-actions:focus-within {
  opacity: 1;
}

/* Keep actions visible while the pending-delete confirmation is active */
.vl-comment:has(.vl-comment-actions button[aria-label='Confirm delete']) .vl-comment-actions {
  opacity: 1;
}
</style>
