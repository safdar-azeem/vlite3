# vlite3

A lightweight Vue 3 UI component library built with Tailwind CSS, created for personal projects and available for anyone to use.

## Installation

```bash
npm install vlite3

```

```bash
yarn add vlite3

```

## Demo

[Live Demo](https://vlite3.vercel.app/)

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

## Global Configuration (Registry System)

vlite3 features a plugin-based architecture that allows you to register global services and set global component configurations. This ensures consistency and prevents repetition across your application.

### Setting up the Plugin

In your `main.ts` or `main.js`, import `createVLite` and `vScrollReveal` and register your services and component configurations:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { createVLite, vScrollReveal, GoogleSignInPlugin } from 'vlite3'

const app = createApp(App)

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

app.use(GoogleSignInPlugin, {
  clientId: env.VITE_GOOGLE_CLIENT_ID,
})

// Initialize VLite with custom configuration
const vlite = createVLite({
  // Global Service Registry
  services: {
    /**
     * Global File Upload Handler
     *
     * This function will be called automatically by:
     * - useFileUpload() composable
     * - Form components (when using 'file', 'fileUploader', 'ThumbnailSelector', or 'avatarUpload' types)
     *
     * @param file - The File object to upload
     * @param folderId - (Optional) Folder ID passed from component props
     * @returns Promise<string> - The public URL of the uploaded file
     */
    upload: async (file, folderId) => {
      // Example: Upload to your own backend
      const formData = new FormData()
      formData.append('file', file)
      if (folderId) formData.append('folder_id', folderId)

      // Replace with your actual API call (e.g., Axios, Fetch)
      const response = await fetch(
        '[https://api.yourdomain.com/v1/upload](https://api.yourdomain.com/v1/upload)',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: 'Bearer ...',
          },
        }
      )

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      return data.url // MUST return the file URL string
    },
  },

  // Global UI Components Configuration
  components: {
    form: {
      variant: 'outline', // Applies 'outline' globally to all Form inputs ('solid' | 'outline' | 'floating' | etc.)
      size: 'md', // Global size for form inputs ('sm' | 'md' | 'lg')
      rounded: 'md', // Global border radius for forms
      showRequiredAsterisk: true, // Globally toggle the visibility of the required asterisk
    },
  },
})

app.use(vlite)
app.mount('#app')
```

### How it works

#### Global Services (e.g., Uploads)

Once registered, you don't need to pass upload handlers to individual components.

1. **Automatic Injection**: The `Form` component detects input types like `file`, `avatarUpload`, or `fileUploader`.
2. **Parallel Processing**: When the form is submitted, it automatically uploads all files in **parallel** using your registered `upload` service.
3. **URL Replacement**: The File objects in your form data are replaced with the returned URLs before the final `onSubmit` event is triggered.

#### Global Component Configuration (e.g., Forms)

By setting `components.form` in the global configuration, you establish app-wide defaults.

1. **Consistency**: Every `<Form />` rendered in your application will automatically inherit the global `variant`, `size`, `rounded`, and `showRequiredAsterisk` configurations.
2. **Local Overrides**: If you need a specific form to behave differently, simply pass the prop locally on the component (e.g., `<Form variant="floating" ... />`). Local props will always override the global configuration fallback.

## 4. Advanced Usage

Import components directly in your Vue files and leverage the global configuration:

```vue
<script setup>
import { Button, Input, Form } from 'vlite3'

// The form will automatically use the global upload service AND the global style configurations
const schema = [
  {
    name: 'avatar',
    label: 'Profile Picture',
    type: 'avatarUpload',
  },
  {
    name: 'documents',
    label: 'Attachments',
    type: 'fileUploader',
    props: { multiple: true },
  },
]

const handleSubmit = (payload) => {
  // payload.values.avatar will be a URL string (e.g., "https://api...")
  // payload.values.documents will be an array of URL strings
  console.log(payload.values)
}
</script>

<template>
  <div class="">
    <Form :schema="schema" @onSubmit="handleSubmit" />

    <Form :schema="schema" variant="solid" size="lg" @onSubmit="handleSubmit" />
  </div>
</template>
```

# 🎨 Theming & Customization

Reference guide for **vlite3** and the Tailwind CSS v4 theming system. This setup uses a semantic design token approach inspired by shadcn/ui and optimized for Tailwind CSS v4.

All colors are defined as CSS variables, allowing you to customize the appearance of your application with minimal effort, including full Dark Mode support.

---

## Semantic Colors

Override these variables in `:root` or within a `.dark` class (when using class-based dark mode) to adjust your theme.

| Variable                         | Utility Class                 | Description                             | Recommended Usage                               |
| -------------------------------- | ----------------------------- | --------------------------------------- | ----------------------------------------------- |
| `--color-background`             | `bg-background`               | Default page background (white)         | Main application background                     |
| `--color-foreground`             | `text-foreground`             | Default text color (gray-900)           | Primary content text                            |
| `--color-card`                   | `bg-card`                     | Card background (gray-100)              | Cards, containers, surfaces, panels, dialogs    |
| `--color-primary`                | `bg-primary`                  | Primary brand color (blue)              | Main actions, buttons, active states            |
| `--color-primary-foreground`     | `text-primary-foreground`     | Text on primary background (white)      | Text/icons displayed on primary elements        |
| `--color-secondary`              | `bg-secondary`                | Secondary background (gray-200)         | Secondary actions, muted sections               |
| `--color-secondary-foreground`   | `text-secondary-foreground`   | Text on secondary background (gray-900) | Content displayed on secondary elements         |
| `--color-muted`                  | `bg-muted`                    | Muted background (gray-150)             | Subtle surfaces, table headers, disabled states |
| `--color-muted`                  | `text-muted`                  | Muted text (gray-600)                   | Secondary text, inactive links, descriptions    |
| `--color-accent`                 | `bg-accent`                   | Accent background (gray-150)            | Hover states, selection highlights              |
| `--color-accent-foreground`      | `text-accent-foreground`      | Text on accent background (gray-900)    | Content displayed on accent elements            |
| `--color-destructive`            | `bg-destructive`              | Destructive color (red)                 | Errors, warnings, destructive actions           |
| `--color-destructive-foreground` | `text-destructive-foreground` | Text on destructive background (white)  | Content displayed on destructive elements       |
| `--color-border`                 | `border`                      | Default border color (gray-250)         | Inputs, cards, dividers                         |
| `--radius`                       | `rounded`                     | Global border radius                    | Shared radius across components                 |

---

### Extended Color Variants

For more complex components, **vlite3** provides extended variants for main semantic colors (`primary`, `danger`, `warning`, `info`, `success`). These help create nuanced UIs with subtle backgrounds, hover states, and accessible text.

---

#### Primary

| Variable                   | Description                            |
| -------------------------- | -------------------------------------- |
| `--color-primary-light`    | Subtle background (e.g., 10% opacity)  |
| `--color-primary-dark`     | Hover state for the main color         |
| `--color-primary-fg`       | Text color on top of the main color    |
| `--color-primary-fg-light` | Text color on top of the light variant |

---

#### Danger

| Variable                  | Description                         |
| ------------------------- | ----------------------------------- |
| `--color-danger-light`    | Error backgrounds (alerts)          |
| `--color-danger-dark`     | Hover state for destructive buttons |
| `--color-danger-fg`       | Text on destructive buttons         |
| `--color-danger-fg-light` | Text on error alerts                |

---

#### Warning

| Variable                   | Description                         |
| -------------------------- | ----------------------------------- |
| `--color-warning-light`    | Warning backgrounds                 |
| `--color-warning-dark`     | Active or emphasized warning states |
| `--color-warning-fg`       | Text on warning badges              |
| `--color-warning-fg-light` | Text on warning backgrounds         |

---

#### Success

| Variable                   | Description                     |
| -------------------------- | ------------------------------- |
| `--color-success-light`    | Success backgrounds (toasts)    |
| `--color-success-dark`     | Hover or active success actions |
| `--color-success-fg`       | Text on success buttons         |
| `--color-success-fg-light` | Text on success backgrounds     |

---

#### Info

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `--color-info-light`    | Info backgrounds             |
| `--color-info-dark`     | Hover or active info actions |
| `--color-info-fg`       | Text on info buttons         |
| `--color-info-fg-light` | Text on info backgrounds     |

---

### Example Usage

```html
<div class="bg-success-light text-success-fg-light border border-success/20">
  Operation Completed
</div>

<button class="bg-danger text-danger-fg hover:bg-dang
```

### Additional Colors

vlite3 also provides additional utility colors for specific feedback states:

| Variable          | Class Name                   | Description                             |
| ----------------- | ---------------------------- | --------------------------------------- |
| `--color-success` | `text-success`, `bg-success` | For success messages/badges.            |
| `--color-warning` | `text-warning`, `bg-warning` | For warning messages/badges.            |
| `--color-info`    | `text-info`, `bg-info`       | For informational messages/badges.      |
| `--color-danger`  | `text-danger`, `bg-danger`   | Alias for destructive in some contexts. |

---

## 8. Typography Scale System

The typography system is organized into two complementary scales:

- Compact scale (prefixed with `--text--fs-*`)
- Progressive scale (prefixed with `--text-fs-*`)

Use the progressive scale only when you need finer visual control beyond the standard Tailwind size tokens.
For most layout and content needs, prefer the default Tailwind text sizes to maintain consistency.

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
```

### Progressive Text Scale

```css
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
```

### Tailwind Size Tokens

```css
--text-xs: 0.75rem --text-sm: 0.875rem --text-base: 1rem --text-lg: 1.125rem --text-xl: 1.25rem
  --text-2xl: 1.5rem --text-3xl: 1.875rem --text-4xl: 2.25rem --text-5xl: 3rem --text-6xl: 4rem;
```

---

### Usage Examples

```html
<p class="text-fs-2">Body text</p>

<span class="-text-fs-4 text-muted"> Caption text </span>

<h1 class="text-xl font-semibold">Page Title</h1>
```

## Hard Rules

Follow these rules strictly to ensure visual consistency and predictable styling across the system:

- Use `border` instead of `border-border` (the default border color (gray-250) is already applied).
- Use `rounded` instead of `rounded-rounded`.
- Use `bg-muted` instead of `bg-secondary/20`.
- Use `gap-x-*` instead of applying `ml-*` or `mr-*` directly on sibling items.
- Use `gap-y-*` instead of applying `mt-*` or `mb-*` directly on sibling items.

---

## ✅ Components

- [x] **Button**
- [x] **ButtonGroup**
- [x] **Icon**
- [x] **Label**
- [x] **Badge**
- [x] **Chip**
- [x] **StatusChip**
- [x] **Logo**
- [x] **Navbar**
- [x] **SidebarMenu**
- [x] **SidePanel**
- [x] **Breadcrumb**
- [x] **List**
- [x] **AttachmentsList**
- [x] **Masonry Grid**
- [x] **Stats**
- [x] **ThemeToggle**
- [x] **Screen**
- [x] **ChatInterface**
- [x] **CommentThread**

### Inputs & Forms

- [x] **Input**
- [x] **Textarea**
- [x] **CheckBox**
- [x] **Switch**
- [x] **ChoiceBox**
- [x] **Slider**
- [x] **OTPInput**
- [x] **NumberInput**
- [x] **DatePicker**
- [x] **DateRangePicker**
- [x] **Calendar**
- [x] **ColorPicker**
- [x] **FilePicker**
- [x] **AvatarUploader**
- [x] **ThumbnailSelector**
- [x] **IconPicker**
- [x] **MultiSelect**
- [x] **Forms**
- [x] **CustomFields**
- [x] **GoogleLogin**
- [x] **PermissionEditor**
- [x] **RichTextEditor**

### Data Display

- [x] **Avatar**
- [x] **Accordion**
- [x] **Carousel**
- [x] **DataTable**
- [x] **DataList**
- [x] **Pagination**
- [x] **Timeline**
- [x] **Heatmap**
- [x] **PricingPlan**
- [x] **FileTree**
- [x] **Workbook**
- [x] **Kanban**
- [x] **Tabes**
- [x] **Masonry**
- [x] **Stats**
- [x] **Price**
- [x] **Date**
- [x] **Invoice**
- [x] **Footer**
- [x] **Charts**

### Feedback & Overlays

- [x] **Alert**
- [x] **Modal**
- [x] **Empty**
- [x] **ConfirmationModal**
- [x] **ToastNotification**
- [x] **Tooltip**
- [x] **Dropdown**
- [x] **ProgressBar**
- [x] **Spinner**
- [x] **CommandPalette**
- [x] **SidePanel**
- [x] **Splitter**

### Utilities & Tools

- [x] **Barcode**
- [x] **QRCode**
- [x] **ImportData**
- [x] **ExportData**

## Complete reference for AI agents and developers:

- [0-setup.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/0-vlite3-setup.md)
- [1-theming.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/1-theming.md)
- [2-components.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/2-all-components.md)
- [3-forms.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/components/Forms.md)
- [3-utility.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/3-utility.md)
- [4-i18n.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/4-i18n.md)
- [5-search-util.md](https://github.com/safdar-azeem/vlite3/blob/main/docs/5-search-util.md)
