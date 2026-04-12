<script setup lang="ts">
import StatCardChart from '@/components/Chart/StatCardChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './StatCardChartDemo.vue?raw'
import { deviceStats } from './chart-data'
</script>

<template>
  <div class="space-y-12">
    <DemoSection title="Stat Card Chart — Device Breakdown" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          A grid of metric cards with large percentages, proportional indicators representing device sizes, and trend arrows. Cards animate in with a staggered slide-up effect.
        </p>
        <div class="bg-card rounded-xl border border-border p-4">
          <StatCardChart :data="deviceStats" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
