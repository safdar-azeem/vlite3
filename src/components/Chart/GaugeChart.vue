<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { resolveColor, animateProgress, clamp } from './utils'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type GaugeVariant = 'arc' | 'ticks' | 'slim'
export type GaugeLineCap = 'round' | 'butt' | 'square'

export interface GaugeZone {
  /** Start of zone (absolute value, not percent) */
  from: number
  /** End of zone (absolute value, not percent) */
  to: number
  /** CSS color for this zone */
  color: string
}

export interface GaugeChartProps {
  // ── Core data ──────────────────────────────────
  /** Current value */
  value: number
  /** Minimum value on the scale */
  min?: number
  /** Maximum value on the scale */
  max?: number

  // ── Visual variant ────────────────────────────
  /** Arc: thick gradient arc. Ticks: segmented dash ring. Slim: thin minimal arc. */
  variant?: GaugeVariant

  // ── Dimensions ───────────────────────────────
  /** SVG bounding diameter in px */
  size?: number
  /** Stroke width for the arc/track (arc & slim) */
  strokeWidth?: number
  /**
   * Opening gap at the bottom of the gauge, in degrees.
   * 60 = typical speedometer, 0 = full circle.
   */
  gapAngle?: number

  // ── Colors ───────────────────────────────────
  /** Semantic color name or any CSS color */
  color?: string
  /** Background track color. Defaults to a muted tone. */
  trackColor?: string
  /** Apply a gradient to the progress arc */
  gradient?: boolean

  // ── Ticks variant ────────────────────────────
  /** Total number of tick marks (ticks variant) */
  tickCount?: number
  /** Gap between tick marks in degrees (ticks variant) */
  tickGap?: number
  /** Thickness of each individual tick mark in px */
  tickWidth?: number

  // ── Labels ───────────────────────────────────
  /** Show the current value in the center */
  showValue?: boolean
  /** Custom formatter: receives (value, percent) */
  formatValue?: (v: number, pct: number) => string
  /** Primary label below the value */
  label?: string
  /** Secondary sublabel */
  sublabel?: string

  // ── Needle ───────────────────────────────────
  /** Show a pointer needle (arc and slim variants) */
  showNeedle?: boolean
  /** CSS color for the needle */
  needleColor?: string

  // ── Zones ────────────────────────────────────
  /**
   * Color zones rendered as arc segments beneath the progress arc.
   * E.g. [{ from: 0, to: 60, color: 'green' }, { from: 60, to: 80, color: 'orange' }, { from: 80, to: 100, color: 'red' }]
   */
  zones?: GaugeZone[]

  // ── Line cap ─────────────────────────────────
  /** Cap style of the progress arc (arc & slim variants) */
  lineCap?: GaugeLineCap

  // ── Animation ────────────────────────────────
  /** Play an entry animation on mount and value change */
  animate?: boolean
}

// ─────────────────────────────────────────────
// Props & defaults
// ─────────────────────────────────────────────

const props = withDefaults(defineProps<GaugeChartProps>(), {
  min: 0,
  max: 100,
  variant: 'arc',
  size: 220,
  strokeWidth: 18,
  gapAngle: 60,
  color: 'primary',
  gradient: true,
  tickCount: 48,
  tickGap: 2.5,
  tickWidth: 3,
  showValue: true,
  animate: true,
  lineCap: 'round',
  showNeedle: false,
})

const uid = Math.random().toString(36).slice(2, 8)

// ─────────────────────────────────────────────
// Geometry helpers
// ─────────────────────────────────────────────

/** Total arc swept in degrees (e.g. gap=60 → 300° gauge) */
const sweepDeg = computed(() => 360 - props.gapAngle)

/**
 * Start angle of the gauge in degrees.
 * At gap=60 → starts at 90+30 = 120° (measured from 3-o'clock, clockwise)
 * SVG convention: 0° = 3 o'clock, positive clockwise.
 */
const startDeg = computed(() => 90 + props.gapAngle / 2)

/** End angle in degrees (clockwise from startDeg) */
// endDeg = startDeg + sweepDeg (but we derive it directly)

/** Center of the SVG canvas */
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)

/**
 * Radius of the main arc.
 * Shrunk by strokeWidth/2 + a small margin so the stroke stays inside the viewBox.
 */
const r = computed(() => {
  const margin = props.variant === 'ticks' ? 8 : 4
  return (props.size - props.strokeWidth) / 2 - margin
})

/** Convert a value to a 0–1 percentage within [min, max] */
const toPercent = (v: number) =>
  clamp((v - props.min) / (props.max - props.min), 0, 1)

/** Convert deg (SVG convention, from 3-o'clock clockwise) to [x, y] on radius R */
function polarToCart(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  return [
    cx.value + radius * Math.cos(rad),
    cy.value + radius * Math.sin(rad),
  ]
}

/** Build an SVG arc path from fromDeg to toDeg at the given radius */
function arcPathStr(
  fromDeg: number,
  toDeg: number,
  radius: number,
): string {
  const delta = toDeg - fromDeg
  if (Math.abs(delta) < 0.01) return ''
  const large = Math.abs(delta) > 180 ? 1 : 0
  const sweep = delta > 0 ? 1 : 0
  const [x1, y1] = polarToCart(fromDeg, radius)
  const [x2, y2] = polarToCart(toDeg, radius)
  return `M ${x1},${y1} A ${radius},${radius} 0 ${large} ${sweep} ${x2},${y2}`
}

// ─────────────────────────────────────────────
// Value & animation
// ─────────────────────────────────────────────

const percentage = computed(() => toPercent(props.value))
const animPct = ref(props.animate ? 0 : percentage.value)
let cancelAnim: (() => void) | null = null

function runAnimation(from = 0, to = percentage.value) {
  cancelAnim?.()
  const start = animPct.value
  cancelAnim = animateProgress(1000, (t) => {
    animPct.value = start + (to - start) * t
  })
}

onMounted(() => { if (props.animate) runAnimation(0, percentage.value) })
watch(percentage, (to) => {
  if (props.animate) runAnimation(animPct.value, to)
  else animPct.value = to
})
onUnmounted(() => cancelAnim?.())

// ─────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────

const resolvedColor = computed(() => resolveColor(props.color ?? 'primary'))

/** Lighter gradient start color derived from semantic names */
const gradientStart = computed(() => {
  const map: Record<string, string> = {
    primary: '#818cf8',
    success: '#34d399',
    warning: '#fbbf24',
    danger:  '#fb7185',
    info:    '#60a5fa',
    purple:  '#c084fc',
    teal:    '#2dd4bf',
    orange:  '#fb923c',
    pink:    '#f472b6',
    cyan:    '#22d3ee',
  }
  return map[props.color ?? 'primary'] ?? resolvedColor.value
})

const trackColor = computed(() => props.trackColor ?? 'var(--color-muted)')

// ─────────────────────────────────────────────
// Arc variant — SVG paths
// ─────────────────────────────────────────────

/** Track arc: full span */
const trackArcPath = computed(() =>
  arcPathStr(startDeg.value, startDeg.value + sweepDeg.value, r.value)
)

/** Progress arc: 0 → animPct */
const progressArcPath = computed(() => {
  const span = sweepDeg.value * animPct.value
  if (span < 0.01) return ''
  return arcPathStr(startDeg.value, startDeg.value + span, r.value)
})

// ─────────────────────────────────────────────
// Zones — rendered as arc segments on a slightly inner radius
// ─────────────────────────────────────────────

const zoneArcPaths = computed(() => {
  if (!props.zones?.length) return []
  return props.zones.map((z) => {
    const fromPct = toPercent(z.from)
    const toPct   = toPercent(z.to)
    const fromDeg = startDeg.value + sweepDeg.value * fromPct
    const toDeg   = startDeg.value + sweepDeg.value * toPct
    return {
      path: arcPathStr(fromDeg, toDeg, r.value),
      color: z.color,
    }
  })
})

// ─────────────────────────────────────────────
// Needle
// ─────────────────────────────────────────────

const needleAngle = computed(() => startDeg.value + sweepDeg.value * animPct.value)

const needlePath = computed(() => {
  const nLen   = r.value * 0.72      // tip length
  const nBase  = props.strokeWidth * 0.7  // base half-width
  const angle  = needleAngle.value
  const rad    = (angle * Math.PI) / 180
  const perpRad = rad + Math.PI / 2

  const tx = cx.value + nLen * Math.cos(rad)
  const ty = cy.value + nLen * Math.sin(rad)
  const b1x = cx.value + nBase * Math.cos(perpRad)
  const b1y = cy.value + nBase * Math.sin(perpRad)
  const b2x = cx.value - nBase * Math.cos(perpRad)
  const b2y = cy.value - nBase * Math.sin(perpRad)

  return `M ${tx},${ty} L ${b1x},${b1y} L ${b2x},${b2y} Z`
})

// ─────────────────────────────────────────────
// Ticks variant
// ─────────────────────────────────────────────

interface Tick {
  x1: number; y1: number
  x2: number; y2: number
  filled: boolean
}

const ticks = computed<Tick[]>(() => {
  const n      = props.tickCount
  const outerR = r.value
  const innerR = outerR - props.strokeWidth
  const totalDeg = sweepDeg.value
  const filledCount = Math.round(animPct.value * n)

  const result: Tick[] = []
  for (let i = 0; i < n; i++) {
    const angleDeg = startDeg.value + i * (totalDeg / (n - 1))
    const rad = (angleDeg * Math.PI) / 180
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    result.push({
      x1: cx.value + outerR * cosA,
      y1: cy.value + outerR * sinA,
      x2: cx.value + innerR * cosA,
      y2: cy.value + innerR * sinA,
      filled: i < filledCount,
    })
  }
  return result
})

// ─────────────────────────────────────────────
// Display value
// ─────────────────────────────────────────────

const displayValue = computed(() => {
  const pct  = animPct.value * 100
  const val  = props.min + (props.max - props.min) * animPct.value
  if (props.formatValue) return props.formatValue(val, pct)
  // If the range is 0–100 show percentage, otherwise show raw value
  if (props.min === 0 && props.max === 100) return `${Math.round(pct)}%`
  return String(Math.round(val))
})

// ─────────────────────────────────────────────
// Font sizes (relative to size)
// ─────────────────────────────────────────────

const valueFontSize   = computed(() => Math.max(14, props.size * 0.155))
const labelFontSize   = computed(() => Math.max(10, props.size * 0.065))
const subLabelFontSize = computed(() => Math.max(9,  props.size * 0.055))

// ─────────────────────────────────────────────
// Center text vertical offset
// Because we're a half-circle (gap at bottom), the visual center
// of the arc is above the SVG center — nudge text up slightly.
// ─────────────────────────────────────────────
const textCy = computed(() => {
  // Shift text up toward the arc's visual center
  const shift = r.value * 0.08
  return cy.value + shift
})
</script>

<template>
  <div class="vlite-gauge-chart inline-flex flex-col items-center gap-1 select-none">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      role="img"
      :aria-label="`Gauge chart: ${displayValue}`"
      class="overflow-visible"
    >
      <defs>
        <!-- Progress gradient (arc / slim) -->
        <linearGradient :id="`gg-${uid}`" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="resolvedColor"  />
        </linearGradient>

        <!-- Ticks gradient (filled ticks get a gradient color) -->
        <linearGradient :id="`tg-${uid}`" x1="0" y1="0" x2="1" y2="0"
          :gradientTransform="`rotate(${startDeg}, ${cx}, ${cy})`">
          <stop offset="0%"   :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="resolvedColor"  />
        </linearGradient>

        <!-- Radial for needle hub -->
        <radialGradient :id="`nh-${uid}`">
          <stop offset="0%"   stop-color="var(--color-background)" />
          <stop offset="100%" :stop-color="resolvedColor" />
        </radialGradient>

        <!-- Drop shadow filter -->
        <filter :id="`gs-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.18" />
        </filter>
      </defs>

      <!-- ══════════════════════════════════════
           ARC VARIANT
      ══════════════════════════════════════ -->
      <g v-if="variant === 'arc'">
        <!-- Track -->
        <path
          :d="trackArcPath"
          fill="none"
          :stroke="trackColor"
          :stroke-width="strokeWidth"
          stroke-linecap="butt"
        />

        <!-- Zone overlays (under progress) -->
        <path
          v-for="(z, i) in zoneArcPaths"
          :key="`z-${i}`"
          :d="z.path"
          fill="none"
          :stroke="z.color"
          :stroke-width="strokeWidth"
          stroke-linecap="butt"
          opacity="0.35"
        />

        <!-- Progress arc -->
        <path
          v-if="progressArcPath"
          :d="progressArcPath"
          fill="none"
          :stroke="gradient ? `url(#gg-${uid})` : resolvedColor"
          :stroke-width="strokeWidth"
          :stroke-linecap="lineCap"
          :filter="`url(#gs-${uid})`"
        />

        <!-- Needle -->
        <g v-if="showNeedle">
          <path
            :d="needlePath"
            :fill="needleColor ?? resolvedColor"
            opacity="0.9"
          />
          <!-- Hub dot -->
          <circle
            :cx="cx" :cy="cy"
            :r="strokeWidth * 0.45"
            :fill="`url(#nh-${uid})`"
            stroke="var(--color-background)"
            stroke-width="2"
          />
        </g>

        <!-- Center text content -->
        <foreignObject
          :x="cx - size * 0.38"
          :y="textCy - size * 0.2"
          :width="size * 0.76"
          :height="size * 0.4"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center"
          >
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span
                v-if="showValue"
                class="font-black tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize}px`, color: 'var(--color-foreground)' }"
              >
                {{ displayValue }}
              </span>
            </slot>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           TICKS VARIANT
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'ticks'">
        <!-- Tick marks -->
        <line
          v-for="(tk, i) in ticks"
          :key="`tk-${i}`"
          :x1="tk.x1" :y1="tk.y1"
          :x2="tk.x2" :y2="tk.y2"
          :stroke="tk.filled ? (gradient ? `url(#tg-${uid})` : resolvedColor) : trackColor"
          :stroke-width="tickWidth"
          stroke-linecap="round"
          :opacity="tk.filled ? 1 : 0.45"
        />

        <!-- Center text content -->
        <foreignObject
          :x="cx - size * 0.38"
          :y="textCy - size * 0.22"
          :width="size * 0.76"
          :height="size * 0.44"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center gap-1"
          >
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span
                v-if="showValue"
                class="font-black tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize}px`, color: 'var(--color-foreground)' }"
              >
                {{ displayValue }}
              </span>
              <span
                v-if="sublabel"
                class="font-medium leading-tight"
                :style="{ fontSize: `${subLabelFontSize}px`, color: 'var(--color-muted-foreground)' }"
              >
                {{ sublabel }}
              </span>
            </slot>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           SLIM VARIANT
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'slim'">
        <!-- Track -->
        <path
          :d="trackArcPath"
          fill="none"
          :stroke="trackColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          opacity="0.5"
        />

        <!-- Zone overlays -->
        <path
          v-for="(z, i) in zoneArcPaths"
          :key="`sz-${i}`"
          :d="z.path"
          fill="none"
          :stroke="z.color"
          :stroke-width="strokeWidth"
          stroke-linecap="butt"
          opacity="0.3"
        />

        <!-- Progress arc -->
        <path
          v-if="progressArcPath"
          :d="progressArcPath"
          fill="none"
          :stroke="gradient ? `url(#gg-${uid})` : resolvedColor"
          :stroke-width="strokeWidth"
          :stroke-linecap="lineCap"
        />

        <!-- Needle -->
        <g v-if="showNeedle">
          <path
            :d="needlePath"
            :fill="needleColor ?? resolvedColor"
            opacity="0.85"
          />
          <circle
            :cx="cx" :cy="cy"
            :r="strokeWidth * 0.4"
            fill="var(--color-background)"
            :stroke="resolvedColor"
            stroke-width="2"
          />
        </g>

        <!-- Center value -->
        <foreignObject
          :x="cx - size * 0.38"
          :y="textCy - size * 0.18"
          :width="size * 0.76"
          :height="size * 0.36"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center"
          >
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span
                v-if="showValue"
                class="font-bold tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize * 0.82}px`, color: 'var(--color-foreground)' }"
              >
                {{ displayValue }}
              </span>
            </slot>
          </div>
        </foreignObject>
      </g>
    </svg>

    <!-- ── Labels below SVG ─────────────────────── -->
    <div
      v-if="(label || sublabel) && variant !== 'ticks'"
      class="text-center -mt-1"
    >
      <p
        v-if="label"
        class="font-semibold text-foreground"
        :style="{ fontSize: `${variant === 'slim' ? labelFontSize * 0.9 : labelFontSize}px` }"
      >
        {{ label }}
      </p>
      <p
        v-if="sublabel"
        class="text-muted-foreground mt-0.5"
        :style="{ fontSize: `${subLabelFontSize}px` }"
      >
        {{ sublabel }}
      </p>
    </div>

    <!-- ── Footer slot (ticks CTA, etc.) ──────────── -->
    <slot name="footer" :value="value" :percentage="percentage" :displayValue="displayValue" />
  </div>
</template>
