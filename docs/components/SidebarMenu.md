# SidebarMenu

**Import:** `import { SidebarMenu } from 'vlite3'`
**Types:** `import type { SidebarMenuItemSchema } from 'vlite3'`

### Props

| Prop                | Type                      | Default                                        | Description                       |
| :------------------ | :------------------------ | :--------------------------------------------- | :-------------------------------- |
| `items`             | `SidebarMenuItemSchema[]` | `[]`                                           | Menu structure                    |
| `allowMultiple`     | `boolean`                 | `true`                                         | Allow multiple submenus open      |
| `defaultExpanded`   | `string[]`                | `[]`                                           | IDs of default expanded menus     |
| `indentSize`        | `number`                  | `12`                                           | Indentation pixels per level      |
| `variant`           | `'default' \| 'ghost'`    | `default`                                      | Visual theme                      |
| `compact`           | `boolean`                 | `false`                                        | Collapsed mode (icons only)       |
| `renderMode`        | `'tree' \| 'popover'`     | `tree`                                         | Submenu rendering style           |
| `showCompactLabels` | `boolean`                 | `false`                                        | Show small labels in compact mode |
| `iconSize`          | `number`                  | `16`                                           | Icon size in pixels               |
| `compactIconSize`   | `number`                  | `20`                                           | Icon size when in compact mode    |
| `labelSize`         | `string`                  | `text-sm`                                      | Base tailwind class for labels    |
| `compactLabelSize`  | `string`                  | `text-[10px]`                                  | Tailwind class for compact labels |
| `activeClass`       | `string`                  | `bg-primary-light text-primary-fg-light`       | Classes for the active item       |
| `inactiveClass`     | `string`                  | `text-muted hover:bg-accent/80 hover:text-foreground`| Classes for the inactive item     |

### Type Definition

```ts
interface SidebarMenuItemSchema {
  id?: string
  label: string
  labelI18n?: string
  icon?: string
  to?: string | any // Vue Router path or object
  href?: string // External link
  children?: SidebarMenuItemSchema[]
  badge?: string | number
  badgeClass?: string
  disabled?: boolean
  renderMode?: 'tree' | 'popover' // Override per item
  action?: (item: SidebarMenuItemSchema) => void
  class?: string // Override container class per item
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
  <SidebarMenu
    :items="items"
    :icon-size="18"
    :compact-icon-size="24"
    active-class="bg-blue-500 text-white shadow-md"
  />
</template>

```

