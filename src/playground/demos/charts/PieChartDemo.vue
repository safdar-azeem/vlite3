<script setup lang="ts">
import { ref } from 'vue'
import PieChart from '@/components/Chart/PieChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './PieChartDemo.vue?raw'
import { marketShareData, revenueBreakdown, trafficSources } from './chart-data'

// ─── Interactive Controls ──────────────────────
const pieOpts = ref({
  donut: false,
  labelMode: 'percent',
  legendPosition: 'right',
  showLegend: true,
  showTooltip: true,
  animate: true,
  innerRadius: 60,
  size: 260,
})

const pieControls = [
  { key: 'donut',      label: 'Donut Mode',  type: 'toggle' as const },
  { key: 'showLegend', label: 'Show Legend', type: 'toggle' as const },
  { key: 'showTooltip',label: 'Tooltip',     type: 'toggle' as const },
  { key: 'animate',    label: 'Animate',     type: 'toggle' as const },
  {
    key: 'labelMode',
    label: 'Label Mode',
    type: 'select' as const,
    options: [
      { label: 'Percent', value: 'percent' },
      { label: 'Value',   value: 'value' },
      { label: 'Label',   value: 'label' },
      { label: 'Outside', value: 'outside' },
      { label: 'None',    value: 'none' },
    ],
  },
  {
    key: 'legendPosition',
    label: 'Legend Position',
    type: 'segment' as const,
    options: [
      { label: 'Right',  value: 'right' },
      { label: 'Bottom', value: 'bottom' },
    ],
  },
  { key: 'innerRadius', label: 'Inner Radius', type: 'slider' as const, min: 20, max: 80, step: 1 },
  { key: 'size',        label: 'Size',         type: 'slider' as const, min: 160, max: 360, step: 10 },
]
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         PIE CHART & DONUT CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Pie Chart" :code="sourceCode">
      <div class="space-y-4 w-full">
        <!-- Interactive Controls -->
        <ChartControlPanel :controls="pieControls" v-model="pieOpts" />

        <p class="text-sm text-muted-foreground">
          Toggle Donut Mode, tweak label style, legend position, and inner radius in real time.
        </p>
        <div class="flex justify-center bg-card rounded-xl border border-border p-8">
          <PieChart
            :data="marketShareData"
            :size="pieOpts.size as number"
            :donut="pieOpts.donut as boolean"
            :inner-radius="pieOpts.innerRadius as number"
            :label-mode="pieOpts.labelMode as 'percent' | 'value' | 'label' | 'outside' | 'none'"
            :legend-position="pieOpts.legendPosition as 'right' | 'bottom'"
            :show-legend="pieOpts.showLegend as boolean"
            :show-tooltip="pieOpts.showTooltip as boolean"
            :animate="pieOpts.animate as boolean"
            center-value="84%"
            center-label="Reach" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Donut Chart" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-card rounded-xl border border-border p-6 flex flex-col">
          <p class="text-xs font-medium text-muted-foreground mb-4 text-center">Revenue Breakdown — Center Label</p>
          <div class="flex-1 flex justify-center items-center">
            <PieChart
              :data="revenueBreakdown"
              :size="280"
              :donut="true"
              :inner-radius="62"
              center-value="$94k"
              center-label="Total Revenue"
              label-mode="percent" />
          </div>
        </div>
        <div class="bg-card rounded-xl border border-border p-6 flex flex-col">
          <p class="text-xs font-medium text-muted-foreground mb-4 text-center">Traffic Sources — Legend Bottom</p>
          <div class="flex-1 flex justify-center items-center">
            <PieChart
              :data="trafficSources"
              :size="240"
              :donut="true"
              :inner-radius="55"
              label-mode="none"
              legend-position="bottom" />
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
