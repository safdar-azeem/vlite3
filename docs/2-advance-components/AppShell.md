# AppShell

**Import:** `import { AppShell } from 'vlite3'`

The `AppShell` component is a high-level layout orchestrator designed to serve as the foundational structure of your web application. It handles the dynamic arrangement of sidebars, main content areas, headers, and mobile drawers (SidePanel) gracefully.

By using `AppShell`, you separate the concern of *where* your UI elements live from *what* they are, utilizing semantic slots.

---

## Props

| Prop                 | Type                                                    | Default           | Description                                                                                                                                                                                                |
| :------------------- | :------------------------------------------------------ | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layoutMode`         | `'classic' \| 'sidebar-first' \| 'dashboard' \| 'dock'` | `'sidebar-first'` | Controls the layout structure. <br>• `classic`: Header on top, Sidebar+Main below. <br>• `sidebar-first`: Sidebar spans full height, Header+Main content to the right. <br>• `dashboard`: Floating rounded containers with a muted background. <br>• `dock`: Minimalist floating sidebar that auto-sizes to its content height, vertically centered on the left. |
| `compact`            | `boolean`                                               | `false`           | Enables compact/collapsed mode for the main sidebar. Passed via provide/inject to child `SidebarMenu` components.                                            |
| `sidebarToggle`      | `boolean`                                               | `false`           | Enables the desktop sidebar toggle feature. Renders a panel-left toggle if configured via `#header`. Preference is persisted in `localStorage` under `vlite-navbar-sidebar-visible`.               |
| `renderNestedTabs`   | `boolean`                                               | `false`           | When `true`, clicking a top-level sidebar item with children extracts those children and renders them as a `NavbarTabs` bar at the top of the `#main` slot instead of expanding inline in the sidebar. |
| `mobileBreakpoint`   | `'sm' \| 'md' \| 'lg' \| 'xl'`                          | `'md'`            | The Tailwind breakpoint at which the layout switches from mobile (hamburger drawer) to the full desktop sidebar layout.                                                                                                            |
| `contentClass`       | `string`                                                | `''`              | Additional CSS classes applied to the main scrollable area of the sidebar.                                                   |
| `rightClass`         | `string`                                                | `''`              | Additional CSS classes applied to the bottom-pinned footer area (`#sidebar-footer`).                                                                                                  |
| `breadcrumb`         | `boolean`                                               | `false`           | When `true`, auto-generates a `Breadcrumb` using current route data.                                                                                                              |
| `breadcrumbPosition` | `'header' \| 'main'`                                    | `'header'`        | Where to render the breadcrumb automatically: inside the scoped header slot or auto-injected above the main content.                                                                                                                          |
| `breadcrumbVariant`  | `BreadcrumbVariant`                                     | `'default'`       | Visual variant forwarded to the internal `<Breadcrumb>` component.                                                                                                                                         |
| `breadcrumbSeparator`| `BreadcrumbSeparator`                                   | `'chevron'`       | Separator style (`'chevron'`, `'slash'`, etc.) forwarded to `<Breadcrumb>`.                                                                                                                                |
| `breadcrumbSize`     | `BreadcrumbSize`                                        | `'sm'`            | Size forwarded to `<Breadcrumb>`.                                                                                                                                                                          |
| `breadcrumbLabels`   | `Record<string, string>`                                | `—`               | Override auto-generated route labels by path, e.g. `{ '/settings': 'Preferences' }`.                                                                                                                      |

---

## Slots

The `AppShell` uses an advanced slot architecture. You declare the elements for your desktop layout, and they are automatically carried over to your mobile drawer—with the option to independently override the mobile drawer content if desired.

### App Structure Slots
| Slot              | Description                                                                                                                            | Scoped Props                                                                                     |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `#header`         | Renders the top application header.                                     | `{ isOpen, toggle,  sidebarVisible, toggleSidebar, breadcrumbItems, pageTitle }`                             |
| `#main`           | Renders the main content area (e.g., your `<RouterView>`).                                                              | —                                                                                                |

### Desktop Sidebar Slots
| Slot              | Description                                                                                                                            | Scoped Props                                                                                     |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `#sidebar-header` | The top section of the desktop sidebar (e.g., Branding or Logo).                                          | —                                                                                                |
| `#sidebar`        | Primary scrollable content area of the desktop sidebar (typically a `<SidebarMenu>`).                  | —                                                                                                |
| `#sidebar-footer` | Bottom-pinned footer of the desktop sidebar (e.g. Account Switcher, Logout, Theme Toggles).                                                               | —                                                                                                |

### Mobile Drawer (SidePanel) Slots
*By default, if you don't define these mobile slots, they perfectly mirror their desktop counterparts (`#sidebar-header`, `#sidebar`, `#sidebar-footer`). Use these only if your mobile menu needs a highly different structural format.*

| Slot              | Description                                                                                                                            |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `#mobile-sidebar-header` | Overrides `#sidebar-header` in mobile view.                                          |
| `#mobile-sidebar`        | Overrides `#sidebar` in mobile view.                  |
| `#mobile-sidebar-footer` | Overrides `#sidebar-footer` in mobile view.                                                               |


### Scoped Props in `#header`

When using the `<template #header>` slot, you are granted several powerful scoped properties to build your own custom functional top-bar:

| Prop             | Type         | Description                                                         |
| :--------------- | :----------- | :------------------------------------------------------------------ |
| `isOpen`         | `boolean`    | Current state of the mobile side drawer.                                             |
| `toggle`         | `() => void` | Toggles the mobile side drawer open/closed. Attach this to a hamburger icon!                             |
| `sidebarVisible` | `boolean`    | Whether the desktop sidebar is currently visible (requires `sidebarToggle`). |
| `toggleSidebar`  | `() => void` | Show/hide the desktop sidebar dynamically.           |
| `breadcrumbItems`| `BreadcrumbItem[]` | Auto-generated breadcrumb array from the current route. To be fed into `<Breadcrumb>`.       |
| `pageTitle`      | `string`     | The page title inferred automatically from `route.meta.title` or `route.name`. |

---

## Layout Modes Overview

The `AppShell` offers four uniquely distinct orchestrations for your application via the `layout-mode` prop.

### 1. `sidebar-first` (Default)
The sidebar spans the entire full height of the viewport on the left. The `header` and `main` content are stacked vertically on the right side.

### 2. `classic`
The `header` spans the full width of the screen at the very top. The `sidebar` and `main` content are grouped together beneath the header.

### 3. `dashboard`
Creates a sophisticated "floating panel" aesthetic. The primary app wrapper receives a muted tone color, while the sidebar, header, and main content fields are distinct, rounded, white cards separated by subtle gaps and styling. Ideal for modern SaaS apps.

### 4. `dock`
A minimalist floating sidebar that behaves similarly to a macOS dock. The sidebar is vertically centered, and dynamically bounds its height only to the content placed within it. Highly suited for compact application navigation.

---

## Usage Example

### Standard AppShell Implementation

```vue
<AppShell variant="sidebar" layout-mode="dashboard">
  <!-- Desktop Sidebar -->
  <template #sidebar-header>
    <div class="font-bold text-lg p-2">Vlite3 App</div>
  </template>

  <template #sidebar>
    <SidebarMenu :items="menuItems" />
  </template>

  <template #sidebar-footer>
    <div class="p-2 border-t">
      <Button variant="ghost" class="w-full justify-start" icon="lucide:log-out">
        Logout
      </Button>
    </div>
  </template>

  <!-- Top Application Header -->
  <template #header="{ toggle, pageTitle }">
    <div class="h-16 border-b bg-white flex items-center justify-between px-6 w-full">
      <div class="flex items-center gap-4">
        <!-- Mobile hamburger toggle -->
        <button class="md:hidden" @click="toggle">
          <Icon icon="lucide:menu" />
        </button>
        <span class="font-bold text-lg">{{ pageTitle || 'Overview' }}</span>
      </div>
      <Avatar fallback="JD" />
    </div>
  </template>

  <!-- Main Content Route -->
  <template #main>
    <div class="p-6">
      <RouterView />
    </div>
  </template>
</AppShell>
```

### Advanced Usage with Breadcrumbs and Mobile Overrides

```vue
<AppShell 
  layout-mode="sidebar-first"
  mobileBreakpoint="lg" 
  breadcrumb
>
  <template #sidebar>
    <SidebarMenu :items="desktopItems" />
  </template>

  <!-- Optional Mobile Override -->
  <template #mobile-sidebar>
    <div class="text-xs text-muted-foreground p-2">Mobile Menu</div>
    <SidebarMenu :items="mobileOptimizedItems" />
  </template>

  <template #header="{ toggle, breadcrumbItems }">
    <div class="h-14 border-b flex items-center px-4 w-full gap-4">
      <button class="lg:hidden" @click="toggle">
        <Icon icon="lucide:menu" />
      </button>
      
      <!-- Auto-generated breadcrumbs mapped dynamically -->
      <Breadcrumb 
        v-if="breadcrumbItems.length > 1" 
        :items="breadcrumbItems" 
        separator="slash" 
      />
    </div>
  </template>

  <template #main>
    <RouterView />
  </template>
</AppShell>
```
