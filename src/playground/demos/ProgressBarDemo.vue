<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ProgressBar } from '@/components/ProgressBar'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ProgressBarDemo.vue?raw'

const progress = ref(45)
const buffer = ref(10)
let interval: any

const startSimulation = () => {
  if (interval) clearInterval(interval)
  progress.value = 0
  interval = setInterval(() => {
    progress.value += Math.random() * 10
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
    }
  }, 500)
}

onMounted(() => {
  // Initial simple animation
  setTimeout(() => { progress.value = 75 }, 500)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Progress Bar</h2>
      <p class="text-gray-500">
        Visualize the completion status of a task or process. Supports linear and circular modes.
      </p>
    </div>

    <DemoSection title="Linear Variants" :code="sourceCode">
      <div class="space-y-6 max-w-xl">
        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">Primary</label>
          <ProgressBar :model-value="progress" />
        </div>
        
        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">Success with Label</label>
          <ProgressBar :model-value="80" variant="success" show-value />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">Danger (Striped & Animated)</label>
          <ProgressBar :model-value="60" variant="danger" striped animated />
        </div>
        
        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">Gradient</label>
          <ProgressBar :model-value="90" variant="gradient" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Linear Sizes" :code="sourceCode">
      <div class="space-y-6 max-w-xl">
        <ProgressBar :model-value="40" size="xs" />
        <ProgressBar :model-value="50" size="sm" />
        <ProgressBar :model-value="60" size="md" />
        <ProgressBar :model-value="70" size="lg" />
        <ProgressBar :model-value="80" size="xl" show-value />
        
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">Custom Height (24px)</label>
          <ProgressBar :model-value="55" height="24" show-value label="Custom Height" rounded="rounded-md" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Circular Progress" :code="sourceCode">
      <div class="flex flex-wrap gap-8 items-center">
        <div class="flex flex-col items-center gap-2">
          <ProgressBar type="circular" :model-value="progress" size="md" show-value />
          <span class="text-xs text-muted-foreground">Default</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <ProgressBar type="circular" :model-value="75" variant="success" size="lg" show-value />
          <span class="text-xs text-muted-foreground">Success LG</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <ProgressBar 
            type="circular" 
            :model-value="30" 
            variant="warning" 
            width="100" 
            :stroke-width="8" 
            show-value 
          />
          <span class="text-xs text-muted-foreground">Custom Size/Stroke</span>
        </div>

         <div class="flex flex-col items-center gap-2">
          <ProgressBar 
            type="circular" 
            :model-value="92" 
            color="#6366f1"
            track-color="#e0e7ff"
            size="xl" 
            show-value 
          />
          <span class="text-xs text-muted-foreground">Custom Hex Color</span>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Indeterminate State" :code="sourceCode">
      <div class="space-y-4 max-w-xl">
        <ProgressBar indeterminate variant="primary" />
        <ProgressBar indeterminate variant="info" striped />
      </div>
    </DemoSection>

    <DemoSection title="Interactive Simulation" :code="sourceCode">
      <div class="space-y-4 max-w-xl">
        <div class="flex justify-between text-sm">
          <span>Processing files...</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>
        <ProgressBar :model-value="progress" variant="primary" animated />
        <div class="flex gap-2">
           <Button size="sm" variant="outline" @click="progress = Math.max(0, progress - 10)">-10%</Button>
           <Button size="sm" variant="outline" @click="progress = Math.min(100, progress + 10)">+10%</Button>
           <Button size="sm" @click="startSimulation">Simulate Upload</Button>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
