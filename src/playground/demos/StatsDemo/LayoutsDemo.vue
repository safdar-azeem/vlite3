<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './LayoutsDemo.vue?raw'
import { dashboardItems, analyticsItems, inlineItems } from './data'
</script>

<!-- @demo-snippet Layouts -->
<template>
  <DemoSection title="Layouts" :code="sourceCode">
    <div class="space-y-8 w-full">

      <!-- Icon Left (default) -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Icon Left (default)</p>
        <Stats :items="dashboardItems" layout="icon-left" variant="outline" />
      </div>

      <!-- Icon Right -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Icon Right</p>
        <Stats :items="analyticsItems" :columns="3" layout="icon-right" variant="outline" />
      </div>

      <!-- Icon Top -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Icon Top</p>
        <Stats :items="analyticsItems" :columns="3" layout="icon-top" variant="shadow" />
      </div>

      <!-- Title Top / Icon Bottom-Right -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Title Top · Icon Bottom-Right</p>
        <Stats :items="dashboardItems" layout="title-top-icon-bottom-right" variant="outline" />
      </div>

      <!-- Centered Value/Title -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Centered Value &amp; Title</p>
        <Stats :items="dashboardItems" layout="centered-value-title" variant="outline" />
      </div>

      <!-- Floating Icon -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Floating Icon (absolute top-right)</p>
        <Stats :items="dashboardItems" layout="floating-icon" variant="shadow" />
      </div>

      <!-- Split Bar -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Split Bar (color-accent left border)</p>
        <Stats :items="dashboardItems" layout="split-bar" variant="outline" />
      </div>

      <!-- Inline Label-Value -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Inline Label-Value</p>
        <Stats :items="inlineItems" :columns="4" layout="inline-label-value" variant="outline" />
      </div>

      <!-- Inline Label-Value Attached -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Inline Label-Value · Attached</p>
        <Stats :items="inlineItems" :columns="4" layout="inline-label-value" variant="outline" attached />
      </div>

    </div>
  </DemoSection>
</template>
