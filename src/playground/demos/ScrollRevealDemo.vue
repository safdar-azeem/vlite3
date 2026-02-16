<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import sourceCode from './ScrollRevealDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Scroll Reveal</h2>
      <p class="text-gray-500">
        Minimal syntax. Auto-detects the scroll container.
      </p>
    </div>

    <DemoSection title="Zero Config" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="n in 3"
          :key="n"
          v-scroll-reveal
          class="p-6 h-32 rounded-lg border border-border bg-card flex items-center justify-center text-lg font-medium shadow-sm"
        >
          Auto Detected
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Simple Directions" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        <div
          v-scroll-reveal="{ origin: 'left', delay: 300 }"
          class="p-6 h-32 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-medium"
        >
          Left
        </div>
        <div
          v-scroll-reveal="{ origin: 'right', delay: 300 }"
          class="p-6 h-32 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-medium"
        >
          Right
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Staggered List" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <div
          v-for="i in 8"
          :key="i"
          v-scroll-reveal="{ delay: i * 50 }"
          class="p-4 rounded border border-border bg-muted/50 flex items-center gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="flex-1 space-y-2">
             <div class="h-2 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
             <div class="h-2 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
