<script setup lang="ts">
import ToastNotification from '@/components/ToastNotification.vue'
import ToastGlobal from './toast/ToastGlobal.vue'
import ToastPositions from './toast/ToastPositions.vue'
import ToastFeatures from './toast/ToastFeatures.vue'
</script>

<template>
  <div class="space-y-10">
    <!-- Ensure the global provider is present for the demo -->
    <ToastNotification />

    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Toast Notification</h2>
      <p class="text-gray-500">Global notification system with stacked layout and animations.</p>
    </div>

    <ToastGlobal />
    <ToastPositions />
    <ToastFeatures />
  </div>
</template>
