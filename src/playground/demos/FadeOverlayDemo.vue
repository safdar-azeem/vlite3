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
    <div>
      <h3>Interactive Examples</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <FadeOverlayScrim />
        <FadeOverlayScroll />
        <FadeOverlayBlur />
      </div>
    </div>

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
      description="Useful for horizontally scrollable lists and carousels."
      :code="sourceCode">
      <div
        class="relative w-full max-w-lg h-36 bg-card rounded-xl overflow-hidden border border-border flex items-center">
        <div class="flex gap-3 whitespace-nowrap overflow-hidden px-5">
          <div
            v-for="i in 12"
            :key="i"
            class="w-24 h-24 bg-secondary rounded-xl shrink-0 flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-secondary/80">
            <span class="text-xl">{{
              ['🏔', '🌲', '🦅', '💎', '⚡', '🌿', '🐺', '🧊', '⛰', '🦊', '💧', '⭐'][i - 1]
            }}</span>
            <span class="text-[10px] text-muted-foreground font-medium">Trail {{ i }}</span>
          </div>
        </div>
        <FadeOverlay direction="right" coverage="25%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Left Fade"
      description="Mirror of the right fade — perfect for RTL contexts or content flowing from the right."
      :code="sourceCode">
      <div
        class="relative w-full max-w-lg h-36 bg-card rounded-xl overflow-hidden border border-border flex items-center">
        <div class="flex gap-3 whitespace-nowrap overflow-hidden justify-end px-5">
          <div
            v-for="i in 12"
            :key="i"
            class="w-24 h-24 bg-secondary rounded-xl shrink-0 flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-secondary/80">
            <span class="text-xl">{{
              ['🏔', '🌲', '🦅', '💎', '⚡', '🌿', '🐺', '🧊', '⛰', '🦊', '💧', '⭐'][i - 1]
            }}</span>
            <span class="text-[10px] text-muted-foreground font-medium">Trail {{ i }}</span>
          </div>
        </div>
        <FadeOverlay direction="left" coverage="30%" />
      </div>
    </DemoSection>
  </div>
</template>
