<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import ImageComparison from '@/components/ImageComparison/ImageComparison.vue'
import sourceCode from './ImageComparisonDemo.vue?raw'
import Switch from '@/components/Switch/Switch.vue'
import ChoiceBox from '@/components/ChoiceBox/ChoiceBox.vue'

const showHandle = ref(true)
const variant = ref<'one' | 'two'>('two')
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

    <DemoSection title="Interactive Demo" :code="sourceCode">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4 p-4 border rounded-xl bg-muted/30">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Variant:</span>
              <div class="flex gap-2">
                <label class="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input type="radio" v-model="variant" value="one" class="accent-primary" />
                  One
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input type="radio" v-model="variant" value="two" class="accent-primary" />
                  Two
                </label>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Show Handle:</span>
              <input type="checkbox" v-model="showHandle" class="accent-primary w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

        <div class="max-w-md mx-auto w-full relative bg-[#242526] overflow-hidden rounded-xl">
          <ImageComparison
            beforeImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-before.webp"
            afterImage="https://cdn.qoves.com/static/landing/images/home/hero/woman-after.webp"
            :variant="variant"
            :showHandle="showHandle" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Standard Comparison" :code="sourceCode">
      <div class="flex flex-col gap-5">
        <p class="text-sm text-muted-foreground">
          The default configuration provides a clean, elegant slider with fluid interactions and
          natural aspect ratio sizing.
        </p>
        <div class="max-w-md mx-auto w-full relative bg-[#242526] overflow-hidden rounded-xl">
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
