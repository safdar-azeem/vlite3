<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { StatCardItem } from './types'
import { CHART_COLORS, getColor, animateProgress } from './utils'

export interface StatCardChartProps {
  data: StatCardItem[]
  animate?: boolean
  colors?: string[]
}

const props = withDefaults(defineProps<StatCardChartProps>(), {
  animate: true,
  colors: () => CHART_COLORS,
})

// ─── Animation ────────────────────────────────
const progress = ref(props.animate ? 0 : 1)
let cancelAnim: (() => void) | null = null

function runAnimation() {
  cancelAnim?.()
  progress.value = 0
  cancelAnim = animateProgress(1000, (t) => (progress.value = t))
}

onMounted(() => { if (props.animate) runAnimation() })
watch(() => props.data, () => { if (props.animate) runAnimation() }, { deep: true })
onUnmounted(() => cancelAnim?.())

// ─── Computed items with colors ───────────────
const items = computed(() => {
  return props.data.map((d, i) => ({
    ...d,
    color: d.color ?? getColor(props.colors!, i),
    animatedPct: Math.round(d.percentage * progress.value),
    animatedValue: +(d.value * progress.value).toFixed(3),
  }))
})

// ─── Max percentage for proportional sizing ───
const maxPct = computed(() => Math.max(...props.data.map(d => d.percentage), 1))

// ─── Indicator size (proportional rectangle) ──
function indicatorSize(pct: number): { w: string; h: string } {
  const ratio = pct / maxPct.value
  // Scale from 48px to 96px wide, 28px to 56px tall
  const w = 48 + ratio * 48
  const h = 28 + ratio * 28
  return { w: `${w}px`, h: `${h}px` }
}
</script>

<template>
  <div class="vlite-stat-card-chart w-full select-none">
    <div class="vlite-scc-grid">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="vlite-scc-card"
        :style="{
          opacity: progress > 0.05 ? 1 : 0,
          transform: `translateY(${(1 - progress) * 12}px)`,
          transition: `opacity 0.4s ${i * 0.08}s, transform 0.4s ${i * 0.08}s`,
        }">

        <!-- Separator (not on first card) -->
        <div v-if="i > 0" class="vlite-scc-separator" />

        <div class="vlite-scc-content">
          <!-- Label -->
          <p class="vlite-scc-label">{{ item.label }}</p>

          <!-- Big percentage -->
          <p class="vlite-scc-pct">{{ item.animatedPct }}%</p>

          <!-- Spacer to push indicator down -->
          <div class="vlite-scc-spacer" />

          <!-- Proportional indicator -->
          <div
            class="vlite-scc-indicator"
            :style="{
              width: indicatorSize(item.percentage).w,
              height: indicatorSize(item.percentage).h,
              backgroundColor: item.color,
              opacity: 0.7 + (item.percentage / maxPct) * 0.3,
            }" />

          <!-- Value + trend -->
          <div class="vlite-scc-footer">
            <span class="vlite-scc-value">{{ item.animatedValue }}</span>
            <svg
              class="vlite-scc-trend-icon"
              :class="item.trend === 'up' ? 'vlite-scc-trend-up' : 'vlite-scc-trend-down'"
              viewBox="0 0 16 16"
              fill="none">
              <path
                v-if="item.trend === 'up'"
                d="M3 11L8 5L13 11"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                v-else
                d="M3 5L8 11L13 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vlite-scc-grid {
  display: flex;
  width: 100%;
}

.vlite-scc-card {
  flex: 1;
  position: relative;
  display: flex;
  align-items: stretch;
}

.vlite-scc-separator {
  width: 1px;
  align-self: stretch;
  background: var(--color-border, #e4e4e7);
  opacity: 0.3;
  margin: 8px 0;
  flex-shrink: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--color-border, #e4e4e7) 0px,
    var(--color-border, #e4e4e7) 4px,
    transparent 4px,
    transparent 8px
  );
  background-color: transparent;
}

.vlite-scc-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 20px;
  flex: 1;
  min-height: 200px;
}

.vlite-scc-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted-foreground, #71717a);
  margin: 0 0 6px 0;
}

.vlite-scc-pct {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-foreground, #09090b);
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.vlite-scc-spacer {
  flex: 1;
}

.vlite-scc-indicator {
  border-radius: 10px;
  margin-bottom: 14px;
  transition: width 0.6s ease, height 0.6s ease;
}

.vlite-scc-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vlite-scc-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground, #09090b);
  font-variant-numeric: tabular-nums;
}

.vlite-scc-trend-icon {
  width: 14px;
  height: 14px;
}

.vlite-scc-trend-up {
  color: var(--color-success, #22c55e);
  transform: rotate(25deg);
}

.vlite-scc-trend-down {
  color: var(--color-danger, #ef4444);
  transform: rotate(-25deg);
}
</style>
