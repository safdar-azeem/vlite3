<script setup lang="ts">
/**
 * ThumbnailSelector
 *
 * Standalone + form-integrated image picker that lets users:
 *  - Upload multiple images (via the global VLite upload service, same as AvatarUploader / FilePicker)
 *  - Pick one image as the "thumbnail"
 *  - Remove individual images
 *
 * Emits:
 *  - update:images   → string[]        (all image URLs)
 *  - update:thumbnail → string | null  (selected thumbnail URL)
 *  - change          → { images, thumbnail }
 *
 * When used inside <Form />, FormField wires these through `useForm` and the
 * upload service processes File/base64 values before submission — identical to
 * how `avatarUpload` and `fileUploader` work.
 */
import { ref, computed, watch } from 'vue'
import Icon from '@/components/Icon.vue'
import FilePicker from '@/components/FilePicker/FilePicker.vue'
import type { FilePickerValue } from '@/components/FilePicker/FilePicker.vue'

defineOptions({
  name: 'ThumbnailSelector',
})

export interface ThumbnailSelectorProps {
  /** Array of image URLs (resolved) or FilePickerValue objects (pending upload) */
  images?: string[]
  /** Currently selected thumbnail URL */
  thumbnail?: string | null
  /** Whether the component is disabled */
  disabled?: boolean
  /** Whether the component is loading (e.g. upload in progress) */
  loading?: boolean
  /** Max file size in MB forwarded to FilePicker */
  maxSize?: number
  /** Optional label rendered above the component */
  label?: string
}

const props = withDefaults(defineProps<ThumbnailSelectorProps>(), {
  images: () => [],
  thumbnail: null,
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:images', value: string[]): void
  (e: 'update:thumbnail', value: string | null): void
  (e: 'change', payload: { images: string[]; thumbnail: string | null }): void
}>()

// ─── Internal mirrors (props are source-of-truth; we mirror for local reactivity) ──
const internalImages = ref<string[]>([...(props.images || [])])
const internalThumbnail = ref<string | null>(props.thumbnail ?? null)

watch(
  () => props.images,
  (val) => {
    internalImages.value = [...(val || [])]
  },
)
watch(
  () => props.thumbnail,
  (val) => {
    internalThumbnail.value = val ?? null
  },
)

/** URL shown in the large preview area */
const previewUrl = computed(
  () => internalThumbnail.value || internalImages.value[0] || null,
)

// ─── Actions ──────────────────────────────────────────────────────────────────

const selectThumbnail = (url: string) => {
  if (props.disabled) return
  internalThumbnail.value = url
  emit('update:thumbnail', url)
  emit('change', { images: internalImages.value, thumbnail: url })
}

const removeImage = (url: string, event: MouseEvent) => {
  event.stopPropagation()
  if (props.disabled) return

  const newImages = internalImages.value.filter((img) => img !== url)
  internalImages.value = newImages

  // Reset thumbnail if the removed image was selected
  let newThumbnail = internalThumbnail.value
  if (internalThumbnail.value === url) {
    newThumbnail = newImages[0] ?? null
    internalThumbnail.value = newThumbnail
    emit('update:thumbnail', newThumbnail)
  }

  emit('update:images', newImages)
  emit('change', { images: newImages, thumbnail: newThumbnail })
}

/**
 * Called when FilePicker returns selected file(s).
 * We store base64 data URIs as image values so the form's upload service
 * can detect them as "pending" and process them on submit — identical to
 * how AvatarUploader works. Each string that starts with "data:" will be
 * recognised by collectFileFields and uploaded via the global upload service.
 */
const handleUpload = (fileVal: FilePickerValue | FilePickerValue[] | null) => {
  if (!fileVal) return

  const files = Array.isArray(fileVal) ? fileVal : [fileVal]
  const newUrls: string[] = []

  for (const f of files) {
    if (f.base64) {
      // base64 data URI — upload service will pick this up
      newUrls.push(f.base64)
    } else if (f.file) {
      try {
        // Blob URL for immediate preview only; not persisted on submit
        newUrls.push(URL.createObjectURL(f.file))
      } catch (_) {}
    }
  }

  if (newUrls.length === 0) return

  const newImages = [...internalImages.value, ...newUrls]
  internalImages.value = newImages

  // Auto-select first newly uploaded image as thumbnail when nothing is set
  if (!internalThumbnail.value) {
    internalThumbnail.value = newUrls[0]
    emit('update:thumbnail', newUrls[0])
  }

  emit('update:images', newImages)
  emit('change', { images: newImages, thumbnail: internalThumbnail.value })
}
</script>

<template>
  <div class="vl-thumbnail-selector flex flex-col gap-3">
    <!-- Optional label -->
    <p v-if="label" class="text-sm font-medium text-foreground">{{ label }}</p>

    <!-- ── Large preview ─────────────────────────────────────────────────── -->
    <div
      class="vl-thumbnail-selector__preview w-full rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center"
      style="aspect-ratio: 16/9; min-height: 150px;">
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="w-full h-full object-cover"
        alt="Thumbnail preview" />
      <div
        v-else
        class="flex flex-col items-center gap-2 text-muted-foreground/40 select-none">
        <Icon icon="lucide:image" class="w-10 h-10" />
        <span class="text-xs">No image selected</span>
      </div>
    </div>

    <!-- ── Image grid + upload trigger ───────────────────────────────────── -->
    <!--
      PERFORMANCE: contain: layout style isolates repaints to this subtree
      when cards are hovered / selected, preventing full-page recomposition.
    -->
    <div
      class="vl-thumbnail-selector__grid flex flex-wrap gap-2"
      style="will-change: transform; contain: layout style;">

      <!-- Uploaded image cards -->
      <div
        v-for="(url, index) in internalImages"
        :key="url + index"
        class="vl-thumbnail-selector__card group relative rounded-md overflow-hidden cursor-pointer shrink-0 border-2 transition-all duration-150"
        style="width: 72px; height: 72px;"
        :class="[
          internalThumbnail === url
            ? 'border-primary shadow-sm shadow-primary/20'
            : 'border-border hover:border-primary/40',
          disabled ? 'pointer-events-none opacity-60' : '',
        ]"
        @click="selectThumbnail(url)">

        <!-- Image preview -->
        <img
          :src="url"
          class="w-full h-full object-cover"
          :alt="`Image ${index + 1}`" />

        <!--
          Delete button — rendered in the DOM always but visible ONLY when the
          PARENT card (.group) is hovered via group-hover. This keeps the icon
          strictly tied to its own card and not to any sibling.
        -->
        <button
          v-if="!disabled"
          type="button"
          class="vl-thumbnail-selector__delete absolute top-0.5 right-0.5 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-background/90 border border-border text-muted-foreground shadow-sm
                 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-destructive hover:border-destructive"
          title="Remove image"
          @click.stop="removeImage(url, $event)">
          <Icon icon="lucide:x" class="w-3 h-3" />
        </button>

        <!-- Selected / thumbnail indicator badge -->
        <div
          v-if="internalThumbnail === url"
          class="absolute bottom-0.5 left-0.5 z-10 w-4 h-4 flex items-center justify-center rounded-full bg-primary pointer-events-none">
          <Icon icon="lucide:check" class="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      </div>

      <!-- Upload trigger card -->
      <FilePicker
        v-if="!disabled"
        :disabled="disabled || loading"
        return-format="base64"
        :file-types="['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']"
        :max-size="maxSize ? maxSize * 1024 * 1024 : undefined"
        :multi-select="true"
        class="shrink-0"
        @change="handleUpload">
        <template #trigger="{ trigger, isLoading }">
          <button
            type="button"
            class="vl-thumbnail-selector__upload flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground/60 hover:border-primary/50 hover:text-primary/60 transition-all cursor-pointer shrink-0"
            style="width: 72px; height: 72px;"
            :class="isLoading || loading ? 'opacity-60 pointer-events-none' : ''"
            @click="trigger">
            <Icon
              v-if="isLoading || loading"
              icon="lucide:loader-2"
              class="w-5 h-5 animate-spin" />
            <Icon
              v-else
              icon="lucide:plus"
              class="w-5 h-5" />
            <span class="text-[10px] mt-0.5 leading-tight">Upload</span>
          </button>
        </template>
      </FilePicker>
    </div>
  </div>
</template>
