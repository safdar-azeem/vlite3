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

## Configuration

### 1. Import Styles

Import the library's base styles (for custom component styles) in your main entry file (e.g., `main.ts` or `App.vue`):

```ts
import 'vlite3/style.css'
```

### 2. Tailwind CSS Setup

This library relies on Tailwind CSS for utility classes. You must configure your project to scan the library's files so that the necessary classes are generated.

#### Tailwind CSS v4

If you are using the new CSS-first configuration, add the source path:

```css
@import 'tailwindcss';
@layer theme, base, components, utilities;

@import 'vlite3/style.css';
@source "../node_modules/vlite3";
```

## Usage

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
