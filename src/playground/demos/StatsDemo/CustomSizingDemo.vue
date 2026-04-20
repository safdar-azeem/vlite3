<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './CustomSizingDemo.vue?raw'
import { analyticsItems } from './data'
</script>

<!-- @demo-snippet Custom Sizing -->
<template>
  <DemoSection title="Custom Sizing" :code="sourceCode">
    <div class="space-y-6 w-full">

      <!-- Large hero-style -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Hero — XL value, larger icon
        </p>
        <Stats
          :items="analyticsItems"
          :columns="3"
          layout="centered-value-title"
          variant="shadow"
          value-size="text-5xl font-black text-foreground"
          title-size="text-sm font-medium text-muted-foreground"
          icon-size="w-8 h-8"
        />
      </div>

      <!-- Compact -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Compact — tight text for dense UIs
        </p>
        <Stats
          :items="analyticsItems.slice(0, 2)"
          :columns="2"
          variant="outline"
          value-size="text-2xl font-bold text-foreground"
          title-size="text-xs font-medium text-muted-foreground"
          icon-size="w-4 h-4"
        />
      </div>

    </div>
  </DemoSection>
</template>
