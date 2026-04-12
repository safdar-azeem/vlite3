<script setup lang="ts">
import LineChartDemo from './charts/LineChartDemo.vue'
import BarChartDemo from './charts/BarChartDemo.vue'
import PieChartDemo from './charts/PieChartDemo.vue'
import CircleChartDemo from './charts/CircleChartDemo.vue'
import GaugeChartDemo from './charts/GaugeChartDemo.vue'
import TimelineChartDemo from './charts/TimelineChartDemo.vue'
import SegmentBarChartDemo from './charts/SegmentBarChartDemo.vue'
import StatCardChartDemo from './charts/StatCardChartDemo.vue'
import WaffleChartDemo from './charts/WaffleChartDemo.vue'
import DashboardPreviewDemo from './charts/DashboardPreviewDemo.vue'
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Charts</h2>
      <p class="text-lg text-muted-foreground max-w-[80%]">
        Beautiful, zero-dependency SVG chart components. Fully customizable, dark mode ready,
        animated, and responsive. Includes Line, Bar, Pie/Donut, Circle (progress ring),
        Gauge (speedometer), Timeline, Segment Bar, Stat Card, and Waffle charts.
      </p>
    </div>

    <LineChartDemo />
    <BarChartDemo />
    <PieChartDemo />
    <CircleChartDemo />
    <GaugeChartDemo />
    <TimelineChartDemo />
    <SegmentBarChartDemo />
    <StatCardChartDemo />
    <WaffleChartDemo />
    <DashboardPreviewDemo />
  </div>
</template>

