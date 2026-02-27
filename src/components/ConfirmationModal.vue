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

const cancel = () => {
  emit('cancel')
}
</script>

<template>
  <Modal
    :show="show"
    footerClass="border-t-0! pt-0! pb-3.5!"
    max-width="max-w-[400px]"
    @close="cancel"
    @update:show="(val) => !val && cancel()">
    <template #trigger>
      <slot name="trigger">
        <slot />
      </slot>
    </template>
    <div class="py-2 px-[2px]">
      <h3 class="mb-1.5">
        {{ title }}
      </h3>
      <p class="text-sm text-muted">
        {{ description }}
      </p>
    </div>
    <template #footer="{ close }">
      <div class="flex w-full items-center justify-end space-x-2 px-[2px]">
        <Button
          variant="secondary"
          :text="cancelText"
          :disabled="loading"
          size="sm2"
          @click="
            () => {
              close?.()
              cancel?.()
            }
          " />
        <Button
          size="sm2"
          :variant="variant"
          :text="confirmText"
          :loading="loading"
          @click="emit('confirm')" />
      </div>
    </template>
  </Modal>
</template>
