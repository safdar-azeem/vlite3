<script setup lang="ts">
import CircleChart from '@/components/Chart/CircleChart.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './CircleChartDemo.vue?raw'
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         CIRCLE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Circle Chart — Colors & Sizes" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Animated progress ring with gradient stroke. Supports semantic colors and custom hex values.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center">
            <CircleChart :value="78" color="primary" label="Performance" sublabel="Last 30 days" :size="140" />
            <CircleChart :value="92" color="success" label="Uptime" sublabel="This month" :size="140" />
            <CircleChart :value="64" color="warning" label="Disk Usage" sublabel="512 GB used" :size="140" />
            <CircleChart :value="38" color="danger" label="Error Rate" sublabel="↓ 12% vs last week" :size="140" />
            <CircleChart :value="85" color="info" label="API Health" sublabel="98 endpoints" :size="140" />
            <CircleChart :value="72" color="#8b5cf6" label="Adoption" sublabel="Beta users" :size="140" />
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Circle Chart — Sizes & Customization" :code="sourceCode">
      <div class="bg-card rounded-xl border border-border p-8">
        <div class="flex flex-wrap gap-10 justify-center items-end">
          <!-- No gradient -->
          <CircleChart :value="55" :size="100" :stroke-width="8" color="primary" :gradient="false" label="Small" />
          <!-- Custom format -->
          <CircleChart
            :value="2480"
            :max="5000"
            :size="150"
            :stroke-width="14"
            color="success"
            label="Tasks Done"
            sublabel="of 5,000 total"
            :format-value="(v) => v.toLocaleString()" />
          <!-- Square cap -->
          <CircleChart :value="90" :size="180" :stroke-width="18" color="info" line-cap="butt" label="Coverage" />
          <!-- Custom center slot -->
          <CircleChart :value="68" :size="150" :stroke-width="12" color="#f97316" :show-value="false">
            <template #center="{ percentage }">
              <div class="text-center">
                <div class="text-2xl font-black" style="color: #f97316">{{ Math.round(percentage) }}%</div>
                <div class="text-[10px] text-muted-foreground font-medium">Goals Met</div>
              </div>
            </template>
          </CircleChart>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
