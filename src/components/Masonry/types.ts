export interface MasonryProps {
  /**
   * Array of items to render
   */
  data: any[]

  /**
   * Column configuration object.
   * Can be number keys (width in px) or string keys ('sm', 'md', 'lg', 'xl', '2xl').
   * Values are element counts.
   * Example: { default: 1, md: 2, lg: 3 }
   */
  cols?: number | Record<string | number, number>

  /**
   * Gap between columns and rows (in px or tailwind class number equivalent if implemented manually).
   * For simplicity here, we assume it's a number representing pixels or 'rem' spacing via style,
   * or a simple numeric multiplier for standard spacing.
   * Defaults to 16 (px) or similar.
   */
  gap?: number

  /**
   * Element used for the root container
   */
  tag?: string

  /**
   * Key property name in data items to use as unique key.
   * Defaults to 'id'. If not found, uses index (not recommended for large lists).
   */
  itemKey?: string
}

/**
 * Breakpoint values mapping in pixels
 */
export const MASONRY_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
