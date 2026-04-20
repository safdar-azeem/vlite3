<script setup lang="ts">
import GanttChartDemo from './charts/GanttChartDemo.vue'
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Gantt Chart</h2>
      <p class="text-lg text-muted-foreground max-w-[80%]">
        A full-featured, zero-dependency SVG Gantt chart component for project management.
        Supports date-based positioning, task groups, progress tracking, dependency arrows,
        milestones, today marker, and multiple view modes (day, week, month).
      </p>
    </div>

    <GanttChartDemo />
  </div>
</template>
