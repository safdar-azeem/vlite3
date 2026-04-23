<script setup lang="ts">
/**
 * GanttChart — performance-optimised with CSS-transform drag preview.
 *
 * During drag we NEVER touch reactive data — we mutate a plain object and
 * apply CSS `transform: translateX(px)` on the affected <g> elements via
 * a non-reactive ref written through `requestAnimationFrame`.
 * This means ZERO re-renders during the entire drag gesture.
 */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
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
  draggable?: boolean
  /** When moving a task, also shift all tasks that depend on it (recursively) */
  cascadeDependencies?: boolean
  zoom?: boolean
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
  draggable: true,
  cascadeDependencies: false,
  zoom: true,
})

const emit = defineEmits<{
  (e: 'task-click', task: GanttTask): void
  (e: 'task-hover', task: GanttTask | null): void
  (e: 'task-update', task: GanttTask, changes: { start: Date; end: Date }): void
}>()

// ─── Date helpers (pure, never trigger reactivity) ─────
function toDate(d: Date | string): Date {
  return d instanceof Date ? new Date(d.getTime()) : new Date(d)
}
function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 86_400_000
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}
function startOfWeek(d: Date): Date {
  const r = new Date(d); const day = r.getDay()
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1))
  r.setHours(0, 0, 0, 0); return r
}
function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1) }

// ─── Responsive container ─────────────────────
const containerRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const containerWidth = ref(800)
let resizeObs: ResizeObserver | null = null

function setupResize() {
  if (!containerRef.value) return
  resizeObs = new ResizeObserver((e) => { containerWidth.value = e[0].contentRect.width || 800 })
  resizeObs.observe(containerRef.value)
  containerWidth.value = containerRef.value.clientWidth || 800
}

// ─── Parsed tasks ─────────────────────────────
const parsedTasks = computed(() =>
  props.tasks.map((t, i) => ({
    ...t,
    _start: toDate(t.start), _end: toDate(t.end),
    _color: t.color ?? getColor(props.colors!, i), _index: i,
  }))
)

// ─── Groups & rows ────────────────────────────
const collapsedGroups = ref(new Set<string>())
function toggleGroup(g: string) {
  const s = new Set(collapsedGroups.value)
  s.has(g) ? s.delete(g) : s.add(g)
  collapsedGroups.value = s
}

const groups = computed(() => {
  const map = new Map<string, typeof parsedTasks.value>()
  const ungrouped: typeof parsedTasks.value = []
  for (const t of parsedTasks.value) {
    if (t.group) { if (!map.has(t.group)) map.set(t.group, []); map.get(t.group)!.push(t) }
    else ungrouped.push(t)
  }
  return { grouped: map, ungrouped }
})

const rows = computed(() => {
  const result: { type: 'group-header' | 'task'; group?: string; task?: typeof parsedTasks.value[0] }[] = []
  for (const [name, tasks] of groups.value.grouped) {
    result.push({ type: 'group-header', group: name })
    if (!collapsedGroups.value.has(name)) for (const t of tasks) result.push({ type: 'task', group: name, task: t })
  }
  for (const t of groups.value.ungrouped) result.push({ type: 'task', task: t })
  return result
})

// ─── Date range ───────────────────────────────
const dateRange = computed(() => {
  if (!parsedTasks.value.length) { const n = new Date(); return { start: addDays(n, -7), end: addDays(n, 30) } }
  let min = parsedTasks.value[0]._start, max = parsedTasks.value[0]._end
  for (const t of parsedTasks.value) { if (t._start < min) min = t._start; if (t._end > max) max = t._end }
  const pad = props.viewMode === 'day' ? 2 : props.viewMode === 'week' ? 5 : 15
  return { start: addDays(min, -pad), end: addDays(max, pad) }
})
const totalDays = computed(() => Math.max(1, daysBetween(dateRange.value.start, dateRange.value.end)))

// ─── Zoom ─────────────────────────────────────
const zoomLevel = ref(1)
let targetScrollLeft: number | null = null

function onWheel(e: WheelEvent) {
  if (!props.zoom) return
  // Use ctrlKey to capture pinch-to-zoom on trackpads or Ctrl+Scroll on mouse
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const el = timelineRef.value
    if (!el) return
    
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - rect.left
    
    const currentScrollX = targetScrollLeft !== null ? targetScrollLeft : el.scrollLeft
    const px = currentScrollX + mx
    
    const oldZoom = zoomLevel.value
    let newZoom = oldZoom * Math.exp(-e.deltaY * 0.005)
    newZoom = Math.max(0.2, Math.min(newZoom, 5))
    if (newZoom === oldZoom) return
    
    zoomLevel.value = newZoom
    
    const scale = newZoom / oldZoom
    const newPx = px * scale
    targetScrollLeft = newPx - mx
    
    nextTick(() => {
      if (timelineRef.value && targetScrollLeft !== null) {
        timelineRef.value.scrollLeft = targetScrollLeft
        targetScrollLeft = null
      }
    })
  }
}

function zoomIn() { 
  const el = timelineRef.value
  if (!el) { zoomLevel.value = Math.min(zoomLevel.value + 0.2, 5); return }
  const mx = el.clientWidth / 2
  const px = el.scrollLeft + mx
  const oldZoom = zoomLevel.value
  zoomLevel.value = Math.min(oldZoom + 0.2, 5)
  const scale = zoomLevel.value / oldZoom
  nextTick(() => el.scrollLeft = px * scale - mx)
}

function zoomOut() { 
  const el = timelineRef.value
  if (!el) { zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.2); return }
  const mx = el.clientWidth / 2
  const px = el.scrollLeft + mx
  const oldZoom = zoomLevel.value
  zoomLevel.value = Math.max(oldZoom - 0.2, 0.2)
  const scale = zoomLevel.value / oldZoom
  nextTick(() => el.scrollLeft = px * scale - mx)
}

// ─── Columns ──────────────────────────────────
const columnWidth = computed(() => {
  const base = { day: 40, week: 120, month: 180 }[props.viewMode]
  return base * zoomLevel.value
})
const timeColumns = computed(() => {
  const cols: { label: string; sublabel?: string; x: number; width: number }[] = []
  const { start, end } = dateRange.value
  if (props.viewMode === 'day') {
    let c = new Date(start); c.setHours(0, 0, 0, 0); let i = 0
    while (c <= end) {
      cols.push({ label: c.toLocaleDateString(props.locale, { day: 'numeric' }),
        sublabel: c.toLocaleDateString(props.locale, { weekday: 'short' }), x: i * columnWidth.value, width: columnWidth.value })
      c = addDays(c, 1); i++
    }
  } else if (props.viewMode === 'week') {
    let c = startOfWeek(start); let i = 0
    while (c <= end) {
      cols.push({ label: c.toLocaleDateString(props.locale, { month: 'short', day: 'numeric' }),
        sublabel: `W${getWeekNumber(c)}`, x: i * columnWidth.value, width: columnWidth.value })
      c = addDays(c, 7); i++
    }
  } else {
    let c = startOfMonth(start); let i = 0
    while (c <= end) {
      cols.push({ label: c.toLocaleDateString(props.locale, { month: 'long' }),
        sublabel: String(c.getFullYear()), x: i * columnWidth.value, width: columnWidth.value })
      c = new Date(c.getFullYear(), c.getMonth() + 1, 1); i++
    }
  }
  return cols
})
function getWeekNumber(d: Date): number {
  const date = new Date(d.getTime()); date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const w1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
}

// ─── Layout ───────────────────────────────────
const timelineWidth = computed(() => timeColumns.value.length * columnWidth.value)
const headerHeight = computed(() => props.showHeader ? 56 : 0)
const bodyHeight = computed(() => {
  const rh = rows.value.length * props.rowHeight
  return Math.max(props.height || rh, rh)
})

function dateToX(d: Date): number {
  return (daysBetween(dateRange.value.start, d) / totalDays.value) * timelineWidth.value
}
function pxToDays(px: number): number {
  return (px / timelineWidth.value) * totalDays.value
}

// ─── Task bars (computed ONCE, not during drag) ───────
type BarInfo = {
  task: typeof parsedTasks.value[0]; x: number; y: number
  fullW: number; w: number; progressW: number; rowIndex: number
}

const taskBars = computed<BarInfo[]>(() => {
  const p = progress.value
  return rows.value.reduce<BarInfo[]>((acc, row, ri) => {
    if (row.type !== 'task' || !row.task) return acc
    const t = row.task
    const x = dateToX(t._start), xEnd = dateToX(t._end)
    const fullW = Math.max(8, xEnd - x), w = fullW * p
    const y = ri * props.rowHeight + (props.rowHeight - props.barHeight) / 2
    const progressW = t.progress != null ? (fullW * Math.min(100, t.progress) / 100) * p : 0
    acc.push({ task: t, x, y, fullW, w, progressW, rowIndex: ri })
    return acc
  }, [])
})

// ═══════════════════════════════════════════════
//  DEPENDENCY LINES — orthogonal elbow routing
// ═══════════════════════════════════════════════
const ELBOW_GAP = 16, ARROW_SZ = 5, ELBOW_R = 4

const dependencyPaths = computed(() => {
  if (!props.showDependencies) return []
  const m = new Map<string, BarInfo>()
  for (const b of taskBars.value) m.set(b.task.id, b)
  const out: { d: string; ad: string }[] = []
  for (const bar of taskBars.value) {
    if (!bar.task.dependencies?.length) continue
    for (const depId of bar.task.dependencies) {
      const from = m.get(depId); if (!from) continue
      const fX = from.x + from.fullW, fY = from.y + props.barHeight / 2
      const tX = bar.x, tY = bar.y + props.barHeight / 2
      out.push({ d: elbowPath(fX, fY, tX, tY), ad: arrowHead(tX, tY) })
    }
  }
  return out
})

function elbowPath(fX: number, fY: number, tX: number, tY: number): string {
  const g = ELBOW_GAP, r = ELBOW_R
  if (tX > fX + g * 2) {
    if (Math.abs(fY - tY) < 2) return `M ${fX} ${fY} L ${tX} ${tY}`
    const mX = fX + (tX - fX) / 2
    return rElbow([[fX, fY], [mX, fY], [mX, tY], [tX, tY]], r)
  }
  const eX = fX + g
  if (Math.abs(fY - tY) < props.rowHeight * 0.5) {
    const uY = Math.max(fY, tY) + props.barHeight / 2 + g
    return rElbow([[fX, fY], [eX, fY], [eX, uY], [tX - g, uY], [tX - g, tY], [tX, tY]], r)
  }
  return rElbow([[fX, fY], [eX, fY], [eX, tY], [tX, tY]], r)
}

function rElbow(pts: [number, number][], rad: number): string {
  if (pts.length < 2) return ''
  if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`
  const p: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1]
    const d1x = cx - px, d1y = cy - py, d2x = nx - cx, d2y = ny - cy
    const l1 = Math.hypot(d1x, d1y), l2 = Math.hypot(d2x, d2y)
    const r = Math.min(rad, l1 / 2, l2 / 2)
    p.push(`L ${cx - (d1x / l1) * r} ${cy - (d1y / l1) * r}`)
    p.push(`Q ${cx} ${cy} ${cx + (d2x / l2) * r} ${cy + (d2y / l2) * r}`)
  }
  const last = pts[pts.length - 1]
  p.push(`L ${last[0]} ${last[1]}`)
  return p.join(' ')
}

function arrowHead(x: number, y: number): string {
  return `M ${x} ${y} L ${x - ARROW_SZ} ${y - ARROW_SZ * 0.6} L ${x - ARROW_SZ} ${y + ARROW_SZ * 0.6} Z`
}

// ─── Today ────────────────────────────────────
const todayX = computed(() => { const n = new Date(); n.setHours(12, 0, 0, 0); return dateToX(n) })
const todayVisible = computed(() => { const n = new Date(); return n >= dateRange.value.start && n <= dateRange.value.end })

function scrollToToday() {
  if (!timelineRef.value || !todayVisible.value) return
  timelineRef.value.scrollTo({ left: Math.max(0, todayX.value - (containerWidth.value - props.sidebarWidth) / 2), behavior: 'smooth' })
}

// ═══════════════════════════════════════════════
//  DRAG — CSS-transform approach (ZERO re-renders)
// ═══════════════════════════════════════════════
const RESIZE_HANDLE = 8

// Non-reactive drag state — we write to DOM directly via rAF
let drag = {
  active: false,
  barIndex: -1,
  taskId: '',
  mode: 'move' as 'move' | 'resize-left' | 'resize-right',
  startMouseX: 0,
  pxDelta: 0,
  origStart: null as Date | null,
  origEnd: null as Date | null,
  affectedIds: new Set<string>(), // cascade set
  rafId: 0,
}

// Reactive flags used ONLY for CSS classes (dragging highlight)
const isDragging = ref(false)
const dragTaskId = ref('')
const hoveredBarIndex = ref<number | null>(null)
const cursorStyle = ref('default')

// We keep refs to bar <g> elements to apply transforms directly
const barRefs = ref<(SVGGElement | null)[]>([])
const dragLabelRef = ref<SVGGElement | null>(null)

function setBarRef(el: any, i: number) {
  barRefs.value[i] = el as SVGGElement | null
}

/** Build set of all tasks affected by cascade */
function buildCascadeSet(rootId: string): Set<string> {
  const set = new Set<string>()
  if (!props.cascadeDependencies) return set
  // BFS through dependency graph: find all tasks that depend on rootId (directly or transitively)
  const queue = [rootId]
  while (queue.length) {
    const id = queue.shift()!
    for (const t of parsedTasks.value) {
      if (t.dependencies?.includes(id) && !set.has(t.id)) {
        set.add(t.id)
        queue.push(t.id)
      }
    }
  }
  return set
}

function getZone(e: MouseEvent, bar: BarInfo): 'resize-left' | 'resize-right' | 'move' {
  if (!props.draggable || bar.task.milestone) return 'move'
  const svg = (e.currentTarget as SVGElement).closest('svg')
  if (!svg) return 'move'
  const mx = e.clientX - svg.getBoundingClientRect().left
  if (mx < bar.x + RESIZE_HANDLE) return 'resize-left'
  if (mx > bar.x + bar.fullW - RESIZE_HANDLE) return 'resize-right'
  return 'move'
}

function onBarMouseDown(e: MouseEvent, i: number) {
  if (!props.draggable) return
  const bar = taskBars.value[i]
  if (!bar || bar.task.milestone) return
  e.preventDefault(); e.stopPropagation()

  const zone = getZone(e, bar)
  drag.active = true
  drag.barIndex = i
  drag.taskId = bar.task.id
  drag.mode = zone
  drag.startMouseX = e.clientX
  drag.pxDelta = 0
  drag.origStart = new Date(bar.task._start)
  drag.origEnd = new Date(bar.task._end)
  drag.affectedIds = zone === 'move' ? buildCascadeSet(bar.task.id) : new Set()

  isDragging.value = true
  dragTaskId.value = bar.task.id
  tooltip.value = null
  activeBar.value = i

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.body.style.cursor = zone === 'move' ? 'grabbing' : 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onDragMove(e: MouseEvent) {
  if (!drag.active) return
  drag.pxDelta = e.clientX - drag.startMouseX

  // Clamp resize to prevent zero-width
  if (drag.mode !== 'move' && drag.origStart && drag.origEnd) {
    const origDays = daysBetween(drag.origStart, drag.origEnd)
    const deltaDays = pxToDays(drag.pxDelta)
    if (drag.mode === 'resize-left' && deltaDays >= origDays - 0.5) {
      drag.pxDelta = (origDays - 0.5) / totalDays.value * timelineWidth.value
    }
    if (drag.mode === 'resize-right' && -deltaDays >= origDays - 0.5) {
      drag.pxDelta = -(origDays - 0.5) / totalDays.value * timelineWidth.value
    }
  }

  // Apply CSS transform via rAF — no reactive writes!
  cancelAnimationFrame(drag.rafId)
  drag.rafId = requestAnimationFrame(applyDragTransform)
}

/** Direct DOM manipulation — bypasses Vue's reactivity entirely */
function applyDragTransform() {
  const px = drag.pxDelta
  const el = barRefs.value[drag.barIndex]
  if (!el) return

  if (drag.mode === 'move') {
    el.style.transform = `translateX(${px}px)`
    // Also move cascade dependents
    if (drag.affectedIds.size > 0) {
      for (let j = 0; j < taskBars.value.length; j++) {
        if (drag.affectedIds.has(taskBars.value[j].task.id)) {
          const depEl = barRefs.value[j]
          if (depEl) depEl.style.transform = `translateX(${px}px)`
        }
      }
    }
  } else if (drag.mode === 'resize-right') {
    // Scale width — set a CSS variable that <rect>/<path> can't use directly,
    // so we adjust the clip or just translate the right portion
    // Simplest: just translate the whole bar and we'll recalculate on drop
    el.style.transform = `translateX(0px)`
    // We'll use the scaleAdjust approach: widen via right edge
    const bar = taskBars.value[drag.barIndex]
    if (bar) {
      // Set width adjustment via a data attribute for the overlay
      el.setAttribute('data-resize-px', String(px))
    }
  } else if (drag.mode === 'resize-left') {
    el.style.transform = `translateX(${px}px)`
    const bar = taskBars.value[drag.barIndex]
    if (bar) el.setAttribute('data-resize-px', String(-px))
  }

  // Update the date label directly
  if (dragLabelRef.value && drag.origStart && drag.origEnd) {
    const daysDelta = pxToDays(px)
    const fmt = { month: 'short' as const, day: 'numeric' as const }
    let s: Date, en: Date
    if (drag.mode === 'move') {
      s = addDays(drag.origStart, daysDelta); en = addDays(drag.origEnd, daysDelta)
    } else if (drag.mode === 'resize-left') {
      s = addDays(drag.origStart, daysDelta); en = drag.origEnd
    } else {
      s = drag.origStart; en = addDays(drag.origEnd, daysDelta)
    }
    const bar = taskBars.value[drag.barIndex]
    if (bar) {
      const labelX = drag.mode === 'move' ? bar.x + bar.fullW / 2 + px : bar.x + bar.fullW / 2
      dragLabelRef.value.style.display = ''
      const rect = dragLabelRef.value.querySelector('rect')
      const text = dragLabelRef.value.querySelector('text')
      if (rect) { rect.setAttribute('x', String(labelX - 62)); rect.setAttribute('y', String(bar.y - 20)) }
      if (text) {
        text.setAttribute('x', String(labelX))
        text.setAttribute('y', String(bar.y - 10))
        text.textContent = `${s.toLocaleDateString(props.locale, fmt)} — ${en.toLocaleDateString(props.locale, fmt)}`
      }
    }
  }
}

function onDragEnd() {
  if (!drag.active) return
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  cancelAnimationFrame(drag.rafId)

  const daysDelta = pxToDays(drag.pxDelta)
  const snapped = Math.round(daysDelta * 2) / 2 // snap to half-day

  if (Math.abs(snapped) > 0.1 && drag.origStart && drag.origEnd) {
    const task = parsedTasks.value.find(t => t.id === drag.taskId)
    if (task) {
      let newStart: Date, newEnd: Date
      if (drag.mode === 'move') {
        newStart = addDays(drag.origStart, snapped); newEnd = addDays(drag.origEnd, snapped)
      } else if (drag.mode === 'resize-left') {
        newStart = addDays(drag.origStart, snapped); newEnd = new Date(drag.origEnd)
      } else {
        newStart = new Date(drag.origStart); newEnd = addDays(drag.origEnd, snapped)
      }
      emit('task-update', task, { start: newStart, end: newEnd })

      // Cascade: emit updates for all dependent tasks too
      if (drag.mode === 'move' && drag.affectedIds.size > 0) {
        for (const depId of drag.affectedIds) {
          const depTask = parsedTasks.value.find(t => t.id === depId)
          if (depTask) {
            emit('task-update', depTask, {
              start: addDays(depTask._start, snapped),
              end: addDays(depTask._end, snapped),
            })
          }
        }
      }
    }
  }

  // Clear all transforms
  for (const el of barRefs.value) {
    if (el) { el.style.transform = ''; el.removeAttribute('data-resize-px') }
  }
  if (dragLabelRef.value) dragLabelRef.value.style.display = 'none'

  drag.active = false; drag.barIndex = -1; drag.taskId = ''
  drag.pxDelta = 0; drag.origStart = null; drag.origEnd = null
  drag.affectedIds.clear()
  isDragging.value = false; dragTaskId.value = ''
  activeBar.value = null
}

function updateCursor(e: MouseEvent, bar: BarInfo) {
  if (drag.active || !props.draggable || bar.task.milestone) { cursorStyle.value = drag.active ? 'grabbing' : 'pointer'; return }
  cursorStyle.value = getZone(e, bar) === 'move' ? 'grab' : 'ew-resize'
}

// ─── Animation ────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null
function runAnimation() { cancelAnim?.(); progress.value = 0; cancelAnim = animateProgress(900, t => (progress.value = t)) }

onMounted(() => { setupResize(); if (props.animate) runAnimation() })
watch(() => props.viewMode, () => { 
  zoomLevel.value = 1
  if (props.animate) runAnimation() 
})
// Shallow watch on tasks length/identity — NOT deep
watch(() => props.tasks.length, () => { if (props.animate) runAnimation() })

onUnmounted(() => {
  cancelAnim?.(); resizeObs?.disconnect()
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  cancelAnimationFrame(drag.rafId)
})

// ─── SVG helpers ──────────────────────────────
function rrH(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.min(r, w / 2, h / 2)
  if (cr <= 0 || w <= 0) return `M${x},${y}h${w}v${h}h${-w}Z`
  return `M${x + cr},${y}h${w - 2 * cr}q${cr},0 ${cr},${cr}v${h - 2 * cr}q0,${cr} ${-cr},${cr}h${-(w - 2 * cr)}q${-cr},0 ${-cr},${-cr}v${-(h - 2 * cr)}q0,${-cr} ${cr},${-cr}Z`
}
function diamondPath(cx: number, cy: number, s: number): string {
  return `M${cx},${cy - s}L${cx + s},${cy}L${cx},${cy + s}L${cx - s},${cy}Z`
}

// ─── Tooltip ──────────────────────────────────
const tooltip = ref<{ x: number; y: number; task: GanttTask; startStr: string; endStr: string } | null>(null)
const activeBar = ref<number | null>(null)

function onBarEnter(e: MouseEvent, i: number) {
  if (!props.showTooltip || drag.active) return
  hoveredBarIndex.value = i; activeBar.value = i
  const bar = taskBars.value[i]; if (!bar) return
  emit('task-hover', bar.task)
  const t = bar.task
  tooltip.value = {
    x: e.clientX, y: e.clientY, task: t,
    startStr: t._start.toLocaleDateString(props.locale, { month: 'short', day: 'numeric', year: 'numeric' }),
    endStr: t._end.toLocaleDateString(props.locale, { month: 'short', day: 'numeric', year: 'numeric' }),
  }
  updateCursor(e, bar)
}
function onBarMove(e: MouseEvent, i: number) {
  if (drag.active) return
  if (tooltip.value) tooltip.value = { ...tooltip.value, x: e.clientX, y: e.clientY }
  const bar = taskBars.value[i]; if (bar) updateCursor(e, bar)
}
function onBarLeave() {
  if (drag.active) return
  tooltip.value = null; activeBar.value = null; hoveredBarIndex.value = null
  cursorStyle.value = 'default'; emit('task-hover', null)
}
function onTaskClick(t: GanttTask) { if (!drag.active) emit('task-click', t) }

// ─── Scroll sync ──────────────────────────────
const sidebarRef = ref<HTMLElement>()
function onTimelineScroll(e: Event) {
  if (sidebarRef.value) sidebarRef.value.scrollTop = (e.target as HTMLElement).scrollTop
}

const uid = Math.random().toString(36).slice(2, 7)

function formatDuration(s: Date, e: Date): string {
  const d = Math.ceil(daysBetween(s, e))
  if (d <= 1) return '1 day'; if (d < 7) return `${d} days`
  const w = Math.floor(d / 7), r = d % 7
  return r === 0 ? `${w} week${w > 1 ? 's' : ''}` : `${w}w ${r}d`
}
</script>

<template>
  <div ref="containerRef" class="vlite-gantt-chart w-full select-none">
    <!-- Toolbar -->
    <div v-if="(showTodayLine && todayVisible) || zoom" class="vlite-gantt-toolbar">
      <div v-if="zoom" class="vlite-gantt-zoom-controls">
        <button class="vlite-gantt-btn" @click="zoomOut" :disabled="zoomLevel <= 0.4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>Zoom Out</span>
        </button>
        <button class="vlite-gantt-btn" @click="zoomIn" :disabled="zoomLevel >= 3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>Zoom In</span>
        </button>
      </div>
      <button v-if="showTodayLine && todayVisible" class="vlite-gantt-btn" @click="scrollToToday">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Today</span>
      </button>
    </div>

    <div class="vlite-gantt-wrapper">
      <!-- Sidebar -->
      <div class="vlite-gantt-sidebar" :style="{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }">
        <div v-if="showHeader" class="vlite-gantt-sidebar-header" :style="{ height: `${headerHeight}px` }">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tasks</span>
        </div>
        <div ref="sidebarRef" class="vlite-gantt-sidebar-body" :style="{ height: `${bodyHeight}px` }">
          <div v-for="(row, ri) in rows" :key="`s-${ri}`" class="vlite-gantt-sidebar-row"
            :style="{ height: `${rowHeight}px` }">
            <template v-if="row.type === 'group-header'">
              <button class="vlite-gantt-group-toggle" @click="toggleGroup(row.group!)">
                <svg class="vlite-gantt-chevron" :class="{ 'vlite-gantt-chevron-collapsed': collapsedGroups.has(row.group!) }"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span class="text-xs font-bold text-foreground uppercase tracking-wide">{{ row.group }}</span>
                <span class="vlite-gantt-group-count">{{ groups.grouped.get(row.group!)?.length ?? 0 }}</span>
              </button>
            </template>
            <template v-else>
              <div class="vlite-gantt-task-name"
                :class="{ 'vlite-gantt-task-name-grouped': !!row.group,
                           'vlite-gantt-task-name-dragging': isDragging && dragTaskId === row.task?.id }"
                @click="row.task && onTaskClick(row.task)">
                <span class="vlite-gantt-task-dot" :style="{ backgroundColor: row.task?._color }" />
                <span class="truncate text-xs font-medium text-foreground">{{ row.task?.name }}</span>
                <span v-if="showProgress && row.task?.progress != null" class="vlite-gantt-progress-badge">{{ row.task.progress }}%</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div ref="timelineRef" class="vlite-gantt-timeline" @scroll="onTimelineScroll" @wheel="onWheel">
        <div v-if="showHeader" class="vlite-gantt-timeline-header"
          :style="{ height: `${headerHeight}px`, width: `${timelineWidth}px` }">
          <svg :width="timelineWidth" :height="headerHeight" class="overflow-visible">
            <g v-for="(col, ci) in timeColumns" :key="ci">
              <line :x1="col.x" :y1="0" :x2="col.x" :y2="headerHeight"
                stroke="currentColor" stroke-opacity="0.06" />
              <text :x="col.x + col.width / 2" :y="headerHeight / 2 - 5"
                text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="600"
                class="fill-foreground">{{ col.label }}</text>
              <text v-if="col.sublabel" :x="col.x + col.width / 2" :y="headerHeight / 2 + 11"
                text-anchor="middle" dominant-baseline="middle" font-size="10"
                class="fill-muted-foreground">{{ col.sublabel }}</text>
            </g>
          </svg>
        </div>

        <div class="vlite-gantt-timeline-body" :style="{ height: `${bodyHeight}px` }">
          <svg :width="timelineWidth" :height="bodyHeight" role="img" aria-label="Gantt chart" class="overflow-visible">
            <defs>
              <linearGradient v-for="(bar, i) in taskBars" :key="`g${i}`"
                :id="`gg-${uid}-${i}`" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" :stop-color="bar.task._color" stop-opacity="1" />
                <stop offset="100%" :stop-color="bar.task._color" stop-opacity="0.75" />
              </linearGradient>
              <linearGradient v-for="(bar, i) in taskBars" :key="`p${i}`"
                :id="`gp-${uid}-${i}`" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" :stop-color="bar.task._color" stop-opacity="0.35" />
                <stop offset="100%" :stop-color="bar.task._color" stop-opacity="0.15" />
              </linearGradient>
            </defs>

            <!-- Grid -->
            <template v-if="showGrid">
              <line v-for="(col, ci) in timeColumns" :key="ci"
                :x1="col.x" :y1="0" :x2="col.x" :y2="bodyHeight"
                stroke="currentColor" stroke-opacity="0.06" stroke-dasharray="4 4" />
            </template>

            <!-- Row lines -->
            <line v-for="(_, ri) in rows" :key="ri"
              :x1="0" :y1="(ri + 1) * rowHeight" :x2="timelineWidth" :y2="(ri + 1) * rowHeight"
              stroke="currentColor" stroke-opacity="0.04" />

            <!-- Group backgrounds -->
            <rect v-for="(row, ri) in rows" :key="`bg${ri}`" v-show="row.type === 'group-header'"
              :x="0" :y="ri * rowHeight" :width="timelineWidth" :height="rowHeight"
              fill="currentColor" fill-opacity="0.02" />

            <!-- Dependencies -->
            <g v-for="(dep, di) in dependencyPaths" :key="di" class="vlite-gantt-dep-group">
              <path :d="dep.d" stroke="var(--color-muted-foreground)" stroke-width="1.5"
                stroke-opacity="0.35" fill="none" stroke-linejoin="round" />
              <path :d="dep.ad" fill="var(--color-muted-foreground)" fill-opacity="0.5" />
            </g>

            <!-- Task bars -->
            <g v-for="(bar, i) in taskBars" :key="bar.task.id" :ref="(el) => setBarRef(el, i)"
              :class="{ 'vlite-gantt-bar-dragging': isDragging && (dragTaskId === bar.task.id || drag.affectedIds.has(bar.task.id)) }">

              <template v-if="bar.task.milestone">
                <path :d="diamondPath(bar.x + bar.fullW / 2, bar.y + barHeight / 2, barHeight * 0.4)"
                  :fill="`url(#gg-${uid}-${i})`" :stroke="bar.task._color"
                  stroke-width="1.5" stroke-opacity="0.6" class="cursor-pointer"
                  :opacity="activeBar === i ? 0.9 : 1"
                  @mouseenter="(e) => onBarEnter(e, i)" @mousemove="(e) => onBarMove(e, i)"
                  @mouseleave="onBarLeave" @click="onTaskClick(bar.task)" />
              </template>

              <template v-else>
                <!-- Background -->
                <path :d="rrH(bar.x, bar.y, bar.fullW, barHeight, barRadius)"
                  :fill="`url(#gp-${uid}-${i})`" class="pointer-events-none" />
                <!-- Progress fill -->
                <path v-if="showProgress && bar.progressW > 0"
                  :d="rrH(bar.x, bar.y, Math.min(bar.progressW, bar.fullW), barHeight, barRadius)"
                  :fill="`url(#gg-${uid}-${i})`" class="pointer-events-none" />
                <!-- Full bar (no progress mode) -->
                <path v-if="!showProgress"
                  :d="rrH(bar.x, bar.y, bar.w, barHeight, barRadius)"
                  :fill="`url(#gg-${uid}-${i})`" class="pointer-events-none" />

                <!-- Hitbox -->
                <rect :x="bar.x" :y="bar.y" :width="bar.fullW" :height="barHeight"
                  fill="transparent" :style="{ cursor: cursorStyle }"
                  @mouseenter="(e) => onBarEnter(e, i)" @mousemove="(e) => onBarMove(e, i)"
                  @mouseleave="onBarLeave" @mousedown="(e) => onBarMouseDown(e, i)"
                  @click="onTaskClick(bar.task)" />

                <!-- Hover highlight -->
                <rect v-if="activeBar === i" :x="bar.x" :y="bar.y" :width="bar.fullW" :height="barHeight"
                  :rx="barRadius" :ry="barRadius" fill="currentColor" fill-opacity="0.06"
                  class="pointer-events-none" />

                <!-- Resize handles -->
                <template v-if="draggable && !bar.task.milestone && (hoveredBarIndex === i || (isDragging && dragTaskId === bar.task.id))">
                  <rect :x="bar.x" :y="bar.y + 4" width="4" :height="barHeight - 8"
                    rx="2" fill="currentColor" fill-opacity="0.4" class="pointer-events-none" />
                  <rect :x="bar.x + bar.fullW - 4" :y="bar.y + 4" width="4" :height="barHeight - 8"
                    rx="2" fill="currentColor" fill-opacity="0.4" class="pointer-events-none" />
                </template>

                <!-- Label -->
                <text v-if="showLabels && bar.fullW > 60"
                  :x="bar.x + 12" :y="bar.y + barHeight / 2"
                  dominant-baseline="middle" font-size="11" font-weight="600"
                  :fill="showProgress ? 'currentColor' : 'white'"
                  :opacity="progress > 0.3 ? 0.85 : 0" class="pointer-events-none">
                  {{ bar.task.name }}
                </text>
              </template>
            </g>

            <!-- Drag date label (hidden, manipulated via JS) -->
            <g ref="dragLabelRef" style="display: none">
              <rect x="0" y="0" width="124" height="18" rx="4"
                fill="var(--color-foreground)" fill-opacity="0.85" />
              <text x="0" y="0" text-anchor="middle" dominant-baseline="middle"
                font-size="9" font-weight="600" fill="var(--color-background)" />
            </g>

            <!-- Today line -->
            <g v-if="showTodayLine && todayVisible">
              <line :x1="todayX" :y1="0" :x2="todayX" :y2="bodyHeight"
                :stroke="todayColor" stroke-width="2" stroke-opacity="0.7" stroke-dasharray="6 3" />
              <circle :cx="todayX" :cy="0" r="4" :fill="todayColor" fill-opacity="0.9" />
              <text :x="todayX" :y="-8" text-anchor="middle" font-size="9" font-weight="700"
                :fill="todayColor" fill-opacity="0.9">TODAY</text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div v-if="tooltip && !isDragging" class="vlite-chart-tooltip"
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
        <div v-if="showProgress && tooltip.task.progress != null" class="mt-1.5 flex items-center gap-2">
          <div class="vlite-gantt-tooltip-progress-track">
            <div class="vlite-gantt-tooltip-progress-fill"
              :style="{ width: `${tooltip.task.progress}%`,
                backgroundColor: (tooltip.task as any)._color ?? tooltip.task.color }" />
          </div>
          <span class="text-[10px] font-semibold">{{ tooltip.task.progress }}%</span>
        </div>
        <div v-if="tooltip.task.group" class="text-[10px] text-muted-foreground mt-1 opacity-60">{{ tooltip.task.group }}</div>
        <div v-if="draggable && !tooltip.task.milestone" class="text-[9px] text-muted-foreground mt-1.5 opacity-40">
          Drag to move · Edges to resize
          <template v-if="cascadeDependencies"> · Dependents follow</template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.vlite-gantt-chart { font-family: inherit; }
.vlite-gantt-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; gap: 6px; }
.vlite-gantt-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
  font-size: 11px; font-weight: 600; color: var(--color-muted-foreground);
  background: var(--color-muted); border: 1px solid var(--color-border);
  border-radius: var(--radius); cursor: pointer; transition: all 0.15s;
}
.vlite-gantt-btn:hover:not(:disabled) { background: var(--color-accent); color: var(--color-foreground); }
.vlite-gantt-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.vlite-gantt-zoom-controls { display: flex; gap: 6px; }

.vlite-gantt-wrapper {
  display: flex; border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); overflow: hidden; background: var(--color-background);
}
.vlite-gantt-sidebar { flex-shrink: 0; border-right: 1px solid var(--color-border); background: var(--color-background); z-index: 2; }
.vlite-gantt-sidebar-header { display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--color-border); background: color-mix(in oklab, var(--color-background) 97%, var(--color-foreground)); }
.vlite-gantt-sidebar-body { overflow-y: hidden; overflow-x: hidden; }
.vlite-gantt-sidebar-row { display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent); }

.vlite-gantt-group-toggle { display: flex; align-items: center; gap: 6px; width: 100%; padding: 0 4px; background: none; border: none; cursor: pointer; color: inherit; text-align: left; }
.vlite-gantt-group-toggle:hover { opacity: 0.8; }
.vlite-gantt-chevron { transition: transform 0.2s ease; color: var(--color-muted-foreground); flex-shrink: 0; }
.vlite-gantt-chevron-collapsed { transform: rotate(-90deg); }
.vlite-gantt-group-count { font-size: 10px; font-weight: 600; color: var(--color-muted-foreground); background: var(--color-muted); padding: 1px 6px; border-radius: 99px; margin-left: auto; }

.vlite-gantt-task-name { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 0 4px; width: 100%; transition: all 0.15s; }
.vlite-gantt-task-name:hover { opacity: 0.75; }
.vlite-gantt-task-name-grouped { padding-left: 20px; }
.vlite-gantt-task-name-dragging { background: color-mix(in oklab, var(--color-primary) 8%, transparent); border-radius: 4px; }
.vlite-gantt-task-dot { width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; }
.vlite-gantt-progress-badge { font-size: 10px; font-weight: 700; color: var(--color-muted-foreground); margin-left: auto; flex-shrink: 0; }

.vlite-gantt-timeline { flex: 1; overflow-x: auto; overflow-y: auto; position: relative; }
.vlite-gantt-timeline-header { position: sticky; top: 0; z-index: 1; border-bottom: 1px solid var(--color-border); background: color-mix(in oklab, var(--color-background) 97%, var(--color-foreground)); }
.vlite-gantt-timeline-body { position: relative; }

.vlite-gantt-bar-dragging { filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15)); z-index: 10; }
.vlite-gantt-dep-group { transition: opacity 0.2s; }
.vlite-gantt-dep-group:hover { opacity: 1 !important; }

.vlite-gantt-tooltip-progress-track { width: 60px; height: 4px; border-radius: 2px; background: var(--color-muted); overflow: hidden; }
.vlite-gantt-tooltip-progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }

.vlite-gantt-timeline::-webkit-scrollbar { height: 6px; width: 6px; }
.vlite-gantt-timeline::-webkit-scrollbar-track { background: transparent; }
.vlite-gantt-timeline::-webkit-scrollbar-thumb { background: var(--color-scrollbar); border-radius: 3px; }
.vlite-gantt-timeline::-webkit-scrollbar-thumb:hover { background: var(--color-scrollbar-hover); }
.vlite-gantt-sidebar-body::-webkit-scrollbar { width: 0; display: none; }
</style>
