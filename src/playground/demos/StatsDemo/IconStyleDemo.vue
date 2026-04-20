<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './IconStyleDemo.vue?raw'
import { analyticsItems, metricsItems } from './data'
// Clean datasets — focus is on icon shape/style, not data decoration.
</script>

<!-- @demo-snippet Icon Box Shape & Style -->
<template>
  <DemoSection title="Icon Box Shape &amp; Style" :code="sourceCode">
    <div class="space-y-8 w-full">

      <!-- Shapes -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Rounded (default)</p>
        <Stats :items="analyticsItems" :columns="3" layout="icon-left" variant="outline" icon-box-shape="rounded" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Full-Rounded (circle)</p>
        <Stats :items="analyticsItems" :columns="3" layout="icon-left" variant="outline" icon-box-shape="full-rounded" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">No shape (icon only)</p>
        <Stats :items="analyticsItems" :columns="3" layout="icon-left" variant="shadow" icon-box-shape="none" />
      </div>

      <!-- Styles -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Transparent icon box</p>
        <Stats :items="metricsItems" layout="icon-left" variant="outline" icon-box-style="transparent" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Transparent · Full-Rounded · Title-Top-Icon-Bottom-Right</p>
        <Stats
          :items="analyticsItems"
          :columns="3"
          layout="title-top-icon-bottom-right"
          variant="shadow"
          icon-box-style="transparent"
          icon-box-shape="full-rounded"
        />
      </div>

    </div>
  </DemoSection>
</template>
