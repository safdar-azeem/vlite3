<script setup lang="ts">
import { ref } from 'vue'
import TimelineChart from '@/components/Chart/TimelineChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './TimelineChartDemo.vue?raw'
import { timelineTasks, timelinePeriods } from './chart-data'

// ─── Interactive Controls ──────────────────────
const opts = ref({
  barRadius: 20,
  showGrid: true,
  showLabels: true,
  showTooltip: true,
  animate: true,
  height: 340,
})

const controls = [
  { key: 'showGrid',    label: 'Grid Lines',   type: 'toggle' as const },
  { key: 'showLabels',  label: 'Task Labels',  type: 'toggle' as const },
  { key: 'showTooltip', label: 'Tooltip',      type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',      type: 'toggle' as const },
  { key: 'barRadius',   label: 'Bar Radius',   type: 'slider' as const, min: 0, max: 24, step: 1 },
  { key: 'height',      label: 'Height',       type: 'slider' as const, min: 200, max: 500, step: 10 },
]
</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Timeline Chart — Project Schedule" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="controls" v-model="opts" />

        <p class="text-sm text-muted-foreground">
          Gantt-style timeline with task bars spanning across periods. Each person is displayed on their own row with colored task bars.
        </p>
        <div class="bg-card rounded-xl border border-border p-6">
          <TimelineChart
            :tasks="timelineTasks"
            :periods="timelinePeriods"
            :height="opts.height as number"
            :bar-radius="opts.barRadius as number"
            :show-grid="opts.showGrid as boolean"
            :show-labels="opts.showLabels as boolean"
            :show-tooltip="opts.showTooltip as boolean"
            :animate="opts.animate as boolean" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
