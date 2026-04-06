<script setup lang="ts">
import PieChart from '@/components/Chart/PieChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './PieChartDemo.vue?raw'
import { marketShareData, revenueBreakdown, trafficSources } from './chart-data'
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         PIE CHART & DONUT CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Pie Chart" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-card rounded-xl border border-border p-6 flex flex-col">
          <p class="text-xs font-medium text-muted-foreground mb-4 text-center">Market Share — Slice Labels</p>
          <div class="flex-1 flex justify-center items-center">
            <PieChart :data="marketShareData" :size="260" label-mode="percent" />
          </div>
        </div>
        <div class="bg-card rounded-xl border border-border p-6 flex flex-col">
          <p class="text-xs font-medium text-muted-foreground mb-4 text-center">Traffic Sources — Legend Bottom</p>
          <div class="flex-1 flex justify-center items-center">
            <PieChart
              :data="trafficSources"
              :size="240"
              label-mode="none"
              legend-position="bottom" />
          </div>
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
          <p class="text-xs font-medium text-muted-foreground mb-4 text-center">Market Share — Custom Slot Center</p>
          <div class="flex-1 flex justify-center items-center">
            <PieChart
              :data="marketShareData"
              :size="280"
              :donut="true"
              :inner-radius="58"
              label-mode="none">
              <template #center>
                <text x="140" y="132" text-anchor="middle" dominant-baseline="middle" font-size="28" font-weight="800" class="fill-foreground">84%</text>
                <text x="140" y="152" text-anchor="middle" dominant-baseline="middle" font-size="12" class="fill-muted-foreground">Reach</text>
              </template>
            </PieChart>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
