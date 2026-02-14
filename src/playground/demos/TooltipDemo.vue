<script setup lang="ts">
import Tooltip from '@/components/Tooltip.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './TooltipDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Tooltip</h2>
      <p class="text-gray-500">A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.</p>
    </div>

    <DemoSection title="Usage" :code="sourceCode">
      <div class="flex gap-4">
        <Tooltip content="Add to Library">
           <Button variant="ghost" size="sm" icon="lucide:plus" />
        </Tooltip>
        
        <Tooltip content="Delete Item">
           <Button variant="danger" size="sm" icon="lucide:trash" />
        </Tooltip>

        <Tooltip content="This is a much longer tooltip description needed for complex contexts.">
           <Button variant="outline">Hover for details</Button>
        </Tooltip>
      </div>
    </DemoSection>
  </div>
</template>
