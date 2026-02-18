<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import FilePicker from '@/components/FilePicker/FilePicker.vue'
import type { FilePickerValue } from '@/components/FilePicker/FilePicker.vue'
import Avatar from '@/components/Avatar.vue'
import type { AvatarSize, AvatarRounded } from '@/types'

defineOptions({
  name: 'AvatarUploader',
})

export interface Props {
  modelValue?: any
  size?: AvatarSize
  rounded?: AvatarRounded
  editable?: boolean
  loading?: boolean
  disabled?: boolean
  fallback?: string
  alt?: string
  maxSize?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  size: 'xl',
  rounded: 'full',
  editable: true,
  loading: false,
  disabled: false,
  alt: 'Avatar',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: FilePickerValue | null): void
  (e: 'error', error: string): void
}>()

const previewUrl = ref<string | null>(null)

const currentImage = computed(() => {
  return previewUrl.value || props.modelValue
})

const handleFileChange = (fileVal: FilePickerValue | FilePickerValue[] | null) => {
  if (!fileVal || Array.isArray(fileVal)) {
    if (Array.isArray(fileVal) && fileVal.length === 0) {
      handleRemove()
    }
    return
  }

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
</script>

<template>
  <div class="inline-block">
    <div
      class="relative inline-block group"
      :class="rounded === 'full' ? 'rounded-full' : 'rounded-md'">
      <Avatar
        :src="currentImage || undefined"
        :fallback="fallback"
        :alt="alt"
        :size="size"
        :rounded="rounded"
        :class="className" />

      <FilePicker
        :disabled="!editable || disabled || loading"
        :return-format="'base64'"
        :file-types="['image/jpeg', 'image/png', 'image/webp', 'image/gif']"
        :max-size="maxSize"
        class="absolute inset-0"
        @change="(v: any) => handleFileChange(v)"
        @error="handleError">
        <template #trigger="{ trigger, isLoading }">
          <button
            type="button"
            class="absolute inset-0 cursor-pointer"
            :class="{ 'cursor-default': !editable || disabled }"
            @click="editable && !disabled ? trigger() : null">
            <div
              v-if="loading || isLoading"
              class="absolute inset-0 flex items-center justify-center bg-[#00000051] text-white"
              :class="rounded === 'full' ? 'rounded-full' : 'rounded-md'">
              <Icon icon="lucide:loader-2" class="animate-spin w-1/3 h-1/3" />
            </div>

            <div
              v-else-if="editable && !disabled"
              class="absolute inset-0 flex items-center justify-center bg-[#00000051] text-white opacity-0 group-hover:opacity-100 transition-opacity"
              :class="rounded === 'full' ? 'rounded-full' : 'rounded-md'">
              <Icon icon="lucide:camera" class="w-1/3 h-1/3" />
            </div>
          </button>
        </template>
      </FilePicker>

      <button
        v-if="currentImage && editable && !disabled && !loading"
        type="button"
        class="absolute -top-1 -right-1 z-10 p-1 bg-background border border-border rounded-full text-muted-foreground shadow-sm hover:text-destructive hover:border-destructive transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
        @click.stop="handleRemove"
        title="Remove image">
        <Icon icon="lucide:x" class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>
