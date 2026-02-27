import { useLocalStorage, type UseStorageOptions } from '@vueuse/core'

/**
 * Reusable function to manage persistent state in local storage.
 * @param key Local storage key. Will be automatically prefixed with 'builto-'.
 * @param initialValue The default value if no value exists in storage.
 * @param options Additional options for useLocalStorage.
 */
export function usePersistentState<T>(
	key: string,
	initialValue: T,
	options?: UseStorageOptions<T>,
) {
	return useLocalStorage<T>(`builto-${key}`, initialValue, options)
}
