export type Direction = 'top' | 'bottom' | 'left' | 'right'
export type Easing = 'linear' | 'smooth'
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export interface FadeOverlayProps {
  // Shared
  /** Which edge the overlay anchors to and fades toward. @default 'bottom' */
  direction?: Direction

  /**
   * How much of the parent container the overlay covers.
   * Accepts any CSS length: '40%', '200px', '50vh'.
   * @default '100%'
   */
  coverage?: string | number

  /**
   * Where the transparent end of the gradient begins, as a percentage
   * of the overlay's own coverage area.
   * 0% = starts fading from the very edge of the overlay.
   * @default '0%'
   */
  fadeStart?: string | number

  /**
   * Where the opaque end of the gradient finishes, as a percentage
   * of the overlay's own coverage area.
   * 100% = fully opaque at the far edge of the coverage area.
   * @default '100%'
   */
  fadeEnd?: string | number

  /**
   * Overall opacity of the entire overlay element.
   * @default 1
   */
  opacity?: string | number

  /** CSS z-index. @default 10 */
  zIndex?: string | number

  /** CSS mix-blend-mode applied to the overlay element. */
  blendMode?: BlendMode

  /**
   * Gradient easing curve.
   * - 'linear'  — simple two-stop linear ramp
   * - 'smooth'  — 13-stop Material Design scrim curve; eliminates the
   *               perceptual mid-point grey smear of a linear fade
   * @default 'smooth'
   */
  easing?: Easing

  // Scrim-mode (no blur prop)

  /**
   * The opaque color the gradient fades toward.
   *
   * Scrim mode  → the solid color at the fully-opaque gradient stop.
   * Blur mode   → the tint color mixed over the blurred content.
   *
   * @default '#000000'
   */
  color?: string

  // Blur-mode (blur prop present)

  /**
   * Blur radius. Presence of this prop activates blur mode.
   * - number → treated as px (e.g. 16 → '16px')
   * - string → used as-is (e.g. '1rem')
   *
   * Blur mode variants:
   * - Pure vibrancy (macOS):   blur=16, no tintOpacity
   * - Tinted frost (iOS):      blur=16, color='#ffffff', tintOpacity=0.25
   * - Cinematic dark:          blur=24, color='#000000', tintOpacity=0.55
   */
  blur?: number | string

  /**
   * Opacity of the color tint layer in blur mode (0–1).
   * 0   → pure backdrop blur, no color tint (macOS vibrancy)
   * 0.3 → frosted glass with visible tint
   * 0.6 → cinematic / heavily tinted
   * @default 0
   */
  tintOpacity?: number
}
