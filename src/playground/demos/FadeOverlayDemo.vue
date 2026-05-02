<script setup lang="ts">
import { FadeOverlay } from '@/index'
import DemoSection from '../DemoSection.vue'
import sourceCode from './FadeOverlayDemo.vue?raw'
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold">Fade Overlay</h1>
      <p class="text-muted-foreground">
        A configurable gradient overlay component used for fade effects on edges of containers.
      </p>
    </div>

    <DemoSection title="Bottom Fade (Default)" description="Fades out content at the bottom of the container." :code="sourceCode">
      <div class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4">
        <p class="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="bottom" coverage="50%" />
      </div>
    </DemoSection>

    <DemoSection title="Top Fade" description="Fades out content at the top of the container." :code="sourceCode">
      <div class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4 flex items-end">
        <p class="text-sm pb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="top" coverage="40%" />
      </div>
    </DemoSection>

    <DemoSection title="Right Fade" description="Useful for horizontally scrollable lists." :code="sourceCode">
      <div class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden">
          <div v-for="i in 10" :key="i" class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="right" coverage="30%" />
      </div>
    </DemoSection>
    
    <DemoSection title="Left Fade" description="Fades out content at the left edge." :code="sourceCode">
      <div class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden justify-end">
          <div v-for="i in 10" :key="i" class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="left" coverage="40%" />
      </div>
    </DemoSection>
  </div>
</template>
