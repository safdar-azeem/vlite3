<script setup lang="ts">
import { ref } from 'vue'
import BarChart from '@/components/Chart/BarChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './BarChartDemo.vue?raw'
import { monthlyBarData, groupedBarLabels, groupedBarDatasets, hBarData } from './chart-data'

// ─── Interactive Controls ──────────────────────
const barOpts = ref({
  orientation: 'vertical',
  barRadius: 8,
  showGrid: true,
  showTooltip: true,
  showValues: true,
  animate: true,
  height: 280,
})

const barControls = [
  {
    key: 'orientation',
    label: 'Orientation',
    type: 'segment' as const,
    options: [
      { label: 'Vertical',   value: 'vertical' },
      { label: 'Horizontal', value: 'horizontal' },
    ],
  },
  { key: 'showGrid',    label: 'Grid Lines',   type: 'toggle' as const },
  { key: 'showTooltip', label: 'Tooltip',      type: 'toggle' as const },
  { key: 'showValues',  label: 'Value Labels', type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',      type: 'toggle' as const },
  { key: 'barRadius',   label: 'Bar Radius',   type: 'slider' as const, min: 0, max: 20, step: 1 },
  { key: 'height',      label: 'Height',       type: 'slider' as const, min: 150, max: 450, step: 10 },
]
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         BAR CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Bar Chart — Vertical" :code="sourceCode">
      <div class="space-y-4 w-full">
        <!-- Interactive Controls -->
        <ChartControlPanel :controls="barControls" v-model="barOpts" />

        <p class="text-sm text-muted-foreground">
          Animated bars with per-bar colors, tooltips, and value labels. Toggle orientation to switch between vertical and horizontal.
        </p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart
            :data="monthlyBarData"
            :height="barOpts.height as number"
            :bar-radius="barOpts.barRadius as number"
            :orientation="barOpts.orientation as 'vertical' | 'horizontal'"
            :show-grid="barOpts.showGrid as boolean"
            :show-tooltip="barOpts.showTooltip as boolean"
            :show-values="barOpts.showValues as boolean"
            :animate="barOpts.animate as boolean" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Bar Chart — Multi Series Grouped" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Grouped bars across multiple product lines with legend.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart
            :datasets="groupedBarDatasets"
            :labels="groupedBarLabels"
            :height="280"
            :bar-radius="6"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Bar Chart — Horizontal" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Framework popularity as a horizontal bar chart. Great for ranked data.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart
            :data="hBarData"
            :height="280"
            orientation="horizontal"
            :bar-radius="6"
            show-values
            :format-value="(v) => v + '%'" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
