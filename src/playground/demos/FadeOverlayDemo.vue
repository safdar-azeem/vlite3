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

    <DemoSection
      title="Customization & Increased Opacity"
      description="You can adjust the fade stops and overall opacity for a stronger effect."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4">
        <p class="text-sm">
          Sometimes a standard linear gradient doesn't block enough text at the edges, making it
          hard to read. By pulling back the fadeEnd value to '70%', we create a larger solid-color
          area at the bottom that provides a stronger fade effect.
          <br /><br />
          More text here to demonstrate the fade overlay hiding the content. Notice how the bottom
          part is completely solid, offering a better fading experience!
        </p>
        <FadeOverlay direction="bottom" coverage="60%" fadeStart="10%" fadeEnd="70%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Custom Colors & Blend Modes"
      description="Create stylistic effects with custom colors and blend modes."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000')] bg-cover bg-center">
        <div class="absolute inset-0 flex flex-col justify-end p-4 z-20">
          <h3 class="text-[white] font-bold text-xl">Beautiful Landscape</h3>
          <p class="text-[#bababa] text-sm">
            A customized fade overlay makes text pop over images.
          </p>
        </div>
        <FadeOverlay
          direction="bottom"
          coverage="80%"
          color="#000000"
          opacity="0.9"
          fadeEnd="80%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Blurred Glassmorphism"
      description="Set blur to true (or a px value) to create a premium frosted-glass fade effect."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <!-- Background Pattern to showcase blur -->
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_1px,_transparent_1px)] bg-[length:16px_16px] opacity-20"></div>

        <p class="text-sm font-medium relative z-0">
          Scroll down to see the blur... <br /><br />
          This text and the dotted background will be smoothly blurred out at the bottom. This
          effect uses a mask-image combined with a backdrop-filter to ensure the blur doesn't have a
          harsh edge!
        </p>

        <FadeOverlay direction="bottom" coverage="70%" blur="8px" />
      </div>
    </DemoSection>
  </div>
</template>
