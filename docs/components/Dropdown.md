# Dropdown

**Import:** `import { Dropdown } from 'vlite3'`

### Props

| Prop                 | Type                | Default      | Description                             |
| :------------------- | :------------------ | :----------- | :-------------------------------------- |
| `modelValue`         | `any`               | —            | Binding (`v-model`)                     |
| `selected`           | `any`               | —            | Selected value (alternative to v-model) |
| `options`            | `IDropdownOptions`  | `[]`         | Array of options                        |
| `placeholder`        | `string`            | —            | Placeholder text                        |
| `disabled`           | `boolean`           | `false`      | Disable dropdown                        |
| `loading`            | `boolean`           | `false`      | Show loading state                      |
| `searchable`         | `boolean`           | `true`       | Enable search input                     |
| `closeOnSelect`      | `boolean`           | `true`       | Close dropdown after selection          |
| `position`           | `TooltTipPlacement` | `bottom-end` | Dropdown position                       |
| `width`              | `string`            | —            | Custom width                            |
| `maxHeight`          | `string`            | `300px`      | Max height of menu                      |
| `teleport`           | `boolean`           | `true`       | Teleport menu to body                   |
| `doubleConfirmation` | `boolean`           | `false`      | Require confirmation for selection      |
| `remote`             | `boolean`           | `false`      | Enable remote data loading              |
| `hasMore`            | `boolean`           | `false`      | Show "Load More" indicator              |

### Types

```ts
export type IDropdownOption = {
  label: string
  value?: any
  subtitle?: string
  description?: string
  icon?: string
  emoji?: string
  disabled?: Boolean
  children?: IDropdownOption[] // Nested Recursive menus
  confirmation?: boolean | { title?: string; description?: string; ... }
}

export type IDropdownOptions = IDropdownOption[]
```

### Events

- `@onSelect`: Emitted when an option is selected
- `@update:modelValue`: Emitted to update v-model
- `@onOpen`: Emitted when dropdown opens
- `@onClose`: Emitted when dropdown closes
- `@search`: Emitted when search query changes
- `@load-more`: Emitted when scrolling to bottom (if `hasMore` is true)

### Slots

| Slot      | Description               | Props                         |
| :-------- | :------------------------ | :---------------------------- |
| `trigger` | Custom trigger element    | `{ isOpen, selectedLabel }`   |
| `item`    | Custom option rendering   | `{ option, index, selected }` |
| `header`  | Content at top of menu    | —                             |
| `footer`  | Content at bottom of menu | —                             |
| `menu`    | Full menu replacement     | —                             |

### Usage

````vue
<Dropdown v-model="selectedUser" :options="users" searchable placeholder="Select a user">
  <template #trigger="{ selectedLabel }">
    <Button variant="outline">
      {{ selectedLabel || 'Select User' }}
    </Button>
  </template>
</Dropdown>

<!-- With Custom Styling (Optional Item Slot) -->
<Dropdown v-model="selectedUser" :options="users">
  <template #trigger="{ selectedLabel }">
    <Button variant="outline">
      {{ selectedLabel || 'Select User' }}
    </Button>
  </template>
  
  <template #item="{ option }">
    <div class="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
      <Avatar :src="option.avatar" size="xs" />
      <div class="flex flex-col">
        <span class="font-medium">{{ option.label }}</span>
        <span class="text-xs text-muted-foreground">{{ option.email }}</span>
      </div>
    </div>
  </template>
</Dropdown>

<!-- With Default Trigger (Optional Trigger Slot) -->
<Dropdown v-model="selectedUser" :options="users" placeholder="Select User" />

<!-- Full SFC Example: Pagination & Infinite Scroll -->
#### Pagination & Infinite Scroll ```vue
<script setup>
import { ref } from 'vue'
import { Dropdown } from 'vlite3'

const items = ref([
  { label: 'Item 1', value: 1 },
  { label: 'Item 2', value: 2 },
  { label: 'Item 3', value: 3 },
])

const selectedItem = ref(null)
const isLoading = ref(false)
const hasMoreItems = ref(true)
let page = 1

const fetchNextPage = async () => {
  if (isLoading.value || !hasMoreItems.value) return

  isLoading.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newItems = [
    { label: `Item ${items.value.length + 1}`, value: items.value.length + 1 },
    { label: `Item ${items.value.length + 2}`, value: items.value.length + 2 },
  ]

  items.value.push(...newItems)
  page++

  // Stop after 5 pages for demo
  if (page >= 5) hasMoreItems.value = false

  isLoading.value = false
}
</script>

<template>
  <Dropdown
    v-model="selectedItem"
    :options="items"
    :loading="isLoading"
    :has-more="hasMoreItems"
    @load-more="fetchNextPage"
    placeholder="Scroll to load more" />
</template>
````
