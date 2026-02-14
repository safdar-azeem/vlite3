<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ThemeToggleDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">ThemeToggle</h2>
      <p class="text-gray-500">A dedicated button to toggle between light and dark modes.</p>
    </div>

    <DemoSection title="Usage" :code="sourceCode">
      <div class="flex items-center gap-4">
        <ThemeToggle />
        <span class="text-sm text-gray-500">Click to switch theme</span>
      </div>
    </DemoSection>
  </div>
</template>
