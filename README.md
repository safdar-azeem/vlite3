# vlite3

A lightweight Vue 3 UI component library built with Tailwind CSS.

## Installation

### NPM

```bash
npm install vlite3
```

### Yarn

```bash
yarn add vlite3
```

## 2. Tailwind CSS Setup

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
