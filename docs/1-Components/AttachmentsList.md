# AttachmentsList

**Import:** `import { AttachmentsList } from 'vlite3'`

Displays a styled list of file attachments, providing built-in secure programmatic downloading (via Fetch API & Blobs to prevent new tab opening) and inline file preview capabilities via the `FilePreview` component.

Every meaningful DOM element carries a stable BEM CSS class (`vl-attachments-list__*`) so you can target and override any part of the UI via plain CSS. Customization props (`gridClass`, `itemClass`, etc.) let you inject Tailwind or custom classes directly without touching source.

---

## Props

| Prop                  | Type                                 | Default     | Description                                                                                  |
| :-------------------- | :----------------------------------- | :---------- | :------------------------------------------------------------------------------------------- |
| `attachments`         | `AttachmentItem \| AttachmentItem[]` | `[]`        | The file or array of files to display.                                                       |
| `canView`             | `boolean`                            | `true`      | Toggles the visibility of the "Preview" (Eye) button.                                        |
| `canDownload`         | `boolean`                            | `true`      | Toggles the visibility of the "Download" programmatic action.                                |
| `variant`             | `'default' \| 'list' \| 'inline' \| 'card'` | `'default'` | Layout presentation mode.                                                           |
| `size`                | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Sizing preset (applies to `default`, `list`, `inline` variants).                             |
| `clickToPreview`      | `boolean`                            | `false`     | When `true`, clicking the row opens the preview modal. Eye icon is hidden.                   |
| `showDownloadInList`  | `boolean`                            | `true`      | When `false`, hides the download button from list rows. Download still works in the modal.   |
| `rootClass`           | `string`                             | `''`        | Extra classes for the root wrapper `div`.                                                    |
| `gridClass`           | `string`                             | `''`        | Extra classes for the card grid container (**card variant** only).                           |
| `cardClass`           | `string`                             | `''`        | Extra classes for each card item wrapper (**card variant** only).                            |
| `cardThumbnailClass`  | `string`                             | `''`        | Extra classes for the card thumbnail/preview area (**card variant** only).                   |
| `cardInfoClass`       | `string`                             | `''`        | Extra classes for the card footer info area (**card variant** only).                         |
| `cardActionsClass`    | `string`                             | `''`        | Extra classes for the card overlay actions container (**card variant** only).                |
| `listClass`           | `string`                             | `''`        | Extra classes for the list container (**default/list/inline** variants).                     |
| `itemClass`           | `string`                             | `''`        | Extra classes for each list item row (**default/list/inline** variants).                     |
| `itemIconBoxClass`    | `string`                             | `''`        | Extra classes for the icon/thumbnail box inside a list item.                                 |
| `itemNameClass`       | `string`                             | `''`        | Extra classes for the file name text element.                                                |
| `itemSizeClass`       | `string`                             | `''`        | Extra classes for the file size subtext element.                                             |
| `itemActionsClass`    | `string`                             | `''`        | Extra classes for the actions container inside a list item.                                  |
| `emptyClass`          | `string`                             | `''`        | Extra classes for the empty-state placeholder `div`.                                         |

---

## CSS Class Reference

Every major element has a stable BEM class you can target from external CSS:

| Element                              | BEM Class                                    |
| :----------------------------------- | :------------------------------------------- |
| Root wrapper                         | `vl-attachments-list`                        |
| Card grid container                  | `vl-attachments-list__grid`                  |
| Card item                            | `vl-attachments-list__card`                  |
| Card thumbnail area                  | `vl-attachments-list__card-thumbnail`        |
| Card info/footer area                | `vl-attachments-list__card-info`             |
| Card overlay actions                 | `vl-attachments-list__card-actions`          |
| List container                       | `vl-attachments-list__list`                  |
| List item row                        | `vl-attachments-list__item`                  |
| List item icon/thumbnail box         | `vl-attachments-list__item-icon-box`         |
| File name text                       | `vl-attachments-list__item-name`             |
| File size subtext                    | `vl-attachments-list__item-size`             |
| List item actions container          | `vl-attachments-list__item-actions`          |
| Empty state                          | `vl-attachments-list__empty`                 |

---

## Types
```ts
export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl: string
  thumbnailUrl?: string
  fileType?: string
  [key: string]: any
}
```

---

## Variants

### `default` / `list`

Standard vertical list with a bordered row per file. Supports `size` (`sm`, `md`, `lg`).
```vue
<AttachmentsList :attachments="files" variant="list" size="md" />
```

### `inline`

Transparent/muted row style designed to embed naturally inside chat bubbles or content areas.
```vue
<AttachmentsList :attachments="files" variant="inline" size="sm" />
```

### `card`

Grid of cards with a prominent thumbnail area and hover-reveal action buttons.
```vue
<AttachmentsList :attachments="files" variant="card" />
```

---

## Usage

### Basic
```vue
<script setup>
import { AttachmentsList } from 'vlite3'

const files = [
  {
    fileName: 'invoice-2023.pdf',
    fileSize: 1048576,
    fileUrl: 'https://example.com/invoice.pdf',
  },
]
</script>

<template>
  <AttachmentsList :attachments="files" />
</template>
```

### Disable actions
```vue
<AttachmentsList :attachments="files" :can-download="false" :can-view="false" />
```

### Click-to-preview (eye icon hidden, row is clickable)
```vue
<AttachmentsList
  :attachments="files"
  variant="list"
  :click-to-preview="true"
  :show-download-in-list="false" />
```

### Card variant with custom grid columns

Override the default 4-column grid to 2 columns and tighten the gap:
```vue
<AttachmentsList
  :attachments="files"
  variant="card"
  grid-class="grid-cols-2 gap-2"
  card-class="rounded-none border-2"
  card-thumbnail-class="h-32" />
```

### List variant with custom item styles
```vue
<AttachmentsList
  :attachments="files"
  variant="list"
  item-class="!border-primary/30 !bg-primary/5"
  item-icon-box-class="!rounded-full"
  item-name-class="!text-primary"
  item-size-class="!text-primary/50" />
```

### Override styles via CSS
```css
/* Taller card thumbnails globally */
.vl-attachments-list__card-thumbnail {
  height: 12rem;
}

/* Custom list item background */
.vl-attachments-list__item {
  background-color: hsl(var(--primary) / 0.05);
  border-color: hsl(var(--primary) / 0.2);
}

/* Pill-shaped icon box */
.vl-attachments-list__item-icon-box {
  border-radius: 9999px;
}
```

---

## All Props Example
```vue
<AttachmentsList
  :attachments="files"
  variant="card"
  size="md"
  :can-view="true"
  :can-download="true"
  :click-to-preview="false"
  :show-download-in-list="true"
  root-class="p-4 border rounded-xl"
  grid-class="grid-cols-3 gap-3"
  card-class="shadow-lg"
  card-thumbnail-class="h-48"
  card-info-class="bg-muted/20"
  card-actions-class="gap-2"
  list-class="gap-2"
  item-class="!rounded-xl"
  item-icon-box-class="!rounded-full"
  item-name-class="font-bold"
  item-size-class="italic"
  item-actions-class="gap-2"
  empty-class="!border-solid !border-primary/30" />
```
