<script setup lang="ts">
import { ref, computed } from 'vue'
import CircleChart from '@/components/Chart/CircleChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './CircleChartDemo.vue?raw'

// ─── Interactive Controls ──────────────────────
const circleOpts = ref({
  value: 78,
  color: 'primary',
  gradient: true,
  showValue: true,
  animate: true,
  size: 140,
  strokeWidth: 12,
  lineCap: 'round',
})

const circleControls = [
  { key: 'value',       label: 'Value',       type: 'slider' as const, min: 0, max: 100, step: 1 },
  { key: 'gradient',    label: 'Gradient',    type: 'toggle' as const },
  { key: 'showValue',   label: 'Show Value',  type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',     type: 'toggle' as const },
  {
    key: 'color',
    label: 'Color',
    type: 'select' as const,
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Danger',  value: 'danger' },
      { label: 'Info',    value: 'info' },
      { label: 'Custom (purple)', value: '#8b5cf6' },
    ],
  },
  {
    key: 'lineCap',
    label: 'Line Cap',
    type: 'segment' as const,
    options: [
      { label: 'Round',  value: 'round' },
      { label: 'Square', value: 'square' },
      { label: 'Butt',   value: 'butt' },
    ],
  },
  { key: 'size',        label: 'Size',         type: 'slider' as const, min: 80, max: 220, step: 10 },
  { key: 'strokeWidth', label: 'Stroke Width', type: 'slider' as const, min: 4, max: 28, step: 2 },
]

// Color label used in the "live preview" sub-label
const colorLabel = computed(() => {
  const c = circleOpts.value.color
  const map: Record<string, string> = { primary: 'Primary', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info', '#8b5cf6': 'Purple' }
  return map[c] ?? c
})
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         CIRCLE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Circle Chart — Interactive" :code="sourceCode">
      <div class="space-y-4 w-full">
        <!-- Interactive Controls -->
        <ChartControlPanel :controls="circleControls" v-model="circleOpts" />

        <p class="text-sm text-muted-foreground">
          Animated progress ring. Drag the value slider, switch colors, cap styles, and sizes in real time.
        </p>
        <div class="bg-card rounded-xl border border-border p-8 flex justify-center">
          <CircleChart
            :value="circleOpts.value as number"
            :color="circleOpts.color as string"
            :gradient="circleOpts.gradient as boolean"
            :show-value="circleOpts.showValue as boolean"
            :animate="circleOpts.animate as boolean"
            :size="circleOpts.size as number"
            :stroke-width="circleOpts.strokeWidth as number"
            :line-cap="circleOpts.lineCap as 'round' | 'square' | 'butt'"
            :label="colorLabel"
            sublabel="Live Preview" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Circle Chart — Colors & Sizes" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Semantic color tokens and custom hex values. Gradient applied automatically.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center">
            <CircleChart :value="78" color="primary" label="Performance" sublabel="Last 30 days" :size="140" />
            <CircleChart :value="92" color="success" label="Uptime"      sublabel="This month"   :size="140" />
            <CircleChart :value="64" color="warning" label="Disk Usage"  sublabel="512 GB used"  :size="140" />
            <CircleChart :value="38" color="danger"  label="Error Rate"  sublabel="↓ 12% vs last week" :size="140" />
            <CircleChart :value="85" color="info"    label="API Health"  sublabel="98 endpoints" :size="140" />
            <CircleChart :value="72" color="#8b5cf6" label="Adoption"    sublabel="Beta users"   :size="140" />
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
          <!-- Butt cap -->
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
