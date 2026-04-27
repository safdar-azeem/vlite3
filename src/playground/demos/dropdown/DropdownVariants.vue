<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DropdownVariants.vue?raw'

const val1 = ref(1)
</script>

<template>
  <DemoSection title="Variants & Sizes" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-3">Trigger Variants</h4>
        <div class="flex flex-wrap items-center gap-4">
          <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
            <template #trigger>
              <Button variant="outline" size="sm" icon-right="lucide:chevron-down">Outline (sm)</Button>
            </template>
          </Dropdown>

          <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
            <template #trigger>
              <Button variant="primary" icon-right="lucide:chevron-down">Primary</Button>
            </template>
          </Dropdown>

          <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
            <template #trigger>
              <Button variant="ghost" icon-right="lucide:chevron-down">Ghost</Button>
            </template>
          </Dropdown>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-3">Dropdown Menu Variants</h4>
        <div class="flex flex-wrap items-center gap-4">
          <Dropdown :options="[{ value: 1, label: 'Default Menu Item' }]" :selected="val1" variant="default">
            <template #trigger>
              <Button variant="outline" icon-right="lucide:chevron-down">Default</Button>
            </template>
          </Dropdown>

          <Dropdown :options="[{ value: 1, label: 'Secondary Menu Item' }]" :selected="val1" variant="secondary">
            <template #trigger>
              <Button variant="outline" icon-right="lucide:chevron-down">Secondary</Button>
            </template>
          </Dropdown>

          <Dropdown :options="[{ value: 1, label: 'Transparent Menu Item' }]" :selected="val1" variant="transparent">
            <template #trigger>
              <Button variant="outline" icon-right="lucide:chevron-down">Transparent</Button>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
