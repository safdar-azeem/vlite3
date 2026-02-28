# SidebarMenu

**Import:** `import { SidebarMenu } from 'vlite3'`
**Types:** `import type { SidebarMenuItemSchema } from 'vlite3'`

### Props

| Prop                | Type                      | Default   | Description                       |
| :------------------ | :------------------------ | :-------- | :-------------------------------- |
| `items`             | `SidebarMenuItemSchema[]` | `[]`      | Menu structure                    |
| `allowMultiple`     | `boolean`                 | `true`    | Allow multiple submenus open      |
| `defaultExpanded`   | `string[]`                | `[]`      | IDs of default expanded menus     |
| `indentSize`        | `number`                  | `12`      | Indentation pixels per level      |
| `variant`           | `'default' \| 'ghost'`    | `default` | Visual theme                      |
| `compact`           | `boolean`                 | `false`   | Collapsed mode (icons only)       |
| `renderMode`        | `'tree' \| 'popover'`     | `tree`    | Submenu rendering style           |
| `showCompactLabels` | `boolean`                 | `false`   | Show small labels in compact mode |

### Type Definition

```ts
interface SidebarMenuItemSchema {
  id?: string
  label: string
  icon?: string
  to?: string // Vue Router path
  href?: string // External link
  children?: SidebarMenuItemSchema[]
  badge?: string | number
  badgeClass?: string
  disabled?: boolean
  renderMode?: 'tree' | 'popover' // Override per item
  action?: (item: SidebarMenuItemSchema) => void
}
```

### Usage

```vue
<script setup>
const items = [
  {
    label: 'Dashboard',
    icon: 'lucide:home',
    to: '/dashboard',
  },
  {
    label: 'Projects',
    icon: 'lucide:folder',
    children: [
      { label: 'Active', to: '/projects/active' },
      { label: 'Archived', to: '/projects/archived' },
    ],
  },
]
</script>

<template>
  <SidebarMenu :items="items" />
</template>
```
