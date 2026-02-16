export type ProgressBarType = 'linear' | 'circular'
export type ProgressBarVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'gradient'
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ProgressBarProps {
  /**
   * Current value (0-100)
   */
  modelValue?: number
  /**
   * Visual type of the progress bar
   * @default 'linear'
   */
  type?: ProgressBarType
  /**
   * Color theme variant
   * @default 'primary'
   */
  variant?: ProgressBarVariant
  /**
   * Size preset
   * @default 'md'
   */
  size?: ProgressBarSize
  /**
   * Show value label
   * @default false
   */
  showValue?: boolean
  /**
   * Custom label text (overrides percentage)
   */
  label?: string
  /**
   * Custom height for linear bar (e.g. '10px', 20)
   * Overrides size preset height
   */
  height?: string | number
  /**
   * Width/Diameter for circular bar (e.g. '120px', 100)
   * Overrides size preset width
   */
  width?: string | number
  /**
   * Stroke width for circular bar
   */
  strokeWidth?: number
  /**
   * Enable striped background (Linear only)
   * @default false
   */
  striped?: boolean
  /**
   * Animate stripes (Linear only)
   * @default false
   */
  animated?: boolean
  /**
   * Indeterminate state (loading without specific value)
   * @default false
   */
  indeterminate?: boolean
  /**
   * Custom color (hex/rgb) - overrides variant
   */
  color?: string
  /**
   * Custom track color
   */
  trackColor?: string
  /**
   * Border radius class
   * @default 'rounded-full'
   */
  rounded?: string
}
