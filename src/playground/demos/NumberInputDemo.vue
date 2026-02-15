<script setup lang="ts">
import NumberInput from '@/components/NumberInput.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './NumberInputDemo.vue?raw'

const val = ref(10)
const minMaxVal = ref(5)
const stepVal = ref(0)
const stackedVal = ref(20)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Number Input</h2>
      <p class="text-gray-500">A component for numeric input with increment/decrement controls.</p>
    </div>

    <!-- Variants -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-sm font-medium">Split (Default)</label>
          <NumberInput v-model="val" variant="split" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Stacked</label>
          <NumberInput v-model="stackedVal" variant="stacked" />
        </div>
      </div>
    </DemoSection>

    <!-- Styles -->
    <DemoSection title="Styles" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Outline</label>
          <NumberInput mode="outline" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Solid</label>
          <NumberInput mode="solid" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Ghost</label>
          <NumberInput mode="ghost" />
        </div>
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">XS</span>
          <NumberInput size="xs" placeholder="xs" class="max-w-[150px]" />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Small</span>
          <NumberInput size="sm" placeholder="sm" class="max-w-[150px]" />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Medium</span>
          <NumberInput size="md" placeholder="md" class="max-w-[150px]" />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Large</span>
          <NumberInput size="lg" placeholder="lg" class="max-w-[150px]" />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">XL</span>
          <NumberInput size="xl" placeholder="xl" class="max-w-[150px]" />
        </div>
      </div>
    </DemoSection>

    <!-- Constraints -->
    <DemoSection title="Constraints (Min 0, Max 10, Step 2)" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput v-model="minMaxVal" :min="0" :max="10" :step="2" />
      </div>
      <div class="mt-2 text-sm text-gray-500">Current Value: {{ minMaxVal }}</div>
    </DemoSection>

    <!-- States -->
    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Disabled</label>
          <NumberInput disabled :model-value="42" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Readonly</label>
          <NumberInput readonly :model-value="100" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
