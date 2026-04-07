<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CommentDemo.vue?raw'
import { CommentThread } from '@/components/Comment'
import type { CommentNode, CommentActionPayload } from '@/components/Comment'
import { Button, Textarea, Avatar } from '@/index'

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

// --- Handlers ---
const submitRootComment = () => {
  if (!rootInput.value.trim()) return
  comments.value.unshift({
    id: generateId(),
    text: rootInput.value.trim(),
    author: currentUser,
    timestamp: new Date().getTime(),
    replies: []
  })
  rootInput.value = ''
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
      <div class="w-full max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 lg:p-10">
        
        <CommentThread
          :comments="comments"
          :currentUserId="currentUser.id"
          @delete="handleDelete"
          @edit="handleEdit"
        >
          <!-- Root Form Slot: Displayed cleanly at the top of the thread list! -->
          <template #root-input>
            <div class="flex gap-4 items-start w-full bg-muted/10 p-4 rounded-xl border border-border/60">
              <Avatar :src="currentUser.avatar" size="md" />
              <div class="flex flex-col flex-1 gap-3">
                <Textarea 
                  v-model="rootInput"
                  placeholder="Leave a new comment..." 
                  :rows="3"
                  class="bg-background!"
                />
                <div class="flex justify-end">
                  <Button @click="submitRootComment">Comment</Button>
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
