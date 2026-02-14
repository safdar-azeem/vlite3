<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './Scrollable.vue?raw'

const val1 = ref('0')
</script>

<template>
  <DemoSection title="Scrollable (Many Options)" :code="sourceCode">
    <Dropdown
      :options="
        Array.from({ length: 20 }, (_, i) => ({
          value: `${i}`,
          label: `Option ${i + 1}`,
        }))
      "
      :selected="val1">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:chevron-down">Long List</Button>
      </template>
    </Dropdown>
  </DemoSection>
</template>
