<script setup lang="ts">
/**
 * FadeOverlayDemo.vue
 * Shows all use cases with live controls and static examples.
 */
import { FadeOverlay } from '@/components/FadeOverlay'
import DemoSection from '../DemoSection.vue'
import sourceCode from './FadeOverlayDemo.vue?raw'

import FadeOverlayScrim from './fade-overlay/FadeOverlayScrim.vue'
import FadeOverlayScroll from './fade-overlay/FadeOverlayScroll.vue'
import FadeOverlayBlur from './fade-overlay/FadeOverlayBlur.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">FadeOverlay</h2>
      <p class="text-muted-foreground">
        A versatile overlay component for smooth scrims, scroll-edge fades, and frosted glass
        effects.
      </p>
    </div>

    <!-- ── INTERACTIVE DEMOS ────────────────────────────────────────────────── -->
    <DemoSection
      title="Interactive Examples"
      description="Play with coverage, blur, and opacity."
      :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <FadeOverlayScrim />
        <FadeOverlayScroll />
        <FadeOverlayBlur />
      </div>
    </DemoSection>

    <DemoSection
      title="Bottom Fade (Default)"
      description="Fades out content at the bottom of the container."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4">
        <p class="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="bottom" coverage="50%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Top Fade"
      description="Fades out content at the top of the container."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4 flex items-end">
        <p class="text-sm pb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="top" coverage="40%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Right Fade"
      description="Useful for horizontally scrollable lists."
      :code="sourceCode">
      <div
        class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden">
          <div
            v-for="i in 10"
            :key="i"
            class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="right" coverage="30%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Left Fade"
      description="Fades out content at the left edge."
      :code="sourceCode">
      <div
        class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden justify-end">
          <div
            v-for="i in 10"
            :key="i"
            class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="left" coverage="40%" />
      </div>
    </DemoSection>
  </div>
</template>
