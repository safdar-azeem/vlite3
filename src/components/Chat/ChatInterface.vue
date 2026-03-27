<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import ChatBubble from './ChatBubble.vue'
import Button from '../Button.vue'
import Icon from '../Icon.vue'
import FilePicker from '../FilePicker/FilePicker.vue'
import type { FilePickerValue } from '../FilePicker/FilePicker.vue'
import { useFileUpload } from '../Form/composables/useFileUpload'

export interface ChatAttachment {
  fileUrl: string
  fileName?: string
  fileType?: string
  fileSize?: number
  [key: string]: any
}

export interface ChatMessage {
  id: string | number
  text: string
  senderId: string | number
  senderName?: string
  avatar?: string
  timestamp?: string | Date
  isEdited?: boolean
  attachments?: ChatAttachment[]
  [key: string]: any
}

/**
 * A rendered list item is either a real message or a date separator pill.
 * The separator carries only the label to display and a stable key.
 */
type DateSeparator = {
  _type: 'separator'
  _key: string
  label: string
}

type ListItem = ChatMessage | DateSeparator

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
    /**
     * When true (default), the delete button requires a second click to confirm deletion.
     * Set to false to delete immediately on first click.
     */
    confirmDelete?: boolean
    folderId?: string
    maxFileSize?: number
  }>(),
  {
    showAvatar: true,
    showUserInfo: true,
    showTimestamp: true,
    placeholder: 'Type a message...',
    isLoadingMore: false,
    allowDeleteAll: false,
    allowEditAll: false,
    confirmDelete: true,
  }
)

const emit = defineEmits<{
  (e: 'add', text: string, attachments?: ChatAttachment[]): void
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

const selectedFiles = ref<FilePickerValue[]>([])
const { handleUploadFiles, loading: isUploading } = useFileUpload()

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
    if (!isUploading.value) {
      handleSend()
    }
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

const canSend = computed(() => {
  const hasText = !!inputText.value.trim()
  const hasFiles = Array.isArray(selectedFiles.value) && selectedFiles.value.length > 0
  return (hasText || hasFiles) && !isUploading.value
})

const removeSelectedFile = (index: number) => {
  if (isUploading.value) return
  if (Array.isArray(selectedFiles.value)) {
    selectedFiles.value.splice(index, 1)
    if (selectedFiles.value.length === 0) {
      selectedFiles.value = []
    }
  }
}

const handleSend = async () => {
  if (!canSend.value) return

  const text = inputText.value.trim()
  const hasFiles = Array.isArray(selectedFiles.value) && selectedFiles.value.length > 0
  const wasEditing = !!editingMessage.value

  if (wasEditing && editingMessage.value) {
    // Only emit edit if text actually changed
    if (text !== editingMessage.value.text) {
      emit('edit', { ...editingMessage.value, text, isEdited: true })
    }
    editingMessage.value = null
    inputText.value = ''
  } else {
    let attachments: ChatAttachment[] = []

    if (hasFiles) {
      const filesToUpload = selectedFiles.value.map(f => f.file).filter(Boolean) as File[]
      if (filesToUpload.length > 0) {
        const urls = await handleUploadFiles(filesToUpload, props.folderId)
        attachments = selectedFiles.value
          .map((f, i) => ({
            fileUrl: urls[i] || '',
            fileName: f.fileName,
            fileType: f.fileType,
            fileSize: f.fileSize,
          }))
          .filter(a => a.fileUrl !== null && a.fileUrl !== '')
      }
    }

    emit('add', text, attachments.length > 0 ? attachments : undefined)
    selectedFiles.value = []
    inputText.value = ''
  }

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.focus()
  }

  // Do not jump to bottom if user is just editing an old message
  if (!wasEditing) {
    scrollToBottom()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Date separator logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a normalised YYYY-MM-DD string for a given timestamp.
 * Used to compare whether two messages fall on the same calendar day.
 */
const toDateKey = (ts: string | Date | undefined): string => {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Formats a date into a human-friendly separator label:
 *   - "Today"
 *   - "Yesterday"
 *   - "Mon, 24 Mar" (within the current year)
 *   - "Mon, 24 Mar 2023" (older years)
 */
const formatSeparatorLabel = (ts: string | Date): string => {
  const date = new Date(ts)
  const now = new Date()

  const todayKey = toDateKey(now)
  const msgKey = toDateKey(date)

  if (msgKey === todayKey) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (msgKey === toDateKey(yesterday)) return 'Yesterday'

  // Named day + date for recent history; add year when it differs
  const sameYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/**
 * Builds a flat list of messages interleaved with date separator entries.
 * A separator is inserted whenever the calendar day changes between consecutive
 * messages (or before the very first message). Messages without a timestamp
 * are rendered as-is without triggering a new separator.
 */
const renderedItems = computed<ListItem[]>(() => {
  const items: ListItem[] = []
  let lastDateKey = ''

  for (const msg of props.data) {
    const key = toDateKey(msg.timestamp)

    if (key && key !== lastDateKey) {
      items.push({
        _type: 'separator',
        _key: `sep-${key}`,
        label: formatSeparatorLabel(msg.timestamp!),
      })
      lastDateKey = key
    }

    items.push(msg)
  }

  return items
})

/** Type guard used in the template to distinguish separators from messages */
const isSeparator = (item: ListItem): item is DateSeparator =>
  (item as DateSeparator)._type === 'separator'
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
        <template v-for="item in renderedItems" :key="isSeparator(item) ? item._key : item.id">
          <!--
            Date separator pill: centred, pill-shaped, muted.
            Uses a horizontal rule on each side so it stretches full width.
            No extra props needed — computed entirely from message timestamps.
          -->
          <div
            v-if="isSeparator(item)"
            class="flex items-center gap-3 py-1 select-none"
            role="separator">
            <div class="flex-1 h-px bg-border/60"></div>
            <span
              class="shrink-0 px-3 py-0.5 rounded-full text-[11px] font-medium text-muted-foreground bg-muted/60 border border-border/40 tracking-wide">
              {{ item.label }}
            </span>
            <div class="flex-1 h-px bg-border/60"></div>
          </div>

          <!--
            Normal chat bubble — cast item since we've narrowed it via isSeparator guard
          -->
          <ChatBubble
            v-else
            :message="(item as ChatMessage)"
            :is-sender="(item as ChatMessage).senderId === currentUserId"
            :show-avatar="showAvatar"
            :show-user-info="showUserInfo"
            :show-timestamp="showTimestamp"
            :allow-delete-all="allowDeleteAll"
            :allow-edit-all="allowEditAll"
            :confirm-delete="confirmDelete"
            @delete="$emit('delete', $event)"
            @edit="startEditing" />
        </template>
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
        class="relative flex flex-col bg-card border border-border rounded-xl shadow-sm focus-within:border-primary transition-colors overflow-hidden">
        <!-- Selected file previews -->
        <div
          v-if="Array.isArray(selectedFiles) && selectedFiles.length > 0"
          class="flex flex-wrap gap-2 p-3 bg-muted/10 border-b border-border">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="relative flex items-center gap-2 bg-background border border-border rounded-md p-1.5 pr-8 max-w-[200px] shadow-sm">
            <Icon icon="lucide:file-text" class="w-4 h-4 text-primary shrink-0" />
            <span class="text-xs truncate font-medium" :title="file.fileName">{{
              file.fileName
            }}</span>
            <button
              @click="removeSelectedFile(index)"
              :disabled="isUploading"
              class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="lucide:x" class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div class="flex items-end gap-2 p-1">
          <div class="shrink-0 mb-1 ml-1">
            <FilePicker
              v-model="selectedFiles"
              :multi-select="true"
              :max-size="maxFileSize"
              return-format="file">
              <template #trigger="{ trigger }">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:paperclip"
                  rounded="full"
                  class="h-8 w-8 px-0 text-muted-foreground hover:text-foreground transition-colors"
                  @click="trigger"
                  :disabled="isUploading"
                  aria-label="Attach files" />
              </template>
            </FilePicker>
          </div>

          <textarea
            ref="textareaRef"
            v-model="inputText"
            :placeholder="placeholder"
            :disabled="isUploading"
            class="flex-1 max-h-[120px] min-h-[20px] w-full resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground scrollbar-thin disabled:opacity-50"
            rows="1"
            aria-label="Message input"
            @input="handleInput"
            @keydown="handleKeyDown" />

          <div class="shrink-0 mb-1 mr-1">
            <Button
              variant="primary"
              size="sm"
              :icon="
                isUploading
                  ? 'lucide:loader-2'
                  : editingMessage
                    ? 'lucide:check'
                    : 'lucide:send'
              "
              :loading="isUploading"
              rounded="full"
              class="h-8 w-8 px-0 transition-transform active:scale-95"
              :disabled="!canSend"
              @click="handleSend"
              :aria-label="editingMessage ? 'Save changes' : 'Send message'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
