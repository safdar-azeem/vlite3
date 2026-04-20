<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './AttachedDemo.vue?raw'
import { dashboardItems } from './data'
// dashboardItems has 2 trends — good for attached since it's also a full-featured showcase
</script>

<!-- @demo-snippet Attached (Fused Borders) -->
<template>
  <DemoSection title="Attached (Fused Borders)" :code="sourceCode">
    <div class="space-y-6 w-full">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Outline · Attached</p>
        <Stats :items="dashboardItems" variant="outline" attached />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Shadow · Attached</p>
        <Stats :items="dashboardItems" variant="shadow" attached />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Transparent · Attached</p>
        <Stats :items="dashboardItems" variant="transparent" attached />
      </div>
    </div>
  </DemoSection>
</template>
