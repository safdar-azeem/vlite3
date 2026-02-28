<script setup lang="ts">
import Modal from './Modal.vue'
import Button from './Button.vue'
import { computed } from 'vue'
import { $t } from '@/utils/i18n'

interface Props {
  show?: boolean
  title: string
  titleI18n?: string
  description: string
  descriptionI18n?: string
  loading?: boolean
  confirmText?: string
  confirmTextI18n?: string
  cancelText?: string
  cancelTextI18n?: string
  variant?: 'danger' | 'primary' | 'warning' | 'success' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  loading: false,
  variant: 'danger',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const cancel = () => {
  emit('cancel')
}

const displayTitle = computed(() => props.titleI18n ? $t(props.titleI18n) : props.title)
const displayDescription = computed(() => props.descriptionI18n ? $t(props.descriptionI18n) : props.description)

const displayConfirmText = computed(() => {
  if (props.confirmTextI18n) return $t(props.confirmTextI18n)
  if (props.confirmText) return props.confirmText
  const res = $t('vlite.confirmation.confirm')
  return res !== 'vlite.confirmation.confirm' ? res : 'Confirm'
})

const displayCancelText = computed(() => {
  if (props.cancelTextI18n) return $t(props.cancelTextI18n)
  if (props.cancelText) return props.cancelText
  const res = $t('vlite.confirmation.cancel')
  return res !== 'vlite.confirmation.cancel' ? res : 'Cancel'
})
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
      <h3 class="mb-1.5 font-semibold text-lg">
        {{ displayTitle }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ displayDescription }}
      </p>
    </div>
    <template #footer="{ close }">
      <div class="flex w-full items-center justify-end space-x-2 px-[2px]">
        <Button
          variant="secondary"
          :text="displayCancelText"
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
          :text="displayConfirmText"
          :loading="loading"
          @click="emit('confirm')" />
      </div>
    </template>
  </Modal>
</template>

