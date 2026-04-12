<script setup lang="ts">
import { ref } from 'vue'
import WaffleChart from '@/components/Chart/WaffleChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './WaffleChartDemo.vue?raw'
import { waffleMultiData } from './chart-data'

// ─── Interactive Controls ──────────────────────
const opts = ref({
  cellCount: 30,
  cellRadius: 6,
  cellGap: 4,
  animate: true,
  showTooltip: true,
})

const controls = [
  { key: 'showTooltip', label: 'Tooltip',     type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',     type: 'toggle' as const },
  { key: 'cellCount',   label: 'Cell Count',  type: 'slider' as const, min: 10, max: 50, step: 1 },
  { key: 'cellRadius',  label: 'Cell Radius', type: 'slider' as const, min: 0, max: 16, step: 1 },
  { key: 'cellGap',     label: 'Cell Gap',    type: 'slider' as const, min: 0, max: 12, step: 1 },
]
</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Waffle Chart — Multi-Segment" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="controls" v-model="opts" />

        <p class="text-sm text-muted-foreground">
          Rounded pill-shaped cells colored proportionally to represent multi-segment data. Each segment fills a portion of the grid.
        </p>
        <div class="bg-card rounded-xl border border-border p-6">
          <WaffleChart
            :data="waffleMultiData"
            :cell-count="opts.cellCount as number"
            :cell-radius="opts.cellRadius as number"
            :cell-gap="opts.cellGap as number"
            :animate="opts.animate as boolean"
            :show-tooltip="opts.showTooltip as boolean" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Waffle Chart — Single Value" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Simple progress waffle — 18 of 30 cells filled.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <WaffleChart
            :value="60"
            :max="100"
            :cell-count="30"
            color="primary"
            :cell-radius="6"
            :cell-gap="4" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
