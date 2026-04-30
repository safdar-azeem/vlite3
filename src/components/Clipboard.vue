<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from './Button.vue'
import type { ButtonVariant, ButtonSize, ButtonRounded } from '@/types'
import { $t } from '@/utils/i18n'

export interface ClipboardProps {
  /** The content to be copied to the clipboard */
  textToCopy: string
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: ButtonRounded
  class?: any
  disabled?: boolean
  defaultIcon?: string
  copiedIcon?: string
  defaultText?: string
  copiedText?: string
  defaultTextI18n?: string
  copiedTextI18n?: string
  asIcon?: boolean
}

const props = withDefaults(defineProps<ClipboardProps>(), {
  variant: 'outline',
  size: 'md',
  rounded: 'full',
  defaultIcon: 'lucide:copy',
  copiedIcon: 'lucide:check',
  defaultTextI18n: 'vlite.clipboard.copy',
  copiedTextI18n: 'vlite.clipboard.copied',
  asIcon: false,
})

const emit = defineEmits<{
  (e: 'copy', text: string): void
  (e: 'error', err: Error): void
}>()

const copied = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

const currentIcon = computed(() => (copied.value ? props.copiedIcon : props.defaultIcon))

const currentText = computed(() => {
  if (props.asIcon) return undefined
  if (copied.value) {
    if (props.copiedText) return props.copiedText
    const res = $t(props.copiedTextI18n)
    return res !== props.copiedTextI18n ? res : 'Copied'
  } else {
    if (props.defaultText) return props.defaultText
    const res = $t(props.defaultTextI18n)
    return res !== props.defaultTextI18n ? res : 'Copy'
  }
})

const handleCopy = async () => {
  if (props.disabled) return

  try {
    await navigator.clipboard.writeText(props.textToCopy)
    copied.value = true
    emit('copy', props.textToCopy)

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      copied.value = false
    }, 500)
  } catch (err) {
    emit('error', err instanceof Error ? err : new Error('Copy failed'))
  }
}
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :rounded="rounded"
    :class="props.class"
    :disabled="disabled"
    :icon="currentIcon"
    :text="currentText"
    :as-icon="asIcon"
    @click="handleCopy">
    <slot v-if="!asIcon && !currentText" name="default" :copied="copied"></slot>
  </Button>
</template>
