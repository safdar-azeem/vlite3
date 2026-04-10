<script setup lang="ts">
import { ref, computed } from 'vue'
import LineChart from '@/components/Chart/LineChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './LineChartDemo.vue?raw'
import { revenueData, multiLineLabels, multiLineDatasets, sparkData, generateTimeSeriesData, generateMultiSeriesData } from './chart-data'

// ─── Interactive Controls ──────────────────────
const lineOpts = ref({
  datasetSize: '30',
  // Line behavior
  smooth: true,
  fill: true,
  showDots: true,
  animate: true,
  lineWidth: 2.5,
  // Axes & grid
  showGrid: true,
  showXAxis: true,
  showYAxis: true,
  showXLabels: true,
  showYLabels: true,
  gridOpacity: 0.07,
  axisOpacity: 0.1,
  // Interaction
  showTooltip: true,
  // Size
  height: 280,
})

const lineControls = [
  {
    key: 'datasetSize',
    label: 'Data Range',
    type: 'select' as const,
    options: [
      { label: '7 Days', value: '7' },
      { label: '30 Days', value: '30' },
      { label: '6 Months', value: '180' },
      { label: '1 Year', value: '365' },
    ],
  },
  // ─ Line style
  { key: 'smooth',       label: 'Smooth',      type: 'toggle' as const },
  { key: 'fill',         label: 'Fill Area',   type: 'toggle' as const },
  { key: 'showDots',     label: 'Dots',        type: 'toggle' as const },
  { key: 'animate',      label: 'Animate',     type: 'toggle' as const },
  { key: 'lineWidth',    label: 'Line Width',  type: 'slider' as const, min: 1, max: 6, step: 0.5 },
  // ─ Axes
  { key: 'showXAxis',    label: 'X Axis Line', type: 'toggle' as const },
  { key: 'showYAxis',    label: 'Y Axis Line', type: 'toggle' as const },
  { key: 'showXLabels',  label: 'X Labels',    type: 'toggle' as const },
  { key: 'showYLabels',  label: 'Y Labels',    type: 'toggle' as const },
  { key: 'showGrid',     label: 'Grid',        type: 'toggle' as const },
  { key: 'gridOpacity',  label: 'Grid Opacity',type: 'slider' as const, min: 0, max: 0.3, step: 0.01 },
  { key: 'axisOpacity',  label: 'Axis Opacity',type: 'slider' as const, min: 0, max: 0.5, step: 0.01 },
  // ─ Interaction & size
  { key: 'showTooltip',  label: 'Tooltip',     type: 'toggle' as const },
  { key: 'height',       label: 'Height',      type: 'slider' as const, min: 150, max: 450, step: 10 },
]

// ─── Dynamic Data ──────────────────────────────
const dynamicSingleData = computed(() => generateTimeSeriesData(Number(lineOpts.value.datasetSize)))
const dynamicMultiData = computed(() => generateMultiSeriesData(Number(lineOpts.value.datasetSize)))

</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Line Chart — Single Series" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="lineControls" v-model="lineOpts" />

        <p class="text-sm text-muted-foreground">Smooth bezier curve with gradient fill. Automatic label skipping and slanting when dense.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :data="dynamicSingleData"
            :height="lineOpts.height as number"
            :smooth="lineOpts.smooth as boolean"
            :fill="lineOpts.fill as boolean"
            :show-dots="lineOpts.showDots as boolean"
            :show-grid="lineOpts.showGrid as boolean"
            :show-tooltip="lineOpts.showTooltip as boolean"
            :animate="lineOpts.animate as boolean"
            :show-x-axis="lineOpts.showXAxis as boolean"
            :show-y-axis="lineOpts.showYAxis as boolean"
            :show-x-labels="lineOpts.showXLabels as boolean"
            :show-y-labels="lineOpts.showYLabels as boolean"
            :grid-opacity="lineOpts.gridOpacity as number"
            :axis-opacity="lineOpts.axisOpacity as number"
            :line-width="lineOpts.lineWidth as number"
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
            :datasets="dynamicMultiData.datasets"
            :labels="dynamicMultiData.labels"
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
