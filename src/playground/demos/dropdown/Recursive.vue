<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './Recursive.vue?raw'

const config = ref<Record<string, any>>({
  size: '2',
  style: 'border',
})

const recursiveOptions = [
  {
    label: 'Display',
    key: 'display',
    value: 'grid',
  },
  {
    label: 'Size',
    key: 'size',
    children: [
      { label: 'Small (1)', value: '1' },
      { label: 'Medium (2)', value: '2' },
      { label: 'Large (3)', value: '3' },
    ],
  },
  {
    label: 'Style',
    key: 'style',
    children: [
      { label: 'Border', value: 'border' },
      { label: 'Fill', value: 'fill' },
      { label: 'Ghost', value: 'ghost' },
    ],
  },
  { label: '---', value: 'divider' },
  {
    label: 'Stash',
    key: 'stash',
    children: [
      { label: 'Apply', value: 'apply' },
      {
        label: 'Advanced',
        key: 'advanced',
        children: [
          {
            label: 'Delete Branch',
            value: 'delete-branch',
            class: 'text-danger',
          },
          { label: 'Force Push', value: 'force-push' },
        ],
      },
    ],
  },
]

const reset = () => {
  config.value = {}
}

const injectState = () => {
  // Simulate external update
  config.value = {
    size: '3',
    stash: { advanced: 'force-push' },
  }
}
</script>

<template>
  <DemoSection title="Recursive Form (v-model)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Demonstrating recursive state management with
      <code>v-model</code>. Supports deep merging, toggling, and static trigger labels.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border p-4 rounded-lg bg-gray-50/50">
      <!-- Controls -->
      <div class="space-y-4">
        <h4 class="font-medium text-sm">Configuration Menu</h4>
        <Dropdown
          v-model:modelValue="config"
          :options="recursiveOptions"
          width="w-56"
          :close-on-select="false"
          :show-selected-label="false">
          <template #trigger="{ selectedLabel }">
            <Button
              :text="selectedLabel || 'Configure View'"
              variant="outline"
              class="w-56 justify-between font-normal"
              icon-right="lucide:chevron-down" />
          </template>
        </Dropdown>

        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="reset">Reset State</Button>
          <Button variant="outline" size="sm" @click="injectState">Inject State</Button>
        </div>
      </div>

      <!-- Live State -->
      <div
        class="space-y-2 p-4 bg-gray-900 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
        <div class="text-xs text-gray-500 uppercase font-semibold">Live State (modelValue)</div>
        <pre>{{ JSON.stringify(config, null, 2) }}</pre>
      </div>
    </div>
  </DemoSection>
</template>
