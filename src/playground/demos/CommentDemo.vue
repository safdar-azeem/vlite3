<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CommentDemo.vue?raw'
import { CommentThread, CommentEditor, type CommentNode, type CommentSubmitPayload } from '@/components/Comment'
import { CheckBox } from '@/index'

// --- Mock Data ---
const currentUser = {
  id: 'me_123',
  name: 'Safdar',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'Admin',
}

const generateId = () => Math.random().toString(36).substring(7)

const comments = ref<CommentNode[]>([])

// --- Internal Config State ---
const allowReply = ref(true)
const allowEdit = ref(true)
const allowDelete = ref(true)
const allowFileUpload = ref(true)
const allowDeleteAll = ref(false)
const folderId = 'demo-comment-attachments'

// Helper to find a comment anywhere in the tree
const findCommentDeep = (nodes: CommentNode[], targetId: string | number): CommentNode | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) return nodes[i]
    if (nodes[i].replies && nodes[i].replies.length > 0) {
      const found = findCommentDeep(nodes[i].replies, targetId)
      if (found) return found
    }
  }
  return null
}

// --- Unified API Handlers ---
const handleAdd = (payload: CommentSubmitPayload) => {
  const newComment: CommentNode = {
    id: generateId(),
    text: payload.text,
    author: currentUser,
    timestamp: new Date().getTime(),
    attachments: payload.attachments || [],
    replies: [],
  }

  // If there is a parentId, it's an inline reply
  if (payload.parentId) {
    const parent = findCommentDeep(comments.value, payload.parentId)
    if (parent) {
      if (!parent.replies) parent.replies = []
      parent.replies.push(newComment)
    }
  } else {
    // It's a root comment
    comments.value.unshift(newComment)
  }
}

const handleEdit = (updatedComment: CommentNode) => {
  // Just find and replace the node data natively
  const existing = findCommentDeep(comments.value, updatedComment.id)
  if (existing) {
    existing.text = updatedComment.text
    existing.isEdited = true
    existing.attachments = updatedComment.attachments
  }
}

const deleteCommentDeep = (nodes: CommentNode[], targetId: string | number): boolean => {
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
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-foreground">Interactive Discussion Thread</h1>
      <p class="text-muted-foreground w-full max-w-3xl">
        A completely abstracted, fully functional interactive comment thread. It natively handles
        inline replies, edits, file attachments, and infinite recursion — leaving you to simply
        connect your data source via `@add`, `@edit`, and `@delete`.
      </p>
    </div>

    <div class="flex gap-4 mb-4 flex-wrap pb-4 border-b border-border">
      <CheckBox v-model="allowReply" label="Allow Reply" />
      <CheckBox v-model="allowEdit" label="Allow Edit" />
      <CheckBox v-model="allowDelete" label="Allow Delete" />
      <CheckBox v-model="allowFileUpload" label="Allow File Upload" />
      <CheckBox v-model="allowDeleteAll" label="Admin: Allow Delete All" />
    </div>

    <DemoSection title="Standard Usage" :code="sourceCode">
      <div
        class="w-full max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 lg:p-10 shadow-sm">
        <CommentThread
          :comments="comments"
          :current-user="currentUser"
          :allow-reply="allowReply"
          :allow-edit="allowEdit"
          :allow-delete="allowDelete"
          :allow-file-upload="allowFileUpload"
          :allow-delete-all="allowDeleteAll"
          :folder-id="folderId"
          :max-file-size="10 * 1024 * 1024"
          @add="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete" />
      </div>
    </DemoSection>

    <DemoSection title="External Editor Usage" :code="''">
      <div class="flex flex-col gap-8 w-full max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 lg:p-10 shadow-sm">
        
        <p class="text-sm text-foreground mb-2">
          If you want to render the editor somewhere completely separated from the comment thread (for example, pinned to the bottom of the screen, or in a sidebar), you can hide the integrated input and use the <code>&lt;CommentEditor /&gt;</code> natively.
        </p>

        <!-- Hide the native input built-into the thread -->
        <CommentThread
          :comments="comments"
          :current-user="currentUser"
          input-position="hidden"
          :allow-reply="allowReply"
          :allow-edit="allowEdit"
          :allow-delete="allowDelete"
          @add="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete" 
        />

        <div class="w-full flex flex-col gap-2 p-6 bg-muted/10 border border-dashed border-border rounded-xl mt-8">
          <p class="text-sm font-medium text-center text-muted-foreground mb-2">Completely External Editor</p>
          <CommentEditor
            variant="root"
            placeholder="This editor is decoupled from the thread above..."
            :current-user="currentUser"
            @submit="(text, atts) => handleAdd({ text, attachments: atts })"
          />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
