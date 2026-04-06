<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { resolveColor, animateProgress } from './utils'

export type StrokeLineCap = 'round' | 'square' | 'butt'
export type ChartColor = string

export interface CircleChartProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: ChartColor
  gradient?: boolean
  label?: string
  sublabel?: string
  showValue?: boolean
  formatValue?: (v: number, pct: number) => string
  animate?: boolean
  trackColor?: string
  lineCap?: StrokeLineCap
}

const props = withDefaults(defineProps<CircleChartProps>(), {
  max: 100,
  size: 160,
  strokeWidth: 12,
  color: 'primary',
  gradient: true,
  showValue: true,
  animate: true,
  lineCap: 'round',
})

const uid = Math.random().toString(36).slice(2, 7)

// ─── Geometry ─────────────────────────────────
const r = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * r.value)
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)

const percentage = computed(() => Math.max(0, Math.min(100, (props.value / props.max) * 100)))

// ─── Animation ────────────────────────────────
const animPct = ref(props.animate ? 0 : percentage.value)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  const target = percentage.value
  const start = animPct.value
  cancelAnim = animateProgress(1000, (t) => {
    animPct.value = start + (target - start) * t
  })
}

onMounted(() => { if (props.animate) runAnimation() })
watch(percentage, () => { if (props.animate) runAnimation() })
onUnmounted(() => cancelAnim?.())

// ─── Stroke offset ─────────────────────────────
const strokeDashoffset = computed(() => {
  const filled = (animPct.value / 100) * circumference.value
  return circumference.value - filled
})

// ─── Resolved color ────────────────────────────
const resolvedColor = computed(() => resolveColor(props.color ?? 'primary'))

// ─── Colors for gradient ───────────────────────
const gradientStart = computed(() => {
  const colorMap: Record<string, string> = {
    primary: '#818cf8',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#fb7185',
    info: '#60a5fa',
  }
  const key = props.color ?? 'primary'
  return colorMap[key] ?? resolvedColor.value
})

// ─── Display value ─────────────────────────────
const displayValue = computed(() => {
  if (props.formatValue) return props.formatValue(props.value, percentage.value)
  return `${Math.round(animPct.value)}%`
})

// ─── Track color ──────────────────────────────
const trackColor = computed(() => props.trackColor || 'var(--color-muted)')
</script>

<template>
  <div class="vlite-circle-chart inline-flex flex-col items-center gap-2 select-none">
    <svg
      :width="size"
      :height="size"
      role="img"
      :aria-label="`${displayValue} progress`">

      <defs>
        <!-- Progress gradient -->
        <linearGradient :id="`cg-${uid}`" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="resolvedColor" />
        </linearGradient>
      </defs>

      <!-- Track ring -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        stroke-linecap="butt" />

      <!-- Progress arc -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        fill="none"
        :stroke="gradient ? `url(#cg-${uid})` : resolvedColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        :stroke-linecap="lineCap"
        transform="rotate(-90)"
        :style="{ transformOrigin: `${cx}px ${cy}px` }" />

      <!-- Center content slot or default value -->
      <foreignObject :x="cx - size * 0.35" :y="cy - size * 0.35" :width="size * 0.7" :height="size * 0.7">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="w-full h-full flex flex-col items-center justify-center text-center">
          <slot name="center" :value="value" :percentage="percentage" :displayValue="displayValue">
            <span
              v-if="showValue"
              class="font-bold text-foreground leading-tight"
              :style="{ fontSize: `${size * 0.16}px` }">
              {{ displayValue }}
            </span>
          </slot>
        </div>
      </foreignObject>
    </svg>

    <!-- Labels below ring -->
    <div v-if="label || sublabel" class="text-center">
      <p v-if="label" class="text-sm font-medium text-foreground">{{ label }}</p>
      <p v-if="sublabel" class="text-xs text-muted-foreground">{{ sublabel }}</p>
    </div>
  </div>
</template>
