<script setup lang="ts">
import BarChart from '@/components/Chart/BarChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './BarChartDemo.vue?raw'
import { monthlyBarData, groupedBarLabels, groupedBarDatasets, hBarData } from './chart-data'
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         BAR CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Bar Chart — Vertical" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Vertical bars with per-bar colors, animated grow-in, and tooltips.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart :data="monthlyBarData" :height="280" :bar-radius="8" show-values />
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
