<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ChartDataPoint } from './types'
import { CHART_COLORS, getColor, formatNumber, arcPath, animateProgress } from './utils'

export type PieLabelMode = 'percent' | 'value' | 'label' | 'none' | 'outside'
export type LegendPosition = 'right' | 'bottom'

export interface PieChartProps {
  data: ChartDataPoint[]
  donut?: boolean
  innerRadius?: number
  size?: number
  startAngle?: number
  showLegend?: boolean
  legendPosition?: LegendPosition
  labelMode?: PieLabelMode
  colors?: string[]
  animate?: boolean
  showTooltip?: boolean
  centerLabel?: string
  centerValue?: string
}

const props = withDefaults(defineProps<PieChartProps>(), {
  donut: false,
  innerRadius: 60,
  size: 280,
  startAngle: -90,
  showLegend: true,
  legendPosition: 'right',
  labelMode: 'percent',
  animate: true,
  showTooltip: true,
  colors: () => CHART_COLORS,
})

const uid = Math.random().toString(36).slice(2, 7)
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(1000, (t) => (progress.value = t))
}

onMounted(() => { console.log("PieChart Mounted - donut:", props.donut, "innerR:", innerR.value); if (props.animate) runAnimation() })
watch(() => props.data, () => { if (props.animate) runAnimation() }, { deep: true })
onUnmounted(() => cancelAnim?.())

// ─── Computed geometry ────────────────────────
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const outerR = computed(() => props.size / 2 - (props.labelMode === 'outside' ? 44 : 4))
const innerR = computed(() => props.donut ? outerR.value * (props.innerRadius / 100) : 0)
const total = computed(() => props.data.reduce((a, b) => a + b.value, 0) || 1)

const slices = computed(() => {
  let angle = props.startAngle
  return props.data.map((d, i) => {
    const pct = d.value / total.value
    const sweep = pct * 360 * progress.value
    const color = d.color ?? getColor(props.colors!, i)
    const startA = angle
    const endA = angle + sweep
    angle += pct * 360

    // Mid-angle for label placement
    const mid = ((startA + endA) / 2) * (Math.PI / 180)
    const labelR = outerR.value * 0.65 + (innerR.value * 0.35)
    
    let lx = cx.value + labelR * Math.cos(mid)
    let ly = cy.value + labelR * Math.sin(mid)

    let px1 = 0, py1 = 0, px2 = 0, py2 = 0, px3 = 0, py3 = 0
    let textAnchor = 'middle'

    if (props.labelMode === 'outside') {
      const isRight = Math.cos(mid) >= 0
      px1 = cx.value + outerR.value * Math.cos(mid)
      py1 = cy.value + outerR.value * Math.sin(mid)
      const breakR = outerR.value + 15
      px2 = cx.value + breakR * Math.cos(mid)
      py2 = cy.value + breakR * Math.sin(mid)
      px3 = px2 + 10 * (isRight ? 1 : -1)
      py3 = py2
      
      lx = px3 + 6 * (isRight ? 1 : -1)
      ly = py3
      textAnchor = isRight ? 'start' : 'end'
    }

    const path = arcPath(cx.value, cy.value, outerR.value, startA, endA, innerR.value)

    let label = ''
    if (props.labelMode === 'percent') label = `${Math.round(pct * 100)}%`
    else if (props.labelMode === 'value') label = formatNumber(d.value)
    else if (props.labelMode === 'label') label = d.label
    else if (props.labelMode === 'outside') label = `${formatNumber(d.value)} (${Math.round(pct * 100)}%)`

    return { d, path, color, lx, ly, label, pct, startA, endA, px1, py1, px2, py2, px3, py3, textAnchor }
  })
})

// ─── Tooltip / hover ──────────────────────────
const hoveredIndex = ref<number | null>(null)
const tooltip = ref<{ x: number; y: number; item: typeof slices.value[0] } | null>(null)

function onSliceEnter(e: MouseEvent, i: number) {
  hoveredIndex.value = i
  if (props.showTooltip) {
    tooltip.value = { x: e.clientX, y: e.clientY, item: slices.value[i] }
  }
}

function onSliceMove(e: MouseEvent) {
  if (tooltip.value) {
    tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
  }
}

function onSliceLeave() {
  hoveredIndex.value = null
  tooltip.value = null
}

// Explode offset for hovered slice
function sliceTransform(i: number, startA: number, endA: number): string {
  if (hoveredIndex.value !== i) return ''
  const mid = ((startA + endA) / 2) * (Math.PI / 180)
  const offset = 8
  const tx = Math.cos(mid) * offset
  const ty = Math.sin(mid) * offset
  return `translate(${tx}, ${ty})`
}
</script>

<template>
  <div
    class="vlite-pie-chart inline-flex gap-6 select-none"
    :class="legendPosition === 'bottom' ? 'flex-col items-center' : 'flex-row items-center'">

    <!-- SVG Pie/Donut -->
    <div class="shrink-0">
      <svg
        :width="size"
        :height="size"
        role="img"
        aria-label="Pie chart"
        class="overflow-visible">

        <defs>
          <filter :id="`shadow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12" />
          </filter>
        </defs>

        <!-- Slices -->
        <g :filter="`url(#shadow-${uid})`">
          <path
            v-for="(s, i) in slices"
            :key="i"
            :d="s.path"
            :fill="s.color"
            :transform="sliceTransform(i, s.startA, s.endA)"
            class="cursor-pointer transition-transform duration-200"
            :stroke="'var(--color-background)'"
            stroke-width="2"
            @mouseenter="(e) => onSliceEnter(e, i)"
            @mousemove="onSliceMove"
            @mouseleave="onSliceLeave" />
        </g>

        <!-- Outside Labels Lines -->
        <g v-if="labelMode === 'outside'">
          <polyline
            v-for="(s, i) in slices"
            :key="`line-${i}`"
            :points="`${s.px1},${s.py1} ${s.px2},${s.py2} ${s.px3},${s.py3}`"
            fill="none"
            stroke="var(--color-border)"
            stroke-width="1.5"
            :opacity="s.pct > 0.02 ? Math.min(1, progress * 1.5) : 0" />
        </g>

        <!-- Slice labels -->
        <template v-if="labelMode !== 'none'">
          <text
            v-for="(s, i) in slices"
            :key="`lbl-${i}`"
            :x="s.lx"
            :y="s.ly"
            :text-anchor="labelMode === 'outside' ? s.textAnchor : 'middle'"
            dominant-baseline="middle"
            :font-size="labelMode === 'outside' ? 12 : 11"
            :font-weight="labelMode === 'outside' ? 500 : 600"
            :fill="labelMode === 'outside' ? 'var(--color-foreground)' : 'white'"
            :opacity="s.pct > 0.05 ? 1 : 0">
            {{ s.label }}
          </text>
        </template>

        <!-- Donut center slot / default -->
        <g v-if="donut">
          <slot name="center" :total="total" :data="data">
            <text
              v-if="centerValue"
              :x="cx" :y="centerLabel ? cy - 8 : cy"
              text-anchor="middle"
              dominant-baseline="central"
              font-size="22"
              font-weight="700"
              class="fill-foreground">
              {{ centerValue }}
            </text>
            <text
              v-if="centerLabel"
              :x="cx" :y="cy + (centerValue ? 14 : 0)"
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="12"
              class="fill-muted-foreground">
              {{ centerLabel }}
            </text>
          </slot>
        </g>
      </svg>
    </div>

    <!-- Legend -->
    <div v-if="showLegend" class="flex flex-col gap-2 min-w-[120px]" :class="legendPosition === 'bottom' ? 'flex-row flex-wrap justify-center' : ''">
      <div
        v-for="(item, i) in data"
        :key="i"
        class="flex items-center gap-2 cursor-pointer"
        :class="hoveredIndex !== null && hoveredIndex !== i ? 'opacity-40' : ''"
        style="transition: opacity 0.15s"
        @mouseenter="hoveredIndex = i"
        @mouseleave="hoveredIndex = null">
        <span
          class="w-2.5 h-2.5 rounded-sm shrink-0"
          :style="{ backgroundColor: item.color ?? getColor(colors!, i) }" />
        <div class="min-w-0">
          <div class="text-xs font-medium text-foreground truncate">{{ item.label }}</div>
          <div class="text-[10px] text-muted-foreground">
            {{ formatNumber(item.value) }} ({{ Math.round(item.value / total * 100) }}%)
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y - 10}px` }">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: tooltip.item.color }" />
          <span class="text-xs font-semibold">{{ tooltip.item.d.label }}</span>
        </div>
        <div class="text-xs text-muted-foreground">
          {{ formatNumber(tooltip.item.d.value) }}
          <span class="font-medium text-foreground ml-1">
            ({{ Math.round(tooltip.item.pct * 100) }}%)
          </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
