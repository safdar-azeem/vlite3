<script setup lang="ts">
import Switch from '@/components/Switch.vue'
import Slider from '@/components/Slider.vue'

export interface ControlItem {
  /** Unique key for v-model */
  key: string
  /** Label shown to the user */
  label: string
  /** Type of control */
  type: 'toggle' | 'select' | 'slider' | 'segment'
  /** For 'select' and 'segment': array of { label, value } options */
  options?: { label: string; value: unknown }[]
  /** For 'slider': min, max, step */
  min?: number
  max?: number
  step?: number
}

const props = defineProps<{
  controls: ControlItem[]
  modelValue: Record<string, unknown>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, unknown>): void
}>()

function update(key: string, value: unknown) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="chart-control-panel">
    <div class="ccp-label-row">
      <svg class="ccp-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 4h2v2H2V4zm4 0h8v2H6V4zM2 10h8v2H2v-2zm10 0h2v2h-2v-2z" fill="currentColor"/>
      </svg>
      <span class="ccp-title">Live Controls</span>
    </div>

    <div class="ccp-controls">
      <div
        v-for="ctrl in controls"
        :key="ctrl.key"
        class="ccp-item"
      >
        <!-- Toggle — uses the project's Switch component -->
        <Switch
          v-if="ctrl.type === 'toggle'"
          :label="ctrl.label"
          :model-value="modelValue[ctrl.key] as boolean"
          @update:model-value="(v) => update(ctrl.key, v)"
        />

        <!-- Slider — uses the project's Slider component -->
        <div v-else-if="ctrl.type === 'slider'" class="ccp-slider-row">
          <span class="ccp-item-label">{{ ctrl.label }}</span>
          <Slider
            :label="''"
            :min="ctrl.min ?? 0"
            :max="ctrl.max ?? 100"
            :step="ctrl.step ?? 1"
            :model-value="modelValue[ctrl.key] as number"
            size="sm"
            class="ccp-slider"
            @update:model-value="(v) => update(ctrl.key, v)"
          />
        </div>

        <!-- Select — native <select> (no existing component) -->
        <template v-else-if="ctrl.type === 'select'">
          <span class="ccp-item-label">{{ ctrl.label }}</span>
          <select
            class="ccp-select"
            :value="String(modelValue[ctrl.key])"
            @change="(e) => update(ctrl.key, (e.target as HTMLSelectElement).value)"
          >
            <option
              v-for="opt in ctrl.options"
              :key="String(opt.value)"
              :value="String(opt.value)"
            >
              {{ opt.label }}
            </option>
          </select>
        </template>

        <!-- Segmented control (no existing component) -->
        <template v-else-if="ctrl.type === 'segment'">
          <span class="ccp-item-label">{{ ctrl.label }}</span>
          <div class="ccp-segment">
            <button
              v-for="opt in ctrl.options"
              :key="String(opt.value)"
              class="ccp-seg-btn"
              :class="{ 'ccp-seg-btn--active': modelValue[ctrl.key] === opt.value }"
              @click="update(ctrl.key, opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: color-mix(in srgb, var(--color-muted, #f4f4f5) 50%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-border, #e5e7eb) 70%, transparent);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  backdrop-filter: blur(4px);
}

.ccp-label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-muted-foreground, #71717a);
}

.ccp-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.ccp-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ccp-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  align-items: center;
}

/* ─── Control Item ─────────────────────────────── */
.ccp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ccp-item-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-foreground, #09090b);
  white-space: nowrap;
}

/* ─── Slider row ─────────────────────────────────── */
.ccp-slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ccp-slider {
  width: 120px;
}

/* ─── Select ─────────────────────────────────────── */
.ccp-select {
  appearance: none;
  -webkit-appearance: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-foreground, #09090b);
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 7px;
  padding: 3px 22px 3px 8px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371717a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  transition: border-color 0.15s;
}

.ccp-select:focus {
  outline: none;
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary, #6366f1) 20%, transparent);
}

/* ─── Segmented ──────────────────────────────────── */
.ccp-segment {
  display: flex;
  background: var(--color-muted, #e4e4e7);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.ccp-seg-btn {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  color: var(--color-muted-foreground, #71717a);
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.ccp-seg-btn--active {
  background: var(--color-background, #fff);
  color: var(--color-foreground, #09090b);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
