# Navbar

**Import:** `import { Navbar, NavbarGroup, NavbarItem } from 'vlite3'`

### Props

| Prop                 | Type                                              | Default  | Description                            |
| :------------------- | :------------------------------------------------ | :------- | :------------------------------------- |
| `variant`            | `'header' \| 'sidebar'`                           | `header` | Layout mode                            |
| `position`           | `'fixed' \| 'sticky' \| 'relative' \| 'absolute'` | `sticky` | CSS positioning                        |
| `centerPosition`     | `'center' \| 'left' \| 'right'`                   | `center` | Alignment of center slot (Header only) |
| `glass`              | `boolean`                                         | `true`   | Blur effect on scroll                  |
| `border`             | `boolean`                                         | `true`   | Show border (bottom or right)          |
| `floating`           | `boolean`                                         | `false`  | Floating card style                    |
| `compact`            | `boolean`                                         | `false`  | Compact interaction mode               |
| `mobileBreakpoint`   | `'sm' \| 'md' \| 'lg' \| 'xl'`                    | `md`     | Breakpoint to switch to mobile menu    |
| `height`             | `string`                                          | `h-16`   | Header height class                    |
| `width`              | `string`                                          | `w-64`   | Sidebar width class                    |
| `logoClass`          | `string`                                          | —        | Classes for logo container             |
| `contentClass`       | `string`                                          | —        | Classes for main content area          |
| `rightClass`         | `string`                                          | —        | Classes for right actions area         |
| `mobileTriggerClass` | `string`                                          | —        | Classes for hamburger button           |

### Slots

| Slot             | Description                                         | Props                |
| :--------------- | :-------------------------------------------------- | :------------------- |
| `logo`           | Branding area                                       | —                    |
| `left`           | Left content (Header) or Top content (Sidebar)      | —                    |
| `center`         | Center content (Header) or Middle content (Sidebar) | —                    |
| `right`          | Right actions (Header) or Bottom content (Sidebar)  | —                    |
| `mobile-trigger` | Custom hamburger button                             | `{ isOpen, toggle }` |
| `mobile-menu`    | Custom mobile menu content                          | —                    |

### Usage

#### Header

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

#### Sidebar

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

| Prop      | Type                                            | Default | Description         |
| :-------- | :---------------------------------------------- | :------ | :------------------ |
| `label`   | `string`                                        | —       | Link text           |
| `to`      | `string`                                        | —       | Router link target  |
| `href`    | `string`                                        | —       | External link URL   |
| `icon`    | `string`                                        | —       | Leading icon        |
| `active`  | `boolean`                                       | `false` | Forced active state |
| `variant` | `'default' \| 'pill' \| 'underline' \| 'ghost'` | `ghost` | Visual style        |
