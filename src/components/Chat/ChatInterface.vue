<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import ChatBubble from './ChatBubble.vue'
import Button from '../Button.vue'

export interface ChatMessage {
  id: string | number
  text: string
  senderId: string | number
  senderName?: string
  avatar?: string
  timestamp?: string | Date
  isEdited?: boolean
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    data: ChatMessage[]
    currentUserId: string | number
    showAvatar?: boolean
    showUserInfo?: boolean
    showTimestamp?: boolean
    placeholder?: string
    isLoadingMore?: boolean
    allowDeleteAll?: boolean
    allowEditAll?: boolean
  }>(),
  {
    showAvatar: true,
    showUserInfo: true,
    showTimestamp: true,
    placeholder: 'Type a message...',
    isLoadingMore: false,
    allowDeleteAll: false,
    allowEditAll: false,
  }
)

const emit = defineEmits<{
  (e: 'add', text: string): void
  (e: 'delete', id: string | number): void
  (e: 'edit', message: ChatMessage): void
  (e: 'refetch'): void
}>()

const messageListRef = ref<HTMLElement | null>(null)
const observerTargetRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const inputText = ref('')
const previousScrollHeight = ref(0)
const isPrepend = ref(false)
const editingMessage = ref<ChatMessage | null>(null)

// Intersection Observer for Reverse Infinite Scroll
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (observerTargetRef.value && messageListRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        // Must only refetch if we are at the top, not currently loading, and there's data to avoid infinite loop on mount
        if (entry.isIntersecting && props.data.length > 0 && !props.isLoadingMore) {
          previousScrollHeight.value = messageListRef.value!.scrollHeight
          isPrepend.value = true
          emit('refetch')
        }
      },
      {
        root: messageListRef.value,
        threshold: 0,
      }
    )
    observer.observe(observerTargetRef.value)
  }
  scrollToBottom()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// Watch data length changes to maintain scroll position or auto-scroll
watch(
  () => props.data.length,
  async (newLen, oldLen) => {
    const list = messageListRef.value
    if (!list) return

    // Wait for the DOM to update to recalculate scroll heights accurately
    await nextTick()

    if (isPrepend.value && newLen > (oldLen || 0)) {
      // Preserve scroll position so the user's view doesn't jump
      const currentScrollHeight = list.scrollHeight
      const scrollDiff = currentScrollHeight - previousScrollHeight.value
      if (scrollDiff > 0) {
        list.scrollTop = list.scrollTop + scrollDiff
      }
      isPrepend.value = false
    } else if (!isPrepend.value && newLen > (oldLen || 0)) {
      // Smooth auto-scroll to bottom on new message send
      scrollToBottom()
    }
  }
)

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

// Textarea auto-grow max 5 lines
const handleInput = () => {
  if (!textareaRef.value) return
  textareaRef.value.style.height = 'auto'
  const scrollHeight = textareaRef.value.scrollHeight
  textareaRef.value.style.height = `${Math.min(scrollHeight, 120)}px`
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  } else if (e.key === 'Escape' && editingMessage.value) {
    e.preventDefault()
    cancelEdit()
  }
}

const startEditing = (msg: ChatMessage) => {
  editingMessage.value = msg
  inputText.value = msg.text
  if (textareaRef.value) {
    textareaRef.value.focus()
    // Small delay to allow value to update before adjusting height
    nextTick(() => {
      handleInput()
    })
  }
}

const cancelEdit = () => {
  editingMessage.value = null
  inputText.value = ''
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.focus()
  }
}

const handleSend = () => {
  const text = inputText.value.trim()
  if (!text) return

  const wasEditing = !!editingMessage.value

  if (wasEditing && editingMessage.value) {
    // Only emit edit if text actually changed
    if (text !== editingMessage.value.text) {
      emit('edit', { ...editingMessage.value, text, isEdited: true })
    }
    editingMessage.value = null
  } else {
    emit('add', text)
  }

  inputText.value = ''

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.focus()
  }

  // Do not jump to bottom if user is just editing an old message
  if (!wasEditing) {
    scrollToBottom()
  }
}
</script>

<template>
  <div class="flex flex-col w-full h-full flex-1 min-h-0 bg-transparent">
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-stable"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      style="will-change: transform; contain: layout style">
      <div ref="observerTargetRef" class="h-1 w-full shrink-0"></div>

      <div
        v-if="isLoadingMore"
        class="py-2 mb-2 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
        <svg
          class="animate-spin h-4 w-4 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading older messages...
      </div>

      <div
        v-if="!data.length && !isLoadingMore"
        class="flex items-center justify-center h-full text-muted-foreground text-sm">
        No messages yet
      </div>

      <div class="flex flex-col gap-2 pb-2">
        <ChatBubble
          v-for="msg in data"
          :key="msg.id"
          :message="msg"
          :is-sender="msg.senderId === currentUserId"
          :show-avatar="showAvatar"
          :show-user-info="showUserInfo"
          :show-timestamp="showTimestamp"
          :allow-delete-all="allowDeleteAll"
          :allow-edit-all="allowEditAll"
          @delete="$emit('delete', $event)"
          @edit="startEditing" />
      </div>
    </div>

    <div class="p-3 shrink-0 bg-transparent flex flex-col gap-1">
      <div
        v-if="editingMessage"
        class="flex items-center justify-between px-3 py-1.5 bg-muted/50 rounded-lg text-xs text-muted-foreground border border-border animate-in fade-in slide-in-from-bottom-2">
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5 text-primary shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
          <span class="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
            >Editing: {{ editingMessage.text }}</span
          >
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[10px] hidden sm:inline-block opacity-60 mr-1"
            >Press Esc to cancel</span
          >
          <button
            @click="cancelEdit"
            class="hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Cancel editing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div
        class="relative flex items-end gap-2 bg-card border border-border rounded-xl p-1 shadow-sm focus-within:border-primary transition-colors">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          :placeholder="placeholder"
          class="flex-1 max-h-[120px] min-h-[20px] w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground scrollbar-thin"
          rows="1"
          aria-label="Message input"
          @input="handleInput"
          @keydown="handleKeyDown" />
        <div class="shrink-0 mb-1 mr-1">
          <Button
            variant="primary"
            size="sm"
            :icon="editingMessage ? 'lucide:check' : 'lucide:send'"
            rounded="full"
            class="h-8 w-8 px-0 transition-transform active:scale-95"
            :disabled="!inputText.trim()"
            @click="handleSend"
            :aria-label="editingMessage ? 'Save changes' : 'Send message'" />
        </div>
      </div>
    </div>
  </div>
</template>
