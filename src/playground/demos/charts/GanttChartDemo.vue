<script setup lang="ts">
import { ref } from 'vue'
import GanttChart from '@/components/Chart/GanttChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './GanttChartDemo.vue?raw'
import { ganttTasks as initialTasks } from './chart-data'
import type { GanttTask } from '@/components/Chart/types'

// ─── Live task data (mutable for drag-and-drop) ──
const tasks = ref([...initialTasks])

function onTaskUpdate(task: GanttTask, changes: { start: Date; end: Date }) {
  const idx = tasks.value.findIndex(t => t.id === task.id)
  if (idx < 0) return
  tasks.value[idx] = {
    ...tasks.value[idx],
    start: changes.start.toISOString().slice(0, 10),
    end: changes.end.toISOString().slice(0, 10),
  }
}

function resetTasks() {
  tasks.value = [...initialTasks]
}

// ─── Interactive Controls ──────────────────────
const opts = ref({
  rowHeight: 44,
  barRadius: 6,
  barHeight: 28,
  showGrid: true,
  showLabels: true,
  showTooltip: true,
  showProgress: true,
  showDependencies: true,
  showTodayLine: true,
  showHeader: true,
  animate: true,
  draggable: true,
})

const controls = [
  { key: 'showGrid',         label: 'Grid Lines',    type: 'toggle' as const },
  { key: 'showLabels',       label: 'Bar Labels',    type: 'toggle' as const },
  { key: 'showTooltip',      label: 'Tooltip',       type: 'toggle' as const },
  { key: 'showProgress',     label: 'Progress',      type: 'toggle' as const },
  { key: 'showDependencies', label: 'Dependencies',  type: 'toggle' as const },
  { key: 'showTodayLine',    label: 'Today Line',    type: 'toggle' as const },
  { key: 'showHeader',       label: 'Header',        type: 'toggle' as const },
  { key: 'animate',          label: 'Animate',       type: 'toggle' as const },
  { key: 'draggable',        label: 'Drag & Drop',   type: 'toggle' as const },
  { key: 'barRadius',        label: 'Bar Radius',    type: 'slider' as const, min: 0, max: 16, step: 1 },
  { key: 'barHeight',        label: 'Bar Height',    type: 'slider' as const, min: 16, max: 40, step: 2 },
  { key: 'rowHeight',        label: 'Row Height',    type: 'slider' as const, min: 32, max: 60, step: 2 },
]

const viewMode = ref<'day' | 'week' | 'month'>('week')

const lastAction = ref('')
function onTaskClick(task: GanttTask) {
  lastAction.value = `Clicked: ${task.name}`
  setTimeout(() => { lastAction.value = '' }, 2000)
}
</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Gantt Chart — Project Schedule" :code="sourceCode">
      <div class="space-y-5 w-full">
        <div class="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p class="text-sm text-muted-foreground max-w-[600px]">
              Full-featured project Gantt chart with date-based positioning, task groups,
              progress tracking, dependency arrows, milestones, and a today marker.
              <strong>Drag bars to move tasks, drag edges to resize.</strong>
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Reset button -->
            <button
              class="px-3 py-1.5 text-xs font-semibold rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              @click="resetTasks">
              Reset
            </button>

            <!-- View Mode Switcher -->
            <div class="flex items-center gap-1 p-1 rounded-lg bg-muted/30 border border-border/50">
              <button
                v-for="mode in (['day', 'week', 'month'] as const)"
                :key="mode"
                class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150"
                :class="viewMode === mode
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
                @click="viewMode = mode">
                {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
              </button>
            </div>
          </div>
        </div>

        <ChartControlPanel :controls="controls" v-model="opts" />

        <!-- Action feedback -->
        <Transition name="fade">
          <div v-if="lastAction"
            class="text-xs text-muted-foreground bg-muted/50 border border-border/50 rounded-md px-3 py-1.5 inline-flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            {{ lastAction }}
          </div>
        </Transition>

        <div class="bg-card rounded-xl border border-border p-4">
          <GanttChart
            :tasks="tasks"
            :view-mode="viewMode"
            :row-height="opts.rowHeight as number"
            :bar-radius="opts.barRadius as number"
            :bar-height="opts.barHeight as number"
            :show-grid="opts.showGrid as boolean"
            :show-labels="opts.showLabels as boolean"
            :show-tooltip="opts.showTooltip as boolean"
            :show-progress="opts.showProgress as boolean"
            :show-dependencies="opts.showDependencies as boolean"
            :show-today-line="opts.showTodayLine as boolean"
            :show-header="opts.showHeader as boolean"
            :animate="opts.animate as boolean"
            :draggable="opts.draggable as boolean"
            @task-click="onTaskClick"
            @task-update="onTaskUpdate" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
