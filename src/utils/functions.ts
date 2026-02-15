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
