<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { GanttTask, GanttViewMode } from './types'
import { CHART_COLORS, getColor, animateProgress } from './utils'

export interface GanttChartProps {
  tasks: GanttTask[]
  viewMode?: GanttViewMode
  height?: number
  rowHeight?: number
  barRadius?: number
  barHeight?: number
  sidebarWidth?: number
  showGrid?: boolean
  showTooltip?: boolean
  showLabels?: boolean
  showProgress?: boolean
  showDependencies?: boolean
  showTodayLine?: boolean
  showHeader?: boolean
  animate?: boolean
  colors?: string[]
  todayColor?: string
  locale?: string
}

const props = withDefaults(defineProps<GanttChartProps>(), {
  viewMode: 'week',
  height: 0,
  rowHeight: 44,
  barRadius: 6,
  barHeight: 28,
  sidebarWidth: 220,
  showGrid: true,
  showTooltip: true,
  showLabels: true,
  showProgress: true,
  showDependencies: true,
  showTodayLine: true,
  showHeader: true,
  animate: true,
  colors: () => CHART_COLORS,
  todayColor: 'var(--color-danger)',
  locale: 'en-US',
})

const emit = defineEmits<{
  (e: 'task-click', task: GanttTask): void
  (e: 'task-hover', task: GanttTask | null): void
}>()

// ─── Date helpers ─────────────────────────────
function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d)
}

function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function startOfWeek(d: Date): Date {
  const r = new Date(d)
  const day = r.getDay()
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1)) // Mon = start
  r.setHours(0, 0, 0, 0)
  return r
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

// ─── Responsive container ─────────────────────
const containerRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const containerWidth = ref(800)
let resizeObs: ResizeObserver | null = null

function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((e) => {
    containerWidth.value = e[0].contentRect.width || 800
  })
  resizeObs.observe(containerRef.value)
  containerWidth.value = containerRef.value.clientWidth || 800
}

// ─── Parsed tasks with Date objects ───────────
const parsedTasks = computed(() =>
  props.tasks.map((t, i) => ({
    ...t,
    _start: toDate(t.start),
    _end: toDate(t.end),
    _color: t.color ?? getColor(props.colors!, i),
    _index: i,
  }))
)

// ─── Groups ───────────────────────────────────
const collapsedGroups = ref(new Set<string>())

function toggleGroup(group: string) {
  const s = new Set(collapsedGroups.value)
  if (s.has(group)) s.delete(group)
  else s.add(group)
  collapsedGroups.value = s
}

const groups = computed(() => {
  const map = new Map<string, typeof parsedTasks.value>()
  const ungrouped: typeof parsedTasks.value = []
  for (const t of parsedTasks.value) {
    if (t.group) {
      if (!map.has(t.group)) map.set(t.group, [])
      map.get(t.group)!.push(t)
    } else {
      ungrouped.push(t)
    }
  }
  return { grouped: map, ungrouped }
})

// Build visible row list (respecting collapsed groups)
const rows = computed(() => {
  const result: { type: 'group-header' | 'task'; group?: string; task?: typeof parsedTasks.value[0] }[] = []
  const { grouped, ungrouped } = groups.value

  for (const [groupName, tasks] of grouped) {
    result.push({ type: 'group-header', group: groupName })
    if (!collapsedGroups.value.has(groupName)) {
      for (const t of tasks) {
        result.push({ type: 'task', group: groupName, task: t })
      }
    }
  }

  for (const t of ungrouped) {
    result.push({ type: 'task', task: t })
  }

  return result
})

// ─── Date range ───────────────────────────────
const dateRange = computed(() => {
  if (parsedTasks.value.length === 0) {
    const now = new Date()
    return { start: addDays(now, -7), end: addDays(now, 30) }
  }

  let min = parsedTasks.value[0]._start
  let max = parsedTasks.value[0]._end

  for (const t of parsedTasks.value) {
    if (t._start < min) min = t._start
    if (t._end > max) max = t._end
  }

  // Add padding based on view mode
  const pad = props.viewMode === 'day' ? 2 : props.viewMode === 'week' ? 5 : 15
  return {
    start: addDays(min, -pad),
    end: addDays(max, pad),
  }
})

const totalDays = computed(() => Math.max(1, daysBetween(dateRange.value.start, dateRange.value.end)))

// ─── Column (time unit) computations ──────────
const columnWidth = computed(() => {
  switch (props.viewMode) {
    case 'day': return 40
    case 'week': return 120
    case 'month': return 180
  }
})

const timeColumns = computed(() => {
  const cols: { label: string; sublabel?: string; startDate: Date; endDate: Date; x: number; width: number }[] = []
  const { start, end } = dateRange.value

  if (props.viewMode === 'day') {
    let cursor = new Date(start)
    cursor.setHours(0, 0, 0, 0)
    let i = 0
    while (cursor <= end) {
      const next = addDays(cursor, 1)
      cols.push({
        label: cursor.toLocaleDateString(props.locale, { day: 'numeric' }),
        sublabel: cursor.toLocaleDateString(props.locale, { weekday: 'short' }),
        startDate: new Date(cursor),
        endDate: next,
        x: i * columnWidth.value,
        width: columnWidth.value,
      })
      cursor = next
      i++
    }
  } else if (props.viewMode === 'week') {
    let cursor = startOfWeek(start)
    let i = 0
    while (cursor <= end) {
      const weekEnd = addDays(cursor, 7)
      cols.push({
        label: cursor.toLocaleDateString(props.locale, { month: 'short', day: 'numeric' }),
        sublabel: `W${getWeekNumber(cursor)}`,
        startDate: new Date(cursor),
        endDate: weekEnd,
        x: i * columnWidth.value,
        width: columnWidth.value,
      })
      cursor = weekEnd
      i++
    }
  } else {
    let cursor = startOfMonth(start)
    let i = 0
    while (cursor <= end) {
      const mEnd = endOfMonth(cursor)
      const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
      cols.push({
        label: cursor.toLocaleDateString(props.locale, { month: 'long' }),
        sublabel: String(cursor.getFullYear()),
        startDate: new Date(cursor),
        endDate: next,
        x: i * columnWidth.value,
        width: columnWidth.value,
      })
      cursor = next
      i++
    }
  }
  return cols
})

function getWeekNumber(d: Date): number {
  const date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

// ─── Layout ───────────────────────────────────
const timelineWidth = computed(() => timeColumns.value.length * columnWidth.value)
const headerHeight = computed(() => (props.showHeader ? 56 : 0))
const totalHeight = computed(() => {
  const rowsH = rows.value.length * props.rowHeight
  return Math.max(props.height || rowsH + headerHeight.value, rowsH + headerHeight.value)
})
const bodyHeight = computed(() => totalHeight.value - headerHeight.value)

// ─── Date to X position ──────────────────────
function dateToX(d: Date): number {
  const dayOffset = daysBetween(dateRange.value.start, d)
  return (dayOffset / totalDays.value) * timelineWidth.value
}

// ─── Task bars ────────────────────────────────
const taskBars = computed(() => {
  return rows.value
    .map((row, ri) => {
      if (row.type !== 'task' || !row.task) return null
      const t = row.task
      const x = dateToX(t._start)
      const xEnd = dateToX(t._end)
      const w = Math.max(0, (xEnd - x) * progress.value)
      const fullW = Math.max(0, xEnd - x)
      const y = ri * props.rowHeight + (props.rowHeight - props.barHeight) / 2
      const progressW = t.progress != null ? (fullW * Math.min(100, t.progress)) / 100 : 0
      return {
        task: t,
        x,
        y,
        w,
        fullW,
        progressW: progressW * progress.value,
        rowIndex: ri,
      }
    })
    .filter(Boolean) as {
    task: typeof parsedTasks.value[0]
    x: number
    y: number
    w: number
    fullW: number
    progressW: number
    rowIndex: number
  }[]
})

// ─── Dependency lines ─────────────────────────
const dependencyPaths = computed(() => {
  if (!props.showDependencies) return []
  const taskMap = new Map<string, (typeof taskBars.value)[0]>()
  for (const bar of taskBars.value) {
    taskMap.set(bar.task.id, bar)
  }

  const paths: { d: string; color: string }[] = []

  for (const bar of taskBars.value) {
    if (!bar.task.dependencies?.length) continue
    for (const depId of bar.task.dependencies) {
      const fromBar = taskMap.get(depId)
      if (!fromBar) continue

      // Arrow from end of dependency to start of this task
      const fromX = fromBar.x + fromBar.fullW
      const fromY = fromBar.y + props.barHeight / 2
      const toX = bar.x
      const toY = bar.y + props.barHeight / 2

      const midX = fromX + (toX - fromX) / 2
      const d = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
      paths.push({ d, color: 'var(--color-muted-foreground)' })
    }
  }
  return paths
})

// ─── Today marker ─────────────────────────────
const todayX = computed(() => {
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  return dateToX(now)
})

const todayVisible = computed(() => {
  const now = new Date()
  return now >= dateRange.value.start && now <= dateRange.value.end
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

watch(
  () => [props.tasks, props.viewMode],
  () => {
    if (props.animate) runAnimation()
  },
  { deep: true },
)

onUnmounted(() => {
  cancelAnim?.()
  resizeObs?.disconnect()
})

// ─── Rounded rect path ───────────────────────
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
    'Z',
  ].join(' ')
}

// ─── Milestone diamond path ───────────────────
function diamondPath(cx: number, cy: number, size: number): string {
  return [
    `M ${cx} ${cy - size}`,
    `L ${cx + size} ${cy}`,
    `L ${cx} ${cy + size}`,
    `L ${cx - size} ${cy}`,
    'Z',
  ].join(' ')
}

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{
  x: number
  y: number
  task: GanttTask
  startStr: string
  endStr: string
} | null>(null)
const activeBar = ref<number | null>(null)

function onBarEnter(e: MouseEvent, i: number) {
  if (!props.showTooltip) return
  const bar = taskBars.value[i]
  if (!bar) return
  activeBar.value = i
  emit('task-hover', bar.task)
  const t = bar.task
  tooltip.value = {
    x: e.clientX,
    y: e.clientY,
    task: t,
    startStr: t._start.toLocaleDateString(props.locale, { month: 'short', day: 'numeric', year: 'numeric' }),
    endStr: t._end.toLocaleDateString(props.locale, { month: 'short', day: 'numeric', year: 'numeric' }),
  }
}

function onBarMove(e: MouseEvent) {
  if (tooltip.value) {
    tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
  }
}

function onBarLeave() {
  tooltip.value = null
  activeBar.value = null
  emit('task-hover', null)
}

function onTaskClick(task: GanttTask) {
  emit('task-click', task)
}

// ─── Sidebar scroll sync ─────────────────────
const sidebarRef = ref<HTMLElement>()
const scrollTop = ref(0)

function onTimelineScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
  if (sidebarRef.value) {
    sidebarRef.value.scrollTop = scrollTop.value
  }
}

const uid = Math.random().toString(36).slice(2, 7)

// ─── Format helpers ───────────────────────────
function formatDuration(start: Date, end: Date): string {
  const days = Math.ceil(daysBetween(start, end))
  if (days <= 1) return '1 day'
  if (days < 7) return `${days} days`
  const weeks = Math.floor(days / 7)
  const rem = days % 7
  if (rem === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`
  return `${weeks}w ${rem}d`
}
</script>

<template>
  <div ref="containerRef" class="vlite-gantt-chart w-full select-none">
    <div class="vlite-gantt-wrapper">
      <!-- ═══ Left Sidebar ═══ -->
      <div
        class="vlite-gantt-sidebar"
        :style="{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }">
        <!-- Sidebar header -->
        <div
          v-if="showHeader"
          class="vlite-gantt-sidebar-header"
          :style="{ height: `${headerHeight}px` }">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tasks</span>
        </div>

        <!-- Sidebar rows (scroll-synced) -->
        <div
          ref="sidebarRef"
          class="vlite-gantt-sidebar-body"
          :style="{ height: `${bodyHeight}px` }">
          <div
            v-for="(row, ri) in rows"
            :key="`sidebar-${ri}`"
            class="vlite-gantt-sidebar-row"
            :style="{ height: `${rowHeight}px` }">
            <!-- Group header row -->
            <template v-if="row.type === 'group-header'">
              <button
                class="vlite-gantt-group-toggle"
                @click="toggleGroup(row.group!)">
                <svg
                  class="vlite-gantt-chevron"
                  :class="{ 'vlite-gantt-chevron-collapsed': collapsedGroups.has(row.group!) }"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span class="text-xs font-bold text-foreground uppercase tracking-wide">
                  {{ row.group }}
                </span>
                <span class="vlite-gantt-group-count">
                  {{ groups.grouped.get(row.group!)?.length ?? 0 }}
                </span>
              </button>
            </template>

            <!-- Task name row -->
            <template v-else>
              <div
                class="vlite-gantt-task-name"
                :class="{ 'vlite-gantt-task-name-grouped': !!row.group }"
                @click="row.task && onTaskClick(row.task)">
                <span
                  class="vlite-gantt-task-dot"
                  :style="{ backgroundColor: row.task?._color }" />
                <span class="truncate text-xs font-medium text-foreground">
                  {{ row.task?.name }}
                </span>
                <span
                  v-if="showProgress && row.task?.progress != null"
                  class="vlite-gantt-progress-badge">
                  {{ row.task.progress }}%
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ═══ Right Timeline ═══ -->
      <div
        ref="timelineRef"
        class="vlite-gantt-timeline"
        @scroll="onTimelineScroll">
        <!-- Fixed header -->
        <div
          v-if="showHeader"
          class="vlite-gantt-timeline-header"
          :style="{ height: `${headerHeight}px`, width: `${timelineWidth}px` }">
          <svg :width="timelineWidth" :height="headerHeight" class="overflow-visible">
            <g v-for="(col, ci) in timeColumns" :key="`hdr-${ci}`">
              <line
                :x1="col.x"
                :y1="0"
                :x2="col.x"
                :y2="headerHeight"
                stroke="currentColor"
                stroke-opacity="0.06"
                stroke-width="1" />
              <text
                :x="col.x + col.width / 2"
                :y="headerHeight / 2 - 5"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="11"
                font-weight="600"
                class="fill-foreground">
                {{ col.label }}
              </text>
              <text
                v-if="col.sublabel"
                :x="col.x + col.width / 2"
                :y="headerHeight / 2 + 11"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="10"
                class="fill-muted-foreground">
                {{ col.sublabel }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Timeline body (bars area) -->
        <div
          class="vlite-gantt-timeline-body"
          :style="{ height: `${bodyHeight}px` }">
          <svg
            :width="timelineWidth"
            :height="bodyHeight"
            role="img"
            aria-label="Gantt chart"
            class="overflow-visible">
            <defs>
              <!-- Task bar gradients -->
              <linearGradient
                v-for="(bar, i) in taskBars"
                :key="`grad-${i}`"
                :id="`gantt-grad-${uid}-${i}`"
                x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" :stop-color="bar.task._color" stop-opacity="1" />
                <stop offset="100%" :stop-color="bar.task._color" stop-opacity="0.75" />
              </linearGradient>

              <!-- Progress bar pattern -->
              <linearGradient
                v-for="(bar, i) in taskBars"
                :key="`pgrad-${i}`"
                :id="`gantt-pgrad-${uid}-${i}`"
                x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" :stop-color="bar.task._color" stop-opacity="0.35" />
                <stop offset="100%" :stop-color="bar.task._color" stop-opacity="0.15" />
              </linearGradient>

              <!-- Arrow marker -->
              <marker
                :id="`gantt-arrow-${uid}`"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--color-muted-foreground)" opacity="0.5" />
              </marker>
            </defs>

            <!-- Grid lines -->
            <template v-if="showGrid">
              <line
                v-for="(col, ci) in timeColumns"
                :key="`grid-${ci}`"
                :x1="col.x"
                :y1="0"
                :x2="col.x"
                :y2="bodyHeight"
                stroke="currentColor"
                stroke-opacity="0.06"
                stroke-width="1"
                stroke-dasharray="4 4" />
            </template>

            <!-- Row separator lines -->
            <line
              v-for="(_, ri) in rows"
              :key="`rowline-${ri}`"
              :x1="0"
              :y1="(ri + 1) * rowHeight"
              :x2="timelineWidth"
              :y2="(ri + 1) * rowHeight"
              stroke="currentColor"
              stroke-opacity="0.04"
              stroke-width="1" />

            <!-- Row backgrounds for group headers -->
            <rect
              v-for="(row, ri) in rows"
              :key="`rowbg-${ri}`"
              v-show="row.type === 'group-header'"
              :x="0"
              :y="ri * rowHeight"
              :width="timelineWidth"
              :height="rowHeight"
              fill="currentColor"
              fill-opacity="0.02" />

            <!-- Dependency arrows -->
            <path
              v-for="(dep, di) in dependencyPaths"
              :key="`dep-${di}`"
              :d="dep.d"
              :stroke="dep.color"
              stroke-width="1.5"
              stroke-opacity="0.4"
              fill="none"
              :marker-end="`url(#gantt-arrow-${uid})`"
              class="transition-opacity duration-200" />

            <!-- Task bars -->
            <g v-for="(bar, i) in taskBars" :key="`bar-${i}`">
              <!-- Milestone diamond -->
              <template v-if="bar.task.milestone">
                <path
                  :d="diamondPath(bar.x + bar.fullW / 2, bar.y + barHeight / 2, barHeight * 0.4)"
                  :fill="`url(#gantt-grad-${uid}-${i})`"
                  :stroke="bar.task._color"
                  stroke-width="1.5"
                  stroke-opacity="0.6"
                  class="cursor-pointer"
                  :opacity="activeBar === i ? 0.9 : 1"
                  @mouseenter="(e) => onBarEnter(e, i)"
                  @mousemove="onBarMove"
                  @mouseleave="onBarLeave"
                  @click="onTaskClick(bar.task)" />
              </template>

              <!-- Regular task bar -->
              <template v-else>
                <!-- Background bar (full width, subtle) -->
                <path
                  :d="roundedRectH(bar.x, bar.y, bar.fullW, barHeight, barRadius)"
                  :fill="`url(#gantt-pgrad-${uid}-${i})`"
                  class="pointer-events-none" />

                <!-- Progress fill (actual completed portion) -->
                <path
                  v-if="showProgress && bar.progressW > 0"
                  :d="roundedRectH(bar.x, bar.y, Math.min(bar.progressW, bar.fullW), barHeight, barRadius)"
                  :fill="`url(#gantt-grad-${uid}-${i})`"
                  class="pointer-events-none" />

                <!-- Full-width bar (if no progress mode) -->
                <path
                  v-if="!showProgress"
                  :d="roundedRectH(bar.x, bar.y, bar.w, barHeight, barRadius)"
                  :fill="`url(#gantt-grad-${uid}-${i})`"
                  class="pointer-events-none" />

                <!-- Hover hitbox (invisible, full width) -->
                <rect
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.fullW"
                  :height="barHeight"
                  fill="transparent"
                  class="cursor-pointer"
                  @mouseenter="(e) => onBarEnter(e, i)"
                  @mousemove="onBarMove"
                  @mouseleave="onBarLeave"
                  @click="onTaskClick(bar.task)" />

                <!-- Active highlight -->
                <rect
                  v-if="activeBar === i"
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.fullW"
                  :height="barHeight"
                  :rx="barRadius"
                  :ry="barRadius"
                  fill="currentColor"
                  fill-opacity="0.06"
                  class="pointer-events-none" />

                <!-- Label inside bar -->
                <text
                  v-if="showLabels && bar.fullW > 60"
                  :x="bar.x + 10"
                  :y="bar.y + barHeight / 2"
                  dominant-baseline="middle"
                  font-size="11"
                  font-weight="600"
                  :fill="showProgress ? 'currentColor' : 'white'"
                  :opacity="progress > 0.3 ? 0.85 : 0"
                  class="pointer-events-none">
                  {{ bar.task.name }}
                </text>
              </template>
            </g>

            <!-- Today line -->
            <g v-if="showTodayLine && todayVisible">
              <line
                :x1="todayX"
                :y1="0"
                :x2="todayX"
                :y2="bodyHeight"
                :stroke="todayColor"
                stroke-width="2"
                stroke-opacity="0.7"
                stroke-dasharray="6 3" />
              <circle
                :cx="todayX"
                :cy="0"
                r="4"
                :fill="todayColor"
                fill-opacity="0.9" />
              <text
                :x="todayX"
                :y="-8"
                text-anchor="middle"
                font-size="9"
                font-weight="700"
                :fill="todayColor"
                fill-opacity="0.9">
                TODAY
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- ═══ Tooltip ═══ -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="vlite-chart-tooltip"
        :style="{ left: `${tooltip.x + 14}px`, top: `${tooltip.y - 12}px` }">
        <div class="font-semibold text-xs mb-1.5">{{ tooltip.task.name }}</div>
        <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
          <span class="w-2 h-2 rounded-sm shrink-0"
            :style="{ backgroundColor: (tooltip.task as any)._color ?? tooltip.task.color }" />
          <span>{{ tooltip.startStr }} — {{ tooltip.endStr }}</span>
        </div>
        <div class="text-[10px] text-muted-foreground">
          {{ formatDuration((tooltip.task as any)._start, (tooltip.task as any)._end) }}
        </div>
        <div
          v-if="showProgress && tooltip.task.progress != null"
          class="mt-1.5 flex items-center gap-2">
          <div class="vlite-gantt-tooltip-progress-track">
            <div
              class="vlite-gantt-tooltip-progress-fill"
              :style="{
                width: `${tooltip.task.progress}%`,
                backgroundColor: (tooltip.task as any)._color ?? tooltip.task.color,
              }" />
          </div>
          <span class="text-[10px] font-semibold">{{ tooltip.task.progress }}%</span>
        </div>
        <div
          v-if="tooltip.task.group"
          class="text-[10px] text-muted-foreground mt-1 opacity-60">
          {{ tooltip.task.group }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.vlite-gantt-chart {
  font-family: inherit;
}

.vlite-gantt-wrapper {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
}

/* ─── Sidebar ────────────────────────────── */
.vlite-gantt-sidebar {
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  background: var(--color-background);
  z-index: 2;
}

.vlite-gantt-sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in oklab, var(--color-background) 97%, var(--color-foreground));
}

.vlite-gantt-sidebar-body {
  overflow-y: hidden;
  overflow-x: hidden;
}

.vlite-gantt-sidebar-row {
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent);
}

/* ─── Group toggle ───────────────────────── */
.vlite-gantt-group-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  text-align: left;
}

.vlite-gantt-group-toggle:hover {
  opacity: 0.8;
}

.vlite-gantt-chevron {
  transition: transform 0.2s ease;
  color: var(--color-muted-foreground);
  flex-shrink: 0;
}

.vlite-gantt-chevron-collapsed {
  transform: rotate(-90deg);
}

.vlite-gantt-group-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-muted-foreground);
  background: var(--color-muted);
  padding: 1px 6px;
  border-radius: 99px;
  margin-left: auto;
}

/* ─── Task name ──────────────────────────── */
.vlite-gantt-task-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 4px;
  width: 100%;
  transition: opacity 0.15s;
}

.vlite-gantt-task-name:hover {
  opacity: 0.75;
}

.vlite-gantt-task-name-grouped {
  padding-left: 20px;
}

.vlite-gantt-task-dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
}

.vlite-gantt-progress-badge {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-muted-foreground);
  margin-left: auto;
  flex-shrink: 0;
}

/* ─── Timeline ───────────────────────────── */
.vlite-gantt-timeline {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
}

.vlite-gantt-timeline-header {
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in oklab, var(--color-background) 97%, var(--color-foreground));
}

.vlite-gantt-timeline-body {
  position: relative;
}

/* ─── Tooltip progress ───────────────────── */
.vlite-gantt-tooltip-progress-track {
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-muted);
  overflow: hidden;
}

.vlite-gantt-tooltip-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ─── Scrollbar styling ──────────────────── */
.vlite-gantt-timeline::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.vlite-gantt-timeline::-webkit-scrollbar-track {
  background: transparent;
}

.vlite-gantt-timeline::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar);
  border-radius: 3px;
}

.vlite-gantt-timeline::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-hover);
}

.vlite-gantt-sidebar-body::-webkit-scrollbar {
  width: 0;
  display: none;
}
</style>
