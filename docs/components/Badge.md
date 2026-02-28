# Badge

**Import:** `import { Badge } from 'vlite3'`

### Props

| Prop      | Type           | Default   | Description |
| --------- | -------------- | --------- | ----------- |
| `variant` | `BadgeVariant` | `default` | Color theme |
| `class`   | `string`       | —         | Custom CSS  |

### Types

```ts
type BadgeVariant = 'default' | 'secondary' | 'danger' | 'outline' | 'warning' | 'info' | 'success'
```

### Usage

```vue
<Badge variant="success">Completed</Badge>
```
