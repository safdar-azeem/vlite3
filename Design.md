---
version: '1.0'
design_system: 'Clean'
brand: 'vlite3'

tokens:
  colors:
    base:
      light:
        white: '#FFFFFF'
        black: '#0C0C0C'
        gray-50: '#F9F9F9'
        gray-100: '#F7F7F7'
        gray-150: '#F4F4F4'
        gray-200: '#F0F0F0'
        gray-250: '#E9E9E9'
        gray-300: '#D8D8D8'
        gray-400: '#989898'
        gray-500: '#777777'
        gray-600: '#5F5F5F'
        gray-700: '#434343'
        gray-800: '#2D2D2D'
        gray-900: '#171717'
        gray-950: '#0C0C0C'
      dark:
        white: '#FFFFFF'
        black: '#0B0B0B'
        gray-50: '#111111'
        gray-100: '#141414'
        gray-150: '#1C1C1C'
        gray-200: '#242424'
        gray-250: '#2C2C2C'
        gray-300: '#343434'
        gray-400: '#5C5C5C'
        gray-500: '#7C7C7C'
        gray-600: '#959595'
        gray-700: '#B5B5B5'
        gray-800: '#D0D0D0'
        gray-900: '#EEEEEE'
        gray-950: '#FFFFFF'

    semantic:
      light:
        background: '#ffffff'
        foreground: 'var(--color-gray-850)'
        card: '#FAFAFA'
        primary: '#171717'
        primary-foreground: '#fafafa'
        secondary: 'color-mix(in oklab, #ffffff 94.8%, #000000)'
        muted: 'var(--color-gray-100)'
        border: 'color-mix(in oklab, #ffffff 90%, #000000)'
        danger: '#ff3b30'
        warning: '#ff9500'
        info: '#007aff'
        success: '#007E51'

      dark:
        background: '#0b0b0b'
        foreground: 'var(--color-gray-150)'
        card: '#121212'
        primary: '#E4E6EA'
        primary-foreground: '#18181b'
        secondary: 'color-mix(in oklab, #0c0c0c 88.5%, #ffffff)'
        muted: 'color-mix(in oklab, #0c0c0c 95%, #ffffff)'
        border: 'color-mix(in oklab, #0c0c0c 88%, #ffffff)'
        danger: '#7F1D1D'
        warning: '#95600E'
        info: '#1a4298'
        success: '#0e4d2e'

  typography:
    scales:
      compact: '--text--fs-*'
      progressive: '--text-fs-*'
    defaults:
      xs: '0.75rem'
      sm: '0.875rem'
      base: '1rem'
      lg: '1.125rem'
      xl: '1.25rem'

  radius:
    default: '0.5rem'
    sm: 'calc(0.5rem - 2px)'
    md: '0.5rem'
    lg: 'calc(0.5rem + 2px)'
    xl: 'calc(0.5rem + 4px)'

  shadows:
    sm: 'rgba(95, 97, 100, 0.07) 0px 15px 90px 0px, rgba(0, 0, 0, 0.02) 0.2px 0.2px 1px 0px'
    default: 'rgba(55, 59, 74, 0.074) 0px 10px 55px 3px'
    lg: 'rgba(100, 100, 111, 0.15) 0px 7px 40px -1px'
---

# vlite3 Design System & AI Guidelines (The "Clean" System)

This `Design.md` acts as a central specification for AI agents and developers building with the **vlite3** component library and its Tailwind CSS v4 theming system.

The "Clean" design system relies on a semantic design token approach, focusing on simplicity, minimalism, ample whitespace, legible typography, and highly accessible color contrast.

## 🎨 Semantic Colors & Themes

We use CSS variables for all of our colors. Modifying them should be done in `:root` or within a `.dark` class (for class-based dark mode).
To keep things "Clean", opt for subtle, harmonious tones rather than highly saturated, clashing colors.

### Core Semantic Classes

| Variable             | Tailwind Class    | Usage Intent                                                               |
| :------------------- | :---------------- | :------------------------------------------------------------------------- |
| `--color-background` | `bg-background`   | Default layout background (pure white/black).                              |
| `--color-foreground` | `text-foreground` | Primary content text. High contrast needed.                                |
| `--color-card`       | `bg-card`         | Surface elevations like cards and dialogs.                                 |
| `--color-primary`    | `bg-primary`      | Main brand color for actions, buttons, active states.                      |
| `--color-muted`      | `bg-muted`        | Soft surfaces for secondary importance.                                    |
| `--color-border`     | `border`          | Default gray border. Use class: `border` just & don't control the opacity. |

### State Colors & Subtle Backgrounds

For feedback states (`danger`, `warning`, `info`, `success`), prefer the **Light** backgrounds paired with **Fg-Light** text to avoid visual fatigue, instead of relying on solid, harsh colors.

**Correct "Clean" Usage:**

```html
<!-- A beautifully subtle success badge -->
<div
  class="bg-success-light text-success-fg-light border border-success px-3 py-1 rounded-full text-sm">
  Operation Completed
</div>
```

**Avoid:** Using solid `bg-success` for non-primary actions. Solid state colors are reserved for high-priority elements like primary destructive buttons.

## ✒️ Typography

Legible typography is an absolute cornerstone of the Clean system.
For standard layout needs, **always prefer Tailwind's default `text-*` classes** (`text-sm`, `text-base`, `text-lg`) to ensure perfect consistency.

However, if you require fine-tuned sizing, use our custom fluid scales:

1. **Compact scale** (`-text--fs-*`): Perfect for incredibly dense internal tools (e.g., `-text--fs-2`).
2. **Progressive scale** (`text-fs-*`): Great for marketing or editorial pages needing finer control.

## 📐 AI Agent & Developer Rules

When generating code or UI components for this project, you **MUST strictly abide by these layout rules**:

1. **Keep Borders Invisible (or soft):**
   Rely on whitespace and soft shadows to separate content instead of heavy box borders. If you must use a border, then use class (`border`).
2. **Structure with Muted Backgrounds:**
   Use `bg-muted` to contrast against pure `bg-background` cards. This defines hierarchy cleanly.
3. **Mind your Gaps:**
   Let the layout breathe! Always rely on Flexbox/Grid `gap-x-*` and `gap-y-*` rather than injecting ad-hoc `mt-*`, `mb-*`, `ml-*`, or `mr-*` margins on sibling elements.
4. **Tailwind Shortcuts:**
   - Use `border` instead of `border-border`
   - Use `rounded` instead of `rounded-md` or `rounded-rounded`
5. **Dark Mode Modals/Cards Hierarchy:**
   The `bg-card` token automatically handles nested elevation logic based on CSS depth (i.e. `.bg-card .bg-card .bg-card`). Ensure you wrap surfaces properly.
6. **Automatic Dark Mode Swapping (NO `dark:` prefix):**
   When the `.dark` class is applied to the HTML root, all base, grayscale, and semantic colors are automatically replaced with their dark mode equivalents via CSS variables. **Do not use the `dark:` prefix for any colors** (e.g., avoid `dark:bg-gray-50`). Always use the base class (e.g., `bg-gray-50`) and it will seamlessly switch in dark mode.
