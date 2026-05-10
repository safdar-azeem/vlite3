<script setup lang="ts">
import { computed } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = 'top' | 'bottom' | 'left' | 'right'
type Easing = 'linear' | 'smooth'
type BlendMode =
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
  // ── Shared ──────────────────────────────────────────────────────────────────

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

  // ── Scrim-mode (no blur prop) ────────────────────────────────────────────────
  //
  // When `blur` is not provided, the component renders a pure CSS gradient.
  // `color` is the opaque end of the gradient.
  // Use '#000000' for image/card scrims, 'var(--color-background)' for scroll fades.

  /**
   * The opaque color the gradient fades toward.
   *
   * Scrim mode  → the solid color at the fully-opaque gradient stop.
   * Blur mode   → the tint color mixed over the blurred content.
   *
   * @default '#000000'
   */
  color?: string

  // ── Blur-mode (blur prop present) ────────────────────────────────────────────
  //
  // When `blur` is provided, the component switches to backdrop-filter mode.
  // The gradient becomes a mask that shapes the blur region, not a painted color.
  // `color` + `tintOpacity` control the optional tint layer painted over the blur.

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

// ─── Props & defaults ─────────────────────────────────────────────────────────

const props = withDefaults(defineProps<FadeOverlayProps>(), {
  direction: 'bottom',
  coverage: '100%',
  fadeStart: '0%',
  fadeEnd: '100%',
  color: '#000000',
  easing: 'smooth',
  opacity: 1,
  zIndex: 10,
  tintOpacity: 0,
})

// ─── Mode detection ───────────────────────────────────────────────────────────

/** Blur mode is active if and only if the `blur` prop is explicitly provided. */
const isBlurMode = computed(() => props.blur !== undefined && props.blur !== null)

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Parse '40%' | 40 → 40 */
function parsePct(val: string | number): number {
  if (typeof val === 'number') return val
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

/** Resolve blur prop to a CSS value string. */
const blurCSS = computed((): string => {
  if (!isBlurMode.value) return ''
  if (typeof props.blur === 'number') return `${props.blur}px`
  const s = String(props.blur).trim()
  // Bare numeric string from v-model (e.g. "16") → append px.
  // Already-unit string (e.g. "1rem", "12px") → use as-is.
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s
})

// ─── Gradient builder ─────────────────────────────────────────────────────────
//
// WHY color-mix INSTEAD OF rgba():
//   Fading `rgba(0,0,0,0)` to `rgba(0,0,0,1)` in sRGB produces a visually grey
//   midpoint because the alpha channel is composited over white at each stop.
//   `color-mix(in srgb, COLOR N%, transparent)` keeps the color mathematically
//   correct at every opacity level, eliminating the grey dead zone.
//   This is especially visible on Safari where premultiplied alpha is more aggressive.
//
// WHY 13 STOPS (smooth mode):
//   The human visual system perceives brightness logarithmically. A linear
//   opacity ramp looks like it "hits" suddenly at 50%. The Material Design scrim
//   opacities are derived from a cubic easing curve and distribute perceptual
//   weight evenly across the fade, producing a buttery transition.

const SCRIM_OPACITIES = [0, 6.5, 14, 23.5, 34.5, 47, 59, 70, 79, 87, 93, 97, 100] as const

function buildGradient(
  cssDirection: string,
  color: string,
  startPct: number,
  endPct: number,
  easing: Easing
): string {
  if (easing === 'linear') {
    // Simple two-stop. Useful for scroll-edge fades where subtlety > accuracy.
    return `linear-gradient(${cssDirection}, transparent ${startPct}%, ${color} ${endPct}%)`
  }

  // 13-stop smooth scrim.
  const stops = SCRIM_OPACITIES.map((opacity, i) => {
    const progress = i / (SCRIM_OPACITIES.length - 1)
    const pos = (startPct + (endPct - startPct) * progress).toFixed(2)
    // color-mix(in srgb, COLOR 0%, transparent) = fully transparent
    // color-mix(in srgb, COLOR 100%, transparent) = fully opaque color
    return `color-mix(in srgb, ${color} ${opacity}%, transparent) ${pos}%`
  })

  return `linear-gradient(${cssDirection}, ${stops.join(', ')})`
}

// ─── CSS direction maps ───────────────────────────────────────────────────────

const DIR_TO_CSS: Record<Direction, string> = {
  top: 'to top',
  bottom: 'to bottom',
  left: 'to left',
  right: 'to right',
}

// WHY the mask direction MATCHES (not reverses) the overlay direction:
//
//   The overlay element is ANCHORED at the named edge.
//   direction='bottom' → element sits at the bottom of the container, bottom: 0.
//
//   mask-image: black = element visible, transparent = element hidden.
//   We want the blur to be strongest at the anchored edge and fade toward
//   the opposite edge (where the element "disappears" into content).
//
//   direction='bottom':
//     - strongest at element's bottom edge → mask must be BLACK at the bottom
//     - fades away toward element's top    → mask must be TRANSPARENT at the top
//     - gradient 'to bottom': transparent at top → black at bottom ✓
//     - same as cssDir = 'to bottom' ✓
//
//   direction='top':
//     - strongest at element's top edge   → BLACK at top
//     - fades toward bottom               → TRANSPARENT at bottom
//     - gradient 'to top': transparent at bottom → black at top ✓
//     - same as cssDir = 'to top' ✓
//
//   Reversing the direction was the bug: it made the blur appear at the
//   wrong end of the element (middle/far edge instead of the anchored edge).

// ─── Size & position styles per direction ─────────────────────────────────────

function sizeStyles(direction: Direction, coverage: string): Record<string, string | number> {
  const isVertical = direction === 'top' || direction === 'bottom'
  return isVertical
    ? { left: 0, right: 0, height: coverage, [direction]: 0 }
    : { top: 0, bottom: 0, width: coverage, [direction]: 0 }
}

// ─── Main computed styles ─────────────────────────────────────────────────────

const overlayStyles = computed(() => {
  const coverageVal =
    typeof props.coverage === 'number' ? `${props.coverage}%` : (props.coverage as string)

  const startPct = parsePct(props.fadeStart)
  const endPct = parsePct(props.fadeEnd)
  const cssDir = DIR_TO_CSS[props.direction]

  // Base styles shared across both modes
  const base: Record<string, string | number> = {
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: 'inherit',
    opacity: props.opacity,
    zIndex: props.zIndex,
    ...sizeStyles(props.direction, coverageVal),
    ...(props.blendMode ? { mixBlendMode: props.blendMode } : {}),
  }

  // ── BLUR MODE ──────────────────────────────────────────────────────────────
  if (isBlurMode.value) {
    //
    // Rendering model:
    //   1. backdrop-filter: blur() — blurs everything behind the element.
    //      This IS the vibrancy effect. The image's blurred pixels provide the color.
    //
    //   2. background tint — a semi-transparent color layer on top of the blur.
    //      tintOpacity=0    → pure vibrancy, no tint (macOS)
    //      tintOpacity=0.25 → frosted glass (iOS sheets)
    //      tintOpacity=0.55 → cinematic dark overlay
    //
    //   3. mask-image — shapes the blur region with a smooth gradient.
    //      Uses the SAME direction as the overlay so the blur is strongest
    //      at the anchored edge and fades toward the opposite edge.
    //      Uses 'black' as the opaque mask color (not the tint color).
    //
    // The tint background uses color-mix to compose `color` at `tintOpacity`
    // against transparent, keeping the backdrop-filter visible through it.

    const tintPct = Math.round(props.tintOpacity * 100)
    const tintBg =
      tintPct > 0 ? `color-mix(in srgb, ${props.color} ${tintPct}%, transparent)` : 'transparent'

    const maskGradient = buildGradient(cssDir, 'black', startPct, endPct, props.easing)

    return {
      ...base,
      background: tintBg,
      backdropFilter: `blur(${blurCSS.value})`,
      WebkitBackdropFilter: `blur(${blurCSS.value})`,
      maskImage: maskGradient,
      WebkitMaskImage: maskGradient,
    }
  }

  // ── SCRIM MODE ─────────────────────────────────────────────────────────────
  //
  // Pure gradient painted over content. No blur, no backdrop interaction.
  // `color` is the opaque end of the gradient.
  //
  // Use cases:
  //   - Image/card scrims:    color='#000000'
  //   - Scroll edge fades:    color='var(--color-background)'
  //   - Hero sections:        color='#000000', coverage='60%', fadeStart='20%'
  return {
    ...base,
    background: buildGradient(cssDir, props.color, startPct, endPct, props.easing),
  }
})
</script>

<template>
  <div :style="overlayStyles" aria-hidden="true" class="vlite-fade-overlay" />
</template>
