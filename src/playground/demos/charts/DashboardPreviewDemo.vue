<script setup lang="ts">
import LineChart from '@/components/Chart/LineChart.vue'
import BarChart from '@/components/Chart/BarChart.vue'
import PieChart from '@/components/Chart/PieChart.vue'
import CircleChart from '@/components/Chart/CircleChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DashboardPreviewDemo.vue?raw'
import { multiLineDatasets, multiLineLabels, revenueBreakdown, monthlyBarData, hBarData } from './chart-data'
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         DASHBOARD PREVIEW
    ════════════════════════════════════════════════ -->
    <DemoSection title="Dashboard Preview" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">All chart types combined in a typical analytics dashboard layout.</p>

        <!-- KPI Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="84" :size="60" :stroke-width="6" color="primary" :show-value="true" :animate="true" />
            <div>
              <p class="text-xs text-muted-foreground">Performance</p>
              <p class="font-bold text-foreground">Excellent</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="97" :size="60" :stroke-width="6" color="success" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Uptime</p>
              <p class="font-bold text-foreground">99.97%</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="61" :size="60" :stroke-width="6" color="warning" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Disk Usage</p>
              <p class="font-bold text-foreground">305 GB</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="23" :size="60" :stroke-width="6" color="danger" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Errors</p>
              <p class="font-bold text-foreground">234 today</p>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue Overview</p>
            <LineChart
              :datasets="multiLineDatasets"
              :labels="multiLineLabels"
              :height="220"
              :fill="true"
              :show-dots="false"
              :format-value="(v) => '$' + v.toLocaleString()" />
          </div>
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue Sources</p>
            <div class="flex justify-center">
              <PieChart
                :data="revenueBreakdown"
                :size="200"
                :donut="true"
                :inner-radius="58"
                center-value="$94k"
                label-mode="none"
                legend-position="bottom"
                :show-legend="false" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Monthly Sales</p>
            <BarChart :data="monthlyBarData" :height="200" :bar-radius="6" />
          </div>
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Framework Popularity</p>
            <BarChart
              :data="hBarData"
              :height="200"
              orientation="horizontal"
              :bar-radius="4"
              :format-value="(v) => v + '%'" />
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
