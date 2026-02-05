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
