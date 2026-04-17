<script setup lang="ts">
import { FilePicker } from '@/components/FilePicker'
import DemoSection from '../../DemoSection.vue'
// @ts-ignore
import sourceCode from './StatesDemo.vue?raw'
</script>

<!-- @demo-snippet States -->
<template>
  <DemoSection title="States" :code="sourceCode">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Disabled</p>
        <FilePicker disabled />
      </div>
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Loading</p>
        <FilePicker loading />
      </div>
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Disabled (input)</p>
        <FilePicker variant="input" disabled placeholder="Cannot interact" />
      </div>
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-1.5">Loading (input)</p>
        <FilePicker variant="input" loading />
      </div>
    </div>
  </DemoSection>
</template>
