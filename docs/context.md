# vlite3 — Component Context

> AI-agent & developer reference.

---

## Table of Contents

- [Button](#button)
- [ButtonGroup](#buttongroup)
- [Icon](#icon)
- [Label](#label)
- [Badge](#badge)
- [Chip](#chip)
- [Switch](#switch)
- [CheckBox](#checkbox)
- [Avatar](#avatar)
- [Accordion](#accordion)
- [Alert](#alert)
- [DataTable](#datatable)
- [DatePicker](#datepicker)
- [Pagination](#pagination)
- [Tabes](#tabes)
- [Modal](#modal)
- [SidePanel](#sidepanel)

---

# Button

**Import:** `import { Button } from 'vlite3'`

### Props

| Prop        | Type               | Default   | Description                         |
| :---------- | :----------------- | :-------- | :---------------------------------- |
| `variant`   | `ButtonVariant`    | `primary` | Visual style                        |
| `size`      | `ButtonSize`       | `md`      | Dimensions                          |
| `rounded`   | `ButtonRounded`    | `md`      | Border radius                       |
| `icon`      | `string`           | —         | Left icon (Iconify ID or Image URL) |
| `iconRight` | `string`           | —         | Right icon (Iconify ID)             |
| `text`      | `string`           | —         | Label text (alt to slot)            |
| `type`      | `button \| submit` | `button`  | Native type                         |
| `loading`   | `boolean`          | `false`   | Show spinner                        |
| `disabled`  | `boolean`          | `false`   | Disable interaction                 |

### Types

```ts
type ButtonVariant =
  | 'primary'
  | 'primary-light'
  | 'secondary'
  | 'danger'
  | 'danger-light'
  | 'warning'
  | 'warning-light'
  | 'info'
  | 'info-light'
  | 'success'
  | 'success-light'
  | 'outline'
  | 'outline-primary'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-success'
  | 'ghost'
  | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

### Usage

```vue
<Button variant="primary" icon="lucide:plus">Add Item</Button>
<Button variant="ghost" loading />
```

---

# ButtonGroup

**Import:** `import { ButtonGroup } from 'vlite3'`

### Props

| Prop        | Type          | Default     | Description                   |
| ----------- | ------------- | ----------- | ----------------------------- | ----------- |
| `direction` | `'horizontal' | 'vertical'` | `horizontal`                  | Layout axis |
| `attached`  | `boolean`     | `true`      | Fuse borders (false adds gap) |

### Usage

```vue
<ButtonGroup attached>
  <Button>Years</Button>
  <Button>Months</Button>
</ButtonGroup>
```

#### Outline variant (border-aware)

<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
</ButtonGroup>

---

# Icon

**Import:** `import { Icon } from 'vlite3'`

### Props

| Prop   | Type     | Default | Description                                   |
| ------ | -------- | ------- | --------------------------------------------- |
| `icon` | `string` | `''`    | Iconify ID (e.g., `lucide:home`) or Image URL |

### Usage

```vue
<Icon icon="lucide:settings" class="w-4 h-4" />
<Icon icon="[https://example.com/logo.png](https://example.com/logo.png)" />
```

---

# Label

**Import:** `import { Label } from 'vlite3'`

### Props

| Prop  | Type     | Default | Description                   |
| ----- | -------- | ------- | ----------------------------- |
| `for` | `string` | —       | ID of the target form element |

### Usage

```vue
<Label for="email">Email Address</Label>
<Input id="email" />
```

---

# Badge

**Import:** `import { Badge } from 'vlite3'`

### Props

| Prop      | Type           | Default   | Description |
| --------- | -------------- | --------- | ----------- |
| `variant` | `BadgeVariant` | `default` | Color theme |

### Types

```ts
type BadgeVariant = 'default' | 'secondary' | 'danger' | 'outline' | 'warning' | 'info' | 'success'
```

### Usage

```vue
<Badge variant="success">Completed</Badge>
```

---

# Chip

**Import:** `import { Chip } from 'vlite3'`

### Props

| Prop        | Type                             | Default  | Description                      |
| ----------- | -------------------------------- | -------- | -------------------------------- |
| `variant`   | `ChipVariant`                    | `subtle` | Visual style                     |
| `size`      | `'small' \| 'medium' \| 'large'` | `medium` | Dimensions                       |
| `text`      | `string`                         | —        | Label text                       |
| `icon`      | `string`                         | —        | Leading icon                     |
| `clickable` | `boolean`                        | `false`  | Enable interaction styles/events |
| `deletable` | `boolean`                        | `false`  | Show delete button               |
| `disabled`  | `boolean`                        | `false`  | Disable interactions             |

### Events

- `@click` (requires `clickable`)
- `@delete` (requires `deletable`)

### Types

```ts
type ChipVariant =
  | 'solid'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
```

### Usage

```vue
<Chip text="Vue" variant="primary" clickable @click="select" />
<Chip text="Filter" deletable @delete="remove" />
```

---

# Switch

**Import:** `import { Switch } from 'vlite3'`

### Props

| Prop         | Type      | Default | Description         |
| ------------ | --------- | ------- | ------------------- |
| `modelValue` | `boolean` | `false` | Binding (`v-model`) |
| `label`      | `string`  | —       | Side label text     |
| `disabled`   | `boolean` | `false` | Disable toggle      |

### Usage

```vue
<Switch v-model="isEnabled" label="Airplane Mode" />
```

---

# CheckBox

**Import:** `import { CheckBox } from 'vlite3'`

### Props

| Prop            | Type              | Default | Description                            |
| --------------- | ----------------- | ------- | -------------------------------------- |
| `checked`       | `boolean`         | `false` | Binding (`v-model:checked`)            |
| `label`         | `string`          | —       | Side label text                        |
| `indeterminate` | `boolean`         | `false` | Mixed state visually                   |
| `disabled`      | `boolean`         | `false` | Disable input                          |
| `size`          | `CheckboxSize`    | `md`    | Dimensions                             |
| `rounded`       | `CheckboxRounded` | —       | Corner radius (defaults to size style) |

### Types

```ts
type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CheckboxRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

### Usage

```vue
<CheckBox v-model:checked="isAgreed" label="I accept terms" />
```

---

# Avatar

**Import:** `import { Avatar } from 'vlite3'`

### Props

| Prop       | Type            | Default  | Description                           |
| ---------- | --------------- | -------- | ------------------------------------- |
| `src`      | `string`        | —        | Image URL                             |
| `alt`      | `string`        | `Avatar` | Alt text, used for initial generation |
| `fallback` | `string`        | —        | Explicit text fallback (e.g. "JD")    |
| `size`     | `AvatarSize`    | `md`     | Dimensions                            |
| `rounded`  | `AvatarRounded` | `full`   | Shape                                 |

### Types

```ts
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

### Usage

```vue
<Avatar src="[https://i.pravatar.cc/150](https://i.pravatar.cc/150)" size="lg" />
<Avatar alt="John Doe" fallback="JD" rounded="md" />
```

---

# Accordion

**Import:** `import { Accordion } from 'vlite3'`

### Props

| Prop                | Type                    | Default   | Description                       |
| :------------------ | :---------------------- | :-------- | :-------------------------------- |
| `items`             | `AccordionItemSchema[]` | `[]`      | Data source for items             |
| `allowMultiple`     | `boolean`               | `false`   | Allow multiple items open at once |
| `variant`           | `AccordionVariant`      | `default` | Visual style                      |
| `size`              | `AccordionSize`         | `md`      | Size of trigger/content           |
| `attached`          | `boolean`               | `false`   | Remove spacing between items      |
| `disabled`          | `boolean`               | `false`   | Disable all interaction           |
| `showIndex`         | `boolean`               | `false`   | Show item number (1, 2...)        |
| `openIcon`          | `string`                | —         | Icon when open                    |
| `closeIcon`         | `string`                | —         | Icon when closed                  |
| `iconVariant`       | `IconVariant`           | `simple`  | Style of the toggle icon          |
| `activeIconVariant` | `IconVariant`           | —         | Style when active                 |
| `triggerClass`      | `string`                | —         | Custom class for trigger          |
| `contentClass`      | `string`                | —         | Custom class for content          |
| `itemClass`         | `string`                | —         | Custom class for item wrapper     |

### Types

```ts
export interface AccordionItemSchema {
  id: string
  title: string
  description?: string
  content?: string
  icon?: string
  disabled?: boolean
  bodyComponent?: Component | any
  [key: string]: any
}

export type AccordionVariant = 'default' | 'solid' | 'outline' | 'separated' | 'ghost'
export type AccordionSize = 'sm' | 'md' | 'lg'
export type IconVariant = 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'
```

### Usage

```vue
<Accordion :items="items" variant="outline" allow-multiple attached show-index />
```

---

# Alert

**Import:** `import { Alert } from 'vlite3'`

### Props

| Prop          | Type                            | Default   | Description                          |
| :------------ | :------------------------------ | :-------- | :----------------------------------- |
| `title`       | `string`                        | —         | Alert title                          |
| `description` | `string`                        | —         | Alert description                    |
| `icon`        | `string`                        | —         | Custom icon (overrides variant icon) |
| `variant`     | `AlertVariant`                  | `primary` | Visual style theme                   |
| `closable`    | `boolean`                       | `false`   | Show close button                    |
| `role`        | `'alert' \| 'status' \| 'none'` | —         | ARIA role                            |
| `class`       | `string`                        | —         | Custom classes                       |

### Types

```ts
export type AlertVariant = 'primary' | 'success' | 'warning' | 'danger'
```

### Usage

```vue
<Alert
  title="Payment Success"
  description="Your transaction has been processed."
  variant="success"
  closable
  @close="onClose" />
```

---

# DataTable

**Import:** `import { DataTable } from 'vlite3'`

### Props

| Prop                  | Type                    | Default             | Description                 |
| :-------------------- | :---------------------- | :------------------ | :-------------------------- |
| `rows`                | `any[]`                 | `[]`                | Data array to display       |
| `headers`             | `TableHeader[]`         | `[]`                | Column definitions          |
| `search`              | `string`                | —                   | Search query string         |
| `showSearch`          | `boolean`               | `true`              | Show search input           |
| `searchPlaceholder`   | `string`                | `Search...`         | Placeholder for search      |
| `loading`             | `boolean`               | `false`             | Show loading state/skeleton |
| `selectable`          | `boolean`               | `false`             | Enable row selection        |
| `sortable`            | `boolean`               | `false`             | Enable column sorting       |
| `showPagination`      | `boolean`               | `true`              | Show footer pagination      |
| `itemsPerPage`        | `number`                | `10`                | Rows per page               |
| `itemsPerPageOptions` | `number[]`              | `[10, 25, 50, 100]` | Options dropdown            |
| `showItemsPerPage`    | `boolean`               | `true`              | Show limit selector         |
| `striped`             | `boolean`               | `false`             | Zebra striping              |
| `hoverable`           | `boolean`               | `true`              | Highlight row on hover      |
| `bordered`            | `boolean`               | `true`              | Outer border                |
| `compact`             | `boolean`               | `false`             | Reduced padding             |
| `variant`             | `'default' \| 'raised'` | `default`           | Table style                 |
| `emptyTitle`          | `string`                | `No data available` | Empty state title           |
| `emptyDescription`    | `string`                | —                   | Empty state text            |
| `emptyIcon`           | `string`                | `lucide:inbox`      | Empty state icon            |

### Types

```ts
export interface TableHeader {
  field: string
  title: string
  width?: string
  minWidth?: string
  sortable?: boolean
  hideOnMobile?: boolean
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row?: any) => string
  class?: string | ((value: any, row?: any) => string)
  capitalize?: boolean
  addStatusColor?: boolean
  type?: 'text' | 'price' | 'date' | 'number'
}

export interface SortConfig {
  field: string
  order: 'asc' | 'desc' | ''
}

export interface TableState {
  pagination: { page: number; limit: number }
  sorting: SortConfig
  search: string
}
```

### Slots

| Slot             | Description                                          |
| :--------------- | :--------------------------------------------------- |
| `[header.field]` | Custom cell content (e.g. `p#name="{ value, row }"`) |
| `toolbar-left`   | Left side of toolbar                                 |
| `toolbar-right`  | Right side of toolbar                                |
| `empty-action`   | Action button in empty state                         |

### Usage

```vue
<DataTable :headers="headers" :rows="users" selectable sortable :loading="isLoading">
  <template #status="{ value }">
    <Badge :variant="value === 'active' ? 'success' : 'secondary'">
      {{ value }}
    </Badge>
  </template>

  <template #toolbar-right>
    <Button icon="lucide:plus">New User</Button>
  </template>
</DataTable>
```

---

# DatePicker

**Import:** `import { DatePicker } from 'vlite3'`

### Props

| Prop             | Type                   | Default           | Description               |
| :--------------- | :--------------------- | :---------------- | :------------------------ |
| `modelValue`     | `any`                  | —                 | Binding (`v-model`)       |
| `mode`           | `'date' \| 'dateTime'` | `date`            | Selection mode            |
| `minDate`        | `string`               | —                 | Minimum allowed date      |
| `placeholder`    | `string`               | —                 | Input placeholder         |
| `icon`           | `string`               | `lucide:calendar` | Trigger icon              |
| `size`           | `ButtonSize`           | `md`              | Trigger button size       |
| `variant`        | `ButtonVariant`        | `outline`         | Trigger button style      |
| `teleport`       | `boolean`              | `true`            | Teleport dropdown to body |
| `minuteInterval` | `number`               | `5`               | Minute step for time      |

### Usage

```vue
<DatePicker v-model="date" mode="dateTime" :min-date="new Date().toISOString()" variant="ghost" />
```

---

# Pagination

**Import:** `import { Pagination } from 'vlite3'`

### Props

| Prop                  | Type                                        | Default       | Description                      |
| :-------------------- | :------------------------------------------ | :------------ | :------------------------------- |
| `currentPage`         | `number`                                    | `1`           | Binding (`v-model:currentPage`)  |
| `totalPages`          | `number`                                    | required      | Total pages                      |
| `siblingCount`        | `number`                                    | `1`           | Number of siblings               |
| `disabled`            | `boolean`                                   | `false`       | Disable navigation               |
| `showEdges`           | `boolean`                                   | `false`       | Show first/last buttons          |
| `showPageInfo`        | `boolean`                                   | `false`       | Show "Page X of Y"               |
| `showItemsPerPage`    | `boolean`                                   | `false`       | Show limit selector              |
| `itemsPerPage`        | `number`                                    | `10`          | Binding (`v-model:itemsPerPage`) |
| `itemsPerPageOptions` | `number[]`                                  | `[10, 25...]` | Limit options                    |
| `navType`             | `'text' \| 'icon'`                          | `text`        | Navigation style                 |
| `alignment`           | `'start' \| 'center' \| 'end' \| 'between'` | —             | Flex alignment                   |

### Usage

```vue
<Pagination
  v-model:currentPage="page"
  v-model:itemsPerPage="limit"
  :total-pages="10"
  show-page-info
  show-items-per-page
  alignment="between" />
```

---

# Tabes

**Import:** `import { Tabes } from 'vlite3'`

### Props

| Prop         | Type               | Default   | Description           |
| :----------- | :----------------- | :-------- | :-------------------- |
| `modelValue` | `string \| number` | —         | Binding (`v-model`)   |
| `options`    | `TabesOption[]`    | required  | Array of tabs         |
| `size`       | `TabesSize`        | `md`      | Dimensions            |
| `variant`    | `TabesVariant`     | `surface` | Visual style          |
| `block`      | `boolean`          | `false`   | Full width            |
| `textClass`  | `string`           | —         | Custom class for text |

### Types

```ts
export interface TabesOption {
  label: string
  value: string | number
  icon?: string
  disabled?: boolean
}

export type TabesSize = 'sm' | 'md' | 'lg'

export type TabesVariant =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'outline'
  | 'line'
```

### Usage

```vue
<Tabes
  v-model="currentTab"
  :options="[
    { label: 'Home', value: 'home' },
    { label: 'Profile', value: 'profile' },
  ]"
  variant="line"
  block />
```

---

# Modal

**Import:** `import { Modal } from 'vlite3'`

### Props

| Prop           | Type        | Default       | Description                                 |
| :------------- | :---------- | :------------ | :------------------------------------------ |
| `show`         | `boolean`   | `false`       | Binding (`v-model:show`) - Visibility state |
| `title`        | `string`    | —             | Modal title text                            |
| `description`  | `string`    | —             | Helper text below title                     |
| `maxWidth`     | `string`    | `sm:max-w-lg` | Tailwind max-width class (e.g. `max-w-2xl`) |
| `closeOutside` | `boolean`   | `true`        | Close when clicking backdrop                |
| `backdrop`     | `boolean`   | `true`        | Show dark overlay                           |
| `triggerClass` | `string`    | —             | Classes for the trigger wrapper             |
| `headerClass`  | `string`    | —             | Classes for the header section              |
| `bodyClass`    | `string`    | —             | Classes for the content section             |
| `footerClass`  | `string`    | —             | Classes for the footer section              |
| `body`         | `Component` | —             | Component to render lazily inside           |
| `bodyProps`    | `object`    | —             | Props to pass to the `body` component       |

### Events

- `@close`: Emitted when the modal is closed
- `@update:show`: Emitted to update the v-model
- `@onOpen`: Emitted when the modal opens

### Slots

| Slot      | Description                           | Props                   |
| :-------- | :------------------------------------ | :---------------------- |
| `trigger` | Element that opens the modal on click | —                       |
| `default` | Main content of the modal             | `{ close: () => void }` |
| `footer`  | Footer content (buttons, etc.)        | `{ close: () => void }` |

### Usage

```vue
<Modal title="Edit User">
  <template #trigger>
    <Button>Open Modal</Button>
  </template>

  <div class="space-y-4">
    <p>User details form goes here...</p>
  </div>

  <template #footer="{ close }">
    <Button variant="outline" @click="close">Cancel</Button>
    <Button @click="save">Save</Button>
  </template>
</Modal>
```

#### Programmatic Control

```vue
<Modal v-model:show="isOpen" title="Programmatic" description="Controlled via v-model">
  <p>Content...</p>
</Modal>
```

---

# SidePanel

**Import:** `import { SidePanel } from 'vlite3'`

### Props

| Prop              | Type                | Default | Description                        |
| :---------------- | :------------------ | :------ | :--------------------------------- |
| `show`            | `boolean`           | `false` | Binding (`v-model:show`)           |
| `title`           | `string`            | —       | Panel title                        |
| `description`     | `string`            | —       | Helper text below title            |
| `position`        | `SidePanelPosition` | `right` | Slide from `left` or `right`       |
| `size`            | `SidePanelSize`     | `md`    | Width preset (`sm` to `full`)      |
| `closeOutside`    | `boolean`           | `true`  | Close on backdrop click            |
| `hideCloseButton` | `boolean`           | `false` | Hide the 'X' button                |
| `backdrop`        | `boolean`           | `true`  | Show overlay                       |
| `body`            | `Component`         | —       | Component for lazy loading content |
| `bodyProps`       | `object`            | —       | Props for the body component       |

### Types

```ts
type SidePanelPosition = 'left' | 'right'
type SidePanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

### Events

- `@close`
- `@update:show`
- `@onOpen`
- `@onAfterOpen`: Animation complete
- `@onAfterClose`: Animation complete

### Slots

| Slot      | Description                     | Props                   |
| :-------- | :------------------------------ | :---------------------- |
| `trigger` | Clickable element to open panel | —                       |
| `header`  | Custom header content           | —                       |
| `default` | Body content                    | `{ close: () => void }` |
| `footer`  | Footer content                  | `{ close: () => void }` |

### Usage

```vue
<SidePanel title="Settings" position="right" size="lg">
  <template #trigger>
    <Button variant="ghost" icon="lucide:settings" />
  </template>

  <div class="p-4">
    <h4 class="font-medium">Account Settings</h4>
    <!-- settings controls -->
  </div>

  <template #footer="{ close }">
    <Button class="w-full" @click="close">Done</Button>
  </template>
</SidePanel>
```
