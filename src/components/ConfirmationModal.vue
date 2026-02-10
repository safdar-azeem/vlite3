<script setup lang="ts">
import Modal from './Modal.vue'
import Button from './Button.vue'

interface Props {
  show?: boolean
  title: string
  description: string
  loading?: boolean
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary' | 'warning' | 'success' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  loading: false,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const close = () => {
  emit('cancel')
}
</script>

<template>
  <Modal
    :show="show"
    :title="title"
    :description="description"
    max-width="max-w-[400px]"
    @close="close"
    @update:show="(val) => !val && close()">
    <template #trigger>
      <slot name="trigger">
        <slot />
      </slot>
    </template>
    <div class="flex w-full items-center justify-end space-x-2 pt-4">
      <Button variant="outline" :text="cancelText" :disabled="loading" @click="close" />
      <Button :variant="variant" :text="confirmText" :loading="loading" @click="emit('confirm')" />
    </div>
  </Modal>
</template>
