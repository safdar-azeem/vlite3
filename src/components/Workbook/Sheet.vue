<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from 'vue'
import Icon from '../Icon.vue'
import type { WorkbookSheet } from './types'
import { Dropdown } from '@/components/Dropdown'
import IconPicker from '@/components/IconPicker.vue'

interface Props {
  sheet: WorkbookSheet
  isActive: boolean
  isEditing?: boolean
  canDelete?: boolean
  confirmDelete?: boolean
  confirmDeleteTexts?: {
    title?: string
    description?: string
    confirm?: string
    cancel?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  canDelete: true,
  confirmDelete: false,
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'update:title', id: string, newTitle: string): void
  (e: 'update:icon', id: string, newIcon: string): void
  (e: 'edit-start', id: string): void
  (e: 'edit-end', id: string): void
  (e: 'duplicate', id: string): void
  (e: 'delete', id: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const localTitle = ref(props.sheet.title)

// Focus input when editing starts
const startEdit = () => {
  localTitle.value = props.sheet.title
  emit('edit-start', props.sheet.id)
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

const saveEdit = () => {
  if (!props.isEditing) return
  const val = localTitle.value.trim()
  if (val) {
    emit('update:title', props.sheet.id, val)
  } else {
    // Revert if empty
    localTitle.value = props.sheet.title
  }
  emit('edit-end', props.sheet.id)
}

const cancelEdit = () => {
  localTitle.value = props.sheet.title
  emit('edit-end', props.sheet.id)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') saveEdit()
  if (e.key === 'Escape') cancelEdit()
}

// Menu Actions
const menuOptions = computed(() => [
  { label: 'Rename', value: 'rename', icon: 'lucide:pencil' },
  { label: 'Duplicate', value: 'duplicate', icon: 'lucide:copy' },
  {
    label: 'Delete',
    value: 'delete',
    icon: 'lucide:trash-2',
    class: 'text-danger',
    disabled: !props.canDelete,
    confirmation: props.confirmDelete
      ? {
          title: props.confirmDeleteTexts?.title,
          description: props.confirmDeleteTexts?.description,
          confirmText: props.confirmDeleteTexts?.confirm,
          cancelText: props.confirmDeleteTexts?.cancel,
          variant: 'danger' as const,
        }
      : undefined,
  },
])

const handleMenuSelect = (option: any) => {
  if (option.value === 'rename') startEdit()
  if (option.value === 'duplicate') emit('duplicate', props.sheet.id)
  if (option.value === 'delete') {
    if (!props.canDelete) return
    emit('delete', props.sheet.id)
  }
}

// Styles
const containerClass = computed(() => {
  return [
    'group relative flex items-center min-w-[120px] max-w-[240px] h-9 px-3 border-r border-border select-none cursor-pointer transition-all duration-200 ease-out',
    props.isActive
      ? 'bg-muted text-foreground ring-1 ring-border ring-b-0 z-10'
      : 'text-muted-foreground hover:bg-accent/50',
    props.isEditing ? 'cursor-text' : '',
  ].join(' ') // "border-b-0" logic handled by parent container's bottom border or z-index
})
</script>

<template>
  <div :class="containerClass" @click="emit('select', sheet.id)" @dblclick="startEdit">
    <!-- Icon / IconPicker -->
    <div @click.stop class="mr-2 flex items-center shrink-0">
      <IconPicker
        v-if="sheet.icon || isEditing"
        :value="sheet.icon || 'lucide:file'"
        position="bottom-start"
        @onSelect="(val) => emit('update:icon', sheet.id, val)">
        <template #default>
          <button
            type="button"
            class="flex items-center justify-center rounded hover:bg-accent transition-colors p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
            <Icon
              :icon="sheet.icon || 'lucide:file'"
              class="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </button>
        </template>
      </IconPicker>
      <!-- If no icon and not editing, maybe show nothing or default? 
                 User said "showing the icon with the tab title". 
                 If tab.icon is missing, usually we showed nothing? 
                 The original code was v-if="tab.icon". 
                 Let's stick to showing it if it exists OR if we want to allow adding one (maybe isEditing is a good trigger to show a placeholder?)
                 For now, let's stick to replacing the existing v-if="tab.icon" block essentially, 
                 but wrapping it in IconPicker. 
            -->
    </div>

    <!-- Title / Input -->
    <div class="flex-1 min-w-0 pr-1">
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="localTitle"
        type="text"
        class="w-full bg-transparent border-none outline-none p-0 text-sm font-medium text-foreground placeholder-muted-foreground focus:ring-0"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        @click.stop />
      <span v-else class="block truncate text-sm font-medium leading-normal">
        {{ sheet.title }}
      </span>
    </div>

    <!-- Hover Actions (Menu) -->
    <div
      class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto pl-1 flex items-center bg-inherit">
      <Dropdown
        :options="menuOptions"
        :position="'bottom-end'"
        :width="'140px'"
        :teleport="true"
        @onSelect="handleMenuSelect">
        <template #trigger>
          <button
            class="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <Icon icon="lucide:more-vertical" class="w-3.5 h-3.5" />
          </button>
        </template>
        <template #item="{ option }">
          <div :class="['flex items-center']">
            <Icon v-if="option?.icon" :icon="option?.icon" class="w-3.5 h-3.5 mr-2 opacity-70" />
            {{ option?.label }}
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
