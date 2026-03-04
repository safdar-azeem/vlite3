# Navbar

**Import:** `import { Navbar, NavbarGroup, NavbarItem } from 'vlite3'`

The `Navbar` component is a versatile navigation primitive that supports two modes:

- **Header** (`variant="header"`) — A horizontal top navigation bar.
- **Sidebar** (`variant="sidebar"`) — A vertical side navigation panel.

When the `#header` and `#main` slots are both provided, it automatically enters **Layout Mode**, acting as a full-page application shell with an integrated sidebar and main content area.

---

## Props

| Prop                 | Type                                              | Default       | Description                                                                                                                                                                                                |
| :------------------- | :------------------------------------------------ | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`            | `'header' \| 'sidebar'`                           | `'header'`    | Layout mode of the navbar. `header` renders a horizontal top bar; `sidebar` renders a vertical side panel.                                                                                                 |
| `position`           | `'fixed' \| 'sticky' \| 'relative' \| 'absolute'` | `'sticky'`    | CSS positioning strategy applied to the nav element. In Layout Mode, `fixed` and `absolute` are normalized to `relative` for proper flex child behavior.                                                   |
| `centerPosition`     | `'center' \| 'left' \| 'right'`                   | `'center'`    | Controls the alignment of the `#center` slot content (Header variant only).                                                                                                                                |
| `glass`              | `boolean`                                         | `false`       | Enables a frosted glass `backdrop-blur` effect on scroll.                                                                                                                                                  |
| `border`             | `boolean`                                         | `true`        | Shows a `border-b` (header) or `border-r` (sidebar) separator. Disabled automatically when `floating` is true.                                                                                             |
| `floating`           | `boolean`                                         | `false`       | Applies a floating card style with margin, rounded corners, shadow, and a subtle border.                                                                                                                   |
| `class`              | `string`                                          | `''`          | Custom CSS class(es) appended to the root nav wrapper element.                                                                                                                                             |
| `height`             | `string`                                          | `'h-16'`      | Tailwind height class applied to the header container (Header variant only).                                                                                                                               |
| `width`              | `string`                                          | `'w-64'`      | Tailwind width class for the sidebar (Sidebar variant only, applied via layout).                                                                                                                           |
| `compact`            | `boolean`                                         | `false`       | Enables compact/collapsed mode. In sidebar, this collapses the nav to icons only. Passed via provide/inject to child `NavbarItem` and `SidebarMenu` components.                                            |
| `renderNestedTabs`   | `boolean`                                         | `false`       | When `true` (Layout Mode only), clicking a top-level sidebar item with children extracts those children and renders them as a `NavbarTabs` bar at the top of the `#main` slot instead of expanding inline. |
| `logo`               | `string`                                          | `—`           | URL for a logo image. If provided, renders an `<img>` tag inside the `#logo` slot fallback.                                                                                                                |
| `logoAlt`            | `string`                                          | `—`           | Alt text for the logo image (used with the `logo` prop).                                                                                                                                                   |
| `mobileBreakpoint`   | `'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`        | The Tailwind breakpoint at which the navbar switches from mobile (hamburger) to desktop layout.                                                                                                            |
| `logoClass`          | `string`                                          | `''`          | Additional CSS classes applied to the logo container wrapper div.                                                                                                                                          |
| `contentClass`       | `string`                                          | `''`          | Additional CSS classes applied to the main content/scrollable area of the sidebar, or the center container in the header.                                                                                  |
| `menuClass`          | `string`                                          | `''`          | Additional CSS classes applied to the mobile dropdown menu container (when `mobileMenuVariant="dropdown"`).                                                                                                |
| `rightClass`         | `string`                                          | `''`          | Additional CSS classes applied to the right-actions area (header) or bottom-pinned footer area (sidebar).                                                                                                  |
| `mobileTriggerClass` | `string`                                          | `''`          | Additional CSS classes applied to the default hamburger toggle button.                                                                                                                                     |
| `mobileMenuVariant`  | `'sidepanel' \| 'dropdown'`                       | `'sidepanel'` | Controls how the mobile menu is displayed. `sidepanel` opens an animated drawer from the left; `dropdown` renders a full-width panel below the navbar.                                                     |

---

## Slots

| Slot              | Description                                                                                                                            | Scoped Props                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| `#header`         | Renders a full-width top header bar **and** activates Layout Mode. Must be used alongside `#main`.                                     | `{ isOpen: boolean, toggle: () => void }` |
| `#main`           | Renders the main content area to the right of the sidebar in Layout Mode.                                                              | —                                         |
| `#logo`           | Branding/logo area. In header, shown on the left. In sidebar, shown at the top above content.                                          | —                                         |
| `#left`           | Left nav links (Header) or top section content (Sidebar). In header, hidden on mobile.                                                 | —                                         |
| `#center`         | Center content (Header) or middle scrollable section (Sidebar). Alignment controlled by `centerPosition`.                              | —                                         |
| `#right`          | Right action items (Header) or bottom-pinned footer (Sidebar, bordered).                                                               | —                                         |
| `#mobile-trigger` | Replaces the default hamburger `<button>`. Must handle open/close logic manually using scoped props.                                   | `{ isOpen: boolean, toggle: () => void }` |
| `#mobile-menu`    | Replaces the default mobile menu content (both `sidepanel` and `dropdown` variants). Renders the full content area of the mobile menu. | —                                         |
| `#default`        | Primary scrollable content area of the sidebar (typically a `<SidebarMenu>`). Rendered between `#left` and `#center`.                  | —                                         |

---

## Internal Behavior

### Layout Mode

Layout Mode is automatically activated when both the `#header` and `#main` slots are provided. In this mode:

- The component renders a full-page flex column wrapper (`.vlite-app-layout`).
- The `#header` slot is rendered as a `<header>` spanning the full width.
- A flex row beneath contains the `<nav>` (sidebar) and `<main>` side by side.
- The `<nav>` element is hidden on mobile (below `mobileBreakpoint`) using a responsive `max-{bp}:hidden` class, since the mobile drawer (SidePanel) handles mobile navigation separately.
- The `<main>` area optionally renders a `NavbarTabs` bar at the top if `renderNestedTabs` is `true` and a sidebar item with children has been selected.

### Scroll Detection

A passive `scroll` event listener updates `isScrolled` (true when `window.scrollY > 10`). This drives:

- The `glass` blur effect activation.
- A subtle `shadow-sm` applied when `position="sticky"` and not in floating mode.

### Mobile Menu

The mobile trigger button is hidden above `mobileBreakpoint` using `{bp}:hidden`. Below the breakpoint:

- **`sidepanel` (default):** Uses the internal `<SidePanel>` component to render a left-side drawer. The `#logo` content appears in the panel header.
- **`dropdown`:** Renders an absolutely positioned full-width panel directly below the navbar using `v-if` with `onClickOutside` to close.

### Route Watching

A `watch` on `useRoute().path` automatically closes the mobile menu whenever the route changes, ensuring navigation always collapses the menu.

### Provide/Inject Context

The Navbar provides a `navbar-context` object to all descendants:

```ts
provide('navbar-context', {
  compact: computed(() => props.compact),
  renderNestedTabs: computed(() => props.renderNestedTabs),
  setNestedTabs: (tabs: NavbarTabItem[], activeTab: string | number) => void,
})
```

This allows `SidebarMenu` and `NavbarItem` to read `compact` mode and push tab data upward when `renderNestedTabs` is active.

---

## Usage

### App Layout Mode (Full Structure)

The most powerful use case. Provide `#header` and `#main` to create a full application shell.

```vue
<Navbar variant="sidebar">
  <template #header="{ toggle }">
    <div class="h-16 border-b bg-white w-full flex items-center justify-between px-6">
      <div class="flex items-center gap-4">
        <!-- Button only visible on mobile (below mobileBreakpoint) -->
        <button class="md:hidden" @click="toggle">
          <Icon icon="lucide:menu" />
        </button>
        <span class="font-bold text-lg">My App</span>
      </div>
      <div class="flex items-center gap-3">
        <Avatar fallback="JD" />
      </div>
    </div>
  </template>

  <!-- Sidebar content (default slot) -->
  <template #default>
    <SidebarMenu :items="menuItems" />
  </template>

  <!-- Main content area -->
  <template #main>
    <div class="p-6">
      <h1>Dashboard</h1>
    </div>
  </template>
</Navbar>
```

### Standard Top Header

```vue
<Navbar variant="header" position="sticky">
  <template #logo>
    <span class="font-bold text-xl">MyBrand</span>
  </template>

  <template #left>
    <NavbarGroup>
      <NavbarItem label="Dashboard" to="/" />
      <NavbarItem label="Products" to="/products" />
      <NavbarItem label="Pricing" to="/pricing" />
    </NavbarGroup>
  </template>

  <template #center>
    <!-- Optional centered search bar -->
    <Input placeholder="Search..." icon="lucide:search" class="w-64" />
  </template>

  <template #right>
    <Button variant="ghost" size="sm">Log in</Button>
    <Button size="sm">Sign up</Button>
  </template>
</Navbar>
```

### Standalone Sidebar

```vue
<div class="flex h-screen">
  <Navbar
    variant="sidebar"
    position="relative"
    class="w-64 h-full border-r bg-white">
    <template #logo>
      <div class="flex items-center gap-2 font-bold">
        <Icon icon="lucide:box" />
        Dashboard
      </div>
    </template>

    <template #default>
      <SidebarMenu :items="menuItems" />
    </template>

    <template #right>
      <Button variant="ghost" class="w-full justify-start" icon="lucide:log-out">
        Logout
      </Button>
    </template>
  </Navbar>

  <main class="flex-1 overflow-auto p-8">
    <!-- Page content -->
  </main>
</div>
```

### Layout Mode with `renderNestedTabs`

Clicking a top-level item with children surfaces those children as tabs in the main area instead of expanding inline.

```vue
<Navbar variant="sidebar" :render-nested-tabs="true">
  <template #header="{ toggle }">
    <div class="h-16 border-b bg-white flex items-center px-6 w-full">
      <button class="md:hidden mr-4" @click="toggle">
        <Icon icon="lucide:menu" />
      </button>
      <span class="font-bold">TabApp</span>
    </div>
  </template>

  <template #default>
    <!-- When a user clicks "Settings", its children (Account, Billing, etc.)
         appear as NavbarTabs at the top of #main automatically. -->
    <SidebarMenu :items="menuItems" />
  </template>

  <template #main>
    <div class="p-6">
      <!-- Router outlet — the selected nested tab controls the sub-route -->
      <RouterView />
    </div>
  </template>
</Navbar>
```

### Mobile Menu: Dropdown Variant

```vue
<Navbar variant="header" mobile-menu-variant="dropdown" mobile-breakpoint="lg">
  <template #logo>
    <span class="font-bold">Brand</span>
  </template>

  <template #left>
    <NavbarGroup>
      <NavbarItem label="Products" to="/products" />
      <NavbarItem label="Solutions" to="/solutions" />
    </NavbarGroup>
  </template>

  <template #right>
    <Button size="sm">Sign In</Button>
  </template>

  <!-- Custom mobile menu content -->
  <template #mobile-menu>
    <div class="flex flex-col p-2 space-y-1">
      <NavbarItem label="Products" to="/products" />
      <NavbarItem label="Solutions" to="/solutions" />
      <div class="h-px bg-border my-2" />
      <NavbarItem label="Sign In" to="/login" />
    </div>
  </template>
</Navbar>
```

### Custom Mobile Trigger

```vue
<Navbar variant="header">
  <template #logo>Brand</template>

  <template #mobile-trigger="{ isOpen, toggle }">
    <button
      class="p-2 rounded-md bg-primary text-white"
      @click="toggle">
      <Icon :icon="isOpen ? 'lucide:x' : 'lucide:menu'" />
    </button>
  </template>

  <template #left>
    <NavbarItem label="Home" to="/" />
  </template>
</Navbar>
```

### Slot Class Customization

Use `logoClass`, `contentClass`, and `rightClass` to style specific internal areas.

```vue
<!-- Sidebar with custom zone backgrounds -->
<Navbar
  variant="sidebar"
  position="relative"
  logoClass="bg-blue-50 border-b border-blue-100"
  contentClass="bg-gray-50"
  rightClass="bg-white border-t border-gray-200"
  class="w-64 h-screen">
  <template #logo>
    <div class="font-bold text-blue-700">My App</div>
  </template>
  <template #default>
    <SidebarMenu :items="menuItems" />
  </template>
  <template #right>
    <div class="text-sm text-gray-500">v2.1.0</div>
  </template>
</Navbar>
```

---

## NavbarGroup

**Import:** `import { NavbarGroup } from 'vlite3'`

A simple layout wrapper that groups `NavbarItem` components either horizontally or vertically.

### NavbarGroup Props

| Prop          | Type                         | Default        | Description                                                                                                             |
| :------------ | :--------------------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Flex direction of the group. `horizontal` uses `flex-row items-center space-x-1`; `vertical` uses `flex-col space-y-1`. |
| `class`       | `string`                     | `''`           | Additional CSS classes on the wrapper div.                                                                              |

### NavbarGroup Usage

```vue
<!-- Horizontal group (default) for header nav links -->
<NavbarGroup>
  <NavbarItem label="Home" to="/" />
  <NavbarItem label="About" to="/about" />
  <NavbarItem label="Contact" to="/contact" />
</NavbarGroup>

<!-- Vertical group for stacked links (e.g. mobile menu) -->
<NavbarGroup orientation="vertical">
  <NavbarItem label="Home" to="/" />
  <NavbarItem label="About" to="/about" />
</NavbarGroup>
```

---

## NavbarItem

**Import:** `import { NavbarItem } from 'vlite3'`

A single navigation link or button within the navbar. Automatically detects the active route via Vue Router and supports icons, badges, disabled state, external links, and compact mode.

### NavbarItem Props

| Prop          | Type                                            | Default        | Description                                                                                                                           |
| :------------ | :---------------------------------------------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `to`          | `string`                                        | `—`            | Vue Router link target path. Renders as a `<router-link>`. Active state auto-detected from current route.                             |
| `href`        | `string`                                        | `—`            | External URL. Renders as an `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"` when the URL starts with `http` or `//`. |
| `label`       | `string`                                        | `—`            | Link text. Also used as the tooltip content in compact mode. Can alternatively be provided via the default slot.                      |
| `icon`        | `string`                                        | `—`            | Leading icon identifier (e.g. `'lucide:home'`). Rendered via the `<Icon>` component.                                                  |
| `iconRight`   | `string`                                        | `—`            | Trailing icon identifier. Hidden in compact mode.                                                                                     |
| `active`      | `boolean`                                       | `false`        | Forces the active visual state regardless of the current route.                                                                       |
| `disabled`    | `boolean`                                       | `false`        | Disables all pointer events and applies `opacity-50`. Prevents click events.                                                          |
| `class`       | `string`                                        | `''`           | Additional CSS classes on the root component element.                                                                                 |
| `orientation` | `'horizontal' \| 'vertical'`                    | `'horizontal'` | Layout orientation (inferred from parent context; can be forced).                                                                     |
| `variant`     | `'default' \| 'pill' \| 'underline' \| 'ghost'` | `'ghost'`      | Visual style of the item.                                                                                                             |

### NavbarItem Variants

| Variant           | Active State                                           | Inactive State                                                            |
| :---------------- | :----------------------------------------------------- | :------------------------------------------------------------------------ |
| `ghost` (default) | `bg-primary-light text-primary-fg-light font-semibold` | `text-muted-foreground hover:bg-accent hover:text-foreground`             |
| `pill`            | `bg-primary text-primary-fg shadow-sm`                 | `text-muted-foreground hover:bg-accent hover:text-foreground`             |
| `underline`       | `text-primary border-b-2 border-primary rounded-none`  | `text-muted-foreground border-b-2 border-transparent hover:border-border` |
| `default`         | `text-foreground font-semibold`                        | `text-muted-foreground hover:text-foreground`                             |

### NavbarItem Slots

| Slot      | Description                                                                                                   |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| `default` | Replaces the label text.                                                                                      |
| `badge`   | Renders additional content (e.g. a count badge) aligned to the far right of the item. Hidden in compact mode. |

### NavbarItem Emits

| Event   | Payload      | Description                                                     |
| :------ | :----------- | :-------------------------------------------------------------- |
| `click` | `MouseEvent` | Emitted when the item is clicked (not emitted when `disabled`). |

### NavbarItem Compact Mode

When the parent `Navbar` has `compact="true"`, the `navbar-context` is injected and `isCompact` becomes `true`. In compact mode:

- The label text is hidden (`md:hidden`).
- `iconRight` and badge content are hidden.
- Layout switches to `justify-center`.
- A `Tooltip` with the `label` appears on the right side to aid discoverability.

### NavbarItem Usage

```vue
<!-- Basic router link -->
<NavbarItem label="Dashboard" to="/dashboard" />

<!-- With leading and trailing icons -->
<NavbarItem
  label="Settings"
  to="/settings"
  icon="lucide:settings"
  icon-right="lucide:chevron-right" />

<!-- External link -->
<NavbarItem label="Documentation" href="https://docs.example.com" icon="lucide:external-link" />

<!-- Forced active state -->
<NavbarItem label="Reports" to="/reports" :active="true" />

<!-- Disabled -->
<NavbarItem label="Billing" to="/billing" :disabled="true" />

<!-- Pill variant -->
<NavbarItem label="New" to="/new" variant="pill" />

<!-- Underline variant (suited for tab-style headers) -->
<NavbarItem label="Overview" to="/overview" variant="underline" />

<!-- With badge slot -->
<NavbarItem label="Notifications" to="/notifications" icon="lucide:bell">
  <template #badge>
    <span class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">12</span>
  </template>
</NavbarItem>

<!-- Custom label content via default slot -->
<NavbarItem to="/profile" icon="lucide:user">
  <span class="font-semibold text-primary">John Doe</span>
</NavbarItem>
```

---

## NavbarTabs

**Import:** `import { NavbarTabs } from 'vlite3'`
**Types:** `import type { NavbarTabItem, NavbarTabsVariant, NavbarTabsSize } from 'vlite3'`

A horizontal, router-linked tab bar with automatic overflow detection, scroll fade indicators, and keyboard accessibility.

### NavbarTabs Props

| Prop            | Type                | Default   | Description                                                               |
| :-------------- | :------------------ | :-------- | :------------------------------------------------------------------------ |
| `items`         | `NavbarTabItem[]`   | required  | Array of tab definitions. Each must have a `label` and a `to` route path. |
| `variant`       | `NavbarTabsVariant` | `'solid'` | Visual style of the tabs.                                                 |
| `size`          | `NavbarTabsSize`    | `'md'`    | Size of the tab items, controlling padding and font size.                 |
| `activeClass`   | `string`            | `''`      | Overrides the default active tab CSS classes entirely.                    |
| `inactiveClass` | `string`            | `''`      | Overrides the default inactive tab CSS classes entirely.                  |
| `class`         | `string`            | `''`      | Custom class applied to the root wrapper element.                         |

### NavbarTabs Types

```ts
export interface NavbarTabItem {
  label: string // Display text for the tab
  labelI18n?: string // i18n key (overrides label if provided)
  to: string // vue-router path (required)
  icon?: string // Optional leading icon identifier
  iconRight?: string // Optional trailing icon identifier
  disabled?: boolean // Disables click and applies opacity
  exact?: boolean // Use exact route matching (default: smart prefix match)
}

export type NavbarTabsVariant = 'line' | 'pill' | 'solid' | 'ghost'
export type NavbarTabsSize = 'sm' | 'md' | 'lg'
```

### NavbarTabs Variants

| Variant | Container Style                  | Active Style                                    | Inactive Style                                                            |
| :------ | :------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------ |
| `line`  | `border-b border-border`         | `text-primary border-b-2 border-primary -mb-px` | `text-muted-foreground border-b-2 border-transparent hover:border-border` |
| `pill`  | `p-1 bg-secondary/80 rounded-lg` | `bg-background text-foreground shadow-sm`       | `text-muted-foreground hover:bg-accent/60`                                |
| `solid` | `flex gap-0`                     | `bg-primary-light text-primary-dark`            | `text-muted-foreground hover:bg-accent`                                   |
| `ghost` | `flex gap-1`                     | `bg-accent text-accent-foreground`              | `text-muted-foreground hover:bg-accent/60`                                |

### NavbarTabs Sizes

| Size | Padding         | Font Size   |
| :--- | :-------------- | :---------- |
| `sm` | `px-2.5 py-1.5` | `text-xs`   |
| `md` | `px-3.5 py-2`   | `text-sm`   |
| `lg` | `px-5 py-2.5`   | `text-base` |

### NavbarTabs Features

- Uses `<RouterLink>` for navigation with proper `aria-selected` and `role="tab"` attributes.
- Horizontal overflow with a hidden scrollbar (scroll still works via touch/trackpad).
- Fade gradient overlay + chevron arrow buttons (`lucide:chevron-left` / `lucide:chevron-right`) appear automatically when tabs overflow the container width.
- The active tab is automatically scrolled into view on every route change using `scrollIntoView`.
- Keyboard accessible: `Tab` to focus, `Enter` to navigate.
- **Smart active matching**: Uses a boundary-aware prefix check — `/button` does NOT match `/buttongroup`. Exact matching is forced when `item.exact = true` or `item.to = '/'`.

### NavbarTabs Usage

```vue
<!-- Basic line tabs -->
<NavbarTabs
  :items="[
    { label: 'Overview', to: '/project/overview' },
    { label: 'Issues', to: '/project/issues' },
    { label: 'Settings', to: '/project/settings' },
  ]"
  variant="line"
  size="md" />

<!-- With icons -->
<NavbarTabs
  :items="[
    { label: 'General', to: '/settings/general', icon: 'lucide:settings' },
    { label: 'Profile', to: '/settings/profile', icon: 'lucide:user' },
    { label: 'Security', to: '/settings/security', icon: 'lucide:shield' },
  ]"
  variant="line" />

<!-- Pill style -->
<NavbarTabs
  :items="[
    { label: 'All', to: '/items/all' },
    { label: 'Active', to: '/items/active' },
    { label: 'Archived', to: '/items/archived' },
  ]"
  variant="pill"
  size="sm" />

<!-- Disabled tab -->
<NavbarTabs
  :items="[
    { label: 'Available', to: '/tab/a' },
    { label: 'Coming Soon', to: '/tab/b', disabled: true },
  ]"
  variant="solid" />

<!-- Exact route matching -->
<NavbarTabs
  :items="[
    { label: 'Root', to: '/', exact: true },
    { label: 'Docs', to: '/docs' },
  ]"
  variant="ghost" />

<!-- Custom active/inactive class overrides -->
<NavbarTabs
  :items="tabs"
  variant="line"
  active-class="text-purple-600 border-b-2 border-purple-600 -mb-px"
  inactive-class="text-gray-400 border-b-2 border-transparent hover:text-gray-600" />
```

---

## Type Reference

```ts
// From '@/types/navbar.type.ts'

export type NavbarVariant = 'header' | 'sidebar'
export type NavbarPosition = 'fixed' | 'sticky' | 'relative' | 'absolute'
export type NavbarCenterPosition = 'center' | 'left' | 'right'

export interface NavbarProps {
  variant?: NavbarVariant
  position?: NavbarPosition
  centerPosition?: NavbarCenterPosition
  glass?: boolean
  border?: boolean
  floating?: boolean
  class?: string
  height?: string
  compact?: boolean
  renderNestedTabs?: boolean
  logo?: string
  logoAlt?: string
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  logoClass?: string
  contentClass?: string
  menuClass?: string
  rightClass?: string
  mobileTriggerClass?: string
  mobileMenuVariant?: 'sidepanel' | 'dropdown'
}
```

---

## Notes & Best Practices

- **Layout Mode requires both `#header` and `#main` slots.** Providing only one will not activate Layout Mode.
- **`renderNestedTabs` only works in Layout Mode.** It requires `#main` to be present to render the tab bar.
- In Layout Mode, set `height` on your `#header` content directly rather than via the `height` prop, since the prop only affects the standalone `variant="header"` flex container.
- The `compact` prop is propagated via `provide/inject`. Any `NavbarItem` or `SidebarMenu` inside the Navbar automatically receives this value — you do not need to pass it manually.
- When using `mobileMenuVariant="dropdown"`, the dropdown positions itself with `absolute` below the `<nav>`, so the parent must have `position: relative` (or be a positioned container) for correct stacking.
- The mobile `SidePanel` and `dropdown` menus render the `#left`, `#center`, and `#right` slot content. If you use `#mobile-menu` to override the mobile content, those default slot mirrors are replaced entirely.

---

## Sidebar Toggle (Desktop)

When using Layout Mode, you can enable a sidebar toggle button on large screens by passing the `sidebarToggle` prop. This renders a `lucide:panel-left` bars button **before the logo** inside the `#header` slot scope, accessible via the `toggleSidebar` and `sidebarVisible` scoped props.

The user's preference is automatically saved in `localStorage` under the key `vlite-navbar-sidebar-visible` and restored on the next session.

**Mobile breakpoints are completely unaffected.** The toggle button is only visible above the `mobileBreakpoint` threshold. The mobile SidePanel drawer behavior is preserved as-is.

### Prop

| Prop            | Type      | Default | Description                                                                                                   |
| :-------------- | :-------- | :------ | :------------------------------------------------------------------------------------------------------------ |
| `sidebarToggle` | `boolean` | `false` | Enables the desktop sidebar toggle feature. Only functional in Layout Mode (when `#header` + `#main` are used). |

### Updated `#header` Slot Scoped Props

| Prop             | Type         | Description                                                         |
| :--------------- | :----------- | :------------------------------------------------------------------ |
| `isOpen`         | `boolean`    | Mobile menu open state (unchanged).                                 |
| `toggle`         | `() => void` | Mobile menu toggle (unchanged).                                     |
| `sidebarVisible` | `boolean`    | Whether the sidebar is currently visible on desktop.                |
| `toggleSidebar`  | `() => void` | Call this to show/hide the desktop sidebar.                         |

### Usage
```vue
<Navbar variant="sidebar" :sidebar-toggle="true">
  <template #header="{ toggle, toggleSidebar, sidebarVisible }">
    <div class="h-16 border-b bg-white flex items-center justify-between px-6 w-full">
      <div class="flex items-center gap-4">
        <!-- Mobile hamburger — only visible below mobileBreakpoint -->
        <button class="md:hidden" @click="toggle">
          <Icon icon="lucide:menu" />
        </button>

        <!-- Desktop sidebar toggle — only visible above mobileBreakpoint -->
        <button
          class="hidden md:flex p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
          :aria-label="sidebarVisible ? 'Hide sidebar' : 'Show sidebar'"
          @click="toggleSidebar">
          <Icon icon="lucide:panel-left" class="w-5 h-5" />
        </button>

        <span class="font-bold text-lg">My App</span>
      </div>
    </div>
  </template>

  <template #default>
    <SidebarMenu :items="menuItems" />
  </template>

  <template #main>
    <div class="p-6">
      <RouterView />
    </div>
  </template>
</Navbar>
```
