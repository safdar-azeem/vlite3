# Skeleton

**Import:** `import { Skeleton } from 'vlite3'`

Pixel-perfect skeleton loading screens generated directly from your real UI layout. Instead of manually configuring heights, widths, and border radii, the `Skeleton` component derives them automatically from the actual elements.

### Props

| Prop             | Type                                | Default                     | Description                                                                    |
| :--------------- | :---------------------------------- | :-------------------------- | :----------------------------------------------------------------------------- |
| `loading`        | `boolean`                           | `false`                     | When true, displays the skeleton overlay.                                      |
| `auto`           | `boolean`                           | `false`                     | When true, automatically captures bones from the `#fixture` slot at runtime.   |
| `name`           | `string`                            | —                           | Unique identifier to resolve pre-generated bones from the global registry.     |
| `initialBones`   | `SkeletonResult \| ResponsiveBones` | —                           | Pass pre-generated bone data directly, bypassing the registry.                 |
| `color`          | `string`                            | `rgba(0, 0, 0, 0.05)`       | Base color of the bones in light mode.                                         |
| `darkColor`      | `string`                            | `rgba(255, 255, 255, 0.05)` | Base color of the bones in dark mode.                                          |
| `animate`        | `AnimationStyle`                    | `'pulse'`                   | Visual animation style. Accepts `'pulse'`, `'shimmer'`, `'solid'`, or boolean. |
| `stagger`        | `number \| boolean`                 | `false`                     | Stagger delay in milliseconds between bone animations (`true` = 80ms).         |
| `transition`     | `number \| boolean`                 | `false`                     | Fade-out duration in milliseconds when loading finishes (`true` = 300ms).      |
| `snapshotConfig` | `SnapshotConfig`                    | —                           | Fine-grained configuration for how bones are extracted from the DOM.           |
| `class`          | `string`                            | —                           | Custom CSS classes applied to the root container.                              |

### Slots

| Slot       | Description                                                                                                  |
| :--------- | :----------------------------------------------------------------------------------------------------------- |
| `default`  | Your actual component content. Rendered and visible when `loading` is false.                                 |
| `fixture`  | Mock content used to auto-generate bones when the `auto` prop is true. Rendered invisibly in the background. |
| `fallback` | Content shown when `loading` is true but no bone data is available (and `auto` is false).                    |

### Types

```ts
export type AnimationStyle = 'pulse' | 'shimmer' | 'solid' | boolean

export interface SnapshotConfig {
  /** HTML tags always captured as a single atomic bone. */
  leafTags?: string[]
  /** Capture containers with visible borders + border-radius. */
  captureRoundedBorders?: boolean
  /** HTML tags to skip entirely. */
  excludeTags?: string[]
  /** CSS selectors to skip entirely. */
  excludeSelectors?: string[]
}
```

### Usage

**1. Auto-Generated (Runtime Snapshotting)**
The easiest way to use the skeleton.

```vue
<template>
  <Skeleton :loading="isLoading" auto animate="shimmer" transition>
    <ProfileCard :user="userData" />
  </Skeleton>
</template>
```

**2. Pre-Generated (Using the Registry)**
For complex pages or SSR, use the CLI to pre-generate bones and resolve them by `name`.

```vue
<template>
  <Skeleton name="profile-card" :loading="isLoading" stagger>
    <ProfileCard :user="userData" />
  </Skeleton>
</template>
```
