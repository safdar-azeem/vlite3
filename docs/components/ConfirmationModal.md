# ConfirmationModal

**Import:** `import { ConfirmationModal } from 'vlite3'`

### Props

| Prop          | Type      | Default  | Description                                           |
| :------------ | :-------- | :------- | :---------------------------------------------------- |
| `show`        | `boolean` | `false`  | Binding (`v-model:show`)                              |
| `title`       | `string`  | required | Modal title                                           |
| `description` | `string`  | required | Description text                                      |
| `loading`     | `boolean` | `false`  | Show loading spinner on confirm button                |
| `confirmText` | `string`  | `Delete` | Text for confirm button                               |
| `cancelText`  | `string`  | `Cancel` | Text for cancel button                                |
| `variant`     | `string`  | `danger` | Button variant (`primary`, `danger`, `warning`, etc.) |

### Events

- `@confirm`: Emitted when the confirm button is clicked
- `@cancel`: Emitted when cancel button or backdrop is clicked
- `@update:show`: Emitted to update v-model

### Slots

| Slot      | Description                        | Props |
| :-------- | :--------------------------------- | :---- |
| `trigger` | Element that opens the modal       | —     |
| `default` | Custom content override (optional) | —     |

### Usage

```vue
<ConfirmationModal
  v-model:show="showConfirm"
  title="Delete Account"
  description="Are you sure? This action cannot be undone."
  confirm-text="Yes, Delete"
  variant="danger"
  :loading="isDeleting"
  @confirm="deleteAccount"
  @cancel="showConfirm = false">
  <template #trigger>
    <Button variant="danger">Delete Account</Button>
  </template>
</ConfirmationModal>
```
