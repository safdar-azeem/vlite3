<script setup lang="ts">
import { ref } from 'vue'
import SegmentBarChart from '@/components/Chart/SegmentBarChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './SegmentBarChartDemo.vue?raw'
import { logisticsSegments, browserSegments } from './chart-data'

// ─── Interactive Controls ──────────────────────
const opts = ref({
  barHeight: 48,
  barRadius: 8,
  showLabels: true,
  showValues: true,
  showTooltip: true,
  animate: true,
})

const controls = [
  { key: 'showLabels',  label: 'Labels',     type: 'toggle' as const },
  { key: 'showValues',  label: 'Values',     type: 'toggle' as const },
  { key: 'showTooltip', label: 'Tooltip',    type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',    type: 'toggle' as const },
  { key: 'barHeight',   label: 'Bar Height', type: 'slider' as const, min: 24, max: 72, step: 2 },
  { key: 'barRadius',   label: 'Bar Radius', type: 'slider' as const, min: 0, max: 20, step: 1 },
]
</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Segment Bar Chart — Logistics" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="controls" v-model="opts" />

        <p class="text-sm text-muted-foreground">
          A single stacked horizontal bar showing proportional segments. Categories are labeled above with indicator dots and percentage values shown inside each segment.
        </p>
        <div class="bg-card rounded-xl border border-border p-6">
          <SegmentBarChart
            :data="logisticsSegments"
            :bar-height="opts.barHeight as number"
            :bar-radius="opts.barRadius as number"
            :show-labels="opts.showLabels as boolean"
            :show-values="opts.showValues as boolean"
            :show-tooltip="opts.showTooltip as boolean"
            :animate="opts.animate as boolean" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Segment Bar Chart — Browser Share" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Browser market share with vivid palette colors.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <SegmentBarChart
            :data="browserSegments"
            :bar-height="42"
            :bar-radius="8" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
