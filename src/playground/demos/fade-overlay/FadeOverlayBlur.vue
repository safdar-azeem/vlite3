<script setup lang="ts">
import { ref, computed } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'

const blurAmount = ref(40)
const blurTintOpacity = ref(0.5)
const blurColor = ref('#000000')

const blurVariantLabel = computed(() => {
  if (blurTintOpacity.value === 0) return 'Pure vibrancy (macOS)'
  if (blurTintOpacity.value <= 0.3) return 'Frosted glass (iOS)'
  return 'Cinematic dark'
})
</script>

<template>
  <div class="flex flex-col">
    <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3 flex flex-wrap gap-1">
      03 — Frosted glass
      <span class="text-muted-foreground/60 font-normal normal-case tracking-normal ml-1">
        {{ blurVariantLabel }}
      </span>
    </p>
    <div class="relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-900 group">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
        alt="Forest"
        class="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105" />

      <FadeOverlay
        direction="bottom"
        coverage="70%"
        :blur="+blurAmount"
        :tintOpacity="blurTintOpacity"
        :color="blurColor"
        easing="smooth" />

      <!-- Card text -->
      <div class="absolute bottom-0 inset-x-0 p-6 z-20 pointer-events-none text-[white]">
        <p class="m-0 mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[white]/50">
          Nature reserve
        </p>
        <h2 class="m-0 mb-2.5 text-[22px] font-bold leading-[1.2] text-[white]">
          Pacific Forest Trail
        </h2>
        <div class="flex gap-3.5 items-center">
          <span class="text-[13px] text-[white]/70">⏱ 4 hours</span>
          <span class="text-[13px] text-[white]/70">★ 4.6 / 5</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 flex flex-col gap-2.5">
      <label class="text-xs text-muted-foreground flex justify-between">
        blur
        <span class="text-muted-foreground/60">{{ blurAmount }}px</span>
      </label>
      <input type="range" min="4" max="40" v-model="blurAmount" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        tintOpacity
        <span class="text-muted-foreground/60">{{ blurTintOpacity }}</span>
      </label>
      <input
        type="range"
        min="0"
        max="0.8"
        step="0.05"
        v-model="blurTintOpacity"
        class="w-full" />

      <div class="flex items-center gap-2">
        <label class="text-xs text-muted-foreground">tint color</label>
        <input
          type="color"
          v-model="blurColor"
          class="w-12 h-7 border-0 bg-transparent cursor-pointer rounded" />
      </div>
    </div>
  </div>
</template>
