import { configState } from '@/core'
import dayjs, { Dayjs, OpUnitType } from 'dayjs'

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
 * slugify('Creme Brulee')       // 'creme-brulee'
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
 * Uses `Math.random()` -- not suitable for cryptographic purposes.
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
 * @param length Maximum character length (must be >= 0)
 * @param ellipsis The suffix appended when truncated (default: '...')
 * @returns The truncated string, or the original if already within the limit
 *
 * @example
 * truncate('Hello, beautiful world!', 13)         // 'Hello,...'
 * truncate('Hello, beautiful world!', 13, '...')   // 'Hello,...'
 * truncate('Short', 100)                           // 'Short'
 */
export const truncate = (text: string, length: number, ellipsis: string = '...'): string => {
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

export interface FormatNumberOptions {
  locale?: string
  numberFormat?: 'standard' | 'compact'
  currency?: string
}

export function formatNumber(
  amount: number | string,
  options: FormatNumberOptions = {}
): string {
  const num = Number(amount)
  if (!Number.isFinite(num)) return ''

  const locale = options.locale || 'en-US'
  const resolvedFormat = options.numberFormat || 'standard'

  const intlOptions: Intl.NumberFormatOptions = {}
  
  if (options.currency) {
    intlOptions.style = 'currency'
    intlOptions.currency = options.currency
  }

  if (resolvedFormat === 'compact') {
    intlOptions.notation = 'compact'
    intlOptions.compactDisplay = 'short'
  }

  return new Intl.NumberFormat(locale, intlOptions).format(num)
}

/**
 * Formats a numeric amount as a locale-aware currency string
 * using the `Intl.NumberFormat` API.
 *
 * Reads the default currency from the global VLite config (`configState`)
 * when no explicit `currency` argument is provided. Falls back to `'USD'`
 * if no global config value is set.
 *
 * @param amount The numeric value to format
 * @param options Object containing locale, currency, and format overrides
 * @returns The formatted currency string
 */
export const formatCurrency = (
  amount: number | string,
  options: FormatNumberOptions = {}
): string => {
  const num = Number(amount)
  if (!Number.isFinite(num)) return ''

  // Lazily import configState to avoid circular dependency issues at module load time.
  // configState is a singleton reactive object set up in core/config.ts.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const resolvedCurrency = options.currency || configState?.components?.price?.currency || 'USD'
  const resolvedFormat = options.numberFormat || configState?.components?.price?.numberFormat || 'standard'

  return formatNumber(num, {
    locale: options.locale,
    currency: resolvedCurrency,
    numberFormat: resolvedFormat,
  })
}

/**
 * Returns a Promise that resolves after the specified number of milliseconds.
 * Useful for artificial delays, polling intervals, or animation timing.
 *
 * @param ms Delay duration in milliseconds (must be >= 0)
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

/**
 * Copies the given text to the system clipboard.
 * Uses the modern `navigator.clipboard` API when available,
 * with a `document.execCommand('copy')` fallback for older browsers.
 *
 * @param text The string to copy to the clipboard
 * @returns A Promise that resolves to `true` on success, `false` on failure
 *
 * @example
 * const ok = await copyToClipboard('Hello!')
 * if (ok) showToast('Copied!')
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof text !== 'string') return false

  // Modern Clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to legacy fallback
    }
  }

  // Legacy fallback
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch {
    return false
  }
}

export type DateRangeMode =
  | 'week'
  | 'month'
  | '3-months'
  | '6-months'
  | 'year'
  | 'last-week'
  | 'last-month'

export interface DateRangeResult {
  startDate: string
  endDate: string
}

export const getDefaultDateRange = (
  mode: DateRangeMode = 'month',
  maxDate?: Dayjs | string | Date,
  anchorDate: Dayjs = dayjs()
): DateRangeResult => {
  // Use anchorDate (usually today) as the primary 'end' point for "Last X" modes
  let end: Dayjs = anchorDate
  let start: Dayjs

  // 1. Dynamic Lookback Logic (for Calendar-based modes)
  let targetDate = anchorDate
  if (['week', 'month', '3-months', '6-months', 'year'].includes(mode) && anchorDate.date() <= 7) {
    targetDate = anchorDate.subtract(1, 'month')
  }

  switch (mode) {
    case 'last-week':
      // ROLLING 7 DAYS: Ends today, starts 6 days ago
      start = anchorDate.subtract(6, 'day').startOf('day')
      end = anchorDate.endOf('day')
      break

    case 'last-month':
      // ROLLING 30 DAYS: Ends today, starts 29 days ago
      start = anchorDate.subtract(29, 'day').startOf('day')
      end = anchorDate.endOf('day')
      break

    case 'year':
      // ROLLING 12 MONTHS (Full month blocks)
      start = targetDate.subtract(11, 'month').startOf('month')
      end = targetDate.endOf('month')
      break

    case '6-months':
      start = targetDate.subtract(5, 'month').startOf('month')
      end = targetDate.endOf('month')
      break

    case '3-months':
      start = targetDate.subtract(2, 'month').startOf('month')
      end = targetDate.endOf('month')
      break

    case 'week':
      start = targetDate.startOf('week')
      end = targetDate.endOf('week')
      break

    case 'month':
    default:
      start = targetDate.startOf('month')
      end = targetDate.endOf('month')
      break
  }

  // 2. Max Date Constraint (Ensures we don't go into the future)
  if (maxDate) {
    const max = dayjs(maxDate)
    if (end.isAfter(max)) end = max
    if (start.isAfter(max)) start = max.startOf('day')
  }

  return {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  }
}

/**
 * Formats a time string into 12-hour format with AM/PM.
 *
 * @param time The time string in 24-hour format (e.g., '13:00')
 * @returns The formatted time string (e.g., '01:00 PM')
 */
export const formatAmPm = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  if (!hours || !minutes) return time

  const parsedTime = dayjs().hour(Number(hours)).minute(Number(minutes))
  // 'A' outputs AM/PM. If you want exactly 'Am'/'Pm', you can replace it, otherwise 'AM'/'PM' is standard.
  return parsedTime.isValid() ? parsedTime.format('hh:mm A') : time
}

/**
 * Formats a date with start and end times into a compact string.
 * Example: 'MM/DD/YYYY • 12:00 - 01:00 PM'
 * Uses the globally configured date format from `configState`.
 *
 * @param date The date to format
 * @param startTime The start time in 24-hour format (e.g., '12:00')
 * @param endTime The end time in 24-hour format (e.g., '13:00')
 * @returns The formatted date and time string
 */
export const formatSchedule = (
  date: string | Date | Dayjs,
  startTime: string,
  endTime: string
): string => {
  const resolvedFormat = configState?.components?.datetime?.format || 'MMM DD, YYYY'
  const formattedDate = date ? dayjs(date).format(resolvedFormat) : ''

  let formattedStartTime = startTime
  if (startTime) {
    const [startHours, startMinutes] = startTime.split(':')
    if (startHours && startMinutes) {
      const parsedStart = dayjs().hour(Number(startHours)).minute(Number(startMinutes))
      if (parsedStart.isValid()) {
        formattedStartTime = parsedStart.format('hh:mm')
      }
    }
  }

  let formattedEndTime = endTime
  if (endTime) {
    formattedEndTime = formatAmPm(endTime)
  }

  // If no time is provided, return just the date
  if (!startTime && !endTime) return formattedDate

  // If date is empty, return just the times
  if (!formattedDate) return `${formattedStartTime} - ${formattedEndTime}`

  return `${formattedDate} • ${formattedStartTime} - ${formattedEndTime}`
}

// ----------------------------------------------------------------------
// ISO Date Utility Functions
// ----------------------------------------------------------------------

export const toISO = (date?: string | Date | Dayjs): string =>
  dayjs(date || undefined).toISOString()
export const toLocalISO = (date?: string | Date | Dayjs): string =>
  dayjs(date || undefined).format('YYYY-MM-DDTHH:mm:ss.SSSZ')

export const getToday = (): string => dayjs().toISOString()
export const getYesterday = (): string => dayjs().subtract(1, 'day').toISOString()
export const getTomorrow = (): string => dayjs().add(1, 'day').toISOString()
export const getUpcoming = (days = 7): string => dayjs().add(days, 'day').toISOString()

export const getNextMonth = (): string => dayjs().add(1, 'month').toISOString()
export const getPrevMonth = (): string => dayjs().subtract(1, 'month').toISOString()

export const getYear = (): string => dayjs().toISOString()
export const getNextYear = (): string => dayjs().add(1, 'year').toISOString()
export const getPrevYear = (): string => dayjs().subtract(1, 'year').toISOString()

// ----------------------------------------------------------------------
// General Date Formatter
// ----------------------------------------------------------------------

/**
 * Formats a given date/time value using the global VLite configuration or an explicit format.
 * Automatically handles time-only strings (e.g., '13:00').
 *
 * @param value The date/time to format
 * @param format Optional explicit format string overriding the global config.
 * @param type The type of date/time ('date' | 'dateTime' | 'time') to determine default formats.
 */
const TIME24_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/
const TIME12_REGEX = /^(0?[1-9]|1[0-2]):([0-5]\d)(:([0-5]\d))?\s*(AM|PM|am|pm)$/

/**
 * Checks if a string is a standalone time (24h or 12h format) rather than a full date.
 */
export const isPureTimeString = (val: string): boolean => {
  const trimmed = val.trim()
  return TIME24_REGEX.test(trimmed) || TIME12_REGEX.test(trimmed)
}

/**
 * Formats a given date/time value using the global VLite configuration or an explicit format.
 * Automatically handles time-only strings (e.g., '13:00' or '01:00 PM').
 *
 * @param value The date/time to format
 * @param format Optional explicit format string overriding the global config.
 * @param type The type of date/time ('date' | 'dateTime' | 'time') to determine default formats.
 */
export const formatDate = (
  value: string | number | Date | Dayjs | null | undefined,
  format?: string,
  type?: 'date' | 'dateTime' | 'time'
): string => {
  if (value === null || value === undefined || value === '') return '--'

  const baseFormat = configState?.components?.datetime?.format || 'MM/DD/YYYY'

  // 1. Auto-detect pure time strings like "13:00" or "01:10 PM"
  if (typeof value === 'string' && isPureTimeString(value)) {
    const d = parseDateTime(value)
    if (d.isValid()) {
      const timeFormat = format || (type === 'time' ? 'hh:mm A' : 'hh:mm A')
      return d.format(timeFormat)
    }
  }

  // 2. Resolve final format for dates and dateTimes
  let resolvedFormat = format
  if (!resolvedFormat) {
    if (type === 'dateTime') {
      resolvedFormat = `${baseFormat} hh:mm A`
    } else {
      // Default to strict date (e.g. 'MM/DD/YYYY')
      resolvedFormat = baseFormat
    }
  }

  const d = parseDateTime(value)
  if (!d.isValid()) return String(value)

  return d.format(resolvedFormat)
}

// ----------------------------------------------------------------------
// Date/Time Validations
// ----------------------------------------------------------------------

/**
 * Parses a string, number, or Date into a Dayjs object.
 * Automatically handles pure time strings (e.g., '13:00' -> '1970-01-01T13:00:00' or '1:00 PM') for accurate time comparisons.
 */
export const parseDateTime = (
  val: string | number | Date | Dayjs | null | undefined
): dayjs.Dayjs => {
  if (typeof val === 'string') {
    const trimmed = val.trim()

    // 24-hour time handling
    if (TIME24_REGEX.test(trimmed)) {
      const parts = trimmed.split(':')
      const hh = parts[0].padStart(2, '0')
      const mm = parts[1]
      const ss = parts[2] || '00'
      return dayjs(`1970-01-01T${hh}:${mm}:${ss}`)
    }

    // 12-hour time handling
    const ampmMatch = trimmed.match(TIME12_REGEX)
    if (ampmMatch) {
      let hh = parseInt(ampmMatch[1], 10)
      const mm = ampmMatch[2]
      const ss = ampmMatch[4] || '00'
      const modifier = ampmMatch[5].toUpperCase()

      if (hh === 12 && modifier === 'AM') hh = 0
      else if (hh < 12 && modifier === 'PM') hh += 12

      const hhStr = hh.toString().padStart(2, '0')
      return dayjs(`1970-01-01T${hhStr}:${mm}:${ss}`)
    }
  }
  return dayjs(val || undefined)
}

/**
 * Validates that an end time/date is after a start time/date.
 * By default, dates can be exactly the same day (start <= end), but pure time strings (e.g., '13:00')
 * strictly require the end time to be greater than the start time (start < end).
 *
 * @param startTime The start date/time
 * @param endTime The end date/time
 * @param allowSame Optional. Explicitly allow or disallow start and end to be exactly the same (overrides auto-detection).
 * @returns true if the range is valid (end >= start for dates, end > start for times)
 */
export const isValidTimeRange = (
  startTime: string | number | Date | Dayjs | null | undefined,
  endTime: string | number | Date | Dayjs | null | undefined,
  allowSame?: boolean
): boolean => {
  // Prevent zero-epoch bugs by checking explicit emptiness over truthiness
  if (
    startTime === null ||
    startTime === undefined ||
    startTime === '' ||
    endTime === null ||
    endTime === undefined ||
    endTime === ''
  ) {
    return true
  }

  let canBeSame = allowSame !== undefined ? allowSame : true

  // Auto-detect pure time strings to default to strictly greater (allowSame = false)
  if (allowSame === undefined && typeof startTime === 'string' && typeof endTime === 'string') {
    if (isPureTimeString(startTime) && isPureTimeString(endTime)) {
      canBeSame = false
    }
  }

  const start = parseDateTime(startTime)
  const end = parseDateTime(endTime)

  if (!start.isValid() || !end.isValid()) return false

  return canBeSame ? end.isSame(start) || end.isAfter(start) : end.isAfter(start)
}
