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

## Global Configuration (Registry System)

vlite3 features a plugin-based architecture that allows you to register global services. This is particularly useful for dependency injection, such as defining how file uploads should be handled across all `Form` components in your app.

### Setting up the Plugin

In your `main.ts` or `main.js`, import `createVLite` and register your services:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { createVLite } from 'vlite3'

const app = createApp(App)

// Initialize VLite with custom configuration
const vlite = createVLite({
  services: {
    /**
     * Global File Upload Handler
     *
     * This function will be called automatically by:
     * - useFileUpload() composable
     * - Form components (when using 'file', 'fileUploader', or 'avatarUpload' types)
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
})

app.use(vlite)
app.mount('#app')
```

### How it works

Once registered, you don't need to pass upload handlers to individual components.

1. **Automatic Injection**: The `Form` component detects input types like `file`, `avatarUpload`, or `fileUploader`.
2. **Parallel Processing**: When the form is submitted, it automatically uploads all files in **parallel** using your registered `upload` service.
3. **URL Replacement**: The File objects in your form data are replaced with the returned URLs before the final `onSubmit` event is triggered.

## 4. Usage

Import components directly in your Vue files:

```vue
<script setup>
import { Button, Input, Form } from 'vlite3'

// The form will automatically use the global upload service defined in main.ts
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
  <div class="p-4 space-y-4">
    <Button>Click Me</Button>
    <Input placeholder="Type here..." />

    <Form :schema="schema" @onSubmit="handleSubmit" />
  </div>
</template>
```
