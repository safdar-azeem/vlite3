<script setup lang="ts">
import { computed } from 'vue'

export interface FadeOverlayProps {
  /** Which edge to fade toward */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /** How much of the container the overlay covers */
  coverage?: string | number
  /** Where the transparent part of the gradient starts (0% = edge of overlay) */
  fadeStart?: string | number
  /** Where the opaque/masked part of the gradient ends (100% = full coverage end) */
  fadeEnd?: string | number
  /**
   * Blur amount for a frosted-glass effect.
   * true → 8px, a number → px, a string → used as-is (e.g. "12px")
   */
  blur?: boolean | string | number
  /** CSS mix-blend-mode */
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
  /** Overall opacity of the overlay (0–1) */
  opacity?: string | number
  /** CSS z-index */
  zIndex?: string | number
  /** Solid/gradient color. Defaults to the page background color. */
  color?: string
}

const props = withDefaults(defineProps<FadeOverlayProps>(), {
  direction: 'bottom',
  coverage: '20%',
  fadeStart: '0%',
  fadeEnd: '100%',
  color: 'var(--color-background)',
})

/**
 * Resolve blur prop to a CSS pixel string, or empty string if disabled.
 */
const blurValue = computed(() => {
  if (!props.blur) return ''
  if (props.blur === true) return '8px'
  if (typeof props.blur === 'number') return `${props.blur}px`
  return props.blur as string
})

const overlayStyles = computed(() => {
  const coverageValue = typeof props.coverage === 'number' ? `${props.coverage}%` : props.coverage
  const start = typeof props.fadeStart === 'number' ? `${props.fadeStart}%` : props.fadeStart
  const end = typeof props.fadeEnd === 'number' ? `${props.fadeEnd}%` : props.fadeEnd

  // Map direction to the CSS gradient direction
  // "direction" is the edge being faded — the gradient runs *toward* that edge.
  const dirMap: Record<string, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  }
  const gradientDir = dirMap[props.direction!] || 'to bottom'

  // Size / position the overlay at the correct edge
  const sizeStyles =
    props.direction === 'top' || props.direction === 'bottom'
      ? { left: 0, right: 0, height: coverageValue, [props.direction!]: 0 }
      : { top: 0, bottom: 0, width: coverageValue, [props.direction!]: 0 }

  const base: Record<string, string | number> = {
    position: 'absolute',
    pointerEvents: 'none',
    opacity: props.opacity ?? 1,
    zIndex: props.zIndex ?? 10,
    ...(props.blendMode ? { mixBlendMode: props.blendMode as any } : {}),
    ...sizeStyles,
  }

  if (blurValue.value) {
    // Frosted-glass mode:
    // • backdrop-filter blurs whatever is behind the overlay.
    // • mask-image fades the overlay itself so the blur tapers off smoothly.
    //
    // The mask gradient must run from OPAQUE (black) at the covered edge
    // to TRANSPARENT at the open edge, i.e. the opposite of the content gradient.
    // We achieve this simply by reversing start/end in the mask.
    //
    // Example – direction="bottom":
    //   gradientDir = "to bottom"
    //   mask: black at 0% (bottom of overlay = bottom of container) → transparent at 100% (top of overlay)
    //   So: linear-gradient(to bottom, transparent <start>, black <end>)
    //   which means the overlay is transparent at its top edge and opaque at its bottom edge ✓

    const maskGradient = `linear-gradient(${gradientDir}, transparent ${start}, black ${end})`

    // Use a semi-transparent version of the color so the blur effect is visible.
    const bgColor =
      props.color === 'var(--color-background)'
        ? 'color-mix(in srgb, var(--color-background) 60%, transparent)'
        : props.color

    return {
      ...base,
      background: bgColor,
      backdropFilter: `blur(${blurValue.value})`,
      WebkitBackdropFilter: `blur(${blurValue.value})`,
      maskImage: maskGradient,
      WebkitMaskImage: maskGradient,
    }
  }

  // Normal gradient fade mode:
  // Gradient runs from transparent (open side) → solid color (covered edge).
  const bgGradient = `linear-gradient(${gradientDir}, transparent ${start}, ${props.color} ${end})`

  return {
    ...base,
    background: bgGradient,
  }
})
</script>

<template>
  <div :style="overlayStyles" aria-hidden="true" />
</template>
