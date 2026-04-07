<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import Button from '../Button.vue'
import Icon from '../Icon.vue'
import Avatar from '../Avatar.vue'
import FilePicker from '../FilePicker/FilePicker.vue'
import type { FilePickerValue } from '../FilePicker/FilePicker.vue'
import { useFileUpload } from '../Form/composables/useFileUpload'
import type { ChatAttachment } from '../Chat'
import type { CommentAuthor } from './types'

const props = withDefaults(defineProps<{
  /** Pre-fill the textarea (e.g. for editing) */
  initialText?: string
  /** 
   * 'root' = main discussion input (with background and border)
   * 'reply' = inline reply (indented, no big background, smaller avatar)
   * 'edit' = inline edit (no avatar, shows editing header)
   */
  variant?: 'root' | 'reply' | 'edit'
  placeholder?: string
  /** The currently logged in user to display their avatar */
  currentUser?: CommentAuthor | null
  /** Controls visibility of the file attachment button */
  allowFileUpload?: boolean
  /** Remote folder ID for uploaded files */
  folderId?: string
  /** Max file size in bytes */
  maxFileSize?: number
  /** Attempt to focus the input on mount */
  autofocus?: boolean
}>(), {
  initialText: '',
  variant: 'root',
  placeholder: 'Leave a comment...',
  currentUser: null,
  allowFileUpload: true
})

const emit = defineEmits<{
  (e: 'submit', text: string, attachments?: ChatAttachment[]): void
  (e: 'cancel'): void
}>()

const inputText = ref(props.initialText)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const selectedFiles = ref<FilePickerValue[]>([])
const { handleUploadFiles, loading: isUploading } = useFileUpload()

const handleInput = () => {
  if (!textareaRef.value) return
  textareaRef.value.style.height = 'auto'
  const scrollHeight = textareaRef.value.scrollHeight
  textareaRef.value.style.height = `${Math.min(scrollHeight, 120)}px`
}

onMounted(() => {
  if (props.autofocus && textareaRef.value) {
    textareaRef.value.focus()
  }
  nextTick(() => {
    handleInput()
  })
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (!isUploading.value) {
      submit()
    }
  } else if (e.key === 'Escape' && props.variant !== 'root') {
    e.preventDefault()
    emit('cancel')
  }
}

const canSubmit = computed(() => {
  const hasText = !!inputText.value.trim()
  const hasFiles = Array.isArray(selectedFiles.value) && selectedFiles.value.length > 0
  return (hasText || hasFiles) && !isUploading.value
})

const removeSelectedFile = (index: number) => {
  if (isUploading.value) return
  if (Array.isArray(selectedFiles.value)) {
    selectedFiles.value.splice(index, 1)
  }
}

const submit = async () => {
  if (!canSubmit.value) return

  const text = inputText.value.trim()
  const hasFiles = Array.isArray(selectedFiles.value) && selectedFiles.value.length > 0

  let attachments: ChatAttachment[] = []

  if (hasFiles) {
    const filesToUpload = selectedFiles.value.map((f) => f.file).filter(Boolean) as File[]
    if (filesToUpload.length > 0) {
      const urls = await handleUploadFiles(filesToUpload, props.folderId)
      attachments = selectedFiles.value
        .map((f, i) => ({
          fileUrl: urls[i] || '',
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
        }))
        .filter((a) => a.fileUrl !== null && a.fileUrl !== '')
    }
  }

  emit('submit', text, attachments.length > 0 ? attachments : undefined)
  
  // Clear on successful submit for root/reply (edit unmounts usually, but clear anyway)
  selectedFiles.value = []
  if (props.variant !== 'edit') {
    inputText.value = ''
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.focus()
    }
  }
}
</script>

<template>
  <div 
    class="vl-comment-editor flex gap-3 w-full"
    :class="[
      variant === 'root' ? 'bg-muted/10 p-3 sm:p-4 rounded-xl border border-border/60 items-start' : '',
      variant === 'reply' ? 'items-start pl-2' : '',
      variant === 'edit' ? 'items-center mt-1' : ''
    ]"
  >
    <!-- Avatar (only for root and reply variants) -->
    <Avatar 
      v-if="variant !== 'edit' && currentUser" 
      :src="currentUser.avatar" 
      :fallback="currentUser.name?.charAt(0) || 'U'"
      :size="variant === 'root' ? 'md' : 'sm'" 
      class="shrink-0 mt-0.5" 
    />
    
    <div class="flex-1 min-w-0 flex flex-col gap-2">
      <!-- Edit Mode Header -->
      <div v-if="variant === 'edit'" class="flex items-center justify-between px-3 py-1.5 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border animate-in fade-in slide-in-from-bottom-2">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:pencil" class="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Editing Comment</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[10px] hidden sm:inline-block opacity-60 mr-1">Press Esc to cancel</span>
          <button @click="emit('cancel')" class="hover:text-foreground p-0.5 rounded-full hover:bg-background transition-colors" aria-label="Cancel editing">
            <Icon icon="lucide:x" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Main Input Wrapper -->
      <div class="relative flex flex-col bg-background border border-border rounded-xl shadow-sm focus-within:border-primary transition-colors overflow-hidden">
        
        <!-- Uploaded File Previews -->
        <div v-if="Array.isArray(selectedFiles) && selectedFiles.length > 0" class="flex flex-wrap gap-2 p-3 bg-muted/10 border-b border-border">
          <div v-for="(file, index) in selectedFiles" :key="index" class="relative flex items-center gap-2 bg-background border border-border rounded-md p-1.5 pr-8 max-w-[200px] shadow-sm">
            <Icon icon="lucide:file-text" class="w-4 h-4 text-primary shrink-0" />
            <span class="text-xs truncate font-medium" :title="file.fileName">{{ file.fileName }}</span>
            <button @click="removeSelectedFile(index)" :disabled="isUploading" class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="lucide:x" class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Input Row -->
        <div class="flex items-end gap-0 p-1">
          <!-- File Attach Trigger -->
          <div v-if="allowFileUpload" class="shrink-0 mb-0.5 ml-1">
            <FilePicker v-model="selectedFiles" :multi-select="true" :max-size="maxFileSize" return-format="file">
              <template #trigger="{ trigger }">
                <Button variant="ghost" size="sm" icon="lucide:paperclip" rounded="full" class="px-0 text-muted-foreground hover:text-foreground transition-colors" @click="trigger" :disabled="isUploading" aria-label="Attach files" />
              </template>
            </FilePicker>
          </div>

          <!-- Textarea -->
          <textarea
            ref="textareaRef"
            v-model="inputText"
            :placeholder="placeholder"
            :disabled="isUploading"
            class="flex-1 max-h-[120px] min-h-[20px] w-full resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground scrollbar-thin disabled:opacity-50"
            rows="1"
            aria-label="Comment input"
            @input="handleInput"
            @keydown="handleKeyDown"
          />

          <!-- Action Buttons -->
          <div class="shrink-0 mb-0.5 mr-1 flex gap-1 items-center">
            <Button
              v-if="variant !== 'root'"
              variant="ghost"
              size="sm"
              class="h-8 text-muted-foreground hover:text-foreground"
              @click="emit('cancel')"
              :disabled="isUploading"
            >Cancel</Button>
            
            <Button
              variant="primary"
              size="sm"
              :icon="isUploading ? 'lucide:loader-2' : variant === 'edit' ? 'lucide:check' : 'lucide:send'"
              :loading="isUploading"
              rounded="full"
              class="h-8 w-8 px-0 transition-transform active:scale-95"
              :disabled="!canSubmit"
              @click="submit"
              :aria-label="variant === 'edit' ? 'Save changes' : 'Send comment'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
