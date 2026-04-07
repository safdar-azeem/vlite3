<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CommentDemo.vue?raw'
import { CommentThread } from '@/components/Comment'
import type { CommentNode, CommentActionPayload } from '@/components/Comment'
import { Button, Textarea, Avatar, CheckBox, Icon, FilePicker } from '@/index'
import type { FilePickerValue } from '@/components/FilePicker/FilePicker.vue'
import { useFileUpload } from '@/components/Form/composables/useFileUpload'

// --- Mock Data ---
const currentUser = {
  id: 'me_123',
  name: 'Safdar',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'Admin'
}

const generateId = () => Math.random().toString(36).substring(7)

const comments = ref<CommentNode[]>([
  {
    id: '1',
    text: "Here is the new design spec for the dashboard. Please review it carefully, particularly the new Splitter layout we've introduced.",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
    author: {
      id: 'usr_1',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      role: 'Designer'
    },
    attachments: [
      { fileName: 'Dashboard_V2.pdf', fileSize: 4500000, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { fileName: 'Mockup_Screenshot.png', fileSize: 1024000, fileUrl: 'https://via.placeholder.com/800x600?text=Mockup' }
    ],
    replies: [
      {
        id: '1-1',
        text: "The new Splitter layout looks incredibly clean. Great use of GPU layers for performance optimization!",
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 5, // 5 hours ago
        author: {
          id: 'usr_2',
          name: 'Bob Smith',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
          role: 'Engineer'
        },
        replies: [
          {
            id: '1-1-1',
            text: "Thanks Bob! I tried to align closely with the vlite3 aesthetics.",
            timestamp: new Date().getTime() - 1000 * 60 * 60 * 2, // 2 hours ago
            isEdited: true,
            author: { id: 'usr_1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
            replies: []
          }
        ]
      },
      {
        id: '1-2',
        text: "Are we sure the drag handlers support mobile touch events? We got burned by `mousemove` last quarter.",
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 4,
        author: {
          id: 'usr_3',
          name: 'Charlie Jenkins',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
          role: 'QA'
        },
        replies: [] // empty
      }
    ]
  },
  {
    id: '2',
    text: "Just checking in—are we clear to merge PR #442?",
    timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 mins ago
    author: {
      id: 'usr_4',
      name: 'Diana Prince',
      role: 'Lead'
    },
    replies: []
  }
])

// --- Internal State ---
const rootInput = ref('')
const inlineReplyInput = ref('')
const editInput = ref('')

const allowReply = ref(true)
const allowEdit = ref(true)
const allowDelete = ref(true)

const rootSelectedFiles = ref<FilePickerValue[]>([])
const { handleUploadFiles, loading: isUploading } = useFileUpload()

const removeRootFile = (index: number) => {
  if (isUploading.value) return
  rootSelectedFiles.value.splice(index, 1)
}

// --- Handlers ---
const submitRootComment = async () => {
  const text = rootInput.value.trim()
  const hasFiles = rootSelectedFiles.value.length > 0
  
  if (!text && !hasFiles) return

  let newAttachments = []
  
  if (hasFiles) {
    const filesToUpload = rootSelectedFiles.value.map(f => f.file).filter(Boolean) as File[]
    if (filesToUpload.length > 0) {
      const urls = await handleUploadFiles(filesToUpload)
      newAttachments = rootSelectedFiles.value.map((f, i) => ({
        fileName: f.fileName,
        fileSize: f.fileSize || 0,
        fileUrl: urls[i] || ''
      })).filter(a => a.fileUrl)
    }
  }

  comments.value.unshift({
    id: generateId(),
    text: text,
    author: currentUser,
    timestamp: new Date().getTime(),
    attachments: newAttachments,
    replies: []
  })
  
  rootInput.value = ''
  rootSelectedFiles.value = []
}

const submitInlineReply = (parentComment: CommentNode, closeFn: () => void) => {
  if (!inlineReplyInput.value.trim()) return
  
  const newReply: CommentNode = {
    id: generateId(),
    text: inlineReplyInput.value.trim(),
    author: currentUser,
    timestamp: new Date().getTime(),
    replies: []
  }
  
  if (!parentComment.replies) {
    parentComment.replies = []
  }
  parentComment.replies.push(newReply)
  
  inlineReplyInput.value = ''
  closeFn() // Clears the active reply ID from the Thread component
}

// Very basic recursive deletion for demonstration
const deleteCommentDeep = (nodes: CommentNode[], targetId: string | number) => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].replies && nodes[i].replies.length > 0) {
      if (deleteCommentDeep(nodes[i].replies, targetId)) return true
    }
  }
  return false
}

const handleDelete = (id: string | number) => {
  deleteCommentDeep(comments.value, id)
}

const editCommentDeep = (nodes: CommentNode[], targetId: string | number, newText: string) => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      nodes[i].text = newText
      nodes[i].isEdited = true
      return true
    }
    if (nodes[i].replies && nodes[i].replies.length > 0) {
      if (editCommentDeep(nodes[i].replies, targetId, newText)) return true
    }
  }
  return false
}

const handleEdit = (payload: CommentActionPayload) => {
  editInput.value = payload.comment.text
}

const submitInlineEdit = (comment: CommentNode, closeFn: () => void) => {
  if (!editInput.value.trim()) return
  editCommentDeep(comments.value, comment.id, editInput.value.trim())
  editInput.value = ''
  closeFn()
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-foreground">Interactive Discussion Thread</h1>
      <p class="text-muted-foreground w-full max-w-[80%]">
        A deeply nested visual comment tree used for context-driven discussions like Github Pull Requests, Jira tickets, or generic SaaS content collaboration. Features attachments, recursion, and double-click safety actions.
      </p>
    </div>

    <DemoSection title="Standard Usage" :code="sourceCode">
      <div class="flex gap-4 mb-4 items-center">
        <CheckBox v-model="allowReply" label="Allow Reply" />
        <CheckBox v-model="allowEdit" label="Allow Edit" />
        <CheckBox v-model="allowDelete" label="Allow Delete" />
      </div>

      <div class="w-full max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 lg:p-10">
        
        <CommentThread
          :comments="comments"
          :currentUserId="currentUser.id"
          :allow-reply="allowReply"
          :allow-edit="allowEdit"
          :allow-delete="allowDelete"
          @delete="handleDelete"
          @edit="handleEdit"
        >
          <template #root-input>
            <div class="flex gap-4 items-start w-full bg-muted/10 p-4 rounded-xl border border-border/60">
              <Avatar :src="currentUser.avatar" size="md" />
              <div class="flex flex-col flex-1 gap-3">
                
                <!-- Selected file previews -->
                <div v-if="rootSelectedFiles.length > 0" class="flex flex-wrap gap-2">
                  <div v-for="(file, index) in rootSelectedFiles" :key="index" class="relative flex items-center gap-2 bg-background border border-border rounded-md p-1.5 pr-8 max-w-[200px] shadow-sm">
                    <Icon icon="lucide:file-text" class="w-4 h-4 text-primary shrink-0" />
                    <span class="text-xs truncate font-medium" :title="file.fileName">{{ file.fileName }}</span>
                    <button @click="removeRootFile(index)" :disabled="isUploading" class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted/50 transition-colors disabled:opacity-50 xl:cursor-pointer">
                      <Icon icon="lucide:x" class="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <Textarea 
                  v-model="rootInput"
                  placeholder="Leave a new comment..." 
                  :rows="rootSelectedFiles.length > 0 ? 2 : 3"
                  class="bg-background!"
                  :disabled="isUploading"
                />
                <div class="flex justify-between items-center">
                  <FilePicker v-model="rootSelectedFiles" :multi-select="true" return-format="file">
                    <template #trigger="{ trigger }">
                      <Button variant="ghost" size="sm" icon="lucide:paperclip" rounded="full" class="px-0 text-muted-foreground hover:text-foreground h-8 w-8 transition-colors" @click="trigger" :disabled="isUploading" aria-label="Attach files" />
                    </template>
                  </FilePicker>
                  <Button @click="submitRootComment" :loading="isUploading">Comment</Button>
                </div>
              </div>
            </div>
          </template>

          <!-- Inline Reply Slot: Managed dynamically via `activeReplyId` internally! -->
          <template #inline-reply="{ comment, close }">
            <div class="flex gap-3 items-start w-full pl-2">
              <Avatar :src="currentUser.avatar" size="sm" class="mt-1" />
              <div class="flex flex-col flex-1 gap-2 border border-border rounded-lg bg-background p-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <textarea 
                  v-model="inlineReplyInput"
                  placeholder="Replying to discussion..." 
                  :rows="2"
                  class="w-full bg-transparent text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground"
                />
                <div class="flex justify-end gap-2 mt-1">
                  <Button variant="ghost" size="sm" @click="close">Cancel</Button>
                  <Button size="sm" @click="submitInlineReply(comment, close)">Reply</Button>
                </div>
              </div>
            </div>
          </template>

          <!-- Inline Edit Slot: Displayed as an inline editor when user clicks the pencil icon! -->
          <template #inline-edit="{ comment, close }">
            <div class="flex flex-col w-full gap-2 mt-1">
              <div class="flex items-center justify-between px-3 py-1.5 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border animate-in fade-in slide-in-from-bottom-2">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  <span>Editing Comment</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-[10px] hidden sm:inline-block opacity-60 mr-1">Press Esc to cancel</span>
                  <button @click="close" class="hover:text-foreground p-0.5 rounded-full hover:bg-background transition-colors" aria-label="Cancel editing">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex gap-3 items-start w-full border border-border rounded-lg bg-background p-3 focus-within:border-primary transition-all shadow-sm">
                <textarea 
                  v-model="editInput"
                  placeholder="Edit your comment..." 
                  :rows="2"
                  class="w-full bg-transparent text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground"
                  @keydown.escape="close"
                />
                <div class="flex flex-col gap-2 mt-1">
                  <Button variant="primary" size="sm" icon="lucide:check" rounded="full" class="h-8 w-8 px-0" @click="submitInlineEdit(comment, close)" />
                </div>
              </div>
            </div>
          </template>

        </CommentThread>
      </div>
    </DemoSection>
  </div>
</template>
