<script setup lang="ts">
import LineChart from '@/components/Chart/LineChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './LineChartDemo.vue?raw'
import { revenueData, multiLineLabels, multiLineDatasets, sparkData } from './chart-data'
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         LINE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Line Chart — Single Series" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Smooth bezier curve with gradient fill. Monthly revenue data.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :data="revenueData"
            :height="280"
            :smooth="true"
            :fill="true"
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
