# ButtonGroup

**Import:** `import { ButtonGroup } from 'vlite3'`

### Props

| Prop        | Type                         | Default      | Description                   |
| ----------- | ---------------------------- | ------------ | ----------------------------- |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | Layout axis                   |
| `attached`  | `boolean`                    | `true`       | Fuse borders (false adds gap) |

### Usage

```vue
<ButtonGroup attached>
  <Button>Years</Button>
  <Button>Months</Button>
</ButtonGroup>
```

#### Outline variant (border-aware)

```vue
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
</ButtonGroup>
```
