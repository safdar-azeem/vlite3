<script setup lang="ts">
import { computed, ref } from 'vue'
import Avatar from '../Avatar.vue'
import Button from '../Button.vue'
import type { ChatMessage } from './ChatInterface.vue'
import { AttachmentsList } from '../AttachmentsList'

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
  <div class="flex w-full gap-3 group" :class="isSender ? 'flex-row-reverse' : 'flex-row'">
    <div v-if="showAvatar" class="flex-shrink-0 flex flex-col justify-end pb-1">
      <Avatar :src="message.avatar" :alt="message.senderName" size="sm" />
    </div>

    <div
      class="flex flex-col max-w-[85%] md:max-w-[75%]"
      :class="isSender ? 'items-end' : 'items-start'">
      <div
        v-if="showUserInfo && message.senderName && !isSender"
        class="mb-1 text-xs text-muted-foreground ml-1">
        {{ message.senderName }}
      </div>

      <div
        class="relative flex items-center group/bubble"
        :class="isSender ? 'flex-row-reverse' : 'flex-row'">
        <div
          class="px-3.5 py-2.5 rounded-2xl break-words relative min-w-[60px]"
          :class="[
            isSender
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm',
          ]">
          <p v-if="message.text" class="text-sm whitespace-pre-wrap leading-relaxed">
            {{ message.text }}
          </p>

          <div
            v-if="message.attachments && message.attachments.length > 0"
            :class="{ 'mt-2': message.text }">
            <AttachmentsList
              :attachments="message.attachments"
              variant="inline"
              :can-view="true"
              :can-download="true" />
          </div>

          <div
            v-if="message.isEdited"
            class="text-[10px] opacity-70 mt-0.5 text-right"
            :class="isSender ? 'text-primary-foreground' : 'text-muted-foreground'">
            (edited)
          </div>
        </div>

        <div
          class="opacity-0 group-hover/bubble:opacity-100 focus-within:opacity-100 transition-opacity flex gap-1 px-2 pointer-events-none group-hover/bubble:pointer-events-auto focus-within:pointer-events-auto">
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

      <div
        v-if="showTimestamp && message.timestamp"
        class="mt-1 text-[10px] text-muted-foreground mx-1">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>
