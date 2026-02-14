<script setup lang="ts">
import SidePanelPositions from './sidepanel/SidePanelPositions.vue'
import SidePanelSizes from './sidepanel/SidePanelSizes.vue'
import SidePanelLazy from './sidepanel/SidePanelLazy.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">SidePanel</h2>
      <p class="text-gray-500">A panel that slides in from the edge of the screen.</p>
    </div>

    <SidePanelPositions />
    <SidePanelSizes />
    <SidePanelLazy />
  </div>
</template>
