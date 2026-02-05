<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../Icon.vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import Avatar from '@/components/Avatar.vue'
import type { AvatarSize, AvatarRounded } from '@/types'

// Re-export specific props or define new ones similar to Avatar
export interface Props {
  modelValue?: any // The URL or Base64 string of the current avatar, or FilePickerValue object
  size?: AvatarSize
  rounded?: AvatarRounded
  editable?: boolean
  loading?: boolean
  disabled?: boolean
  fallback?: string
  alt?: string
  maxSize?: number // Bytes
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  size: 'xl', // Default to a larger size for uploader usually
  rounded: 'full',
  editable: true,
  loading: false,
  disabled: false,
  alt: 'Avatar',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: FilePickerValue | null): void // Emits full file object details
  (e: 'error', error: string): void
}>()

// Internal preview to show immediately before upload confirmation if needed,
// allows optimistically showing the selected image
const previewUrl = ref<string | null>(null)

const currentImage = computed(() => {
  return previewUrl.value || props.modelValue
})

const handleFileChange = (fileVal: FilePickerValue | FilePickerValue[] | null) => {
  if (!fileVal || Array.isArray(fileVal)) {
    // Should be single file
    if (Array.isArray(fileVal) && fileVal.length === 0) {
      handleRemove()
    }
    return
  }

  // Update preview immediately
  if (fileVal.base64) {
    previewUrl.value = fileVal.base64
    emit('update:modelValue', fileVal.base64)
  }

  emit('change', fileVal)
}

const handleError = (err: string) => {
  emit('error', err)
}

const handleRemove = () => {
  previewUrl.value = null
  emit('update:modelValue', null)
  emit('change', null)
}

const containerClass = computed(() => {
  return [
    'group relative inline-block',
    // If rounded is full, we need overflow hidden on the container to clip the overlay
    props.rounded === 'full' ? 'rounded-full' : '',
  ].join(' ')
})
</script>

<template>
  <div :class="containerClass">
    <FilePicker
      :disabled="!editable || disabled || loading"
      :return-format="'base64'"
      :file-types="['image/jpeg', 'image/png', 'image/webp', 'image/gif']"
      :max-size="maxSize"
      class="w-auto h-auto block"
      @change="(v: any) => handleFileChange(v)"
      @error="handleError">
      <template #trigger="{ trigger, isLoading }">
        <div
          class="relative cursor-pointer transition-transform active:scale-95 inline-block"
          :class="{ 'cursor-default': !editable || disabled }"
          @click="editable && !disabled ? trigger() : null">
          <Avatar
            :src="currentImage || undefined"
            :fallback="fallback"
            :alt="alt"
            :size="size"
            :rounded="rounded"
            :class="className" />

          <!-- Loading Overlay -->
          <div
            v-if="loading || isLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] text-white transition-opacity"
            :class="rounded === 'full' ? 'rounded-full' : 'rounded-md'">
            <Icon icon="lucide:loader-2" class="animate-spin w-1/3 h-1/3" />
          </div>

          <!-- Host Overlay (Edit) -->
          <div
            v-else-if="editable && !disabled"
            class="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            :class="rounded === 'full' ? 'rounded-full' : 'rounded-md'">
            <Icon icon="lucide:camera" class="w-1/3 h-1/3" />
          </div>
        </div>
      </template>
    </FilePicker>

    <!-- Remove Button (Optional - could be outside, but nice to have in corners if space permits) -->
    <!-- Only showing if we have a value and it's editable -->
    <button
      v-if="currentImage && editable && !disabled && !loading"
      type="button"
      class="absolute -top-1 -right-1 z-10 p-1 bg-background border border-border rounded-full text-muted-foreground shadow-sm hover:text-destructive hover:border-destructive transition-colors opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 duration-200 transform"
      @click.stop="handleRemove"
      title="Remove image">
      <Icon icon="lucide:x" class="w-3 h-3" />
    </button>
  </div>
</template>
