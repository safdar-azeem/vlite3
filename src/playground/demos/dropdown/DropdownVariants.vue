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
    <div class="flex flex-wrap items-center gap-4">
      <!-- Default/Outline -->
      <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
        <template #trigger>
          <Button variant="outline" size="sm" icon-right="lucide:chevron-down">Outline (sm)</Button>
        </template>
      </Dropdown>

      <!-- Solid/Primary -->
      <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
        <template #trigger>
          <Button variant="primary" icon-right="lucide:chevron-down">Primary</Button>
        </template>
      </Dropdown>

      <!-- Ghost -->
      <Dropdown :options="[{ value: 1, label: 'Option 1' }]" :selected="val1">
        <template #trigger>
          <Button variant="ghost" icon-right="lucide:chevron-down">Ghost</Button>
        </template>
      </Dropdown>
    </div>
  </DemoSection>
</template>
