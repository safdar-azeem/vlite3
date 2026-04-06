<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ChartDataPoint, ChartDataset } from './types'
import {
  CHART_COLORS,
  getColor,
  formatNumber,
  niceYTicks,
  animateProgress,
} from './utils'

export interface BarChartProps {
  data?: ChartDataPoint[]
  datasets?: ChartDataset[]
  labels?: string[]
  height?: number
  orientation?: 'vertical' | 'horizontal'
  barRadius?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showValues?: boolean
  colors?: string[]
  animate?: boolean
  formatValue?: (v: number) => string
}

const props = withDefaults(defineProps<BarChartProps>(), {
  height: 300,
  orientation: 'vertical',
  barRadius: 6,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  showValues: false,
  animate: true,
  colors: () => CHART_COLORS,
})

// ─── Dimensions ───────────────────────────────
const containerRef = ref<HTMLElement>()
const svgWidth = ref(600)

const actualPadding = computed(() => {
  const getLen = (val: string | number) => String(val).length

  if (props.orientation === 'horizontal') {
    const maxLblW = Math.max(2, ...xLabels.value.map(l => getLen(l))) * 6.5
    
    let rightPad = 16
    if (props.showValues) {
      const allVals = allSeries.value.flatMap(s => s.values)
      const maxValW = Math.max(2, ...allVals.map(v => getLen(props.formatValue ? props.formatValue(v) : formatNumber(v)))) * 6.5
      rightPad = Math.max(16, maxValW + 8)
    }

    return {
      top: 16,
      right: rightPad,
      bottom: 0,
      left: Math.max(24, maxLblW + 12)
    }
  }

  // Vertical
  const maxAxisW = Math.max(2, ...yTicks.value.map(t => getLen(props.formatValue ? props.formatValue(t) : formatNumber(t)))) * 6.5
  return {
    top: 24, 
    right: 0,
    bottom: 24,
    left: Math.max(24, maxAxisW + 12)
  }
})

const chartW = computed(() => Math.max(0, svgWidth.value - actualPadding.value.left - actualPadding.value.right))
const chartH = computed(() => Math.max(0, props.height - actualPadding.value.top - actualPadding.value.bottom))

// ─── Normalise data ────────────────────────────
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
      color: '', // will use per-bar color from data
      values: pts.map((p) => p.value),
    },
  ]
})

const isMulti = computed(() => allSeries.value.length > 1 || !!props.datasets?.length)

const xLabels = computed(() => {
  if (props.labels?.length) return props.labels
  if (props.datasets?.length) return allSeries.value[0]?.values.map((_, i) => String(i + 1)) ?? []
  return (props.data ?? []).map((p) => p.label)
})

const barColors = computed(() =>
  (props.data ?? []).map((p, i) => p.color ?? getColor(props.colors!, i))
)

// ─── Y / X axis ───────────────────────────────
const allValues = computed(() => allSeries.value.flatMap((s) => s.values))
const dataMax = computed(() => Math.max(...allValues.value) || 1)
const yTicks = computed(() => niceYTicks(0, dataMax.value, 5))
const yMax = computed(() => yTicks.value[yTicks.value.length - 1] || dataMax.value)

// ─── Animation ────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(800, (t) => (progress.value = t))
}

onMounted(() => {
  setupResize()
  if (props.animate) runAnimation()
})

watch(() => [props.data, props.datasets], () => {
  if (props.animate) runAnimation()
}, { deep: true })

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Responsive ────────────────────────────────
let resizeObs: ResizeObserver | null = null
function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((e) => { svgWidth.value = e[0].contentRect.width || 600 })
  resizeObs.observe(containerRef.value)
  svgWidth.value = containerRef.value.clientWidth || 600
}

// ─── Vertical bar geometry ─────────────────────
const barGeometry = computed(() => {
  const n = xLabels.value.length
  if (n === 0) return []
  const groupW = chartW.value / n
  const seriesCount = allSeries.value.length
  const pad = groupW * 0.2
  const groupInner = groupW - pad * 2
  const bw = isMulti.value ? groupInner / seriesCount : groupInner

  return xLabels.value.map((lbl, xi) => {
    const groupX = xi * groupW + pad
    const bars = allSeries.value.map((s, si) => {
      const val = s.values[xi] ?? 0
      const bh = (val / yMax.value) * chartH.value * progress.value
      const x = groupX + si * bw
      const y = chartH.value - bh
      const color = isMulti.value ? s.color : barColors.value[xi]
      return { val, bh, x, y, w: bw - (isMulti.value ? 2 : 0), color }
    })
    return { label: lbl, bars }
  })
})

// ─── Horizontal bar geometry ───────────────────
const hBarGeometry = computed(() => {
  const n = xLabels.value.length
  if (n === 0) return []
  const rowH = chartH.value / n
  const seriesCount = allSeries.value.length
  const pad = rowH * 0.2
  const rowInner = rowH - pad * 2
  const bh = isMulti.value ? rowInner / seriesCount : rowInner

  // For horizontal we swap axes
  const valueMax = yMax.value

  return xLabels.value.map((lbl, xi) => {
    const groupY = xi * rowH + pad
    const bars = allSeries.value.map((s, si) => {
      const val = s.values[xi] ?? 0
      const bw = (val / valueMax) * chartW.value * progress.value
      const y = groupY + si * bh
      const color = isMulti.value ? s.color : barColors.value[xi]
      return { val, bw, x: 0, y, h: bh - (isMulti.value ? 2 : 0), color }
    })
    return { label: lbl, bars }
  })
})

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; label: string; items: { color: string; label: string; value: string }[] } | null>(null)
const activeGroup = ref<number | null>(null)

function onMouseMove(e: MouseEvent) {
  if (!props.showTooltip) return
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const mx = e.clientX - rect.left - actualPadding.value.left
  const my = e.clientY - rect.top - actualPadding.value.top
  const n = xLabels.value.length
  if (n === 0) return

  let idx: number
  if (props.orientation === 'vertical') {
    idx = Math.floor((mx / chartW.value) * n)
  } else {
    idx = Math.floor((my / chartH.value) * n)
  }
  idx = Math.max(0, Math.min(n - 1, idx))
  activeGroup.value = idx

  const items = allSeries.value.map((s, si) => ({
    color: isMulti.value ? s.color : barColors.value[idx],
    label: s.label,
    value: props.formatValue ? props.formatValue(s.values[idx]) : formatNumber(s.values[idx]),
  }))

  tooltip.value = {
    x: e.clientX,
    y: e.clientY,
    label: xLabels.value[idx],
    items,
  }
}

function onMouseLeave() {
  tooltip.value = null
  activeGroup.value = null
}

// ─── Rounded rect path helper ──────────────────
function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.min(r, w / 2, h / 2)
  if (cr <= 0 || h <= 0) return `M${x},${y + h} L${x},${y} L${x + w},${y} L${x + w},${y + h} Z`
  return `M${x},${y + h} L${x},${y + cr} Q${x},${y} ${x + cr},${y} L${x + w - cr},${y} Q${x + w},${y} ${x + w},${y + cr} L${x + w},${y + h} Z`
}

function roundedRectH(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.min(r, w / 2, h / 2)
  if (cr <= 0 || w <= 0) return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`
  return `M${x},${y} L${x + w - cr},${y} Q${x + w},${y} ${x + w},${y + cr} L${x + w},${y + h - cr} Q${x + w},${y + h} ${x + w - cr},${y + h} L${x},${y + h} Z`
}

const uid = Math.random().toString(36).slice(2, 7)
</script>

<template>
  <div ref="containerRef" class="vlite-bar-chart w-full select-none">
    <!-- Legend -->
    <div
      v-if="showLegend && isMulti"
      class="flex flex-wrap gap-x-4 gap-y-1 mb-3 pl-14">
      <div v-for="s in allSeries" :key="s.label" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span class="w-2.5 h-2.5 rounded-sm inline-block" :style="{ backgroundColor: s.color }" />
        {{ s.label }}
      </div>
    </div>

    <!-- SVG -->
    <svg
      :width="svgWidth"
      :height="height"
      role="img"
      aria-label="Bar chart"
      class="overflow-visible"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave">

      <defs>
        <linearGradient
          v-for="(s, i) in allSeries"
          :key="i"
          :id="`bgrad-${uid}-${i}`"
          x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="s.color" stop-opacity="1" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0.7" />
        </linearGradient>
        <linearGradient
          v-for="(c, i) in barColors"
          :key="`sc-${i}`"
          :id="`bgrad-single-${uid}-${i}`"
          x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="c" stop-opacity="1" />
          <stop offset="100%" :stop-color="c" stop-opacity="0.7" />
        </linearGradient>
      </defs>

      <!-- Vertical orientation -->
      <g v-if="orientation === 'vertical'" :transform="`translate(${actualPadding.left},${actualPadding.top})`">
        <!-- Grid -->
        <template v-if="showGrid">
          <line
            v-for="tick in yTicks" :key="tick"
            :x1="0" :y1="chartH - (tick / yMax) * chartH"
            :x2="chartW" :y2="chartH - (tick / yMax) * chartH"
            stroke="currentColor" stroke-opacity="0.07" stroke-width="1" />
        </template>

        <!-- Y ticks -->
        <text
          v-for="tick in yTicks" :key="`yt-${tick}`"
          :x="-10" :y="chartH - (tick / yMax) * chartH"
          text-anchor="end" dominant-baseline="middle"
          font-size="11" class="fill-muted-foreground">
          {{ formatValue ? formatValue(tick) : formatNumber(tick) }}
        </text>

        <!-- Bars -->
        <g v-for="(group, gi) in barGeometry" :key="gi">
          <path
            v-for="(bar, bi) in group.bars" :key="bi"
            :d="roundedRect(bar.x, bar.y, bar.w, bar.bh, barRadius)"
            :fill="isMulti ? `url(#bgrad-${uid}-${bi})` : `url(#bgrad-single-${uid}-${gi})`"
            :opacity="activeGroup !== null && activeGroup !== gi ? 0.5 : 1"
            class="transition-opacity duration-150" />
          <!-- Value labels -->
          <text
            v-if="showValues"
            v-for="(bar, bi) in group.bars" :key="`vl-${bi}`"
            :x="bar.x + bar.w / 2"
            :y="bar.y - 6"
            text-anchor="middle"
            font-size="10"
            font-weight="600"
            class="fill-foreground">
            {{ formatValue ? formatValue(bar.val) : formatNumber(bar.val) }}
          </text>
        </g>

        <!-- X axis labels -->
        <text
          v-for="(lbl, i) in xLabels" :key="`xl-${i}`"
          :x="(i + 0.5) * (chartW / xLabels.length)"
          :y="chartH + 16"
          text-anchor="middle" font-size="11"
          class="fill-muted-foreground">
          {{ lbl }}
        </text>

        <!-- Axis lines -->
        <line :x1="0" :y1="chartH" :x2="chartW" :y2="chartH" stroke="currentColor" stroke-opacity="0.1" />
        <line :x1="0" :y1="0" :x2="0" :y2="chartH" stroke="currentColor" stroke-opacity="0.1" />
      </g>

      <!-- Horizontal orientation -->
      <g v-else :transform="`translate(${actualPadding.left},${actualPadding.top})`">
        <!-- Grid -->
        <template v-if="showGrid">
          <line
            v-for="tick in yTicks" :key="tick"
            :x1="(tick / yMax) * chartW" :y1="0"
            :x2="(tick / yMax) * chartW" :y2="chartH"
            stroke="currentColor" stroke-opacity="0.07" stroke-width="1" />
        </template>

        <!-- X ticks (top) -->
        <text
          v-for="tick in yTicks" :key="`xt-${tick}`"
          :x="(tick / yMax) * chartW" :y="-8"
          text-anchor="middle"
          font-size="11" class="fill-muted-foreground">
          {{ formatValue ? formatValue(tick) : formatNumber(tick) }}
        </text>

        <!-- Y labels (left) -->
        <text
          v-for="(lbl, i) in xLabels" :key="`yl-${i}`"
          :x="-12"
          :y="(i + 0.5) * (chartH / xLabels.length)"
          text-anchor="end" dominant-baseline="middle"
          font-size="11" class="fill-muted-foreground">
          {{ lbl }}
        </text>

        <!-- Bars -->
        <g v-for="(group, gi) in hBarGeometry" :key="gi">
          <path
            v-for="(bar, bi) in group.bars" :key="bi"
            :d="roundedRectH(bar.x, bar.y, bar.bw, bar.h, barRadius)"
            :fill="isMulti ? `url(#bgrad-${uid}-${bi})` : `url(#bgrad-single-${uid}-${gi})`"
            :opacity="activeGroup !== null && activeGroup !== gi ? 0.5 : 1"
            class="transition-opacity duration-150" />
          <!-- Value labels -->
          <text
            v-if="showValues"
            v-for="(bar, bi) in group.bars" :key="`hvl-${bi}`"
            :x="bar.bw + 6"
            :y="bar.y + bar.h / 2"
            dominant-baseline="middle"
            font-size="10" font-weight="600"
            class="fill-foreground">
            {{ formatValue ? formatValue(bar.val) : formatNumber(bar.val) }}
          </text>
        </g>

        <!-- Axis lines -->
        <line :x1="0" :y1="0" :x2="0" :y2="chartH" stroke="currentColor" stroke-opacity="0.1" />
        <line :x1="0" :y1="chartH" :x2="chartW" :y2="chartH" stroke="currentColor" stroke-opacity="0.1" />
      </g>
    </svg>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y - 10}px` }">
        <div class="font-medium text-xs mb-1.5">{{ tooltip.label }}</div>
        <div v-for="item in tooltip.items" :key="item.label" class="flex items-center gap-1.5 text-xs">
          <span class="w-2 h-2 rounded-sm shrink-0" :style="{ backgroundColor: item.color }" />
          <span v-if="item.label" class="text-muted-foreground">{{ item.label }}:</span>
          <span class="font-semibold">{{ item.value }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
