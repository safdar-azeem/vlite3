<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './VariantsDemo.vue?raw'
import { dashboardItems } from './data'
// dashboardItems has 2 trends (Revenue + Active Sessions) — ideal for showing the full feature set
</script>

<!-- @demo-snippet Variants -->
<template>
  <DemoSection title="Variants" :code="sourceCode">
    <div class="space-y-6 w-full">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Outline</p>
        <Stats :items="dashboardItems" variant="outline" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Solid</p>
        <Stats :items="dashboardItems" variant="solid" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Shadow</p>
        <Stats :items="dashboardItems" variant="shadow" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Transparent</p>
        <Stats :items="dashboardItems" variant="transparent" />
      </div>
    </div>
  </DemoSection>
</template>
