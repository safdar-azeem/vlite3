<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ChartDataPoint, ChartColor } from './types'
import { CHART_COLORS, getColor, resolveColor, animateProgress } from './utils'

export interface WaffleChartProps {
  value?: number
  max?: number
  data?: ChartDataPoint[]
  cellCount?: number
  columns?: number
  cellRadius?: number
  cellGap?: number
  color?: ChartColor
  colors?: string[]
  trackColor?: string
  animate?: boolean
  showTooltip?: boolean
}

const props = withDefaults(defineProps<WaffleChartProps>(), {
  max: 100,
  cellCount: 30,
  cellRadius: 6,
  cellGap: 4,
  color: 'primary',
  colors: () => CHART_COLORS,
  animate: true,
  showTooltip: true,
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

// ─── Animation ────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(1000, (t) => (progress.value = t))
}

onMounted(() => {
  setupResize()
  if (props.animate) runAnimation()
})

watch([() => props.value, () => props.data], () => {
  if (props.animate) runAnimation()
}, { deep: true })

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Cell layout ──────────────────────────────
const cols = computed(() => {
  if (props.columns) return props.columns
  // Auto-fit: single row
  return props.cellCount
})

const rows = computed(() => Math.ceil(props.cellCount / cols.value))

const cellSize = computed(() => {
  const available = containerWidth.value - (cols.value - 1) * props.cellGap
  return Math.max(4, available / cols.value)
})

const svgHeight = computed(() =>
  rows.value * cellSize.value + (rows.value - 1) * props.cellGap
)

// ─── Cell coloring ────────────────────────────
const resolvedTrackColor = computed(() => props.trackColor ?? 'var(--color-muted)')
const resolvedColor = computed(() => resolveColor(props.color ?? 'primary'))

const cellColors = computed(() => {
  const n = props.cellCount
  const animatedCells = Math.round(progress.value * n)

  if (props.data && props.data.length > 0) {
    // Multi-segment mode
    const total = props.data.reduce((a, b) => a + b.value, 0) || 1
    const result: { color: string; filled: boolean; label: string }[] = []
    let filledSoFar = 0

    for (let di = 0; di < props.data.length; di++) {
      const d = props.data[di]
      const pct = d.value / total
      const segmentCells = di === props.data.length - 1
        ? n - filledSoFar // last segment gets remainder
        : Math.round(pct * n)
      const color = d.color ?? getColor(props.colors!, di)

      for (let j = 0; j < segmentCells && filledSoFar + j < n; j++) {
        result.push({
          color,
          filled: filledSoFar + j < animatedCells,
          label: d.label,
        })
      }
      filledSoFar += segmentCells
    }

    // Fill remaining with track
    while (result.length < n) {
      result.push({ color: resolvedTrackColor.value, filled: false, label: '' })
    }
    return result
  }

  // Single value mode
  const filledCount = Math.round((Math.min(props.value ?? 0, props.max) / props.max) * n)
  return Array.from({ length: n }, (_, i) => ({
    color: i < filledCount ? resolvedColor.value : resolvedTrackColor.value,
    filled: i < filledCount && i < animatedCells,
    label: '',
  }))
})

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; text: string } | null>(null)
const activeCell = ref<number | null>(null)

function onCellEnter(e: MouseEvent, i: number) {
  if (!props.showTooltip) return
  activeCell.value = i
  const cell = cellColors.value[i]
  const text = cell.label ? cell.label : (cell.filled ? 'Filled' : 'Empty')
  tooltip.value = { x: e.clientX, y: e.clientY, text }
}

function onCellMove(e: MouseEvent) {
  if (tooltip.value) tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
}

function onCellLeave() {
  tooltip.value = null
  activeCell.value = null
}

// ─── Cell position helper ─────────────────────
function cellPos(i: number): { x: number; y: number } {
  const col = i % cols.value
  const row = Math.floor(i / cols.value)
  return {
    x: col * (cellSize.value + props.cellGap),
    y: row * (cellSize.value + props.cellGap),
  }
}
</script>

<template>
  <div ref="containerRef" class="vlite-waffle-chart w-full select-none">
    <svg
      :width="containerWidth"
      :height="svgHeight"
      role="img"
      aria-label="Waffle chart"
      class="overflow-visible">

      <rect
        v-for="(cell, i) in cellColors"
        :key="i"
        :x="cellPos(i).x"
        :y="cellPos(i).y"
        :width="cellSize"
        :height="cellSize"
        :rx="cellRadius"
        :ry="cellRadius"
        :fill="cell.filled ? cell.color : resolvedTrackColor"
        :opacity="cell.filled ? 1 : 0.35"
        class="cursor-pointer"
        :style="{
          transition: `opacity 0.15s, fill 0.3s ${i * 0.02}s`,
        }"
        @mouseenter="(e) => onCellEnter(e, i)"
        @mousemove="onCellMove"
        @mouseleave="onCellLeave" />
    </svg>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y - 10}px` }">
        <div class="text-xs font-medium">{{ tooltip.text }}</div>
      </div>
    </Teleport>
  </div>
</template>
