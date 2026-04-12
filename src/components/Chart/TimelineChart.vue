<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { TimelineTask } from './types'
import { CHART_COLORS, getColor, animateProgress } from './utils'

export interface TimelineChartProps {
  tasks: TimelineTask[]
  periods: string[]
  height?: number
  barRadius?: number
  showGrid?: boolean
  showTooltip?: boolean
  showLabels?: boolean
  animate?: boolean
  colors?: string[]
}

const props = withDefaults(defineProps<TimelineChartProps>(), {
  height: 300,
  barRadius: 20,
  showGrid: true,
  showTooltip: true,
  showLabels: true,
  animate: true,
  colors: () => CHART_COLORS,
})

// ─── Dimensions ───────────────────────────────
const containerRef = ref<HTMLElement>()
const svgWidth = ref(600)

let resizeObs: ResizeObserver | null = null
function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((e) => { svgWidth.value = e[0].contentRect.width || 600 })
  resizeObs.observe(containerRef.value)
  svgWidth.value = containerRef.value.clientWidth || 600
}

// ─── Unique people (Y-axis rows) ──────────────
const people = computed(() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const t of props.tasks) {
    if (!seen.has(t.person)) {
      seen.add(t.person)
      result.push(t.person)
    }
  }
  return result
})

// ─── Layout constants ─────────────────────────
const padding = computed(() => {
  const maxLabelLen = Math.max(2, ...people.value.map(p => p.length))
  const leftPad = Math.max(60, maxLabelLen * 8 + 16)
  return { top: 16, right: 16, bottom: 32, left: leftPad }
})

const chartW = computed(() => Math.max(0, svgWidth.value - padding.value.left - padding.value.right))
const chartH = computed(() => Math.max(0, props.height - padding.value.top - padding.value.bottom))

const rowHeight = computed(() => people.value.length > 0 ? chartH.value / people.value.length : 40)
const barH = computed(() => Math.min(36, rowHeight.value * 0.55))

// ─── Period (X-axis) positions ────────────────
const colWidth = computed(() => props.periods.length > 0 ? chartW.value / props.periods.length : 40)

// ─── Bar geometry ─────────────────────────────
const bars = computed(() => {
  return props.tasks.map((task, ti) => {
    const rowIndex = people.value.indexOf(task.person)
    const y = rowIndex * rowHeight.value + (rowHeight.value - barH.value) / 2
    const x = task.start * colWidth.value
    const w = (task.end - task.start) * colWidth.value
    const color = task.color ?? getColor(props.colors!, ti)
    return { task, x, y, w: w * progress.value, fullW: w, color, rowIndex }
  })
})

// ─── Animation ────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(900, (t) => (progress.value = t))
}

onMounted(() => {
  setupResize()
  if (props.animate) runAnimation()
})

watch(() => [props.tasks, props.periods], () => {
  if (props.animate) runAnimation()
}, { deep: true })

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Rounded rect path helper ─────────────────
function roundedRectH(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.min(r, w / 2, h / 2)
  if (cr <= 0 || w <= 0) return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`
  return [
    `M${x + cr},${y}`,
    `L${x + w - cr},${y}`,
    `Q${x + w},${y} ${x + w},${y + cr}`,
    `L${x + w},${y + h - cr}`,
    `Q${x + w},${y + h} ${x + w - cr},${y + h}`,
    `L${x + cr},${y + h}`,
    `Q${x},${y + h} ${x},${y + h - cr}`,
    `L${x},${y + cr}`,
    `Q${x},${y} ${x + cr},${y}`,
    'Z'
  ].join(' ')
}

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; task: TimelineTask } | null>(null)
const activeBar = ref<number | null>(null)

function onBarEnter(e: MouseEvent, i: number) {
  if (!props.showTooltip) return
  activeBar.value = i
  tooltip.value = { x: e.clientX, y: e.clientY, task: props.tasks[i] }
}

function onBarMove(e: MouseEvent) {
  if (tooltip.value) {
    tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
  }
}

function onBarLeave() {
  tooltip.value = null
  activeBar.value = null
}

const uid = Math.random().toString(36).slice(2, 7)
</script>

<template>
  <div ref="containerRef" class="vlite-timeline-chart w-full select-none">
    <svg
      :width="svgWidth"
      :height="height"
      role="img"
      aria-label="Timeline chart"
      class="overflow-visible">

      <defs>
        <linearGradient
          v-for="(bar, i) in bars"
          :key="i"
          :id="`tl-grad-${uid}-${i}`"
          x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" :stop-color="bar.color" stop-opacity="1" />
          <stop offset="100%" :stop-color="bar.color" stop-opacity="0.8" />
        </linearGradient>
      </defs>

      <g :transform="`translate(${padding.left},${padding.top})`">
        <!-- Dashed grid lines -->
        <template v-if="showGrid">
          <line
            v-for="(_, i) in periods"
            :key="`grid-${i}`"
            :x1="i * colWidth"
            :y1="0"
            :x2="i * colWidth"
            :y2="chartH"
            stroke="currentColor"
            stroke-opacity="0.08"
            stroke-width="1"
            stroke-dasharray="4 4" />
        </template>

        <!-- Row separator lines -->
        <line
          v-for="(_, i) in people"
          :key="`row-${i}`"
          :x1="0"
          :y1="(i + 1) * rowHeight"
          :x2="chartW"
          :y2="(i + 1) * rowHeight"
          stroke="currentColor"
          stroke-opacity="0.04"
          stroke-width="1"
          v-show="i < people.length - 1" />

        <!-- Person name labels (Y-axis) -->
        <text
          v-for="(person, i) in people"
          :key="`person-${i}`"
          :x="-16"
          :y="i * rowHeight + rowHeight / 2"
          text-anchor="end"
          dominant-baseline="middle"
          font-size="13"
          font-weight="500"
          class="fill-foreground">
          {{ person }}
        </text>

        <!-- Task bars -->
        <g v-for="(bar, i) in bars" :key="`bar-${i}`">
          <path
            :d="roundedRectH(bar.x, bar.y, bar.w, barH, barRadius)"
            :fill="`url(#tl-grad-${uid}-${i})`"
            class="cursor-pointer transition-opacity duration-150"
            @mouseenter="(e) => onBarEnter(e, i)"
            @mousemove="onBarMove"
            @mouseleave="onBarLeave" />

          <!-- Task label inside bar -->
          <text
            v-if="showLabels && bar.w > 40"
            :x="bar.x + bar.w / 2"
            :y="bar.y + barH / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="12"
            font-weight="600"
            fill="white"
            :opacity="progress > 0.3 ? 1 : 0"
            class="pointer-events-none">
            {{ bar.task.task }}
          </text>
        </g>

        <!-- X-axis period labels -->
        <text
          v-for="(period, i) in periods"
          :key="`xlbl-${i}`"
          :x="(i + 0.5) * colWidth"
          :y="chartH + 20"
          text-anchor="middle"
          font-size="11"
          class="fill-muted-foreground">
          {{ period }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y - 10}px` }">
        <div class="font-medium text-xs mb-1">{{ tooltip.task.person }}</div>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="w-2 h-2 rounded-sm shrink-0"
            :style="{ backgroundColor: tooltip.task.color ?? getColor(colors!, tasks.indexOf(tooltip.task)) }" />
          <span class="text-muted-foreground">{{ tooltip.task.task }}</span>
        </div>
        <div class="text-[10px] text-muted-foreground mt-1">
          {{ periods[tooltip.task.start] }} — {{ periods[Math.min(tooltip.task.end, periods.length) - 1] }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
