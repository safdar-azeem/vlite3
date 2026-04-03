<script setup lang="ts">
import { computed, ref } from 'vue'
import Avatar from '../Avatar.vue'
import Button from '../Button.vue'
import type { ChatMessage } from './ChatInterface.vue'
import { AttachmentsList } from '../AttachmentsList'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  message: ChatMessage
  isSender: boolean
  showAvatar: boolean
  showUserInfo: boolean
  showTimestamp: boolean
  allowDeleteAll?: boolean
  allowEditAll?: boolean
  /**
   * When true, the delete button requires a second click (confirmation) before emitting the delete event.
   * Defaults to true.
   */
  confirmDelete?: boolean
  /**
   * Toggle to show or hide the "edited" status indicator on messages
   */
  showEditedStatus?: boolean
  editedText?: string
  editedTextI18n?: string
}>()

const emit = defineEmits<{
  (e: 'delete', id: string | number): void
  (e: 'edit', message: ChatMessage): void
}>()

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const displayEditedText = computed(() => {
  if (props.editedTextI18n) {
    const res = $t(props.editedTextI18n)
    if (res !== props.editedTextI18n) return res
  }
  if (props.editedText) return props.editedText
  const globalRes = $t('vlite.chat.edited')
  return globalRes !== 'vlite.chat.edited' ? globalRes : 'edited'
})

// --- Delete confirmation state ---
// Tracks whether the user has clicked delete once and is now in "confirm" mode
const pendingDelete = ref(false)
let confirmTimer: ReturnType<typeof setTimeout> | null = null

const handleDeleteClick = () => {
  // If confirmDelete prop is false, emit immediately without double-confirm
  if (props.confirmDelete === false) {
    emit('delete', props.message.id)
    return
  }

  if (pendingDelete.value) {
    // Second click — confirmed
    pendingDelete.value = false
    if (confirmTimer) {
      clearTimeout(confirmTimer)
      confirmTimer = null
    }
    emit('delete', props.message.id)
  } else {
    // First click — enter pending state
    pendingDelete.value = true
    // Auto-cancel after 3 seconds if user doesn't confirm
    confirmTimer = setTimeout(() => {
      pendingDelete.value = false
      confirmTimer = null
    }, 3000)
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
  <div class="flex w-full min-w-0 gap-3 group" :class="isSender ? 'flex-row-reverse' : 'flex-row'">
    <div v-if="showAvatar" class="flex-shrink-0 flex flex-col justify-end pb-1">
      <Avatar :src="message.avatar" :alt="message.senderName" size="sm" />
    </div>

    <div
      class="flex flex-col min-w-0 overflow-hidden max-w-[85%]"
      :class="isSender ? 'items-end' : 'items-start'">
      <div
        class="relative flex items-center min-w-0 max-w-full group/bubble"
        :class="isSender ? 'flex-row-reverse' : 'flex-row'">
        <div
          class="px-3.5 py-2.5 rounded-2xl break-words relative min-w-[60px] max-w-full min-w-0 overflow-hidden"
          :class="[
            isSender
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm',
          ]">
          <div
            v-if="showUserInfo && message.senderName && !isSender"
            class="mb-0.5 text-[9px] font-medium tracking-wide uppercase opacity-80 truncate text-gray-900/80">
            {{ message.senderName }}
          </div>

          <p v-if="message.text" class="text-sm whitespace-pre-wrap leading-relaxed break-words">
            {{ message.text }}
          </p>

          <div
            v-if="message.attachments && message.attachments.length > 0"
            :class="{ 'mt-2': message.text || (showUserInfo && !isSender) }">
            <AttachmentsList
              :attachments="message.attachments"
              variant="inline"
              size="sm"
              :can-view="true"
              :can-download="true"
              :click-to-preview="true"
              :show-download-in-list="false" />
          </div>

          <div
            v-if="showTimestamp && (message.timestamp || message.isEdited)"
            class="mt-1 flex items-center gap-1"
            :class="isSender ? 'justify-end' : 'justify-start'">
            <span
              v-if="message.isEdited && showEditedStatus !== false"
              class="text-[10px] opacity-60"
              :class="isSender ? 'text-primary-foreground' : 'text-muted-foreground'">
              {{ displayEditedText }}
            </span>
            <span
              v-if="message.isEdited && showEditedStatus !== false && message.timestamp"
              class="text-[10px] opacity-40"
              :class="isSender ? 'text-primary-foreground' : 'text-muted-foreground'">
              ·
            </span>
            <span
              v-if="message.timestamp"
              class="text-[10px] opacity-60 tabular-nums"
              :class="isSender ? 'text-primary-foreground' : 'text-muted-foreground'">
              {{ formattedTime }}
            </span>
          </div>
        </div>

        <div
          class="opacity-0 group-hover/bubble:opacity-100 focus-within:opacity-100 transition-opacity flex gap-0 pointer-events-none group-hover/bubble:pointer-events-auto focus-within:pointer-events-auto z-10"
          :class="isSender ? 'right-full pr-1' : 'left-full pl-1'">
          <Button
            v-if="(isSender || allowEditAll) && message.text?.trim()"
            variant="ghost"
            size="xs"
            icon="lucide:pencil"
            rounded="full"
            class="text-muted-foreground hover:text-foreground h-7 w-7"
            @click="emit('edit', message)"
            aria-label="Edit message" />

          <template v-if="isSender || allowDeleteAll">
            <div class="relative flex items-center">
              <Button
                variant="ghost"
                size="xs"
                :icon="pendingDelete ? 'lucide:check' : 'lucide:trash-2'"
                rounded="full"
                class="h-7 w-7 transition-colors"
                @click="handleDeleteClick"
                :aria-label="pendingDelete ? 'Confirm delete' : 'Delete message'" />
              <button
                v-if="pendingDelete"
                class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                @click.stop="cancelPendingDelete"
                aria-label="Cancel delete">
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
