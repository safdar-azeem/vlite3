# AttachmentsList

**Import:** `import { AttachmentsList } from 'vlite3'`

Displays a styled list of file attachments, providing built-in secure programmatic downloading (via Fetch API & Blobs to prevent new tab opening) and inline file preview capabilities via the `FilePreview` component.

### Props

| Prop          | Type                                 | Default | Description                                                   |
| :------------ | :----------------------------------- | :------ | :------------------------------------------------------------ |
| `attachments` | `AttachmentItem \| AttachmentItem[]` | `[]`    | The file or array of files to display.                        |
| `canView`     | `boolean`                            | `true`  | Toggles the visibility of the "Preview" (Eye) button.         |
| `canDownload` | `boolean`                            | `true`  | Toggles the visibility of the "Download" programmatic action. |

### Types

```ts
export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl: string
  [key: string]: any
}
```

### Usage

```vue
<script setup>
import { AttachmentsList } from 'vlite3'

const files = [
  {
    fileName: 'invoice-2023.pdf',
    fileSize: 1048576,
    fileUrl: '[https://example.com/invoice.pdf](https://example.com/invoice.pdf)',
  },
]
</script>

<template>
  <div class="p-4 space-y-4">
    <AttachmentsList :attachments="files" />

    <AttachmentsList :attachments="files" :can-download="false" />
  </div>
</template>
```
