<script setup lang="ts">
import { ref } from 'vue'
import GaugeChart from '@/components/Chart/GaugeChart.vue'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from './ChartControlPanel.vue'
import sourceCode from './GaugeChartDemo.vue?raw'

// ─── Interactive Controls ──────────────────────
const gaugeOpts = ref({
  value: 68,
  variant: 'arc',
  color: 'primary',
  gradient: true,
  showValue: true,
  showNeedle: false,
  animate: true,
  size: 220,
  strokeWidth: 18,
  gapAngle: 60,
  lineCap: 'round',
  tickCount: 48,
  tickWidth: 3,
})

const gaugeControls = [
  { key: 'value',       label: 'Value',        type: 'slider' as const, min: 0, max: 100, step: 1 },
  {
    key: 'variant',
    label: 'Variant',
    type: 'segment' as const,
    options: [
      { label: 'Arc',   value: 'arc' },
      { label: 'Ticks', value: 'ticks' },
      { label: 'Slim',  value: 'slim' },
      { label: 'Ball',  value: 'ball' },
      { label: 'Dual',  value: 'dual' },
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
  { key: 'gradient',    label: 'Gradient',     type: 'toggle' as const },
  { key: 'showValue',   label: 'Show Value',   type: 'toggle' as const },
  { key: 'showNeedle',  label: 'Show Needle',  type: 'toggle' as const },
  { key: 'animate',     label: 'Animate',      type: 'toggle' as const },
  {
    key: 'lineCap',
    label: 'Line Cap',
    type: 'segment' as const,
    options: [
      { label: 'Round',  value: 'round' },
      { label: 'Butt',   value: 'butt' },
      { label: 'Square', value: 'square' },
    ],
  },
  { key: 'size',        label: 'Size',         type: 'slider' as const, min: 100, max: 300, step: 10 },
  { key: 'strokeWidth', label: 'Stroke Width', type: 'slider' as const, min: 4, max: 36, step: 2 },
  { key: 'gapAngle',    label: 'Gap Angle',    type: 'slider' as const, min: 0, max: 120, step: 5 },
  { key: 'tickCount',   label: 'Tick Count',   type: 'slider' as const, min: 16, max: 72, step: 4 },
  { key: 'tickWidth',   label: 'Tick Width',   type: 'slider' as const, min: 1, max: 8, step: 0.5 },
]

// ─── Zone demo value ──────────────────────────
const zoneValue = ref(76)
</script>

<template>
  <div class="space-y-12">
    <!-- ═══════════════════════════════════════════════
         INTERACTIVE PLAYGROUND
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Interactive" :code="sourceCode">
      <div class="space-y-4 w-full">
        <ChartControlPanel :controls="gaugeControls" v-model="gaugeOpts" />

        <p class="text-sm text-muted-foreground">
          Single component, three variants. Switch between <strong>Arc</strong>, <strong>Ticks</strong>,
          and <strong>Slim</strong> modes — all props update live. Use the slot for full center customization.
        </p>

        <div class="bg-card rounded-xl border border-border p-8 flex justify-center">
          <GaugeChart
            :value="gaugeOpts.value as number"
            :variant="gaugeOpts.variant as 'arc' | 'ticks' | 'slim' | 'ball' | 'dual'"
            :color="gaugeOpts.color as string"
            :gradient="gaugeOpts.gradient as boolean"
            :show-value="gaugeOpts.showValue as boolean"
            :show-needle="gaugeOpts.showNeedle as boolean"
            :animate="gaugeOpts.animate as boolean"
            :size="gaugeOpts.size as number"
            :stroke-width="gaugeOpts.strokeWidth as number"
            :gap-angle="gaugeOpts.gapAngle as number"
            :line-cap="gaugeOpts.lineCap as 'round' | 'butt' | 'square'"
            :tick-count="gaugeOpts.tickCount as number"
            :tick-width="gaugeOpts.tickWidth as number"
            label="Performance"
            sublabel="On track for 80% target"
          />
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         ALL FIVE VARIANTS SIDE BY SIDE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — All Five Variants" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          One component, five variants — all share the same API. Pick the one that fits your design context.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Arc</span>
              <GaugeChart :value="86" variant="arc" color="primary" :size="180" :stroke-width="20" label="Speed Score" sublabel="Last audit" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ball</span>
              <GaugeChart :value="87" variant="ball" color="success" :size="180" :stroke-width="18" label="Budget" sublabel="of $1,200" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dual</span>
              <GaugeChart :value="58" variant="dual" color="primary" compare-color="#4b5563" :compare-value="100" :size="180" :stroke-width="18" label="Percentage" value-label="Current" compare-label="Month goal" />
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ticks</span>
              <GaugeChart :value="68" variant="ticks" color="success" :size="180" :stroke-width="14" sublabel="On track for 80%">
                <template #footer>
                  <button class="mt-2 px-4 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">Show details</button>
                </template>
              </GaugeChart>
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Slim</span>
              <GaugeChart :value="57" variant="slim" color="teal" :size="180" :stroke-width="10" label="Completion" />
            </div>
          </div>
        </div>
      </div>
    </DemoSection>


    <!-- ═══════════════════════════════════════════════
         COLORS & THEMES
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Colors & Themes" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          All semantic color tokens work — gradient is automatically derived per color.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center">
            <GaugeChart :value="84" color="primary" :size="160" :stroke-width="16" label="Primary" />
            <GaugeChart :value="92" color="success" :size="160" :stroke-width="16" label="Success" />
            <GaugeChart :value="64" color="warning" :size="160" :stroke-width="16" label="Warning" />
            <GaugeChart :value="38" color="danger"  :size="160" :stroke-width="16" label="Danger" />
            <GaugeChart :value="78" color="info"    :size="160" :stroke-width="16" label="Info" />
            <GaugeChart :value="71" color="purple"  :size="160" :stroke-width="16" label="Purple" />
            <GaugeChart :value="55" color="teal"    :size="160" :stroke-width="16" label="Teal" />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         TICKS VARIANT — SHOWCASE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Ticks Variant" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          The <code>ticks</code> variant replaces the solid arc with individual radial dashes — ideal for health
          scores, progress targets, and anywhere you want a tactile meter feel.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <GaugeChart
              :value="68"
              variant="ticks"
              color="success"
              :size="220"
              :stroke-width="16"
              :tick-count="48"
              :tick-width="3.5"
              sublabel="On track for 80% target"
            >
              <template #footer>
                <button
                  class="mt-3 px-5 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Show details
                </button>
              </template>
            </GaugeChart>

            <GaugeChart
              :value="45"
              variant="ticks"
              color="warning"
              :size="200"
              :stroke-width="12"
              :tick-count="36"
              :tick-width="3"
              sublabel="Below monthly target"
            />

            <GaugeChart
              :value="91"
              variant="ticks"
              color="primary"
              :size="180"
              :stroke-width="10"
              :tick-count="60"
              :tick-width="2.5"
              sublabel="Excellent performance"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         BALL VARIANT — SHOWCASE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Ball Variant" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          The <code>ball</code> variant renders a thick arc with a <strong>glowing orb at the progress tip</strong>.
          Perfect for budgets, savings progress, and goal tracking widgets.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <!-- Budget tracker from image -->
            <GaugeChart
              :value="1052.98"
              :min="0"
              :max="1200"
              variant="ball"
              color="success"
              :size="240"
              :stroke-width="22"
              :gap-angle="55"
              :format-value="(v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`"
              sublabel="of $1,200"
            />

            <!-- Savings goal -->
            <GaugeChart
              :value="7400"
              :min="0"
              :max="10000"
              variant="ball"
              color="primary"
              :size="220"
              :stroke-width="20"
              :gap-angle="60"
              :format-value="(v) => `$${(v / 1000).toFixed(1)}k`"
              sublabel="of $10k saved"
            />

            <!-- Fitness calories -->
            <GaugeChart
              :value="1840"
              :min="0"
              :max="2500"
              variant="ball"
              color="orange"
              :size="200"
              :stroke-width="18"
              :gap-angle="65"
              :format-value="(v) => `${Math.round(v)}`"
              sublabel="kcal of 2,500 goal"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         DUAL VARIANT — SHOWCASE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Dual Variant" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          The <code>dual</code> variant stacks <strong>two arcs</strong> at the same radius — the current value
          in your accent color, and the goal/target in a muted secondary color. A built-in legend row labels them.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <!-- Exact replica from image 2 -->
            <GaugeChart
              :value="58"
              variant="dual"
              color="primary"
              compare-color="#4b5563"
              :compare-value="100"
              :size="240"
              :stroke-width="22"
              :gap-angle="58"
              label="Percentage"
              value-label="Current"
              compare-label="Month goal"
            />

            <!-- Revenue vs target -->
            <GaugeChart
              :value="8400"
              :min="0"
              :max="15000"
              variant="dual"
              color="success"
              compare-color="#374151"
              :compare-value="12000"
              :size="220"
              :stroke-width="20"
              :gap-angle="60"
              :format-value="(v) => `$${(v / 1000).toFixed(1)}k`"
              label="Revenue"
              value-label="Actual"
              compare-label="Q3 Target"
            />

            <!-- Storage usage -->
            <GaugeChart
              :value="73"
              :min="0"
              :max="100"
              variant="dual"
              color="warning"
              compare-color="#374151"
              :compare-value="90"
              :size="200"
              :stroke-width="18"
              :gap-angle="60"
              label="Storage"
              value-label="Used"
              compare-label="Limit"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         ZONES
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Color Zones" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Define arbitrary color zones to visually mark danger, warning, and safe ranges. Zones are rendered under
          the progress arc and use absolute values.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-center">
            <!-- Speedometer with zones -->
            <div class="flex flex-col items-center gap-2">
              <GaugeChart
                :value="zoneValue"
                variant="arc"
                :size="240"
                :stroke-width="20"
                :gap-angle="60"
                :gradient="false"
                color="success"
                :zones="[
                  { from: 0,  to: 60,  color: '#22c55e' },
                  { from: 60, to: 80,  color: '#f59e0b' },
                  { from: 80, to: 100, color: '#ef4444' },
                ]"
                label="System Load"
              />
              <!-- Scrubber for demo -->
              <input
                v-model.number="zoneValue"
                type="range" min="0" max="100"
                class="w-48 accent-primary"
              />
              <span class="text-xs text-muted-foreground">Drag to set value: {{ zoneValue }}%</span>
            </div>

            <!-- Compact zone gauge -->
            <GaugeChart
              :value="72"
              variant="arc"
              :size="200"
              :stroke-width="16"
              :gap-angle="50"
              :gradient="false"
              color="info"
              :zones="[
                { from: 0,  to: 40,  color: '#ef4444' },
                { from: 40, to: 70,  color: '#f59e0b' },
                { from: 70, to: 100, color: '#22c55e' },
              ]"
              label="Quality Score"
              sublabel="Good range (70–100)"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         NEEDLE
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Needle Pointer" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Enable <code>show-needle</code> to add an animated pointer needle — great for speedometer, temperature, or
          pressure gauge use cases.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <GaugeChart
              :value="62"
              variant="arc"
              color="primary"
              :size="220"
              :stroke-width="16"
              :show-needle="true"
              label="CPU Usage"
              sublabel="62 / 100 cores"
            />
            <GaugeChart
              :value="88"
              variant="slim"
              color="danger"
              :size="200"
              :stroke-width="10"
              :show-needle="true"
              label="Temperature"
              sublabel="88°C — Hot"
            />
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         CUSTOM CENTER SLOT
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Custom Center Slot" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Use the <code>#center</code> slot to completely replace the center content with any markup. The slot
          receives <code>{ value, percentage, displayValue }</code>.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-12 justify-center items-end">
            <!-- Stars rating style -->
            <GaugeChart :value="84" variant="arc" color="warning" :size="220" :stroke-width="18" :show-value="false">
              <template #center="{ percentage }">
                <div class="flex flex-col items-center gap-1">
                  <span class="text-3xl font-black" style="color: var(--color-warning)">
                    {{ (percentage / 20).toFixed(1) }}
                  </span>
                  <div class="flex gap-0.5">
                    <span v-for="i in 5" :key="i" style="font-size:14px">
                      {{ i <= Math.round(percentage / 20) ? '★' : '☆' }}
                    </span>
                  </div>
                  <span style="font-size:10px; color: var(--color-muted-foreground)">User Rating</span>
                </div>
              </template>
            </GaugeChart>

            <!-- Custom unit display -->
            <GaugeChart
              :value="3400"
              :max="5000"
              variant="arc"
              color="info"
              :size="220"
              :stroke-width="18"
              :show-value="false"
              label="API Requests / min"
            >
              <template #center="{ value: v }">
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-black" style="color: var(--color-foreground)">
                    {{ (v / 1000).toFixed(1) }}k
                  </span>
                  <span style="font-size:10px; color: var(--color-muted-foreground)">of 5k / min</span>
                </div>
              </template>
            </GaugeChart>

            <!-- Emoji mood indicator -->
            <GaugeChart :value="72" variant="ticks" color="success" :size="220" :stroke-width="14" :show-value="false">
              <template #center="{ percentage }">
                <div class="flex flex-col items-center gap-0.5">
                  <span style="font-size: 36px; line-height:1">
                    {{ percentage >= 80 ? '😄' : percentage >= 50 ? '🙂' : percentage >= 30 ? '😐' : '😟' }}
                  </span>
                  <span class="font-bold" style="font-size:15px; color: var(--color-foreground)">
                    {{ Math.round(percentage) }}%
                  </span>
                  <span style="font-size:10px; color: var(--color-muted-foreground)">Satisfaction</span>
                </div>
              </template>
            </GaugeChart>
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         SIZES & CUSTOMIZATION
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Sizes & Gap Angles" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Control the diameter with <code>size</code> and the opening at the bottom with <code>gap-angle</code>.
          A gap of <code>0</code> makes a full-circle gauge.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-10 justify-center items-end">
            <div class="flex flex-col items-center gap-1">
              <GaugeChart :value="75" color="primary" :size="120" :stroke-width="12" :gap-angle="60" />
              <span class="text-xs text-muted-foreground">size=120</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <GaugeChart :value="75" color="primary" :size="180" :stroke-width="16" :gap-angle="60" />
              <span class="text-xs text-muted-foreground">size=180</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <GaugeChart :value="75" color="primary" :size="240" :stroke-width="20" :gap-angle="60" />
              <span class="text-xs text-muted-foreground">size=240</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <GaugeChart :value="75" color="success" :size="200" :stroke-width="18" :gap-angle="0" />
              <span class="text-xs text-muted-foreground">gapAngle=0 (full circle)</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <GaugeChart :value="75" color="warning" :size="200" :stroke-width="18" :gap-angle="100" />
              <span class="text-xs text-muted-foreground">gapAngle=100</span>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         CUSTOM SCALE (min / max)
    ════════════════════════════════════════════════ -->
    <DemoSection title="Gauge Chart — Custom Scale" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Set a custom <code>min</code> and <code>max</code> for any measurement unit. Use <code>format-value</code>
          to control the display string.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-10 justify-center items-end">
            <!-- Temperature 0–120°C -->
            <GaugeChart
              :value="87"
              :min="0"
              :max="120"
              color="danger"
              :size="200"
              :stroke-width="18"
              :format-value="(v) => `${Math.round(v)}°C`"
              label="Engine Temp"
              sublabel="Normal range 60–95°C"
            />
            <!-- Speed 0–320 km/h -->
            <GaugeChart
              :value="140"
              :min="0"
              :max="320"
              color="info"
              :size="200"
              :stroke-width="18"
              :format-value="(v) => `${Math.round(v)}`"
              label="Speed (km/h)"
              :show-needle="true"
            />
            <!-- Humidity 0–100% with slim -->
            <GaugeChart
              :value="62"
              variant="slim"
              :min="0"
              :max="100"
              color="teal"
              :size="200"
              :stroke-width="12"
              :format-value="(v, pct) => `${Math.round(pct)}%`"
              label="Humidity"
            />
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
