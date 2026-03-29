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
  }
)
watch(
  () => props.thumbnail,
  (val) => {
    internalThumbnail.value = val ?? null
  }
)

/** URL shown in the large preview area */
const previewUrl = computed(() => internalThumbnail.value || internalImages.value[0] || null)

// ─── Actions ──────────────────────────────────────────────────────────────────

const selectThumbnail = (url: string) => {
  if (props.disabled || props.loading) return
  internalThumbnail.value = url
  emit('update:thumbnail', url)
  emit('change', { images: internalImages.value, thumbnail: url })
}

const removeImage = (url: string, event: MouseEvent) => {
  event.stopPropagation()
  if (props.disabled || props.loading) return

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

    <!-- ── Large preview — 1:1 square, height auto-sizes to width ────────── -->
    <div
      class="vl-thumbnail-selector__preview w-full rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center"
      style="aspect-ratio: 1/1">
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="w-full h-full object-cover"
        alt="Thumbnail preview" />
      <div v-else class="flex flex-col items-center gap-2 text-muted-foreground/40 select-none">
        <Icon icon="lucide:image" class="w-10 h-10" />
        <span class="text-xs">No image selected</span>
      </div>
    </div>

    <!-- ── Image grid + upload trigger ───────────────────────────────────── -->
    <!--
      LAYOUT: flex-wrap so cards tile into rows and never overflow the container.
      The upload button is always the last DOM child so it sits immediately after
      the last image card on whichever row it falls.

      PERFORMANCE: contain: layout style isolates repaints to this subtree
      when cards are hovered / selected, preventing full-page recomposition.
    -->
    <div
      class="vl-thumbnail-selector__grid grid grid-cols-3 sm:grid-cols-4 gap-2"
      style="will-change: transform; contain: layout style">
      <!-- Uploaded image cards.
           HOVER FIX: We intentionally do NOT use Tailwind's `group` /
           `group-hover` pattern here. `group` placed on the flex container
           causes ALL group-hover children to activate when anything inside
           the container is hovered. Instead, delete button visibility is
           controlled by a scoped CSS rule so hover is strictly isolated to
           the card being pointed at. -->
      <div
        v-for="(url, index) in internalImages"
        :key="url + index"
        class="vl-thumbnail-selector__card relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-150 w-full"
        style="aspect-ratio: 1/1"
        :class="[
          internalThumbnail === url
            ? 'border-primary shadow-sm shadow-primary/20'
            : 'border-border',
          disabled || loading ? 'pointer-events-none opacity-60' : '',
        ]"
        @click="selectThumbnail(url)">
        <!-- Image preview -->
        <img :src="url" class="w-full h-full object-cover" :alt="`Image ${index + 1}`" />

        <!--
          Delete button — visibility is driven purely by the scoped CSS rule
          `.vl-thumbnail-selector__card:hover .vl-thumbnail-selector__delete`
          below, so it only appears when THIS card is directly hovered.
          The `opacity-0` base class hides it by default; the scoped rule
          overrides it on card hover only.
        -->
        <button
          v-if="!disabled"
          type="button"
          class="vl-thumbnail-selector__delete absolute top-0.5 right-0.5 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-background/90 border border-border text-muted-foreground shadow-sm opacity-0 transition-opacity duration-150 hover:text-destructive hover:border-destructive"
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

      <!-- Upload trigger — `display: contents` on the FilePicker wrapper makes
           the component's root element "transparent" to the flex layout so the
           inner <button> participates directly as a flex item, sitting flush
           after the last image card on the same row and wrapping naturally
           with the rest of the grid when the row is full. -->
      <FilePicker
        v-if="!disabled"
        :disabled="disabled || loading"
        return-format="base64"
        :file-types="['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']"
        :max-size="maxSize ? maxSize * 1024 * 1024 : undefined"
        :multi-select="true"
        class="vl-thumbnail-selector__filepicker-inline"
        @change="handleUpload">
        <template #trigger="{ trigger, isLoading }">
          <button
            type="button"
            class="vl-thumbnail-selector__upload flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground/60 hover:border-primary/50 hover:text-primary/60 transition-all cursor-pointer w-full"
            style="aspect-ratio: 1/1"
            :class="isLoading || loading ? 'opacity-60 pointer-events-none' : ''"
            @click="trigger">
            <Icon v-if="isLoading || loading" icon="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <Icon v-else icon="lucide:plus" class="w-5 h-5" />
            <span class="text-[10px] mt-0.5 leading-tight">Upload</span>
          </button>
        </template>
      </FilePicker>
    </div>
  </div>
</template>

<style scoped>
/*
 * Makes the FilePicker component's root element layout-transparent.
 *
 * WHY display: contents:
 * FilePicker renders its own root DOM element (likely a <div>), which by
 * default is a block-level flex item in the grid. This pushes the upload
 * button to a new row regardless of available space. `display: contents`
 * causes the wrapper element to vanish from the layout tree — its children
 * (the <button>) step up and participate directly as flex items in the
 * parent grid, sitting flush after the last image card and wrapping
 * naturally with the rest when the row fills up.
 */
.vl-thumbnail-selector__filepicker-inline {
  display: contents;
}

/*
 * Scoped hover rule for the delete button.
 *
 * WHY scoped CSS instead of Tailwind group-hover:
 * Tailwind's `group` must be placed on an ancestor element. If that ancestor
 * is the flex container (the grid wrapper), hovering ANY part of the grid
 * activates group-hover on ALL children simultaneously — exactly the bug
 * reported. By using a plain CSS descendant + :hover selector scoped to each
 * individual card element, hover activation is strictly isolated to the card
 * the pointer is physically over.
 */
.vl-thumbnail-selector__card:hover .vl-thumbnail-selector__delete {
  opacity: 1;
}

/*
 * Non-selected cards get a subtle border highlight on direct card hover only,
 * keeping the interaction feedback tight and not bleeding to siblings.
 */
.vl-thumbnail-selector__card:not(.border-primary):hover {
  border-color: color-mix(in sRGB, var(--color-primary, currentColor) 40%, transparent);
}
</style>
