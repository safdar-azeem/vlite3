# Thumbnail Selector

**Import:** `import { ThumbnailSelector } from 'vlite3'`

### Description

A full-featured image picker and thumbnail manager for Vue 3. It allows users to upload multiple images, drag-and-drop to reorder them, and designate one as the primary "thumbnail". Works perfectly as a **standalone component** with `v-model` or as a **Form field** via the `thumbnailSelector` field type — both modes integrate automatically with the global upload service to process files before form submission.

---

### Props

| Prop        | Type             | Default     | Description                                                                    |
| :---------- | :--------------- | :---------- | :----------------------------------------------------------------------------- |
| `images`    | `string[]`       | `[]`        | Array of currently loaded image URLs. Bind with `v-model:images`.              |
| `thumbnail` | `string \| null` | `null`      | The currently selected thumbnail URL. Bind with `v-model:thumbnail`.           |
| `label`     | `string?`        | `undefined` | An optional label rendered above the component.                                |
| `disabled`  | `boolean`        | `false`     | Disables all interactions: uploading, clicking, removing, and reordering.      |
| `loading`   | `boolean`        | `false`     | Shows a spinner on the upload button and disables interactions.                |
| `maxSize`   | `number?`        | `undefined` | Maximum file size in **MB** per image. Forwarded to the internal `FilePicker`. |

---

### Emits

| Event              | Payload                                           | Description                                                         |
| :----------------- | :------------------------------------------------ | :------------------------------------------------------------------ |
| `update:images`    | `string[]`                                        | Emitted when the images array changes (upload, remove, or reorder). |
| `update:thumbnail` | `string \| null`                                  | Emitted when the selected thumbnail changes.                        |
| `change`           | `{ images: string[], thumbnail: string \| null }` | Convenience event that consolidates both values in one payload.     |

---

### Implementation Examples

#### 1. Standalone with v-model

```vue
<script setup>
import { ref } from 'vue'
import { ThumbnailSelector } from 'vlite3'

const images = ref(['https://cdn.example.com/img1.jpg', 'https://cdn.example.com/img2.jpg'])
const thumbnail = ref(images.value[0])
</script>

<template>
  <ThumbnailSelector
    v-model:images="images"
    v-model:thumbnail="thumbnail"
    label="Product Images"
    :max-size="5" />
</template>
```

#### 2. Schema-driven inside Form (inline)

The simplest integration — declare a field with `type: 'thumbnailSelector'` in your Form schema. The component is rendered inline within the form's grid and upload processing is handled automatically.

```vue
<script setup>
import { Form } from 'vlite3'

const schema = [
  { name: 'title', type: 'text', label: 'Product Title', required: true },
  {
    name: 'media',
    type: 'thumbnailSelector',
    label: 'Product Images',
  },
]

const handleSubmit = ({ values }) => {
  /**
   * values.media = {
   *   images: ['https://cdn.example.com/img1.jpg'],
   *   thumbnail: 'https://cdn.example.com/img1.jpg'
   * }
   * base64 data URIs are resolved to URLs before this fires.
   */
  console.log(values)
}
</script>

<template>
  <Form :schema="schema" submit-text="Save" @onSubmit="handleSubmit" />
</template>
```

#### 3. Side-Panel Layout (Form + ThumbnailSelector)

For a product page layout where images sit in a sidebar alongside form fields.

```vue
<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Image panel — right on desktop, top on mobile -->
    <div class="w-full lg:min-w-[350px] lg:max-w-[380px] shrink-0">
      <ThumbnailSelector
        label="Product Images"
        v-model:images="images"
        v-model:thumbnail="thumbnail" />
    </div>

    <!-- Form fields — left on desktop -->
    <div class="flex-1 min-w-0">
      <Form :schema="productSchema" @onSubmit="handleSubmit" />
    </div>
  </div>
</template>
```

---

### Form Field Integration

When declared as a field in a `Form` schema with `type: 'thumbnailSelector'`, the value stored in `useForm` is a structured object:

```ts
{
  images: string[]      // all image URLs
  thumbnail: string | null  // the selected thumbnail URL
}
```

The global upload service automatically detects any `base64` data URIs in `images[]` and uploads them before `onSubmit` fires. The `thumbnail` reference is updated to the resolved CDN URL in the same pass — identical to how `avatarUpload` and `fileUploader` fields work.

---

### Accepted File Types

The component only accepts images. The following MIME types are supported:

| Format | MIME type       |
| :----- | :-------------- |
| JPEG   | `image/jpeg`    |
| PNG    | `image/png`     |
| WebP   | `image/webp`    |
| GIF    | `image/gif`     |
| SVG    | `image/svg+xml` |

---

### Senior Engineer's Notes

1. **Auto-thumbnail selection**: When a user uploads their first image and no thumbnail is set, the component auto-selects it. Subsequent uploads do not change the active selection.
2. **Drag-to-reorder**: All images in the grid can be reordered by dragging the grip handle that appears on hover. The `update:images` event fires with the new sorted array and the `thumbnail` selection is preserved.
3. **Disabled vs Loading**: Use `disabled` for read-only display (e.g., view mode). Use `loading` during an upload in progress — it shows a spinner on the upload button but still displays the image grid.
4. **Delete logic**: Deleting the currently selected thumbnail automatically promotes the first remaining image to thumbnail, or sets it to `null` if the gallery is empty.
5. **Hover isolation**: The delete and drag-handle buttons use scoped CSS selectors (not Tailwind's `group-hover`) to ensure hover effects are isolated to the individual card being pointed at. This avoids a known Tailwind `group` bug in flex containers.
