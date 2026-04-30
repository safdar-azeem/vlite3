<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import Icon from '../Icon.vue'
import type { WorkbookSheet } from './types'
import { Dropdown } from '@/components/Dropdown'
import IconPicker from '@/components/IconPicker.vue'
import { $t } from '@/utils/i18n'
import Button from '../Button.vue'

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
  allowIconChange?: boolean
  itemClass?: string
  activeItemClass?: string
  inactiveItemClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  canDelete: true,
  confirmDelete: false,
  allowIconChange: true,
  itemClass: '',
  activeItemClass: '',
  inactiveItemClass: '',
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

const displayTitle = computed(() =>
  props.sheet.titleI18n ? $t(props.sheet.titleI18n) : props.sheet.title
)

const startEdit = () => {
  localTitle.value = props.sheet.title
  emit('edit-start', props.sheet.id)
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

let isSaving = false
const saveEdit = () => {
  if (!props.isEditing || isSaving) return
  isSaving = true
  const val = localTitle.value.trim()
  if (val) {
    emit('update:title', props.sheet.id, val)
  } else {
    localTitle.value = props.sheet.title
  }
  emit('edit-end', props.sheet.id)
  setTimeout(() => {
    isSaving = false
  }, 100)
}

const cancelEdit = () => {
  localTitle.value = props.sheet.title
  emit('edit-end', props.sheet.id)
}

const menuOptions = computed(() => [
  {
    label:
      $t('vlite.workbook.rename') !== 'vlite.workbook.rename'
        ? $t('vlite.workbook.rename')
        : 'Rename',
    value: 'rename',
    icon: 'lucide:pencil',
  },
  {
    label:
      $t('vlite.workbook.duplicate') !== 'vlite.workbook.duplicate'
        ? $t('vlite.workbook.duplicate')
        : 'Duplicate',
    value: 'duplicate',
    icon: 'lucide:copy',
  },
  {
    label:
      $t('vlite.workbook.delete') !== 'vlite.workbook.delete'
        ? $t('vlite.workbook.delete')
        : 'Delete',
    value: 'delete',
    icon: 'lucide:trash-2',
    disabled: !props.canDelete,
    confirmation: props.confirmDelete
      ? {
          title: props.confirmDeleteTexts?.title,
          description: props.confirmDeleteTexts?.description,
          confirmText: props.confirmDeleteTexts?.confirm,
          cancelText: props.confirmDeleteTexts?.cancel,
          variant: 'danger' as const,
          onConfirm: () => {
            if (props.canDelete) {
              emit('delete', props.sheet.id)
            }
          },
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

const containerClass = computed(() => {
  return [
    'group relative flex items-center min-w-[120px] max-w-[240px] h-9 px-3 border-r border-border select-none cursor-pointer transition-all duration-200 ease-out',
    props.itemClass,
    props.isActive
      ? `bg-secondary text-foreground ring-1 ring-border ring-b-0 z-10 ${props.activeItemClass}`
      : `text-muted-foreground hover:bg-accent/50 ${props.inactiveItemClass}`,
    props.isEditing ? 'cursor-text' : '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <div :class="containerClass" @click="emit('select', sheet.id)" @dblclick="startEdit">
    <div @click.stop class="mr-2 flex items-center shrink-0">
      <IconPicker
        v-if="(sheet.icon || isEditing) && allowIconChange"
        :value="sheet.icon || 'lucide:file'"
        position="bottom-start"
        @onSelect="(val) => emit('update:icon', sheet.id, val)">
        <template #default>
          <button
            type="button"
            class="flex items-center justify-center rounded hover:bg-accent transition-colors p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 mt-1">
            <Icon
              :icon="sheet.icon || 'lucide:file'"
              class="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </button>
        </template>
      </IconPicker>

      <div v-else-if="sheet.icon" class="flex items-center justify-center p-0.5">
        <Icon :icon="sheet.icon" class="w-4 h-4 opacity-70" />
      </div>
    </div>

    <div class="flex-1 min-w-0 pr-1">
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="localTitle"
        type="text"
        class="w-full bg-transparent border-none outline-none p-0 text-sm font-medium text-foreground placeholder-muted-foreground focus:ring-0"
        @blur="saveEdit"
        @keydown.enter.prevent="saveEdit"
        @keydown.esc.prevent="cancelEdit"
        @click.stop />
      <span v-else class="block truncate text-sm font-medium leading-normal">
        {{ displayTitle }}
      </span>
    </div>

    <div
      class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto pl-1 -mr-2 flex items-center"
      @click.stop>
      <Dropdown
        :options="menuOptions"
        :position="'bottom-end'"
        :width="'140px'"
        :teleport="true"
        @onSelect="handleMenuSelect">
        <template #trigger>
          <Button icon="lucide:more-vertical" asIcon size="xs" rounded="full" variant="ghost" />
        </template>
      </Dropdown>
    </div>
  </div>
</template>
