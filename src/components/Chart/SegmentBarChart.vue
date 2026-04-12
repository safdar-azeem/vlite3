<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ChartDataPoint } from './types'
import { CHART_COLORS, getColor, animateProgress } from './utils'

export interface SegmentBarChartProps {
  data: ChartDataPoint[]
  barHeight?: number
  barRadius?: number
  showLabels?: boolean
  showValues?: boolean
  showTooltip?: boolean
  animate?: boolean
  colors?: string[]
  formatValue?: (v: number, pct: number) => string
}

const props = withDefaults(defineProps<SegmentBarChartProps>(), {
  barHeight: 48,
  barRadius: 8,
  showLabels: true,
  showValues: true,
  showTooltip: true,
  animate: true,
  colors: () => CHART_COLORS,
})

// ─── Dimensions ───────────────────────────────
const containerRef = ref<HTMLElement>()
const containerWidth = ref(600)

let resizeObs: ResizeObserver | null = null
function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((e) => { containerWidth.value = e[0].contentRect.width || 600 })
  resizeObs.observe(containerRef.value)
  containerWidth.value = containerRef.value.clientWidth || 600
}

// ─── Data computations ────────────────────────
const total = computed(() => props.data.reduce((a, b) => a + b.value, 0) || 1)

const segments = computed(() => {
  let offset = 0
  return props.data.map((d, i) => {
    const pct = d.value / total.value
    const w = pct * containerWidth.value * progress.value
    const x = offset
    offset += pct * containerWidth.value
    const color = d.color ?? getColor(props.colors!, i)
    return { d, pct, w, x: x * progress.value + (1 - progress.value) * (containerWidth.value / 2), color, fullX: x }
  })
})

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

watch(() => props.data, () => {
  if (props.animate) runAnimation()
}, { deep: true })

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; item: ChartDataPoint; pct: number; color: string } | null>(null)
const activeSegment = ref<number | null>(null)

function onSegEnter(e: MouseEvent, i: number) {
  if (!props.showTooltip) return
  activeSegment.value = i
  const seg = segments.value[i]
  tooltip.value = { x: e.clientX, y: e.clientY, item: seg.d, pct: seg.pct, color: seg.color }
}

function onSegMove(e: MouseEvent) {
  if (tooltip.value) tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
}

function onSegLeave() {
  tooltip.value = null
  activeSegment.value = null
}

// ─── Value display ────────────────────────────
function displayValue(v: number, pct: number): string {
  if (props.formatValue) return props.formatValue(v, pct)
  return `${(pct * 100).toFixed(1)}%`
}

// ─── Label positions ──────────────────────────
const labelPositions = computed(() => {
  let offset = 0
  return props.data.map((d, i) => {
    const pct = d.value / total.value
    const x = offset + (pct * containerWidth.value) / 2
    offset += pct * containerWidth.value
    return { x, label: d.label, color: d.color ?? getColor(props.colors!, i) }
  })
})

const uid = Math.random().toString(36).slice(2, 7)
</script>

<template>
  <div ref="containerRef" class="vlite-segment-bar-chart w-full select-none">
    <!-- Labels above bar -->
    <div
      v-if="showLabels"
      class="flex mb-3"
      :style="{ opacity: progress > 0.2 ? 1 : 0, transition: 'opacity 0.3s' }">
      <div
        v-for="(lbl, i) in labelPositions"
        :key="`lbl-${i}`"
        class="flex flex-col items-start gap-1"
        :style="{ width: `${(data[i].value / total) * 100}%` }">
        <span class="text-xs text-muted-foreground font-medium whitespace-nowrap">{{ lbl.label }}</span>
        <span
          class="inline-block w-1 h-3 rounded-sm"
          :style="{ backgroundColor: lbl.color }" />
      </div>
    </div>

    <!-- Segmented bar -->
    <svg
      :width="containerWidth"
      :height="barHeight"
      role="img"
      aria-label="Segment bar chart"
      class="overflow-visible">

      <defs>
        <clipPath :id="`sb-clip-${uid}`">
          <rect
            x="0" y="0"
            :width="containerWidth"
            :height="barHeight"
            :rx="barRadius"
            :ry="barRadius" />
        </clipPath>
      </defs>

      <g :clip-path="`url(#sb-clip-${uid})`">
        <rect
          v-for="(seg, i) in segments"
          :key="`seg-${i}`"
          :x="seg.fullX"
          y="0"
          :width="seg.pct * containerWidth"
          :height="barHeight"
          :fill="seg.color"
          :opacity="activeSegment !== null && activeSegment !== i ? 0.6 : 1"
          class="cursor-pointer transition-opacity duration-150"
          @mouseenter="(e) => onSegEnter(e, i)"
          @mousemove="onSegMove"
          @mouseleave="onSegLeave" />
      </g>

      <!-- Value labels inside segments -->
      <template v-if="showValues">
        <text
          v-for="(seg, i) in segments"
          :key="`val-${i}`"
          :x="seg.fullX + (seg.pct * containerWidth) / 2"
          :y="barHeight / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="13"
          font-weight="600"
          fill="white"
          class="pointer-events-none"
          :opacity="progress > 0.4 && seg.pct * containerWidth > 50 ? 1 : 0">
          {{ displayValue(seg.d.value, seg.pct) }}
        </text>
      </template>
    </svg>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y - 10}px` }">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: tooltip.color }" />
          <span class="text-xs font-semibold">{{ tooltip.item.label }}</span>
        </div>
        <div class="text-xs text-muted-foreground">
          {{ tooltip.item.value }}
          <span class="font-medium text-foreground ml-1">
            ({{ (tooltip.pct * 100).toFixed(1) }}%)
          </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
