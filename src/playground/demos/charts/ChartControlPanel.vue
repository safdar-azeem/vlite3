<script setup lang="ts">
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
        <span class="ccp-item-label">{{ ctrl.label }}</span>

        <!-- Toggle -->
        <button
          v-if="ctrl.type === 'toggle'"
          class="ccp-toggle"
          :class="{ 'ccp-toggle--on': modelValue[ctrl.key] }"
          @click="update(ctrl.key, !modelValue[ctrl.key])"
          :aria-pressed="!!modelValue[ctrl.key]"
        >
          <span class="ccp-toggle-thumb" />
        </button>

        <!-- Select -->
        <select
          v-else-if="ctrl.type === 'select'"
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

        <!-- Slider -->
        <div v-else-if="ctrl.type === 'slider'" class="ccp-slider-wrap">
          <input
            type="range"
            class="ccp-slider"
            :min="ctrl.min ?? 0"
            :max="ctrl.max ?? 100"
            :step="ctrl.step ?? 1"
            :value="Number(modelValue[ctrl.key])"
            @input="(e) => update(ctrl.key, Number((e.target as HTMLInputElement).value))"
          />
          <span class="ccp-slider-val">{{ modelValue[ctrl.key] }}</span>
        </div>

        <!-- Segmented control -->
        <div v-else-if="ctrl.type === 'segment'" class="ccp-segment">
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
  gap: 10px 20px;
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

/* ─── Toggle ─────────────────────────────────────── */
.ccp-toggle {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: var(--color-muted, #e4e4e7);
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.ccp-toggle--on {
  background: var(--color-primary, #6366f1);
}

.ccp-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.ccp-toggle--on .ccp-toggle-thumb {
  transform: translateX(16px);
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

/* ─── Slider ─────────────────────────────────────── */
.ccp-slider-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ccp-slider {
  width: 90px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 99px;
  background: var(--color-muted, #e4e4e7);
  cursor: pointer;
  outline: none;
}

.ccp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.1s;
}

.ccp-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.ccp-slider-val {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted-foreground, #71717a);
  min-width: 26px;
  text-align: right;
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
