<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { ChartDataPoint, ChartDataset } from './types'
import {
  CHART_COLORS,
  getColor,
  formatNumber,
  smoothPath,
  linearPath,
  niceYTicks,
  animateProgress,
} from './utils'

export interface LineChartProps {
  data?: ChartDataPoint[]
  datasets?: ChartDataset[]
  labels?: string[]
  height?: number
  smooth?: boolean
  fill?: boolean
  showDots?: boolean
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  colors?: string[]
  animate?: boolean
  xLabel?: string
  yLabel?: string
  formatValue?: (v: number) => string
  yMin?: number
  yMax?: number
  // ─── Axis & grid visual control ───────────────
  /** Show the bottom X-axis border line */
  showXAxis?: boolean
  /** Show the left Y-axis border line */
  showYAxis?: boolean
  /** Show X-axis tick labels */
  showXLabels?: boolean
  /** Show Y-axis tick labels */
  showYLabels?: boolean
  /** Opacity of gridlines (0–1) */
  gridOpacity?: number
  /** Opacity of axis border lines (0–1) */
  axisOpacity?: number
  /** Stroke width of the chart lines */
  lineWidth?: number
}

const props = withDefaults(defineProps<LineChartProps>(), {
  height: 300,
  smooth: true,
  fill: true,
  showDots: true,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  animate: true,
  colors: () => CHART_COLORS,
  showXAxis: true,
  showYAxis: true,
  showXLabels: true,
  showYLabels: true,
  gridOpacity: 0.07,
  axisOpacity: 0.1,
  lineWidth: 2.5,
})

// ─── Dimensions ───────────────────────────────
const containerRef = ref<HTMLElement>()
const svgWidth = ref(600)

const xLabels = computed(() => {
  if (props.labels?.length) return props.labels
  if (props.datasets?.length) return props.datasets[0].data.map((_, i) => String(i + 1))
  return (props.data ?? []).map((p) => p.label)
})

// Check if labels are dense enough to require slanting (-45 deg)
const needsSlant = computed(() => {
  if (!props.showXLabels || xLabels.value.length === 0) return false
  const maxVisibleFlat = Math.max(2, Math.floor(svgWidth.value / 65))
  return xLabels.value.length > maxVisibleFlat
})

const actualPadding = computed(() => {
  const getLen = (val: string | number) => String(val).length
  // Only measure text width when labels are actually visible
  const maxAxisW = props.showYLabels
    ? Math.max(2, ...yTicks.value.map(t => getLen(props.formatValue ? props.formatValue(t) : formatNumber(t)))) * 6.5
    : 0
  const leftBase = props.showYLabels ? Math.max(24, maxAxisW + 12) : 8

  // Increase bottom padding if labels are slanted
  let bottomBase = props.showXLabels ? 24 : 6
  if (props.showXLabels && needsSlant.value) {
    const maxLen = Math.max(2, ...xLabels.value.map(l => String(l).length))
    // Slanted text requires approx (length * charWidth * sin(45)) + basePadding
    bottomBase = (maxLen * 6.5 * 0.7) + 16
  }

  return {
    top: 16,
    right: 16,
    bottom: bottomBase,
    left: leftBase + (props.yLabel ? 20 : 0)
  }
})

const chartW = computed(() => Math.max(0, svgWidth.value - actualPadding.value.left - actualPadding.value.right))
const chartH = computed(() => Math.max(0, props.height - actualPadding.value.top - actualPadding.value.bottom))

// ─── Normalise data into series ────────────────
const allSeries = computed(() => {
  if (props.datasets?.length) {
    return props.datasets.map((ds, i) => ({
      label: ds.label,
      color: ds.color ?? getColor(props.colors!, i),
      values: ds.data,
    }))
  }
  const pts = props.data ?? []
  return [
    {
      label: '',
      color: getColor(props.colors!, 0),
      values: pts.map((p) => p.value),
    },
  ]
})

// ─── Label Overlap Prevention ──────────────────
const xLabelStep = computed(() => {
  // If slanted, we can fit labels much closer horizontally (e.g., every ~25px)
  const itemWidth = needsSlant.value ? 25 : 65
  const maxVisible = Math.max(2, Math.floor(chartW.value / itemWidth))
  return Math.ceil(xLabels.value.length / maxVisible)
})

const isVisibleLabel = (i: number) => {
  const n = xLabels.value.length
  if (xLabelStep.value <= 1) return true
  if (i === 0 || i === n - 1) return true // Always show first and last
  if (n - 1 - i < xLabelStep.value * 0.7) return false // Prevent overlap with the last label
  return i % xLabelStep.value === 0
}

// ─── Y Axis ───────────────────────────────────
const allValues = computed(() => allSeries.value.flatMap((s) => s.values))
const dataMin = computed(() => props.yMin ?? Math.min(0, ...allValues.value))
const dataMax = computed(() => props.yMax ?? (Math.max(...allValues.value) || 1))
const yTicks = computed(() => niceYTicks(dataMin.value, dataMax.value, 5))
const yMin = computed(() => yTicks.value[0])
const yMax = computed(() => yTicks.value[yTicks.value.length - 1])
const yRange = computed(() => yMax.value - yMin.value || 1)

function toY(v: number) {
  return chartH.value - ((v - yMin.value) / yRange.value) * chartH.value
}

function toX(i: number) {
  const n = xLabels.value.length
  return n < 2 ? chartW.value / 2 : (i / (n - 1)) * chartW.value
}

// ─── Paths ────────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function buildPoints(values: number[]): [number, number][] {
  return values.map((v, i) => [toX(i), toY(v)])
}

const seriesPaths = computed(() =>
  allSeries.value.map((s) => {
    const pts = buildPoints(s.values)
    const line = props.smooth ? smoothPath(pts) : linearPath(pts)

    // Animated: clip progress by drawing partial path via stroke-dasharray
    // We compute fill path too (close area to x-axis)
    const firstX = pts[0]?.[0] ?? 0
    const lastX = pts[pts.length - 1]?.[0] ?? chartW.value
    const baseY = toY(Math.max(0, yMin.value))
    const fillPath = line + ` L ${lastX},${baseY} L ${firstX},${baseY} Z`

    return { line, fillPath, pts, color: s.color, label: s.label }
  })
)

// ─── Animation ────────────────────────────────
function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(900, (t) => {
    progress.value = t
  })
}

onMounted(() => {
  setupResize()
  if (props.animate) runAnimation()
})

watch(
  () => [props.data, props.datasets],
  () => {
    if (props.animate) runAnimation()
  },
  { deep: true }
)

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Responsive Resize ────────────────────────
let resizeObs: ResizeObserver | null = null

function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((entries) => {
    svgWidth.value = entries[0].contentRect.width || 600
  })
  resizeObs.observe(containerRef.value)
  svgWidth.value = containerRef.value.clientWidth || 600
}

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; label: string; items: { color: string; label: string; value: string }[] } | null>(null)
const activeIndex = ref<number | null>(null)

function onMouseMove(e: MouseEvent) {
  if (!props.showTooltip) return
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const mx = e.clientX - rect.left - actualPadding.value.left
  const n = xLabels.value.length
  if (n === 0) return

  const stepW = n < 2 ? chartW.value : chartW.value / (n - 1)
  const idx = Math.round(mx / stepW)
  const clamped = Math.max(0, Math.min(n - 1, idx))
  activeIndex.value = clamped

  const items = allSeries.value.map((s) => ({
    color: s.color,
    label: s.label,
    value: props.formatValue ? props.formatValue(s.values[clamped]) : formatNumber(s.values[clamped]),
  }))

  const ttX = toX(clamped) + actualPadding.value.left
  const ttY = toY(allSeries.value[0].values[clamped]) + actualPadding.value.top

  tooltip.value = {
    x: ttX,
    y: ttY,
    label: xLabels.value[clamped],
    items,
  }
}

function onMouseLeave() {
  tooltip.value = null
  activeIndex.value = null
}

// ─── Unique ids for gradient/clip defs ────────
const uid = Math.random().toString(36).slice(2, 7)
</script>

<template>
  <div ref="containerRef" class="vlite-line-chart w-full select-none">
    <div
      v-if="showLegend && allSeries.length > 1"
      class="flex flex-wrap gap-x-4 gap-y-1 mb-3 pl-14">
      <div v-for="s in allSeries" :key="s.label" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span class="w-3 h-0.5 rounded-full inline-block" :style="{ backgroundColor: s.color }" />
        {{ s.label }}
      </div>
    </div>

    <svg
      :width="svgWidth"
      :height="height"
      role="img"
      aria-label="Line chart"
      class="overflow-visible"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave">

      <defs>
        <clipPath :id="`clip-${uid}`">
          <rect :x="0" :y="-10" :width="chartW * progress" :height="chartH + 20" />
        </clipPath>

        <linearGradient
          v-for="(s, i) in allSeries"
          :key="i"
          :id="`grad-${uid}-${i}`"
          x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="s.color" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <g :transform="`translate(${actualPadding.left},${actualPadding.top})`">

        <template v-if="showGrid">
          <line
            v-for="tick in yTicks"
            :key="tick"
            :x1="0" :y1="toY(tick)"
            :x2="chartW" :y2="toY(tick)"
            stroke="currentColor"
            :stroke-opacity="gridOpacity"
            stroke-width="1" />
        </template>

        <template v-if="showYLabels">
          <text
            v-for="tick in yTicks"
            :key="`yt-${tick}`"
            :x="-10" :y="toY(tick)"
            text-anchor="end"
            dominant-baseline="middle"
            class="fill-muted-foreground text-[10px]"
            font-size="11">
            {{ formatValue ? formatValue(tick) : formatNumber(tick) }}
          </text>
        </template>

        <template v-if="showXLabels">
          <text
            v-for="(lbl, i) in xLabels"
            :key="`xl-${i}`"
            v-show="isVisibleLabel(i)"
            :x="toX(i)"
            :y="chartH + (needsSlant ? 12 : 16)"
            :text-anchor="needsSlant ? 'end' : 'middle'"
            :transform="needsSlant ? `rotate(-45, ${toX(i)}, ${chartH + 12})` : undefined"
            class="fill-muted-foreground"
            font-size="11">
            {{ lbl }}
          </text>
        </template>

        <line
          v-if="showXAxis"
          :x1="0" :y1="chartH" :x2="chartW" :y2="chartH"
          stroke="currentColor" :stroke-opacity="axisOpacity" />
        <line
          v-if="showYAxis"
          :x1="0" :y1="0" :x2="0" :y2="chartH"
          stroke="currentColor" :stroke-opacity="axisOpacity" />

        <line
          v-if="activeIndex !== null"
          :x1="toX(activeIndex)" :y1="0"
          :x2="toX(activeIndex)" :y2="chartH"
          stroke="currentColor"
          stroke-opacity="0.12"
          stroke-width="1"
          stroke-dasharray="4 3" />

        <g v-for="(s, si) in seriesPaths" :key="si">
          <path
            v-if="fill"
            :d="s.fillPath"
            :fill="`url(#grad-${uid}-${si})`"
            :clip-path="`url(#clip-${uid})`" />

          <path
            :d="s.line"
            fill="none"
            :stroke="s.color"
            :stroke-width="lineWidth"
            stroke-linejoin="round"
            stroke-linecap="round"
            :clip-path="`url(#clip-${uid})`" />

          <template v-if="showDots">
            <circle
              v-for="(pt, pi) in s.pts"
              :key="pi"
              :cx="pt[0]"
              :cy="pt[1]"
              :r="activeIndex === pi ? 5 : 3.5"
              :fill="s.color"
              class="transition-[r] duration-150"
              :opacity="progress > 0 ? 1 : 0"
              :clip-path="`url(#clip-${uid})`" />
          </template>
        </g>

        <text
          v-if="yLabel"
          :x="-(chartH / 2)"
          :y="-(actualPadding.left - 10)"
          text-anchor="middle"
          transform="rotate(-90)"
          font-size="11"
          class="fill-muted-foreground font-medium">
          {{ yLabel }}
        </text>

        <text
          v-if="xLabel"
          :x="chartW / 2"
          :y="chartH + 40"
          text-anchor="middle"
          font-size="11"
          class="fill-muted-foreground">
          {{ xLabel }}
        </text>
      </g>
    </svg>

    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + (containerRef?.getBoundingClientRect().left ?? 0)}px`, top: `${tooltip.y + (containerRef?.getBoundingClientRect().top ?? 0) - 10}px` }">
        <div class="font-medium text-xs mb-1.5">{{ tooltip.label }}</div>
        <div v-for="item in tooltip.items" :key="item.label" class="flex items-center gap-1.5 text-xs">
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: item.color }" />
          <span v-if="item.label" class="text-muted-foreground">{{ item.label }}:</span>
          <span class="font-semibold">{{ item.value }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.vlite-line-chart {
  position: relative;
}
</style>
