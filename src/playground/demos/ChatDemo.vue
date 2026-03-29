<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { ChatInterface, type ChatMessage, type ChatAttachment } from '@/components/Chat'
import sourceCode from './ChatDemo.vue?raw'

const currentUserId = 'user_1'
const chatFolderId = 'demo-chat-attachments'

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    senderId: 'user_2',
    senderName: 'Alice',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    avatar: 'https://i.pravatar.cc/150?img=5',
    isEdited: true,
    attachments: [
      {
        fileName: '626182816_185153763_n.jpg',
        fileUrl:
          'https://fastly.picsum.photos/id/197/400/400.jpg?hmac=EMGJfztOncchyhxYLBig-GifHwLYkvPrZJvM_oDgYfQ',
        fileType: 'image/png',
        fileSize: 1024 * 150,
      },
    ],
  },
  {
    id: 2,
    text: '',
    senderId: 'user_1',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    attachments: [
      {
        fileName: 'design_preview.png',
        fileUrl:
          'https://fastly.picsum.photos/id/197/400/400.jpg?hmac=EMGJfztOncchyhxYLBig-GifHwLYkvPrZJvM_oDgYfQ',
        fileType: 'image/png',
        fileSize: 1024 * 150,
      },
      {
        fileName: 'requirements_doc.pdf',
        fileUrl:
          'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024 * 2.5,
      },
    ],
  },
])

const handleAdd = (text: string, attachments?: ChatAttachment[]) => {
  messages.value.push({
    id: Date.now(),
    text,
    senderId: currentUserId,
    senderName: 'Me',
    timestamp: new Date(),
    attachments: attachments || [],
  })
}

const handleDelete = (id: string | number) => {
  messages.value = messages.value.filter((m) => m.id !== id)
}

const handleEdit = (updatedMsg: ChatMessage) => {
  const index = messages.value.findIndex((m) => m.id === updatedMsg.id)
  if (index !== -1) {
    // Replace the old message with the updated one to trigger reactivity correctly
    messages.value[index] = { ...updatedMsg }
  }
}

const loadingMore = ref(false)
const page = ref(1)

const handleRefetch = () => {
  if (loadingMore.value) return

  // Stop fetching after 3 pages to simulate end of history
  if (page.value >= 3) return

  loadingMore.value = true

  setTimeout(() => {
    const olderMessages: ChatMessage[] = [
      {
        id: Date.now() - Math.random() * 100000,
        text: `Older message batch ${page.value} - Message 1`,
        senderId: 'user_2',
        senderName: 'Alice',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * page.value),
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      {
        id: Date.now() - Math.random() * 100000,
        text: `Older message batch ${page.value} - Message 2`,
        senderId: 'user_1',
        senderName: 'Me',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23 * page.value),
      },
      {
        id: Date.now() - Math.random() * 100000,
        text: `Older message batch ${page.value} - Message 3`,
        senderId: 'user_3',
        senderName: 'Bob',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22 * page.value),
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
    ].sort((a, b) => (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime())

    messages.value = [...olderMessages, ...messages.value]
    page.value++
    loadingMore.value = false
  }, 1200) // Simulated network delay
}

const showAvatar = ref(true)
const showUserInfo = ref(true)
const showTimestamp = ref(true)
const showEditedStatus = ref(true)
const allowDeleteAll = ref(false)
const allowEditAll = ref(false)
const allowFileUpload = ref(true)
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Chat Interface</h2>
      <p class="text-gray-500">
        A completely agnostic, highly reusable, enterprise-grade Chat component supporting reverse
        infinite scrolling, editing, deleting, file attachments, and responsive textareas.
      </p>
    </div>

    <div class="flex flex-col gap-4 mb-4">
      <div class="flex gap-4 flex-wrap pb-4 border-b border-border">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="showAvatar" class="rounded border-gray-300" /> Show Avatar
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="showUserInfo" class="rounded border-gray-300" /> Show User
          Info
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="showTimestamp" class="rounded border-gray-300" /> Show
          Timestamp
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="showEditedStatus" class="rounded border-gray-300" /> Show
          Edited Status
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="allowFileUpload" class="rounded border-gray-300" /> Allow
          File Upload
        </label>
      </div>

      <div class="flex gap-4 flex-wrap">
        <label class="flex items-center gap-2 text-sm cursor-pointer text-blue-600 font-medium">
          <input type="checkbox" v-model="allowDeleteAll" class="rounded border-blue-300" /> Admin:
          Allow Delete All
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer text-blue-600 font-medium">
          <input type="checkbox" v-model="allowEditAll" class="rounded border-blue-300" /> Admin:
          Allow Edit All
        </label>
      </div>
    </div>

    <DemoSection title="Standard Chat with Attachments" :code="sourceCode">
      <div
        class="h-[600px] border border-border rounded-xl w-[200px] overflow-hidden bg-card flex flex-col shadow-sm">
        <ChatInterface
          :data="messages"
          :current-user-id="currentUserId"
          :show-avatar="showAvatar"
          :show-user-info="showUserInfo"
          :show-timestamp="showTimestamp"
          :show-edited-status="showEditedStatus"
          :is-loading-more="loadingMore"
          :allow-delete-all="allowDeleteAll"
          :allow-edit-all="allowEditAll"
          :allow-file-upload="allowFileUpload"
          :folder-id="chatFolderId"
          :max-file-size="10 * 1024 * 1024"
          @add="handleAdd"
          @delete="handleDelete"
          @edit="handleEdit"
          @refetch="handleRefetch" />
      </div>
    </DemoSection>
  </div>
</template>
