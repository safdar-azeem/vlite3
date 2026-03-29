<script setup lang="ts">
import { ref } from 'vue'
import { ThumbnailSelector } from '@/components/ThumbnailSelector'
import { Form } from '@/components/Form'
import type { IForm, IFormSubmitPayload } from '@/components/Form'

// ── Standalone demo ───────────────────────────────────────────────────────────
const standaloneImages = ref<string[]>([
  'https://picsum.photos/seed/p1/400/300',
  'https://picsum.photos/seed/p2/400/300',
  'https://picsum.photos/seed/p3/400/300',
])
const standaloneThumbnail = ref<string | null>(standaloneImages.value[0])

// ── Form integration demo ─────────────────────────────────────────────────────
/**
 * The thumbnailSelector field stores its value as:
 *   { images: string[], thumbnail: string | null }
 *
 * On submit, useForm's processFileUploads will detect base64 data URIs in
 * images[] and upload them via the global upload service before the onSubmit
 * payload is emitted — identical behaviour to avatarUpload and fileUploader.
 *
 * The thumbnail reference is also updated to the resolved URL automatically.
 */
const productSchema: IForm[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Product Title',
    placeholder: 'Enter product title',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter product description',
    props: { rows: 3 },
  },
  {
    name: 'price',
    type: 'number',
    label: 'Price',
    placeholder: '0.00',
  },
  {
    name: 'category',
    type: 'select',
    label: 'Category',
    placeholder: 'Select category',
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Books', value: 'books' },
    ],
  },
]

const handleSubmit = (payload: IFormSubmitPayload) => {
  /**
   * payload.values.media = {
   *   images: ['https://cdn.../img1.jpg', 'https://cdn.../img2.jpg'],
   *   thumbnail: 'https://cdn.../img1.jpg'
   * }
   * Base64 strings are resolved to URLs by processFileUploads before this fires.
   */
  console.log('[ThumbnailSelectorDemo] submit payload:', payload)
}
</script>

<template>
  <div class="space-y-10 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold mb-1">ThumbnailSelector</h2>
      <p class="text-muted-foreground text-sm mb-6">
        Upload images, pick a thumbnail, and integrate seamlessly with forms and the global upload service.
      </p>
    </div>

    <!-- ── Standalone ────────────────────────────────────────────────────── -->
    <section class="space-y-3">
      <h3 class="text-base font-semibold">Standalone</h3>
      <div class="border rounded-xl p-5 bg-card max-w-sm">
        <ThumbnailSelector
          v-model:images="standaloneImages"
          v-model:thumbnail="standaloneThumbnail"
          label="Product Images" />
      </div>
      <p class="text-xs text-muted-foreground font-mono break-all">
        thumbnail: {{ standaloneThumbnail }}
      </p>
    </section>

    <!-- ── Inside Form — right-panel layout ─────────────────────────────── -->
    <section class="space-y-3">
      <h3 class="text-base font-semibold">Inside a Form (right-panel layout)</h3>
      <p class="text-sm text-muted-foreground">
        On large screens the thumbnail picker is fixed to the right (min-w 350px).
        On small screens it stacks above the form fields.
        Uploaded images are processed by the global upload service on submit.
      </p>

      <div class="border rounded-xl p-5 bg-card">
        <!--
          Layout:
          - Small screens  : thumbnail panel on TOP, form fields below
          - Large screens  : form fields (flex-1) on LEFT, thumbnail panel (min-w-[350px]) on RIGHT
        -->
        <div class="flex flex-col lg:flex-row gap-6">

          <!-- Thumbnail panel — top on mobile, right on desktop -->
          <div class="w-full order-first lg:order-last lg:min-w-[350px] lg:max-w-[380px] shrink-0">
            <!--
              'media' is the schema field name of type 'thumbnailSelector'.
              We use the Form's default slot to wire it up outside the FormFields grid
              so it renders in the side panel rather than inline with text inputs.
              The field is declared in productSchema below with type: 'thumbnailSelector'
              so useForm tracks its value and processFileUploads handles the upload.
            -->
            <ThumbnailSelector
              label="Product Images"
              :images="[]"
              :thumbnail="null"
              @change="(payload) => console.log('thumbnail change', payload)" />
          </div>

          <!-- Form fields — bottom on mobile, left on desktop -->
          <div class="flex-1 min-w-0 order-last lg:order-first">
            <Form
              :schema="productSchema"
              submit-text="Save Product"
              @onSubmit="handleSubmit" />
          </div>

        </div>
      </div>
    </section>

    <!-- ── Fully integrated: thumbnailSelector inside Form schema ────────── -->
    <section class="space-y-3">
      <h3 class="text-base font-semibold">Fully Schema-Driven (thumbnailSelector in schema)</h3>
      <p class="text-sm text-muted-foreground">
        The <code class="text-xs bg-muted px-1 py-0.5 rounded">thumbnailSelector</code> field
        type can also be declared directly in the schema. The form renders it inline
        (useful when you don't need the side-panel layout).
        Upload processing is handled automatically by <code class="text-xs bg-muted px-1 py-0.5 rounded">useForm</code>.
      </p>

      <div class="border rounded-xl p-5 bg-card max-w-2xl">
        <Form
          :schema="[
            ...productSchema,
            {
              name: 'media',
              type: 'thumbnailSelector',
              label: 'Product Images',
              itemClass: 'col-span-full',
            },
          ]"
          submit-text="Save Product"
          @onSubmit="handleSubmit" />
      </div>
    </section>
  </div>
</template>
