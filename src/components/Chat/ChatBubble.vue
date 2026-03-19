<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '../Avatar.vue'
import Button from '../Button.vue'
import type { ChatMessage } from './ChatInterface.vue'

const props = defineProps<{
  message: ChatMessage
  isSender: boolean
  showAvatar: boolean
  showUserInfo: boolean
  showTimestamp: boolean
  allowDeleteAll?: boolean
  allowEditAll?: boolean
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
</script>

<template>
  <div
    class="flex w-full gap-3 group"
    :class="isSender ? 'flex-row-reverse' : 'flex-row'"
  >
    <div v-if="showAvatar" class="flex-shrink-0 flex flex-col justify-end pb-1">
      <Avatar :src="message.avatar" :alt="message.senderName" size="sm" />
    </div>

    <div class="flex flex-col max-w-[85%] md:max-w-[75%]" :class="isSender ? 'items-end' : 'items-start'">
      
      <div v-if="showUserInfo && message.senderName && !isSender" class="mb-1 text-xs text-muted-foreground ml-1">
        {{ message.senderName }}
      </div>

      <div class="relative flex items-center group/bubble" :class="isSender ? 'flex-row-reverse' : 'flex-row'">
        
        <div
          class="px-3.5 py-2.5 rounded-2xl break-words relative"
          :class="[
            isSender 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'bg-muted text-foreground rounded-bl-sm'
          ]"
        >
          <p class="text-sm whitespace-pre-wrap leading-relaxed">{{ message.text }}</p>
          <div v-if="message.isEdited" class="text-[10px] opacity-70 mt-0.5 text-right" :class="isSender ? 'text-primary-foreground' : 'text-muted-foreground'">
            (edited)
          </div>
        </div>
        
        <div class="opacity-0 group-hover/bubble:opacity-100 focus-within:opacity-100 transition-opacity flex gap-1 px-2 pointer-events-none group-hover/bubble:pointer-events-auto focus-within:pointer-events-auto">
            <Button v-if="isSender || allowEditAll" variant="ghost" size="xs" icon="lucide:pencil" rounded="full" class="text-muted-foreground hover:text-foreground h-7 w-7" @click="emit('edit', message)" aria-label="Edit message" />
            <Button v-if="isSender || allowDeleteAll" variant="ghost" size="xs" icon="lucide:trash-2" rounded="full" class="text-muted-foreground hover:text-destructive h-7 w-7" @click="emit('delete', message.id)" aria-label="Delete message" />
        </div>
      </div>

      <div v-if="showTimestamp && message.timestamp" class="mt-1 text-[10px] text-muted-foreground mx-1">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>
