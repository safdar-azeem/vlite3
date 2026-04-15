# Clipboard

**Import:** `import { Clipboard } from 'vlite3'`

The `Clipboard` component is a wrapper around the standard `Button` that provides out-of-the-box clipboard copying functionality. It handles the copy action, provides temporary visual feedback (changing the icon and text to indicate success), and supports internationalization.

### Props

| Prop               | Type            | Default                   | Description                                                |
| :----------------- | :-------------- | :------------------------ | :--------------------------------------------------------- |
| `textToCopy`       | `string`        | — *(Required)* | The exact string content to be copied to the clipboard     |
| `variant`          | `ButtonVariant` | `outline`                 | Visual style of the button                                 |
| `size`             | `ButtonSize`    | `md`                      | Dimensions                                                 |
| `rounded`          | `ButtonRounded` | —                         | Border radius                                              |
| `defaultIcon`      | `string`        | `lucide:copy`             | Icon shown in the default state                            |
| `copiedIcon`       | `string`        | `lucide:check`            | Icon shown temporarily after a successful copy             |
| `defaultText`      | `string`        | —                         | Custom label text for the default state                    |
| `copiedText`       | `string`        | —                         | Custom label text shown after a successful copy            |
| `defaultTextI18n`  | `string`        | `vlite.clipboard.copy`   | I18n translation key for the default text                  |
| `copiedTextI18n`   | `string`        | `vlite.clipboard.copied` | I18n translation key for the copied text                   |
| `asIcon`           | `boolean`       | `false`                   | Force render as an icon-only button (hides text)           |
| `disabled`         | `boolean`       | `false`                   | Disables interaction and copying                           |
| `class`            | `any`           | —                         | Custom CSS classes                                         |

### Events

| Event   | Payload   | Description                                      |
| :------ | :-------- | :----------------------------------------------- |
| `copy`  | `string`  | Emitted when the text is successfully copied     |
| `error` | `Error`   | Emitted if the clipboard write operation fails   |

### Usage

#### Basic Usage
```vue
<Clipboard text-to-copy="npm install vlite3" />
```

#### Icon Only
```vue
<Clipboard text-to-copy="Secret API Key" as-icon rounded="full" />
```

#### Custom Text and Icons
```vue
<Clipboard 
  text-to-copy="[https://example.com/share/123](https://example.com/share/123)" 
  default-text="Copy Link" 
  copied-text="Link Copied!" 
  default-icon="lucide:link"
  copied-icon="lucide:check-circle"
  variant="secondary" 
/>
```
