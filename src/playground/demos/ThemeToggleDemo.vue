<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">ThemeToggle</h2>
      <p class="text-gray-500">A dedicated button to toggle between light and dark modes.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Usage</h3>
      <div class="flex items-center gap-4">
        <ThemeToggle />
        <span class="text-sm text-gray-500">Click to switch theme</span>
      </div>
    </section>
  </div>
</template>
