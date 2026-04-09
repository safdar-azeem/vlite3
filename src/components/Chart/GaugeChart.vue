<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { resolveColor, animateProgress, clamp } from './utils'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type GaugeVariant = 'arc' | 'ticks' | 'slim' | 'ball'
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
  /**
   * arc  — Thick gradient arc (speedometer style)
   * ticks — Segmented radial dash ring
   * slim  — Thin minimal arc
   * ball  — Arc with a glowing orb at the progress tip
   */
  variant?: GaugeVariant

  // ── Dimensions ───────────────────────────────
  /** SVG bounding diameter in px */
  size?: number
  /** Stroke width for the arc */
  strokeWidth?: number
  /** Opening gap at the bottom of the gauge, in degrees (default 60) */
  gapAngle?: number

  // ── Colors ───────────────────────────────────
  /** Semantic color name ('primary', 'success', etc.) or any CSS color */
  color?: string
  /** Background track color */
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

  // ── Ball variant ─────────────────────────────
  /** Radius of the glowing orb at the arc tip. Defaults to strokeWidth * 0.65 */
  ballRadius?: number

  // ── Labels ───────────────────────────────────
  /** Show the current value in the center */
  showValue?: boolean
  /** Custom formatter — receives (value, pct) */
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
  /** Color zones rendered as arc segments beneath the progress arc */
  zones?: GaugeZone[]

  // ── Line cap ─────────────────────────────────
  /** Cap style for the progress arc */
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
// Core geometry
// ─────────────────────────────────────────────

/** Total arc swept in degrees (e.g. gap=60 → 300° gauge) */
const sweepDeg = computed(() => 360 - props.gapAngle)

/** Start angle in SVG degrees (0° = 3-o'clock, clockwise) */
const startDeg = computed(() => 90 + props.gapAngle / 2)

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)

/** Main arc radius — inset so the stroke stays within the viewBox */
const r = computed(() => {
  const margin = props.variant === 'ticks' ? 8 : props.variant === 'ball' ? props.strokeWidth * 0.65 + 2 : 4
  return (props.size - props.strokeWidth) / 2 - margin
})

/** 0–1 clamp of a value within [min, max] */
const toPercent = (v: number) =>
  clamp((v - props.min) / (props.max - props.min), 0, 1)

/** Polar → Cartesian conversion (SVG angle convention) */
function polarToCart(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  return [cx.value + radius * Math.cos(rad), cy.value + radius * Math.sin(rad)]
}

/** Build an SVG arc path string from `fromDeg` to `toDeg` at `radius` */
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

const percentage = computed(() => toPercent(props.value))
const animPct    = ref(props.animate ? 0 : percentage.value)
let cancelAnim: (() => void) | null = null

function runAnimation(to: number) {
  cancelAnim?.()
  const start = animPct.value
  cancelAnim = animateProgress(1000, (t) => { animPct.value = start + (to - start) * t })
}

onMounted(() => { if (props.animate) runAnimation(percentage.value) })
watch(percentage, (to) => { if (props.animate) runAnimation(to); else animPct.value = to })
onUnmounted(() => cancelAnim?.())

// ─────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────

const resolvedColor = computed(() => resolveColor(props.color ?? 'primary'))

const gradientStart = computed(() => {
  const map: Record<string, string> = {
    primary: '#818cf8', success: '#34d399', warning: '#fbbf24',
    danger: '#fb7185',  info: '#60a5fa',   purple: '#c084fc',
    teal: '#2dd4bf',    orange: '#fb923c', pink: '#f472b6', cyan: '#22d3ee',
  }
  return map[props.color ?? 'primary'] ?? resolvedColor.value
})

const trackColor = computed(() => props.trackColor ?? 'var(--color-muted)')

// ─────────────────────────────────────────────
// Arc paths
// ─────────────────────────────────────────────

const trackArcPath = computed(() =>
  arcPathStr(startDeg.value, startDeg.value + sweepDeg.value, r.value)
)

const progressArcPath = computed(() => {
  const span = sweepDeg.value * animPct.value
  if (span < 0.01) return ''
  return arcPathStr(startDeg.value, startDeg.value + span, r.value)
})

// ─────────────────────────────────────────────
// Zone arc paths
// ─────────────────────────────────────────────

const zoneArcPaths = computed(() => {
  if (!props.zones?.length) return []
  return props.zones.map((z) => {
    const fromDeg = startDeg.value + sweepDeg.value * toPercent(z.from)
    const toDeg   = startDeg.value + sweepDeg.value * toPercent(z.to)
    return { path: arcPathStr(fromDeg, toDeg, r.value), color: z.color }
  })
})

// ─────────────────────────────────────────────
// Needle
// ─────────────────────────────────────────────

const needleAngle = computed(() => startDeg.value + sweepDeg.value * animPct.value)

const needlePath = computed(() => {
  // Needle: tip points toward arc, base is near the center hub
  // nLen: how far the tip extends (toward the arc)
  // nTail: how far the tail extends backward (short counterbalance)
  // The pivot/hub is at cx, cy — needle extends nLen forward, nTail back
  const nLen    = r.value * 0.76
  const nTail   = r.value * 0.12     // short tail behind pivot
  const nBase   = props.strokeWidth * 0.55  // half-width at pivot

  const angle   = needleAngle.value
  const rad     = (angle * Math.PI) / 180
  const perpRad = rad + Math.PI / 2

  // Tip (forward direction)
  const tx = cx.value + nLen * Math.cos(rad)
  const ty = cy.value + nLen * Math.sin(rad)
  // Tail (backward direction)
  const bx = cx.value - nTail * Math.cos(rad)
  const by = cy.value - nTail * Math.sin(rad)
  // Side base width at pivot
  const b1x = bx + nBase * Math.cos(perpRad)
  const b1y = by + nBase * Math.sin(perpRad)
  const b2x = bx - nBase * Math.cos(perpRad)
  const b2y = by - nBase * Math.sin(perpRad)

  // Diamond-like: tip → right-base → tail-point → left-base
  return `M ${tx},${ty} L ${b1x},${b1y} L ${bx},${by} L ${b2x},${b2y} Z`
})

// Hub circle radius
const hubR = computed(() => props.strokeWidth * 0.42)

// ─────────────────────────────────────────────
// Ticks variant
// ─────────────────────────────────────────────

interface Tick { x1: number; y1: number; x2: number; y2: number; filled: boolean }

const ticks = computed<Tick[]>(() => {
  const n        = props.tickCount
  const outerR   = r.value
  const innerR   = outerR - props.strokeWidth
  const totalDeg = sweepDeg.value
  const filled   = Math.round(animPct.value * n)

  return Array.from({ length: n }, (_, i) => {
    const angleDeg = startDeg.value + i * (totalDeg / (n - 1))
    const rad  = (angleDeg * Math.PI) / 180
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    return {
      x1: cx.value + outerR * cosA, y1: cy.value + outerR * sinA,
      x2: cx.value + innerR * cosA, y2: cy.value + innerR * sinA,
      filled: i < filled,
    }
  })
})

// ─────────────────────────────────────────────
// Display value text
// ─────────────────────────────────────────────

const displayValue = computed(() => {
  const pct = animPct.value * 100
  const val = props.min + (props.max - props.min) * animPct.value
  if (props.formatValue) return props.formatValue(val, pct)
  if (props.min === 0 && props.max === 100) return `${Math.round(pct)}%`
  return String(Math.round(val))
})

// ─────────────────────────────────────────────
// Font sizes (size-relative)
// ─────────────────────────────────────────────

const valueFontSize    = computed(() => Math.max(14, props.size * 0.155))
const labelFontSize    = computed(() => Math.max(10, props.size * 0.065))
const subLabelFontSize = computed(() => Math.max(9,  props.size * 0.055))

// ─────────────────────────────────────────────
// Center text position
// When needle is shown, shift text DOWN below the needle hub so they
// don't conflict. When needle is hidden, center text normally.
// ─────────────────────────────────────────────
const textCy = computed(() => {
  if (props.showNeedle) {
    // Push further down into the needle-free safe zone (the gap at the bottom)
    return cy.value + r.value * 0.45
  }
  // Default: slight downward nudge toward arc's visual center
  return cy.value + r.value * 0.08
})

// ─────────────────────────────────────────────
// Ball variant — glowing orb at arc tip
// ─────────────────────────────────────────────

const ballTipPos = computed(() => {
  const angle = startDeg.value + sweepDeg.value * animPct.value
  const [x, y] = polarToCart(angle, r.value)
  return { x, y }
})
const ballRadius = computed(() => props.ballRadius ?? props.strokeWidth * 0.65)
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
        <!-- Progress gradient -->
        <linearGradient :id="`gg-${uid}`" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="resolvedColor"  />
        </linearGradient>

        <!-- Ticks gradient -->
        <linearGradient :id="`tg-${uid}`" x1="0" y1="0" x2="1" y2="0"
          :gradientTransform="`rotate(${startDeg}, ${cx}, ${cy})`">
          <stop offset="0%"   :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="resolvedColor"  />
        </linearGradient>

        <!-- Needle hub radial gradient -->
        <radialGradient :id="`nh-${uid}`">
          <stop offset="0%"   stop-color="var(--color-background)" />
          <stop offset="100%" :stop-color="resolvedColor" />
        </radialGradient>

        <!-- Drop shadow for arc -->
        <filter :id="`gs-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.18" />
        </filter>
      </defs>

      <!-- ══════════════════════════════════════
           ARC VARIANT
      ══════════════════════════════════════ -->
      <g v-if="variant === 'arc'">
        <!-- Track -->
        <path :d="trackArcPath" fill="none" :stroke="trackColor"
          :stroke-width="strokeWidth" stroke-linecap="butt" />

        <!-- Zone overlays -->
        <path v-for="(z, i) in zoneArcPaths" :key="`z-${i}`"
          :d="z.path" fill="none" :stroke="z.color"
          :stroke-width="strokeWidth" stroke-linecap="butt" opacity="0.35" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="gradient ? `url(#gg-${uid})` : resolvedColor"
          :stroke-width="strokeWidth" :stroke-linecap="lineCap"
          :filter="`url(#gs-${uid})`" />

        <!-- Needle (rendered before text so text stays on top) -->
        <g v-if="showNeedle">
          <path :d="needlePath"
            :fill="needleColor ?? resolvedColor"
            :fill-opacity="0.88"
          />
          <!-- Hub circle -->
          <circle :cx="cx" :cy="cy" :r="hubR"
            :fill="`url(#nh-${uid})`"
            stroke="var(--color-background)"
            stroke-width="2.5"
          />
        </g>

        <!-- Center text — always rendered last (on top of needle) -->
        <foreignObject
          :x="cx - size * 0.38"
          :y="textCy - size * 0.1"
          :width="size * 0.76"
          :height="size * 0.22"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span v-if="showValue" class="font-black tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize}px`, color: 'var(--color-foreground)' }">
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
        <line v-for="(tk, i) in ticks" :key="`tk-${i}`"
          :x1="tk.x1" :y1="tk.y1" :x2="tk.x2" :y2="tk.y2"
          :stroke="tk.filled ? (gradient ? `url(#tg-${uid})` : resolvedColor) : trackColor"
          :stroke-width="tickWidth" stroke-linecap="round"
          :opacity="tk.filled ? 1 : 0.45" />

        <foreignObject :x="cx - size * 0.38" :y="textCy - size * 0.22"
          :width="size * 0.76" :height="size * 0.44">
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center gap-1">
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span v-if="showValue" class="font-black tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize}px`, color: 'var(--color-foreground)' }">
                {{ displayValue }}
              </span>
              <span v-if="sublabel" class="font-medium leading-tight"
                :style="{ fontSize: `${subLabelFontSize}px`, color: 'var(--color-muted-foreground)' }">
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
        <path :d="trackArcPath" fill="none" :stroke="trackColor"
          :stroke-width="strokeWidth" stroke-linecap="round" opacity="0.5" />

        <!-- Zone overlays -->
        <path v-for="(z, i) in zoneArcPaths" :key="`sz-${i}`"
          :d="z.path" fill="none" :stroke="z.color"
          :stroke-width="strokeWidth" stroke-linecap="butt" opacity="0.3" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="gradient ? `url(#gg-${uid})` : resolvedColor"
          :stroke-width="strokeWidth" :stroke-linecap="lineCap" />

        <!-- Needle (before text) -->
        <g v-if="showNeedle">
          <path :d="needlePath"
            :fill="needleColor ?? resolvedColor"
            :fill-opacity="0.88"
          />
          <circle :cx="cx" :cy="cy" :r="hubR"
            fill="var(--color-background)"
            :stroke="resolvedColor"
            stroke-width="2.5"
          />
        </g>

        <!-- Center text — on top of needle -->
        <foreignObject
          :x="cx - size * 0.38"
          :y="textCy - size * 0.1"
          :width="size * 0.76"
          :height="size * 0.22"
        >
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span v-if="showValue" class="font-bold tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize * 0.82}px`, color: 'var(--color-foreground)' }">
                {{ displayValue }}
              </span>
            </slot>
          </div>
        </foreignObject>
      </g>

      <!-- ══════════════════════════════════════
           BALL VARIANT
           Thick arc with a glowing orb at the tip
      ══════════════════════════════════════ -->
      <g v-else-if="variant === 'ball'">
        <!-- Track (faded) -->
        <path :d="trackArcPath" fill="none" :stroke="trackColor"
          :stroke-width="strokeWidth" stroke-linecap="round" opacity="0.35" />

        <!-- Progress arc -->
        <path v-if="progressArcPath" :d="progressArcPath" fill="none"
          :stroke="gradient ? `url(#gg-${uid})` : resolvedColor"
          :stroke-width="strokeWidth" stroke-linecap="round" />

        <!-- Zone overlays -->
        <path v-for="(z, i) in zoneArcPaths" :key="`bz-${i}`"
          :d="z.path" fill="none" :stroke="z.color"
          :stroke-width="strokeWidth" stroke-linecap="butt" opacity="0.25" />

        <!-- Glowing orb at tip -->
        <g v-if="animPct > 0.005">
          <!-- Outer glow ring -->
          <circle :cx="ballTipPos.x" :cy="ballTipPos.y"
            :r="ballRadius * 1.9" :fill="resolvedColor" opacity="0.18" />
          <!-- Mid glow ring -->
          <circle :cx="ballTipPos.x" :cy="ballTipPos.y"
            :r="ballRadius * 1.35" :fill="resolvedColor" opacity="0.22" />
          <!-- Main orb: white center with colored border -->
          <circle :cx="ballTipPos.x" :cy="ballTipPos.y"
            :r="ballRadius"
            fill="var(--color-background)"
            :stroke="resolvedColor"
            :stroke-width="ballRadius * 0.55"
          />
        </g>

        <!-- Center text -->
        <foreignObject :x="cx - size * 0.38" :y="textCy - size * 0.2"
          :width="size * 0.76" :height="size * 0.42">
          <div xmlns="http://www.w3.org/1999/xhtml"
            class="w-full h-full flex flex-col items-center justify-center text-center">
            <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
              <span v-if="showValue" class="font-black tabular-nums leading-none"
                :style="{ fontSize: `${valueFontSize}px`, color: 'var(--color-foreground)' }">
                {{ displayValue }}
              </span>
              <span v-if="sublabel" class="font-medium mt-1"
                :style="{ fontSize: `${subLabelFontSize}px`, color: 'var(--color-muted-foreground)' }">
                {{ sublabel }}
              </span>
            </slot>
          </div>
        </foreignObject>
      </g>
    </svg>

    <!-- ── Labels below SVG ── -->
    <div
      v-if="(label || sublabel) && variant !== 'ticks' && variant !== 'ball'"
      class="text-center -mt-1"
    >
      <p v-if="label" class="font-semibold text-foreground"
        :style="{ fontSize: `${variant === 'slim' ? labelFontSize * 0.9 : labelFontSize}px` }">
        {{ label }}
      </p>
      <p v-if="sublabel" class="text-muted-foreground mt-0.5"
        :style="{ fontSize: `${subLabelFontSize}px` }">
        {{ sublabel }}
      </p>
    </div>

    <!-- ── Footer slot (ticks CTA, etc.) ── -->
    <slot name="footer" :value="value" :percentage="percentage" :displayValue="displayValue" />
  </div>
</template>
