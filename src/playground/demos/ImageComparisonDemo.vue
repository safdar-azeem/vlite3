<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import ImageComparison from '@/components/ImageComparison/ImageComparison.vue'
import sourceCode from './ImageComparisonDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-4">
      <h2 class="text-3xl font-bold tracking-tight">Image Comparison</h2>
      <p class="text-muted-foreground text-lg max-w-3xl">
        A highly optimized before/after slider component to showcase visual differences. Perfect for
        AI generation apps, photo editing features, and portfolio showcases. Built with multi-touch
        support and GPU-accelerated smooth animations.
      </p>
    </div>

    <DemoSection title="Standard Comparison" :code="sourceCode">
      <div class="flex flex-col gap-5">
        <p class="text-sm text-muted-foreground">
          The default configuration provides a clean, elegant slider with fluid interactions and
          natural aspect ratio sizing.
        </p>
        <div class="max-w-md mx-auto w-full relative bg-[#242526] overflow-hidden rounded-xl">
          <!-- Subtle decorative blob for the "WOW" factor -->
          <ImageComparison
            beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-before.webp"
            afterImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-after.webp" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Hover Interaction" :code="sourceCode">
      <div class="flex flex-col gap-5">
        <p class="text-sm text-muted-foreground">
          Set <code>:hover="true"</code> to allow users to slide simply by moving their cursor over
          the image. Perfect for quick exploration.
        </p>
        <div class="max-w-md mx-auto w-full relative bg-[#B2C1C8] overflow-hidden rounded-xl">
          <ImageComparison
            beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/man-before.webp"
            afterImage="https://cdn.qoves.com/static/landing/images/home/hero/man-after.webp"
            :hover="true"
            beforeLabel="Raw Capture"
            afterLabel="AI Enhanced" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
