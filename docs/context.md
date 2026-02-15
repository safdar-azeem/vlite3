# vlite3 — Component Context

> AI-agent & developer reference.

---

## Table of Contents

- [Button](#button)
- [ButtonGroup](#buttongroup)

---

# Button

**Import:** `import { Button } from 'vlite3'`

### Props

| Prop        | Type                        | Default   | Description                         |
| ----------- | --------------------------- | --------- | ----------------------------------- |
| `variant`   | `ButtonVariant`             | `primary` | Visual style                        |
| `size`      | `ButtonSize`                | `md`      | Button dimensions                   |
| `rounded`   | `ButtonRounded`             | `md`      | Border radius                       |
| `icon`      | `string`                    | —         | Left icon (Iconify ID or image URL) |
| `iconRight` | `string`                    | —         | Right icon (Iconify ID)             |
| `text`      | `string`                    | —         | Label (alternative to default slot) |
| `type`      | `button \| submit \| reset` | `button`  | Native button type                  |
| `loading`   | `boolean`                   | `false`   | Replaces icon with spinner          |
| `disabled`  | `boolean`                   | `false`   | Disables all interaction            |
| `class`     | `any`                       | `''`      | Additional Tailwind classes         |

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

### Demos

```vue
<Button>Primary</Button>
<Button text="Primary" />
<!-- Icon only (square sizing auto-applied, no slot needed) -->
<Button icon="lucide:trash-2" variant="danger" />
<!-- Image URL as icon -->
<Button icon="https://example.com/logo.webp" text="Brand Action" />
```

### Do / Don't

| ✅ Do                           | ❌ Don't                                  |
| ------------------------------- | ----------------------------------------- |
| Use `variant` for color intent  | Apply raw color classes like `bg-red-500` |
| Use `text` prop OR default slot | Pass content to both `text` and the slot  |

---

# ButtonGroup

Groups `<Button>` components into a fused or spaced row/column with correct border handling.

**Import:** `import { ButtonGroup } from 'vlite3'`

### Props

| Prop        | Type                     | Default      | Description                        |
| ----------- | ------------------------ | ------------ | ---------------------------------- |
| `direction` | `horizontal \| vertical` | `horizontal` | Layout axis                        |
| `attached`  | `boolean`                | `true`       | Fuse borders; `false` adds `gap-2` |
| `class`     | `string`                 | `''`         | Additional Tailwind classes        |

### Demos

**Attached (default)**

```vue
<ButtonGroup>
  <Button>Years</Button>
  <Button>Months</Button>
  <Button>Days</Button>
</ButtonGroup>
```

**Outline variant (border-aware)**

```vue
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
</ButtonGroup>
```

---

<!-- ADD NEW COMPONENTS BELOW THIS LINE -->
