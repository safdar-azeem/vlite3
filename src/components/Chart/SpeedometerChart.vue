<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { resolveColor, animateProgress, clamp } from './utils'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type SpeedometerVariant = 'classic' | 'modern' | 'sport' | 'minimal'

export interface SpeedometerChartProps {
  // ── Core data ──────────────────────────────────
  /** Current speed / value */
  value: number
  /** Minimum value on the scale (default 0) */
  min?: number
  /** Maximum value on the scale (default 240) */
  max?: number

  // ── Visual variant ────────────────────────────
  /**
   * classic — Traditional car speedometer with full tick marks and numbers
   * modern — Sleek dark-themed speedometer with glowing accents
   * sport  — Racing-style with red-zone, aggressive ticks
   * minimal — Clean minimal speedometer with fewer markings
   */
  variant?: SpeedometerVariant

  // ── Dimensions ───────────────────────────────
  /** SVG bounding diameter in px */
  size?: number
  /** Opening gap at the bottom, in degrees (default 60) */
  gapAngle?: number

  // ── Colors ───────────────────────────────────
  /** Semantic color name ('primary', 'success', etc.) or any CSS color */
  color?: string
  /** Needle color — defaults to 'danger' for sport, color for others */
  needleColor?: string

  // ── Scale ────────────────────────────────────
  /** Step between major tick labels (e.g. 20 → 0, 20, 40, 60, ...) */
  majorStep?: number
  /** Number of minor ticks between major ticks */
  minorTicks?: number
  /** Unit label (e.g. 'km/h', 'mph', 'RPM') */
  unit?: string

  // ── Labels ───────────────────────────────────
  /** Show the current value in the center */
  showValue?: boolean
  /** Custom value formatter */
  formatValue?: (v: number) => string
  /** Primary label (e.g. vehicle model or metric name) */
  label?: string

  // ── Red Zone ─────────────────────────────────
  /** Start of the danger zone (absolute value). Rendered in red/danger color. */
  redZoneStart?: number

  // ── Animation ────────────────────────────────
  /** Animate needle sweep on mount and value change */
  animate?: boolean
}

// ─────────────────────────────────────────────
// Props & defaults
// ─────────────────────────────────────────────

const props = withDefaults(defineProps<SpeedometerChartProps>(), {
  min: 0,
  max: 240,
  variant: 'classic',
  size: 280,
  gapAngle: 60,
  color: 'primary',
  majorStep: 20,
  minorTicks: 4,
  unit: 'km/h',
  showValue: true,
  animate: true,
})

const uid = Math.random().toString(36).slice(2, 8)

// ─────────────────────────────────────────────
// Core geometry
// ─────────────────────────────────────────────

/** Total arc swept in degrees */
const sweepDeg = computed(() => 360 - props.gapAngle)

/** Start angle in SVG degrees (0° = 3-o'clock, clockwise) */
const startDeg = computed(() => 90 + props.gapAngle / 2)

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)

/** Main arc radius */
const r = computed(() => (props.size - 8) / 2 - 24)

/** 0–1 fraction of value within [min, max] */
const toFraction = (v: number) =>
  clamp((v - props.min) / (props.max - props.min), 0, 1)

/** Polar → Cartesian conversion (SVG angle convention) */
function polarToCart(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  return [cx.value + radius * Math.cos(rad), cy.value + radius * Math.sin(rad)]
}

/** Build an SVG arc path string */
function arcPathStr(fromDeg: number, toDeg: number, radius: number): string {
  const delta = toDeg - fromDeg
  if (Math.abs(delta) < 0.01) return ''
  const large = Math.abs(delta) > 180 ? 1 : 0
  const sweep = delta > 0 ? 1 : 0
  const [x1, y1] = polarToCart(fromDeg, radius)
  const [x2, y2] = polarToCart(toDeg, radius)
  return `M ${x1},${y1} A ${radius},${radius} 0 ${large} ${sweep} ${x2},${y2}`
}

// ─────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────

const fraction = computed(() => toFraction(props.value))
const animFrac = ref(props.animate ? 0 : fraction.value)
let cancelAnim: (() => void) | null = null

function runAnimation(to: number) {
  cancelAnim?.()
  const start = animFrac.value
  cancelAnim = animateProgress(1200, (t) => {
    animFrac.value = start + (to - start) * t
  })
}

onMounted(() => {
  if (props.animate) runAnimation(fraction.value)
})
watch(fraction, (to) => {
  if (props.animate) runAnimation(to)
  else animFrac.value = to
})
onUnmounted(() => cancelAnim?.())

// ─────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────

const resolvedColor = computed(() => resolveColor(props.color ?? 'primary'))

const needleResolvedColor = computed(() => {
  if (props.needleColor) return resolveColor(props.needleColor)
  if (props.variant === 'sport') return '#ef4444'
  return resolvedColor.value
})

const redZoneColor = computed(() => '#ef4444')

// ─────────────────────────────────────────────
// Scale ticks & labels
// ─────────────────────────────────────────────

interface TickMark {
  angle: number
  x1: number; y1: number
  x2: number; y2: number
  isMajor: boolean
  label?: string
  labelX?: number
  labelY?: number
}

const tickMarks = computed<TickMark[]>(() => {
  const result: TickMark[] = []
  const range = props.max - props.min
  const majorSteps = Math.floor(range / props.majorStep)
  const totalMinorPerMajor = props.minorTicks + 1
  const totalTicks = majorSteps * totalMinorPerMajor

  const outerR = r.value
  const majorInnerR = outerR - (props.variant === 'minimal' ? 10 : props.variant === 'sport' ? 16 : 14)
  const minorInnerR = outerR - (props.variant === 'minimal' ? 6 : props.variant === 'sport' ? 9 : 8)
  const labelR = outerR - (props.variant === 'minimal' ? 22 : props.variant === 'sport' ? 28 : 26)

  for (let i = 0; i <= totalTicks; i++) {
    const val = props.min + (range * i) / totalTicks
    const frac = toFraction(val)
    const angle = startDeg.value + sweepDeg.value * frac
    const isMajor = i % totalMinorPerMajor === 0

    const innerR = isMajor ? majorInnerR : minorInnerR
    const [x1, y1] = polarToCart(angle, outerR)
    const [x2, y2] = polarToCart(angle, innerR)

    const tick: TickMark = { angle, x1, y1, x2, y2, isMajor }

    if (isMajor) {
      const [lx, ly] = polarToCart(angle, labelR)
      tick.label = String(Math.round(val))
      tick.labelX = lx
      tick.labelY = ly
    }

    result.push(tick)
  }

  return result
})

// ─────────────────────────────────────────────
// Arc paths
// ─────────────────────────────────────────────

const trackArcPath = computed(() =>
  arcPathStr(startDeg.value, startDeg.value + sweepDeg.value, r.value)
)

/** Progress arc up to needle position */
const progressArcPath = computed(() => {
  const span = sweepDeg.value * animFrac.value
  if (span < 0.01) return ''
  return arcPathStr(startDeg.value, startDeg.value + span, r.value)
})

/** Red zone arc segment */
const redZoneArcPath = computed(() => {
  if (props.redZoneStart == null) return ''
  const fromFrac = toFraction(props.redZoneStart)
  const fromDeg = startDeg.value + sweepDeg.value * fromFrac
  const toDeg = startDeg.value + sweepDeg.value
  return arcPathStr(fromDeg, toDeg, r.value)
})

// ─────────────────────────────────────────────
// Needle
// ─────────────────────────────────────────────

const needleAngle = computed(() => startDeg.value + sweepDeg.value * animFrac.value)

const needlePath = computed(() => {
  const nLen = r.value * 0.82
  const nTail = r.value * 0.15
  const nBase = props.variant === 'sport' ? 5 : props.variant === 'minimal' ? 3 : 4.5
  const angle = needleAngle.value
  const rad = (angle * Math.PI) / 180
  const perpRad = rad + Math.PI / 2

  // Tip
  const tx = cx.value + nLen * Math.cos(rad)
  const ty = cy.value + nLen * Math.sin(rad)
  // Tail
  const bx = cx.value - nTail * Math.cos(rad)
  const by = cy.value - nTail * Math.sin(rad)
  // Side base
  const b1x = bx + nBase * Math.cos(perpRad)
  const b1y = by + nBase * Math.sin(perpRad)
  const b2x = bx - nBase * Math.cos(perpRad)
  const b2y = by - nBase * Math.sin(perpRad)

  return `M ${tx},${ty} L ${b1x},${b1y} L ${bx},${by} L ${b2x},${b2y} Z`
})

const hubR = computed(() => {
  if (props.variant === 'sport') return 10
  if (props.variant === 'minimal') return 7
  return 9
})

// ─────────────────────────────────────────────
// Display value
// ─────────────────────────────────────────────

const displayValue = computed(() => {
  const val = props.min + (props.max - props.min) * animFrac.value
  if (props.formatValue) return props.formatValue(val)
  return String(Math.round(val))
})

// ─────────────────────────────────────────────
// Font sizes (size-relative)
// ─────────────────────────────────────────────

const valueFontSize = computed(() => Math.max(16, props.size * 0.14))
const unitFontSize = computed(() => Math.max(9, props.size * 0.048))
const labelFontSize = computed(() => Math.max(9, props.size * 0.042))
const tickLabelFontSize = computed(() => Math.max(8, props.size * 0.042))

// ─────────────────────────────────────────────
// Variant-specific styling
// ─────────────────────────────────────────────

const arcStrokeWidth = computed(() => {
  if (props.variant === 'minimal') return 3
  if (props.variant === 'sport') return 6
  if (props.variant === 'modern') return 5
  return 4
})

const tickStrokeWidth = computed(() => {
  if (props.variant === 'sport') return 2.5
  if (props.variant === 'minimal') return 1.5
  return 2
})

const minorTickStrokeWidth = computed(() => {
  if (props.variant === 'sport') return 1.5
  if (props.variant === 'minimal') return 1
  return 1
})

// Sport variant: is current value in red zone?
const isInRedZone = computed(() => {
  if (props.redZoneStart == null) return false
  const currentVal = props.min + (props.max - props.min) * animFrac.value
  return currentVal >= props.redZoneStart
})

// Value text position
const textCy = computed(() => cy.value + r.value * 0.35)
</script>

<template>
  <div class="vlite-speedometer-chart inline-flex flex-col items-center gap-1 select-none">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      role="img"
      :aria-label="`Speedometer: ${displayValue} ${unit}`"
      class="overflow-visible"
    >
      <defs>
        <!-- Progress gradient -->
        <linearGradient :id="`spg-${uid}`" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" :stop-color="resolvedColor" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="resolvedColor" />
        </linearGradient>

        <!-- Needle drop shadow -->
        <filter :id="`ns-${uid}`" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" :flood-color="needleResolvedColor" flood-opacity="0.4" />
        </filter>

        <!-- Hub radial gradient -->
        <radialGradient :id="`sh-${uid}`">
          <stop offset="0%" stop-color="var(--color-foreground)" stop-opacity="0.9" />
          <stop offset="100%" :stop-color="needleResolvedColor" />
        </radialGradient>

        <!-- Glow filter for modern/sport -->
        <filter :id="`glow-${uid}`" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Subtle arc shadow -->
        <filter :id="`as-${uid}`" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.1" />
        </filter>
      </defs>

      <!-- ══════════════════════════════════════
           CLASSIC VARIANT
      ══════════════════════════════════════ -->
      <g v-if="variant === 'classic'">
        <!-- Background track arc -->
        <path :d="trackArcPath" fill="none" stroke="var(--color-muted)"
          :stroke-width="arcStrokeWidth" stroke-linecap="butt" opacity="0.5" />

        <!-- Red zone arc -->
        <path v-if="redZoneArcPath" :d="redZoneArcPath" fill="none"
          :stroke="redZoneColor" :stroke-width="arcStrokeWidth + 2"
          stroke-linecap="butt" opacity="0.25" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="resolvedColor" :stroke-width="arcStrokeWidth"
          stroke-linecap="round" opacity="0.6" />

        <!-- Tick marks -->
        <line v-for="(tick, i) in tickMarks" :key="`t-${i}`"
          :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2"
          :stroke="
            redZoneStart != null && (props.min + (props.max - props.min) * toFraction(parseFloat(tick.label ?? '0'))) >= redZoneStart && tick.isMajor
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :stroke-width="tick.isMajor ? tickStrokeWidth : minorTickStrokeWidth"
          :opacity="tick.isMajor ? 0.8 : 0.35"
          stroke-linecap="round"
        />

        <!-- Tick labels (numbers around the arc) -->
        <text v-for="(tick, i) in tickMarks.filter(t => t.isMajor)" :key="`tl-${i}`"
          :x="tick.labelX" :y="tick.labelY"
          text-anchor="middle" dominant-baseline="central"
          :font-size="tickLabelFontSize"
          font-weight="600"
          :fill="
            redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :opacity="redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart ? 0.9 : 0.7"
        >{{ tick.label }}</text>

        <!-- Needle -->
        <g :filter="`url(#ns-${uid})`">
          <path :d="needlePath" :fill="needleResolvedColor" :fill-opacity="0.9" />
        </g>
        <!-- Hub -->
        <circle :cx="cx" :cy="cy" :r="hubR"
          :fill="`url(#sh-${uid})`"
          stroke="var(--color-background)" stroke-width="2" />

        <!-- Center value -->
        <foreignObject
          :x="cx - size * 0.3"
          :y="textCy - size * 0.06"
          :width="size * 0.6"
          :height="size * 0.18"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <span v-if="showValue" class="font-black tabular-nums leading-none"
              :style="{ fontSize: `${valueFontSize}px`, color: isInRedZone ? redZoneColor : 'var(--color-foreground)' }">
              {{ displayValue }}
            </span>
            <span v-if="unit" class="font-medium leading-tight mt-0.5"
              :style="{ fontSize: `${unitFontSize}px`, color: 'var(--color-muted-foreground)' }">
              {{ unit }}
            </span>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           MODERN VARIANT
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'modern'">
        <!-- Outer ring background -->
        <circle :cx="cx" :cy="cy" :r="r + 8" fill="none"
          stroke="var(--color-muted)" stroke-width="1" opacity="0.2" />

        <!-- Background track -->
        <path :d="trackArcPath" fill="none" stroke="var(--color-muted)"
          :stroke-width="arcStrokeWidth" stroke-linecap="round" opacity="0.3" />

        <!-- Red zone -->
        <path v-if="redZoneArcPath" :d="redZoneArcPath" fill="none"
          :stroke="redZoneColor" :stroke-width="arcStrokeWidth + 1"
          stroke-linecap="butt" opacity="0.2" />

        <!-- Progress arc with glow -->
        <g v-if="progressArcPath" :filter="`url(#glow-${uid})`">
          <path :d="progressArcPath" fill="none"
            :stroke="`url(#spg-${uid})`"
            :stroke-width="arcStrokeWidth + 1"
            stroke-linecap="round" />
        </g>

        <!-- Tick marks -->
        <line v-for="(tick, i) in tickMarks" :key="`t-${i}`"
          :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2"
          :stroke="
            redZoneStart != null && tick.isMajor && parseFloat(tick.label ?? '0') >= redZoneStart
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :stroke-width="tick.isMajor ? tickStrokeWidth : minorTickStrokeWidth"
          :opacity="tick.isMajor ? 0.6 : 0.2"
          stroke-linecap="round"
        />

        <!-- Tick labels -->
        <text v-for="(tick, i) in tickMarks.filter(t => t.isMajor)" :key="`tl-${i}`"
          :x="tick.labelX" :y="tick.labelY"
          text-anchor="middle" dominant-baseline="central"
          :font-size="tickLabelFontSize"
          font-weight="500"
          :fill="
            redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :opacity="redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart ? 0.8 : 0.55"
        >{{ tick.label }}</text>

        <!-- Needle with glow -->
        <g :filter="`url(#ns-${uid})`">
          <path :d="needlePath" :fill="needleResolvedColor" :fill-opacity="0.85" />
        </g>
        <circle :cx="cx" :cy="cy" :r="hubR"
          :fill="`url(#sh-${uid})`"
          stroke="var(--color-background)" stroke-width="2" />

        <!-- Center value -->
        <foreignObject
          :x="cx - size * 0.3"
          :y="textCy - size * 0.06"
          :width="size * 0.6"
          :height="size * 0.18"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <span v-if="showValue" class="font-black tabular-nums leading-none"
              :style="{ fontSize: `${valueFontSize}px`, color: isInRedZone ? redZoneColor : 'var(--color-foreground)' }">
              {{ displayValue }}
            </span>
            <span v-if="unit" class="font-medium leading-tight mt-0.5"
              :style="{ fontSize: `${unitFontSize}px`, color: 'var(--color-muted-foreground)' }">
              {{ unit }}
            </span>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           SPORT VARIANT
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'sport'">
        <!-- Outer decorative ring -->
        <circle :cx="cx" :cy="cy" :r="r + 12" fill="none"
          stroke="var(--color-foreground)" stroke-width="1.5" opacity="0.1" />
        <circle :cx="cx" :cy="cy" :r="r + 6" fill="none"
          stroke="var(--color-foreground)" stroke-width="0.5" opacity="0.08" />

        <!-- Background track (thicker) -->
        <path :d="trackArcPath" fill="none" stroke="var(--color-muted)"
          :stroke-width="arcStrokeWidth + 2" stroke-linecap="butt" opacity="0.25" />

        <!-- Red zone (aggressive) -->
        <path v-if="redZoneArcPath" :d="redZoneArcPath" fill="none"
          :stroke="redZoneColor" :stroke-width="arcStrokeWidth + 4"
          stroke-linecap="butt" opacity="0.3" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="isInRedZone ? redZoneColor : resolvedColor"
          :stroke-width="arcStrokeWidth + 1"
          stroke-linecap="butt" opacity="0.7"
          :filter="`url(#glow-${uid})`" />

        <!-- Tick marks (bolder) -->
        <line v-for="(tick, i) in tickMarks" :key="`t-${i}`"
          :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2"
          :stroke="
            redZoneStart != null && tick.isMajor && parseFloat(tick.label ?? '0') >= redZoneStart
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :stroke-width="tick.isMajor ? tickStrokeWidth : minorTickStrokeWidth"
          :opacity="tick.isMajor ? 0.9 : 0.4"
          stroke-linecap="butt"
        />

        <!-- Tick labels -->
        <text v-for="(tick, i) in tickMarks.filter(t => t.isMajor)" :key="`tl-${i}`"
          :x="tick.labelX" :y="tick.labelY"
          text-anchor="middle" dominant-baseline="central"
          :font-size="tickLabelFontSize"
          font-weight="700"
          :fill="
            redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart
              ? redZoneColor
              : 'var(--color-foreground)'
          "
          :opacity="redZoneStart != null && parseFloat(tick.label ?? '0') >= redZoneStart ? 1 : 0.8"
        >{{ tick.label }}</text>

        <!-- Needle (aggressive thin) -->
        <g :filter="`url(#ns-${uid})`">
          <path :d="needlePath" :fill="isInRedZone ? redZoneColor : needleResolvedColor" :fill-opacity="0.95" />
        </g>
        <!-- Hub with ring -->
        <circle :cx="cx" :cy="cy" :r="hubR + 2" fill="none"
          :stroke="isInRedZone ? redZoneColor : needleResolvedColor"
          stroke-width="1.5" opacity="0.4" />
        <circle :cx="cx" :cy="cy" :r="hubR"
          :fill="`url(#sh-${uid})`"
          stroke="var(--color-background)" stroke-width="2" />

        <!-- Center value -->
        <foreignObject
          :x="cx - size * 0.3"
          :y="textCy - size * 0.06"
          :width="size * 0.6"
          :height="size * 0.18"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <span v-if="showValue" class="font-black tabular-nums leading-none"
              :style="{ fontSize: `${valueFontSize * 1.1}px`, color: isInRedZone ? redZoneColor : 'var(--color-foreground)' }">
              {{ displayValue }}
            </span>
            <span v-if="unit" class="font-bold leading-tight mt-0.5 uppercase tracking-widest"
              :style="{ fontSize: `${unitFontSize * 0.9}px`, color: isInRedZone ? redZoneColor : 'var(--color-muted-foreground)', opacity: 0.7 }">
              {{ unit }}
            </span>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           MINIMAL VARIANT
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'minimal'">
        <!-- Background track (thin, subtle) -->
        <path :d="trackArcPath" fill="none" stroke="var(--color-muted)"
          :stroke-width="arcStrokeWidth" stroke-linecap="round" opacity="0.4" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="resolvedColor"
          :stroke-width="arcStrokeWidth"
          stroke-linecap="round" opacity="0.8" />

        <!-- Only major tick marks -->
        <line v-for="(tick, i) in tickMarks.filter(t => t.isMajor)" :key="`t-${i}`"
          :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2"
          stroke="var(--color-foreground)"
          :stroke-width="tickStrokeWidth"
          opacity="0.45"
          stroke-linecap="round"
        />

        <!-- Tick labels -->
        <text v-for="(tick, i) in tickMarks.filter(t => t.isMajor)" :key="`tl-${i}`"
          :x="tick.labelX" :y="tick.labelY"
          text-anchor="middle" dominant-baseline="central"
          :font-size="tickLabelFontSize"
          font-weight="500"
          fill="var(--color-foreground)"
          opacity="0.5"
        >{{ tick.label }}</text>

        <!-- Needle (thin, elegant) -->
        <g :filter="`url(#ns-${uid})`">
          <path :d="needlePath" :fill="needleResolvedColor" :fill-opacity="0.8" />
        </g>
        <circle :cx="cx" :cy="cy" :r="hubR"
          fill="var(--color-foreground)"
          stroke="var(--color-background)" stroke-width="2" opacity="0.8" />

        <!-- Center value -->
        <foreignObject
          :x="cx - size * 0.3"
          :y="textCy - size * 0.06"
          :width="size * 0.6"
          :height="size * 0.18"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <span v-if="showValue" class="font-bold tabular-nums leading-none"
              :style="{ fontSize: `${valueFontSize * 0.9}px`, color: 'var(--color-foreground)' }">
              {{ displayValue }}
            </span>
            <span v-if="unit" class="font-medium leading-tight mt-0.5"
              :style="{ fontSize: `${unitFontSize}px`, color: 'var(--color-muted-foreground)' }">
              {{ unit }}
            </span>
          </div>
        </foreignObject>
      </g>
    </svg>

    <!-- ── Label below SVG ── -->
    <p v-if="label" class="text-center font-semibold text-foreground -mt-1"
      :style="{ fontSize: `${labelFontSize}px` }">
      {{ label }}
    </p>
  </div>
</template>
