# Composables

## useKeyStroke

**Import:** `import { useKeyStroke, useAdvancedKeyStroke } from 'vlite3'`

### Single key listener

```ts
const { onKeyStroke, offKeyStroke, destroy } = useKeyStroke()

onKeyStroke('Escape', (e) => closeModal())
onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => navigate(e), { preventDefault: true })
offKeyStroke('Escape')
```

### Combo key listener (Ctrl+S, Cmd+K)

```ts
const { onKeyStroke, offKeyStroke, destroy } = useAdvancedKeyStroke()

onKeyStroke('ctrl+s', (e) => {
  e.preventDefault()
  save()
})
onKeyStroke('cmd+k', (e) => openSearch()) // Auto-maps cmd↔ctrl cross-platform
```

---

# Utility Functions

**Import:** `import { debounce, throttle, deepMerge, getUniqueId, downloadFile, isAppleDevice, isEmpty, removeExtraProperties, flattenArray, capitalize, camelCase, slugify, randomNumber, truncate, formatCurrency, delay, copyToClipboard } from 'vlite3'`

### `debounce(fn, delay)`

Creates a debounced function that delays invocation until `delay` ms after the last call.

```ts
const debouncedSearch = debounce((query) => fetchResults(query), 300)
```

### `throttle(fn, delay)`

Creates a throttled function that only invokes the provided function at most once per every `delay` ms.

```ts
const throttledSearch = throttle((query) => fetchResults(query), 300)
```

### `deepMerge(target, source)`

Deep merges two objects. Source overwrites target. Arrays are replaced, not concatenated.

```ts
const merged = deepMerge(defaults, userConfig)
```

### `getUniqueId()`

Generates a unique 24-character hex string (similar to MongoDB ObjectId).

```ts
const id = getUniqueId() // e.g. '65a1b2c3d4e5f6a7b8c9d0e1'
```

### `isAppleDevice()`

Returns `true` if the current device is an Apple device (Mac, iPhone, or Safari browser).

```ts
if (isAppleDevice()) {
  /* Apple-specific logic */
}
```

### `downloadFile(fileUrl, fileName)`

Downloads a file from a URL by fetching it as a blob and triggering a browser download.

```ts
downloadFile('https://example.com/file.pdf', 'My File')
```

### `isEmpty(value)`

Returns `true` if the value is null, undefined, empty string, 0, empty array, or object with all empty values.

```ts
isEmpty(null) // true
isEmpty([]) // true
isEmpty({ a: '' }) // true
isEmpty('hello') // false
```

### `removeExtraProperties(data, propertiesToRemove)`

Recursively removes specified keys from an object or array of objects.

```ts
removeExtraProperties({ x: 1, y: 2, z: 3 }, ['x', 'y']) // { z: 3 }
```

### `flattenArray(arr)`

Recursively flattens a nested array, including values from nested objects.

```ts
flattenArray([1, [2, [3]], 4]) // [1, 2, 3, 4]
```

### `capitalize(str)`

Capitalizes the first letter and any letter following `.`, `!`, or `?`.

```ts
capitalize('hello world') // 'Hello world'
```

### `camelCase(str)`

Lowercases the first character of a string.

```ts
camelCase('HelloWorld') // 'helloWorld'
```

### `slugify(input)`

Converts a string into a URL-friendly slug. Handles Unicode via NFD normalization, strips diacritics, collapses whitespace/special characters into hyphens.

```ts
slugify('Hello World!') // 'hello-world'
slugify('Crème Brûlée') // 'creme-brulee'
slugify('  --foo  bar-- ') // 'foo-bar'
```

### `randomNumber(min, max)`

Generates a random integer between `min` and `max` (inclusive). Throws `TypeError` for non-finite values, `RangeError` if `min > max`.

```ts
randomNumber(1, 10) // e.g. 7
randomNumber(-5, 5) // e.g. -2
```

### `truncate(text, length, ellipsis?)`

Truncates text to a given length, breaking at the last word boundary. Default ellipsis is `'…'`.

```ts
truncate('Hello, beautiful world!', 13) // 'Hello,…'
truncate('Hello, beautiful world!', 13, '...') // 'Hello,...'
truncate('Short', 100) // 'Short'
```

### `formatCurrency(amount, locale?, currency?)`

Formats a number as a locale-aware currency string using `Intl.NumberFormat`. Defaults to `'en-US'` locale and `'USD'` currency.

```ts
formatCurrency(1234.5) // '$1,234.50'
formatCurrency(1234.5, 'de-DE', 'EUR') // '1.234,50 €'
formatCurrency(0) // '$0.00'
```

### `delay(ms)`

Returns a Promise that resolves after the specified milliseconds. Rejects with `RangeError` if `ms` is negative or non-finite.

```ts
await delay(1000) // waits 1 second

// Polling example
while (polling) {
  const data = await fetchData()
  await delay(5000)
}
```

### `copyToClipboard(text)`

Copies text to the system clipboard. Uses the modern `navigator.clipboard` API with a `document.execCommand('copy')` fallback. Returns a Promise resolving to `true` on success.

```ts
const ok = await copyToClipboard('Hello!')
if (ok) showToast('Copied!')
```

## `getDefaultDateRange`

This utility provides standardized date ranges for dashboards, reports, and date pickers. It uses Day.js for immutability and timezone safety.

### 2. Function Signature

```typescript
/**
 * @param mode - The range type: 'week' | 'month' | '3-months' | '6-months' | 'year' | 'last-week' | 'last-month'
 * @param maxDate - (Optional) Caps the end date (e.g., set to dayjs() to prevent future dates)
 * @param anchorDate - (Optional) The reference date for calculation (defaults to today)
 */
const range = getDefaultDateRange(mode, maxDate, anchorDate)
// Result
export interface DateRangeResult {
  startDate: string
  endDate: string
}
```

### 3. Logic & Behaviors

#### **A. The 7-Day "Smart Lookback"**

For **Calendar Modes** (`week`, `month`, `3-months`, `6-months`, `year`), if the current date is between the **1st and 7th** of the month, the utility automatically shifts the entire range back by one month.

- **Why?** This prevents dashboards from appearing "empty" at the start of a new month before data has been collected.

#### **B. Rolling vs. Calendar Windows**

The utility distinguishes between "Current Period" and "Last X Period":

| Mode             | Type     | Logic                        | Example (if today is March 24) |
| :--------------- | :------- | :--------------------------- | :----------------------------- |
| **`month`**      | Calendar | Full current month           | March 1 — March 31             |
| **`week`**       | Calendar | Full current week            | March 22 — March 28            |
| **`last-month`** | Rolling  | Last 30 days including today | Feb 23 — March 24              |
| **`last-week`**  | Rolling  | Last 7 days including today  | March 18 — March 24            |
| **`year`**       | Rolling  | Last 12 full months          | April 1 (Prev Year) — March 31 |
