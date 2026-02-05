/**
 * Deep merges two objects.
 * Sources overwrite target properties.
 * Arrays are replaced, not concatenated (usually desired for state updates).
 */
export function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') {
    return source
  }

  if (!target || typeof target !== 'object') {
    return { ...source }
  }

  const result = { ...target }

  Object.keys(source).forEach((key) => {
    const targetValue = result[key]
    const sourceValue = source[key]

    if (Array.isArray(sourceValue)) {
      // Replace arrays
      result[key] = [...sourceValue]
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      targetValue &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      // Recursive merge
      result[key] = deepMerge(targetValue, sourceValue)
    } else {
      // Primitive or new object overwrites
      result[key] = sourceValue
    }
  })

  return result
}
