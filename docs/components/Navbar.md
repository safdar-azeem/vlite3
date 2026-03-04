# Navbar

**Import:** `import { Navbar, NavbarGroup, NavbarItem } from 'vlite3'`

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'header' \| 'sidebar'` | `'header'` | Layout mode |
| `position` | `'fixed' \| 'sticky' \| 'relative' \| 'absolute'` | `'sticky'` | CSS positioning |
| `centerPosition` | `'center' \| 'left' \| 'right'` | `'center'` | Alignment of center slot (Header only) |
| `glass` | `boolean` | `false` | Blur effect on scroll |
| `border` | `boolean` | `true` | Show border (bottom or right) |
| `floating` | `boolean` | `false` | Floating card style |
| `class` | `string` | `''` | Custom class for wrapper |
| `height` | `string` | `'h-16'` | Header height class |
| `width` | `string` | `'w-64'` | Sidebar width class |
| `compact` | `boolean` | `false` | Compact interaction mode |
| `logo` | `string` | — | Logo image source URL |
| `logoAlt` | `string` | — | Alt text for the logo |
| `mobileBreakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Breakpoint to switch to mobile menu |
| `logoClass` | `string` | `''` | Classes for logo container |
| `contentClass` | `string` | `''` | Classes for main content area |
| `menuClass` | `string` | `''` | Classes for the menu container |
| `rightClass` | `string` | `''` | Classes for right actions area |
| `mobileTriggerClass` | `string` | `''` | Classes for hamburger button |
| `mobileMenuVariant` | `'sidepanel' \| 'dropdown'` | `'sidepanel'` | Mobile menu render behavior |

### Slots

| Slot | Description | Props |
| :--- | :--- | :--- |
| `header` | Full-width top header (enables Layout mode) | `{ isOpen, toggle }` |
| `main` | Main content area (enables Layout mode) | — |
| `logo` | Branding area | — |
| `left` | Left content (Header) or Top content (Sidebar) | — |
| `center` | Center content (Header) or Middle content (Sidebar) | — |
| `right` | Right actions (Header) or Bottom content (Sidebar) | — |
| `mobile-trigger` | Custom hamburger button | `{ isOpen, toggle }` |
| `mobile-menu` | Custom mobile menu content | — |

### Usage

#### App Layout Mode (Full Structure)

```vue
<Navbar variant="sidebar">
  <template #header="{ toggle }">
    <div class="h-14 border-b bg-white w-full flex items-center px-4">
      <button @click="toggle" class="md:hidden mr-4">Menu</button>
      <span class="font-bold">App Header</span>
    </div>
  </template>

  <template #default>
    <SidebarMenu :items="items" />
  </template>

  <template #main>
    <main class="p-8">Dashboard page content...</main>
  </template>
</Navbar>

```

#### Standard Header

```vue
<Navbar variant="header" position="sticky">
  <template #logo>
    <span class="font-bold">GeneriCorp</span>
  </template>

  <template #left>
    <NavbarGroup>
      <NavbarItem label="Dashboard" to="/" active />
      <NavbarItem label="Settings" to="/settings" />
    </NavbarGroup>
  </template>

  <template #right>
    <Button size="sm">Logout</Button>
  </template>
</Navbar>

```

#### Standard Sidebar

```vue
<Navbar variant="sidebar" class="h-screen">
  <template #logo>Logo</template>

  <template #default>
    <SidebarMenu :items="items" />
  </template>

  <template #right>
    <div class="p-4">User Profile</div>
  </template>
</Navbar>

```

### NavbarItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `to` | `string` | — | Router link target |
| `href` | `string` | — | External link URL |
| `label` | `string` | — | Link text |
| `icon` | `string` | — | Leading icon |
| `iconRight` | `string` | — | Trailing icon |
| `active` | `boolean` | `false` | Forced active state |
| `disabled` | `boolean` | `false` | Disable interactions |
| `class` | `string` | `''` | Additional CSS classes |
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` | Layout orientation |
| `variant` | `'default' | 'pill' | 'underline' | 'ghost'` | `'ghost'` | Visual style |
| EOF |  |  |  |

cat << 'EOF' > "/Users/safdar/Projects/vlite3/docs/components/SidebarMenu.md"

# SidebarMenu

**Import:** `import { SidebarMenu } from 'vlite3'`
**Types:** `import type { SidebarMenuItemSchema } from 'vlite3'`

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `SidebarMenuItemSchema[]` | `[]` | Menu structure |
| `allowMultiple` | `boolean` | `true` | Allow multiple submenus open |
| `indentSize` | `number` | `12` | Indentation pixels per level |
| `variant` | `'default' | 'ghost'` | `'default'` | Visual theme |
| `defaultExpanded` | `string[]` | `[]` | IDs of default expanded menus |
| `compact` | `boolean` | `false` | Collapsed mode (icons only) |
| `showCompactLabels` | `boolean` | `false` | Show small labels in compact mode |
| `renderMode` | `'tree' | 'popover'` | `'tree'` | Submenu rendering style |
| `iconSize` | `string` | `'16px'` | Icon size CSS string |
| `compactIconSize` | `string` | `'20px'` | Icon size when in compact mode |
| `labelClass` | `string` | `'text-sm'` | Tailwind class for labels |
| `compactLabelClass` | `string` | `'text-[11.5px] mt-1'` | Tailwind class for compact labels |
| `itemPadding` | `string` | `'py-2 px-2'` | Padding classes for items |
| `compactItemPadding` | `string` | `'py-2 px-1'` | Padding classes for compact items |
| `nestedMenuWidth` | `string` | `'220px'` | Width of nested popover menu |
| `nestedMenuMaxHeight` | `string` | `'300px'` | Max height of nested popover menu |

### Type Definition

```ts
interface SidebarMenuItemSchema {
  id?: string
  label: string
  labelI18n?: string
  icon?: string
  to?: string | { path: string; [key: string]: any }
  href?: string
  children?: SidebarMenuItemSchema[]
  badge?: string | number
  badgeClass?: string
  disabled?: boolean
  renderMode?: 'tree' | 'popover'
  action?: (item: SidebarMenuItemSchema) => void
  class?: string
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
    icon-size="18px"
    compact-icon-size="24px"
  />
</template>

```


---

## NavbarTabs

**Import:** `import { NavbarTabs } from 'vlite3'`

### Props

| Prop            | Type                 | Default    | Description                                   |
| :-------------- | :------------------- | :--------- | :-------------------------------------------- |
| `items`         | `NavbarTabItem[]`    | required   | Array of tab definitions                      |
| `variant`       | `NavbarTabsVariant`  | `'line'`   | Visual style                                  |
| `size`          | `NavbarTabsSize`     | `'md'`     | Tab size                                      |
| `activeClass`   | `string`             | `''`       | Override active tab classes                   |
| `inactiveClass` | `string`             | `''`       | Override inactive tab classes                 |
| `class`         | `string`             | `''`       | Custom class on root wrapper                  |

### Types
```ts
export interface NavbarTabItem {
  label: string
  labelI18n?: string
  to: string            // vue-router path
  icon?: string         // optional leading icon
  iconRight?: string    // optional trailing icon
  disabled?: boolean
  exact?: boolean       // use exact route matching
}

export type NavbarTabsVariant = 'line' | 'pill' | 'solid' | 'ghost'
export type NavbarTabsSize    = 'sm' | 'md' | 'lg'
```

### Features

- Uses `<RouterLink>` for navigation with proper active-class handling
- Horizontal overflow with hidden scrollbar (visible scroll still works)
- Fade gradient + chevron buttons appear automatically when tabs overflow
- Active tab scrolled into view on route change
- Keyboard accessible (`tab` focus, `enter` to navigate)
- Fully reactive to route changes

### Usage
```vue
<NavbarTabs
  :items="[
    { label: 'Overview',  to: '/project/overview' },
    { label: 'Issues',    to: '/project/issues'   },
    { label: 'Settings',  to: '/project/settings' },
  ]"
  variant="line"
  size="md"
/>
```
