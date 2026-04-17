<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './LoadingDemo.vue?raw'
import { dashboardItems, inlineItems } from './data'
</script>

<!-- @demo-snippet Loading State -->
<template>
  <DemoSection title="Loading State" :code="sourceCode">
    <div class="space-y-6 w-full">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Outline · Loading</p>
        <Stats :items="dashboardItems" variant="outline" loading />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Inline Label-Value · Attached · Loading</p>
        <Stats :items="inlineItems" :columns="4" layout="inline-label-value" variant="outline" attached loading />
      </div>
    </div>
  </DemoSection>
</template>
