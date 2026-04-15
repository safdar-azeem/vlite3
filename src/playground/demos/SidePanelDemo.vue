<script setup lang="ts">
import SidePanelPositions from './sidepanel/SidePanelPositions.vue'
import SidePanelScrollable from './sidepanel/SidePanelScrollable.vue'
import SidePanelSizes from './sidepanel/SidePanelSizes.vue'
import SidePanelLazy from './sidepanel/SidePanelLazy.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col space-y-2 pb-6 mb-2 border-b border-border/30">
      <h2 class="text-3xl font-bold tracking-tight text-foreground">SidePanel</h2>
      <p class="text-base text-muted-foreground max-w-[800px]">
        A panel that slides in from the left or right edge of the screen. Supports lazy-loaded
        bodies, all sizes, and a fixed header/footer with a scrollable body.
      </p>
    </div>

    <SidePanelPositions />
    <SidePanelScrollable />
    <SidePanelSizes />
    <SidePanelLazy />
  </div>
</template>
