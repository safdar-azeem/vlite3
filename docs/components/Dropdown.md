
# Dropdown

**Import:** `import { Dropdown } from 'vlite3'`

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `any` | — | Selected value (alternative to v-model) |
| `modelValue` | `any` | — | Binding (`v-model`) |
| `className` | `string` | `''` | Custom class for dropdown menu |
| `emptyMessage` | `string` | `'No options found'` | Message when no options match |
| `position` | `TooltTipPlacement` | — | Dropdown placement direction |
| `closeOnSelect` | `boolean` | `true` | Close dropdown after selection |
| `toggleSelection` | `boolean` | `true` | Allow deselecting currently active option |
| `options` | `IDropdownOptions` | `[]` | Array of options |
| `canCloseOutside` | `boolean` | `true` | Close when clicking outside |
| `caret` | `boolean` | `false` | Show caret arrow indicator |
| `offset` | `[number, number]` | `[0, 8]` | X/Y offset for dropdown |
| `isOpen` | `boolean` | — | Manual control of open state |
| `teleport` | `boolean` | `true` | Teleport menu to body |
| `selectedIndex` | `number | null` | `null` | Index of highlighted item |
| `maxHeight` | `string` | `'300px'` | Max height of menu |
| `width` | `string` | — | Custom width |
| `ignoreClickOutside` | `string[]` | — | Array of element IDs to ignore |
| `menuId` | `string` | — | HTML ID for the menu container |
| `nestedPosition` | `TooltTipPlacement` | — | Position for nested children |
| `nestedOffset` | `[number, number]` | — | Offset for nested children |
| `showSelectedLabel` | `boolean` | `true` | Show the selected label in trigger |
| `selectable` | `boolean` | `true` | Enable item selection styles |
| `doubleConfirmation` | `boolean` | `false` | Require confirmation for selection |
| `layout` | `'default' | 'grouped'` | `'default'` | Layout mode for options |
| `columns` | `number | string` | `3` | Number of columns in grouped layout |
| `loading` | `boolean` | `false` | Show loading state |
| `hasMore` | `boolean` | `false` | Show "Load More" indicator |
| `searchable` | `boolean` | `true` | Enable search input |
| `remote` | `boolean` | `false` | Enable remote data loading |
| `triggerProps` | `ButtonProps` | — | Additional props for default trigger |
| `direction` | `'ltr' | 'rtl'` | `'ltr'` | Text/layout direction |

### Types

```ts
export type IDropdownOption = {
  label: string
  labelI18n?: string
  value?: any
  key?: string
  subtitle?: string
  subtitleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  emoji?: string
  disabled?: boolean
  children?: IDropdownOption[]
  confirmation?: boolean | { title?: string; description?: string; confirmText?: string; cancelText?: string; variant?: string }
  data?: any
  position?: any
  offset?: [number, number]
}

export type IDropdownOptions = IDropdownOption[]

```

### Events

* `@onSelect`: Emitted when an option is selected `(payload: { value: any; data?: any })`
* `@update:modelValue`: Emitted to update v-model
* `@onOpen`: Emitted when dropdown opens
* `@onClose`: Emitted when dropdown closes
* `@update:isOpen`: Emitted on state change
* `@load-more`: Emitted when scrolling to bottom (if `hasMore` is true)
* `@search`: Emitted when search query changes `(query: string)`

### Slots

| Slot | Description | Props |
| --- | --- | --- |
| `trigger` | Custom trigger element | `{ isOpen, selectedLabel }` |
| `item` | Custom option rendering | `{ option, index, selected }` |
| `header` | Content at top of menu | — |
| `footer` | Content at bottom of menu | — |
| `menu` | Full menu replacement | — |

### Usage

```vue
<Dropdown v-model="selectedUser" :options="users" searchable>
  <template #trigger="{ selectedLabel }">
    <Button variant="outline">
      {{ selectedLabel || 'Select User' }}
    </Button>
  </template>
</Dropdown>

<Dropdown v-model="selectedUser" :options="users">
  <template #trigger="{ selectedLabel }">
    <Button variant="outline">
      {{ selectedLabel || 'Select User' }}
    </Button>
  </template>
  
  <template #item="{ option }">
    <div class="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
      <Avatar :src="option.data?.avatar" size="xs" />
      <div class="flex flex-col">
        <span class="font-medium">{{ option.label }}</span>
        <span class="text-xs text-muted-foreground">{{ option.description }}</span>
      </div>
    </div>
  </template>
</Dropdown>

```

