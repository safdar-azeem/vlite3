# Comment Thread

An interactive, deeply nested discussion interface perfectly suited for Github PRs, Jira tickets, documentation platforms, or complex collaborative SaaS environments.

## Architecture

Unlike the traditional `Chat` feature (which handles real-time, flat sequential messages), the `CommentThread` specializes in deep contextual nesting (trees of replies). It natively understands the nested payload and recursively builds its own DOM structures visually linking discussions with vertical line indenting.

It includes out-of-the-box integration with:
- Nested Replies
- Inline Attachment Previews
- Double-confirm "Delete" logic (Click to prep, click again to confirm).

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CommentThread, type CommentNode } from 'vlite3'

const myThreads = ref<CommentNode[]>([
  {
    id: 1,
    text: "Parent Comment",
    author: { id: 'u1', name: 'John Doe' },
    replies: [
      {
        id: 2,
        text: "Nested child Reply",
        author: { id: 'u2', name: 'Jane Doe' },
        replies: []
      }
    ]
  }
])
</script>

<template>
  <CommentThread 
    :comments="myThreads" 
    @reply="handleReply" 
    @delete="handleDelete" 
    @edit="handleEdit" 
  />
</template>
```

## Props (`CommentThread.vue`)

| Prop         | Type               | Default | Description                                              |
|:-------------|:-------------------|:--------|:---------------------------------------------------------|
| `comments`   | `CommentNode[]`    | `[]`    | A recursive tree payload mapping the threaded discussion. |
| `threaded`   | `boolean`          | `true`  | Visually draws the vertical joining line between deep replies. |
| `allowDelete`| `boolean`          | `true`  | Show the Trash action icon.                             |
| `allowEdit`  | `boolean`          | `true`  | Show the Pencil action icon.                            |
| `allowReply` | `boolean`          | `true`  | Show the Reply action icon.                             |
| `confirmDelete` | `boolean`       | `true`  | Requires the user to double click the trash can to prevent accidental drops! |

## Payload (`CommentNode` interface)

Your payload objects should strictly match this shape:

```ts
export interface CommentNode {
  id: string | number
  text: string
  author: {
    id: string | number
    name: string
    avatar?: string
    role?: string
  }
  timestamp?: string | number | Date
  isEdited?: boolean
  attachments?: AttachmentItem[]
  replies?: CommentNode[]
}
```

## Slots

The `CommentThread` handles layout heavily but relies entirely on you to supply the actual `<textarea>` elements you want to use via its powerful slots!

### `#root-input`
Displays content permanently right at the top of the comment thread. Use this for the primary "Start a new conversation" textarea.

### `#inline-reply`
A scoped slot that automatically injects exactly beneath whichever child comment a user currently hits "Reply" on. It receives two powerful arguments:
- `comment` The literal node the user is replying to.
- `close` A function you must call after the user clicks "Submit" to tell the library to re-hide the slot.

```vue
<CommentThread :comments="data">
  <!-- Inline replying logic -->
  <template #inline-reply="{ comment, close }">
    <textarea v-model="draft" />
    <button @click="submit(comment.id); close()">Submit</button>
  </template>
</CommentThread>
```

## Events

| Event    | Payload | Description |
|:---------|:--------|:------------|
| `delete` | `id`    | Fired when the trash button is double-clicked. |
| `edit`   | `{ commentId, comment }` | Fired when pencil is clicked. |
| `reply`  | `{ commentId, comment }` | Fired when reply is clicked. You don't necessarily have to act on this if you're using the `#inline-reply` slots. |
