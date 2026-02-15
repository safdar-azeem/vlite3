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
