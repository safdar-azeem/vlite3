<div align="center">
  <h1>vlite3</h1>
  <p><strong>A beautifully clean, minimalist Vue 3 UI component library built with Tailwind CSS.</strong></p>
  <p>Build stunning interfaces faster, with less clutter and more focus.</p>
  <br />
</div>

## Hello there! 👋

Welcome to **vlite3**! Designed around the **Clean** brand aesthetic, this library provides you with the building blocks you need to create highly usable, elegant applications. We believe in the power of simplicity, ample whitespace, and legible typography to reduce visual fatigue and let your content shine.

[Live Demo](https://vlite3.vercel.app/)

---

## 🚀 Getting Started

It’s incredibly simple to start using vlite3 in your projects. 

### 1. Installation

```bash
npm install vlite3
```
*or if you prefer yarn:*
```bash
yarn add vlite3
```

### 2. Tailwind CSS Setup (Tailwind v4)

Update your `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

Add the vlite3 styles to your `style.css`:

```css
@import 'tailwindcss';
@layer theme, base, components, utilities;

/* Import vlite3 styles */
@import 'vlite3/style.css';
@source "../node_modules/vlite3";
```

### 3. Using Components

Just import them logically into your `.vue` files and you're good to go!

```vue
<script setup>
import { Button, Input } from 'vlite3'
</script>

<template>
  <div class="p-8 space-y-6 max-w-lg mx-auto">
    <Input placeholder="What's on your mind?" />
    <Button>Submit</Button>
  </div>
</template>
```

---

## 🛠 Global Configuration (Powering up your setup)

vlite3 features a friendly, plugin-based registry so you can set global services and styling defaults once, and never repeating yourself.

Here's an example of setting it up in your `main.ts`:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { createVLite, vScrollReveal, GoogleSignInPlugin } from 'vlite3'

const app = createApp(App)

// 1. Register smooth scroll animations
app.directive('scroll-reveal', vScrollReveal)

// 2. Add Google Sign-in if needed
app.use(GoogleSignInPlugin, {
  clientId: env.VITE_GOOGLE_CLIENT_ID,
})

// 3. Initialize your elegant VLite configuration
const vlite = createVLite({
  services: {
    // A clean, central place to handle all uploads!
    upload: async (file, folderId) => {
      const formData = new FormData()
      formData.append('file', file)
      if (folderId) formData.append('folder_id', folderId)

      const response = await fetch('https://api.yourdomain.com/v1/upload', {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer ...' },
      })

      if (!response.ok) throw new Error('Oops! Upload failed.')
      const data = await response.json()
      
      return data.url 
    },
  },
  components: {
    // Keep your forms effortlessly consistent
    form: {
      variant: 'outline', 
      size: 'md', 
      rounded: 'md', 
      showRequiredAsterisk: true,
    },
  },
})

app.use(vlite)
app.mount('#app')
```

---

## 📚 Complete Reference Guides

We've prepared delightfully simple documentation to help you harness the full potential of vlite3:

- [Setup Guide](https://github.com/safdar-azeem/vlite3/blob/main/docs/0-vlite3-setup.md)
- [Theming & Customization (The Clean System)](https://github.com/safdar-azeem/vlite3/blob/main/docs/1-theming.md)
- [Components Guide](https://github.com/safdar-azeem/vlite3/blob/main/docs/2-all-components.md)
- [Forms](https://github.com/safdar-azeem/vlite3/blob/main/docs/components/Forms.md)
- [Utilities](https://github.com/safdar-azeem/vlite3/blob/main/docs/3-utility.md)
- [i18n & Localization](https://github.com/safdar-azeem/vlite3/blob/main/docs/4-i18n.md)
- [Search Utilities](https://github.com/safdar-azeem/vlite3/blob/main/docs/5-search-util.md)

Happy building! Let's create something beautiful together. ✨
