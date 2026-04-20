<script setup lang="ts">
import { ref } from 'vue'
import SpeedometerChart from '@/components/Chart/SpeedometerChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './SpeedometerChartDemo.vue?raw'

// ─── Interactive Controls ──────────────────────
const speedoOpts = ref({
  value: 120,
  variant: 'classic',
  color: 'primary',
  max: 240,
  majorStep: 20,
  minorTicks: 4,
  size: 280,
  gapAngle: 60,
  unit: 'km/h',
  animate: true,
})

const speedoControls = [
  { key: 'value',     label: 'Speed',      type: 'slider' as const, min: 0, max: 240, step: 1 },
  {
    key: 'variant',
    label: 'Variant',
    type: 'segment' as const,
    options: [
      { label: 'Classic', value: 'classic' },
      { label: 'Modern',  value: 'modern' },
      { label: 'Sport',   value: 'sport' },
      { label: 'Minimal', value: 'minimal' },
    ],
  },
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
      { label: 'Purple',  value: 'purple' },
      { label: 'Teal',    value: 'teal' },
    ],
  },
  { key: 'animate',   label: 'Animate',     type: 'toggle' as const },
  { key: 'size',      label: 'Size',        type: 'slider' as const, min: 160, max: 400, step: 10 },
  { key: 'gapAngle',  label: 'Gap Angle',   type: 'slider' as const, min: 30, max: 120, step: 5 },
  { key: 'majorStep', label: 'Major Step',  type: 'slider' as const, min: 10, max: 60, step: 5 },
  { key: 'minorTicks', label: 'Minor Ticks', type: 'slider' as const, min: 1, max: 9, step: 1 },
]

// ─── Sport demo speed ──────────────────────
const sportSpeed = ref(185)
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         INTERACTIVE PLAYGROUND
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — Interactive" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="speedoControls" v-model="speedoOpts" />

        <p class="text-sm text-muted-foreground">
          A car-dashboard-style gauge with numbered tick marks, sweeping needle, and hub.
          Switch between <strong>Classic</strong>, <strong>Modern</strong>, <strong>Sport</strong>,
          and <strong>Minimal</strong> variants.
        </p>

        <div class="bg-card rounded-xl border border-border p-8 flex justify-center">
          <SpeedometerChart
            :value="speedoOpts.value as number"
            :variant="speedoOpts.variant as 'classic' | 'modern' | 'sport' | 'minimal'"
            :color="speedoOpts.color as string"
            :animate="speedoOpts.animate as boolean"
            :size="speedoOpts.size as number"
            :gap-angle="speedoOpts.gapAngle as number"
            :major-step="speedoOpts.majorStep as number"
            :minor-ticks="speedoOpts.minorTicks as number"
            :max="speedoOpts.max as number"
            :unit="speedoOpts.unit as string"
            :red-zone-start="200"
          />
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         ALL FOUR VARIANTS
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — All Four Variants" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          One component, four looks — from traditional dashboard to clean minimal design.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center items-end">
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Classic</span>
              <SpeedometerChart :value="120" variant="classic" color="primary" :size="220" :max="240" :red-zone-start="200" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Modern</span>
              <SpeedometerChart :value="95" variant="modern" color="info" :size="220" :max="240" :red-zone-start="200" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sport</span>
              <SpeedometerChart :value="210" variant="sport" color="danger" :size="220" :max="260" :major-step="20" :red-zone-start="220" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Minimal</span>
              <SpeedometerChart :value="80" variant="minimal" color="teal" :size="220" :max="200" :major-step="20" />
            </div>
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         SPORT — RED ZONE SHOWCASE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — Sport Red Zone" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          The <code>sport</code> variant with a <code>red-zone-start</code> — the needle, value, and arc
          turn red when entering the danger zone. Drag the slider to feel it.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-col items-center gap-4">
            <SpeedometerChart
              :value="sportSpeed"
              variant="sport"
              color="primary"
              :size="300"
              :max="260"
              :major-step="20"
              :minor-ticks="4"
              unit="km/h"
              :red-zone-start="220"
              label="RPM Sport"
            />
            <input
              v-model.number="sportSpeed"
              type="range" min="0" max="260"
              class="w-64 accent-primary"
            />
            <span class="text-xs text-muted-foreground">Drag to adjust: {{ sportSpeed }} km/h</span>
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         USE CASES — RPM, FUEL, TEMPERATURE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — Automotive Use Cases" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Configure <code>min</code>, <code>max</code>, <code>major-step</code>, and <code>unit</code>
          to create any automotive gauge — speedometer, tachometer, fuel, or temperature.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-10 justify-center items-end">
            <!-- Speedometer -->
            <SpeedometerChart
              :value="140"
              :min="0" :max="280"
              :major-step="20"
              :minor-ticks="3"
              variant="classic"
              color="primary"
              :size="240"
              unit="km/h"
              :red-zone-start="240"
              label="Speed"
            />
            <!-- Tachometer (RPM) -->
            <SpeedometerChart
              :value="5500"
              :min="0" :max="8000"
              :major-step="1000"
              :minor-ticks="4"
              variant="sport"
              color="info"
              :size="240"
              unit="RPM"
              :red-zone-start="6500"
              :format-value="(v: number) => (v / 1000).toFixed(1)"
              label="Tachometer"
            />
            <!-- Fuel gauge -->
            <SpeedometerChart
              :value="65"
              :min="0" :max="100"
              :major-step="25"
              :minor-ticks="4"
              variant="modern"
              color="success"
              :size="200"
              unit="%"
              label="Fuel Level"
              :format-value="(v: number) => Math.round(v) + '%'"
            />
            <!-- Temperature -->
            <SpeedometerChart
              :value="92"
              :min="50" :max="130"
              :major-step="10"
              :minor-ticks="1"
              variant="minimal"
              color="warning"
              :size="200"
              unit="°C"
              :red-zone-start="110"
              :format-value="(v: number) => Math.round(v) + '°'"
              label="Coolant Temp"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         COLORS
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — Colors" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          All semantic color tokens work. The needle, progress arc, and hub adapt to the chosen color.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-6 justify-center">
            <SpeedometerChart :value="100" color="primary" :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="140" color="success" :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="80"  color="warning" :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="170" color="danger"  :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="120" color="info"    :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="90"  color="purple"  :size="160" :max="200" :major-step="40" :minor-ticks="3" />
            <SpeedometerChart :value="60"  color="teal"    :size="160" :max="200" :major-step="40" :minor-ticks="3" />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         SIZES
    ════════════════════════════════════════════════ -->
    <DemoSection title="Speedometer Chart — Sizes" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          All labels and ticks scale proportionally with the <code>size</code> prop.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center items-end">
            <div class="flex flex-col items-center gap-1">
              <SpeedometerChart :value="90" color="primary" :size="140" :max="200" :major-step="40" :minor-ticks="3" />
              <span class="text-xs text-muted-foreground">size=140</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <SpeedometerChart :value="90" color="primary" :size="220" :max="200" :major-step="40" :minor-ticks="3" />
              <span class="text-xs text-muted-foreground">size=220</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <SpeedometerChart :value="90" color="primary" :size="300" :max="200" :major-step="40" :minor-ticks="3" />
              <span class="text-xs text-muted-foreground">size=300</span>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
