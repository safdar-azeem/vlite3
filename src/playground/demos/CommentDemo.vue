<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CommentDemo.vue?raw'
import { CommentThread, type CommentNode, type CommentSubmitPayload } from '@/components/Comment'
import { CheckBox } from '@/index'

// --- Mock Data ---
const currentUser = {
  id: 'me_123',
  name: 'Safdar',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'Admin',
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
      role: 'Designer',
    },
    attachments: [
      {
        fileName: 'Dashboard_V2.pdf',
        fileSize: 4500000,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        fileName: 'Mockup_Screenshot.png',
        fileSize: 1024000,
        fileUrl: 'https://via.placeholder.com/800x600?text=Mockup',
      },
    ],
    replies: [
      {
        id: '1-1',
        text: 'The new Splitter layout looks incredibly clean. Great use of GPU layers for performance optimization!',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 5, // 5 hours ago
        author: {
          id: 'usr_2',
          name: 'Bob Smith',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
          role: 'Engineer',
        },
        replies: [
          {
            id: '1-1-1',
            text: 'Thanks Bob! I tried to align closely with the vlite3 aesthetics.',
            timestamp: new Date().getTime() - 1000 * 60 * 60 * 2, // 2 hours ago
            isEdited: true,
            author: {
              id: 'usr_1',
              name: 'Alice Johnson',
              avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
            },
            replies: [],
          },
        ],
      },
      {
        id: '1-2',
        text: 'Are we sure the drag handlers support mobile touch events? We got burned by `mousemove` last quarter.',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 4,
        author: {
          id: 'usr_3',
          name: 'Charlie Jenkins',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
          role: 'QA',
        },
        replies: [], // empty
      },
    ],
  },
  {
    id: '2',
    text: 'Just checking in—are we clear to merge PR #442?',
    timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 mins ago
    author: {
      id: 'usr_4',
      name: 'Diana Prince',
      role: 'Lead',
    },
    hasMoreReplies: true,
    replyCount: 4,
    replies: [
      {
        id: '2-1',
        text: 'Not yet, tests are still running. Jenkins has been acting up all morning with the runners.',
        timestamp: new Date().getTime() - 1000 * 60 * 25,
        author: {
          id: 'usr_5',
          name: 'Evan QA',
        },
        replies: []
      }
    ],
  },
])

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

// --- Pagination Mock Handlers ---
const hasMoreRoots = ref(true)
const loadingRoots = ref(false)

const handleLoadMore = async () => {
  loadingRoots.value = true
  await new Promise((r) => setTimeout(r, 1200)) // simulate network delay
  
  comments.value.push({
    id: `root-old-${generateId()}`,
    text: "Can someone check the metrics for last week's conversion drop? It seems localized to iOS Safari.",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 48, // 2 days ago
    author: { id: 'usr_9', name: 'Gary Marketing' },
    hasMoreReplies: true,
    replyCount: 12,
    replies: []
  })
  
  loadingRoots.value = false
  hasMoreRoots.value = false // exhaust demo load
}

const handleLoadMoreReplies = async (id: string | number) => {
  const comment = findCommentDeep(comments.value, id)
  if (!comment) return
  
  comment.loadingMoreReplies = true
  await new Promise((r) => setTimeout(r, 1000))
  
  if (!comment.replies) comment.replies = []
  
  comment.replies.push(
    {
      id: `reply-${generateId()}`,
      text: 'Ah I see, they finally passed just now.',
      timestamp: new Date().getTime() - 1000 * 60 * 5,
      author: { id: 'usr_4', name: 'Diana Prince', role: 'Lead' },
    },
    {
      id: `reply-${generateId()}`,
      text: 'Merging now thanks Evan.',
      timestamp: new Date().getTime() - 1000 * 60 * 1,
      author: { id: 'usr_1', name: 'Alice Johnson' },
    }
  )
  
  comment.loadingMoreReplies = false
  comment.hasMoreReplies = false // exhaust demo load
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
          :has-more="hasMoreRoots"
          :loading-more="loadingRoots"
          @add="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete"
          @load-more="handleLoadMore"
          @load-more-replies="handleLoadMoreReplies" />
      </div>
    </DemoSection>

    <DemoSection title="External Editor Usage" :code="''">
      <div
        class="flex flex-col gap-8 w-full max-w-4xl mx-auto rounded-xl border border-border bg-background p-6 lg:p-10 shadow-sm">
        <p class="text-sm text-foreground mb-2">
          If you want to render the editor somewhere completely separated from the comment thread
          (for example, pinned to the bottom of the screen, or in a sidebar), you can hide the
          integrated input and use the <code>&lt;CommentEditor /&gt;</code> natively.
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
          @delete="handleDelete" />

        <div
          class="w-full flex flex-col gap-2 p-6 bg-muted/10 border border-dashed border-border rounded-xl mt-8">
          <p class="text-sm font-medium text-center text-muted-foreground mb-2">
            Completely External Editor
          </p>
          <CommentEditor
            variant="root"
            placeholder="This editor is decoupled from the thread above..."
            :current-user="currentUser"
            @submit="(text, atts) => handleAdd({ text, attachments: atts })" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
