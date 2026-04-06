<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/components/Chart/LineChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './LineChartDemo.vue?raw'
import { revenueData, multiLineLabels, multiLineDatasets, sparkData } from './chart-data'

// ─── Interactive Controls ──────────────────────
const lineOpts = ref({
  smooth: true,
  fill: true,
  showDots: true,
  showGrid: true,
  showTooltip: true,
  animate: true,
  height: 280,
})

const lineControls = [
  { key: 'smooth',      label: 'Smooth Curve', type: 'toggle' as const },
  { key: 'fill',        label: 'Fill Area',    type: 'toggle' as const },
  { key: 'showDots',    label: 'Show Dots',    type: 'toggle' as const },
  { key: 'showGrid',    label: 'Grid Lines',   type: 'toggle' as const },
  { key: 'showTooltip', label: 'Tooltip',      type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',      type: 'toggle' as const },
  { key: 'height',      label: 'Height',       type: 'slider' as const, min: 150, max: 450, step: 10 },
]
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         LINE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Line Chart — Single Series" :code="sourceCode">
      <div class="space-y-4 w-full">
        <!-- Interactive Controls -->
        <ChartControlPanel :controls="lineControls" v-model="lineOpts" />

        <p class="text-sm text-muted-foreground">Smooth bezier curve with gradient fill. Monthly revenue data.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :data="revenueData"
            :height="lineOpts.height as number"
            :smooth="lineOpts.smooth as boolean"
            :fill="lineOpts.fill as boolean"
            :show-dots="lineOpts.showDots as boolean"
            :show-grid="lineOpts.showGrid as boolean"
            :show-tooltip="lineOpts.showTooltip as boolean"
            :animate="lineOpts.animate as boolean"
            y-label="Revenue ($)"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Line Chart — Multi Series" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Multiple datasets with legend, hover crosshair, and tooltip.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :datasets="multiLineDatasets"
            :labels="multiLineLabels"
            :height="280"
            :fill="false"
            :show-dots="true"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Line Chart — Variants" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card rounded-xl border border-border p-5">
          <p class="text-xs font-medium text-muted-foreground mb-3">No Fill · Straight Lines</p>
          <LineChart :data="sparkData" :height="180" :smooth="false" :fill="false" :show-grid="false" />
        </div>
        <div class="bg-card rounded-xl border border-border p-5">
          <p class="text-xs font-medium text-muted-foreground mb-3">No Dots · Custom Colors</p>
          <LineChart
            :data="sparkData"
            :height="180"
            :show-dots="false"
            :colors="['var(--color-chart-6)', 'var(--color-chart-3)']" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
