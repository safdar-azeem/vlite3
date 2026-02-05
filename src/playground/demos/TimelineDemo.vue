<script setup lang="ts">
import Timeline from '@/components/Timeline.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'

const activeStep = ref(1)
const steps = [
  { id: 1, title: 'Ordered', icon: 'lucide:shopping-cart' },
  { id: 2, title: 'Processing', icon: 'lucide:settings' },
  { id: 3, title: 'Shipped', icon: 'lucide:truck' },
  { id: 4, title: 'Delivered', icon: 'lucide:check' },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Timeline</h2>
      <p class="text-gray-500">Visualizes a sequence of events or steps.</p>
    </div>

    <section class="space-y-4">
      <div class="flex items-center justify-between max-w-2xl">
         <h3 class="text-lg font-semibold">Horizontal</h3>
         <div class="flex gap-2">
            <Button size="sm" variant="outline" :disabled="activeStep <= 0" @click="activeStep--">Prev</Button>
            <Button size="sm" variant="outline" :disabled="activeStep >= steps.length" @click="activeStep++">Next</Button>
         </div>
      </div>
      
      <div class="p-6 border rounded-lg max-w-2xl">
        <Timeline :steps="steps" :active-step="activeStep" />
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Vertical</h3>
       <div class="p-6 border rounded-lg max-w-xs">
        <Timeline :steps="steps" :active-step="activeStep" direction="vertical" />
      </div>
    </section>
  </div>
</template>
