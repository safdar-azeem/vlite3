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

---


# ScrollReveal

**Directive:** `v-scroll-reveal`

### Description

A custom directive wrapper around the `scrollreveal` library. It animates elements as they scroll into the viewport. It acts as a lightweight wrapper that handles instantiation and clean-up automatically. Crucially, it includes **SSR guards**, making it safe to use in Nuxt 3 or any Server-Side Rendering environment without causing window/document errors.

### Props (Directive Binding)

The directive accepts an object matching the `ScrollRevealObjectOptions` interface.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `delay` | `number` | `200` | Delay in milliseconds before animation starts. |
| `distance` | `string` | `'50px'` | Distance the element moves (e.g., `'20px'`, `'5rem'`). |
| `duration` | `number` | `800` | Duration of the animation in milliseconds. |
| `origin` | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'` | Direction from which the element appears. |
| `opacity` | `number` | `0` | Starting opacity (0 to 1). |
| `scale` | `number` | `1` | Starting scale (e.g., `0.9` for zoom-in effect). |
| `easing` | `string` | `'cubic-bezier(0.5, 0, 0, 1)'` | CSS easing function. |
| `reset` | `boolean` | `false` | If `true`, animations repeat when scrolling up/down. |
| `desktop` | `boolean` | `true` | Enable on desktop devices. |
| `mobile` | `boolean` | `true` | Enable on mobile devices. |

### Usage

#### Basic Usage (Default Settings)
Animates from the bottom with a 50px distance and small delay.

```vue
<div v-scroll-reveal>
  <h1>Fade In Content</h1>
</div>

---


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


