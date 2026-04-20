<script setup lang="ts">
import { ref } from 'vue'
import GanttChart from '@/components/Chart/GanttChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './GanttChartDemo.vue?raw'
import { ganttTasks } from './chart-data'

// ─── Interactive Controls ──────────────────────
const opts = ref({
  viewMode: 'week',
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
  { key: 'barRadius',        label: 'Bar Radius',    type: 'slider' as const, min: 0, max: 16, step: 1 },
  { key: 'barHeight',        label: 'Bar Height',    type: 'slider' as const, min: 16, max: 40, step: 2 },
  { key: 'rowHeight',        label: 'Row Height',    type: 'slider' as const, min: 32, max: 60, step: 2 },
]

const viewMode = ref<'day' | 'week' | 'month'>('week')
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
              Scroll horizontally to navigate the timeline.
            </p>
          </div>

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

        <ChartControlPanel :controls="controls" v-model="opts" />

        <div class="bg-card rounded-xl border border-border p-4">
          <GanttChart
            :tasks="ganttTasks"
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
            :animate="opts.animate as boolean" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
