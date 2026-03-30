# Category Manager

**Import:** `import { CategoryManager, type CategoryItem } from 'vlite3'`

### Description

A production-ready, fully interactive tree manager for Vue 3. It allows users to create, edit, delete, and reorder hierarchical category structures with unlimited depth. It supports two distinct editing modes: **inline creation** (click-to-type, keyboard-confirmable) for speed, and a **modal form** for richer structured input via a fully customizable schema.

Built-in features include drag-and-drop reordering at every tree level, accordion expand/collapse, icon pickers, and a clean empty state.

---

### Props

| Prop               | Type            | Default                                    | Description                                                                             |
| :----------------- | :-------------- | :----------------------------------------- | :-------------------------------------------------------------------------------------- |
| `modelValue`       | `CategoryItem[]`| `[]`                                       | The nested category tree. Bind with `v-model`.                                          |
| `formSchema`       | `IForm[]?`      | Default schema (icon, title, description)  | Custom Form schema used in the Add/Edit modal. Overrides the default 3-field form.      |
| `readonly`         | `boolean`       | `false`                                    | Disables all mutations (add, edit, delete, drag). Renders the tree as a read-only view. |
| `size`             | `'sm' \| 'md' \| 'lg'` | `'md'`                            | Size modifier applied to each tree node row.                                            |
| `emptyTitle`       | `string`        | `'No Categories Found'`                    | Heading shown in the empty state.                                                       |
| `emptyDescription` | `string`        | `'Get started by creating your first category.'` | Body text shown in the empty state.                                               |

---

### Emits

| Event            | Payload          | Description                                                              |
| :--------------- | :--------------- | :----------------------------------------------------------------------- |
| `update:modelValue` | `CategoryItem[]` | Emitted on every mutation (add, edit, delete, reorder). Use with `v-model`. |
| `@onAdd`         | `CategoryItem`   | Emitted when a new category or sub-category is created.                  |
| `@onEdit`        | `CategoryItem`   | Emitted when an existing category is edited.                             |
| `@onDelete`      | `CategoryItem`   | Emitted when a category is deleted (the deleted item is passed).         |
| `@onReorder`     | `CategoryItem[]` | Emitted when the tree is reordered by drag-and-drop.                     |

---

### Data Model

#### `CategoryItem` Shape

| Field         | Type                  | Description                                                            |
| :------------ | :-------------------- | :--------------------------------------------------------------------- |
| `id`          | `string \| number`    | **Required.** Unique identifier. Auto-generated for inline creates.    |
| `title`       | `string`              | **Required.** Display name of the category.                            |
| `icon`        | `string?`             | Icon key (e.g., `'lucide:folder'`). Rendered as a visual prefix.       |
| `description` | `string?`             | Optional descriptor shown in the advanced modal form.                  |
| `children`    | `CategoryItem[]?`     | Nested sub-categories. The component auto-normalizes `undefined` to `[]`. |
| `[key]`       | `any`                 | Any additional fields are preserved on your data and passed through emits. |

---

### Slots

| Slot Name | Description |
| :--- | :--- |
| `header` | Replaces the entire header area (title + "Add Category" button). |

---

### Implementation Examples

#### 1. Basic Tree with v-model

```vue
<script setup>
import { ref } from 'vue'
import { CategoryManager, type CategoryItem } from 'vlite3'

const categories = ref<CategoryItem[]>([
  {
    id: 'cat-1',
    title: 'Electronics',
    icon: 'lucide:cpu',
    children: [
      { id: 'cat-1-1', title: 'Laptops', icon: 'lucide:laptop', children: [] },
    ],
  },
])
</script>

<template>
  <CategoryManager v-model="categories" />
</template>
```

#### 2. Full Event Handling

```vue
<template>
  <CategoryManager
    v-model="categories"
    @onAdd="(item) => console.log('Added:', item)"
    @onEdit="(item) => console.log('Edited:', item)"
    @onDelete="(item) => console.log('Deleted:', item)"
    @onReorder="(tree) => console.log('Reordered:', tree)"
  />
</template>
```

#### 3. Custom Form Schema for the Edit Modal

The modal that opens for "Add" and "Edit" actions is powered by the `<Form>` component. Pass any valid `IForm[]` schema to replace the default fields.

```vue
<script setup>
const customFormSchema = [
  { name: 'title', label: 'Name', type: 'text', required: true },
  { name: 'icon', label: 'Icon', type: 'iconPicker' },
  { name: 'color', label: 'Label Color', type: 'color', value: '#6366f1' },
  { name: 'isActive', label: 'Is Active', type: 'switch', value: true },
]
</script>

<template>
  <CategoryManager v-model="categories" :form-schema="customFormSchema" />
</template>
```

#### 4. Read-only Tree Display

```vue
<template>
  <CategoryManager :model-value="categories" readonly />
</template>
```

#### 5. Custom Header Slot

```vue
<template>
  <CategoryManager v-model="categories">
    <template #header>
      <h2 class="text-xl font-bold">Product Taxonomy</h2>
      <!-- You control the add button here -->
    </template>
  </CategoryManager>
</template>
```

---

### Data Contract for AI Agents (JSON Template)

```json
[
  {
    "id": "cat-1",
    "title": "Electronics",
    "icon": "lucide:cpu",
    "children": [
      {
        "id": "cat-1-1",
        "title": "Computers",
        "icon": "lucide:monitor",
        "children": [
          { "id": "cat-1-1-1", "title": "Laptops", "icon": "lucide:laptop", "children": [] },
          { "id": "cat-1-1-2", "title": "Desktops", "icon": "lucide:pc-case", "children": [] }
        ]
      },
      { "id": "cat-1-2", "title": "Smartphones", "icon": "lucide:smartphone", "children": [] }
    ]
  }
]
```

---

### Senior Engineer's Notes

1.  **Two edit modes**: Each node has a **quick-add inline** mode (click ➕, type, press Enter to confirm or Esc to cancel) and a **modal form** mode (click the settings icon ⚙️). The inline mode is fast for 90% of cases; the modal is for structured data.
2.  **Unlimited depth**: The tree is rendered recursively via an internal `CategoryNode` component. There is no hard depth limit, though deep nesting (~5+) should be carefully considered from a UX perspective.
3.  **`children` auto-normalization**: If your API returns nodes without a `children` key, the component silently initializes it to `[]` during the deep clone on `watch`. This prevents undefined references in the recursive renderer and reorder logic.
4.  **Extra data fields are safe**: The `CategoryItem` interface uses `[key: string]: any` — your backend-specific fields (`slug`, `meta`, etc.) pass through undisturbed on all emit payloads.
5.  **Drag-and-drop reordering is cross-level**: Items can be reordered within their parent group. When reordering fires, the entire updated tree is emitted via both `update:modelValue` and `@onReorder`, making it easy to debounce and sync to your API.
6.  **Self-contained state**: The component deep-clones your `modelValue` internally on initialization. All edits operate on this internal clone and emit the final state up. This prevents accidental mutation of your parent state.
