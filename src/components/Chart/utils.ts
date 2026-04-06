// ─────────────────────────────────────────────
// Chart Utility Helpers
// ─────────────────────────────────────────────

/**
 * Default chart color palette — resolves from CSS variables when possible.
 * Produces vibrant, consistent colors that work in both light & dark modes.
 */
export const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-6)',
]

/** Fallback hex palette when CSS vars aren't available (e.g. canvas) */
export const CHART_COLORS_HEX = [
  '#6366f1', // indigo
  '#22c55e', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
]

/** Resolve a semantic color name to a CSS variable */
export function resolveColor(color: string): string {
  const map: Record<string, string> = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-info)',
    purple: '#8b5cf6',
    teal: '#14b8a6',
    orange: '#f97316',
    pink: '#ec4899',
    cyan: '#06b6d4',
  }
  return map[color] ?? color
}

/** Get color by index from palette (cycles) */
export function getColor(colors: string[], index: number): string {
  return colors[index % colors.length]
}

/** Format large numbers: 1200 -> 1.2k */
export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

/** Clamp a value between min and max */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/** Linearly interpolate */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Generate a smooth cubic bezier SVG path from a series of [x,y] points.
 * Uses Catmull-Rom to bezier conversion for a natural curve.
 */
export function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0][0]},${points[0][1]} L ${points[1][0]},${points[1][1]}`
  }

  const d: string[] = [`M ${points[0][0]},${points[0][1]}`]

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6

    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`)
  }

  return d.join(' ')
}

/** Generate a straight-line SVG path from a series of [x,y] points */
export function linearPath(points: [number, number][]): string {
  if (points.length === 0) return ''
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ')
}

/**
 * Build an SVG arc path for pie/donut slices.
 * @param cx Center X
 * @param cy Center Y
 * @param r  Outer radius
 * @param startAngle Degrees
 * @param endAngle   Degrees
 * @param innerR Inner radius (donut; 0 = filled pie)
 */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  innerR = 0
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const s = toRad(startAngle)
  const e = toRad(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  const x1 = cx + r * Math.cos(s)
  const y1 = cy + r * Math.sin(s)
  const x2 = cx + r * Math.cos(e)
  const y2 = cy + r * Math.sin(e)

  if (innerR <= 0) {
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
  }

  const ix1 = cx + innerR * Math.cos(e)
  const iy1 = cy + innerR * Math.sin(e)
  const ix2 = cx + innerR * Math.cos(s)
  const iy2 = cy + innerR * Math.sin(s)

  return [
    `M ${x1},${y1}`,
    `A ${r},${r} 0 ${largeArc} 1 ${x2},${y2}`,
    `L ${ix1},${iy1}`,
    `A ${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2}`,
    'Z',
  ].join(' ')
}

/** Nice Y-axis tick values for a given data range */
export function niceYTicks(min: number, max: number, count = 5): number[] {
  const range = max - min || 1
  const rough = range / (count - 1)
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)))
  const nice = [1, 2, 2.5, 5, 10].find((f) => f * magnitude >= rough) ?? 10
  const step = nice * magnitude
  const start = Math.floor(min / step) * step

  const ticks: number[] = []
  let t = start
  while (true) {
    ticks.push(parseFloat(t.toFixed(10)))
    if (t >= max) break
    t += step
  }
  return ticks
}

/** Ease-out cubic */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/** Animate from 0→1 using rAF, calling onProgress each frame */
export function animateProgress(
  duration: number,
  onProgress: (t: number) => void,
  onDone?: () => void
): () => void {
  let start: number | null = null
  let raf: number

  const step = (ts: number) => {
    if (start === null) start = ts
    const elapsed = ts - start
    const t = easeOutCubic(Math.min(elapsed / duration, 1))
    onProgress(t)
    if (elapsed < duration) {
      raf = requestAnimationFrame(step)
    } else {
      onDone?.()
    }
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}
