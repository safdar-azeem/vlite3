<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import ImageComparison from '@/components/ImageComparison/ImageComparison.vue'
import sourceCode from './ImageComparisonDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Image Comparison</h2>
      <p class="text-gray-500">
        A premium before/after slider component to showcase visual differences, especially useful for AI applications and photo editing features.
      </p>
    </div>

    <DemoSection title="Standard Comparison" :code="sourceCode">
      <div class="max-w-3xl mx-auto w-full">
        <ImageComparison 
          beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-before.webp"
          afterImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-after.webp"
        />
      </div>
    </DemoSection>

    <DemoSection title="Hover to Slide" :code="sourceCode">
      <div class="max-w-3xl mx-auto w-full">
        <ImageComparison 
          beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/man-before.webp"
          afterImage="https://cdn.qoves.com/static/landing/images/home/hero/man-after.webp"
          :hover="true"
        />
      </div>
    </DemoSection>

    <DemoSection title="Custom Initial Position & Labels" :code="sourceCode">
      <div class="max-w-3xl mx-auto w-full">
        <ImageComparison 
          beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-before.webp"
          afterImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-after.webp"
          beforeLabel="Original"
          afterLabel="Enhanced"
          :initialPosition="25"
        />
      </div>
    </DemoSection>
  </div>
</template>
