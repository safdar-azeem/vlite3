<script setup lang="ts">
import Tooltip from '@/components/Tooltip.vue'
import Button from '@/components/Button.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Tooltip</h2>
      <p class="text-gray-500">A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Usage</h3>
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
    </section>
  </div>
</template>
