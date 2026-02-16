/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A new debounced function
 */
export const debounce = (fn: Function, delay: number) => {
  let timeoutId: any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function getUniqueId() {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0') // 4-byte timestamp
  const randomValue = Array.from(crypto.getRandomValues(new Uint8Array(5)))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('') // 5-byte random value
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0') // 3-byte counter

  return timestamp + randomValue + counter
}

export const isAppleDevice = (): boolean => {
  const isMac =
    /Mac|MacIntel|MacPPC/.test(navigator.platform) && !/iPad|iPhone|iPod/.test(navigator.platform)
  const isIphone = /iPhone/.test(navigator.platform) || /iPhone/.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  return isMac || isIphone || isSafari
}

export const downloadFile = async (fileUrl = '', fileName = 'file') => {
  try {
    const fileNameIs = fileName || 'file'

    const cleanFileName = fileUrl?.includes('.application/')
      ? `${fileNameIs}.${fileUrl?.split('/').pop()}`
      : `${fileNameIs}.${fileUrl?.split('.').pop()}`

    // Fetch the file as a blob
    const response = await fetch(fileUrl)
    const blob = await response.blob()

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob)

    // Create and configure the download link
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', cleanFileName)

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download error:', error)
  }
}

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value === 'number' && value === 0) return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value).length === 0 || Object.values(value).every(isEmpty)
  }
  return false
}

export function removeExtraProperties(data: any, propertiesToRemove: string[]): any {
  if (!data || typeof data !== 'object') return data

  return Array.isArray(data)
    ? data.map((item) => removeExtraProperties(item, propertiesToRemove))
    : Object.entries(data).reduce(
        (acc, [key, value]) => {
          if (!propertiesToRemove.includes(key)) {
            acc[key] = removeExtraProperties(value, propertiesToRemove)
          }
          return acc
        },
        {} as Record<string, any>
      )
}

export function flattenArray(arr: any[]): any[] {
  return arr.reduce((flat: any[], item) => {
    if (Array.isArray(item)) {
      return flat.concat(flattenArray(item))
    }
    if (item && typeof item === 'object') {
      return flat.concat(
        Object?.values(item)?.flatMap?.((v) => (typeof v === 'object' ? flattenArray([v]) : [v]))
      )
    }
    return flat.concat(item)
  }, [])
}

export const capitalize = (str) =>
  typeof str == 'string' ? str?.replace(/(^\w|[.!?]\s+\w)/g, (letter) => letter.toUpperCase()) : str

export const camelCase = (str) => {
  if (!str) return ''
  if (typeof str !== 'string') return ''
  return str[0].toLowerCase() + str.slice(1)
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: ThisParameterType<T> | null = null

  const later = () => {
    if (lastArgs && lastThis) {
      func.apply(lastThis, lastArgs)
      lastArgs = null
      lastThis = null
      timeout = setTimeout(later, wait)
    } else {
      timeout = null
    }
  }

  return (...args: Parameters<T>) => {
    if (!timeout) {
      func.apply(this, args)
      timeout = setTimeout(later, wait)
    } else {
      lastArgs = args
      lastThis = this
    }
  }
}

/**
 * Converts a string into a URL-friendly slug.
 * Handles Unicode characters via NFD normalization, strips diacritics,
 * collapses whitespace and special characters into single hyphens,
 * and trims leading/trailing hyphens.
 *
 * @param input The string to slugify
 * @returns A lowercase, hyphen-separated slug
 *
 * @example
 * slugify('Hello World!')       // 'hello-world'
 * slugify('Crème Brûlée')       // 'creme-brulee'
 * slugify('  --foo  bar-- ')    // 'foo-bar'
 */
export const slugify = (input: string): string => {
  if (typeof input !== 'string') return ''
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a random integer between `min` and `max` (inclusive).
 * Uses `Math.random()` — not suitable for cryptographic purposes.
 *
 * @param min The lower bound (inclusive)
 * @param max The upper bound (inclusive)
 * @returns A random integer in the range [min, max]
 * @throws {TypeError} If `min` or `max` is not a finite number
 * @throws {RangeError} If `min` is greater than `max`
 *
 * @example
 * randomNumber(1, 10)  // e.g. 7
 * randomNumber(-5, 5)  // e.g. -2
 */
export const randomNumber = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('Both min and max must be finite numbers')
  }
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`)
  }
  const lower = Math.ceil(min)
  const upper = Math.floor(max)
  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

/**
 * Truncates text to a given length, breaking at the last word boundary
 * to avoid mid-word cuts.
 *
 * @param text The string to truncate
 * @param length Maximum character length (must be ≥ 0)
 * @param ellipsis The suffix appended when truncated (default: `'…'`)
 * @returns The truncated string, or the original if already within the limit
 *
 * @example
 * truncate('Hello, beautiful world!', 13)         // 'Hello,…'
 * truncate('Hello, beautiful world!', 13, '...')   // 'Hello,...'
 * truncate('Short', 100)                           // 'Short'
 */
export const truncate = (text: string, length: number, ellipsis: string = '…'): string => {
  if (typeof text !== 'string') return ''
  if (!Number.isFinite(length) || length < 0) return text
  if (text.length <= length) return text

  const maxLen = length - ellipsis.length
  if (maxLen <= 0) return ellipsis.slice(0, length)

  const truncated = text.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  const result = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated

  return result + ellipsis
}

/**
 * Formats a numeric amount as a locale-aware currency string
 * using the `Intl.NumberFormat` API.
 *
 * @param amount The numeric value to format
 * @param locale A BCP 47 locale string (default: `'en-US'`)
 * @param currency An ISO 4217 currency code (default: `'USD'`)
 * @returns The formatted currency string
 *
 * @example
 * formatCurrency(1234.5)                  // '$1,234.50'
 * formatCurrency(1234.5, 'de-DE', 'EUR')  // '1.234,50 €'
 * formatCurrency(0)                       // '$0.00'
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  if (!Number.isFinite(amount)) return ''
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Returns a Promise that resolves after the specified number of milliseconds.
 * Useful for artificial delays, polling intervals, or animation timing.
 *
 * @param ms Delay duration in milliseconds (must be ≥ 0)
 * @returns A Promise that resolves to `void` after the delay
 *
 * @example
 * await delay(1000) // waits 1 second
 *
 * // Sequential polling
 * while (polling) {
 *   const data = await fetchData()
 *   await delay(5000)
 * }
 */
export const delay = (ms: number): Promise<void> => {
  if (!Number.isFinite(ms) || ms < 0) {
    return Promise.reject(new RangeError('Delay must be a non-negative finite number'))
  }
  return new Promise((resolve) => setTimeout(resolve, ms))
}
