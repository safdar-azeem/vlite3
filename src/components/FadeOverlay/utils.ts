import type { Direction, Easing } from './types'

export function parsePct(val: string | number): number {
  if (typeof val === 'number') return val
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

export const SCRIM_OPACITIES = [0, 6.5, 14, 23.5, 34.5, 47, 59, 70, 79, 87, 93, 97, 100] as const

export function buildGradient(
  cssDirection: string,
  color: string,
  startPct: number,
  endPct: number,
  easing: Easing
): string {
  if (easing === 'linear') {
    return `linear-gradient(${cssDirection}, transparent ${startPct}%, ${color} ${endPct}%)`
  }

  const stops = SCRIM_OPACITIES.map((opacity, i) => {
    const progress = i / (SCRIM_OPACITIES.length - 1)
    const pos = (startPct + (endPct - startPct) * progress).toFixed(2)
    return `color-mix(in srgb, ${color} ${opacity}%, transparent) ${pos}%`
  })

  return `linear-gradient(${cssDirection}, ${stops.join(', ')})`
}

export const DIR_TO_CSS: Record<Direction, string> = {
  top: 'to top',
  bottom: 'to bottom',
  left: 'to left',
  right: 'to right',
}

export function sizeStyles(direction: Direction, coverage: string): Record<string, string | number> {
  const isVertical = direction === 'top' || direction === 'bottom'
  return isVertical
    ? { left: 0, right: 0, height: coverage, [direction]: 0 }
    : { top: 0, bottom: 0, width: coverage, [direction]: 0 }
}
