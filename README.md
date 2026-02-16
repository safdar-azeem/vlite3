# vlite3

A lightweight Vue 3 UI component library built with Tailwind CSS, created for personal projects and available for anyone to use.

## Installation

### NPM

```bash
npm install vlite3
```

### Yarn

```bash
yarn add vlite3
```

## 2. Tailwind CSS Setup (Tailwind v4)

`vite.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

`style.css`

```css
@import 'tailwindcss';
@layer theme, base, components, utilities;

@import 'vlite3/style.css';
@source "../node_modules/vlite3";
```

## 3. Usage

Import components directly in your Vue files:

```vue
<script setup>
import { Button, Input } from 'vlite3'
</script>

<template>
  <div class="p-4 space-y-4">
    <Button>Click Me</Button>
    <Input placeholder="Type here..." />
  </div>
</template>
```

## 🎨 Theming & Customization

vlite3 uses a semantic theming system inspired by **shadcn/ui** and compatible with **Tailwind CSS v4**. All colors are defined as CSS variables, making it easy to customize the look and feel of your application including Dark Mode support.

### Semantic Colors

You can customize these colors in your CSS by overriding the variables in `:root` or `.dark` classes (if you are using a class-based dark mode switcher).

| Variable                   | Class Name                    | Description             | Recommended Usage                                                           |
| :------------------------- | :---------------------------- | :---------------------- | :-------------------------------------------------------------------------- |
| `--background`             | `bg-background`               | Default page background | The main background color of your app.                                      |
| `--foreground`             | `text-foreground`             | Default text color      | The primary text color for content.                                         |
| `--card`                   | `bg-card`                     | Card background         | Little Gray Background for cards, containers, surfece, panels, and dialogs. |
| `--primary`                | `bg-primary`                  | Primary brand color     | Used for main actions (buttons, active states).                             |
| `--primary-foreground`     | `text-primary-foreground`     | Primary text color      | Text color for content on top of primary background.                        |
| `--secondary`              | `bg-secondary`                | Secondary background    | Used for secondary actions or muted sections.                               |
| `--secondary-foreground`   | `text-secondary-foreground`   | Secondary text color    | Text color for content on top of secondary background.                      |
| `--muted`                  | `bg-muted`                    | Muted background        | Subtle backgrounds (e.g., table headers, disabled states).                  |
| `--muted`                  | `text-muted`                  | Muted Text              | Secondary text, Unactive Link, description.                                 |
| `--muted-foreground`       | `text-muted-foreground`       | Muted text color        | Secondary text, hints, placeholders.                                        |
| `--accent`                 | `bg-accent`                   | Accent background       | Used for hover states, selection highlights.                                |
| `--accent-foreground`      | `text-accent-foreground`      | Accent text color       | Text color on accent backgrounds.                                           |
| `--destructive`            | `bg-destructive`              | Destructive color       | Used for error states and destructive actions.                              |
| `--destructive-foreground` | `text-destructive-foreground` | Destructive text color  | Text color on destructive backgrounds.                                      |
| `--border`                 | `border`                      | Default border color    | Borders for inputs, cards, and dividers.                                    |
| `--input`                  | `border-input`                | Input border color      | Borders specifically for form inputs.                                       |
| `--ring`                   | `ring-ring`                   | Focus ring color        | Outline color for focused elements.                                         |
| `--radius`                 | `rounded`                     | Border radius           | Global border radius for components.                                        |

### Extended Color Variants

For more complex components, vlite3 provides extended variants for main semantic colors (`primary`, `danger`, `warning`, `info`, `success`). These are useful for building nuanced UIs with subtle backgrounds, hover states, and accessible text.

| Base Color  | Variant Variables                                                                                       | Usage Description                                                                                                                                                                                           |
| :---------- | :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary** | `--color-primary-light`<br>`--color-primary-dark`<br>`--color-primary-fg`<br>`--color-primary-fg-light` | **Light**: Subtle background (e.g., 10% opacity).<br>**Dark**: Hover state for the main color.<br>**Fg**: Text color on top of the _main_ color.<br>**Fg-Light**: Text color on top of the _light_ variant. |
| **Danger**  | `--color-danger-light`<br>`--color-danger-dark`<br>`--color-danger-fg`<br>`--color-danger-fg-light`     | **Light**: Error backgrounds (alerts).<br>**Dark**: Hover state for destructive buttons.<br>**Fg**: Text on destructive buttons.<br>**Fg-Light**: Text on error alerts.                                     |
| **Warning** | `--color-warning-light`<br>`--color-warning-dark`<br>`--color-warning-fg`<br>`--color-warning-fg-light` | **Light**: Warning backgrounds.<br>**Dark**: Active/Determined warning states.<br>**Fg**: Text on warning badges.<br>**Fg-Light**: Text on warning backgrounds.                                             |
| **Success** | `--color-success-light`<br>`--color-success-dark`<br>`--color-success-fg`<br>`--color-success-fg-light` | **Light**: Success backgrounds (toasts).<br>**Dark**: Hover/Active success actions.<br>**Fg**: Text on success buttons.<br>**Fg-Light**: Text on success backgrounds.                                       |
| **Info**    | `--color-info-light`<br>`--color-info-dark`<br>`--color-info-fg`<br>`--color-info-fg-light`             | **Light**: Info backgrounds.<br>**Dark**: Hover/Active info actions.<br>**Fg**: Text on info buttons.<br>**Fg-Light**: Text on info backgrounds.                                                            |

**Example Usage:**

```html
<!-- A success badge with subtle background and matching text -->
<div class="bg-success-light text-success-fg-light border border-success/20">
  Operation Completed
</div>

<!-- A danger button with hover effect -->
<button class="bg-danger text-danger-fg hover:bg-danger-dark">Delete</button>
```

### Additional Colors

vlite3 also provides additional utility colors for specific feedback states:

| Variable          | Class Name                   | Description                             |
| :---------------- | :--------------------------- | :-------------------------------------- |
| `--color-success` | `text-success`, `bg-success` | For success messages/badges.            |
| `--color-warning` | `text-warning`, `bg-warning` | For warning messages/badges.            |
| `--color-info`    | `text-info`, `bg-info`       | For informational messages/badges.      |
| `--color-danger`  | `text-danger`, `bg-danger`   | Alias for destructive in some contexts. |

### Example Customization

To customize the theme, simply override the CSS variables in your main CSS file:

```css
@layer base {
  :root {
    --primary: #3b82f6; /* Blue-500 */
    --primary-foreground: #ffffff;
    --radius: 0.75rem;
  }

  .dark {
    --primary: #60a5fa; /* Blue-400 */
    --primary-foreground: #000000;
  }
}
```

## 8. Typography Scale System

The system is divided into two groups:

- Compact scale (prefixed with `--text--fs-*`) for smaller text
- Progressive scale (prefixed with `--text-fs-*`) for base and larger text

### Compact Text Scale

```css
--text--fs-1: 0.95em;
--text--fs-2: 0.8em;
--text--fs-3: 0.75em;
--text--fs-4: 0.7em;
--text--fs-5: 0.65em;
--text--fs-6: 0.6em;
--text--fs-7: 0.55em;
--text--fs-8: 0.5em;
--text-fs-0.5: 1.05em;
--text-fs-1: 1.1em;
--text-fs-1.5: 1.14em;
--text-fs-2: 1.18em;
--text-fs-2.5: 1.22em;
--text-fs-3: 1.26em;
--text-fs-3.5: 1.3em;
--text-fs-4: 1.34em;
--text-fs-4.5: 1.38em;
--text-fs-5: 1.42em;
--text-fs-5.5: 1.46em;
--text-fs-6: 1.5em;
--text-fs-6.5: 1.54em;
--text-fs-7: 1.58em;
--text-fs-7.5: 1.62em;
--text-fs-8: 1.68em;
--text-fs-8.5: 1.72em;
--text-fs-9: 1.8em;
--text-fs-9.5: 2em;
--text-fs-10: 2.5em;

--text-xs: 0.75rem --text-sm: 0.875rem --text-base: 1rem --text-lg: 1.125rem --text-xl: 1.25rem
  --text-2xl: 1.5rem --text-3xl: 1.875rem --text-4xl: 2.25rem --text-5xl: 3rem --text-6xl: 4rem;
```

---

```html
<p class="text-fs-2">Body text</p>

<span class="-text-fs-4 text-muted"> Caption text </span>

<h1 class="text-xl font-semibold">Page Title</h1>
```

## ✅ Components

- **Button**
- **ButtonGroup**
- **Icon**
- **Label**
- **Badge**
- **Chip**
- **Logo**
- **Navbar**
- **SidebarMenu**
- **SidePanel**
- **Masonry Grid**
- **ThemeToggle**

### Inputs & Forms

- **Input**
- **Textarea**
- **CheckBox**
- **Switch**
- **ChoiceBox**
- **Slider**
- **OTPInput**
- **DatePicker**
- **ColorPicker**
- **FilePicker**
- **AvatarUploader**
- **IconPicker**
- **MultiSelect**
- **Form**
- **CustomFields**
- **NumberInput**
- **Google Login**

### Data Display

- **Avatar**
- **Accordion**
- **Carousel**
- **DataTable**
- **Pagination**
- **Timeline**
- **Heatmap**
- **PricingPlan**
- **FileTree**
- **Workbook**
- **Tabes**

### Feedback & Overlays

- **Alert**
- **Modal**
- **ConfirmationModal**
- **ToastNotification**
- **Tooltip**
- **Dropdown**
- **ProgressBar**
- **Spinner**

# Complete reference for AI agents and developers:

- [llms.txt](https://github.com/safdar-azeem/vlite3/blob/main/llms.txt).
- [llms-theming.txt](https://github.com/safdar-azeem/vlite3/blob/main/llms-theming.txt).
- [llms-full.txt](https://github.com/safdar-azeem/vlite3/blob/main/llms-full.txt).
- [llms-advance.txt](https://github.com/safdar-azeem/vlite3/blob/main/llms-advance.txt).
