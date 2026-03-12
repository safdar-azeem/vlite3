# Date

**Import:** `import { Date } from 'vlite3'`

A reactive utility component to consistently format date values. Powered by `dayjs` under the hood, ensuring it is lightweight, beautiful, and fully accurate. 

The component inherits its formatting rules from the global `vlite3` configuration, but can be overridden locally on a per-component basis.

---

## Props

| Prop     | Type                          | Default | Description                                                                 |
| :------- | :---------------------------- | :------ | :-------------------------------------------------------------------------- |
| `value`  | `string \| number \| Date`    | —       | The date value to format. Supports ISO strings, UNIX timestamps, or native `Date` objects. |
| `format` | `string`                      | —       | Local override for the output format string (e.g., `'MM/DD/YYYY'`, `'YYYY-MM-DD'`). |

---

## Usage

### Basic Local Usage

Pass any valid date object, string, or timestamp. By default, it will use `'MM/DD/YYYY'` unless globally configured otherwise.

```vue
<script setup lang="ts">
import { Date as FormattedDate } from 'vlite3'
</script>

<template>
  <FormattedDate :value="'2026-03-12T05:07:48.000Z'" /> 
  <FormattedDate :value="1710214068000" format="YYYY-MMM-DD" /> 
  </template>

```

---

## Global Configuration

You can set a default date format for your entire application during plugin initialization.

```ts
// main.ts
import { createApp } from 'vue'
import { createVLite } from 'vlite3'
import App from './App.vue'

const app = createApp(App)

const vlite = createVLite({
  components: {
    date: {
      format: 'DD/MM/YYYY', // Set default format to European standard
    },
  },
})

app.use(vlite)
app.mount('#app')

```

---

## Dynamic Global Updates (Change From Anywhere)

If your application allows users to switch their preferred region/locale formats on the fly, you can dynamically update the global configuration using the `updateConfig` utility.

This will automatically trigger an instant re-render across your application, ensuring `<Date />` components, `List` grids, and `DataTable` columns update without refreshing the page.

```vue
<script setup lang="ts">
import { updateConfig } from 'vlite3'

const switchFormat = (newFormat: string) => {
  updateConfig({
    components: {
      date: {
        format: newFormat
      }
    }
  })
}
</script>

<template>
  <div class="flex gap-2">
    <button @click="switchFormat('MM/DD/YYYY')">US format</button>
    <button @click="switchFormat('DD/MM/YYYY')">EU format</button>
  </div>
</template>

```

